import { getTokens } from "@/app/lib/auth/getTokens";

// UPDATE PROJECT
export async function PATCH(req, { params }) {
  const { access_token } = await getTokens();

  if (!access_token) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const res = await fetch(
    `${process.env.BASE_URL}/rest/v1/projects?id=eq.${params.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.API_KEY,
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();

  return Response.json(data);
}

