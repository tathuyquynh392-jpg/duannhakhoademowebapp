from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import Payment, Invoice, Patient, User
from app.schemas.schemas import PaymentOut, PaymentCreate
from app.auth.jwt import get_current_user, require_admin, check_patient_access

router = APIRouter(prefix="/api/payments", tags=["Payments"])

@router.get("", response_model=List[PaymentOut])
def get_payments(
    patient_id: Optional[int] = None,
    invoice_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Payment)

    if current_user.role == "PATIENT":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if not patient:
            return []
        query = query.filter(Payment.patient_id == patient.id)
    else:
        if patient_id:
            query = query.filter(Payment.patient_id == patient_id)

    if invoice_id:
        query = query.filter(Payment.invoice_id == invoice_id)

    return query.order_by(Payment.id.desc()).all()

@router.post("", response_model=PaymentOut)
def create_payment(
    req: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    invoice = db.query(Invoice).filter(Invoice.id == req.invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Không tìm thấy hóa đơn")

    if req.amount <= 0:
        raise HTTPException(status_code=400, detail="Số tiền thanh toán phải lớn hơn 0")

    count = db.query(Payment).count()
    payment_code = f"TT{count + 1:04d}"

    payment = Payment(
        payment_code=payment_code,
        invoice_id=invoice.id,
        patient_id=invoice.patient_id,
        amount=req.amount,
        payment_date=req.payment_date,
        payment_method=req.payment_method,
        notes=req.notes
    )
    db.add(payment)

    # Recalculate Invoice totals
    invoice.paid_amount += req.amount
    invoice.remaining_amount = max(0.0, invoice.total_amount - invoice.paid_amount)
    
    if invoice.remaining_amount <= 0:
        invoice.status = "Đã thanh toán"
    elif invoice.paid_amount > 0:
        invoice.status = "Đã thanh toán một phần"

    db.commit()
    db.refresh(payment)
    return payment
