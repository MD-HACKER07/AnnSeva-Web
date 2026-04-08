"use client";

import { useState, type FormEvent } from "react";
import { X, Utensils, MapPin, Clock, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { addFoodListing } from "@/lib/firestore";
import toast from "react-hot-toast";

interface Props {
  onClose: () => void;
  inline?: boolean;
}

export default function AddFoodModal({ onClose, inline = false }: Props) {
  const { user, appUser } = useAuth();
  const [form, setForm] = useState({
    foodName: "",
    quantity: "",
    description: "",
    expiryTime: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.foodName || !form.quantity || !form.expiryTime || !form.address)
      return toast.error("Please fill all required fields");
    if (!user || !appUser) return;

    setLoading(true);
    try {
      await addFoodListing({
        restaurantId: user.uid,
        restaurantName: appUser.name,
        foodName: form.foodName,
        quantity: form.quantity,
        description: form.description,
        expiryTime: form.expiryTime,
        address: form.address,
        location: appUser.location ?? { lat: 19.076, lng: 72.8777 },
        status: "available",
      });
      toast.success(`"${form.foodName}" listed successfully! 🎉`);
      onClose();
    } catch {
      toast.error("Failed to add listing. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const quantityOptions = [
    "1–5 servings", "5–10 servings", "10–20 servings",
    "20–50 servings", "50+ servings", "5 kg", "10 kg", "20 kg", "50 kg+",
  ];

  const content = (
    <div className={inline ? undefined : "modal-box animate-fadeIn"} style={inline ? { background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "2rem" } : undefined}>
      {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Add Food Listing</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: "0.2rem" }}>
              Let volunteers know what's available
            </p>
          </div>
          <button
            id="close-modal"
            onClick={onClose}
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid var(--border)", borderRadius: 8, padding: "0.4rem", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
          <div className="form-group">
            <label className="form-label">
              Food Item Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <Utensils size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                id="food-name"
                type="text"
                className="form-input"
                style={{ paddingLeft: "2.4rem" }}
                placeholder="e.g. Biryani, Roti Sabzi, Pizza…"
                value={form.foodName}
                onChange={set("foodName")}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Quantity / Servings <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select id="food-quantity" className="form-select" value={form.quantity} onChange={set("quantity")}>
              <option value="">Select quantity</option>
              {quantityOptions.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description (optional)</label>
            <textarea
              id="food-description"
              className="form-input"
              placeholder="Any dietary info, allergens, pickup instructions…"
              value={form.description}
              onChange={set("description")}
              rows={2}
              style={{ resize: "vertical", minHeight: 60 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Expiry / Best Before <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <Clock size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                id="food-expiry"
                type="datetime-local"
                className="form-input"
                style={{ paddingLeft: "2.4rem" }}
                value={form.expiryTime}
                onChange={set("expiryTime")}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Pickup Address <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <MapPin size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                id="food-address"
                type="text"
                className="form-input"
                style={{ paddingLeft: "2.4rem" }}
                placeholder="Full address for volunteer to find you"
                value={form.address}
                onChange={set("address")}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              Cancel
            </button>
            <button id="submit-food" type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? <Loader size={16} style={{ animation: "spin 1s linear infinite" }} /> : "List Food 🍱"}
            </button>
          </div>
        </form>
    </div>
  );

  if (inline) return content;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      {content}
    </div>
  );
}
