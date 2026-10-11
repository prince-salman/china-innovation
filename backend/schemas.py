# backend/schemas.py
from pydantic import BaseModel, Field

class UserLogin(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=4)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class IncidentReport(BaseModel):
    id: str
    timestamp: str
    equipment_id: str
    title: str
    severity: str        # "CRITICAL", "HIGH", "MEDIUM", "LOW"
    root_cause: str
    oem_part: str
    confidence_score: float