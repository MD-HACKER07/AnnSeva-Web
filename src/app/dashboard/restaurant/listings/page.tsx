"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { listenRestaurantListings, deleteFoodListing, type FoodListing } from "@/lib/firestore";
import Sidebar from "@/components/Sidebar";
import AddFoodModal from "@/components/AddFoodModal";
import toast from "react-hot-toast";
import Link from "next/link";

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export default function ListingsPage() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<"all" | "available" | "picked" | "completed">("all");

  useEffect(() => {
    if (!loading && (!user || appUser?.role !== "restaurant")) router.replace("/login");
  }, [user, appUser, loading, router]);

  useEffect(() => {
    if (!user) return;
    const unsub = listenRestaurantListings(user.uid, setListings);
    return unsub;
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this listing?")) return;
    try {
      await deleteFoodListing(id);
      toast.success("Listing removed");
    } catch {
      toast.error("Failed to remove");
    }
  };

  const filtered = filter === "all" ? listings : listings.filter((l) => l.status === filter);

  if (loading) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>My Listings</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{listings.length} total food listings</p>
          </div>
          <button id="add-food-btn" className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={15} /> Add Food
          </button>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {(["all", "available", "picked", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`}
            >
              {f === "all" ? `All (${listings.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${listings.filter(l => l.status === f).length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="card empty-state">
            <AlertCircle size={48} />
            <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
              {filter === "all" ? "No listings yet" : `No ${filter} listings`}
            </h3>
            <p style={{ fontSize: "0.875rem" }}>
              {filter === "all" ? (
                <>Click <strong>Add Food</strong> to create your first listing</>
              ) : (
                "Try a different filter"
              )}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {filtered.map((l, i) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card"
                style={{ padding: "1.25rem" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>{l.foodName}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: "0.2rem" }}>{l.quantity}</p>
                  </div>
                  <StatusBadge status={l.status} />
                </div>

                {l.description && (
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem", lineHeight: 1.5 }}>
                    {l.description}
                  </p>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  <span>⏰ Expires: {l.expiryTime}</span>
                  <span>📍 {l.address}</span>
                  {l.pickedBy && <span>🙋 Picked by volunteer</span>}
                </div>

                {l.status === "available" && (
                  <button className="btn btn-danger btn-sm" style={{ width: "100%" }} onClick={() => handleDelete(l.id!)}>
                    <Trash2 size={13} /> Remove Listing
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {showAdd && <AddFoodModal onClose={() => setShowAdd(false)} />}
      </main>
    </div>
  );
}
