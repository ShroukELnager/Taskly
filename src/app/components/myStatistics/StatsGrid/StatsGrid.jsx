import { format, isToday } from "date-fns";
import Image from "next/image";
import StatusItem from "../StatusItem/StatusItem";

export default function StatsGrid({ data, statusColors }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7 xl:gap-5">
      {data.daily?.map((item, index) => {
        const currentDate = new Date(item.day);
        const today = isToday(currentDate);

        return (
          <div
            key={index}
            className={`
              relative flex min-h-[116px] items-center justify-between rounded-lg bg-[#F7F8FF] p-4
              md:min-h-[420px] md:flex-col md:items-start md:justify-start md:bg-white
              xl:min-h-[500px]
              ${today ? "border-2 border-blue-600" : "border border-gray-200"}
            `}
          >
            {today && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-medium text-white md:left-1/2 md:right-auto md:top-[-12px] md:-translate-x-1/2 md:translate-y-0">
                TODAY
              </div>
            )}

            <div className="flex min-w-0 items-center gap-3 md:block">
              <div>
                <p className="text-xs uppercase text-gray-400">
                  {format(currentDate, "EEE")}
                </p>

                <h2 className="text-2xl font-bold text-slate-700 md:mb-6">
                  {format(currentDate, "dd")}
                </h2>
              </div>

              <div className="h-10 w-px bg-gray-200 md:hidden" />

              <div className="flex min-w-0 flex-wrap items-center justify-end gap-2 md:hidden">
                {Object.entries(item.statuses || {}).length > 0 ? (
                  Object.entries(item.statuses).map(([status, count], idx) => (
                    <div
                      key={idx}
                      className={`rounded px-2 py-[2px] text-xs font-bold text-white ${
                        statusColors?.[status] || "bg-blue-500"
                      }`}
                    >
                      {count}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-400">0</div>
                )}
              </div>
            </div>

            <div className="hidden w-full min-w-0 flex-col gap-2 md:flex">
              {Object.entries(item.statuses || {}).length > 0 ? (
                Object.entries(item.statuses).map(([status, count], idx) => (
                  <StatusItem
                    key={idx}
                    status={status}
                    count={count}
                    statusColors={statusColors}
                  />
                ))
              ) : (
                <div className="mt-32 flex flex-col items-center justify-center text-gray-400">
                  <Image
                    src="/images/noTask.png"
                    alt="No Task"
                    width={20}
                    height={20}
                  />
                  <p className="text-xs font-medium">NO TASKS</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
