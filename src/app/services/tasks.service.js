export async function getProjectTasks(projectId) {
  const res = await fetch(`/api/tasks?project_id=${projectId}`);
  return res.json();
}

export async function createTask(data) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateTask(id, data) {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

