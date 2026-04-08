"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Utensils,
  Users,
  BarChart3,
  ArrowRight,
  Leaf,
  Heart,
  Zap,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stats = [
  { label: "Meals Saved", value: "10,000+", icon: Utensils, color: "#22c55e" },
  { label: "Active Volunteers", value: "500+", icon: Users, color: "#f97316" },
  { label: "Partner Restaurants", value: "200+", icon: Heart, color: "#8b5cf6" },
  { label: "Cities Covered", value: "15+", icon: BarChart3, color: "#3b82f6" },
];

const features = [
  {
    icon: Zap,
    title: "Real-time Updates",
    desc: "Food listings update instantly. Volunteers get notified the moment surplus food is available.",
    color: "#22c55e",
  },
  {
    icon: Shield,
    title: "Role-based Access",
    desc: "Separate portals for restaurants, volunteers, and admins with secure Firebase Authentication.",
    color: "#8b5cf6",
  },
  {
    icon: Leaf,
    title: "Zero Food Waste",
    desc: "Our AI-assisted matching ensures every surplus meal reaches someone who needs it most.",
    color: "#f97316",
  },
];

export default function LandingPage() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && appUser) {
      router.push("/dashboard");
    }
  }, [user, appUser, loading, router]);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* ── Navigation ── */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 2rem",
          borderBottom: "1px solid var(--border)",
          background: "rgba(10,15,30,0.8)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="AnnSeva Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: "1.25rem" }}>
              Ann<span className="gradient-text">Seva</span>
            </div>
            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
              ZERO FOOD WASTE
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link href="/login" className="btn btn-ghost btn-sm">
            Sign In
          </Link>
          <Link href="/signup" className="btn btn-primary btn-sm">
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          padding: "6rem 2rem 4rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Glows */}
        <div
          className="hero-glow"
          style={{
            background: "rgba(34,197,94,0.08)",
            top: -200,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <div
          className="hero-glow"
          style={{
            background: "rgba(139,92,246,0.06)",
            top: 100,
            right: -200,
            width: 400,
            height: 400,
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1rem",
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.25)",
              borderRadius: 999,
              marginBottom: "2rem",
              fontSize: "0.8rem",
              color: "#22c55e",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
                display: "inline-block",
              }}
            />
            Building a Zero Food Waste Ecosystem
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: "1.5rem",
            }}
          >
            Surplus Food,{" "}
            <span className="gradient-text">Zero Waste.</span>
            <br />
            Real Impact.
          </h1>

          <p
            style={{
              fontSize: "1.15rem",
              color: "var(--text-secondary)",
              maxWidth: 560,
              margin: "0 auto 2.5rem",
              lineHeight: 1.7,
            }}
          >
            AnnSeva connects restaurants with surplus food to volunteers who deliver
            it to underprivileged communities — in real time.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/signup" className="btn btn-primary btn-lg pulse-glow">
              <Utensils size={18} />
              Register as Restaurant
            </Link>
            <Link href="/signup" className="btn btn-secondary btn-lg">
              <Users size={18} />
              Join as Volunteer
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: "3rem 2rem" }}>
        <motion.div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1.25rem",
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpItem}
              className="stat-card"
              style={{ textAlign: "center" }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${s.color}18`,
                  border: `1px solid ${s.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                }}
              >
                <s.icon size={22} color={s.color} />
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: "3rem 2rem 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
              marginBottom: "0.75rem",
            }}
          >
            Why <span className="gradient-text">AnnSeva?</span>
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "var(--text-secondary)",
              marginBottom: "2.5rem",
              fontSize: "0.95rem",
            }}
          >
            A platform designed for efficiency, scale, and real-world impact.
          </p>

          <motion.div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUpItem}
                className="card"
                style={{ padding: "1.75rem" }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${f.color}15`,
                    border: `1px solid ${f.color}25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <f.icon size={22} color={f.color} />
                </div>
                <h3 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "4rem 2rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 700,
            margin: "0 auto",
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(139,92,246,0.08))",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 24,
            padding: "3rem 2rem",
          }}
        >
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", marginBottom: "1rem" }}>
            Ready to make a <span className="gradient-text">difference?</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", fontSize: "0.95rem" }}>
            Join thousands of restaurants and volunteers already building a
            zero-waste food ecosystem.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/signup" className="btn btn-primary btn-lg">
              Create Account <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="btn btn-ghost btn-lg">
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "1.5rem 2rem",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "0.8rem",
        }}
      >
        © {new Date().getFullYear()} AnnSeva · Built with ❤️ to end food waste
      </footer>
    </div>
  );
}
