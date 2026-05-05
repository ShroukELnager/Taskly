async function handleResponse(res) {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.error || data?.message || "Something went wrong"
    );
  }

  return data;
}

// =========================
// GET ALL EPICS
// =========================
export async function getEpics({
  projectId,
  page = 1,
  limit = 6,
  search = "",
}) {
  const offset = (page - 1) * limit;

  const params = new URLSearchParams({
    project_id: projectId,
    limit: String(limit),
    offset: String(offset),
  });

  if (search?.trim()) {
    params.append("search", search.trim());
  }

  const res = await fetch(`/api/epics?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse(res);
}

// =========================
// GET EPIC DETAILS (FIXED - IMPORTANT)
// =========================
export async function getEpicById({ projectId, id }) {
  const params = new URLSearchParams({
    project_id: projectId,
    id, // will be converted in backend to eq.id
  });

  const res = await fetch(`/api/epics?${params.toString()}`, {
    // 👈 SAME endpoint as list
    // BUT backend will detect "id" and return single record
    method: "GET",
    credentials: "include",
  });

  const data = await handleResponse(res);
  return data?.data?.[0] || null;
}

// =========================
// CREATE EPIC
// =========================
export async function createEpic(data) {
  const res = await fetch("/api/epics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

// =========================
// UPDATE EPIC
// =========================
export async function updateEpic(id, data) {
  const res = await fetch(`/api/epics/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}
