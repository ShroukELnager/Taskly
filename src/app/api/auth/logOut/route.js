import { cookies } from "next/headers";
import { getTokens } from "@/app/lib/auth/getTokens";

export async function POST() {
  const cookieStore = await cookies();

  const { access_token } = await getTokens();

  if (!access_token) {
    return Response.json(
      { error: "No token found" },
      { status: 401 }
    );
  }

  await fetch(
    `${process.env.BASE_URL}/auth/v1/logout`,
    {
      method: "POST",
      headers: {
        apikey: process.env.API_KEY,
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  cookieStore.delete("expires_at");

  return Response.json({ message: "Logged out successfully" });
}