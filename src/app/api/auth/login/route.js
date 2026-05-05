import { cookies } from "next/headers";

export async function POST(req) {
  const BASE_URL = "https://pcufxstnppfqmzgslxlk.supabase.co/auth/v1/token";

  try {
    const apiKey = process.env.API_KEY?.trim();

    if (!apiKey) {
      return Response.json({ error: "Missing API key" }, { status: 500 });
    }

    const body = await req.json();

    const res = await fetch(`${BASE_URL}?grant_type=password`, {
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

    const cookieStore = await cookies();
    const secure = process.env.NODE_ENV === "production";

    cookieStore.set("access_token", data.access_token, {
      httpOnly: true,
      secure,
      sameSite: "strict",
      path: "/",
    });

    cookieStore.set("refresh_token", data.refresh_token, {
      httpOnly: true,
      secure,
      sameSite: "strict",
      path: "/",
    });

    cookieStore.set("expires_at", data.expires_at.toString(), {
      httpOnly: true,
      secure,
      sameSite: "strict",
      path: "/",
    });

    return Response.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
      user: data.user,
      message: "Login successful",
    });
  } catch (err) {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
