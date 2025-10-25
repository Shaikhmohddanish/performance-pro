import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import { MessageCircle, Facebook, Instagram, X } from "lucide-react";

/** Simple UI primitives */
function Button({ className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
function Card({ className = "", children }) {
  return <div className={`rounded-2xl border ${className}`}>{children}</div>;
}
function CardContent({ className = "", children }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

/** Logo loader (no sandbox paths) */
function Logo() {
  const sources = ["/logo.png", "/assets/logo.png", "/images/logo.png"];
  const [idx, setIdx] = useState(0);
  if (idx >= sources.length) {
    return (
      <svg className="h-10 w-auto" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Performance Pros">
        <defs>
          <linearGradient id="ppGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        <rect width="256" height="256" rx="40" fill="url(#ppGrad)" />
        <path d="M64 56h92c32 0 58 26 58 58s-26 58-58 58h-38v28H64V56zm54 82h38c14 0 24-10 24-24s-10-24-24-24h-38v48z" fill="#0a0f24" />
      </svg>
    );
  }
  return (
    <img
      src={sources[idx]}
      alt="Performance Pros Logo"
      className="h-10 w-auto"
      onError={() => setIdx((i) => i + 1)}
    />
  );
}

/** Reveal wrapper */
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();
  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Counter */
function Counter({ end, label }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  useEffect(() => {
    if (!inView) return;
    const duration = 1000;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setVal(Math.floor(p * end));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, end]);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold text-cyan-400">{val.toLocaleString()}+</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

/** Lightbox (glassmorphic) */
function Lightbox({ open, onClose, item }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/10 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={item?.title || "Project preview"}
        >
          <motion.div
            className="relative max-w-5xl w-[92%] rounded-2xl border border-white/10 bg-black/50 p-4"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute right-3 top-3 p-2 rounded-full bg-white/10 hover:bg-white/20">
              <X className="h-5 w-5 text-white" />
            </button>
            <img
              src={`${item?.url}&auto=format&fit=crop&w=1600&q=80`}
              alt={item?.title}
              className="w-full max-h-[70vh] object-contain rounded-xl"
              loading="eager"
            />
            <div className="mt-4 px-1">
              <h3 className="text-xl font-semibold">{item?.title}</h3>
              <p className="text-gray-300 text-sm mt-1">{item?.desc}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Runtime checks */
(function runtimeChecks() {
  const wa = "https://wa.me/9892082186";
  console.assert(wa.startsWith("https://wa.me/"), "WhatsApp link must start with https://wa.me/");
})();

export default function App() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [selected, setSelected] = useState(null);

  const projects = [
    { title: "Webflow Interface Design", desc: "Streamlined SaaS UI for conversion clarity.", url: "https://images.unsplash.com/photo-1581093588401-22d3c1e1f7a9" },
    { title: "SEO Analytics Dashboard", desc: "Data visualization for organic traffic insights.", url: "https://images.unsplash.com/photo-1618401479427-7f54a6f00f89" },
    { title: "Creative Marketing Campaign", desc: "Full-funnel digital strategy execution.", url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7" },
    { title: "Landing Page Optimization", desc: "Boosted conversions through UX & speed.", url: "https://images.unsplash.com/photo-1559027615-3d9c35c90a8d" },
    { title: "E-commerce Revamp", desc: "Rebranding and performance-driven redesign.", url: "https://images.unsplash.com/photo-1603570417039-606ab7c9b6d5" },
    { title: "Brand Identity Ads", desc: "Multi-platform ad creatives for engagement.", url: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting Performance Pros! We will reach out soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-[#0a0f24] to-[#06101e] overflow-hidden relative">
      {/* Floating navbar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1100px,92%)]">
        <div className="flex items-center justify-between px-5 py-3 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-base font-semibold tracking-wide">Performance Pros</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-200">
            <a href="#home" className="hover:text-white">Home</a>
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#portfolio" className="hover:text-white">Work</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
          <Button onClick={() => window.open("https://wa.me/9892082186", "_blank")} className="bg-cyan-500 hover:bg-cyan-600 text-white">
            Let’s Talk
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative h-screen flex flex-col items-center justify-center text-center px-4">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-40">
          <source src="https://videos.pexels.com/video-files/3183172/3183172-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f24]/60 via-transparent to-[#06101e]/80" />
        <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_20%,#00e5ff20_0,transparent_30%),radial-gradient(circle_at_80%_30%,#2563eb20_0,transparent_25%),radial-gradient(circle_at_40%_70%,#00e5ff15_0,transparent_30%)]" />

        <div className="relative z-10 max-w-3xl mt-20">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-5xl md:text-6xl font-extrabold mb-6">
            Engineered to Convert.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">Optimized to Perform.</span>
          </motion.h1>
          <Reveal delay={0.2}>
            <p className="text-lg text-gray-200/90 mb-8">Performance Pros builds high-performing websites and marketing campaigns that turn visitors into customers.</p>
          </Reveal>
          <Reveal delay={0.35}>
            <div className="flex gap-4 justify-center">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white" onClick={() => window.open("https://wa.me/9892082186", "_blank")}>
                Get a Free Strategy Call
              </Button>
              <Button
                className="border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
              >
                See Our Work
              </Button>
            </div>
          </Reveal>
        </div>

        {/* WhatsApp floating */}
        <a href="https://wa.me/9892082186" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50" aria-label="Chat on WhatsApp">
          <MessageCircle size={28} />
        </a>
      </section>

      {/* Services with equal height and hover lift + glow */}
      <section id="services" className="py-24 px-6">
        <Reveal>
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { t: "Web Development", d: "Modern, scalable, blazing-fast websites." },
            { t: "Conversion Optimization", d: "Turn traffic into customers with data-driven UX." },
            { t: "Digital Marketing", d: "SEO, ads, and content that actually convert." }
          ].map((s, i) => (
            <Reveal key={s.t} delay={0.1 * i}>
              <motion.div whileHover={{ y: -8, scale: 1.03 }} transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}>
                <Card className="bg-white/5 backdrop-blur-md border-white/10 h-full flex flex-col justify-between ring-0 hover:ring-1 hover:ring-cyan-400/50 hover:shadow-[0_0_30px_#00e5ff40] transition">
                  <CardContent className="p-8 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-2xl font-semibold mb-4 text-cyan-400">{s.t}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{s.d}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-3 max-w-3xl mx-auto gap-6">
          <Counter end={120} label="Projects Delivered" />
          <Counter end={45} label="Clients Served" />
          <Counter end={210} label="Campaigns Launched" />
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-24 bg-[#0d152e] px-6 text-center">
        <Reveal>
          <h2 className="text-4xl font-bold mb-12">Our Work</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((p, n) => (
            <Reveal key={p.title} delay={0.06 * n}>
              <div
                className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
                onClick={() => setSelected(p)}
                role="button"
                aria-label={`Open project ${p.title}`}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelected(p)}
              >
                <motion.img
                  src={`${p.url}&auto=format&fit=crop&w=1200&q=75`}
                  alt={p.title}
                  className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white/90 font-semibold tracking-wide">View Project</span>
                </div>
                <div className="absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-left">
                  <h3 className="text-white text-base font-semibold">{p.title}</h3>
                  <p className="text-white/80 text-xs">{p.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <Reveal>
          <h2 className="text-4xl font-bold text-center mb-10">What Clients Say</h2>
        </Reveal>
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardContent className="p-8">
              <p className="text-gray-200 text-lg italic">“Clean code, fast delivery, measurable ROI.”</p>
              <p className="text-cyan-400 font-semibold mt-3">— Client C</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-cyan-600 to-blue-600 text-center">
        <h2 className="text-4xl font-bold mb-6">Let’s Build Something That Performs.</h2>
        <p className="text-lg text-white/90 mb-8">Ready to level up your digital presence? Contact us today.</p>
        <Button className="bg-white text-cyan-600" onClick={() => window.open("https://wa.me/9892082186", "_blank")}>
          Message Us on WhatsApp
        </Button>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 text-center bg-[#0a0f24]">
        <Reveal>
          <h2 className="text-4xl font-bold mb-6">Contact Us</h2>
          <p className="text-gray-400 mb-8">We’d love to hear from you. Fill out the form and we’ll get in touch.</p>
        </Reveal>
        <Reveal delay={0.15}>
          <form onSubmit={(e)=>{e.preventDefault(); alert("Thank you for contacting Performance Pros! We will reach out soon.")}} className="max-w-xl mx-auto flex flex-col gap-4">
            <input type="text" name="name" placeholder="Your Name" required className="p-3 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:border-cyan-400" />
            <input type="email" name="email" placeholder="Your Email" required className="p-3 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:border-cyan-400" />
            <textarea name="message" placeholder="Your Message" required className="p-3 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:border-cyan-400 h-32" />
            <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white w-fit mx-auto">Send Message</Button>
          </form>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-gray-400 border-t border-white/10 flex flex-col items-center gap-3">
        <div className="flex gap-4 mb-2">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400" aria-label="Facebook">
            <Facebook size={22} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400" aria-label="Instagram">
            <Instagram size={22} />
          </a>
        </div>
        <p>© {new Date().getFullYear()} Performance Pros. Built to Perform.</p>
      </footer>

      <Lightbox open={!!selected} onClose={() => setSelected(null)} item={selected} />
    </div>
  );
}
