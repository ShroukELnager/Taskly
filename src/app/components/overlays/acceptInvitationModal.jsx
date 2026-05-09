"use client";

import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { acceptInvitation } from "@/app/services/invitation.service";

export default function AcceptInviteModal({ open, onClose, token: inviteToken }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = inviteToken || searchParams.get("token");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const mutation = useMutation({
    mutationFn: () => acceptInvitation(token),

    onSuccess: (result) => {
      setSuccessMsg("Invitation accepted successfully ");
      setErrorMsg("");

      setTimeout(() => {
        const projectId =
          result?.data?.project_id ||
          result?.data?.p_project_id ||
          result?.data?.[0]?.project_id;

        router.push(projectId ? `/projects` : "/projects");
      }, 1500);
    },

    onError: (err) => {
      if (err?.status === 401) {
        const redirectTo = token
          ? `/invite?token=${encodeURIComponent(token)}`
          : "/invite";

        router.replace(`/login?redirect=${encodeURIComponent(redirectTo)}`);
        return;
      }

      setErrorMsg(err.message || "Something went wrong");
      setSuccessMsg("");
    },
  });

  const handleAccept = () => {
    if (!token) {
      setErrorMsg("Invalid invitation link");
      return;
    }

    mutation.mutate();
  };

  if (!open) return null;
  if (typeof window === "undefined") return null;

  return createPortal(
  <div className="fixed inset-0 z-50 bg-[#F9F9FF] overflow-y-auto">
  
  <div className="flex w-full items-center gap-2 px-6 py-5">
    <Image src="/images/logo.svg" width={20} height={20} alt="logo" />
    <h1 className="text-xl font-bold">TASKLY</h1>
  </div>

  <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
    
    <div className="relative w-full max-w-[520px] rounded-xl bg-white p-8 text-center shadow-xl">
      
      <button
        onClick={onClose}
        className="absolute right-3 top-3"
      >
        <Image
          src="/images/close.png"
          alt="close"
          width={16}
          height={16}
        />
      </button>

      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-medium text-[#3B82F6]">
        <Image src="/images/new.png" width={16} height={16} alt="" />
        NEW PROJECT INVITATION
      </div>

      <h2 className="mb-6 text-xl font-semibold text-[#0F172A] sm:text-2xl">
        You’ve been invited to join <br />
        <span className="font-bold">a new project</span>
      </h2>

      {successMsg && (
        <p className="mb-4 text-sm text-green-600">{successMsg}</p>
      )}

      {errorMsg && (
        <p className="mb-4 text-sm text-red-500">{errorMsg}</p>
      )}

      <button
        onClick={handleAccept}
        disabled={mutation.isPending}
        className="h-12 w-full rounded-md bg-blue-700 text-white shadow-md transition hover:bg-blue-800 disabled:opacity-50"
      >
        {mutation.isPending ? "Accepting..." : "Accept Invitation"}
      </button>
    </div>
  </div>
</div>,
    document.getElementById("modal-root")
  );
}
