import { FiDownload, FiCheckCircle } from "react-icons/fi";
import { StandardModal } from "@/shared/components/ui/modal/AnimatedModal";
import { FormButton } from "@/shared/components/ui/button/FormButton";

export default function QrCodeModal({
  open,
  qrCodeData,
  onClose,
  onDownload,
  title = "QR Code Blockchain",
  statusLabel = (verified) => (verified ? "Verified dari Blockchain" : "Data dari Database"),
  noteTitle = "QR ini mengarah ke form monitoring",
  noteDescription = "Konten QR memuat dokumen verifikasi blockchain dan akan mengarahkan user ke halaman monitoring. Login diperlukan sebelum mengisi form monitoring.",
  downloadLabel = "Download QR (PNG)",
}) {
  if (!open || !qrCodeData) {
    return null;
  }

  return (
    <StandardModal
      isOpen={open}
      onClose={onClose}
      size="sm"
      icon={qrCodeData.verified ? FiCheckCircle : null}
      title={title}
      subtitle={statusLabel(qrCodeData.verified)}
      bodyClassName="flex flex-col items-center"
      footer={
        <FormButton
          variant="primary"
          onClick={onDownload}
          className="w-full px-4 py-2"
          icon={<FiDownload />}
        >
          {downloadLabel}
        </FormButton>
      }
    >
      <div className="bg-white p-4 rounded-xl shadow-inner mb-6 w-full flex items-center justify-center border-2 border-gray-100 dark:border-gray-700">
        <img
          src={qrCodeData.url}
          alt="QR Code"
          className="w-48 h-48 object-contain"
        />
      </div>

      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-900/20 p-4 text-left w-full">
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
          {noteTitle}
        </p>
        <p className="text-xs text-emerald-700/90 dark:text-emerald-300/90">
          {noteDescription}
        </p>
      </div>
    </StandardModal>
  );
}
