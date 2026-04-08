"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Leaf } from "lucide-react";

export default function DashboardPage() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user || !appUser) {
      router.replace("/login");
      return;
    }
    router.replace(`/dashboard/${appUser.role}`);
  }, [user, appUser, loading, router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 60, height: 60, borderRadius: 16, background: "var(--gradient-green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <Leaf size={28} color="white" />
        </div>
        <div className="spinner-lg spinner" style={{ margin: "0 auto" }} />
        <p style={{ color: "var(--text-secondary)", marginTop: "1.5rem", fontSize: "0.9rem" }}>Redirecting to your dashboard…</p>
      </div>
    </div>
  );
}
