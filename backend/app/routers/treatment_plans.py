from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import TreatmentPlan, Patient, User
from app.schemas.schemas import TreatmentPlanOut, TreatmentPlanCreate, TreatmentPlanUpdate
from app.auth.jwt import get_current_user, require_admin, check_patient_access

router = APIRouter(prefix="/api/treatment-plans", tags=["Treatment Plans"])

@router.get("", response_model=List[TreatmentPlanOut])
def get_treatment_plans(
    patient_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(TreatmentPlan)

    if current_user.role == "PATIENT":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if not patient:
            return []
        query = query.filter(TreatmentPlan.patient_id == patient.id)
    else:
        if patient_id:
            query = query.filter(TreatmentPlan.patient_id == patient_id)

    if status_filter:
        query = query.filter(TreatmentPlan.status == status_filter)

    return query.order_by(TreatmentPlan.id.desc()).all()

@router.post("", response_model=TreatmentPlanOut)
def create_treatment_plan(
    req: TreatmentPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    count = db.query(TreatmentPlan).count()
    plan_code = f"LT{count + 1:04d}"

    plan = TreatmentPlan(
        plan_code=plan_code,
        patient_id=req.patient_id,
        doctor_id=req.doctor_id,
        service_id=req.service_id,
        plan_name=req.plan_name,
        start_date=req.start_date,
        expected_end_date=req.expected_end_date,
        estimated_cost=req.estimated_cost,
        progress_percent=req.progress_percent,
        status=req.status or "Đang điều trị",
        notes=req.notes
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan

@router.put("/{plan_id}", response_model=TreatmentPlanOut)
def update_treatment_plan(
    plan_id: int,
    req: TreatmentPlanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    plan = db.query(TreatmentPlan).filter(TreatmentPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Không tìm thấy liệu trình điều trị")

    for k, v in req.dict(exclude_unset=True).items():
        setattr(plan, k, v)

    db.commit()
    db.refresh(plan)
    return plan

@router.delete("/{plan_id}")
def delete_treatment_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    plan = db.query(TreatmentPlan).filter(TreatmentPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Không tìm thấy liệu trình")
    db.delete(plan)
    db.commit()
    return {"message": "Xóa liệu trình điều trị thành công"}
