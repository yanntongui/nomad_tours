import { format } from "date-fns";
import { fr } from "date-fns/locale";

async function loadImageAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function captureNode(node: HTMLElement) {
  const html2canvas = (await import("html2canvas")).default;
  return html2canvas(node, { backgroundColor: "#F8F9FA", scale: 2, useCORS: true });
}

export async function exportProgrammeAsPng(node: HTMLElement) {
  const canvas = await captureNode(node);
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = `programme-annuel-${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function exportProgrammeAsPdf(node: HTMLElement) {
  const canvas = await captureNode(node);
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  try {
    const logoDataUrl = await loadImageAsDataUrl(`${window.location.origin}/nomad-logo.jpg`);
    pdf.addImage(logoDataUrl, "JPEG", 30, 24, 32, 32);
  } catch {
    // logo optional — continue without it
  }

  pdf.setFontSize(15);
  pdf.text("Programme annuel — Nomad Tours", 74, 40);
  pdf.setFontSize(9);
  pdf.setTextColor(120, 113, 108);
  pdf.text(`Généré le ${format(new Date(), "d MMMM yyyy", { locale: fr })}`, 74, 54);

  const imgData = canvas.toDataURL("image/png");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const imgWidth = pageWidth - 60;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  pdf.addImage(imgData, "PNG", 30, 76, imgWidth, imgHeight);
  pdf.save(`programme-annuel-${Date.now()}.pdf`);
}
