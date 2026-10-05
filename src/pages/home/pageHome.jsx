import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  UtensilsCrossed,
  QrCode,
  TrendingUp,
  Smartphone,
  Monitor,
  ShoppingBag,
  LayoutDashboard,
  Sparkles,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Menu,
  X,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

// const MENU_URL =
//   "https://menuonline.com/menu/the-good-food?table=5";

const NAV = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#platform" },
  { label: "How it works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

const MINI = [
  {
    icon: QrCode,
    title: "QR Menu",
    text: "Fast & easy access",
  },
  {
    icon: ShoppingBag,
    title: "Online Orders",
    text: "More sales",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    text: "Full control",
  },
];

const SOLUTIONS = [
  {
    icon: Smartphone,
    title: "Menu Online",
    img: "menu3.png",
    text: "A beautiful digital menu where customers can discover your meals, explore your dishes, check prices, view photos, customize their orders, and place orders directly from their phones. Make your restaurant more modern, accessible, and convenient with a simple digital experience designed for both customers and restaurant staff.",
  },
  {
    icon: Monitor,
    title: "Restaurant Dashboard",
    img: "dach.png",
    text: "Manage your restaurant from one powerful and easy-to-use dashboard. Create and organize meals and categories, manage tables and QR codes, track customer orders in real time, monitor restaurant activity, customize your restaurant's appearance, and control staff access and permissions all in one place. Simplify daily operations, improve order management, and deliver a seamless digital dining experience.",
  },
];

const STEPS = [
  {
    n: "01",
    icon: UserPlus,
    title: "Create Account",
    text: "Sign up and set up your restaurant profile.",
  },
  {
    n: "02",
    icon: UtensilsCrossed,
    title: "Build Your Menu",
    text: "Add categories, meals, prices and images.",
  },
  {
    n: "03",
    icon: QrCode,
    title: "Generate QR Codes",
    text: "Create QR codes for your tables and restaurant.",
  },
  {
    n: "04",
    icon: TrendingUp,
    title: "Receive Orders",
    text: "Customers scan and place orders instantly.",
  },
];

const PERKS = [
  {
    icon: Sparkles,
    title: "Easy to Use",
    text: "No technical skills needed.",
  },
  {
    icon: ShoppingBag,
    title: "Increase Your Sales",
    text: "Faster orders, happier customers.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    text: "Your data is always protected.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    text: "We're here whenever you need us.",
  },
];

const FOOTER_COLS = [
  {
    title: "Product",
    links: [
      ["Features", "#platform"],
      ["How it works", "#how-it-works"],
      ["Pricing", "#"],
      ["Blog", "#"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Help Center", "#"],
      ["Contact", "#"],
      ["Terms of Service", "#"],
      ["Privacy Policy", "#"],
    ],
  },
];

const svgProps = {
  viewBox: "0 0 24 24",
  className: "h-3.5 w-3.5",
  fill: "currentColor",
  "aria-hidden": true,
};

const Facebook = () => (
  <svg {...svgProps}>
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
  </svg>
);

const Instagram = () => (
  <svg
    {...svgProps}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle
      cx="17.5"
      cy="6.5"
      r="1"
      fill="currentColor"
    />
  </svg>
);

const Twitter = () => (
  <svg {...svgProps}>
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" />
  </svg>
);

const Linkedin = () => (
  <svg {...svgProps}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
  </svg>
);

const SOCIAL = [Facebook, Instagram, Twitter, Linkedin];

const Eyebrow = ({ children }) => (
  <span className="text-xs font-semibold uppercase tracking-wider text-brand">
    {children}
  </span>
);

function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
        <UtensilsCrossed className="h-5 w-5" />
      </span>

      <span
        className={`text-[22px] font-bold tracking-tight ${
          light ? "text-white" : "text-ink"
        }`}
      >
        Menu<span className="text-brand">Online</span>
      </span>
    </Link>
  );
}

function PageHome() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-ink">

      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">

          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex lg:gap-10">
            {NAV.map((item, i) => (
              <a
                key={item.label}
                href={item.href}
                className={`border-b-2 py-1 text-sm font-medium transition hover:text-brand ${
                  i === 0
                    ? "border-brand"
                    : "border-transparent"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Buttons + Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">

            <Link
              to="/login"
              className="hidden rounded-xl border border-brand bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-sand sm:block sm:px-5"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="hidden rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 sm:block sm:px-5"
            >
              Get Started
            </Link>

            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="rounded-lg p-2 md:hidden"
            >
              {open ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {open && (
          <div className="mx-4 rounded-2xl border border-line bg-white p-5 shadow-xl sm:mx-6 md:hidden">

            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-sm font-medium"
              >
                {item.label}
              </a>
            ))}

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="flex-1 rounded-xl border border-brand py-2.5 text-center text-sm font-semibold"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="flex-1 rounded-xl bg-brand py-2.5 text-center text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>


      {/* =========================================================
              HERO
          ========================================================= */}
          <section
            id="home"
            className="relative overflow-hidden bg-gradient-to-br from-white via-sand to-sand pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36"
          >
            {/* Background Image */}
            <div className="absolute inset-y-0 right-0 w-[100%] lg:block">
              <img
                src="stock-photo-dessert.webp"
                alt=""
                className="h-full w-full object-cover opacity-30"
              />

            </div>

            {/* HERO CONTENT CENTER */}
            <div className="relative mx-auto flex min-h-[520px] max-w-5xl items-center justify-center px-4 sm:px-6 lg:px-8">

              <div className="w-full max-w-3xl text-center">

                {/* Title */}
                <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[60px]">
                  Digital Menu for{" "}
                  <span className="text-brand">Modern</span>{" "}
                  Restaurants
                </h1>

                {/* Description */}
                <p className="mx-auto mt-6 max-w-2xl leading-7 text-muted">
                  Create your digital menu, generate QR codes, manage your
                  restaurant and receive orders all from one powerful platform.
                </p>

                {/* Buttons */}
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

                  <Link
                    to="/register"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 sm:w-auto"
                  >
                    Get Started
                   </Link>
 

                </div>

                {/* MINI FEATURES */}
                <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-line">

                  {MINI.map(({ icon: Icon, title, text }) => (
                    <div
                      key={title}
                      className="flex items-center justify-center gap-3 px-4"
                    >

                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-sand text-brand">
                        <Icon className="h-4 w-4" />
                      </span>

                      <div className="text-left">
                        <p className="text-xs font-bold">
                          {title}
                        </p>

                        <p className="text-[11px] text-muted">
                          {text}
                        </p>
                      </div>

                    </div>
                  ))}

                </div>

              </div>
            </div>
          </section>

      {/* =========================================================
          OUR SOLUTION
      ========================================================= */}
      <section
        id="platform"
        className="bg-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

         <div className="text-center">
 
          <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
            Everything Your Restaurant Needs
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-muted sm:text-[15px]">
            Give your customers a modern digital experience while keeping
            full control of your restaurant.
          </p>
        </div>


          {/* Solutions */}
          <div className="mt-10 flex flex-col gap-10">

            {SOLUTIONS.map(
              ({ icon: Icon, title, img, text }) => (
                <article
                  key={title}
                  className="grid grid-cols-1 items-center gap-8 overflow-hidden rounded-2xl bg-white p-3 sm:grid-cols-2 sm:gap-10 sm:p-4 lg:p-6"
                >

                  {/* Image */}
                  <div className="h-[240px] w-full overflow-hidden rounded-xl sm:h-[320px] lg:h-[380px]">
                    <img
                      src={img}
                      alt={title}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>


                  {/* Text */}
                  <div className="px-2 py-4 sm:px-4">

                    <h3 className="flex items-center justify-center gap-3 text-lg font-bold text-ink sm:justify-start">

                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                        <Icon className="h-5 w-5" />
                      </span>

                      <span>
                        {title}
                      </span>

                    </h3>

                    <p className="mt-4 text-center text-sm leading-7 text-muted sm:text-left">
                      {text}
                    </p>

                  </div>
                </article>
              )
            )}
          </div>
        </div>
      </section>


      {/* =========================================================
              HOW IT WORKS
          ========================================================= */}
          <section
            id="how-it-works"
            className="bg-sand/60 py-16"
          >
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

              <h2 className="mt-2 text-3xl font-bold">
                Get Started in 4 Simple Steps
              </h2>

              <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

                {STEPS.map(
                  ({ n, icon: Icon, title, text }, i) => (
                    <div
                      key={n}
                      className="relative flex flex-col items-center text-center"
                    >

                      {/* Icons */}
                      <div className="flex items-center justify-center gap-2">

                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-xs font-semibold text-brand">
                          {n}
                        </span>

                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sand text-brand">
                          <Icon className="h-6 w-6" />
                        </span>

                      </div>

                      {/* Arrow */}
                      {i < STEPS.length - 1 && (
                        <ArrowRight className="absolute right-0 top-4 hidden h-5 w-5 text-muted lg:block" />
                      )}

                      <h3 className="mt-5 text-lg font-bold">
                        {title}
                      </h3>

                      <p className="mx-auto mt-1 max-w-[240px] text-sm leading-6 text-muted">
                        {text}
                      </p>

                    </div>
                  )
                )}

              </div>
            </div>
          </section>

      {/* =========================================================
          WHY CHOOSE US
      ========================================================= */}
      <section
        id="about"
        className="bg-white py-16"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:px-8">

          {/* Image */}
          <div className="relative mx-auto w-full max-w-[420px] px-4 sm:px-0">

            <div className="absolute inset-0 -m-4 rounded-[60%_40%_55%_45%/55%_50%_50%_45%] bg-gradient-to-br from-brand to-brand-dark" />

            <img
              src="card-bank-app-photo.webp"
              alt="QR menu on a restaurant table"
              className="relative h-[220px] w-full rounded-[60%_40%_55%_45%/55%_50%_50%_45%] object-cover shadow-lg sm:h-[260px] lg:h-[300px]"
            />

          </div>


          {/* Content */}
          <div className="text-center lg:text-left">

            <Eyebrow>Why choose us</Eyebrow>

            <h2 className="mt-2 text-3xl font-bold">
              Built for Your Success
            </h2>


            <div className="mt-8 grid gap-7 sm:grid-cols-2">

              {PERKS.map(
                ({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="flex items-center justify-center gap-4 text-left sm:justify-start"
                  >

                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-sand text-brand">
                      <Icon className="h-5 w-5" />
                    </span>

                    <div>
                      <h3 className="text-sm font-bold">
                        {title}
                      </h3>

                      <p className="text-xs text-muted">
                        {text}
                      </p>
                    </div>

                  </div>
                )
              )}

            </div>
          </div>
        </div>
      </section>


      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="px-4 pb-14 sm:px-6">

        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-line bg-gradient-to-r from-sand to-sand">

          <div className="relative flex flex-col gap-6 px-6 py-8 sm:px-10 sm:py-9 lg:flex-row lg:items-center lg:gap-16">

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-brand">
                Ready to go digital?
              </span>

              <h2 className="mt-1 max-w-sm text-2xl font-bold leading-snug">
                Join thousands of restaurants using MenuOnline
              </h2>
            </div>


            <Link
              to="/register"
              className="relative z-10 inline-flex w-fit items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5"
            >
              Create Your Menu
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>


          {/* CTA Image */}
          <div className="absolute inset-y-0 right-0 hidden w-[300px] lg:block">

            <img
              src="/food-photo.webp"
              alt=""
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-sand to-transparent" />

          </div>

        </div>
      </section>


      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="bg-[var(--surface-dark)] text-[#C5D0D8]">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1.3fr]">

            {/* Brand */}
            <div>

              <Logo light />

              <p className="mt-4 max-w-xs text-xs leading-5">
                A complete digital solution for modern restaurants.
                Create your menu, manage your restaurant and receive
                orders from one platform.
              </p>


              {/* Social */}
              <div className="mt-5 flex gap-2.5">

                {SOCIAL.map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="Social link"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-dark-card)] text-white transition hover:bg-brand"
                  >
                    <Icon />
                  </a>
                ))}

              </div>
            </div>


            {/* Footer columns */}
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>

                <h3 className="text-xs font-bold text-white">
                  {col.title}
                </h3>

                <ul className="mt-4 space-y-2.5 text-xs">

                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="transition hover:text-brand"
                      >
                        {label}
                      </a>
                    </li>
                  ))}

                </ul>
              </div>
            ))}


            {/* Contact */}
            <div>

              <h3 className="text-xs font-bold text-white">
                Get in Touch
              </h3>

              <ul className="mt-4 space-y-3 text-xs">

                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  info@menuonline.com
                </li>

                <li className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  Agadir, Morocco
                </li>

                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  +212 6 12 34 56 78
                </li>

              </ul>
            </div>

          </div>


          {/* Copyright */}
          <div className="mt-10 flex flex-col justify-between gap-2 border-t border-[var(--surface-dark-card)] pt-5 text-xs sm:flex-row">

            <p>
              © 2026 MenuOnline. All rights reserved.
            </p>

            <p>
              Made with{" "}
              <span className="text-brand">♥</span>{" "}
              for restaurants
            </p>

          </div>

        </div>
      </footer>

    </div>
  );
}

export default PageHome;