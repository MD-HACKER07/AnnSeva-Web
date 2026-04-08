"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf, Mail, Lock, User, Phone, ChevronDown, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/lib/firestore";
import toast from "react-hot-toast";

const roles: { value: UserRole; label: string; desc: string; emoji: string }[] = [
  { value: "restaurant", label: "Restaurant", desc: "I have surplus food to donate", emoji: "🏪" },
  { value: "volunteer", label: "Volunteer", desc: "I want to help distribute food", emoji: "🙋" },
  { value: "admin", label: "Admin", desc: "Platform administrator", emoji: "🛡️" },
];

export default function SignupPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [role, setRole] = useState<UserRole>("restaurant");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password)
      return toast.error("Please fill all fields");
    if (form.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await signUp(form.email, form.password, form.name, form.phone, role);
      toast.success(`Account created! Welcome, ${form.name}!`);
      router.push("/dashboard");
    } catch (err: any) {
      const msg =
        err.code === "auth/email-already-in-use"
          ? "Email already in use"
          : "Signup failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ padding: "2rem" }}>
      <div className="hero-glow" style={{ background: "rgba(34,197,94,0.1)", top: -150, right: -100, width: 400, height: 400 }} />
      <div className="hero-glow" style={{ background: "rgba(249,115,22,0.07)", bottom: -100, left: -100, width: 350, height: 350 }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-card"
        style={{ maxWidth: 480 }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--gradient-green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Leaf size={22} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: "1.3rem" }}>
              Ann<span className="gradient-text">Seva</span>
            </div>
            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>ZERO FOOD WASTE</div>
          </div>
        </div>

        <h1 style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>Create account</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          Join AnnSeva and start making a difference
        </p>

        {/* Role Selector */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {roles.map((r) => (
            <button
              key={r.value}
              id={`role-${r.value}`}
              type="button"
              onClick={() => setRole(r.value)}
              style={{
                padding: "0.75rem 0.5rem",
                borderRadius: 10,
                border: role === r.value ? "1.5px solid var(--accent-green)" : "1.5px solid var(--border)",
                background: role === r.value ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.03)",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>{r.emoji}</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: role === r.value ? "var(--accent-green)" : "var(--text-primary)" }}>
                {r.label}
              </div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: "relative" }}>
              <User size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input id="signup-name" type="text" className="form-input" style={{ paddingLeft: "2.5rem" }} placeholder="John Doe" value={form.name} onChange={set("name")} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input id="signup-email" type="email" className="form-input" style={{ paddingLeft: "2.5rem" }} placeholder="you@example.com" value={form.email} onChange={set("email")} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div style={{ position: "relative" }}>
              <Phone size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input id="signup-phone" type="tel" className="form-input" style={{ paddingLeft: "2.5rem" }} placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                id="signup-password"
                type={showPass ? "text" : "password"}
                className="form-input"
                style={{ paddingLeft: "2.5rem", paddingRight: "3rem" }}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={set("password")}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button id="signup-submit" type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem", padding: "0.875rem" }} disabled={loading}>
            {loading ? <div className="spinner" /> : <>Create Account <ArrowRight size={16} /></>}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--accent-green)", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
