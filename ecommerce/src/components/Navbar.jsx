import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Menu,
  ShoppingBag,
  Sparkles,
  Bot,
  X,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/login");
  };

  const navLinks = [
    {
      label: "Home",
      to: "/",
    },
    {
      label: "Shop",
      to: "/shop",
    },
    {
      label: "Deals",
      to: "/deals",
    },
    {
      label: "Best Sellers",
      to: "/best-sellers",
    },
    {
      label: "AI Assistant",
      to: "/ai-shopping",
      icon: Bot,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">

          {/* ================================
              LOGO
          ================================= */}

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-200">
              <Sparkles size={18} />
            </div>

            <Link
              to="/"
              className="brand-mark text-2xl font-bold tracking-tight text-slate-900"
            >
              ShopEase
            </Link>
          </div>


          {/* ================================
              DESKTOP NAVIGATION
          ================================= */}

          <div className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">

            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className="flex items-center gap-1.5 transition hover:text-indigo-600"
                >
                  {Icon && <Icon size={16} />}

                  {link.label}
                </Link>
              );
            })}


            {/* ADMIN PANEL */}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="font-semibold text-amber-600 transition hover:text-amber-500"
              >
                Admin Panel
              </Link>
            )}

          </div>


          {/* ================================
              DESKTOP RIGHT SIDE
          ================================= */}

          <div className="hidden items-center gap-3 md:flex">

            {user && (
              <>
                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className="inline-flex rounded-full border border-slate-200 p-2.5 text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
                  aria-label="Wishlist"
                >
                  <Heart size={18} />
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="inline-flex rounded-full border border-slate-200 p-2.5 text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
                  aria-label="Cart"
                >
                  <ShoppingBag size={18} />
                </Link>
              </>
            )}

            {/* ================================
                LOGGED IN USER
            ================================= */}

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  Logout
                </button>
              </>
            ) : (

              /* ================================
                  LOGGED OUT USER
              ================================= */

              <>
                <Link
                  to="/login"
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500"
                >
                  Register
                </Link>
              </>
            )}

          </div>


          {/* ================================
              MOBILE MENU BUTTON
          ================================= */}

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-700 md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>


        {/* ================================
            MOBILE MENU
        ================================= */}

        {mobileOpen && (
          <div className="mt-4 space-y-3 border-t border-slate-200 pt-4 md:hidden">

            {/* Mobile navigation links */}

            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-indigo-600"
                >
                  {Icon && <Icon size={16} />}

                  {link.label}
                </Link>
              );
            })}


            {/* Mobile Admin Panel */}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-amber-600 transition hover:bg-amber-50"
              >
                Admin Panel
              </Link>
            )}


            {user && (
              <div className="flex items-center gap-2 pt-2">
                <Link
                  to="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  <Heart size={16} />
                  Wishlist
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  <ShoppingBag size={16} />
                  Cart
                </Link>
              </div>
            )}

            {/* ================================
                MOBILE AUTH
            ================================= */}

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-full bg-slate-100 px-4 py-2 text-center text-sm font-medium text-slate-700"
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-700"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-full bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white"
                >
                  Register
                </Link>
              </>
            )}

          </div>
        )}

      </nav>
    </header>
  );
}

export default Navbar;