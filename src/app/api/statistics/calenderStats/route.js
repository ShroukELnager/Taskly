import { getTokens } from "@/app/lib/auth/getTokens";

const baseUrl = "https://pcufxstnppfqmzgslxlk.supabase.co";

export async function POST(req) {
  const { access_token } = await getTokens();

  if (!access_token) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const apiKey = process.env.API_KEY?.trim();

  if (!apiKey) {
    return Response.json(
      { error: "Missing API key" },
      { status: 500 }
    );
  }

  const body = await req.json();

  const res = await fetch(
    `${baseUrl}/rest/v1/rpc/get_tasks_calendar_stats`,
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

  return Response.json(data, {
    status: res.status,
  });
}