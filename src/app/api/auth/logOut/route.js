import { cookies } from "next/headers";
import { getTokens } from "@/app/lib/auth/getTokens";

export async function POST() {
  const cookieStore = await cookies();

  const { access_token } = await getTokens();

  if (!access_token) {
    return Response.json({ error: "No token found" }, { status: 401 });
  }

  const apiKey = process.env.API_KEY?.trim();
  const baseUrl = "https://pcufxstnppfqmzgslxlk.supabase.co/auth/v1";

  if (!apiKey) {
    return Response.json({ error: "Missing API key" }, { status: 500 });
  }

  await fetch(`${baseUrl}/logout`, {
    method: "POST",
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${access_token}`,
    },
  });

  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  cookieStore.delete("expires_at");
  cookieStore.delete("access_token_expiry");

  return Response.json({ message: "Logged out successfully" });
}
