import { format, isToday } from "date-fns";
import Image from "next/image";
import StatusItem from "../StatusItem/StatusItem";

export default function StatsGrid({ data, statusColors }) {
  return (
    <div className="flex flex-col gap-3 md:grid md:grid-cols-4 lg:grid-cols-7 lg:gap-5">
      {data.daily?.map((item, index) => {
        const currentDate = new Date(item.day);
        const today = isToday(currentDate);

        return (
          <div
            key={index}
            className={`
              relative flex items-center justify-between rounded-2xl bg-[#F7F8FF] p-4
              md:min-h-[500px] md:flex-col md:items-start md:justify-start md:bg-white
              ${
                today
                  ? "border-2 border-blue-600"
                  : "border border-gray-200"
              }
            `}
          >
            {/* TODAY */}
            {today && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-medium text-white md:left-1/2 md:right-auto md:top-[-12px] md:-translate-x-1/2 md:translate-y-0">
  TODAY
</div>
            )}

            {/* LEFT SIDE */}
            <div className="flex items-center gap-3 md:block">
              {/* day/date */}
              <div>
                <p className="text-xs uppercase text-gray-400">
                  {format(currentDate, "EEE")}
                </p>

                <h2 className="text-2xl font-bold text-slate-700 md:mb-6">
                  {format(currentDate, "dd")}
                </h2>
              </div>

              {/* divider mobile */}
              <div className="h-10 w-px bg-gray-200 md:hidden" />

              {/* statuses mobile */}
              <div className="flex items-center gap-2 md:hidden">
                {Object.entries(item.statuses || {}).length > 0 ? (
                  Object.entries(item.statuses).map(
                    ([status, count], idx) => (
                      <div
                        key={idx}
                        className={`rounded px-2 py-[2px] text-xs font-bold text-white ${
                          statusColors?.[status] || "bg-blue-500"
                        }`}
                      >
                        {count}
                      </div>
                    )
                  )
                ) : (
                  <div className="text-xs text-gray-400">0</div>
                )}
              </div>
            </div>

            {/* desktop statuses */}
            <div className="hidden flex-col gap-2 md:flex">
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