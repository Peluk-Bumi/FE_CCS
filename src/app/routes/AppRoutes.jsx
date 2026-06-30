import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import DashboardLayout from "@/layouts/DashboardLayout";
import DemoLayout from "@/layouts/DemoLayout";

// Admin pages
import Dashboard from "@/pages/dashboard/AdminDashboardPage";
import UserPage from "@/pages/admin/UserPage";
import LaporanPage from "@/pages/reporting/ReportsPage";
import VerifikasiDashboardPage from "@/pages/verification/VerificationDashboardPage";

// Forms
import PlanningForm from "@/features/planning/components/PlanningForm";
import ImplementasiForm from "@/features/implementation/components/ImplementasiForm";
import MonitoringForm from "@/features/monitoring/components/MonitoringForm";
import EvaluasiPage from "@/pages/evaluation/EvaluationPage";
import EvaluationInformationPage from "@/features/evaluation/information/InformationPage";
import EvaluationParameterPage from "@/features/evaluation/parameter/ParameterPage";
import PlanningListPage from "@/features/planning/PlanningListPage";

// User pages
import DashboardUser from "@/pages/dashboard/UserDashboardPage";

// Public pages
import LandingPage from "@/pages/public/LandingPage";
import About from "@/pages/public/About";
import Contact from "@/pages/public/Contact";
import FAQPage from '@/pages/faq/FAQPage';
import VerifikasiPublicPage from "@/pages/verification/VerificationPage";
import MonitoringAccess from "@/pages/public/MonitoringAccess";
import NotFound from "@/pages/public/NotFound";
import PolicyPage from "@/pages/public/PolicyPage";
import TermsAndConditions from "@/pages/public/TermsAndConditions";
import License from "@/pages/public/License";
import PanduanPengguna from "@/pages/public/PanduanPengguna";

// Auth pages
import Login from "@/pages/auth/LoginPage";
import Register from "@/pages/auth/RegisterPage";

// Settings
import Settings from "@/pages/settings/Settings";

// Demo
import DemoIndex from '@/pages/demo/DemoIndex';
import { DemoButtons, DemoDashboardCards, DemoInputs, DemoBadges, DemoTabs, DemoAccordion, DemoModals } from '@/features/demo';

// Protected Route
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ─────────────────────────────────────────────────────────── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/faqs" element={<FAQPage />} />
      <Route path="/panduan" element={<PanduanPengguna />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/monitoring-access/:perencanaanId" element={<MonitoringAccess />} />
      <Route path="/kebijakan-privasi" element={<PolicyPage />} />
      <Route path="/syarat-ketentuan" element={<TermsAndConditions />} />
      <Route path="/lisensi" element={<License />} />
      <Route path="/verifikasi" element={<VerifikasiPublicPage />} />

      {/* ── Admin ──────────────────────────────────────────────────────────── */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard"    element={<Dashboard />} />
        <Route path="users"        element={<UserPage />} />
        <Route path="perencanaan/all" element={<PlanningListPage />} />
        <Route path="perencanaan"  element={<PlanningForm />} />
        <Route path="implementasi" element={<ImplementasiForm />} />
        <Route path="monitoring"   element={<MonitoringForm />} />
        <Route path="evaluasi"     element={<EvaluasiPage />} />
        <Route path="evaluasi/information" element={<EvaluationInformationPage />} />
        <Route path="evaluasi/parameter" element={<EvaluationParameterPage />} />
        {/* laporan = PDF reports page; log-history = blockchain tx log */}
        {/* <Route path="laporan"      element={<LaporanPage />} /> */}
        <Route path="log-history"  element={<LaporanPage />} />
        <Route path="verifikasi"   element={<VerifikasiDashboardPage />} />
        <Route path="settings"     element={<Settings />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ── User ───────────────────────────────────────────────────────────── */}
      <Route
        path="/user/*"
        element={
          <ProtectedRoute role="user">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard"    element={<DashboardUser />} />
        <Route path="perencanaan/all" element={<PlanningListPage />} />
        <Route path="perencanaan"  element={<PlanningForm />} />
        <Route path="implementasi" element={<ImplementasiForm />} />
        <Route path="monitoring"   element={<MonitoringForm />} />
        <Route path="evaluasi"     element={<EvaluasiPage />} />
        <Route path="evaluasi/information" element={<EvaluationInformationPage />} />
        <Route path="evaluasi/parameter" element={<EvaluationParameterPage />} />
        {/* laporan = PDF reports; log-history = blockchain tx log */}
        {/* <Route path="laporan"      element={<LaporanPage />} /> */}
        <Route path="log-history"  element={<LaporanPage />} />
        <Route path="verifikasi"   element={<VerifikasiDashboardPage />} />
        <Route path="settings"     element={<Settings />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ── Fallback ───────────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />

      {/* ── Dev Demo ───────────────────────────────────────────────────────── */}
      <Route path="/demo" element={<DemoLayout />}>
        <Route index element={<DemoIndex />} />
        <Route path="buttons" element={<DemoButtons />} />
        <Route path="cards"   element={<DemoDashboardCards />} />
        <Route path="inputs"  element={<DemoInputs />} />
        <Route path="badges"  element={<DemoBadges />} />
        <Route path="tabs"    element={<DemoTabs />} />
        <Route path="accordion" element={<DemoAccordion />} />
        <Route path="modals"  element={<DemoModals />} />
      </Route>
    </Routes>
  );
}
