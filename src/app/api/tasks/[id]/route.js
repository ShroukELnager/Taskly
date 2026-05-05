import { getTokens } from "@/app/lib/auth/getTokens";

const apiKey = process.env.API_KEY?.trim();
const baseUrl = "https://pcufxstnppfqmzgslxlk.supabase.co";
const TABLE = "tasks";

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value || ""
  );
}

async function patchTask({ filter, body, accessToken }) {
  const res = await fetch(`${baseUrl}/rest/v1/${TABLE}?${filter}`, {
    method: "PATCH",
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text ? { message: text } : null;
  }

  return { res, data };
}

export async function PATCH(req, { params }) {
  const { access_token } = await getTokens();

  if (!access_token) {
    return Response.json({ error: "No token found" }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return Response.json({ error: "Task id is required" }, { status: 400 });
  }

  const { id: bodyId, task_id: taskCode, ...body } = await req.json();
  const rowId = bodyId || id;
  const filters = [];

  if (isUuid(rowId)) {
    filters.push(`id=eq.${encodeURIComponent(rowId)}`);
  } else if (rowId) {
    filters.push(`task_id=eq.${encodeURIComponent(rowId)}`);
  }

  if (taskCode && taskCode !== rowId) {
    filters.push(`task_id=eq.${encodeURIComponent(taskCode)}`);
  }

  if (!filters.length) {
    return Response.json(
      { error: "A valid task id is required" },
      { status: 400 }
    );
  }

  for (const filter of filters) {
    const { res, data } = await patchTask({
      filter,
      body,
      accessToken: access_token,
    });

    if (!res.ok) {
      return Response.json(data, { status: res.status });
    }

    if (Array.isArray(data) && data.length > 0) {
      return Response.json(data, { status: res.status });
    }
  }

  return Response.json(
    {
      error: "Task was not updated",
      details:
        "No matching row was found in tasks for the provided id/task_id.",
    },
    { status: 404 }
  );
}

