import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import inspect, desc, asc, text
from database.connection import get_db, engine
from database.mongodb import check_mongo_connection
from routes.auth import get_optional_current_user
from models.user import User
from models.alert import Alert
from models.incident import Incident
from models.security_event import SecurityEvent
from models.response_action import ResponseAction
from models.activity_log import ActivityLog
from models.report import Report
from models.agent import Agent
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/admin/database", tags=["Database Administration"])

DEV_MODE = os.getenv("DEV_MODE", "true").lower() == "true"

MODEL_MAP = {
    "users": User,
    "alerts": Alert,
    "incidents": Incident,
    "security_events": SecurityEvent,
    "response_actions": ResponseAction,
    "activity_logs": ActivityLog,
    "reports": Report,
    "agents": Agent
}

def verify_dev_mode():
    if not DEV_MODE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Database Admin features are disabled in production mode."
        )

@router.get("/status")
def get_db_status(db: Session = Depends(get_db), current_user: Any = Depends(get_optional_current_user)):
    """
    Returns unified health check for PostgreSQL and MongoDB.
    """
    verify_dev_mode()

    # 1. Check PostgreSQL Connection using SQLAlchemy 2.0 text()
    try:
        db.execute(text("SELECT 1"))
        pg_status = "connected"
    except Exception as e:
        pg_status = f"disconnected: {str(e)}"

    # 2. Check MongoDB Connection
    mongo_health = check_mongo_connection()
    mongo_status = mongo_health.get("status", "disconnected")

    # 3. Overall status
    overall_status = "healthy" if (pg_status == "connected" and mongo_status == "connected") else "degraded"
    if pg_status != "connected":
        overall_status = "offline"

    db_url = engine.url
    sanitized_pg_url = f"{db_url.drivername}://{db_url.username or 'postgres'}@{db_url.host or 'localhost'}:{db_url.port or '5432'}/{db_url.database or 'aegis_soc'}"

    # Get counts of all mapped tables
    table_counts = {}
    if pg_status == "connected":
        for name, model in MODEL_MAP.items():
            try:
                table_counts[name] = db.query(model).count()
            except Exception:
                table_counts[name] = 0

    return {
        "status": "online" if pg_status == "connected" else "offline",
        "overall_status": overall_status,
        "postgresql": pg_status,
        "mongodb": mongo_status,
        "mongodb_database": mongo_health.get("database", "aegis_soc"),
        "connection_status": f"PostgreSQL: {pg_status} | MongoDB: {mongo_status}",
        "database_type": db_url.drivername,
        "database_name": db_url.database,
        "connection_url": sanitized_pg_url,
        "table_count": len(MODEL_MAP),
        "counts": table_counts
    }

@router.get("/tables")
def get_db_tables(db: Session = Depends(get_db), current_user: Any = Depends(get_optional_current_user)):
    """
    Lists all inspectable tables, their schemas, and row counts.
    """
    verify_dev_mode()

    tables_info = []
    for table_name, model in MODEL_MAP.items():
        try:
            row_count = db.query(model).count()
        except Exception:
            row_count = 0

        mapper = inspect(model)
        columns = []
        for name, column in mapper.columns.items():
            columns.append({
                "name": name,
                "type": str(column.type),
                "nullable": column.nullable,
                "primary_key": column.primary_key
            })

        tables_info.append({
            "table_name": table_name,
            "row_count": row_count,
            "columns": columns
        })

    return tables_info

@router.get("/tables/{table_name}")
def get_table_data(
    table_name: str,
    page: int = 1,
    limit: int = 20,
    search: str = None,
    sort_by: str = None,
    sort_order: str = "desc",
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_optional_current_user)
):
    """
    Returns paginated, searchable, and sortable records from a specified table.
    """
    verify_dev_mode()

    if table_name not in MODEL_MAP:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Table '{table_name}' not found or is not inspectable."
        )

    model = MODEL_MAP[table_name]
    query = db.query(model)

    mapper = inspect(model)
    column_names = list(mapper.columns.keys())

    # Text search
    searchable_columns = []
    for name, col in mapper.columns.items():
        col_type = str(col.type).lower()
        if "varchar" in col_type or "text" in col_type or "string" in col_type:
            searchable_columns.append(col)

    if search and searchable_columns:
        search_filter = None
        for col in searchable_columns:
            condition = col.like(f"%{search}%")
            if search_filter is None:
                search_filter = condition
            else:
                search_filter = search_filter | condition
        query = query.filter(search_filter)

    # Sorting
    if sort_by and sort_by in column_names:
        sort_column = getattr(model, sort_by)
        if sort_order.lower() == "asc":
            query = query.order_by(asc(sort_column))
        else:
            query = query.order_by(desc(sort_column))
    else:
        pk_names = [key.name for key in mapper.primary_key]
        if pk_names:
            query = query.order_by(desc(getattr(model, pk_names[0])))

    total_count = query.count()
    offset = (page - 1) * limit
    records = query.offset(offset).limit(limit).all()

    # Strip passwords
    serialized_records = []
    for record in records:
        record_dict = {}
        for col in column_names:
            if col in ["password_hash", "hashed_password", "password"]:
                continue
            val = getattr(record, col)
            if hasattr(val, "isoformat"):
                record_dict[col] = val.isoformat()
            else:
                record_dict[col] = val
        serialized_records.append(record_dict)

    columns_schema = []
    for name, column in mapper.columns.items():
        if name in ["password_hash", "hashed_password", "password"]:
            continue
        columns_schema.append({
            "name": name,
            "type": str(column.type),
            "primary_key": column.primary_key
        })

    return {
        "table_name": table_name,
        "total_records": total_count,
        "page": page,
        "limit": limit,
        "pages": (total_count + limit - 1) // limit if limit > 0 else 1,
        "columns": columns_schema,
        "records": serialized_records
    }

@router.get("/tables/{table_name}/count")
def get_table_row_count(table_name: str, db: Session = Depends(get_db), current_user: Any = Depends(get_optional_current_user)):
    verify_dev_mode()
    if table_name not in MODEL_MAP:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Table '{table_name}' not found."
        )
    model = MODEL_MAP[table_name]
    return {
        "table_name": table_name,
        "count": db.query(model).count()
    }
