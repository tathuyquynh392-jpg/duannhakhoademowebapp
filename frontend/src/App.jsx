import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import PatientManagement from './pages/admin/PatientManagement';
import PatientDetail from './pages/admin/PatientDetail';
import DoctorManagement from './pages/admin/DoctorManagement';
import ChairManagement from './pages/admin/ChairManagement';
import ScheduleManagement from './pages/admin/ScheduleManagement';
import AppointmentManagement from './pages/admin/AppointmentManagement';
import ServiceManagement from './pages/admin/ServiceManagement';
import TreatmentPlanManagement from './pages/admin/TreatmentPlanManagement';
import TreatmentRecordManagement from './pages/admin/TreatmentRecordManagement';
import InvoiceManagement from './pages/admin/InvoiceManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import FollowUpManagement from './pages/admin/FollowUpManagement';
import StatisticsPage from './pages/admin/StatisticsPage';
import AiAssistantPage from './pages/admin/AiAssistantPage';

// Patient Pages
import PatientLayout from './layouts/PatientLayout';
import PatientDashboard from './pages/patient/PatientDashboard';
import ProfilePage from './pages/patient/ProfilePage';
import BookAppointmentPage from './pages/patient/BookAppointmentPage';
import MyAppointmentsPage from './pages/patient/MyAppointmentsPage';
import TreatmentHistoryPage from './pages/patient/TreatmentHistoryPage';
import TreatmentProgressPage from './pages/patient/TreatmentProgressPage';
import PatientServicesPage from './pages/patient/PatientServicesPage';
import MyInvoicesPage from './pages/patient/MyInvoicesPage';
import MyPaymentsPage from './pages/patient/MyPaymentsPage';
import MyFollowUpsPage from './pages/patient/MyFollowUpsPage';
import PatientAiPage from './pages/patient/PatientAiPage';

// Protected Route wrappers
const ProtectedAdminRoute = ({ children }) => {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/patient" replace />;
  return children;
};

const ProtectedPatientRoute = ({ children }) => {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role !== 'PATIENT') return <Navigate to="/admin" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="patients" element={<PatientManagement />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="doctors" element={<DoctorManagement />} />
        <Route path="chairs" element={<ChairManagement />} />
        <Route path="schedules" element={<ScheduleManagement />} />
        <Route path="appointments" element={<AppointmentManagement />} />
        <Route path="services" element={<ServiceManagement />} />
        <Route path="treatment-plans" element={<TreatmentPlanManagement />} />
        <Route path="treatment-records" element={<TreatmentRecordManagement />} />
        <Route path="invoices" element={<InvoiceManagement />} />
        <Route path="payments" element={<PaymentManagement />} />
        <Route path="follow-ups" element={<FollowUpManagement />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="ai-assistant" element={<AiAssistantPage />} />
        <Route path="settings" element={<div className="p-8 bg-white rounded-3xl border text-slate-500 font-bold text-xs">Cài Đặt Hệ Thống Lucky Dental</div>} />
      </Route>

      {/* Patient Routes */}
      <Route path="/patient" element={<ProtectedPatientRoute><PatientLayout /></ProtectedPatientRoute>}>
        <Route index element={<PatientDashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="book" element={<BookAppointmentPage />} />
        <Route path="appointments" element={<MyAppointmentsPage />} />
        <Route path="history" element={<TreatmentHistoryPage />} />
        <Route path="treatments" element={<TreatmentProgressPage />} />
        <Route path="services" element={<PatientServicesPage />} />
        <Route path="invoices" element={<MyInvoicesPage />} />
        <Route path="payments" element={<MyPaymentsPage />} />
        <Route path="follow-ups" element={<MyFollowUpsPage />} />
        <Route path="ai" element={<PatientAiPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
