 import { useState, useEffect, useRef, useCallback, useMemo } from "react";
 import { useParams, useSearchParams } from "react-router-dom";
import "../css/MenuPro.css";
 import {
   translations,
 } from "../i18n";
 import {
   applyMenuLanguageToDocument,
   resolveMenuLanguage,
 } from "../utils/menuLanguage";
 import { useData } from "../api/data";
 import { canSubmitMenuOrder, localizeCartLines } from "../utils/menuCart";

const hexToRgba = (hex, alpha = 1) => {
  if (!hex || typeof hex !== "string") {
    return `rgba(31, 41, 55, ${alpha})`;
  }

  const normalized = hex.replace("#", "");
  const safeHex =
    normalized.length === 3
      ? normalized.split("").map((char) => char + char).join("")
      : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(safeHex)) {
    return `rgba(31, 41, 55, ${alpha})`;
  }

  const value = Number.parseInt(safeHex, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const defaultAppearance = {
  logo: null,
  header_image: null,
  background_image: null,
  primary_color: "#D97706",
  secondary_color: "#92400E",
  text_color: "#1F2937",
  background_color: "#FFFFFF",
  font_family: "Inter",
};

const trustedPreviewOrigins = new Set([
  window.location.origin,
  import.meta.env.VITE_ADMIN_APP_URL,
  import.meta.env.VITE_ADMIN_URL,
  // "http://localhost:5173",
  // "http://127.0.0.1:5173",
  // "http://localhost:5174",
  // "http://127.0.0.1:5174",
  "https://menu-online.vercel.app",
  "https://menuonlinesr02.vercel.app/",

].filter(Boolean).map((origin) => origin.replace(/\/+$/, '')));

import {
  CATEGORIES,
  LANGUAGES,
  // MENU_ITEMS,
  api,
  formatPrice,
} from "../components/Constants";

import {
  ChevronRight,
  Search,
  Globe,
  Star,
} from "lucide-react";

import FoodImage from "../components/FoodImage";
import ProductCard from "../components/ProductCard";
import ChefPicksCarousel from "../components/ChefPicksCarousel";
import ProductModal from "../components/ProductModal";
import CartDrawer from "../components/CartDrawer";
import ConfirmationScreen from "../components/ConfirmationScreen";
import CategoryTabs from "../components/CategoryTabs";

export default function MenuPro() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    restau,
    loading,
    error,
    fetchData,
  } = useData();

  const mslug = slug;
  const tableNumber = searchParams.get("table") || "";
  const displayTableNumber = tableNumber
    ? restau?.selected_table?.number ?? ""
    : "";

  // --------------------------------------------------------------------------
  // API
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // Language
  // --------------------------------------------------------------------------

  const [lang, setLang] = useState(() =>
    resolveMenuLanguage(
      searchParams.get("lang"),
      window.localStorage.getItem("menu-language")
    )
  );
  const t = translations[lang] ?? translations.en;

  // useEffect(() => {
  //   setLang(
  //     resolveMenuLanguage(
  //       searchParams.get("lang"),
  //       window.localStorage.getItem("menu-language")
  //     )
  //   );
  // }, [searchParams]);

  // Load the menu in the selected language. The backend translates restaurant,
  // category and meal content automatically; restaurant users never enter translations.
  useEffect(() => {
    if (mslug) {
      fetchData(mslug, lang, tableNumber);
    }
  }, [mslug, lang, tableNumber, fetchData]);

  useEffect(() => {
    window.localStorage.setItem("menu-language", lang);
    applyMenuLanguageToDocument(lang, document.documentElement);
  }, [lang]);

  // const changeLanguage = (language) => {
  //   const nextSearchParams = new URLSearchParams(searchParams);
  //   nextSearchParams.set("lang", language);
  //   setSearchParams(nextSearchParams, { replace: true });
  // };
  const changeLanguage = (language) => {
    const nextLang = resolveMenuLanguage(language);

    setLang(nextLang);

    window.localStorage.setItem("menu-language", nextLang);

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("lang", nextLang);
      return params;
    });
  };
  // --------------------------------------------------------------------------
  // DEFAULT DATA
  // --------------------------------------------------------------------------

  // The public menu must not silently fall back to demo content when a
  // restaurant slug is missing or the API request fails. We keep the restau
  // as null until the backend confirms the restaurant is valid.

  // --------------------------------------------------------------------------
  // TABLE NUMBER
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // MENU STATE
  // --------------------------------------------------------------------------

  const [activeCategory, setActiveCategory] = useState(
    CATEGORIES[0]?.key || "starters"
  );

  const [stuckTabs, setStuckTabs] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  // const [activeFilters, setActiveFilters] = useState([]);

  // --------------------------------------------------------------------------
  // PRODUCT / CART
  // --------------------------------------------------------------------------

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // --------------------------------------------------------------------------
  // REFS
  // --------------------------------------------------------------------------

  const sectionRefs = useRef({});
  const tabsSentinelRef = useRef(null);

  // --------------------------------------------------------------------------
  // NORMALIZE CATEGORY
  //
  // API:
  // { id, name, image_url }
  //
  // DEFAULT:
  // { id, key, label, icon, ... }
  //
  // If API doesn't send key/icon/label, DEFAULT values are preserved.
  // --------------------------------------------------------------------------

  const normalizeCategory = useCallback((category, index) => {
    const defaultCategory = CATEGORIES[index] || {};

    return {
      // DEFAULT FIRST
      ...defaultCategory,

      // API values AFTER default
      ...category,

      id:
        category?.id ??
        defaultCategory?.id ??
        `category-${index}`,

      key:
        category?.key ||
        defaultCategory?.key ||
        `category-${category?.id ?? index}`,

      label:
        category?.label ||
        category?.name ||
        defaultCategory?.label ||
        "Category",

      // IMPORTANT:
      // If API doesn't provide icon -> keep default icon
      icon:
        category?.icon ||
        defaultCategory?.icon ||
        null,

      // If API doesn't provide image -> keep default image
      image_url:
        category?.image_url ??
        defaultCategory?.image_url ??
        null,
    };
  }, []);

  // --------------------------------------------------------------------------
  // NORMALIZE ITEM
  // --------------------------------------------------------------------------

  const normalizeItem = useCallback((item, index) => {
    if (!item || typeof item !== "object") {
      return null;
    }

    return {
      ...item,

      // Keep API id when available.
      // If missing, create a unique fallback.
      id:
        item.id ??
        `api-item-${index}`,

      name:
        item.name ||
        "Unnamed dish",

      description:
        item.description ||
        "",

      price:
        Number(item.price ?? 0),

      // API image_url first
      image:
        item.image_url ||
        item.image ||
        null,

      category_id:
        item.category_id ??
        item.categoryId ??
        null,

      category:
        item.category ||
        null,

      // IMPORTANT:
      // Prevent item.tags.includes(...) crash
      tags:
        Array.isArray(item.tags)
          ? item.tags
          : [],

      featured:
        Boolean(item.featured),
    };
  }, []);

  // --------------------------------------------------------------------------
  // RESTAURANT
  // --------------------------------------------------------------------------

  const restaurant = useMemo(() => {
    if (restau && typeof restau === "object" && !Array.isArray(restau)) {
      return restau;
    }

    return null;
  }, [restau]);

  const [previewAppearance, setPreviewAppearance] = useState(null);

  const isPreviewMode = useMemo(
    () => new URLSearchParams(window.location.search).get("preview") === "true",
    []
  );

  // useEffect(() => {
  //   // if (!isPreviewMode) {
  //   //   setPreviewAppearance(null);
  //   //   return;
  //   // }

  //   const handleMessage = (event) => {
  //     const origin = event.origin?.replace(/\/+$/, '') || '';

  //     if (!trustedPreviewOrigins.has(origin)) {
  //       return;
  //     }

  //     const payload = event.data;

  //     if (!payload || payload.type !== 'MENU_ONLINE_APPEARANCE_PREVIEW') {
  //       return;
  //     }

  //     if (!payload.appearance || typeof payload.appearance !== 'object') {
  //       return;
  //     }

  //     setPreviewAppearance({
  //       ...defaultAppearance,
  //       ...payload.appearance,
  //     });
  //   };

  //   window.addEventListener('message', handleMessage);

  //   return () => window.removeEventListener('message', handleMessage);
  // }, [isPreviewMode]);
  useEffect(() => {
    const handleMessage = (event) => {
      const origin =
        event.origin?.replace(/\/+$/, '') || '';

      if (!trustedPreviewOrigins.has(origin)) {
        return;
      }

      const payload = event.data;

      if (
        !payload ||
        payload.type !==
          'MENU_ONLINE_APPEARANCE_PREVIEW'
      ) {
        return;
      }

      if (
        !payload.appearance ||
        typeof payload.appearance !== 'object'
      ) {
        return;
      }

      setPreviewAppearance({
        ...defaultAppearance,
        ...payload.appearance,
      });
    };

    window.addEventListener(
      'message',
      handleMessage
    );

    return () => {
      window.removeEventListener(
        'message',
        handleMessage
      );
    };
  }, []);
  const appearance = useMemo(() => {
    const source = isPreviewMode && previewAppearance ? previewAppearance : (restau?.appearance || {});
    return {
      ...defaultAppearance,
      ...source,
    };
  }, [isPreviewMode, previewAppearance, restau]);

  const restaurantName = restaurant?.restaurant?.name || restaurant?.name || "Restaurant";
  const restaurantDescription = restaurant?.restaurant?.description || restaurant?.description || restaurant?.tagline || "";

  const resolvedLogo =
    appearance.logo ||
    restaurant?.restaurant?.logo_url ||
    restaurant?.logo_url ||
    restaurant?.logo ||
    null;

  const resolvedHeaderImage =
    appearance.header_image ||
    restaurant?.restaurant?.cover_image_url ||
    restaurant?.cover_image_url ||
    restaurant?.cover ||
    null;

  const resolvedBackgroundImage = appearance.background_image || null;

  const menuStyle = useMemo(() => ({
    "--primary-color":
      appearance.primary_color ||
      defaultAppearance.primary_color,

    "--secondary-color":
      appearance.secondary_color ||
      defaultAppearance.secondary_color,

    "--text-color":
      appearance.text_color ||
      defaultAppearance.text_color,

    "--background-color":
      appearance.background_color ||
      defaultAppearance.background_color,

    "--bg":
      appearance.background_color ||
      defaultAppearance.background_color,

    "--ink":
      appearance.text_color ||
      defaultAppearance.text_color,

    "--ink-dim":
      appearance.secondary_color ||
      defaultAppearance.secondary_color,

    "--ink-faint":
      appearance.secondary_color ||
      defaultAppearance.secondary_color,

    "--gold":
      appearance.primary_color ||
      defaultAppearance.primary_color,

    "--gold-soft":
      hexToRgba(
        appearance.primary_color ||
          defaultAppearance.primary_color,
        0.18
      ),

    "--ember":
      appearance.secondary_color ||
      defaultAppearance.secondary_color,

    "--ember-soft":
      hexToRgba(
        appearance.secondary_color ||
          defaultAppearance.secondary_color,
        0.18
      ),

    "--hairline":
      hexToRgba(
        appearance.text_color ||
          defaultAppearance.text_color,
        0.18
      ),

    "--bg-elevated":
      hexToRgba(
        appearance.background_color ||
          defaultAppearance.background_color,
        0.96
      ),

    "--bg-elevated-2":
      hexToRgba(
        appearance.background_color ||
          defaultAppearance.background_color,
        0.82
      ),

    "--er":
      appearance.secondary_color === "#ffffff"
        ? "#2c2a2a"
        : "#ffffff",

    "--er1":
      appearance.background_color === "#ffffff"
        ? "#665a5a"
        : "#ffffff",

    // IMPORTANT: FONT
    "--menu-font-family":
      `'${appearance.font_family || defaultAppearance.font_family}', sans-serif`,

    backgroundColor:
      appearance.background_color ||
      defaultAppearance.background_color,

    backgroundImage: resolvedBackgroundImage
      ? `linear-gradient(
          rgba(255,255,255,0.6),
          rgba(255,255,255,0.6)
        ), url(${resolvedBackgroundImage})`
      : undefined,

    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",

    // IMPORTANT: APPLY FONT TO WHOLE MENU
    fontFamily:
      `'${appearance.font_family || defaultAppearance.font_family}', sans-serif`,
  }), [appearance, resolvedBackgroundImage]);
  // --------------------------------------------------------------------------
  // CATEGORIES
  // --------------------------------------------------------------------------

  const categories = useMemo(() => {
    if (
      restau &&
      Array.isArray(restau.categories) &&
      restau.categories.length > 0
    ) {
      return restau.categories
        .map((category, index) =>
          normalizeCategory(category, index)
        )
        .filter(Boolean);
    }

    return [];
  }, [restau, normalizeCategory]);

  // --------------------------------------------------------------------------
  // ITEMS
  // --------------------------------------------------------------------------

  const items = useMemo(() => {
    let apiItems = null;

    if (
      restau &&
      Array.isArray(restau.items) &&
      restau.items.length > 0
    ) {
      apiItems = restau.items;
    } else if (
      restau &&
      Array.isArray(restau.meals) &&
      restau.meals.length > 0
    ) {
      apiItems = restau.meals;
    }

    if (
      apiItems &&
      apiItems.length > 0
    ) {
      const normalizedItems = apiItems
        .map((item, index) =>
          normalizeItem(item, index)
        )
        .filter(Boolean);

      if (normalizedItems.length > 0) {
        return normalizedItems;
      }
    }

    return [];
  }, [restau, normalizeItem]);

  // --------------------------------------------------------------------------
  // STICKY CATEGORY BAR
  // --------------------------------------------------------------------------

  useEffect(() => {
    const el = tabsSentinelRef.current;

    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStuckTabs(!entry.isIntersecting);
      },
      {
        threshold: 0,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [loading]);

  // --------------------------------------------------------------------------
  // SCROLL SPY
  // --------------------------------------------------------------------------

  useEffect(() => {
    if (loading || query) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(
              entry.target.dataset.category
            );
          }
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
      }
    );

    Object.values(sectionRefs.current).forEach(
      (element) => {
        if (element) {
          observer.observe(element);
        }
      }
    );

    return () => observer.disconnect();
  }, [loading, query, categories, items]);

  // --------------------------------------------------------------------------
  // CATEGORY SCROLL
  // --------------------------------------------------------------------------

  const scrollToCategory = useCallback((key) => {
    setActiveCategory(key);

    const element = sectionRefs.current[key];

    if (element) {
      const y =
        element.getBoundingClientRect().top +
        window.scrollY -
        150;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  }, []);

  // --------------------------------------------------------------------------
  // FILTERS
  // --------------------------------------------------------------------------

  // const toggleFilter = (key) => {
  //   setActiveFilters((prev) =>
  //     prev.includes(key)
  //       ? prev.filter((filter) => filter !== key)
  //       : [...prev, key]
  //   );
  // };

  // --------------------------------------------------------------------------
  // MATCH FILTERS
  // --------------------------------------------------------------------------

  const matchesFilters = useCallback(
    (item) => {
      // SEARCH
      if (query.trim()) {
        const q = query.trim().toLowerCase();

        const name =
          String(item.name ?? "").toLowerCase();

        const description =
          String(item.description ?? "").toLowerCase();

        const hit =
          name.includes(q) ||
          description.includes(q);

        if (!hit) {
          return false;
        }
      }

      // FILTERS
      // if (activeFilters.length > 0) {
      //   const tags = Array.isArray(item.tags)
      //     ? item.tags
      //     : [];

      //   const hasAll = activeFilters.every(
      //     (filter) => {
      //       if (filter === "popular") {
      //         return (
      //           item.featured === true ||
      //           tags.includes("popular")
      //         );
      //       }

      //       return tags.includes(filter);
      //     }
      //   );

      //   if (!hasAll) {
      //     return false;
      //   }
      // }

      return true;
    },
    [query, 
      // activeFilters
    ]
  );

  // --------------------------------------------------------------------------
  // ITEMS BY CATEGORY
  // --------------------------------------------------------------------------

  const itemsByCategory = useCallback(
    (category) => {
      return items.filter((item) => {
        let categoryMatch = false;

        // API category_id
        if (
          item.category_id !== null &&
          item.category_id !== undefined
        ) {
          categoryMatch =
            Number(item.category_id) ===
            Number(category.id);
        }

        // DEFAULT category key
        if (
          !categoryMatch &&
          item.category
        ) {
          categoryMatch =
            item.category === category.key;
        }

        return (
          categoryMatch &&
          matchesFilters(item)
        );
      });
    },
    [items, matchesFilters]
  );

  // --------------------------------------------------------------------------
  // CART
  // --------------------------------------------------------------------------

  const cartQtyFor = (id) =>
    cart
      .filter(
        (line) =>
          line.productId === id
      )
      .reduce(
        (sum, line) =>
          sum + Number(line.qty || 0),
        0
      );

  const addLine = (
    item,
    qty,
    notes
  ) => {
    setOrderError(null);

    setCart((prev) => {
      const existing = prev.find(
        (line) =>
          line.productId === item.id &&
          line.notes === notes
      );

      if (existing) {
        return prev.map((line) =>
          line.id === existing.id
            ? {
                ...line,
                qty:
                  line.qty + qty,
              }
            : line
        );
      }

      return [
        ...prev,
        {
          id: `${item.id}-${Date.now()}-${Math.random()}`,

          productId: item.id,

          fallbackName: item.name,

          price:
            Number(item.price ?? 0),

          image:
            item.image_url ||
            item.image ||
            null,

          qty,

          notes,
        },
      ];
    });
  };

  const quickAdd = (item) => {
    addLine(item, 1, "");
  };

  const openProduct = (item) => {
    setSelectedProduct(item);
  };

  const confirmFromModal = (
    item,
    qty,
    notes
  ) => {
    addLine(
      item,
      qty,
      notes
    );

    setSelectedProduct(null);
    setCartOpen(true);
  };

  const incLine = (id) =>
    setCart((prev) =>
      prev.map((line) =>
        line.id === id
          ? {
              ...line,
              qty:
                line.qty + 1,
            }
          : line
      )
    );

  const decLine = (id) =>
    setCart((prev) =>
      prev
        .map((line) =>
          line.id === id
            ? {
                ...line,
                qty:
                  line.qty - 1,
              }
            : line
        )
        .filter(
          (line) =>
            line.qty > 0
        )
    );

  const notesLine = (
    id,
    notes
  ) =>
    setCart((prev) =>
      prev.map((line) =>
        line.id === id
          ? {
              ...line,
              notes,
            }
          : line
      )
    );

  const removeLine = (id) =>
    setCart((prev) =>
      prev.filter(
        (line) =>
          line.id !== id
      )
    );

  // --------------------------------------------------------------------------
  // TOTALS
  // --------------------------------------------------------------------------

  const cartCount =
    cart.reduce(
      (sum, line) =>
        sum +
        Number(line.qty || 0),
      0
    );

  const subtotal =
    cart.reduce(
      (sum, line) =>
        sum +
        Number(line.qty || 0) *
          Number(line.price || 0),
      0
    );

  const tax =
    subtotal * 0.09;

  const total =
    subtotal + tax;

  // --------------------------------------------------------------------------
  // CHEF PICKS
  // --------------------------------------------------------------------------

  const chefPicks =
    useMemo(
      () =>
        items.slice(0, 6),
      [items]
    );

  const localizedCart = useMemo(
    () => localizeCartLines(cart, items, t.unavailableMeal),
    [cart, items, t.unavailableMeal]
  );

  // --------------------------------------------------------------------------
  // FILTERED CATEGORIES
  // --------------------------------------------------------------------------

  const isFiltering =
    query.trim().length > 0 
    // ||
    // activeFilters.length > 0;

  const visibleCategories =
    isFiltering
      ? categories.filter(
          (category) =>
            itemsByCategory(
              category
            ).length > 0
        )
      : categories;

  const totalVisible =
    visibleCategories.reduce(
      (sum, category) =>
        sum +
        itemsByCategory(
          category
        ).length,
      0
    );

  // --------------------------------------------------------------------------
  // PLACE ORDER
  // --------------------------------------------------------------------------

  const placeOrder =
    async () => {
      if (!canSubmitMenuOrder(tableNumber)) {
        setOrderError(t?.tableRequired || "Ordering requires a table-specific QR code.");
        return;
      }

      setSubmitting(true);
      setOrderError(null);

      const tableToken = tableNumber || "";

      const payload = {
        customer_name: "",
        phone: "",
        address: displayTableNumber ? `Table ${displayTableNumber}` : "Table",
        table_token: tableToken,
        items: cart.map((line) => ({
          meal_id: Number(line.productId),
          quantity: Number(line.qty),
          notes: line.notes || "",
        })),
      };

      try {
        const order =
          await api.placeOrder(
            mslug,
            payload
          );

        console.log(order);

        setSubmitting(false);
        setCartOpen(false);
        setConfirmedOrder(order);
      } catch {
        setSubmitting(false);

        setOrderError(
          t?.orderError ||
            "Couldn't reach the kitchen. Check your connection and try again."
        );
      }
    };

  // --------------------------------------------------------------------------
  // RESET ORDER
  // --------------------------------------------------------------------------

  const resetAfterOrder =
    () => {
      setConfirmedOrder(null);
      setCart([]);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  // --------------------------------------------------------------------------
  // RTL
  // --------------------------------------------------------------------------

  // useEffect(() => {
  //   applyMenuLanguageToDocument(lang, document.documentElement);
  // }, [lang]);

  // --------------------------------------------------------------------------
  // ACTIVE CATEGORY
  // --------------------------------------------------------------------------

  const effectiveActiveCategory =
    categories.some(
      (category) =>
        category.key ===
        activeCategory
    )
      ? activeCategory
      : categories[0]?.key ||
        "starters";

  // --------------------------------------------------------------------------
  // TABLE DISPLAY NUMBER
  //
  // IMPORTANT:
  // Prevent:
  // restau.tables.filter(...) when tables is undefined
  // and prevent .number on undefined when table isn't found.
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------

  if (!loading && !restaurant) {
    return (
      <div className="mp-root" style={menuStyle}>
        <div className="mp-frame">
          <div className="no-results" style={{ marginTop: 40 }}>
            <Search size={26} strokeWidth={1.4} />
            <p>
              {error
                ? `${t.menuLoadError} ${error}`
                : t.menuLoadError}
            </p>
            <span>
              {t.menuLoadHint}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mp-root" style={menuStyle}>

      <div className="mp-frame">

        {/* LANGUAGE */}

        <div className="language-switcher">

          <span className="lang-label">
            <Globe size={14} />

            {t?.language ||
              "Language"}
          </span>

          {Object.entries(
            LANGUAGES
          ).map(
            ([key, value]) => (
              <button
                key={key}
                className={
                  lang === key
                    ? "active-lang"
                    : ""
                }
                onClick={() =>
                  changeLanguage(key)
                }
              >
                {value}
              </button>
            )
          )}

        </div>

        {loading ? (
          <div
            className="skeleton-wrap"
            style={{
              padding: 0,
            }}
          >

            <div className="skel skel-cover" />

            <div
              style={{
                padding:
                  "22px 22px 0",
              }}
            >

              <div
                className="skel"
                style={{
                  width: 74,
                  height: 74,
                  borderRadius:
                    "50%",
                  marginBottom: 14,
                }}
              />

              <div
                className="skel"
                style={{
                  width: "60%",
                  height: 26,
                  marginBottom: 10,
                }}
              />

              <div
                className="skel"
                style={{
                  width: "40%",
                  height: 14,
                  marginBottom: 20,
                }}
              /> 

            </div>

            <div className="skel-card" />
            <div className="skel-card" />
            <div className="skel-card" />
 
 
            <div className="loading-container">
              <div className="loading-spinner" />
            </div>
           </div>
        ) : (

          <>

            {/* HERO */}

            <div className="hero">

              <FoodImage
                src={
                  resolvedHeaderImage || restaurant.cover
                }
                alt={
                  restaurantName
                }
                className="hero-cover"
              />

              <div className="hero-gradient" />

              <div className="hero-info">

                <div className="hero-top-row">

                  <div className="logo-badge">

                    <img
                      src={
                        resolvedLogo || restaurant.logo
                      }
                      alt={
                        restaurantName
                      }
                    />

                  </div>

                  <div className="rating-badge">

                    <Star
                      size={12}
                      strokeWidth={2.2}
                      fill="currentColor"
                    />

                    <span>
                      {
                        restaurant.rating
                      }
                    </span>

                    <span className="rating-count">
                      (
                      {
                        restaurant.reviewCount
                      }
                      )
                    </span>

                  </div>

                </div>

                <h1 className="rest-name">
                  {
                    restaurantName
                  }
                </h1>

                <p className="rest-tagline">
                  {
                    restaurantDescription
                  }
                </p>

              </div>

            </div>

            {/* CHEF PICKS */}

            <ChefPicksCarousel
              items={
                chefPicks
              }
              onOpen={
                openProduct
              }
              t={t}
            />

            {/* TABS SENTINEL */}

            <div
              ref={
                tabsSentinelRef
              }
            />

            {/* CATEGORY TABS */}

            <CategoryTabs
              categories={
                categories
              }
              active={
                effectiveActiveCategory
              }
              onSelect={
                scrollToCategory
              }
              stuck={
                stuckTabs
              }
              searchOpen={
                searchOpen
              }
              setSearchOpen={
                setSearchOpen
              }
              query={query}
              setQuery={
                setQuery
              }
              // activeFilters={
              //   activeFilters
              // }
              // toggleFilter={
              //   toggleFilter
              // }
              t={t}
              restau={
                restau
              }
            />

            {/* MENU */}

            {isFiltering &&
            totalVisible === 0 ? (

              <div className="no-results">

                <Search
                  size={26}
                  strokeWidth={1.4}
                />

                <p>
                  {
                    t?.noResultsTitle ||
                    "No dishes match"
                  }{" "}
                  "
                  {
                    query ||
                    t?.noResultsFallback ||
                    "your filters"
                  }
                  "
                </p>

                <span>
                  {
                    t?.noResultsSubtitle ||
                    "Try a different search term or clear the filters."
                  }
                </span>

              </div>

            ) : (

              visibleCategories.map(
                (category) => {

                  const categoryItems =
                    itemsByCategory(
                      category
                    );

                  if (
                    isFiltering &&
                    categoryItems.length ===
                      0
                  ) {
                    return null;
                  }

                  return (

                    <div
                      key={
                        category.id ??
                        category.key
                      }
                      className="section"
                      data-category={
                        category.key
                      }
                      ref={(
                        element
                      ) => {
                        sectionRefs.current[
                          category.key
                        ] =
                          element;
                      }}
                    >

                      <div className="section-eyebrow">

                        <h2>
                          {
                           
                            category.name
                            ||
                            category.label
                          }
                        </h2>

                      </div>

                      {category.description && (
                        <p className="section-description">
                          {category.description}
                        </p>
                      )}

                      {categoryItems.map(
                        (
                          item,
                          index
                        ) => (

                          <ProductCard
                            key={`${item.id}-${index}`}
                            item={item}
                            index={index}
                            qtyInCart={cartQtyFor(
                              item.id
                            )}
                            onOpen={
                              openProduct
                            }
                            onQuickAdd={
                              quickAdd
                            }
                            t={t}
                          />

                        )
                      )}

                    </div>

                  );
                }
              )

            )}

            {/* FOOTER */}

            <div className="mp-footer">

              <p>

                <strong>
                  {
                    restaurantName
                  }
                </strong>{" "}
                ·{" "}
                {
                  restaurant.phone
                }

              </p>

            </div>

            <div className="bottom-spacer" />

            {/* CART BAR */}

            {cartCount > 0 && (

              <div className="cart-bar-wrap">

                <div
                  className="cart-bar"
                  onClick={() =>
                    setCartOpen(
                      true
                    )
                  }
                  role="button"
                  tabIndex={0}
                  aria-live="polite"
                  onKeyDown={(
                    event
                  ) => {

                    if (
                      event.key ===
                        "Enter" ||
                      event.key ===
                        " "
                    ) {
                      setCartOpen(
                        true
                      );
                    }

                  }}
                >

                  <div className="cart-bar-left">

                    <span className="cart-bar-count">
                      {
                        cartCount
                      }
                    </span>

                    <span className="cart-bar-label">
                      {
                        t?.viewOrder ||
                        "View Order"
                      }
                    </span>

                  </div>

                  <div className="cart-bar-right">

                    {
                      formatPrice(
                        total
                      )
                    }

                    <ChevronRight
                      size={16}
                    />

                  </div>

                </div>

              </div>

            )}

          </>

        )}

      </div>

      {/* PRODUCT MODAL */}

      <ProductModal
        key={
          selectedProduct?.id
        }
        item={
          selectedProduct
        }
        onClose={() =>
          setSelectedProduct(
            null
          )
        }
        onConfirm={
          confirmFromModal
        }
        t={t}
      />

      {/* CART */}

      <CartDrawer
        open={cartOpen}
        cart={localizedCart}
        orderAllowed={canSubmitMenuOrder(tableNumber)}
        tableNumber={
          displayTableNumber
        }
        subtotal={
          subtotal
        }
        tax={tax}
        total={total}
        onClose={() =>
          setCartOpen(false)
        }
        onInc={incLine}
        onDec={decLine}
        onNotes={
          notesLine
        }
        onRemove={
          removeLine
        }
        onPlaceOrder={
          placeOrder
        }
        submitting={
          submitting
        }
        error={
          orderError
        }
        t={t}
      />

      {/* CONFIRMATION */}

      <ConfirmationScreen
        key={
          confirmedOrder?.id
        }
        order={
          confirmedOrder
        }
        tableNumber={
          displayTableNumber
        }
        onBack={
          resetAfterOrder
        }
        t={t}
      />

    </div>
  );
}