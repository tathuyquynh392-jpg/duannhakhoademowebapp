// Demo Data Provider for GitHub Pages / Offline mode

export const DEMO_PATIENTS = [
  {
    id: 1,
    patient_code: 'BN001',
    full_name: 'Nguyễn Văn An',
    dob: '1990-05-15',
    gender: 'Nam',
    phone: '0912345678',
    email: 'an.nguyen@gmail.com',
    address: 'Tổ 5, Phường Hoàng Văn Thụ, Thành phố Thái Nguyên, Tỉnh Thái Nguyên',
    registration_date: '2026-01-10',
    notes: 'Tiền sử dị ứng Penicillin. Nhạy cảm khi tẩy trắng răng.',
    status: 'Hoạt động'
  },
  {
    id: 2,
    patient_code: 'BN002',
    full_name: 'Trần Thị Bích',
    dob: '1995-08-20',
    gender: 'Nữ',
    phone: '0987654321',
    email: 'bich.tran@gmail.com',
    address: 'Phường Bến Nghé, Quận 1, TP Hồ Chí Minh',
    registration_date: '2026-02-15',
    notes: 'Đang theo liệu trình niềng răng mắc cài.',
    status: 'Hoạt động'
  },
  {
    id: 3,
    patient_code: 'BN003',
    full_name: 'Lê Hoàng Cường',
    dob: '1988-12-03',
    gender: 'Nam',
    phone: '0933445566',
    email: 'cuong.le@gmail.com',
    address: 'Phường Hàng Bạc, Quận Hoàn Kiếm, Thành phố Hà Nội',
    registration_date: '2026-03-01',
    notes: 'Đã cấy ghép Implant 1 răng hàm dưới.',
    status: 'Hoạt động'
  }
];

export const DEMO_DOCTORS = [
  {
    id: 1,
    doctor_code: 'BS001',
    full_name: 'BS. Phạm Minh Đức',
    specialization: 'Răng Hàm Mặt',
    phone: '0901112233',
    email: 'duc.pham@luckydental.vn',
    experience_years: 12,
    status: 'Đang làm việc'
  },
  {
    id: 2,
    doctor_code: 'BS002',
    full_name: 'BS. Lê Thu Trang',
    specialization: 'Chỉnh nha',
    phone: '0902223344',
    email: 'trang.le@luckydental.vn',
    experience_years: 8,
    status: 'Đang làm việc'
  },
  {
    id: 3,
    doctor_code: 'BS003',
    full_name: 'BS. Hoàng Anh Tuấn',
    specialization: 'Cấy ghép Implant',
    phone: '0903334455',
    email: 'tuan.hoang@luckydental.vn',
    experience_years: 15,
    status: 'Đang làm việc'
  },
  {
    id: 4,
    doctor_code: 'BS004',
    full_name: 'BS. Vũ Thị Hồng',
    specialization: 'Nha khoa trẻ em',
    phone: '0904445566',
    email: 'hong.vu@luckydental.vn',
    experience_years: 6,
    status: 'Đang làm việc'
  }
];

export const DEMO_CHAIRS = [
  { id: 1, chair_code: 'GHE001', name: 'Ghế khám 01', room: 'Phòng khám 01', status: 'Trống' },
  { id: 2, chair_code: 'GHE002', name: 'Ghế khám 02', room: 'Phòng khám 01', status: 'Đang sử dụng' },
  { id: 3, chair_code: 'GHE003', name: 'Ghế Implant 01', room: 'Phòng Implant', status: 'Trống' },
  { id: 4, chair_code: 'GHE004', name: 'Ghế Chỉnh Nha 01', room: 'Phòng chỉnh nha', status: 'Trống' }
];

export const DEMO_SERVICES = [
  { id: 1, service_code: 'DV001', name: 'Khám tổng quát & Tư vấn', category: 'Nha khoa tổng quát', price: 100000, description: 'Khám kiểm tra toàn bộ khoang miệng và chụp X-quang tư vấn.', status: 'Hoạt động' },
  { id: 2, service_code: 'DV002', name: 'Lấy cao răng & Đánh bóng', category: 'Nha khoa tổng quát', price: 300000, description: 'Lấy sạch cao răng siêu âm và đánh bóng men răng.', status: 'Hoạt động' },
  { id: 3, service_code: 'DV003', name: 'Trám răng thẩm mỹ', category: 'Nha khoa tổng quát', price: 500000, description: 'Trám răng sâu hoặc sứt mẻ bằng vật liệu Composite cao cấp.', status: 'Hoạt động' },
  { id: 4, service_code: 'DV004', name: 'Tẩy trắng răng Laser', category: 'Nha khoa thẩm mỹ', price: 2500000, description: 'Tẩy trắng công nghệ Laser Whitening an toàn không ê buốt.', status: 'Hoạt động' },
  { id: 5, service_code: 'DV005', name: 'Niềng răng mắc cài kim loại', category: 'Chỉnh nha', price: 25000000, description: 'Chỉnh nha mắc cài kim loại cao cấp thế hệ mới.', status: 'Hoạt động' },
  { id: 6, service_code: 'DV006', name: 'Cấy ghép Implant Straumann', category: 'Cấy ghép Implant', price: 22000000, description: 'Trồng răng Implant Thụy Sĩ tích hợp xương nhanh.', status: 'Hoạt động' }
];

export const DEMO_SCHEDULES = [
  {
    id: 1,
    doctor_id: 1,
    chair_id: 1,
    date: '2026-09-15',
    start_time: '08:00',
    end_time: '12:00',
    shift: 'Sáng',
    status: 'Đã xếp',
    notes: 'Khám tổng quát & nhổ răng khôn',
    doctor: DEMO_DOCTORS[0],
    chair: DEMO_CHAIRS[0]
  },
  {
    id: 2,
    doctor_id: 2,
    chair_id: 4,
    date: '2026-09-15',
    start_time: '13:30',
    end_time: '17:30',
    shift: 'Chiều',
    status: 'Đã xếp',
    notes: 'Tái khám niềng răng mắc cài',
    doctor: DEMO_DOCTORS[1],
    chair: DEMO_CHAIRS[3]
  },
  {
    id: 3,
    doctor_id: 3,
    chair_id: 3,
    date: '2026-09-16',
    start_time: '09:00',
    end_time: '11:30',
    shift: 'Sáng',
    status: 'Đã xếp',
    notes: 'Phẫu thuật cấy ghép Implant',
    doctor: DEMO_DOCTORS[2],
    chair: DEMO_CHAIRS[2]
  }
];

export const DEMO_STATISTICS = {
  kpi: {
    total_patients: 128,
    total_doctors: 4,
    today_appointments: 12,
    today_followups: 5,
    today_revenue: 15500000,
    monthly_revenue: 185000000,
    unpaid_invoices_count: 3
  },
  appointment_statuses: {
    'Chờ xác nhận': 4,
    'Đã xác nhận': 6,
    'Đã khám': 8,
    'Đã hủy': 1
  },
  revenue_chart: [
    { name: 'Tháng 4', revenue: 45000000 },
    { name: 'Tháng 5', revenue: 62000000 },
    { name: 'Tháng 6', revenue: 58000000 },
    { name: 'Tháng 7', revenue: 85000000 },
    { name: 'Tháng 8', revenue: 92000000 },
    { name: 'Tháng 9', revenue: 115000000 }
  ],
  visits_chart: [
    { name: 'Tháng 4', visits: 120 },
    { name: 'Tháng 5', visits: 145 },
    { name: 'Tháng 6', visits: 130 },
    { name: 'Tháng 7', visits: 190 },
    { name: 'Tháng 8', visits: 210 },
    { name: 'Tháng 9', visits: 185 }
  ],
  top_services: [
    { name: 'Lấy cao răng & Đánh bóng', count: 45, revenue: 13500000 },
    { name: 'Trám răng thẩm mỹ', count: 32, revenue: 16000000 },
    { name: 'Tẩy trắng răng Laser', count: 18, revenue: 45000000 },
    { name: 'Niềng răng mắc cài kim loại', count: 8, revenue: 200000000 },
    { name: 'Cấy ghép Implant Straumann', count: 5, revenue: 110000000 }
  ]
};

export const DEMO_TREATMENT_PLANS = [
  {
    id: 1,
    plan_code: 'LT001',
    patient_id: 1,
    doctor_id: 1,
    service_id: 3,
    plan_name: 'Điều trị trám răng & làm sạch tổng quát',
    start_date: '2026-09-01',
    expected_end_date: '2026-09-30',
    estimated_cost: 1500000,
    progress_percent: 50,
    status: 'Đang điều trị',
    notes: 'Đã hoàn thành đợt 1 lấy cao răng',
    patient: DEMO_PATIENTS[0],
    doctor: DEMO_DOCTORS[0],
    service: DEMO_SERVICES[2]
  }
];
