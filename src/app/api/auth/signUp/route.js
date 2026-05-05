export async function POST(req) {
  const BASE_URL = "https://pcufxstnppfqmzgslxlk.supabase.co/auth/v1";

  try {
    const apiKey = process.env.API_KEY?.trim();

    if (!apiKey) {
      return Response.json({ error: "Missing API key" }, { status: 500 });
    }

    const body = await req.json();

    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return Response.json(data, { status: 400 });
    }

    return Response.json({
      user: data.user,
      message: "Signup successful",
    });
  } catch (err) {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
