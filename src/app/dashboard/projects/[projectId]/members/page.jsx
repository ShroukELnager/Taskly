"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function MembersPage() {
  const { projectId } = useParams();

  // ================= STATE =================
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH =================
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError("");

        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token="))
          ?.split("=")[1];

        const res = await fetch(
          `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/get_project_members?project_id=eq.${projectId}`,
          {
            method: "GET",
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        setMembers(data);
      } catch (err) {
        setError("Failed to load project members. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchMembers();
  }, [projectId]);

  // ================= INITIALS =================
  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="p-6">

      {/* ================= HEADER ================= */}
    <div className="flex justify-end mb-6">
  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
    Invite Member
  </button>
</div>

      {/* ================= ERROR ================= */}
      {error && (
        <p className="text-red-500 mb-4 text-sm">{error}</p>
      )}

      {/* ================= LOADING ================= */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 p-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-300 rounded-lg" />
              <div className="flex flex-col gap-2">
                <div className="w-40 h-3 bg-gray-300 rounded" />
                <div className="w-60 h-3 bg-gray-300 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (

        // ================= TABLE =================
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          {/* HEADER */}
          <div className="grid grid-cols-3 p-4 text-xs text-gray-500 font-medium border-b">
            <p>MEMBER</p>
            <p>ROLE</p>
            <p>ACTIONS</p>
          </div>

          {/* ROWS */}
          {members.map((member, index) => (
            <div
              key={index}

              // ================= BLUE LIGHT BORDER BOTTOM =================
              className="grid grid-cols-3 items-center p-4 border-b border-blue-100 hover:bg-blue-50 transition"
            >

              {/* ================= MEMBER ================= */}
              <div className="flex items-center gap-3">

                {/* avatar (LIKE NAVBAR STYLE) */}
                <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-lg font-semibold">
                  {getInitials(member.metadata?.name)}
                </div>

                {/* name + email */}
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{member.metadata?.name}</p>
                  <p className="text-xs text-gray-500">{member.metadata?.email}</p>
                </div>

              </div>

              {/* ================= ROLE ================= */}
              <div>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                  {member.role}
                </span>
              </div>

              {/* ================= ACTION ================= */}
              <div className=" cursor-pointer ml-6">
                ⋮
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}