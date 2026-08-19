import os
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from dotenv import load_dotenv
from utils.logger import get_logger

load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))
logger = get_logger("mongodb")

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "aegis_soc")

_mongo_client: MongoClient | None = None

def get_mongo_client() -> MongoClient:
    """
    Initializes and returns a singleton MongoClient instance.
    """
    global _mongo_client
    if _mongo_client is None:
        try:
            _mongo_client = MongoClient(
                MONGODB_URL,
                serverSelectionTimeoutMS=3000,
                connectTimeoutMS=3000
            )
        except Exception as e:
            logger.error(f"Failed to initialize MongoDB client: {e}")
            raise
    return _mongo_client

def get_mongo_db() -> Database:
    """
    Returns the AegisSOC MongoDB database handle.
    """
    client = get_mongo_client()
    return client[MONGODB_DATABASE]

def check_mongo_connection() -> dict:
    """
    Validates MongoDB connectivity for health checks.
    """
    try:
        client = get_mongo_client()
        # Ping the server
        client.admin.command('ping')
        return {
            "status": "connected",
            "database": MONGODB_DATABASE,
            "url": MONGODB_URL
        }
    except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
        logger.warning(f"MongoDB ping failed: {e}")
        return {
            "status": "disconnected",
            "error": str(e),
            "database": MONGODB_DATABASE
        }

# Collection accessors
def get_raw_events_collection():
    return get_mongo_db()["raw_security_events"]

def get_threat_intel_collection():
    return get_mongo_db()["threat_intelligence"]

def get_ai_analysis_collection():
    return get_mongo_db()["ai_analysis_logs"]
