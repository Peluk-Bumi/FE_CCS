import QRCode from "qrcode";

export const buildPlanningQrContent = (item) => {
  if (!item?.id) {
    return "";
  }

  const baseUrl = window.location.origin;
  const params = new URLSearchParams();

  const docHash = item?.blockchain?.doc_hash || item?.blockchain_doc_hash || "";
  const txHash = item?.blockchain?.tx_hash || item?.blockchain_tx_hash || "";

  if (docHash) params.set("docHash", docHash);
  if (txHash) params.set("txHash", txHash);

  const query = params.toString();
  return `${baseUrl}/monitoring-access/${item.id}${query ? `?${query}` : ""}`;
};

/**
 * Membuat nama file QR yang unik per perencanaan.
 * Format: qr-perencanaan-{id}-{tanggal_pelaksanaan}.png
 * Contoh: qr-perencanaan-42-2025-08-15.png
 */
export const buildPlanningQrFilename = (item) => {
  const id = item?.id;
  if (!id) return "qr-perencanaan.png";

  const rawDate =
    item?.tanggal_pelaksanaan ||
    item?.tanggal_implementasi ||
    item?.created_at;

  let dateStr = "";
  if (rawDate) {
    try {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        dateStr = `-${y}-${m}-${day}`;
      }
    } catch {
      // skip
    }
  }

  return `qr-perencanaan-${id}${dateStr}.png`;
};

export const generatePlanningQrDataUrl = async (item) => {
  const qrContent = buildPlanningQrContent(item);

  if (!qrContent) {
    throw new Error("QR content tidak tersedia");
  }

  return QRCode.toDataURL(qrContent, {
    errorCorrectionLevel: "H",
    type: "image/png",
    quality: 0.95,
    margin: 1,
    width: 320,
    color: { dark: "#111827", light: "#ffffff" },
  });
};

export const downloadQrDataUrl = (dataUrl, filename = "qr-perencanaan.png") => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
};