"use client";

import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";

/* ================= DEBOUNCE HOOK ================= */
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function EpicDetailsModal({
  isOpen,
  onClose,
  epicId,
  projectId,onUpdateEpic
}) {
  const [epic, setEpic] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee_id: "",
    created_at: "",
  });

  const fetchDetails = async () => {
    if (!epicId) return;

    try {
      setLoading(true);

      const token = Cookies.get("access_token");

      const res = await fetch(
        `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/project_epics?project_id=eq.${projectId}&id=eq.${epicId}`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      const epicData = data[0];

      setEpic(epicData);

      setFormData({
        title: epicData.title || "",
        description: epicData.description || "",
        assignee_id: epicData.assignee_id || "",
        created_at: epicData.created_at?.split("T")[0] || "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const token = Cookies.get("access_token");

      const res = await fetch(
        `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/get_project_members?project_id=eq.${projectId}`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setMembers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDetails();
      fetchMembers();
    }
  }, [isOpen]);
const lastSentValues = useRef({});
const handleUpdate = async (field, value) => {
  if (!epicId) return;
  if (!epic) return;

  if (epic?.[field] === value) return;

  if (lastSentValues.current[field] === value) return;

  try {
    const token = Cookies.get("access_token");

    const res = await fetch(
      `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/epics?id=eq.${epicId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          [field]: value,
        }),
      }
    );

    if (!res.ok) return;

    const updatedEpic = {
      ...epic,
      [field]: value,
    };

    lastSentValues.current[field] = value;

    setEpic(updatedEpic);

    if (onUpdateEpic) {
      onUpdateEpic(updatedEpic);
    }

  } catch (err) {
    console.error(err);
  }
};

  const debouncedTitle = useDebounce(formData.title);
  const debouncedDescription = useDebounce(formData.description);
  const debouncedAssignee = useDebounce(formData.assignee_id);
  const debouncedDate = useDebounce(formData.created_at);

  useEffect(() => {
    if (epic) handleUpdate("title", debouncedTitle);
  }, [debouncedTitle]);

  useEffect(() => {
    if (epic) handleUpdate("description", debouncedDescription);
  }, [debouncedDescription]);

  useEffect(() => {
    if (epic) handleUpdate("assignee_id", debouncedAssignee);
  }, [debouncedAssignee]);

  useEffect(() => {
    if (epic) handleUpdate("created_at", debouncedDate);
  }, [debouncedDate]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50"
    >
      <div className="w-full sm:max-w-3xl sm:px-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full h-[95vh] sm:h-auto rounded-t-2xl sm:rounded-2xl shadow-lg overflow-y-auto"
        >
          <div className="p-5 sm:p-6 relative">

            <button onClick={onClose} className="absolute right-5 top-5">
              <Image
                src="/images/close.png"
                width={18}
                height={18}
                alt="close"
              />
            </button>

            {loading ? (
              <p className="text-center py-10">Loading...</p>
            ) : epic ? (
              <>
                <div className="mb-5">
                  <p className="text-xs font-semibold text-blue-600 mb-1">
                    {epic.epic_id}
                  </p>

                  <input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        title: e.target.value,
                      }))
                    }
                    className="text-xl font-semibold w-full outline-none"
                  />
                </div>

                <div className="mb-5">
                  <p className="text-xs text-gray-400 uppercase mb-1">
                    Description
                  </p>

                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    className="text-sm text-gray-500 w-full outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">

                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1">
                      Created By
                    </p>
                    <p>{epic.created_by?.name || "—"}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1">
                      Assignee
                    </p>

                    <select
                      value={formData.assignee_id}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          assignee_id: e.target.value,
                        }))
                      }
                      className="w-full bg-[#D7E2FF] px-3 py-2 rounded-md"
                    >

                      {members.map((m) => (
                        <option key={m.user_id} value={m.user_id}>
                          {m.metadata?.name || m.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1">
                      Created At
                    </p>

                    <input
                      type="date"
                      value={formData.created_at}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          created_at: e.target.value,
                        }))
                      }
                      className="border px-2 py-1 rounded-md w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Tasks</h3>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                    0 TASKS
                  </span>
                </div>

                <div className="border border-dashed rounded-xl p-8 text-center bg-gray-50">
                  <p className="text-gray-500 text-sm">
                    No tasks have been added yet
                  </p>

                  <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md">
                    + Add Task
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center py-10">No Data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}