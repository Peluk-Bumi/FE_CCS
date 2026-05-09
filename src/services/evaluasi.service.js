import api from "../api/axios";

const toArray = (payload) => payload?.data || payload || [];

/**
 * Fetch perencanaan data based on user role
 * @param {string} role - User role ('admin' or other)
 * @returns {Promise<Array>} Array of perencanaan data
 */
export const fetchPerencanaan = async (role) => {
  const endpoint = role === "admin" ? "/perencanaan/all" : "/perencanaan";
  const response = await api.get(endpoint);
  return toArray(response.data);
};

/**
 * Fetch implementasi data
 * @returns {Promise<Array>} Array of implementasi data
 */
export const fetchImplementasi = async () => {
  const response = await api.get("/implementasi");
  return toArray(response.data);
};

/**
 * Fetch monitoring data
 * @returns {Promise<Array>} Array of monitoring data
 */
export const fetchMonitoring = async () => {
  const response = await api.get("/monitoring");
  return toArray(response.data);
};

/**
 * Fetch all evaluasi data (perencanaan, implementasi, monitoring)
 * @param {string} role - User role
 * @returns {Promise<Object>} Object containing perencanaan, implementasi, and monitoring arrays
 */
export const fetchAllEvaluasiData = async (role) => {
  const [perencanaanRes, implementasiRes, monitoringRes] = await Promise.allSettled([
    fetchPerencanaan(role),
    fetchImplementasi(),
    fetchMonitoring(),
  ]);

  const perencanaan = perencanaanRes.status === "fulfilled" ? perencanaanRes.value : [];
  const implementasi = implementasiRes.status === "fulfilled" ? implementasiRes.value : [];
  const monitoring = monitoringRes.status === "fulfilled" ? monitoringRes.value : [];

  return {
    perencanaan: Array.isArray(perencanaan) ? perencanaan : [],
    implementasi: Array.isArray(implementasi) ? implementasi : [],
    monitoring: Array.isArray(monitoring) ? monitoring : [],
  };
};
