export default function StatusItem({ status, count, statusColors }) {
  return (
    <div
      className={`
        flex items-center justify-between rounded-lg px-2 py-1 text-xs font-medium
        ${statusColors[status] || "bg-gray-100 text-gray-700"}
      `}
    >
      <span>{status.replaceAll("_", " ")}</span>
      <span>{count}</span>
    </div>
  );
}