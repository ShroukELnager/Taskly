"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const colors = {
  IN_PROGRESS: "#2563eb",
  DONE: "#16a34a",
  BLOCKED: "#dc2626",
  REOPENED: "#f97316",
};

export default function TotalsCard({ totals }) {
  const labels = Object.keys(totals || {});
  const values = Object.values(totals || {});
  const total = values.reduce((a, b) => a + b, 0);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map((l) => colors[l] || "#94a3b8"),
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm md:p-6">
      
      {/* TITLE */}
      <h2 className="mb-4 text-lg font-semibold text-slate-800">
        Tasks by Statistics
      </h2>

      {/* MAIN WRAPPER */}
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-8">
        
        {/* DONUT */}
        <div className="relative h-[160px] w-[160px] md:h-[220px] md:w-[220px]">
          <Doughnut data={data} options={options} />

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-slate-800 md:text-3xl">
              {total}
            </p>
            <p className="text-[10px] text-slate-500 md:text-xs">
              TOTAL TASKS
            </p>
          </div>
        </div>

        {/* LEGEND */}
        <div className="flex w-full flex-col gap-3 md:flex-1">
          {labels.map((key, i) => {
            const percent = total ? (values[i] / total) * 100 : 0;

            return (
              <div key={key} className="flex items-center gap-2">
                
                {/* DOT */}
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: colors[key] }}
                />

                {/* LABEL */}
                <div className="w-[90px] truncate text-xs text-slate-600 md:w-[120px] md:text-sm">
                  {key.replaceAll("_", " ")}
                </div>

                {/* BAR */}
                <div className="h-2 flex-1 rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: colors[key],
                    }}
                  />
                </div>

                {/* VALUE */}
                <div className="w-6 text-right text-xs font-medium text-slate-800 md:w-8 md:text-sm">
                  {values[i]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}