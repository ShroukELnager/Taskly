import { getTokens } from "@/app/lib/auth/getTokens";

export async function GET() {
  const { access_token } = await getTokens();

  if (!access_token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(
    `${process.env.BASE_URL}/rest/v1/rpc/get_projects`,
    {
      method: "GET",
      headers: {
        apikey: process.env.API_KEY,
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const data = await res.json();

  return Response.json(data);
}

export async function POST(req) {
  const { access_token } = await getTokens();

  if (!access_token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const res = await fetch(
    `${process.env.BASE_URL}/rest/v1/projects`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.API_KEY,
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();

  return Response.json(data);
}