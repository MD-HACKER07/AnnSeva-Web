"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Utensils,
  CheckCircle,
  BarChart3,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getAllUsers, getFoodListings, getAllPickups, type AppUser, type FoodListing, type Pickup } from "@/lib/firestore";
import Sidebar from "@/components/Sidebar";

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export default function AdminDashboard() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [tab, setTab] = useState<"overview" | "users" | "listings">("overview");
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || appUser?.role !== "admin")) {
      router.replace("/login");
    }
  }, [user, appUser, loading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([getAllUsers(), getFoodListings(), getAllPickups()]).then(([u, l, p]) => {
      setUsers(u);
      setListings(l);
      setPickups(p);
      setDataLoading(false);
    });
  }, [user]);

  const stats = {
    totalUsers: users.length,
    restaurants: users.filter((u) => u.role === "restaurant").length,
    volunteers: users.filter((u) => u.role === "volunteer").length,
    totalListings: listings.length,
    delivered: pickups.filter((p) => p.status === "delivered").length,
    active: listings.filter((l) => l.status === "available").length,
  };

  if (loading || dataLoading) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>Admin Dashboard</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Platform overview & management 🛡️
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.75rem" }}>
          {(["overview", "users", "listings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`btn ${tab === t ? "btn-primary" : "btn-secondary"} btn-sm`}
            >
              {t === "overview" ? "📊 Overview" : t === "users" ? "👥 Users" : "🍱 Listings"}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === "overview" && (
          <>
            <div className="grid-3" style={{ marginBottom: "2rem" }}>
              {[
                { label: "Total Users", value: stats.totalUsers, icon: Users, color: "#3b82f6" },
                { label: "Restaurants", value: stats.restaurants, icon: Utensils, color: "#f97316" },
                { label: "Volunteers", value: stats.volunteers, icon: TrendingUp, color: "#22c55e" },
                { label: "Total Listings", value: stats.totalListings, icon: BarChart3, color: "#8b5cf6" },
                { label: "Deliveries Done", value: stats.delivered, icon: CheckCircle, color: "#22c55e" },
                { label: "Available Now", value: stats.active, icon: AlertCircle, color: "#eab308" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="stat-card"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{s.label}</div>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}15`, border: `1px solid ${s.color}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <s.icon size={17} color={s.color} />
                    </div>
                  </div>
                  <div style={{ fontSize: "2.25rem", fontWeight: 800, color: s.color }}>{s.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 600 }}>Recent Pickups</h2>
              </div>
              <div className="table-container" style={{ border: "none", borderRadius: 0 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Food</th>
                      <th>Restaurant</th>
                      <th>Volunteer</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pickups.slice(0, 10).map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 600 }}>{p.foodName}</td>
                        <td style={{ color: "var(--text-secondary)" }}>{p.restaurantName}</td>
                        <td style={{ color: "var(--text-secondary)" }}>{p.volunteerName}</td>
                        <td><StatusBadge status={p.status} /></td>
                      </tr>
                    ))}
                    {pickups.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                          No pickups yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 600 }}>All Users</h2>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{users.length} registered</span>
            </div>
            <div className="table-container" style={{ border: "none", borderRadius: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.uid}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{u.email}</td>
                      <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{u.phone}</td>
                      <td><StatusBadge status={u.role} /></td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                        No users yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {tab === "listings" && (
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 600 }}>All Food Listings</h2>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{listings.length} total</span>
            </div>
            <div className="table-container" style={{ border: "none", borderRadius: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Food Item</th>
                    <th>Restaurant</th>
                    <th>Quantity</th>
                    <th>Expiry</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((l) => (
                    <tr key={l.id}>
                      <td style={{ fontWeight: 600 }}>{l.foodName}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{l.restaurantName}</td>
                      <td>{l.quantity}</td>
                      <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{l.expiryTime}</td>
                      <td><StatusBadge status={l.status} /></td>
                    </tr>
                  ))}
                  {listings.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                        No listings yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
