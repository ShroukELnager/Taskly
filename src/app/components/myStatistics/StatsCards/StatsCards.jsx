import Image from "next/image";

export default function StatsCards({ data }) {
  const cards = [
    {
      title: "TOTAL TASKS",
      value: data.total_tasks,
      color: "text-slate-800",
      img: "/images/task.png",
    },
    {
      title: "COMPLETED TASKS",
      value: data.done_tasks,
      color: "text-green-600",
      img: "/images/radiocheck.svg",
    },
    {
      title: "OVERDUE TASKS",
      value: data.overdue_tasks,
      color: "text-red-600",
      img: "/images/block.png",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((c, i) => (
        <div
          key={i}
          className="flex min-h-[112px] items-center justify-between gap-4 rounded-lg bg-white p-4 text-left shadow-sm md:p-5"
        >
          {/* mobile: image first */}
          <div className="order-2 shrink-0 rounded-lg bg-[#F1F3FF] p-3">
            <Image src={c.img} alt="icon" width={20} height={20} />
          </div>

          {/* text */}
          <div className="order-1 min-w-0">
            <p className="mb-2 truncate text-xs text-gray-400 md:text-sm">
              {c.title}
            </p>

            <h2 className={`text-2xl font-bold md:text-3xl ${c.color}`}>
              {c.value || 0}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
}
