// src/App.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import AppRoutes from "@/app/routes/AppRoutes";
import Navbar from "@/layouts/partials/Navbar";
import ScrollToTop from "@/layouts/common/ScrollToTop";
import LoadingSpinner from "@/layouts/common/LoadingSpinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BlockchainProvider } from "@/app/context/BlockchainContext";
import BlockchainDebug from "@/features/blockchain/components/BlockchainDebug";
import { ThemeProvider } from "@/app/context/ThemeContext";

// ✅ Komponen terpisah yang menggunakan useAuth - harus di dalam AuthProvider
function AppContent() {
  const IDLE_RELOAD_MS = 8 * 60 * 60 * 1000;
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  const noNavbarRoutes = ["/login", "/register", "/admin", "/user"];
  const alwaysShowNavbarRoutes = ["/", "/about", "/contact", "/verifikasi"];
  
  const isNoNavbarRoute = noNavbarRoutes.some(route => location.pathname.startsWith(route));
  const isAlwaysShowNavbar = alwaysShowNavbarRoutes.some(route => {
    if (route === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(route);
  });

  const showNavbar = isAlwaysShowNavbar || (!isNoNavbarRoute && !isAuthenticated);

  useEffect(() => {
    let idleTimeout = null;

    const resetIdleTimer = () => {
      if (idleTimeout) {
        window.clearTimeout(idleTimeout);
      }

      idleTimeout = window.setTimeout(() => {
        window.location.reload();
      }, IDLE_RELOAD_MS);
    };

    const activityEvents = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"];

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetIdleTimer, { passive: true });
    });

    resetIdleTimer();

    return () => {
      if (idleTimeout) {
        window.clearTimeout(idleTimeout);
      }

      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetIdleTimer);
      });
    };
  }, [IDLE_RELOAD_MS]);

  console.log('[App] Render state:', {
    path: location.pathname,
    isAuthenticated,
    loading,
    showNavbar,
    timestamp: new Date().toISOString()
  });

  // ✅ Show loading only on initial mount, not on refresh
  if (loading) {
    return <LoadingSpinner show={true} message="Memuat aplikasi..." />;
  }

  return (
    <>
      <ScrollToTop />
      {showNavbar && <Navbar />}
      <AppRoutes />
      
      {/* ✅ Blockchain Debug Component - only in development */}
      {import.meta.env.DEV && <BlockchainDebug />}
      
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={true} 
        closeOnClick 
        pauseOnHover 
        draggable 
        theme="colored"
      />
    </>
  );
}

// ✅ Main App dengan proper provider nesting
function App() {
  return (
    <ThemeProvider>
      <BlockchainProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BlockchainProvider>
    </ThemeProvider>
  );
}

export default App;
