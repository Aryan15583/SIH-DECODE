import os
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database.connection import engine, Base
import models # ensure models are registered
from routes import auth, dashboard, alerts, incidents, events, threats, responses, database_admin
from services.orchestration import OrchestrationSimulationService
from utils.logger import get_logger

logger = get_logger("main")

# Auto-create PostgreSQL database tables on startup
logger.info("Initializing PostgreSQL database schemas...")
try:
    Base.metadata.create_all(bind=engine)
    logger.info("PostgreSQL database tables verified and created successfully.")
except Exception as e:
    logger.error(f"Error creating PostgreSQL database tables: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the background SOC threat & agent simulation loop
    sim_task = asyncio.create_task(OrchestrationSimulationService.start_simulation_loop())
    yield
    # Cancel task on shutdown
    sim_task.cancel()
    try:
        await sim_task
    except asyncio.CancelledError:
        pass

# Initialize FastAPI application
app = FastAPI(
    title="AegisSOC AI Autonomous SOC Backend",
    description="FastAPI Backend for AI-powered autonomous Threat Detection, Alert Correlation, and safe response simulation.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Static files directory for reports
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(os.path.join(static_dir, "reports"), exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Configure CORS for Frontend Integration
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5173"
]

frontend_env = os.getenv("FRONTEND_URL")
if frontend_env:
    allowed_origins.append(frontend_env.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(alerts.router)
app.include_router(incidents.router)
app.include_router(events.router)
app.include_router(threats.router)
app.include_router(responses.router)
app.include_router(database_admin.router)

@app.get("/", tags=["General"])
def read_root():
    return {
        "status": "online",
        "service": "AegisSOC AI Backend",
        "databases": {
            "relational": "PostgreSQL",
            "document_store": "MongoDB"
        },
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8000"))
    logger.info(f"Starting server on {host}:{port}...")
    uvicorn.run("main:app", host=host, port=port, reload=True)
