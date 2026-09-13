from fastapi import APIRouter, Depends
from app.schemas.schemas import (
    AIChatRequest, AISummarizeRequest, AIReminderRequest,
    AIExplainServiceRequest, AIResponse
)
from app.ai.ai_service import ai_service
from app.auth.jwt import get_current_user
from app.models.models import User

router = APIRouter(prefix="/api/ai", tags=["AI Dental Assistant"])

@router.post("/chat", response_model=AIResponse)
def ai_chat(req: AIChatRequest, current_user: User = Depends(get_current_user)):
    res = ai_service.chat(user_message=req.message, user_role=current_user.role)
    return AIResponse(response=res["response"], disclaimer=res.get("disclaimer"))

@router.post("/summarize-treatment", response_model=AIResponse)
def ai_summarize_treatment(req: AISummarizeRequest, current_user: User = Depends(get_current_user)):
    res = ai_service.summarize_treatment(
        patient_name=req.patient_name,
        treatment_history=req.treatment_history,
        doctor_notes=req.doctor_notes
    )
    return AIResponse(response=res["response"])

@router.post("/generate-reminder", response_model=AIResponse)
def ai_generate_reminder(req: AIReminderRequest, current_user: User = Depends(get_current_user)):
    res = ai_service.generate_reminder(
        patient_name=req.patient_name,
        date=req.date,
        time=req.time,
        content=req.content
    )
    return AIResponse(response=res["response"])

@router.post("/explain-service", response_model=AIResponse)
def ai_explain_service(req: AIExplainServiceRequest, current_user: User = Depends(get_current_user)):
    res = ai_service.explain_service(
        service_name=req.service_name,
        user_question=req.user_question
    )
    return AIResponse(response=res["response"], disclaimer=res.get("disclaimer"))
