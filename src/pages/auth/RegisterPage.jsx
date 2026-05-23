import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon, HomeIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import PageTitle from "@/shared/components/common/PageTitle";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/shared/components/layout/LoadingSpinner";
import { FiFeather, FiZap, FiShield } from "react-icons/fi";
import { useAuth } from "@/app/context/AuthContext";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/utils";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      setLoading(false);
      return;
    }

    const result = await register(form);
    setLoading(false);
    
    if (!result.success) {
      setError(result.message || "Pendaftaran gagal");
    } else {
      navigate("/login");
    }
  };

  const floatingShapes = [
    { icon: FiFeather, size: "text-xl", position: "top-1/4 left-1/6" },
    { icon: FiFeather, size: "text-lg", position: "top-1/3 right-1/5" },
    { icon: FiZap, size: "text-2xl", position: "bottom-1/4 left-1/4" },
    { icon: FiShield, size: "text-3xl", position: "bottom-1/3 right-1/6" },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-primary/10 via-white to-primary-dark/10">
      {/* Left Side Image - Desktop Only */}
      <motion.div 
      className="hidden md:flex md:w-1/2 items-center justify-center p-10 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          backgroundImage: "url('/images/login-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Floating shapes */}
      {floatingShapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.position} ${shape.size} text-primary z-10`}
          animate={{
            y: [0, (Math.random() - 0.5) * 40],
            x: [0, (Math.random() - 0.5) * 40],
            rotate: [0, Math.random() * 360],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <shape.icon />
        </motion.div>
      ))}

      <motion.div 
        className="absolute bottom-10 left-10 bg-white/70 backdrop-blur-md px-6 py-3 rounded-xl shadow-lg border border-primary-light/20"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <h2 className="text-xl font-bold text-primary-dark">
          Daftar & Bergabung
        </h2>
        <p className="text-primary text-sm">
          Bersama memajukan argopariwisata 
          <motion.span 
            className="inline-flex items-center align-middle"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FiFeather className="ml-1" />
          </motion.span>
        </p>
      </motion.div>
    </motion.div>


      {/* Right Side Form */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-12 relative">
        {/* ✅ Home Button - Better positioned */}
        <Link
          to="/"
          className="absolute top-6 right-6 md:top-8 md:right-8 z-10 group"
          title="Kembali ke Beranda"
        >
          <motion.div
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-primary-light/20 hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ x: [-2, 0, -2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <HomeIcon className="h-5 w-5 text-primary" />
            </motion.div>
            <span className="hidden sm:inline text-sm font-medium text-primary">
              Beranda
            </span>
          </motion.div>
        </Link>

        <motion.div 
          className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6 relative border border-primary-light/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
        
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.h2 
              className="text-4xl font-extrabold text-primary-dark tracking-tight"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              Buat Akun Baru <motion.span 
                className="inline-flex align-middle ml-2"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img
                  src="/logo/Icon.png"
                  alt="Logo"
                  className="h-7 w-7 object-contain"
                />
              </motion.span>
            </motion.h2>
            <motion.p 
              className="text-primary-dark text-sm mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Bergabung dan mulai berkontribusi
            </motion.p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div 
                className="bg-red-100/80 text-red-700 px-4 py-2 rounded-lg text-sm text-center shadow-sm border border-red-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-primary-dark mb-1">
                Nama Lengkap
              </label>
              <Input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Masukkan nama lengkap"
              />
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-primary-dark mb-1">
                Email
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="Masukkan email Anda"
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-primary-dark mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  placeholder="Masukkan password"
                  className="pr-10"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-primary hover:text-primary-dark transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-medium text-primary-dark mb-1">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  required
                  placeholder="Ulangi password"
                  className="pr-10"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-primary hover:text-primary-dark transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showConfirm ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white py-3 rounded-lg font-semibold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg relative overflow-hidden"
              >
                <motion.span 
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  animate={{ x: isHovering ? "100%" : "-100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                {loading ? (
                  <span className="flex items-center justify-center space-x-2 relative z-10">
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    <span>Memproses...</span>
                  </span>
                ) : (
                  <span className="relative z-10">Daftar Sekarang</span>
                )}
              </button>
            </motion.div>
          </form>

          <motion.p 
            className="text-center text-sm text-primary-dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Sudah punya akun?{" "}
            <motion.span className="inline-block">
              <Link
                to="/login"
                className="text-primary-dark hover:underline font-medium"
                whileHover={{ scale: 1.05 }}
              >
                Login disini
              </Link>
            </motion.span>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

