"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AcceptInviteModal from "@/app/components/overlays/acceptInvitationModal";

export default function InvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [open, setOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!token) {
      router.replace("/");
      return;
    }

    const loginRedirect = `/login?redirect=${encodeURIComponent(
      `/invite?token=${encodeURIComponent(token)}`
    )}`;

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          router.replace(loginRedirect);
          return;
        }

        setOpen(true);
      } catch {
        router.replace(loginRedirect);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [token, router]);

  if (checkingAuth) return null;

  return (
    <AcceptInviteModal
      open={open}
      token={token} 
      onClose={() => router.replace("/")}
    />
  );
}