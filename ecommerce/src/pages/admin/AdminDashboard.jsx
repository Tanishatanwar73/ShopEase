import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  CircleDollarSign,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import { getProducts } from "../../services/api";

function AdminDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      const result = await getProducts();
      if (result.success) setProducts(result.products || []);
    };

    loadDashboard();
  }, []);

  const users = JSON.parse(localStorage.getItem("shopEase_demo_users") || "[]");
  const lowStockProducts = products.filter((product) => Number(product.stock) <= 5);
  const inventoryValue = products.reduce(
    (total, product) => total + Number(product.price || 0) * Number(product.stock || 0),
    0
  );
  const stats = [
    { label: "Total products", value: products.length, note: "Catalog items", icon: Package, color: "text-indigo-600 bg-indigo-50" },
    { label: "Registered users", value: users.length, note: "Customer accounts", icon: Users, color: "text-cyan-600 bg-cyan-50" },
    { label: "Inventory value", value: `₹${inventoryValue.toLocaleString("en-IN")}`, note: "Current stock value", icon: CircleDollarSign, color: "text-emerald-600 bg-emerald-50" },
    { label: "Low stock", value: lowStockProducts.length, note: "Needs attention", icon: AlertTriangle, color: "text-amber-600 bg-amber-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl sm:p-9 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300"><ShieldCheck size={17} /> ShopEase control center</div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Good morning, Admin.</h1>
            <p className="mt-3 max-w-xl text-slate-300">Keep your electronics catalog healthy, watch stock levels, and manage your store from one place.</p>
          </div>
          <Link to="/admin/products/add" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-400"><Plus size={18} /> Add product</Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-slate-500">{stat.label}</p><p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{stat.value}</p><p className="mt-1 text-xs text-slate-400">{stat.note}</p></div><span className={`rounded-xl p-3 ${stat.color}`}><Icon size={20} /></span></div></div>;
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Catalog overview</p><h2 className="mt-2 text-xl font-bold text-slate-950">Recent products</h2></div><Link to="/admin/products" className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800">View all <ArrowUpRight size={16} /></Link></div>
            <div className="divide-y divide-slate-100">
              {products.slice(-5).reverse().map((product) => <div key={product._id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">{product.image ? <img src={product.image} alt={product.name} className="h-12 w-12 rounded-xl object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400"><Boxes size={20} /></div>}<div className="min-w-0 flex-1"><p className="truncate font-semibold text-slate-900">{product.name}</p><p className="mt-1 text-sm text-slate-500">{product.category || "Electronics"}</p></div><div className="text-right"><p className="font-bold text-slate-900">₹{Number(product.price || 0).toLocaleString("en-IN")}</p><p className={`mt-1 text-xs font-semibold ${Number(product.stock) <= 5 ? "text-amber-600" : "text-emerald-600"}`}>{product.stock} in stock</p></div></div>)}
              {!products.length && <p className="py-8 text-center text-sm text-slate-500">Your catalog is empty. Add your first electronic product.</p>}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-amber-50 p-3 text-amber-600"><AlertTriangle size={20} /></div><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Attention</p><h2 className="mt-1 text-xl font-bold text-slate-950">Stock alerts</h2></div></div>
            {lowStockProducts.length ? lowStockProducts.slice(0, 4).map((product) => <div key={product._id} className="mb-3 flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3 text-sm"><span className="truncate pr-3 font-medium text-slate-800">{product.name}</span><span className="shrink-0 font-bold text-amber-700">{product.stock} left</span></div>) : <p className="rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">All products have healthy stock levels.</p>}
            <Link to="/admin/products" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"><Package size={17} /> Review inventory</Link>
          </section>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Link to="/admin/products" className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><Package className="text-indigo-600" size={22} /><h3 className="mt-4 font-bold text-slate-900">Manage catalog</h3><p className="mt-1 text-sm text-slate-500">Edit, remove, or review every product.</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-indigo-600">Open catalog <ArrowUpRight size={16} /></span></Link>
          <Link to="/admin/users" className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><Users className="text-cyan-600" size={22} /><h3 className="mt-4 font-bold text-slate-900">Manage customers</h3><p className="mt-1 text-sm text-slate-500">Review registered shoppers and verification.</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-cyan-600">View users <ArrowUpRight size={16} /></span></Link>
          <Link to="/admin/products/add" className="group rounded-2xl border border-dashed border-indigo-300 bg-indigo-50 p-5 transition hover:-translate-y-1 hover:bg-indigo-100"><ShoppingBag className="text-indigo-600" size={22} /><h3 className="mt-4 font-bold text-slate-900">Launch a product</h3><p className="mt-1 text-sm text-slate-600">Add the next device to your electronics store.</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-indigo-600">Create product <ArrowUpRight size={16} /></span></Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;