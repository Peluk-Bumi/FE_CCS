import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiRefreshCw, FiSearch } from "react-icons/fi";
import { useAuth } from "@/app/context/AuthContext";
import PageTitle from "@/shared/components/common/PageTitle";
import LoadingSpinner from "@/shared/components/layout/LoadingSpinner";
import api from "@/shared/services/api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import PlanningTable from "@/features/planning/components/PlanningTable";
import QrCodeModal from "@/features/admin/components/laporan/QrCodeModal";
import { downloadQrDataUrl, generatePlanningQrDataUrl } from "@/features/planning/utils/planningQr";

export default function PlanningListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  const createPath = isAdmin ? "/admin/perencanaan" : "/user/perencanaan";
  const pageTitle = isAdmin ? "All Perencanaan" : "Perencanaan Saya";
  const pageSubtitle = isAdmin
    ? "Menampilkan seluruh data perencanaan"
    : "Menampilkan data perencanaan milik Anda";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [qrLoadingId, setQrLoadingId] = useState(null);

  const fetchPlanning = async () => {
    setError(null);
    try {
      const response = await api.get(isAdmin ? "/perencanaan/all" : "/perencanaan");
      const records = response.data?.data || response.data || [];
      setData(Array.isArray(records) ? records : []);
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Gagal memuat data perencanaan";
      setError(message);
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlanning();
  }, [isAdmin]);

  const filteredData = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return data;

    return data.filter((item) => {
      const searchable = [
        item.nama_perusahaan,
        item.nama_pic,
        item.narahubung,
        item.jenis_kegiatan,
        item.lokasi,
        item.jenis_bibit,
        item.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(keyword);
    });
  }, [data, searchTerm]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPlanning();
  };

  const handleOpenQr = async (item) => {
    try {
      setQrLoadingId(item.id);
      const qrUrl = await generatePlanningQrDataUrl(item);
      setQrCodeData({
        url: qrUrl,
        verified: Boolean(item?.blockchain?.tx_hash || item?.blockchain?.doc_hash),
      });
      setQrModalOpen(true);
    } catch (err) {
      console.error("[PlanningListPage] Failed to generate QR:", err);
    } finally {
      setQrLoadingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 py-6 md:py-8">
      <PageTitle
        type="page"
        badge="Perencanaan"
        title={pageTitle}
        subtitle={pageSubtitle}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari perusahaan, PIC, lokasi, atau status..."
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <FiRefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Muat Ulang
          </Button>
          <Button onClick={() => navigate(createPath)}>
            <FiPlus className="mr-2 h-4 w-4" />
            Buat Perencanaan
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <PlanningTable
        data={filteredData}
        loading={refreshing}
        userRole={isAdmin ? "admin" : "user"}
        onQrDownload={handleOpenQr}
      />

      {!error && filteredData.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white/70 p-6 text-center text-sm text-gray-500 shadow-sm">
          Belum ada data yang cocok dengan pencarian atau data perencanaan masih kosong.
        </div>
      )}

      <QrCodeModal
        open={qrModalOpen}
        qrCodeData={qrCodeData}
        onClose={() => setQrModalOpen(false)}
        onDownload={() => qrCodeData?.url && downloadQrDataUrl(qrCodeData.url, "qr-perencanaan.png")}
        title="QR Code Perencanaan"
        noteTitle="Simpan QR ini untuk verifikasi monitoring"
        noteDescription="Jika tidak sempat mengunduh setelah membuat perencanaan, QR ini bisa diakses kembali dari halaman All Perencanaan."
        downloadLabel="Download QR Perencanaan (PNG)"
      />
    </div>
  );
}
