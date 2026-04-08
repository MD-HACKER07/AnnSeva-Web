"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Utensils,
  Users,
  ArrowRight,
  Heart,
  Zap,
  Shield,
  Sparkles,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stats = [
  { label: "Meals Saved", value: "10,000+", icon: Utensils, color: "#22c55e" },
  { label: "Active Volunteers", value: "500+", icon: Users, color: "#a78bfa" },
  { label: "Restaurants", value: "200+", icon: Heart, color: "#f97316" },
  { label: "Cities Active", value: "15+", icon: MapPin, color: "#38bdf8" },
];

const features = [
  {
    icon: Zap,
    title: "Real-time Updates",
    desc: "Food listings update instantly. Volunteers get notified the moment surplus food becomes available near them.",
    color: "#22c55e",
    gradient: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.03))",
    border: "rgba(34,197,94,0.3)",
  },
  {
    icon: Shield,
    title: "Role-based Access",
    desc: "Secure portals for restaurants, volunteers, and admins — each with tailored dashboards and Firebase Auth.",
    color: "#a78bfa",
    gradient: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.03))",
    border: "rgba(139,92,246,0.3)",
  },
  {
    icon: TrendingUp,
    title: "Impact Analytics",
    desc: "Track meals saved, active deliveries, and community impact with beautiful real-time analytics dashboards.",
    color: "#38bdf8",
    gradient: "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(56,189,248,0.03))",
    border: "rgba(56,189,248,0.3)",
  },
];

const howItWorks = [
  { step: "01", title: "Restaurant Lists Food", desc: "Surplus food posted with quantity, expiry & location", icon: Utensils, color: "#f97316" },
  { step: "02", title: "Volunteer Accepts", desc: "Nearest volunteer picks up the assignment instantly", icon: CheckCircle2, color: "#22c55e" },
  { step: "03", title: "Food Delivered", desc: "Meals reach underprivileged communities within hours", icon: Heart, color: "#a78bfa" },
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
    <div className="landing-page">
      {/* ── Navigation ── */}
      <nav className="landing-nav">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="AnnSeva Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ fontFamily: "Space Grotesk", fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-0.02em" }}>
              Ann<span className="hero-gradient-text">Seva</span>
            </div>
            <div style={{ fontSize: "0.6rem", color: "#475569", letterSpacing: "0.14em", fontWeight: 600 }}>ZERO FOOD WASTE</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link href="/login" className="hero-cta-secondary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem", borderRadius: 10 }}>
            Sign In
          </Link>
          <Link href="/signup" className="hero-cta-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem", borderRadius: 10 }}>
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-bg-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ position: "relative", zIndex: 1, maxWidth: 850, margin: "0 auto" }}
        >
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Building India&apos;s Zero Food Waste Ecosystem
          </div>

          <h1 className="hero-title">
            Surplus Food,{" "}
            <span className="hero-gradient-text">Zero Waste.</span>
            <br />
            Real Impact.
          </h1>

          <p className="hero-subtitle">
            AnnSeva connects restaurants with surplus food to volunteers who
            deliver it to underprivileged communities —{" "}
            <strong style={{ color: "#c8d5e6" }}>in real time.</strong>
          </p>

          <div className="hero-cta-group">
            <Link href="/signup" className="hero-cta-primary">
              <Utensils size={18} />
              Register as Restaurant
            </Link>
            <Link href="/signup" className="hero-cta-secondary">
              <Users size={18} />
              Join as Volunteer
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-section">
        <motion.div
          className="stats-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUpItem} className="stat-item">
              <div
                className="stat-icon-wrap"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}
              >
                <s.icon size={22} color={s.color} />
              </div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── How It Works ── */}
      <section className="features-section" style={{ paddingBottom: "2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div className="section-eyebrow">
            <Clock size={14} /> How It Works
          </div>
          <h2 className="section-title">
            Three Steps to <span className="hero-gradient-text">Save Food</span>
          </h2>
          <p className="section-desc">
            From surplus to served — our streamlined process ensures no meal goes to waste.
          </p>

          <motion.div
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", textAlign: "left" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {howItWorks.map((item) => (
              <motion.div
                key={item.step}
                variants={fadeUpItem}
                style={{
                  background: "rgba(15,22,40,0.6)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 20,
                  padding: "2rem",
                  position: "relative",
                }}
              >
                <div style={{ fontSize: "3rem", fontWeight: 900, fontFamily: "Space Grotesk", color: `${item.color}15`, position: "absolute", top: 16, right: 20, lineHeight: 1 }}>
                  {item.step}
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${item.color}15`, border: `1px solid ${item.color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                  <item.icon size={20} color={item.color} />
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.4rem", color: "#f1f5f9" }}>{item.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "#7b8ba6", lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section">
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <div className="section-eyebrow">
            <Sparkles size={14} /> Why AnnSeva
          </div>
          <h2 className="section-title">
            Built for <span className="hero-gradient-text">Real-World Impact</span>
          </h2>
          <p className="section-desc">
            A platform designed for efficiency, scale, and meaningful change.
          </p>

          <motion.div
            className="feature-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUpItem}
                className="feature-card"
                style={{ textAlign: "left" }}
              >
                <div
                  style={{ content: "", position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`, borderRadius: "20px 20px 0 0", opacity: 0.5 }}
                />
                <div
                  className="feature-icon-wrap"
                  style={{ background: f.gradient, border: `1px solid ${f.border}` }}
                >
                  <f.icon size={24} color={f.color} />
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <motion.div
          className="cta-box"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="cta-title">
            Ready to make a <span className="hero-gradient-text">difference?</span>
          </h2>
          <p className="cta-desc">
            Join thousands of restaurants and volunteers already building a
            zero-waste food ecosystem across India.
          </p>
          <div className="cta-actions">
            <Link href="/signup" className="hero-cta-primary">
              Create Account <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="hero-cta-secondary">
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        © {new Date().getFullYear()} AnnSeva · Built with ❤️ to end food waste
      </footer>
    </div>
  );
}
