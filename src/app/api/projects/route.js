import { getTokens } from "@/app/lib/auth/getTokens";

export async function GET(req) {
  const { access_token } = await getTokens();

  if (!access_token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.API_KEY?.trim();
  const baseUrl = "https://pcufxstnppfqmzgslxlk.supabase.co";

  if (!apiKey) {
    return Response.json({ error: "Missing API key" }, { status: 500 });
  }

  const searchParams = new URL(req.url).searchParams;
  const limit = searchParams.get("limit") || "5";
  const offset = searchParams.get("offset") || "0";

  const res = await fetch(
    `${baseUrl}/rest/v1/rpc/get_projects?limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
        Prefer: "count=exact",
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return Response.json(data, { status: res.status });
  }

  const contentRange = res.headers.get("Content-Range");
  const totalCount = Number(contentRange?.split("/")[1] ?? data.length ?? 0);

  return Response.json({ data, totalCount });
}

export async function POST(req) {
  const { access_token } = await getTokens();

  if (!access_token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.API_KEY?.trim();
  const baseUrl = "https://pcufxstnppfqmzgslxlk.supabase.co";

  if (!apiKey) {
    return Response.json({ error: "Missing API key" }, { status: 500 });
  }

  const body = await req.json();

  const res = await fetch(
    `${baseUrl}/rest/v1/projects`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${access_token}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return Response.json(data, { status: res.status });
  }

  return Response.json(data, { status: 201 });
}
