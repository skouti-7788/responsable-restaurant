import {
  Star, Leaf, Flame,
  Check, ChefHat, Truck, Flame as FlameFilled,
} from "lucide-react";
import restaurantLogo from "../assets/restaurant.png";
import axios from "../api/axios";
/* ============================================================================
   MENUPRO — Digital QR-code restaurant menu & ordering experience
   Restaurant demo content: "EMBER & SALT" — wood-fired coastal kitchen

   ARCHITECTURE NOTES (for Laravel backend integration)
   ----------------------------------------------------------------------------
   The `api` object below is a mock REST client. Every method returns a
   Promise shaped exactly like the real response the Laravel API should
   return. Swap the internals of each method for a real `fetch()` call and
   nothing else in this file needs to change.

     GET  /api/restaurant                 -> restaurant profile (logo, hours…)
     GET  /api/tables/{code}               -> resolve QR code -> table number
     GET  /api/menu                        -> { categories: [...], items: [...] }
     POST /api/orders                      -> { table_number, items[] } -> Order
     GET  /api/orders/{id}                 -> order status (for live tracking)

   Table number: in production the QR code encodes a URL such as
     https://menu.emberandsalt.com/?table=12
   and the app reads `table` from the query string. In this demo, a value
   is simulated with a graceful fallback so the preview always works.
============================================================================ */

export const RESTAURANT = {
  name: "Ember & Salt",
  tagline: "Wood-fired, ocean-fed.",
  logo: restaurantLogo,
  cover:
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80&auto=format&fit=crop",
  address: "14 Harbor Row, Portside District",
  hours: "12:00 — 23:00",
  phone: "+1 (555) 042-1180",
  rating: 4.8,
  reviewCount: 612,
};

export const CATEGORIES = [
  { key: "starters", label: "Starters" },
  { key: "mains", label: "Main Dishes"},
  { key: "drinks", label: "Drinks"},
  { key: "desserts", label: "Desserts"},
];

// export const FILTERS = [
//   // { key: "popular", label: "Popular", icon: Star },
//   // { key: "veg", label: "Veg", icon: Leaf },
//   // { key: "spicy", label: "Spicy", icon: Flame },
// ];

export const LANGUAGES = {
  en: "EN",
  fr: "FR",
  ar: "AR",
};

export const ORDER_STAGES = [
  { key: "received", label: "Received", labelKey: "stageReceived", icon: Check },
  { key: "preparing", label: "Preparing", labelKey: "stagePreparing", icon: ChefHat },
  { key: "plating", label: "Plating", labelKey: "stagePlating", icon: FlameFilled },
  { key: "serving", label: "On its way", labelKey: "stageServing", icon: Truck },
];

export const TAG_META = {
  spicy: { label: "Spicy", icon: Flame, cls: "tag-spicy" },
  veg: { label: "Veg", icon: Leaf, cls: "tag-veg" },
  popular: { label: "Popular", icon: Star, cls: "tag-popular" },
};

/* ---------------------------- Mock REST client --------------------------- */
export const api = {
  getRestaurant: () =>
    new Promise((resolve) => setTimeout(() => resolve(RESTAURANT), 220)),
  // getMenu: () =>
  //   new Promise((resolve) =>
  //     setTimeout(() => resolve({ categories: CATEGORIES, items: MENU_ITEMS }), 420)
  //   ),
  resolveTable: (code) =>
    new Promise((resolve) => setTimeout(() => resolve({ table_number: code }), 100)),
  // placeOrder: (payload) =>
  //   new Promise((resolve) =>
  //     setTimeout(() => {
  //       // Swap this block for a real fetch('/api/orders', {method:'POST', body: JSON.stringify(payload)})
  //       resolve({
  //         id: "EMB-" + Math.floor(1000 + Math.random() * 9000),
  //         status: "received",
  //         estimated_minutes: 18,
  //         ...payload,
  //       });
  //     }, 900)
  //   ),
  placeOrder: async (slug, payload) => {
    const response = await axios.post(
      `/menu/${slug}/orders`,
      payload
    );
    //  console.log("API RESPONSE:", response.data);
    return response.data;
  },
};

/* -------------------------------- Helpers -------------------------------- */
// export const formatPrice = (n) => `$${Number(n).toFixed(2)}`;
export const formatPrice = (n, t) =>{ 
return (
<div>
  {Number(n ?? 0).toFixed(2)}
<span style={{marginInlineStart:'2px',fontSize:'10px'}}>{t?.currencySymbol || "DH"}</span>
</div>
)};