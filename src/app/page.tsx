"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  Variants,
} from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Star,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Quote,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import { useQuoteModal } from "@/context/QuoteModalContext";
import { useHomepageContent } from "@/lib/admin/store/homepage-store";
import { HOMEPAGE_ICON_MAP } from "@/lib/admin/homepage-icons";
import GalleryModal from "@/components/GalleryModal";
import { GALLERY_PHOTOS } from "@/lib/data/gallery";
import {
  HomepageHero,
  HomepageStat,
  HomepageServicesSection as HomepageServicesSectionType,
  HomepageWhyUsSection as HomepageWhyUsSectionType,
  HomepagePromoBanner,
  HomepageNewsletterBanner,
} from "@/lib/admin/types";

/* ------------------------------------------------------------------ */
/*  Motion variants                                                    */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "Destinations", href: "/destinations" },
  { label: "Circuits", href: "/circuits" },
  { label: "Événementiel", href: "/evenements" },
  { label: "Visa", href: "/visas" },
  { label: "Galerie", href: "/galerie" },
  { label: "À propos", href: "#pourquoi" },
];

const DESTINATIONS = [
  {
    id: "afrique-du-sud",
    name: "Afrique du Sud",
    tag: "Coup de cœur du moment",
    price: "890 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=1600&q=80",
    large: true,
  },
  {
    id: "grand-popo",
    name: "Bénin — Grand-Popo",
    tag: "Plage & farniente",
    price: "45 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1579493933703-70473cdf84f8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ganvie",
    name: "Bénin — Ganvié",
    tag: "Cité lacustre",
    price: "35 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1760637626892-7636eff73752?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "marrakech",
    name: "Maroc — Marrakech",
    tag: "Médina & désert",
    price: "420 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "dubai",
    name: "Émirats — Dubaï",
    tag: "Modernité & luxe",
    price: "650 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "paris",
    name: "France — Paris",
    tag: "Escapade citadine",
    price: "580 000 FCFA",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  },
];

const TESTIMONIALS = [
  {
    name: "Aïcha M.",
    trip: "Séjour Afrique du Sud, 10 jours",
    quote:
      "Un voyage pensé dans les moindres détails. Nomad Tours a su transformer notre rêve de safari en un souvenir inoubliable, sans aucun stress logistique.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    name: "Julien R.",
    trip: "Circuit Pendjari & Nord Bénin",
    quote:
      "L'expertise locale a fait toute la différence. Des hébergements de charme, un guide passionné, et une immersion authentique loin des clichés touristiques.",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    name: "Fatou D.",
    trip: "Escapade Marrakech, 5 jours",
    quote:
      "Réactivité, élégance et écoute. J'ai senti qu'on organisait mon voyage sur-mesure, pas un forfait générique. Je recommande sans hésiter.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    name: "Marc-Antoine K.",
    trip: "Séminaire d'entreprise, Cotonou",
    quote:
      "Nomad Tours a orchestré notre séminaire d'entreprise avec un vrai sens du détail. Une prestation événementielle au niveau international.",
    avatar:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=200&h=200&q=80",
  },
];

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */

function AnimatedCounter({
  value,
  suffix = "",
  duration = 1600,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let raf: number;
    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

function PremiumHeader({ onOpenQuote }: { onOpenQuote: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-luxe-sand/95 backdrop-blur-md shadow-[0_1px_24px_rgba(0,0,0,0.07)] py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <span className="w-10 h-10 rounded-full bg-white shadow-sm overflow-hidden flex items-center justify-center shrink-0">
            <Image src="/nomad-logo.jpg" alt="Nomad Tours" width={40} height={40} className="w-full h-full object-cover scale-125" />
          </span>
          <span
            className={`font-serif text-xl tracking-tight transition-colors duration-500 ${
              scrolled ? "text-luxe-ink" : "text-white"
            }`}
          >
            Nomad<span className="text-luxe-terracotta italic"> Tours</span>
          </span>
        </Link>

        <nav
          className={`hidden lg:flex items-center gap-9 text-[13px] font-medium tracking-wide uppercase transition-colors duration-500 ${
            scrolled ? "text-luxe-ink/80" : "text-white/90"
          }`}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative py-1 hover:opacity-70 transition-opacity after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <button
            onClick={onOpenQuote}
            className="bg-luxe-terracotta hover:bg-luxe-terracotta-dark text-white text-[13px] font-semibold tracking-wide px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Planifier mon voyage
          </button>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className={`lg:hidden p-2 -mr-2 transition-colors duration-500 ${
            scrolled ? "text-luxe-ink" : "text-white"
          }`}
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-luxe-ink/60 backdrop-blur-sm z-[60] lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-luxe-sand p-8 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-14">
                <span className="font-serif text-lg text-luxe-ink">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 -mr-2 text-luxe-ink"
                  aria-label="Fermer le menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-4 text-2xl font-serif text-luxe-ink border-b border-luxe-ink/10"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenQuote();
                }}
                className="mt-10 bg-luxe-terracotta text-white py-4 rounded-full font-semibold tracking-wide"
              >
                Planifier mon voyage
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

function HeroSection({
  content,
  onOpenQuote,
}: {
  content: HomepageHero;
  onOpenQuote: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen min-h-[680px] w-full overflow-hidden flex items-end"
    >
      <motion.div style={{ y }} className="absolute inset-0 -top-24 h-[130%]">
        <Image
          src={content.backgroundImage}
          alt="Savane africaine baignée de lumière au coucher du soleil"
          fill
          priority
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-luxe-ink via-luxe-ink/45 to-luxe-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-luxe-ink/60 via-transparent to-transparent" />

      <motion.div
        style={{ opacity: overlayOpacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-28 lg:pb-32"
      >
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-white/85 border border-white/30 rounded-full px-4 py-2 mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-luxe-gold" />
            {content.eyebrow}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="font-serif text-white text-[clamp(2.75rem,6vw,6rem)] leading-[1.05] tracking-tight max-w-4xl"
          >
            {content.headlineLine1}
            <br />
            <span className="italic text-luxe-gold">{content.headlineHighlight}</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-white/85 text-lg max-w-xl font-light leading-relaxed"
          >
            {content.subheadline}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 sm:p-4 max-w-3xl shadow-2xl"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onOpenQuote();
              }}
              className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-stretch"
            >
              <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl sm:border-r border-white/15">
                <MapPin className="w-4 h-4 text-luxe-gold shrink-0" />
                <select className="bg-transparent text-white text-sm w-full outline-none [&>option]:text-luxe-ink">
                  <option>Destination</option>
                  <option>Bénin</option>
                  <option>Afrique du Sud</option>
                  <option>Maroc</option>
                  <option>Dubaï</option>
                  <option>Paris</option>
                </select>
              </div>
              <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl sm:border-r border-white/15">
                <Calendar className="w-4 h-4 text-luxe-gold shrink-0" />
                <select className="bg-transparent text-white text-sm w-full outline-none [&>option]:text-luxe-ink">
                  <option>Dates</option>
                  <option>Flexible</option>
                  <option>Ce mois-ci</option>
                  <option>Dans 3 mois</option>
                </select>
              </div>
              <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl sm:border-r border-white/15">
                <Users className="w-4 h-4 text-luxe-gold shrink-0" />
                <select className="bg-transparent text-white text-sm w-full outline-none [&>option]:text-luxe-ink">
                  <option>Voyageurs</option>
                  <option>1 personne</option>
                  <option>2 personnes</option>
                  <option>3-5 personnes</option>
                  <option>Groupe (6+)</option>
                </select>
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-luxe-terracotta hover:bg-luxe-terracotta-dark text-white text-sm font-semibold rounded-xl py-3 transition-colors duration-300"
              >
                <Search className="w-4 h-4" />
                Rechercher
              </button>
            </form>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/60 text-[10px] tracking-[0.3em] uppercase">
          Découvrir
        </span>
        <div className="w-px h-10 bg-white/25 relative overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-white"
          />
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Trust bar                                                          */
/* ------------------------------------------------------------------ */

function TrustBar({ stats }: { stats: HomepageStat[] }) {
  return (
    <section className="bg-luxe-sand border-y border-luxe-ink/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={fadeUp}
              className="text-center md:text-left md:border-l md:first:border-l-0 md:pl-8 md:first:pl-0 border-luxe-ink/10"
            >
              <div className="font-serif text-4xl sm:text-5xl text-luxe-emerald">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-1 text-xs sm:text-sm text-luxe-ink/60 tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Services                                                           */
/* ------------------------------------------------------------------ */

function ServicesSection({ content }: { content: HomepageServicesSectionType }) {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 sm:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="mb-14 max-w-2xl"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-luxe-gold" />
          <span className="text-xs tracking-[0.2em] uppercase text-luxe-terracotta font-semibold">
            {content.eyebrow}
          </span>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="font-serif text-3xl sm:text-5xl text-luxe-ink leading-tight"
        >
          {content.title}
        </motion.h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {content.items.map((service) => {
          const Icon = HOMEPAGE_ICON_MAP[service.icon];
          return (
            <motion.div key={service.id} variants={fadeUp} className="group">
              <Link
                href={service.href}
                className="block bg-white rounded-2xl overflow-hidden border border-luxe-ink/10 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-luxe-ink/20" />
                  <div className="absolute bottom-3 left-3 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-luxe-terracotta">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="p-6 space-y-2.5">
                  <h3 className="font-serif text-lg text-luxe-ink">
                    {service.title}
                  </h3>
                  <p className="text-sm text-luxe-ink/60 leading-relaxed">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-luxe-terracotta pt-1">
                    Découvrir
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Destinations bento                                                 */
/* ------------------------------------------------------------------ */

function DestinationsSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 sm:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
      >
        <div className="max-w-xl">
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-luxe-gold" />
            <span className="text-xs tracking-[0.2em] uppercase text-luxe-terracotta font-semibold">
              Inspirations de voyage
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-serif text-3xl sm:text-5xl text-luxe-ink leading-tight"
          >
            Destinations vedettes
          </motion.h2>
        </div>
        <motion.div variants={fadeUp}>
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm font-semibold text-luxe-ink border-b border-luxe-ink/30 pb-1 hover:border-luxe-terracotta hover:text-luxe-terracotta transition-colors"
          >
            Voir tout le catalogue
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-5"
      >
        {DESTINATIONS.map((dest) => (
          <motion.div
            key={dest.id}
            variants={fadeUp}
            className={`group relative overflow-hidden rounded-2xl ${
              dest.large
                ? "sm:col-span-2 lg:col-span-2 lg:row-span-2 h-[340px] lg:h-full"
                : "h-[260px]"
            }`}
          >
            <Image
              src={dest.image}
              alt={dest.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxe-ink/85 via-luxe-ink/10 to-transparent transition-opacity duration-500" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <span className="text-[10px] tracking-[0.2em] uppercase text-luxe-gold font-semibold mb-2">
                {dest.tag}
              </span>
              <h3
                className={`font-serif text-white leading-tight mb-3 ${
                  dest.large ? "text-3xl sm:text-4xl" : "text-xl"
                }`}
              >
                {dest.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-xs">
                  à partir de{" "}
                  <strong className="text-white font-semibold">
                    {dest.price}
                  </strong>
                </span>
                <span className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Why us                                                             */
/* ------------------------------------------------------------------ */

function WhyUsSection({ content }: { content: HomepageWhyUsSectionType }) {
  return (
    <section id="pourquoi" className="max-w-7xl mx-auto px-6 lg:px-10 py-24 sm:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-luxe-gold" />
            <span className="text-xs tracking-[0.2em] uppercase text-luxe-terracotta font-semibold">
              {content.eyebrow}
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-serif text-3xl sm:text-5xl text-luxe-ink leading-tight mb-6"
          >
            {content.title}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-luxe-ink/65 leading-relaxed mb-10 max-w-lg"
          >
            {content.intro}
          </motion.p>

          <div className="space-y-7">
            {content.items.map((item) => {
              const Icon = HOMEPAGE_ICON_MAP[item.icon];
              return (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  className="flex gap-5"
                >
                  <div className="w-11 h-11 rounded-full border border-luxe-gold/40 flex items-center justify-center text-luxe-terracotta shrink-0">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-luxe-ink mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-luxe-ink/60 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="relative h-[520px] hidden lg:block"
        >
          <motion.div
            variants={fadeUp}
            className="absolute top-0 left-0 w-[65%] h-[62%] rounded-2xl overflow-hidden shadow-xl"
          >
            <Image
              src={content.image1}
              alt="Dunes du désert"
              fill
              className="object-cover"
            />
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="absolute bottom-0 right-0 w-[58%] h-[55%] rounded-2xl overflow-hidden shadow-xl border-8 border-luxe-sand"
          >
            <Image
              src={content.image2}
              alt="Plage et pirogues traditionnelles"
              fill
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Featured circuit                                                   */
/* ------------------------------------------------------------------ */

function FeaturedCircuitSection({ content }: { content: HomepagePromoBanner }) {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 sm:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-xl">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[340px] lg:h-auto min-h-[480px]"
        >
          <Image
            src={content.image}
            alt="Chaîne de l'Atacora et pays Somba"
            fill
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="bg-luxe-emerald text-white p-10 sm:p-14 flex flex-col justify-center"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex w-fit items-center gap-2 text-[11px] tracking-[0.2em] uppercase bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6"
          >
            <Star className="w-3.5 h-3.5 text-luxe-gold fill-luxe-gold" />
            {content.badge}
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="font-serif text-3xl sm:text-4xl leading-tight mb-3"
          >
            {content.title}
          </motion.h2>

          <motion.p variants={fadeUp} className="text-white/70 text-sm mb-8">
            {content.subtitle}
          </motion.p>

          <motion.ul variants={staggerContainer} className="space-y-3 mb-10">
            {content.highlights.map((h) => (
              <motion.li
                key={h}
                variants={fadeUp}
                className="flex items-start gap-3 text-sm text-white/85"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-luxe-gold mt-1.5 shrink-0" />
                {h}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            variants={fadeUp}
            className="flex items-center justify-between flex-wrap gap-6"
          >
            <div>
              <span className="text-xs text-white/60 block mb-1">
                {content.priceLabel}
              </span>
              <span className="font-serif text-3xl">
                {content.priceValue}{" "}
                <span className="text-sm font-sans text-white/60">
                  / pers.
                </span>
              </span>
            </div>
            <Link
              href={content.ctaHref}
              className="inline-flex items-center gap-2 bg-white text-luxe-emerald text-sm font-semibold px-6 py-3.5 rounded-full hover:bg-luxe-sand transition-colors duration-300"
            >
              {content.ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Testimonials                                                       */
/* ------------------------------------------------------------------ */

function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const t = TESTIMONIALS[index];

  const next = () => setIndex((i) => (i + 1) % TESTIMONIALS.length);
  const prev = () =>
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="bg-luxe-emerald text-white py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-luxe-gold" />
            <span className="text-xs tracking-[0.2em] uppercase text-luxe-gold font-semibold">
              Ils nous ont fait confiance
            </span>
            <span className="w-8 h-px bg-luxe-gold" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-serif text-3xl sm:text-4xl mb-14"
          >
            Ce que nos voyageurs racontent
          </motion.h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Quote className="w-8 h-8 text-luxe-gold/60 mx-auto mb-6" strokeWidth={1.2} />
              <p className="font-serif italic text-xl sm:text-2xl leading-relaxed text-white/95 max-w-2xl mx-auto mb-8">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-luxe-gold/50">
                  <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-white/60">{t.trip}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-6 mt-12">
            <button
              onClick={prev}
              aria-label="Témoignage précédent"
              className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((item, i) => (
                <button
                  key={item.name}
                  onClick={() => setIndex(i)}
                  aria-label={`Aller au témoignage ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-luxe-gold" : "w-1.5 bg-white/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Témoignage suivant"
              className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Gallery — "Instants Nomades"                                       */
/* ------------------------------------------------------------------ */

function GallerySection() {
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 sm:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
      >
        <div className="max-w-xl">
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-luxe-gold" />
            <span className="text-xs tracking-[0.2em] uppercase text-luxe-terracotta font-semibold">
              Instants Nomades
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-serif text-3xl sm:text-5xl text-luxe-ink leading-tight mb-4"
          >
            Nos voyageurs, en images
          </motion.h2>
          <motion.p variants={fadeUp} className="text-luxe-ink/60">
            Un aperçu des moments capturés lors de nos circuits passés — de vraies photos, de vrais souvenirs.
          </motion.p>
        </div>
        <motion.div variants={fadeUp}>
          <Link
            href="/galerie"
            className="inline-flex items-center gap-2 text-sm font-semibold text-luxe-ink border-b border-luxe-ink/30 pb-1 hover:border-luxe-terracotta hover:text-luxe-terracotta transition-colors"
          >
            Voir toute la galerie
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        {GALLERY_PHOTOS.map((photo, idx) => (
          <motion.button
            key={photo.id}
            variants={fadeUp}
            onClick={() => setModalIndex(idx)}
            className={`group relative overflow-hidden rounded-2xl text-left ${
              idx === 0 ? "col-span-2 row-span-2 h-[320px] sm:h-[420px]" : "h-[150px] sm:h-[200px]"
            }`}
          >
            <Image
              src={photo.image}
              alt={photo.caption}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxe-ink/80 via-luxe-ink/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
              <span className="text-[10px] tracking-[0.15em] uppercase text-luxe-gold font-semibold mb-1">
                {photo.location}
              </span>
              <p className="text-white text-sm font-medium leading-snug">{photo.caption}</p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <GalleryModal
        isOpen={modalIndex !== null}
        images={GALLERY_PHOTOS.map((p) => p.image)}
        initialIndex={modalIndex ?? 0}
        onClose={() => setModalIndex(null)}
        title="Instants Nomades"
      />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Newsletter                                                         */
/* ------------------------------------------------------------------ */

function NewsletterSection({ content }: { content: HomepageNewsletterBanner }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section className="relative bg-luxe-terracotta py-24 sm:py-28 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={staggerContainer}
        className="relative max-w-2xl mx-auto px-6 text-center"
      >
        <motion.h2
          variants={fadeUp}
          className="font-serif text-3xl sm:text-5xl text-white leading-tight mb-4"
        >
          {content.title}
        </motion.h2>
        <motion.p variants={fadeUp} className="text-white/80 mb-10">
          {content.subtitle}
        </motion.p>

        {subscribed ? (
          <motion.div
            variants={fadeUp}
            className="bg-white/15 border border-white/25 rounded-2xl px-6 py-4 text-white text-sm max-w-md mx-auto"
          >
            {content.confirmMessage}
          </motion.div>
        ) : (
          <motion.form
            variants={fadeUp}
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setSubscribed(true);
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="flex-grow bg-white/10 border border-white/25 rounded-full px-5 py-3.5 text-sm text-white placeholder-white/60 outline-none focus:bg-white/15 transition-colors"
            />
            <button
              type="submit"
              className="bg-luxe-ink hover:bg-black text-white text-sm font-semibold px-7 py-3.5 rounded-full transition-colors shrink-0"
            >
              S&apos;inscrire
            </button>
          </motion.form>
        )}
        <motion.p variants={fadeUp} className="text-white/60 text-xs mt-5">
          {content.disclaimer}
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                              */
/* ------------------------------------------------------------------ */

function PremiumFooter() {
  return (
    <footer className="bg-luxe-ink text-white/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-14 border-b border-white/10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-10 h-10 rounded-full bg-white shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                <Image src="/nomad-logo.jpg" alt="Nomad Tours" width={40} height={40} className="w-full h-full object-cover scale-125" />
              </span>
              <span className="font-serif text-xl text-white">
                Nomad<span className="text-luxe-terracotta italic"> Tours</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Voyages sur-mesure au Bénin et à l&apos;international. Une
              agence à taille humaine, une exigence sans compromis.
            </p>
          </div>

          <div>
            <h4 className="text-white font-serif text-base mb-5">Navigation</h4>
            <ul className="space-y-3 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-serif text-base mb-5">Services</h4>
            <ul className="space-y-3 text-sm">
              <li>Circuits sur-mesure</li>
              <li>Billetterie aérienne</li>
              <li>Assistance e-Visa</li>
              <li>Événementiel & séminaires</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-serif text-base mb-5">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-luxe-terracotta shrink-0" />
                Cotonou, Bénin
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-luxe-terracotta shrink-0" />
                +229 01 97 00 00 00
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-luxe-terracotta shrink-0" />
                contact@nomadtours.bj
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:border-luxe-gold hover:text-luxe-gold transition-colors"
              >
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:border-luxe-gold hover:text-luxe-gold transition-colors"
              >
                <Facebook className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a
                href="#"
                aria-label="Youtube"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:border-luxe-gold hover:text-luxe-gold transition-colors"
              >
                <Youtube className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} Nomad Tours. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const { openQuoteModal } = useQuoteModal();
  const content = useHomepageContent();

  return (
    <div className="bg-luxe-sand text-luxe-ink font-sans overflow-x-hidden">
      <PremiumHeader onOpenQuote={() => openQuoteModal()} />
      <HeroSection content={content.hero} onOpenQuote={() => openQuoteModal()} />
      <TrustBar stats={content.stats} />
      <ServicesSection content={content.services} />
      <DestinationsSection />
      <WhyUsSection content={content.whyUs} />
      <FeaturedCircuitSection content={content.featuredCircuit} />
      <TestimonialsSection />
      <GallerySection />
      <NewsletterSection content={content.newsletter} />
      <PremiumFooter />
    </div>
  );
}
