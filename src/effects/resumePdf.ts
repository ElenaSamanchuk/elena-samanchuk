export function downloadResumePdf() {
  const url = `${import.meta.env.BASE_URL}resume-print.html?autoprint=1`;
  const printWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (!printWindow) window.location.assign(url);
}
