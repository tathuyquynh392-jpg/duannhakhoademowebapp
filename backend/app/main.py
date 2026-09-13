from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import engine, Base
from app.routers import (
    auth, patients, doctors, chairs, schedules,
    appointments, services, treatment_plans, treatment_records,
    treatment_images, invoices, payments, follow_ups, statistics, ai
)

# Initialize Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Lucky Dental Management System API",
    description="Hệ thống Quản lý Nha khoa Lucky Dental Tích hợp AI Assistant",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for Frontend React Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(doctors.router)
app.include_router(chairs.router)
app.include_router(schedules.router)
app.include_router(appointments.router)
app.include_router(services.router)
app.include_router(treatment_plans.router)
app.include_router(treatment_records.router)
app.include_router(treatment_images.router)
app.include_router(invoices.router)
app.include_router(payments.router)
app.include_router(follow_ups.router)
app.include_router(statistics.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {
        "app": "Lucky Dental Management API",
        "status": "online",
        "docs": "/docs"
    }
