from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Patient
from app.schemas.schemas import LoginRequest, TokenResponse, UserOut
from app.auth.security import verify_password, get_password_hash
from app.auth.jwt import create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # Find user by username or email
    user = db.query(User).filter(
        (User.username == req.username) | (User.email == req.username)
    ).first()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tên đăng nhập hoặc mật khẩu không chính xác."
        )

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Tài khoản đã bị khóa.")

    patient_id = None
    if user.role == "PATIENT":
        patient = db.query(Patient).filter(Patient.user_id == user.id).first()
        if patient:
            patient_id = patient.id

    token_data = {
        "sub": user.username,
        "user_id": user.id,
        "role": user.role,
        "patient_id": patient_id
    }
    access_token = create_access_token(data=token_data)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        username=user.username,
        full_name=user.full_name,
        role=user.role,
        patient_id=patient_id
    )

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
