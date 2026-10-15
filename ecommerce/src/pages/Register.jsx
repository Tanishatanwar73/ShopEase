import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Phone, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { registerUser } from "../services/api";
import heroMark from "../assets/hero.png";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await registerUser(formData);

      if (!data.success) {
        setError(data.message || "Registration failed");
        return;
      }

      if (data.demoOtp) {
        setMessage(`Demo OTP: ${data.demoOtp}. Use it on the next screen to verify your account.`);
      }

      navigate("/verify-otp", {
        state: {
          email: formData.email,
          demoOtp: data.demoOtp || "",
        },
      });

    } catch (error) {
      console.error(error);
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[720px] max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl shadow-indigo-950/30 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.3),transparent_32%),linear-gradient(145deg,#101936_0%,#21145b_48%,#581c87_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:46px_46px]" />
          <div className="absolute -right-24 top-20 h-72 w-72 rounded-full border border-cyan-300/20 shadow-[0_0_100px_rgba(34,211,238,0.2)]" />
          <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full border border-fuchsia-300/20" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 text-xl font-bold tracking-tight text-white"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20"><Sparkles size={19} /></span>ShopEase</Link>
            <div className="mt-24 max-w-lg">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-cyan-200">Build your tech setup</p>
              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight xl:text-6xl">Start smarter today.</h1>
              <p className="mt-6 max-w-md text-base leading-7 text-slate-200">Create your ShopEase account to save devices, track orders, and unlock a better way to shop electronics.</p>
            </div>
          </div>

          <div className="relative z-10 flex items-end justify-between gap-8"><div className="grid grid-cols-3 gap-6"><div><p className="text-2xl font-bold">12K+</p><p className="mt-1 text-xs text-slate-300">tech lovers</p></div><div><p className="text-2xl font-bold">4.9/5</p><p className="mt-1 text-xs text-slate-300">store rating</p></div><div><p className="text-2xl font-bold">24h</p><p className="mt-1 text-xs text-slate-300">fast dispatch</p></div></div><img src={heroMark} alt="" className="w-28 animate-float opacity-80" /></div>
        </section>

        <section className="flex items-center bg-slate-50 p-6 sm:p-10 lg:p-14">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 lg:hidden"><Link to="/" className="text-xl font-bold text-slate-950">ShopEase<span className="text-indigo-600">.</span></Link></div>
            <div className="mb-7"><p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-indigo-600">Join the community</p><h2 className="text-4xl font-bold tracking-tight text-slate-950">Create your account</h2><p className="mt-3 text-sm leading-6 text-slate-500">A few details now. A smarter shopping experience next.</p></div>

            {error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
            {message && <div role="status" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">Full name</label><div className="relative"><UserRound size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input id="name" type="text" name="name" placeholder="Your full name" value={formData.name} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" required /></div></div>
              <div><label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label><div className="relative"><Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input id="email" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" required /></div></div>
              <div><label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">Phone number <span className="font-normal text-slate-400">(optional)</span></label><div className="relative"><Phone size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input id="phone" type="tel" name="phone" placeholder="Your phone number" value={formData.phone} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" /></div></div>
              <div><label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Create password</label><div className="relative"><LockKeyhole size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input id="password" type={showPassword ? "text" : "password"} name="password" placeholder="At least 6 characters" value={formData.password} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" required /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
              <p className="text-xs text-slate-400">Your account will be verified with a one-time password after registration.</p>
              <button type="submit" disabled={loading} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70">{loading ? "Creating your account..." : "Create account"}{!loading && <ArrowRight size={18} />}</button>
            </form>

            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-400"><ShieldCheck size={15} className="text-emerald-500" /> Your information is protected</div>
            <p className="mt-5 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800">Sign in</Link></p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Register;