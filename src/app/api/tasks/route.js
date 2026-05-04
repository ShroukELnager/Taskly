import { getTokens } from "@/app/lib/auth/getTokens";

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

// GET tasks (project or epic)
export async function GET(req) {
  const { access_token } = await getTokens();

  if (!access_token) {
    return Response.json({ error: "No token found" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const project_id = searchParams.get("project_id");
  const epic_id = searchParams.get("epic_id");
  const status = searchParams.get("status");
  const search = searchParams.get("search") || "";

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  let filters = [];

  if (project_id) {
    filters.push(`project_id=eq.${project_id}`);
  }

  if (epic_id) {
    filters.push(`epic_id=eq.${epic_id}`);
  }

  if (status) {
    filters.push(`status=eq.${status}`);
  }

  if (search) {
    filters.push(`title=ilike.%25${search}%25`);
  }

  filters.push(`limit=${limit}`);
  filters.push(`offset=${offset}`);

  const url = `${BASE_URL}/rest/v1/project_tasks?${filters.join("&")}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data = await res.json();

  return Response.json(data);
}

export async function POST(req) {
  const { access_token } = await getTokens();

  if (!access_token) {
    return Response.json({ error: "No token found" }, { status: 401 });
  }

  const body = await req.json();

  const res = await fetch(`${BASE_URL}/rest/v1/tasks`, {
    method: "POST",
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return Response.json(data);
}