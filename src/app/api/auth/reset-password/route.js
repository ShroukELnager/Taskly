import { getTokens } from "@/app/lib/auth/getTokens";

export async function PUT(req) {
  try {
    const body = await req.json();

    const { access_token } = await getTokens();

    if (!access_token) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const res = await fetch(
      `${process.env.BASE_URL}/auth/v1/user`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.API_KEY,
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return Response.json(data, { status: 400 });
    }

    return Response.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}