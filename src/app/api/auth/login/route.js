import { cookies } from "next/headers";

export async function POST(req) {
  BASE_URL = "https://pcufxstnppfqmzgslxlk.supabase.co/auth/v1/token";
  try {
    const body = await req.json();

    const res = await fetch(
      `${BASE_URL}?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey:'sb_publishable_z9TpvnjbZVBPDk9UUiePDg_VdLxmVOz',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();


    if (!res.ok) {
      return Response.json(data, { status: 400 });
    }

const cookieStore = await cookies();
    cookieStore.set("access_token", data.access_token, {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    cookieStore.set("refresh_token", data.refresh_token, {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    cookieStore.set("expires_at", data.expires_at.toString(), {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    return Response.json({
      user: data.user,
      message: "Login successful",
    });
  } catch (err) {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}