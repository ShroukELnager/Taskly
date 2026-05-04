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

  if (!project_id) {
    return Response.json(
      { error: "project_id is required" },
      { status: 400 }
    );
  }

  const res = await fetch(
    `${BASE_URL}/rest/v1/get_project_members?project_id=eq.${project_id}`,
    {
      method: "GET",
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return Response.json(data, { status: res.status });
  }

  return Response.json(data);
}