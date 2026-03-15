import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown,
  ArrowUpRight, Clock, RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "@/hooks/use-toast";

/* ─────────────────────────────────────────── types ─── */
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
}

interface RevenuePoint { name: string; revenue: number; orders: number; }
interface CategoryPoint { name: string; value: number; color: string; }
interface TopProduct { name: string; sales: number; revenue: number; trend: "up" | "down"; }
interface RecentOrder {
  id: string; order_number: string; customer: string;
  total: number; status: string; time: string;
}

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100  text-blue-700",
  processing: "bg-amber-100 text-amber-700",
  shipped: "bg-blue-100  text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100   text-red-700",
  refunded: "bg-purple-100 text-purple-700",
};

const PALETTE = [
  "hsl(0,72%,40%)", "hsl(38,70%,50%)", "hsl(210,70%,50%)",
  "hsl(270,60%,55%)", "hsl(120,40%,45%)", "hsl(45,85%,55%)",
];

/* ───────────────────────────── helpers ─── */
const monthLabel = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short" });

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

/* ═══════════════════════════════════════════════════════ component ═════ */
const AdminDashboard = () => {
  const { isAdmin } = useAdminAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0, totalOrders: 0, totalCustomers: 0, totalProducts: 0,
    revenueChange: 0, ordersChange: 0, customersChange: 0,
  });
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  const hasFetched = useRef(false);

  /* ── fetch ── */
  const fetchDashboard = async (force = false) => {
    if (!isAdmin) return;
    if (hasFetched.current && !force) return;

    try {
      setLoading(true);

      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString();

      // ── 1. orders (all time for totals + last 6 months for chart) ──────
      const { data: allOrders, error: ordErr } = await supabase
        .from("orders")
        .select("id, total, status, created_at, customer_name")
        .gte("created_at", start)
        .order("created_at", { ascending: false });

      if (ordErr) throw ordErr;

      // ── 2. all-time order count & revenue ──────────────────────────────
      const { count: totalOrdersCount } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true });

      const { data: allRevData } = await supabase
        .from("orders")
        .select("total");

      const totalRevenue = (allRevData || []).reduce((s, o) => s + Number(o.total), 0);
      const totalOrders = totalOrdersCount ?? 0;

      // ── 3. customers ───────────────────────────────────────────────────
      const { count: totalCustomers } = await supabase
        .from("customers")
        .select("id", { count: "exact", head: true });

      // ── 4. products ────────────────────────────────────────────────────
      const { count: totalProducts } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true });

      // ── 5. monthly revenue chart (last 6 months) ───────────────────────
      const monthMap: Record<string, { revenue: number; orders: number }> = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = monthLabel(d.toISOString());
        monthMap[key] = { revenue: 0, orders: 0 };
      }
      (allOrders || []).forEach((o) => {
        const key = monthLabel(o.created_at);
        if (monthMap[key] !== undefined) {
          monthMap[key].revenue += Number(o.total);
          monthMap[key].orders += 1;
        }
      });
      const revenuePoints: RevenuePoint[] = Object.entries(monthMap).map(
        ([name, v]) => ({ name, revenue: Math.round(v.revenue), orders: v.orders })
      );

      // ── 6. category breakdown from products ────────────────────────────
      const { data: productRows } = await supabase
        .from("products")
        .select("category");

      const catMap: Record<string, number> = {};
      (productRows || []).forEach((p) => {
        const c = p.category || "Other";
        catMap[c] = (catMap[c] || 0) + 1;
      });
      const totalProd = Object.values(catMap).reduce((s, v) => s + v, 0) || 1;
      const catPoints: CategoryPoint[] = Object.entries(catMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, val], i) => ({
          name,
          value: Math.round((val / totalProd) * 100),
          color: PALETTE[i % PALETTE.length],
        }));

      // ── 7. top 5 products by order_items ──────────────────────────────
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("product_name, quantity, total_price");

      const prodMap: Record<string, { sales: number; revenue: number }> = {};
      (orderItems || []).forEach((item) => {
        const n = item.product_name;
        if (!prodMap[n]) prodMap[n] = { sales: 0, revenue: 0 };
        prodMap[n].sales += item.quantity;
        prodMap[n].revenue += Number(item.total_price);
      });
      const topProds: TopProduct[] = Object.entries(prodMap)
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .slice(0, 5)
        .map(([name, v]) => ({
          name,
          sales: v.sales,
          revenue: Math.round(v.revenue),
          trend: "up" as const,
        }));

      // ── 8. recent 6 orders ─────────────────────────────────────────────
      const recent: RecentOrder[] = (allOrders || []).slice(0, 6).map((o) => ({
        id: o.id,
        order_number: (o as any).order_number ?? o.id.slice(0, 8).toUpperCase(),
        customer: o.customer_name,
        total: Number(o.total),
        status: o.status,
        time: timeAgo(o.created_at),
      }));

      // ── 9. MoM changes (current vs previous month) ─────────────────────
      const curMonthKey = monthLabel(now.toISOString());
      const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthKey = monthLabel(prevDate.toISOString());

      const cur = monthMap[curMonthKey] ?? { revenue: 0, orders: 0 };
      const prev = monthMap[prevMonthKey] ?? { revenue: 0, orders: 0 };

      const pct = (a: number, b: number) =>
        b === 0 ? (a > 0 ? 100 : 0) : Math.round(((a - b) / b) * 100);

      // ── set state ──────────────────────────────────────────────────────
      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers: totalCustomers ?? 0,
        totalProducts: totalProducts ?? 0,
        revenueChange: pct(cur.revenue, prev.revenue),
        ordersChange: pct(cur.orders, prev.orders),
        customersChange: 0,
      });
      setRevenueData(revenuePoints);
      setCategoryData(catPoints);
      setTopProducts(topProds);
      setRecentOrders(recent);

      hasFetched.current = true;
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      toast({
        title: "Failed to load dashboard",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, [isAdmin]);

  /* ── stat cards config ── */
  const statCards = [
    {
      label: "Total Revenue",
      value: `A$ ${stats.totalRevenue.toLocaleString()}`,
      change: `${stats.revenueChange >= 0 ? "+" : ""}${stats.revenueChange}%`,
      up: stats.revenueChange >= 0,
      icon: DollarSign,
      sub: "All time",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: `${stats.ordersChange >= 0 ? "+" : ""}${stats.ordersChange}%`,
      up: stats.ordersChange >= 0,
      icon: ShoppingCart,
      sub: "All time",
    },
    {
      label: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      change: "+0%",
      up: true,
      icon: Users,
      sub: "Registered",
    },
    {
      label: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      change: "",
      up: true,
      icon: Package,
      sub: "In catalog",
    },
  ];

  /* ── loading skeleton ── */
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-foreground">Dashboard</h1>
            <p className="font-body text-sm text-muted-foreground">Loading store data…</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
              <div className="w-10 h-10 bg-muted rounded-lg mb-3" />
              <div className="w-24 h-6 bg-muted rounded mb-1" />
              <div className="w-16 h-3 bg-muted rounded" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5 animate-pulse h-72" />
          <div className="bg-card border border-border rounded-xl p-5 animate-pulse h-72" />
        </div>
      </div>
    );
  }

  /* ── full render ── */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="font-body text-sm text-muted-foreground">Welcome back! Here's your store overview.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="font-body text-xs tracking-wider uppercase flex items-center gap-1.5"
          onClick={() => { hasFetched.current = false; fetchDashboard(true); }}
        >
          <RefreshCw size={13} /> Refresh
        </Button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon size={20} className="text-primary" />
              </div>
              {s.change && (
                <span className={`flex items-center gap-1 text-xs font-body font-medium ${s.up ? "text-green-600" : "text-red-500"}`}>
                  {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {s.change}
                </span>
              )}
            </div>
            <p className="font-heading text-2xl font-semibold text-foreground">{s.value}</p>
            <p className="font-body text-xs text-muted-foreground mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Area Chart */}
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold text-foreground">Revenue Overview</h3>
            <Badge variant="secondary" className="font-body text-[10px]">Last 6 months</Badge>
          </div>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0,72%,40%)" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="hsl(0,72%,40%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Outfit" }} stroke="hsl(20,5%,50%)" />
                <YAxis tick={{ fontSize: 11, fontFamily: "Outfit" }} stroke="hsl(20,5%,50%)"
                  tickFormatter={v => `A$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ fontFamily: "Outfit", fontSize: 12, borderRadius: 8 }}
                  formatter={(v: number) => [`A$ ${v.toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(0,72%,40%)" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground font-body text-sm">
              No revenue data for the selected period.
            </div>
          )}
        </div>

        {/* Category Pie */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Products by Category</h3>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={52} outerRadius={78}
                    dataKey="value" paddingAngle={3}>
                    {categoryData.map((_, i) => <Cell key={i} fill={_.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontFamily: "Outfit", fontSize: 12, borderRadius: 8 }}
                    formatter={(v: number) => [`${v}%`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {categoryData.map(c => (
                  <div key={c.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="font-body text-xs text-muted-foreground truncate">{c.name} ({c.value}%)</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-muted-foreground font-body text-sm">
              No product categories found.
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold text-foreground">Recent Orders</h3>
            <a href="/admin/orders" className="font-body text-xs text-primary hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={12} />
            </a>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-0 divide-y divide-border">
              {recentOrders.map(o => (
                <div key={o.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <ShoppingCart size={14} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">{o.order_number}</p>
                      <p className="font-body text-xs text-muted-foreground">{o.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-sm font-medium text-foreground">A$ {o.total.toLocaleString()}</p>
                    <div className="flex items-center justify-end gap-2 mt-0.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-body capitalize ${STATUS_COLOR[o.status] ?? "bg-muted text-muted-foreground"}`}>
                        {o.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-body flex items-center gap-0.5">
                        <Clock size={9} /> {o.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground font-body text-sm">
              No orders yet.
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold text-foreground">Top Products</h3>
            <Badge variant="secondary" className="font-body text-[10px]">By revenue</Badge>
          </div>

          {topProducts.length > 0 ? (
            <>
              {/* Mini bar chart */}
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={topProducts.slice(0, 5)} layout="vertical" margin={{ left: 8, right: 8 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={120}
                    tick={{ fontSize: 10, fontFamily: "Outfit" }} tickLine={false} axisLine={false}
                    tickFormatter={v => v.length > 18 ? v.slice(0, 18) + "…" : v} />
                  <Tooltip contentStyle={{ fontFamily: "Outfit", fontSize: 12, borderRadius: 8 }}
                    formatter={(v: number) => [`A$ ${v.toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="hsl(0,72%,40%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="space-y-2 mt-3 divide-y divide-border">
                {topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center font-body text-xs font-medium text-muted-foreground flex-shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-body text-sm font-medium text-foreground truncate max-w-[180px]">{p.name}</p>
                        <p className="font-body text-xs text-muted-foreground">{p.sales} sold</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <p className="font-body text-sm font-medium text-foreground">A$ {p.revenue.toLocaleString()}</p>
                      <TrendingUp size={14} className="text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground font-body text-sm">
              No product sales data yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
