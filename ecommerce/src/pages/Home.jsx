import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgePercent, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import ProductGrid from "../components/ProductGrid";
import SearchBar from "../components/SearchBar";
import { getProducts } from "../services/api";

const categories = [
  { name: "Mobiles", icon: "📱", count: "120+ items" },
  { name: "Laptops", icon: "💻", count: "80+ items" },
  { name: "Audio", icon: "🎧", count: "150+ items" },
  { name: "Gaming", icon: "🎮", count: "90+ items" },
  { name: "Smart Home", icon: "🏠", count: "110+ items" },
  { name: "Accessories", icon: "⌚", count: "140+ items" },
];

const trustPoints = [
  { title: "Fast delivery", text: "Same-day dispatch on top tech picks.", icon: Truck },
  { title: "Secure checkout", text: "Protected payments and order tracking.", icon: ShieldCheck },
  { title: "Tech deals", text: "Fresh discounts on flagship gadgets.", icon: BadgePercent },
  { title: "Trusted brands", text: "Only verified electronics from premium makers.", icon: Sparkles },
];

const featuredCollections = [
  {
    title: "Mobile essentials",
    text: "Premium smartphones, cases, and power accessories for everyday performance.",
    color: "from-sky-100 via-cyan-50 to-blue-50",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Work from anywhere",
    text: "Laptops, docks, and productivity gear built for creators and teams.",
    color: "from-indigo-100 via-blue-50 to-cyan-50",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Smart living",
    text: "Connected lighting, speakers, and home tech that upgrades your space.",
    color: "from-emerald-100 via-lime-50 to-yellow-50",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80",
  },
];

const testimonials = [
  { name: "Aisha K.", text: "The design quality is amazing and the delivery was faster than expected.", rating: 5 },
  { name: "Rohan P.", text: "The product recommendations feel personal, and the checkout flow is smooth.", rating: 5 },
  { name: "Mira S.", text: "Everything feels premium and trustworthy. I keep coming back for new finds.", rating: 5 },
];

const heroSlides = [
  {
    label: "Tech deal",
    title: "Smart Watch Pro",
    detail: "Up to 40% off",
    price: "₹3,499",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    alt: "Smart watch on display",
  },
  {
    label: "Apple collection",
    title: "Power meets simplicity",
    detail: "Explore the latest Apple essentials",
    price: "Shop Apple",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    alt: "Apple laptop on a desk",
  },
  {
    label: "Samsung picks",
    title: "Made for every day",
    detail: "Phones, audio, and smart-home devices",
    price: "View brand",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=80",
    alt: "Samsung smartphone in hand",
  },
  {
    label: "Gaming drop",
    title: "Level up your play",
    detail: "Save on performance gear for every session",
    price: "Shop gaming",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=900&q=80",
    alt: "Gaming controller with colorful lights",
  },
  {
    label: "Audio spotlight",
    title: "Hear every detail",
    detail: "Immersive headphones and speakers, now on offer",
    price: "Explore audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    alt: "Over-ear headphones on a light background",
  },
];

function Home() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const slideTimer = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(slideTimer);
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );
  const currentSlide = heroSlides[activeSlide];

  const showPreviousSlide = () => {
    setActiveSlide((currentSlide) =>
      currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1
    );
  };

  const showNextSlide = () => {
    setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
  };

  const handleSubscribe = (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!validEmail) {
      setSubscribeStatus("Please enter a valid email address.");
      return;
    }

    const existingSubscribers = JSON.parse(
      localStorage.getItem("shopEase_newsletter") || "[]"
    );

    if (!existingSubscribers.includes(trimmedEmail.toLowerCase())) {
      existingSubscribers.push(trimmedEmail.toLowerCase());
      localStorage.setItem(
        "shopEase_newsletter",
        JSON.stringify(existingSubscribers)
      );
    }

    setEmail("");
    setSubscribeStatus("Thanks! You’re subscribed to our latest updates.");
  };

  return (
    <div className="min-h-screen bg-[#f7f8f3] text-slate-800">
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-violet-500 blur-3xl"
            animate={{ y: [0, -18, 0], x: [0, 14, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-10 top-20 h-80 w-80 rounded-full bg-cyan-500 blur-3xl"
            animate={{ y: [0, 20, 0], x: [0, -18, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-indigo-100 backdrop-blur-sm">
                <Star className="mr-2 h-4 w-4 text-yellow-300" fill="currentColor" />
                Trusted by 68k+ happy shoppers
              </div>

              <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Upgrade your setup with smarter tech.
              </h1>

              <p className="mt-6 max-w-xl text-lg text-slate-300">
                Discover premium smartphones, gaming gear, laptops, audio, and smart home essentials built for performance and style.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                  Shop now
                  <ArrowRight size={16} />
                </button>
                <button className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Explore gadgets
                </button>
              </div>

              <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">
                <div>
                  <span className="block text-2xl font-bold text-white">4.9/5</span>
                  Customer rating
                </div>
                <div>
                  <span className="block text-2xl font-bold text-white">24h</span>
                  Dispatch time
                </div>
                <div>
                  <span className="block text-2xl font-bold text-white">Free</span>
                  Shipping over ₹999
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-sm">
                <motion.img
                  key={currentSlide.image}
                  src={currentSlide.image}
                  alt={currentSlide.alt}
                  className="h-[480px] w-full rounded-[1.4rem] object-cover"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
                <div className="absolute bottom-10 left-10 right-10 rounded-2xl bg-white/90 p-4 text-slate-900 shadow-xl backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">{currentSlide.label}</p>
                  <div className="mt-2 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xl font-bold">{currentSlide.title}</p>
                      <p className="text-sm text-slate-500">{currentSlide.detail}</p>
                    </div>
                    <span className="rounded-full bg-indigo-600 px-3 py-1 text-sm font-semibold text-white">{currentSlide.price}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={showPreviousSlide}
                  className="absolute left-7 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/60 text-white transition hover:bg-slate-950"
                  aria-label="Show previous slide"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={showNextSlide}
                  className="absolute right-7 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/60 text-white transition hover:bg-slate-950"
                  aria-label="Show next slide"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
                  {heroSlides.map((slide, index) => (
                    <button
                      key={slide.title}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      className={`h-2 rounded-full transition ${index === activeSlide ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white"}`}
                      aria-label={`Show ${slide.title} slide`}
                      aria-current={index === activeSlide ? "true" : undefined}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <motion.section
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {trustPoints.map(({ title, text, icon: Icon }, index) => (
            <motion.div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover-lift"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Curated picks</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Explore our tech collections</h2>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {featuredCollections.map((collection, index) => (
            <motion.div
              key={collection.title}
              className={`hover-lift overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br ${collection.color} p-5 shadow-sm`}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
            >
              <img src={collection.image} alt={collection.title} className="h-64 w-full rounded-[1.5rem] object-cover" />
              <div className="mt-5">
                <h3 className="text-2xl font-bold text-slate-900">{collection.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{collection.text}</p>
                <button className="mt-5 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600">
                  Shop collection
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="grid gap-6 rounded-[2rem] bg-slate-900 p-6 text-white lg:grid-cols-[1fr_0.8fr] lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">Flash sale</p>
            <h2 className="mt-2 text-3xl font-bold">Up to 60% off on top electronics</h2>
            <p className="mt-3 max-w-xl text-slate-300">Limited-time offers on gaming gear, mobile tech, workstations, and smart devices.</p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Days", value: "02" },
              { label: "Hours", value: "14" },
              { label: "Mins", value: "32" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.4, delay: index * 0.12 }}
              >
                <div className="text-3xl font-bold">{item.value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-300">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Categories</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Shop by device</h2>
          </div>
          <button className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 sm:inline-flex">
            View all
          </button>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map(({ name, icon, count }, index) => (
            <div key={name} className="animate-card group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover-lift" style={{ animationDelay: `${index * 110}ms` }}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-3xl shadow-inner">
                  {icon}
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{count}</span>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-900">{name}</h3>
              <p className="mt-2 text-sm text-slate-500">High-performance tech picks for everyday life.</p>
            </div>
          ))}
        </div>
      </section>

      <motion.section
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 p-6 text-white shadow-xl sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">New season</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Power your day with better tech.</h2>
              <p className="mt-4 max-w-xl text-slate-200">
                Discover premium gadgets, smarter accessories, and member-only pricing on the latest electronics.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                {['Free shipping', 'New arrivals', 'Members pricing'].map((item) => (
                  <span key={item} className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-slate-100">{item}</span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
              {[
                { number: "12K+", label: "happy buyers" },
                { number: "4.9/5", label: "average rating" },
                { number: "24/7", label: "support" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white">{stat.number}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Collections</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Curated for modern tech lovers</h2>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Creator setup",
              desc: "Premium laptops, displays, and work essentials for high-performance productivity.",
              bg: "from-indigo-600 via-indigo-500 to-violet-500",
              image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=80",
            },
            {
              title: "Audio & vibe",
              desc: "Headphones, speakers, and sound gear tuned for deep focus and entertainment.",
              bg: "from-rose-500 via-pink-500 to-orange-400",
              image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
            },
            {
              title: "Smart home",
              desc: "Connected lighting, automation, and home devices built for everyday convenience.",
              bg: "from-emerald-500 via-teal-500 to-cyan-500",
              image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=900&q=80",
            },
          ].map((collection) => (
            <div key={collection.title} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className={`h-52 bg-gradient-to-br ${collection.bg} p-5`}>
                <img src={collection.image} alt={collection.title} className="h-full w-full rounded-[1.5rem] object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900">{collection.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{collection.desc}</p>
                <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                  Shop now
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-gradient-to-r from-amber-100 via-orange-50 to-rose-100 p-8 shadow-inner">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Hot this week</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Big savings before the weekend ends</h2>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              Claim offer
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Free delivery", text: "On orders above ₹999" },
            { title: "Easy returns", text: "30-day simple returns" },
            { title: "Secure payments", text: "100% protected checkout" },
            { title: "24/7 support", text: "Real people, real help" },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <p className="text-lg font-bold text-slate-900">{item.title}</p>
              <p className="mt-2 text-sm text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-slate-900 p-8 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">Top brands</p>
              <h2 className="mt-2 text-3xl font-bold">Loved by style and tech lovers</h2>
            </div>
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-300">
              {['Nike', 'Apple', 'Samsung', 'Zara', 'Sony', 'H&M'].map((brand) => (
                <span key={brand} className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2">{brand}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Testimonials</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">What shoppers are saying</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: "Aarav M.", text: "The quality feels premium and delivery was super fast. I’ve already ordered twice this month.", rating: 5 },
            { name: "Nisha P.", text: "I found the exact style I wanted and the checkout was smooth. Definitely my go-to store now.", rating: 5 },
            { name: "Rohit S.", text: "The deals are genuinely good. The products look even better in person and the packaging was excellent.", rating: 5 },
          ].map((review) => (
            <div key={review.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex text-amber-400">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm leading-7 text-slate-600">“{review.text}”</p>
              <div className="mt-6 border-t border-slate-200 pt-4">
                <p className="font-semibold text-slate-900">{review.name}</p>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Verified buyer</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Trending now</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Featured products</h2>
          </div>
          <SearchBar search={search} setSearch={setSearch} />
        </div>

        {loading && <p className="py-12 text-center text-lg text-slate-500">Loading products...</p>}
        {error && <p className="py-12 text-center text-lg text-red-500">{error}</p>}

        {!loading && !error && <ProductGrid products={filteredProducts} />}
      </section>

      <motion.section
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Why choose us</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Built for better shopping</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Easy returns", text: "Stress-free returns within 7 days for all eligible purchases." },
            { title: "Expert support", text: "Friendly help from real people before and after checkout." },
            { title: "Real value", text: "Transparent pricing and carefully curated products worth buying." },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm hover-lift"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">✓</div>
              <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Customer stories</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Loved by shoppers everywhere</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((review, index) => (
            <motion.div
              key={review.name}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover-lift"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.12 }}
            >
              <div className="mb-4 flex gap-1 text-amber-400">
                {Array.from({ length: review.rating }).map((_, starIndex) => (
                  <span key={`${review.name}-${starIndex}`}>★</span>
                ))}
              </div>
              <p className="text-sm leading-7 text-slate-600">“{review.text}”</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                  {review.name.charAt(0)}
                </div>
                <span className="font-semibold text-slate-900">{review.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-500">Flash sale</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Weekend deals ending soon</h2>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            <span className="rounded-full bg-white px-2 py-1">08h</span>
            <span className="rounded-full bg-white px-2 py-1">42m</span>
            <span className="rounded-full bg-white px-2 py-1">19s</span>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {[
            { name: "Gaming Setup", oldPrice: "₹29,999", newPrice: "₹21,999", badge: "-27%" },
            { name: "Air Fryer Pro", oldPrice: "₹8,499", newPrice: "₹5,999", badge: "-29%" },
            { name: "Smart Speaker", oldPrice: "₹4,999", newPrice: "₹2,799", badge: "-44%" },
          ].map((deal) => (
            <div key={deal.name} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-red-600">
                  {deal.badge}
                </span>
                <button className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  Save now
                </button>
              </div>
              <div className="mt-5 h-44 rounded-[1.5rem] bg-gradient-to-br from-slate-200 via-slate-100 to-indigo-100" />
              <h3 className="mt-5 text-xl font-bold text-slate-900">{deal.name}</h3>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">{deal.newPrice}</span>
                <span className="text-sm text-slate-400 line-through">{deal.oldPrice}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-2 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Why shop with us</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Built for better buying</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            { title: "Fast delivery", text: "Get your order at your doorstep in 24-48 hours on popular items.", icon: "🚚" },
            { title: "Secure checkout", text: "Protected payments and a trusted shopping experience every time.", icon: "🔒" },
            { title: "Easy returns", text: "Hassle-free returns within 7 days for most eligible products.", icon: "↩️" },
          ].map((feature) => (
            <div key={feature.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">Loved by customers</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Customer stories</h2>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {[
            { name: "Aisha M.", text: "The product quality is excellent and the delivery was surprisingly fast. Definitely shopping again.", rating: "★★★★★" },
            { name: "Rohan K.", text: "The interface is simple, the offers are genuine, and the checkout feels smooth and trustworthy.", rating: "★★★★★" },
            { name: "Naina P.", text: "Such a stylish collection with competitive pricing. I found exactly what I was looking for.", rating: "★★★★★" },
          ].map((review) => (
            <div key={review.name} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-lg text-amber-400">{review.rating}</div>
              <p className="mt-4 text-sm leading-7 text-slate-600">“{review.text}”</p>
              <div className="mt-6 border-t border-slate-200 pt-4">
                <p className="font-semibold text-slate-900">{review.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-slate-900 px-6 py-8 text-white sm:px-8 lg:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">Download the app</p>
              <h2 className="mt-2 text-3xl font-bold">Shop smarter on the go</h2>
              <p className="mt-3 text-slate-300">Track orders, get faster checkout, and discover exclusive app-only offers.</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                App Store
              </button>
              <button className="rounded-full border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                Google Play
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
