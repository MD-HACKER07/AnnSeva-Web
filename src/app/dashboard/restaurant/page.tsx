"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Utensils,
  PackageCheck,
  Truck,
  Clock,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  listenRestaurantListings,
  deleteFoodListing,
  type FoodListing,
} from "@/lib/firestore";
import Sidebar from "@/components/Sidebar";
import AddFoodModal from "@/components/AddFoodModal";
import toast from "react-hot-toast";

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: React.ElementType; color: string }) {
  return (
    <div className="stat-card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500 }}>{label}</div>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={17} color={color} />
        </div>
      </div>
      <div style={{ fontSize: "2.25rem", fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

export default function RestaurantDashboard() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (!loading && (!user || appUser?.role !== "restaurant")) {
      router.replace("/login");
    }
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

  const stats = {
    total: listings.length,
    available: listings.filter((l) => l.status === "available").length,
    picked: listings.filter((l) => l.status === "picked").length,
    completed: listings.filter((l) => l.status === "completed").length,
  };

  if (loading) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>Restaurant Dashboard</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Welcome back, <strong style={{ color: "var(--text-primary)" }}>{appUser?.name}</strong> 👋
            </p>
          </div>
          <button id="add-food-btn" className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Add Food
          </button>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: "2rem" }}>
          {[
            { label: "Total Listed", value: stats.total, icon: Utensils, color: "#22c55e" },
            { label: "Available", value: stats.available, icon: Clock, color: "#3b82f6" },
            { label: "Being Picked", value: stats.picked, icon: Truck, color: "#f97316" },
            { label: "Completed", value: stats.completed, icon: PackageCheck, color: "#8b5cf6" },
          ].map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>

        {/* Listings Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600 }}>My Food Listings</h2>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{listings.length} total</span>
          </div>

          {listings.length === 0 ? (
            <div className="empty-state">
              <AlertCircle size={48} />
              <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>No listings yet</h3>
              <p style={{ fontSize: "0.875rem" }}>Click &quot;Add Food&quot; to create your first listing</p>
            </div>
          ) : (
            <div className="table-container" style={{ border: "none", borderRadius: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Food Item</th>
                    <th>Quantity</th>
                    <th>Expiry</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((l) => (
                    <tr key={l.id}>
                      <td style={{ fontWeight: 600 }}>{l.foodName}</td>
                      <td>{l.quantity}</td>
                      <td style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{l.expiryTime}</td>
                      <td style={{ color: "var(--text-secondary)", fontSize: "0.8rem", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.address}</td>
                      <td><StatusBadge status={l.status} /></td>
                      <td>
                        {l.status === "available" && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(l.id!)}>
                            <Trash2 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showAdd && <AddFoodModal onClose={() => setShowAdd(false)} />}
      </main>
    </div>
  );
}
