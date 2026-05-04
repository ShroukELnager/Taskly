import { getTokens } from "@/app/lib/auth/getTokens";

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

export async function GET(req) {
  const { access_token } = await getTokens();

  if (!access_token) {
    return Response.json({ error: "No token found" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const project_id = searchParams.get("project_id");

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status");

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  if (!project_id) {
    return Response.json(
      { error: "project_id is required" },
      { status: 400 }
    );
  }

  let url = `${BASE_URL}/rest/v1/project_epics?project_id=eq.${project_id}&limit=${limit}&offset=${offset}`;

  if (search) {
    url += `&title=ilike.%25${search}%25`;
  }

  if (status) {
    url += `&status=eq.${status}`;
  }

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

  const res = await fetch(`${BASE_URL}/rest/v1/epics`, {
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