"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type SalesChartProps = {
  labels: string[];
  series: number[];
};

export function SalesChart({ labels, series }: SalesChartProps) {
  const options = {
    chart: {
      type: "area" as const,
      toolbar: { show: false },
      animations: { enabled: true, easing: "easeinout", speed: 800 },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" as const, width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    colors: ["#34d399"],
    xaxis: {
      categories: labels,
      labels: { style: { colors: "#94a3b8" } },
    },
    yaxis: {
      labels: { style: { colors: "#94a3b8" } },
    },
    grid: { borderColor: "rgba(148, 163, 184, 0.2)" },
    tooltip: { theme: "dark" as const },
  };

  return <Chart options={options} series={[{ name: "Revenue", data: series }]} height={280} />;
}
