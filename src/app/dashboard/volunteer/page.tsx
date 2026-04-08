"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  Package,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  listenAvailableListings,
  getVolunteerPickups,
  createPickup,
  updatePickupStatus,
  updateFoodStatus,
  type FoodListing,
  type Pickup,
} from "@/lib/firestore";
import Sidebar from "@/components/Sidebar";
import MapView from "@/components/MapView";
import toast from "react-hot-toast";

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export default function VolunteerDashboard() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();
  const [available, setAvailable] = useState<FoodListing[]>([]);
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [tab, setTab] = useState<"browse" | "active">("browse");
  const [accepting, setAccepting] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || appUser?.role !== "volunteer")) {
      router.replace("/login");
    }
  }, [user, appUser, loading, router]);

  useEffect(() => {
    const unsub = listenAvailableListings(setAvailable);
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    getVolunteerPickups(user.uid).then(setPickups);
  }, [user]);

  const handleAccept = async (listing: FoodListing) => {
    if (!user || !appUser) return;
    setAccepting(listing.id!);
    try {
      await updateFoodStatus(listing.id!, "picked", user.uid);
      await createPickup({
        foodId: listing.id!,
        foodName: listing.foodName,
        restaurantName: listing.restaurantName,
        address: listing.address,
        volunteerId: user.uid,
        volunteerName: appUser.name,
        status: "accepted",
      });
      // Refresh pickups
      const updated = await getVolunteerPickups(user.uid);
      setPickups(updated);
      toast.success(`Pickup accepted! Head to ${listing.address}`);
      setTab("active");
    } catch {
      toast.error("Could not accept. Try again.");
    } finally {
      setAccepting(null);
    }
  };

  const handleUpdateStatus = async (pickup: Pickup, newStatus: "picked" | "delivered") => {
    try {
      await updatePickupStatus(pickup.id!, newStatus);
      if (newStatus === "delivered") {
        await updateFoodStatus(pickup.foodId, "completed");
      }
      const updated = await getVolunteerPickups(user!.uid);
      setPickups(updated);
      toast.success(newStatus === "delivered" ? "🎉 Delivery complete!" : "Status updated!");
    } catch {
      toast.error("Update failed.");
    }
  };

  const activePickups = pickups.filter((p) => p.status !== "delivered");
  const completedPickups = pickups.filter((p) => p.status === "delivered");

  if (loading) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>Volunteer Dashboard</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Hello, <strong style={{ color: "var(--text-primary)" }}>{appUser?.name}</strong>! Ready to make a difference? 🙋
          </p>
        </div>

        {/* Stats */}
        <div className="grid-3" style={{ marginBottom: "2rem" }}>
          {[
            { label: "Available Nearby", value: available.length, color: "#22c55e", icon: MapPin },
            { label: "Active Pickups", value: activePickups.length, color: "#f97316", icon: Package },
            { label: "Completed", value: completedPickups.length, color: "#8b5cf6", icon: CheckCircle },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {(["browse", "active"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`btn ${tab === t ? "btn-primary" : "btn-secondary"} btn-sm`}
            >
              {t === "browse" ? "🗺️ Browse Food" : `📦 My Pickups (${activePickups.length})`}
            </button>
          ))}
        </div>

        {/* Browse Tab */}
        {tab === "browse" && (
          <div>
            {/* Map */}
            <div style={{ marginBottom: "1.5rem" }}>
              <MapView listings={available} />
            </div>

            {/* Listings */}
            {available.length === 0 ? (
              <div className="card empty-state">
                <AlertCircle size={48} />
                <h3>No food available right now</h3>
                <p>Check back soon — restaurants update listings throughout the day</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                {available.map((listing, i) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card"
                    style={{ padding: "1.25rem" }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                      <div>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.25rem" }}>{listing.foodName}</h3>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>by {listing.restaurantName}</p>
                      </div>
                      <StatusBadge status={listing.status} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                        <Package size={13} color="var(--accent-green)" />
                        <span>{listing.quantity}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                        <Clock size={13} color="#f97316" />
                        <span>Expires: {listing.expiryTime}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                        <MapPin size={13} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span>{listing.address}</span>
                      </div>
                    </div>

                    {listing.description && (
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem", lineHeight: 1.5 }}>
                        {listing.description}
                      </p>
                    )}

                    <button
                      id={`accept-${listing.id}`}
                      className="btn btn-primary"
                      style={{ width: "100%" }}
                      onClick={() => handleAccept(listing)}
                      disabled={accepting === listing.id}
                    >
                      {accepting === listing.id ? <div className="spinner" /> : <><Truck size={15} /> Accept Pickup</>}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active Pickups Tab */}
        {tab === "active" && (
          <div>
            {activePickups.length === 0 ? (
              <div className="card empty-state">
                <Package size={48} />
                <h3>No active pickups</h3>
                <p>Browse available food and accept a pickup to get started</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {activePickups.map((pickup) => (
                  <motion.div
                    key={pickup.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card"
                    style={{ padding: "1.25rem" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                      <div>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>{pickup.foodName}</h3>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>from {pickup.restaurantName}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem", fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                          <MapPin size={13} color="#3b82f6" />
                          <span>{pickup.address}</span>
                        </div>
                      </div>
                      <StatusBadge status={pickup.status} />
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
                      {pickup.status === "accepted" && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleUpdateStatus(pickup, "picked")}
                        >
                          <Package size={14} /> Mark as Picked
                        </button>
                      )}
                      {pickup.status === "picked" && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleUpdateStatus(pickup, "delivered")}
                          style={{ background: "var(--gradient-blue)" }}
                        >
                          <CheckCircle size={14} /> Mark as Delivered
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {completedPickups.length > 0 && (
              <div style={{ marginTop: "2rem" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "var(--text-secondary)" }}>
                  ✅ Completed ({completedPickups.length})
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {completedPickups.map((pickup) => (
                    <div key={pickup.id} className="card" style={{ padding: "1rem", opacity: 0.7 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{pickup.foodName}</span>
                          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginLeft: "0.5rem" }}>from {pickup.restaurantName}</span>
                        </div>
                        <StatusBadge status="delivered" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
