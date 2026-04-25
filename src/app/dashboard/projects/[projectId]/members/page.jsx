"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MembersSkeleton from "@/app/components/skeleton/member";
import EpicsError from "@/app/components/errorsPages/epics";
import Image from "next/image";

export default function MembersPage() {
  const { projectId } = useParams();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      console.log(data)
      setMembers(data);
    } catch (err) {
      setError("Failed to load project members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchMembers();
  }, [projectId]);

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (loading) return <MembersSkeleton />;

  if (error) return <EpicsError fetchEpics={fetchMembers} />;

  if (members.length === 0)
    return (
      <div className="p-6 text-center text-gray-500">
        No members found in this project.
      </div>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-x-hidden">

      {/* TITLE */}
  
<h1 className="text-2xl font-semibold text-center lg:text-left mb-6">
  Project Members
</h1>
      {/* HEADER BUTTON (desktop only) */}
      <div className="hidden sm:flex justify-end mb-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition flex items-center gap-2">
          <Image
            src="/images/invite.svg"
            alt="Invite"
            width={16}
            height={16}
          />
          Invite Member
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {/* HEADER ROW (hidden mobile) */}
        <div className="hidden sm:grid grid-cols-3 p-4 text-xs text-gray-500 font-medium border-b">
          <p>MEMBER</p>
          <p>ROLE</p>
          <p>ACTIONS</p>
        </div>

        {/* ROWS */}
        {members.map((member, index) => {
          const name = member.metadata?.name || "Unknown";
          const email = member.metadata?.email || "-";

          return (
            <div
              key={index}
              className="
                flex flex-col sm:grid sm:grid-cols-3
                gap-3 sm:gap-0
                p-4 border-b border-blue-100
                hover:bg-blue-50 transition
              "
            >
              {/* MEMBER + ROLE (mobile) */}
              <div className="flex items-center justify-between gap-3 min-w-0">

                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-lg font-semibold shrink-0">
                    {getInitials(name)}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-medium truncate">{name}</p>
                    <p className="text-xs text-gray-500 truncate">{email}</p>
                  </div>
                </div>

                {/* ROLE (mobile only) */}
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full sm:hidden">
                  {member.role}
                </span>
              </div>

              {/* ROLE (desktop) */}
              <div className="hidden sm:block">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                  {member.role}
                </span>
              </div>

              {/* ACTION */}
              <div className="flex justify-end sm:block cursor-pointer text-lg text-gray-500 ml-6">
                ⋮
              </div>
            </div>
          );
        })}
      </div>

      {/* FLOAT BUTTON (mobile only) */}
      <button
        className="
          sm:hidden
          fixed bottom-6 right-6
          w-12 h-12
          flex items-center justify-center
          rounded-full
          bg-blue-600 text-white shadow-lg
          hover:bg-blue-700 transition
        "
      >
        <Image
          src="/images/invite.svg"
          alt="Invite"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
}