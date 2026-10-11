# backend/main.py
import asyncio
import random
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from schemas import UserLogin, TokenResponse, IncidentReport
from security import hash_password, verify_password, create_access_token, verify_token

# 1. Inisialisasi FastAPI & Rate Limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# 2. Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock DB User
MOCK_USER_DB = {
    "admin": hash_password("admin123")
}

# Mock Data Incident Feed dari DeepSeek & LKHG Pipeline (XCMG Heavy Equipment)
MOCK_INCIDENTS = [
    {
        "id": "INC-001",
        "timestamp": "2026-09-18T10:30:00Z",
        "equipment_id": "XCMG-XC968-EV",
        "title": "Inverter Phase Thermal Surge & Overcurrent",
        "severity": "CRITICAL",
        "root_cause": "Dual-Inverter SiC Module Thermal Stress & Phase Current Imbalance",
        "oem_part": "XCMG-803190112-INVERTER",
        "confidence_score": 0.96
    },
    {
        "id": "INC-002",
        "timestamp": "2026-09-18T11:15:00Z",
        "equipment_id": "XCMG-XE370E",
        "title": "Hydraulic Main Relief Valve Micro-leakage",
        "severity": "HIGH",
        "root_cause": "Proportional Relief Valve Seat Cavitation & Pressure Drop",
        "oem_part": "XCMG-803164921-VALVE",
        "confidence_score": 0.91
    },
    {
        "id": "INC-003",
        "timestamp": "2026-09-18T12:00:00Z",
        "equipment_id": "XCMG-XDR80TE",
        "title": "Battery Pack Thermal Gradient Alert",
        "severity": "MEDIUM",
        "root_cause": "Cell Module #4 Thermal Balancing Deviation (> 4.8°C)",
        "oem_part": "XCMG-803588210-BMS-MOD",
        "confidence_score": 0.85
    },
    {
        "id": "INC-004",
        "timestamp": "2026-09-18T12:10:00Z",
        "equipment_id": "XCMG-XC958-EV",
        "title": "Hydraulic Cylinder Wiper Seal Wear",
        "severity": "LOW",
        "root_cause": "Dust Ingress & Wiper Packing Degradation",
        "oem_part": "XCMG-803172044-SEAL",
        "confidence_score": 0.79
    }
]

# --- Endpoints ---

@app.post("/api/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def login(request: Request, user_data: UserLogin):
    stored_hash = MOCK_USER_DB.get(user_data.username)
    if not stored_hash or not verify_password(user_data.password, stored_hash):
        raise HTTPException(status_code=401, detail="Username atau password salah")
    
    token = create_access_token({"sub": user_data.username})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/incidents", response_model=list[IncidentReport])
async def get_incident_feed():
    return MOCK_INCIDENTS

# Endpoint Ingest Telemetri HIL dari ESP32 / Gateway IoT
LATEST_TELEMETRY = {}

@app.post("/api/telemetry")
async def ingest_telemetry(payload: dict):
    global LATEST_TELEMETRY
    LATEST_TELEMETRY = payload
    return {"status": "success", "received": payload}

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Telemetri XCMG XC968-EV (Pure-Electric Wheel Loader)
            motor_rpm = random.randint(1800, 2750)
            hydraulic_pressure = random.randint(185, 315) # bar (range nominal 150-350 bar)
            vibration_rms = round(random.uniform(0.9, 4.1), 2) # mm/s
            temp = random.randint(62, 94) # °C (inverter & hydraulic oil)
            battery_soc = random.randint(74, 96) # %

            # Formula Gradient Boosting Feature Importance (86% Vib, 8% Press, 6% Temp)
            norm_vib = min(100.0, (vibration_rms / 4.0) * 100.0)
            norm_press = min(100.0, max(0.0, ((hydraulic_pressure - 150) / 200.0) * 100.0))
            norm_temp = min(100.0, max(0.0, ((temp - 50) / 55.0) * 100.0))
            workload_stress = int(0.86 * norm_vib + 0.08 * norm_press + 0.06 * norm_temp)
            workload_stress = max(45, min(95, workload_stress))

            is_fault = workload_stress >= 80

            data = {
                "equipment_id": "XCMG-XC968-EV",
                "equipment_name": "XCMG XC968-EV Pure-Electric Wheel Loader",
                "motor_rpm": motor_rpm,
                "engine_rpm": motor_rpm, # Backwards compatibility
                "hydraulic_pressure": hydraulic_pressure,
                "vibration_rms": vibration_rms,
                "temperature": temp,
                "battery_soc_pct": battery_soc,
                "workload_stress_pct": workload_stress,
                "health_score": max(45, 100 - int(workload_stress * 0.5)),
                "fault_detected": is_fault,
                "diagnostic": {
                    "oem_part": "XCMG-803164921-VALVE",
                    "failure_mode": "Hydraulic Proportional Valve Leakage & Inverter Thermal Surge",
                    "mitigation_steps": [
                        "Inspect hydraulic line pressure at manifold test port P1",
                        "Verify cooling circuit flow rate for traction inverter drive",
                        "Recalibrate proportional solenoid valve via HANYUN OS service terminal"
                    ]
                }
            }
            await websocket.send_json(data)
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        print("Client disconnected")