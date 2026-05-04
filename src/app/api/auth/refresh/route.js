import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();

  const refresh_token = cookieStore.get("refresh_token")?.value;

  if (!refresh_token) {
    return Response.json({ error: "No refresh token" }, { status: 401 });
  }

  const res = await fetch(
    "https://pcufxstnppfqmzgslxlk.supabase.co/auth/v1/token?grant_type=refresh_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ refresh_token }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return Response.json(data, { status: 400 });
  }

  // update cookies
  cookieStore.set("access_token", data.access_token);
  cookieStore.set("expires_at", data.expires_at.toString());

  return Response.json({ success: true });
}