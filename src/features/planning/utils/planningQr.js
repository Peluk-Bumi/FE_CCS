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