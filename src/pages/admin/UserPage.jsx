import { useEffect, useState, useRef } from "react";
import api from "@/shared/services/api";
import LoadingSpinner from "@/shared/components/layout/LoadingSpinner";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch, FiUserPlus, FiEdit2, FiTrash2, FiMail, FiShield,
  FiUser, FiX, FiCheck, FiAlertCircle, FiChevronLeft, FiChevronRight,
  FiFilter, FiDownload, FiRefreshCw
} from "react-icons/fi";
import PageTitle from "@/shared/components/common/PageTitle";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/utils/utils";
export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "user", password: "" });
  const [submitting, setSubmitting] = useState(false);
  // ✅ Polling ref at top level (React hook rules)
  const pollingRef = useRef();
  useEffect(() => {
    try {
      const cachedUsers = sessionStorage.getItem("users_cache");
      if (cachedUsers) {
        const parsed = JSON.parse(cachedUsers);
        if (Array.isArray(parsed)) {
          setUsers(parsed);
        }
      }
    } catch (cacheError) {
      console.warn("[UserPage] Failed to read cached users:", cacheError);
    }
  }, []);
  // ✅ Initial data load
  useEffect(() => {
    fetchUsers();
  }, []);
  // ✅ Real-time polling setup - updates every 15 seconds for user list
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const POLLING_INTERVAL = 15000; // 15 seconds
    const TIMEOUT = 15000; // 15 second timeout
    const pollUsers = async () => {
      if (!isMounted) return;
      try {
        const response = await api.get("/users?per_page=100&page=1", { timeout: TIMEOUT });
        if (!isMounted) return;
        // ✅ Handle both paginated and non-paginated responses
        const userData = Array.isArray(response.data?.data) ? response.data.data : (response.data?.data?.length ? response.data.data : []);
        setUsers(userData);
        retryCount = 0; // Reset retry count on success
        try {
          sessionStorage.setItem("users_cache", JSON.stringify(userData));
        } catch (cacheError) {
          console.warn("[UserPage] Failed to store users cache:", cacheError);
        }
        setError(null);
      } catch (err) {
        retryCount++;
        console.error(`[UserPage] Polling error (attempt ${retryCount}/${MAX_RETRIES}):`, err.message);
        // ✅ Don't fail immediately - continue polling even on timeout
        if (retryCount < MAX_RETRIES) {
          // Exponential backoff: 5s, 10s, 15s
          const backoffTime = 5000 * Math.pow(2, retryCount - 1);
          console.log(`[UserPage] Retrying in ${backoffTime}ms...`);
        }
      }
    };
    // Initial fetch
    pollUsers();
    // Setup polling interval
    const intervalId = setInterval(() => {
      if (isMounted) {
        pollUsers();
      }
    }, POLLING_INTERVAL);
    pollingRef.current = intervalId;
    return () => {
      isMounted = false;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, []);
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users?per_page=100&page=1", { timeout: 15000 });
      // ✅ Handle both paginated and non-paginated responses
      const userData = Array.isArray(response.data?.data) ? response.data.data : (response.data?.data?.length ? response.data.data : []);
      console.log('[UserPage] Users fetched:', userData);
      setUsers(userData);
      try {
        sessionStorage.setItem("users_cache", JSON.stringify(userData));
      } catch (cacheError) {
        console.warn("[UserPage] Failed to store users cache:", cacheError);
      }
      setError(null);
    } catch (err) {
      console.error("Fetch users error:", err);
      if (err.response?.status === 403) {
        setError("Anda tidak memiliki izin untuk melihat data users.");
      } else if (err.response?.status === 405) {
        setError("Backend endpoint /users tidak mendukung method GET.");
      } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError("Permintaan timeout - backend tidak merespons. Silakan cek koneksi atau coba lagi.");
      } else {
        setError("Gagal memuat data user. Silakan coba lagi.");
      }
      if (users.length === 0) {
        setUsers([]);
      }
    } finally {
      setLoading(false);
    }
  };
  // Filter dan search
  const filteredUsers = users.filter(user => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === "all" || user.role === filterRole;
    return matchSearch && matchRole;
  });
  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  // Modal handlers
  const openAddModal = () => {
    setEditUser(null);
    setForm({ name: "", email: "", role: "user", password: "" });
    setModalOpen(true);
  };
  const openEditModal = (user) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, role: user.role, password: "" });
    setModalOpen(true);
  };
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // ✅ Clean form data - don't send empty password
      const submittedData = { ...form };
      if (editUser) {
        // ✅ For edit: don't send empty password
        if (!submittedData.password || submittedData.password.trim() === '') {
          delete submittedData.password;
        }
        console.log('[UserPage] Updating user:', editUser.id, submittedData);
        await api.put(`/users/${editUser.id}`, submittedData);
        toast.success("✅ User berhasil diupdate!");
      } else {
        // ✅ For create: password is required
        if (!submittedData.password || submittedData.password.trim() === '') {
          toast.error("❌ Password harus diisi!");
          setSubmitting(false);
          return;
        }
        console.log('[UserPage] Creating new user:', submittedData);
        await api.post("/users", submittedData);
        toast.success("✅ User berhasil ditambahkan!");
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Save user error:", err.response || err);
      if (err.response?.status === 403) {
        toast.error("❌ Anda tidak memiliki izin untuk melakukan aksi ini!");
      } else if (err.response?.status === 422) {
        const messages = err.response?.data?.messages;
        if (messages) {
          Object.values(messages).forEach(msg => {
            toast.error(`❌ ${Array.isArray(msg) ? msg[0] : msg}`);
          });
        } else {
          toast.error("❌ Validasi gagal!");
        }
      } else if (err.response?.status === 500) {
        const errorMsg = err.response?.data?.message || 'Terjadi kesalahan server';
        console.error('[UserPage] Server error:', errorMsg);
        toast.error(`❌ Error: ${errorMsg}`);
      } else {
        toast.error(`❌ ${err.response?.data?.message || err.response?.data?.error || 'Gagal menyimpan user!'}`);
      }
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      console.log('[UserPage] Deleting user:', userToDelete.id);
      await api.delete(`/users/${userToDelete.id}`);
      toast.success("✅ User berhasil dihapus!");
      setDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      console.error("Delete user error:", err.response || err);
      if (err.response?.status === 403) {
        toast.error("❌ Anda tidak memiliki izin untuk menghapus user ini!");
      } else if (err.response?.status === 500) {
        const errorMsg = err.response?.data?.message || 'Terjadi kesalahan server';
        console.error('[UserPage] Server error:', errorMsg);
        toast.error(`❌ Error: ${errorMsg}`);
      } else {
        toast.error(`❌ ${err.response?.data?.message || err.response?.data?.error || 'Gagal menghapus user!'}`);
      }
    }
  };
  if (loading && users.length === 0 && !error) return <LoadingSpinner show={true} message="Memuat data users..." size="small" />;
  return (
    <>
      <div className="py-12">
      <PageTitle
        type="page"
        badge="User Management"
        badgeIcon={FiUser}
        title="User Management"
        description="Kelola semua pengguna sistem"
      />
      {error && (
        <motion.div
          className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <FiAlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </motion.div>
      )}
      <motion.div
        className="glass bg-white/90 dark:bg-gray-900 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden p-8 md:p-12 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Controls Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <Input
              type="text"
              placeholder="Cari nama atau email..."
              className="pl-12"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          {/* Filter */}
          <div className="md:col-span-3 relative">
            <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <Select
              value={filterRole}
              onValueChange={(val) => {
                setFilterRole(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="pl-12">
                <SelectValue placeholder="Semua Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Role</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Actions */}
          <div className="md:col-span-4 flex gap-4">
            <motion.button
              onClick={fetchUsers}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiRefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </motion.button>
            <motion.button
              onClick={openAddModal}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl font-medium shadow-lg transition-all"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 40px -10px rgba(81, 118, 64, 0.5)" }}
              whileTap={{ scale: 0.98 }}
            >
              <FiUserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah User</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <AnimatePresence>
          {currentUsers.length === 0 ? (
            <motion.div
              className="col-span-full text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FiUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Tidak ada user ditemukan</p>
            </motion.div>
          ) : (
            currentUsers.map((user, index) => (
              <motion.div
                key={user.id}
                className="group relative z-0 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-2xl hover:z-10 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                {/* User Avatar */}
                <div className="flex flex-col items-center mb-4">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg ${user.role === 'admin'
                        ? 'bg-gradient-to-br from-primary to-primary-dark text-white'
                        : 'bg-gradient-to-br from-muted to-muted/80 text-foreground dark:from-muted/80 dark:to-muted/60 dark:text-foreground'
                      }`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    {user.role === 'admin' && (
                      <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                        <FiShield className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </motion.div>
                </div>
                {/* User Info */}
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1 truncate">
                    {user.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <FiMail className="w-3 h-3" />
                    <p className="truncate">{user.email}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin'
                      ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light'
                      : 'bg-muted text-foreground dark:bg-muted/80 dark:text-foreground'
                    }`}>
                    {user.role === 'admin' ? <FiShield className="w-3 h-3" /> : <FiUser className="w-3 h-3" />}
                    {user.role}
                  </span>
                </div>
                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <motion.button
                    onClick={() => openEditModal(user)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light rounded-lg hover:bg-primary/20 dark:hover:bg-primary/30 transition-all text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    onClick={() => openDeleteModal(user)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Hapus
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Menampilkan <span className="font-semibold text-primary">{indexOfFirstUser + 1}</span> -
              <span className="font-semibold text-primary"> {Math.min(indexOfLastUser, filteredUsers.length)}</span> dari
              <span className="font-semibold text-primary"> {filteredUsers.length}</span> users
            </p>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all ${currentPage === 1
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light hover:bg-primary/20 dark:hover:bg-primary/30'
                  }`}
                whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
                whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
              >
                <FiChevronLeft className="w-5 h-5" />
              </motion.button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <motion.button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === pageNum
                          ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80 dark:hover:bg-muted/60'
                        }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}
              </div>
              <motion.button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all ${currentPage === totalPages
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light hover:bg-primary/20 dark:hover:bg-primary/30'
                  }`}
                whileHover={currentPage !== totalPages ? { scale: 1.1 } : {}}
                whileTap={currentPage !== totalPages ? { scale: 0.9 } : {}}
              >
                <FiChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
    {/* Add/Edit Modal */}
    <AnimatePresence>
      {modalOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {editUser ? "Edit User" : "Tambah User Baru"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nama Lengkap
                  </label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <Select
                    value={form.role}
                    onValueChange={(val) => setForm({ ...form, role: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {!editUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                  </div>
                )}
                {editUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password <span className="text-xs text-gray-500">(Kosongkan jika tidak ingin mengubah)</span>
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-medium transition-all disabled:opacity-50"
                  >
                    {submitting ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    {/* Delete Confirmation Modal */}
    <AnimatePresence>
      {deleteModalOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteModalOpen(false)}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
                Hapus User
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Apakah Anda yakin ingin menghapus user <span className="font-semibold">{userToDelete?.name}</span>? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all"
                >
                  Hapus
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}


