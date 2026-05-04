import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch(
      `${process.env.BASE_URL}/auth/v1/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.API_KEY,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return Response.json(data, { status: 400 });
    }

    return Response.json({
      user: data.user,
      message: "Signup successful",
    });
  } catch (err) {
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}