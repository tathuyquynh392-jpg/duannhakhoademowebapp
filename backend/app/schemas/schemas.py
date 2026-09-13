from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime

# --- Auth Schemas ---
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    username: str
    full_name: Optional[str]
    role: str
    patient_id: Optional[int] = None

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: str = "PATIENT"

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: str
    full_name: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True

# --- Patient Schemas ---
class PatientBase(BaseModel):
    patient_code: Optional[str] = None
    full_name: str
    dob: Optional[str] = None
    gender: Optional[str] = "Khác"
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = "Hoạt động"

class PatientCreate(PatientBase):
    create_account: Optional[bool] = False
    username: Optional[str] = None
    password: Optional[str] = None

class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None

class PatientOut(PatientBase):
    id: int
    patient_code: str
    user_id: Optional[int] = None
    registration_date: str

    class Config:
        from_attributes = True

# --- Doctor Schemas ---
class DoctorBase(BaseModel):
    doctor_code: Optional[str] = None
    full_name: str
    specialization: str
    phone: str
    email: Optional[str] = None
    experience_years: int = 0
    status: str = "Đang làm việc"

class DoctorCreate(DoctorBase):
    pass

class DoctorUpdate(BaseModel):
    full_name: Optional[str] = None
    specialization: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    experience_years: Optional[int] = None
    status: Optional[str] = None

class DoctorOut(DoctorBase):
    id: int
    doctor_code: str

    class Config:
        from_attributes = True

# --- Dental Chair Schemas ---
class DentalChairBase(BaseModel):
    chair_code: Optional[str] = None
    name: str
    room: str
    status: str = "Trống"

class DentalChairCreate(DentalChairBase):
    pass

class DentalChairUpdate(BaseModel):
    name: Optional[str] = None
    room: Optional[str] = None
    status: Optional[str] = None

class DentalChairOut(DentalChairBase):
    id: int
    chair_code: str

    class Config:
        from_attributes = True

# --- Doctor Schedule Schemas ---
class DoctorScheduleBase(BaseModel):
    doctor_id: int
    chair_id: Optional[int] = None
    date: str
    start_time: str
    end_time: str
    shift: str
    status: str = "Đã xếp"
    notes: Optional[str] = None

class DoctorScheduleCreate(DoctorScheduleBase):
    pass

class DoctorScheduleUpdate(BaseModel):
    doctor_id: Optional[int] = None
    chair_id: Optional[int] = None
    date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    shift: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class DoctorScheduleOut(DoctorScheduleBase):
    id: int
    doctor: Optional[DoctorOut] = None
    chair: Optional[DentalChairOut] = None

    class Config:
        from_attributes = True


# --- Service Schemas ---
class ServiceBase(BaseModel):
    service_code: Optional[str] = None
    name: str
    category: Optional[str] = "Nha khoa tổng quát"
    description: Optional[str] = None
    price: float
    status: str = "Hoạt động"

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    status: Optional[str] = None

class ServiceOut(ServiceBase):
    id: int
    service_code: str

    class Config:
        from_attributes = True


# --- Appointment Schemas ---
class AppointmentCreate(BaseModel):
    patient_id: Optional[int] = None # Optional if patient logs in themselves
    doctor_id: Optional[int] = None
    chair_id: Optional[int] = None
    service_id: int
    date: str
    time_slot: str
    notes: Optional[str] = None

class AppointmentReschedule(BaseModel):
    date: str
    time_slot: str
    doctor_id: Optional[int] = None
    chair_id: Optional[int] = None

class AppointmentCancel(BaseModel):
    cancel_reason: str

class AppointmentUpdateStatus(BaseModel):
    status: str
    doctor_id: Optional[int] = None
    chair_id: Optional[int] = None

class AppointmentOut(BaseModel):
    id: int
    appointment_code: str
    patient_id: int
    doctor_id: Optional[int]
    chair_id: Optional[int]
    service_id: int
    date: str
    time_slot: str
    status: str
    notes: Optional[str]
    cancel_reason: Optional[str]
    created_at: datetime.datetime

    patient: Optional[PatientOut] = None
    doctor: Optional[DoctorOut] = None
    chair: Optional[DentalChairOut] = None
    service: Optional[ServiceOut] = None

    class Config:
        from_attributes = True

# --- Treatment Plan Schemas ---
class TreatmentPlanCreate(BaseModel):
    patient_id: int
    doctor_id: int
    service_id: Optional[int] = None
    plan_name: str
    start_date: str
    expected_end_date: Optional[str] = None
    estimated_cost: float = 0.0
    progress_percent: int = 0
    status: str = "Đang điều trị"
    notes: Optional[str] = None

class TreatmentPlanUpdate(BaseModel):
    plan_name: Optional[str] = None
    doctor_id: Optional[int] = None
    expected_end_date: Optional[str] = None
    estimated_cost: Optional[float] = None
    progress_percent: Optional[int] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class TreatmentPlanOut(BaseModel):
    id: int
    plan_code: str
    patient_id: int
    doctor_id: int
    service_id: Optional[int]
    plan_name: str
    start_date: str
    expected_end_date: Optional[str]
    estimated_cost: float
    progress_percent: int
    status: str
    notes: Optional[str]

    patient: Optional[PatientOut] = None
    doctor: Optional[DoctorOut] = None
    service: Optional[ServiceOut] = None

    class Config:
        from_attributes = True

# --- Treatment Record Schemas ---
class TreatmentRecordCreate(BaseModel):
    patient_id: int
    doctor_id: int
    treatment_plan_id: Optional[int] = None
    service_id: Optional[int] = None
    date: str
    content: str
    pre_condition: Optional[str] = None
    post_result: Optional[str] = None
    notes: Optional[str] = None
    next_plan: Optional[str] = None

class TreatmentRecordUpdate(BaseModel):
    content: Optional[str] = None
    pre_condition: Optional[str] = None
    post_result: Optional[str] = None
    notes: Optional[str] = None
    next_plan: Optional[str] = None

class TreatmentRecordOut(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    treatment_plan_id: Optional[int]
    service_id: Optional[int]
    date: str
    content: str
    pre_condition: Optional[str]
    post_result: Optional[str]
    notes: Optional[str]
    next_plan: Optional[str]

    patient: Optional[PatientOut] = None
    doctor: Optional[DoctorOut] = None
    service: Optional[ServiceOut] = None

    class Config:
        from_attributes = True

# --- Treatment Image Schemas ---
class TreatmentImageCreate(BaseModel):
    patient_id: int
    treatment_record_id: Optional[int] = None
    image_url: str
    title: Optional[str] = None
    stage: str = "Trong điều trị"

class TreatmentImageOut(BaseModel):
    id: int
    patient_id: int
    treatment_record_id: Optional[int]
    image_url: str
    title: Optional[str]
    stage: str
    uploaded_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Invoice Schemas ---
class InvoiceItemCreate(BaseModel):
    service_id: Optional[int] = None
    service_name: str
    quantity: int = 1
    unit_price: float

class InvoiceCreate(BaseModel):
    patient_id: int
    date: str
    discount: float = 0.0
    items: List[InvoiceItemCreate]

class InvoiceItemOut(BaseModel):
    id: int
    service_id: Optional[int]
    service_name: str
    quantity: int
    unit_price: float
    amount: float

    class Config:
        from_attributes = True

class InvoiceOut(BaseModel):
    id: int
    invoice_code: str
    patient_id: int
    date: str
    subtotal: float
    discount: float
    total_amount: float
    paid_amount: float
    remaining_amount: float
    status: str

    patient: Optional[PatientOut] = None
    items: List[InvoiceItemOut] = []

    class Config:
        from_attributes = True

# --- Payment Schemas ---
class PaymentCreate(BaseModel):
    invoice_id: int
    amount: float
    payment_date: str
    payment_method: str = "Tiền mặt"
    notes: Optional[str] = None

class PaymentOut(BaseModel):
    id: int
    payment_code: str
    invoice_id: int
    patient_id: int
    amount: float
    payment_date: str
    payment_method: str
    notes: Optional[str]

    patient: Optional[PatientOut] = None

    class Config:
        from_attributes = True

# --- FollowUp Schemas ---
class FollowUpCreate(BaseModel):
    patient_id: int
    doctor_id: int
    date: str
    time: str
    content: str
    notes: Optional[str] = None
    status: str = "Tái khám sắp tới"

class FollowUpOut(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    date: str
    time: str
    content: str
    notes: Optional[str]
    status: str

    patient: Optional[PatientOut] = None
    doctor: Optional[DoctorOut] = None

    class Config:
        from_attributes = True

# --- AI Schemas ---
class AIChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"

class AISummarizeRequest(BaseModel):
    patient_name: str
    treatment_history: List[str]
    doctor_notes: Optional[str] = None

class AIReminderRequest(BaseModel):
    patient_name: str
    date: str
    time: str
    content: str

class AIExplainServiceRequest(BaseModel):
    service_name: str
    user_question: Optional[str] = None

class AIResponse(BaseModel):
    response: str
    disclaimer: Optional[str] = None
