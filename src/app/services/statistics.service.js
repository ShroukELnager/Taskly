async function handleResponse(res) {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.error || data?.message || "Something went wrong"
    );
  }

  return data;
}
export async function GetTasksCalendarStats(data) {
  const res = await fetch("/api/statistics/calenderStats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}
export async function GetTasksPerProject(data) {
  const res = await fetch("/api/statistics/tasksPerProject", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}