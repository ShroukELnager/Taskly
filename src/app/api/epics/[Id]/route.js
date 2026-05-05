import { getTokens } from "@/app/lib/auth/getTokens";

const apiKey = process.env.API_KEY?.trim();
const baseUrl = "https://pcufxstnppfqmzgslxlk.supabase.co";

function handleError(message, status = 500) {
  return Response.json({ error: message }, { status });
}

export async function PATCH(req, { params }) {
  try {
    const { access_token } = await getTokens();

    if (!access_token) {
      return handleError("Unauthorized", 401);
    }

    const routeParams = await params;
    const id = routeParams?.Id ?? routeParams?.id;

    if (!id) {
      return handleError("id is required", 400);
    }

    const body = await req.json();

    if (body.deadline === "") {
      body.deadline = null;
    }

    if (body.assignee_id === "") {
      body.assignee_id = null;
    }

    const res = await fetch(
      `${baseUrl}/rest/v1/epics?id=eq.${id}`,
      {
        method: "PATCH",
        headers: {
          apikey: apiKey,
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return handleError(data?.message || "Failed to update epic", res.status);
    }

    return Response.json({
      message: "Epic updated successfully",
      data,
    });
  } catch (err) {
    return handleError(err.message || "Something went wrong");
  }
}
