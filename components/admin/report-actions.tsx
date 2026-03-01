"use client";

type ExportRow = {
  label: string;
  value: string | number;
};

export function ReportActions({ rows }: { rows: ExportRow[] }) {
  const exportCSV = (filename: string) => {
    const header = "DelightStore Premium Report\n";
    const body = rows.map((row) => `${row.label},${row.value}`).join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const exportPrint = () => {
    const html = `
      <html>
        <head>
          <title>DelightStore Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; }
            h1 { color: #0d1425; }
            table { width: 100%; border-collapse: collapse; }
            td, th { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: left; }
          </style>
        </head>
        <body>
          <h1>DelightStore Premium Report</h1>
          <table>
            ${rows
              .map((row) => `<tr><th>${row.label}</th><td>${row.value}</td></tr>`)
              .join("")}
          </table>
        </body>
      </html>
    `;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => exportCSV("delightstore-report.csv")}
        className="rounded-full bg-emerald-500/80 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
      >
        Export CSV
      </button>
      <button
        onClick={() => exportPrint()}
        className="rounded-full border border-slate-300 px-4 py-2 text-xs text-slate-600 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
      >
        Export PDF
      </button>
      <button
        onClick={() => exportCSV("delightstore-report.xls")}
        className="rounded-full border border-slate-300 px-4 py-2 text-xs text-slate-600 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
      >
        Export Excel
      </button>
    </div>
  );
}
