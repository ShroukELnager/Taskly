import Cookies from "js-cookie";

export const fetchTasksByStatus = async (
  projectId,
  status,
  searchValue = ""
) => {
  try {
    const token = Cookies.get("access_token");

    if (!token) {
      throw new Error("No access token found");
    }

    const limit = 100; // optional
    let url = `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/project_tasks?project_id=eq.${projectId}&status=eq.${status}&limit=${limit}`;

    // ✅ SAME LOGIC AS EPICS
    if (searchValue) {
      url += `&title=ilike.%25${searchValue}%25`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch: ${errorText}`);
    }

    const data = await res.json();
    return data ;
    console.log("fetchTasksByStatus data:", data);
  } catch (error) {
    console.error("fetchTasksByStatus error:", error);
    return [];
  }
};