import { cookies } from "next/headers";

export async function getTokens() {
  const cookieStore = await cookies();

  return {
    access_token: cookieStore.get("access_token")?.value,
    refresh_token: cookieStore.get("refresh_token")?.value,
    expires_at: cookieStore.get("expires_at")?.value,
  };
}