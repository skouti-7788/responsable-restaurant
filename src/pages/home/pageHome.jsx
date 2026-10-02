import { useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  UserPlus, UtensilsCrossed, QrCode, TrendingUp, Smartphone, Monitor,
  ShoppingBag, LayoutDashboard, Sparkles, ShieldCheck, Headphones,
  ArrowRight, Menu, X, Mail, MapPin, Phone,
} from "lucide-react";

const MENU_URL = "https://menuonline.com/menu/the-good-food?table=5";
const NAV = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#platform" },
  { label: "How it works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

const MINI = [
  { icon: QrCode, title: "QR Menu", text: "Fast & easy access" },
  { icon: ShoppingBag, title: "Online Orders", text: "More sales" },
  { icon: LayoutDashboard, title: "Dashboard", text: "Full control" },
];

const SOLUTIONS = [
  { icon: Smartphone, title: "Menu Online", img: "menu3.png",
    text: "A beautiful digital menu where customers can discover your meals, explore your dishes, check prices, view photos, customize their orders, and place orders directly from their phones. Make your restaurant more modern, accessible, and convenient with a simple digital experience designed for both customers and restaurant staff." },
  { icon: Monitor, title: "Restaurant Dashboard", img: "/images/dashboard-preview.png",
    text: "Manage your restaurant from one powerful and easy-to-use dashboard. Create and organize meals and categories, manage tables and QR codes, track customer orders in real time, monitor restaurant activity, customize your restaurant's appearance, and control staff access and permissions all in one place. Simplify daily operations, improve order management, and deliver a seamless digital dining experience" },
];

const STEPS = [
  { n: "01", icon: UserPlus, title: "Create Account", text: "Sign up and set up your restaurant profile." },
  { n: "02", icon: UtensilsCrossed, title: "Build Your Menu", text: "Add categories, meals, prices and images." },
  { n: "03", icon: QrCode, title: "Generate QR Codes", text: "Create QR codes for your tables and restaurant." },
  { n: "04", icon: TrendingUp, title: "Receive Orders", text: "Customers scan and place orders instantly." },
];

const PERKS = [
  { icon: Sparkles, title: "Easy to Use", text: "No technical skills needed." },
  { icon: ShoppingBag, title: "Increase Your Sales", text: "Faster orders, happier customers." },
  { icon: ShieldCheck, title: "Secure & Reliable", text: "Your data is always protected." },
  { icon: Headphones, title: "24/7 Support", text: "We're here whenever you need us." },
];

const FOOTER_COLS = [
  { title: "Product", links: [["Features", "#platform"], ["How it works", "#how-it-works"], ["Pricing", "#"], ["Blog", "#"]] },
  { title: "Support", links: [["Help Center", "#"], ["Contact", "#"], ["Terms of Service", "#"], ["Privacy Policy", "#"]] },
];

const svgProps = { viewBox: "0 0 24 24", className: "h-3.5 w-3.5", fill: "currentColor", "aria-hidden": true };

const Facebook = () => (
  <svg {...svgProps}><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" /></svg>
);
const Instagram = () => (
  <svg {...svgProps} fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
);
const Twitter = () => (
  <svg {...svgProps}><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" /></svg>
);
const Linkedin = () => (
  <svg {...svgProps}><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" /></svg>
);

const SOCIAL = [Facebook, Instagram, Twitter, Linkedin];

const Eyebrow = ({ children }) => (
  <span className="text-xs font-semibold uppercase tracking-wider text-brand">{children}</span>
);

function Logo({ light }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
        <UtensilsCrossed className="h-5 w-5" />
      </span>
      <span className={`text-[22px] font-bold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Menu<span className="text-brand">Online</span>
      </span>
    </Link>
  );
}

function PageHome() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-ink">
    {/* <div className="min-h-screen overflow-x-hidden bg-[#FFF9ED] font-sans text-[#12343C]"> */}
      {/* NAVBAR */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Logo />

          <div className="hidden items-center gap-10 md:flex">
            {NAV.map((item, i) => (
              <a key={item.label} href={item.href}
                className={`border-b-2 py-1 text-sm font-medium transition hover:text-brand ${
                  i === 0 ? "border-brand" : "border-transparent"}`}>
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login"
              className="hidden rounded-xl border border-brand bg-white px-5 py-2.5 text-sm font-semibold transition hover:bg-sand sm:block">
              Login
            </Link>
            <Link to="/register"
              className="hidden rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 sm:block">
              Get Started
            </Link>
            <button onClick={() => setOpen(!open)} aria-label="Toggle menu"
              className="rounded-lg p-2 md:hidden">
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="mx-6 rounded-2xl border border-line bg-white p-5 shadow-xl md:hidden">
            {NAV.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setOpen(false)}
                className="block py-2.5 text-sm font-medium">{item.label}</a>
            ))}
            <div className="mt-3 flex gap-3">
              <Link to="/login" className="flex-1 rounded-xl border border-brand py-2.5 text-center text-sm font-semibold">Login</Link>
              <Link to="/register" className="flex-1 rounded-xl bg-brand py-2.5 text-center text-sm font-semibold text-white">Get Started</Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-white via-sand to-[#FFF1D6] pb-16 pt-32 lg:pb-20 lg:pt-36">
        <div className="absolute inset-y-0 right-0 hidden w-[42%] lg:block">
          <img src="stock-photo-dessert.webp" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-sand via-sand/70 to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
          <div className="max-w-xl">
            {/* <span className="inline-flex rounded-full border border-[#FBD9A0] bg-[#FFF8EC] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand">
              The smart menu solution
            </span> */}
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight lg:text-[56px]">
              Digital Menu for <span className="text-brand">Modern</span> Restaurants
            </h1>
            <p className="mt-5 max-w-md leading-7 text-muted">
              Create your digital menu, generate QR codes, manage your restaurant and
              receive orders  all from one powerful platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#platform"
                className="inline-flex items-center justify-center rounded-xl border border-brand bg-white px-7 py-3.5 text-sm font-semibold transition hover:bg-sand">
                Learn More
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-line">
              {MINI.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-center gap-3 sm:px-5 sm:first:pl-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FBD9A0] bg-sand text-brand">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-bold">{title}</p>
                    <p className="text-[11px] text-muted">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VISUAL */}
          <div className="relative mx-auto h-[500px] w-full max-w-[460px]">
            <div className="absolute left-[16%] top-[8%] h-[360px] w-[207px] rotate-[-7deg] rounded-[2rem] bg-gradient-to-br from-[#FFD66B] to-[#FFB347] opacity-80" />

            <div className="absolute left-[-38%] top-[-25px]   z-20 w-[740px]  shadow-black/30">
              <div className="overflow-hidden rounded-[30px]  ">
                <img src="menu.png" alt="Menu Online mobile app"
                  className="h-[490px] w-full    object-top" />
              </div>
            </div>

            <p className="absolute right-0 top-[4%] z-30 -rotate-6 text-center font-serif text-base italic leading-5">
              Simple,<br />Fast, Digital
            </p>

            <div className="absolute bottom-[12%] right-0 z-30 w-[160px] rounded-2xl border border-line bg-white p-4 text-center shadow-2xl">
              <p className="text-sm font-bold">Scan for Menu</p>
              <div className="mt-3 flex justify-center">
                <QRCodeSVG value={MENU_URL} size={88} fgColor="#12343C" />
              </div>
              <p className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-muted">
                <QrCode className="h-3 w-3 text-brand" /> Table 5
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR SOLUTION */}
      <section id="platform" className="bg-white py-20">
        <div className="mx-auto   max-w-7xl items-start  px-6   lg:px-8">
          <div>
            <Eyebrow>Our solution</Eyebrow>
            <h2 className="mt-3 text-4xl font-bold leading-tight">Everything Your Restaurant Needs</h2>
            <p className="mt-2 text-[15px] leading-7 text-muted">
              Give your customers a modern digital experience while keeping full control of your restaurant.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-6">
            {SOLUTIONS.map(({ icon: Icon, title, img, text }) => (
              <article
                key={title}
                className="grid grid-cols-1 items-center gap-80 overflow-hidden rounded-2xl  bg-white p-4 px-25  sm:grid-cols-[220px_1fr]"
              >
                {/* Image à gauche */}
                <div className="h-150 w-[200%] overflow-hidden ">
                  <img 
                    src={img}
                    alt={title}
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                {/* Texte à droite */}
                <div className="p-2">
                  <h3 className="flex items-center gap-3 text-base font-bold text-ink">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted">
                    {text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-sand/60 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold">Get Started in 4 Simple Steps</h2>

          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ n, icon: Icon, title, text }, i) => (
              <div key={n} className="relative">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFE7C2] text-xs font-semibold text-brand">{n}</span>
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFE1B0] text-brand">
                    <Icon className="h-6 w-6" />
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="absolute right-6 top-4 hidden h-5 w-5 text-[#F5CF9A] lg:block" />
                )}
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-1 max-w-[200px] text-sm leading-6 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="about" className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1fr_1.3fr] lg:px-8">
          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="absolute inset-0 -m-4 rounded-[60%_40%_55%_45%/55%_50%_50%_45%] bg-gradient-to-br from-[#FFD66B] to-[#FFB347]" />
            <img src="card-bank-app-photo.webp" alt="QR menu on a restaurant table"
              className="relative h-[220px] w-full  rounded-[60%_40%_55%_45%/55%_50%_50%_45%] object-cover shadow-lg" />
          </div>

          <div>
            <Eyebrow>Why choose us</Eyebrow>
            <h2 className="mt-2 text-3xl font-bold">Built for Your Success</h2>
            <div className="mt-8 grid gap-7 sm:grid-cols-2">
              {PERKS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#FBD9A0] bg-sand text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold">{title}</h3>
                    <p className="text-xs text-muted">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-14">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-[#F9DFB2] bg-gradient-to-r from-[#FFF2D8] to-[#FFE4B5]">
          <div className="relative flex flex-col gap-6 px-8 py-9 sm:px-10 lg:flex-row lg:items-center lg:gap-16">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-brand">Ready to go digital?</span>
              <h2 className="mt-1 max-w-sm text-2xl font-bold leading-snug">
                Join thousands of restaurants using MenuOnline
              </h2>
            </div>
            <Link to="/register"
              className="relative z-10 inline-flex w-fit items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5">
              Create Your Menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="absolute inset-y-0 right-0 hidden w-[300px] lg:block">
            <img src="/food-photo.webp" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFE4B5] to-transparent" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#10202C] text-[#C5D0D8]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
            <div>
              <Logo light />
              <p className="mt-4 max-w-xs text-xs leading-5">
                A complete digital solution for modern restaurants. Create your menu,
                manage your restaurant and receive orders from one platform.
              </p>
              <div className="mt-5 flex gap-2.5">
                {SOCIAL.map((Icon, i) => (
                  <a key={i} href="#" aria-label="Social link"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D3444] text-white transition hover:bg-brand">
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-bold text-white">{col.title}</h3>
                <ul className="mt-4 space-y-2.5 text-xs">
                  {col.links.map(([label, href]) => (
                    <li key={label}><a href={href} className="transition hover:text-brand">{label}</a></li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="text-xs font-bold text-white">Get in Touch</h3>
              <ul className="mt-4 space-y-3 text-xs">
                <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> info@menuonline.com</li>
                <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Agadir, Morocco</li>
                <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> +212 6 12 34 56 78</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col justify-between gap-2 border-t border-[#21384A] pt-5 text-xs sm:flex-row">
            <p>© 2026 MenuOnline. All rights reserved.</p>
            <p>Made with <span className="text-brand">♥</span> for restaurants</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PageHome;