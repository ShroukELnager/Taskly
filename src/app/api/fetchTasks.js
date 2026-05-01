import Cookies from "js-cookie";

export const fetchTasksByStatus = async (projectId, status) => {
  try {
    const token = Cookies.get("access_token");

    if (!token) {
      throw new Error("No access token found");
    }

    const res = await fetch(
      `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/project_tasks?project_id=eq.${projectId}&status=eq.${status}`,
      {
        method: "GET",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch: ${errorText}`);
    }

    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error("fetchTasksByStatus error:", error);
    throw error;
  }
};