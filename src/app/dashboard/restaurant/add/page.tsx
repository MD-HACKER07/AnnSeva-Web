"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import AddFoodModal from "@/components/AddFoodModal";

export default function AddFoodPage() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || appUser?.role !== "restaurant")) {
      router.replace("/login");
    }
  }, [user, appUser, loading, router]);

  if (loading) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content" style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "3rem" }}>
        {/* Inline the modal as a full page form */}
        <div style={{ width: "100%", maxWidth: 540 }}>
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>Add Food Listing</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Let volunteers know what surplus food is available
            </p>
          </div>
          <AddFoodModal onClose={() => router.push("/dashboard/restaurant")} inline />
        </div>
      </main>
    </div>
  );
}
