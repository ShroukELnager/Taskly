import Cookies from "js-cookie";

export async function getTaskDetails(projectId, taskId) {
 

  const token = Cookies.get("access_token");

  const res = await fetch(
    `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/project_tasks?project_id=eq.${projectId}&id=eq.${taskId}`,
    {
      method: "GET",
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch task");

  const data = await res.json();
  return data?.[0] || null;
}