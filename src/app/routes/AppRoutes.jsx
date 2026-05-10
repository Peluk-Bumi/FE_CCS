import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import DashboardLayout from "@/layouts/DashboardLayout";

// Admin pages
import Dashboard from "@/pages/dashboard/AdminDashboardPage";
import UserPage from "@/pages/admin/UserPage";
import LaporanPage from "@/pages/reporting/ReportsPage";
import ActivityPage from "@/pages/admin/ActivityPage";
import VerifikasiDashboardPage from "@/pages/verification/VerificationDashboardPage";

// Forms
import PlanningForm from "@/features/planning/components/PlanningForm";
import ImplementasiForm from "@/features/implementation/components/ImplementasiForm";
import MonitoringForm from "@/features/monitoring/components/MonitoringForm";
import EvaluasiPage from "@/pages/evaluation/EvaluationPage";

// User pages
import DashboardUser from "@/pages/dashboard/UserDashboardPage";

// Public pages
import LandingPage from "@/pages/public/LandingPage";
import About from "@/pages/public/About";
import Contact from "@/pages/public/Contact";
import VerifikasiPublicPage from "@/pages/verification/VerificationPage";
import MonitoringAccess from "@/pages/public/MonitoringAccess";
import NotFound from "@/pages/public/NotFound";
import PrivacyPolicy from "@/pages/public/PrivacyPolicy";
import TermsAndConditions from "@/pages/public/TermsAndConditions";
import License from "@/pages/public/License";

// Auth pages
import Login from "@/pages/auth/LoginPage";
import Register from "@/pages/auth/RegisterPage";

// Settings
import Settings from "@/pages/settings/Settings";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";

// ✅ Smart Verifikasi Router - Route berdasarkan status autentikasi
function VerifikasiRouter() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    // ✅ User sudah login - arahkan ke dashboard verifikasi
    return (
      <ProtectedRoute>
        <VerifikasiDashboardPage />
      </ProtectedRoute>
    );
  }

  // ✅ Public - tanpa layout dan authentication
  return <VerifikasiPublicPage />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/monitoring-access/:perencanaanId" element={<MonitoringAccess />} />
      <Route path="/kebijakan-privasi" element={<PrivacyPolicy />} />
      <Route path="/syarat-ketentuan" element={<TermsAndConditions />} />
      <Route path="/lisensi" element={<License />} />
      
      {/* ✅ Smart Verifikasi Route - berdasarkan autentikasi */}
      <Route path="/verifikasi" element={<VerifikasiRouter />} />

      {/* Admin - Full Access */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserPage />} />
        <Route path="perencanaan" element={<PlanningForm />} />
        <Route path="implementasi" element={<ImplementasiForm />} />
        <Route path="laporan" element={<LaporanPage />} />
        <Route path="monitoring" element={<MonitoringForm />} />
        <Route path="evaluasi" element={<EvaluasiPage />} />
        <Route path="verifikasi" element={<VerifikasiDashboardPage />} />
        <Route path="settings" element={<Settings />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* User Routes - Fixed */}
      <Route
        path="/user/*"
        element={
          <ProtectedRoute role="user">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardUser />} />
        <Route path="perencanaan" element={<PlanningForm />} />
        <Route path="implementasi" element={<ImplementasiForm />} />
        <Route path="monitoring" element={<MonitoringForm />} />
        <Route path="evaluasi" element={<EvaluasiPage />} />
        <Route path="verifikasi" element={<VerifikasiDashboardPage />} />
        <Route path="settings" element={<Settings />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}