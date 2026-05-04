import { getTokens } from "@/app/lib/auth/getTokens";

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

export async function PATCH(req) {
  const { access_token } = await getTokens();

  if (!access_token) {
    return Response.json({ error: "No token found" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const body = await req.json();

  const res = await fetch(
    `${BASE_URL}/rest/v1/tasks?id=eq.${id}`,
    {
      method: "PATCH",
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();
  return Response.json(data);
}

