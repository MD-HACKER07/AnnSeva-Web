"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Leaf,
  LayoutDashboard,
  Plus,
  List,
  BarChart3,
  Users,
  LogOut,
  Map,
  Package,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const restaurantNav: NavItem[] = [
  { label: "Overview", href: "/dashboard/restaurant", icon: LayoutDashboard },
  { label: "Add Food", href: "/dashboard/restaurant/add", icon: Plus },
  { label: "My Listings", href: "/dashboard/restaurant/listings", icon: List },
];

const volunteerNav: NavItem[] = [
  { label: "Available Food", href: "/dashboard/volunteer", icon: Map },
  { label: "My Pickups", href: "/dashboard/volunteer/pickups", icon: Package },
];

const adminNav: NavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/admin/users", icon: Users },
  { label: "All Listings", href: "/dashboard/admin/listings", icon: List },
  { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const { appUser, logOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const navItems =
    appUser?.role === "restaurant"
      ? restaurantNav
      : appUser?.role === "volunteer"
      ? volunteerNav
      : adminNav;

  const roleColors: Record<string, string> = {
    restaurant: "#f97316",
    volunteer: "#22c55e",
    admin: "#8b5cf6",
  };
  const color = roleColors[appUser?.role ?? "volunteer"];

  const handleLogout = async () => {
    await logOut();
    toast.success("Logged out");
    router.push("/");
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", marginBottom: "2rem" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="AnnSeva Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div>
          <div style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>
            Ann<span style={{ color: "var(--accent-green)" }}>Seva</span>
          </div>
          <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.08em" }}>ZERO FOOD WASTE</div>
        </div>
      </Link>

      {/* User Badge */}
      <div style={{ padding: "0.875rem 1rem", background: `${color}10`, border: `1px solid ${color}25`, borderRadius: 12, marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${color}20`, border: `2px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
            {appUser?.role === "restaurant" ? "🏪" : appUser?.role === "volunteer" ? "🙋" : "🛡️"}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {appUser?.name}
            </div>
            <div style={{ fontSize: "0.7rem", color: color, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {appUser?.role}
            </div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 0.75rem", marginBottom: "0.5rem" }}>
          Menu
        </div>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${active ? "active" : ""}`}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "1rem" }}>
        <button onClick={handleLogout} className="sidebar-link" style={{ color: "#ef4444", width: "100%" }}>
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
