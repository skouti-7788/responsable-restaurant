import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const plans = [
  {
    id: 'starter',
    price: 0,
    popular: false,
    features: [
      { id: 'menuQr', value: 'included' },
      { id: 'meals', value: '30' },
      { id: 'categories', value: '5' },
      { id: 'orders', value: 'locked' },
      { id: 'tables', value: 'locked' },
      { id: 'staff', value: 'locked' },
      { id: 'appearance', value: 'basic' },
    ],
  },
  {
    id: 'pro',
    price: 99,
    popular: true,
    features: [
      { id: 'menuQr', value: 'included' },
      { id: 'meals', value: 'unlimited' },
      { id: 'categories', value: 'unlimited' },
      { id: 'orders', value: 'included' },
      { id: 'tables', value: 'included' },
      { id: 'staff', value: 'locked' },
      { id: 'appearance', value: 'advanced' },
    ],
  },
  {
    id: 'business',
    price: 199,
    popular: false,
    features: [
      { id: 'menuQr', value: 'included' },
      { id: 'meals', value: 'unlimited' },
      { id: 'categories', value: 'unlimited' },
      { id: 'orders', value: 'included' },
      { id: 'tables', value: 'included' },
      { id: 'staff', value: 'included' },
      { id: 'appearance', value: 'advanced' },
    ],
  },
]

const translations = {
  fr: {
    title: 'Choisissez votre formule',
    subtitle: 'Développez votre restaurant avec Menu Online.',
    monthly: 'Mensuel',
    yearly: 'Annuel',
    month: '/ mois',
    year: '/ an',
    starter: 'Starter',
    pro: 'Pro',
    business: 'Business',
    menuQr: 'Menu + QR Code',
    meals: 'Plats',
    categories: 'Catégories',
    orders: 'Commandes',
    tables: 'Tables',
    staff: 'Personnel',
    appearance: 'Personnalisation',
    included: 'Inclus',
    locked: 'Verrouillé',
    basic: 'Basique',
    advanced: 'Avancée',
    unlimited: 'Illimité',
    choose: 'Choisir cette formule',
    popular: 'Le plus populaire',
    currency: 'MAD',
    login: 'Se connecter',
  },
  en: {
    title: 'Choose your plan',
    subtitle: 'Grow your restaurant with Menu Online.',
    monthly: 'Monthly',
    yearly: 'Yearly',
    month: '/ month',
    year: '/ year',
    starter: 'Starter',
    pro: 'Pro',
    business: 'Business',
    menuQr: 'Menu + QR Code',
    meals: 'Meals',
    categories: 'Categories',
    orders: 'Orders',
    tables: 'Tables',
    staff: 'Staff',
    appearance: 'Appearance',
    included: 'Included',
    locked: 'Locked',
    basic: 'Basic',
    advanced: 'Advanced',
    unlimited: 'Unlimited',
    choose: 'Choose this plan',
    popular: 'Most popular',
    currency: 'MAD',
    login: 'Log in',
  },
  ar: {
    title: 'اختر الباقة المناسبة لك',
    subtitle: 'طوّر مطعمك مع Menu Online.',
    monthly: 'شهري',
    yearly: 'سنوي',
    month: '/ الشهر',
    year: '/ السنة',
    starter: 'Starter',
    pro: 'Pro',
    business: 'Business',
    menuQr: 'القائمة + رمز QR',
    meals: 'الوجبات',
    categories: 'الأصناف',
    orders: 'الطلبات',
    tables: 'الطاولات',
    staff: 'الموظفون',
    appearance: 'المظهر والتخصيص',
    included: 'متاح',
    locked: 'مقفل',
    basic: 'أساسي',
    advanced: 'متقدم',
    unlimited: 'غير محدود',
    choose: 'اختر هذه الباقة',
    popular: 'الأكثر طلباً',
    currency: 'درهم',
    login: 'تسجيل الدخول',
  },
}

export default function PricingPage() {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('menu_language')
    return ['fr', 'en', 'ar'].includes(saved) ? saved : 'fr'
  })
  const [yearly, setYearly] = useState(false)

  const t = translations[language]
  const isArabic = language === 'ar'

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
    localStorage.setItem('menu_language', language)
  }, [language, isArabic])

  const formatPrice = (price) => {
    const total = yearly ? price * 10 : price
    return new Intl.NumberFormat(
      language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-MA' : 'en',
      { maximumFractionDigits: 0 }
    ).format(total)
  }

  const renderFeatureValue = (value) => {
    if (value === 'included') {
      return <span className="font-bold text-[#15803D]">✓</span>
    }

    if (value === 'locked') {
      return <span className="text-sm text-[#9CA3AF]">🔒 {t.locked}</span>
    }

    return <span className="text-sm font-medium">{t[value] ?? value}</span>
  }

  return (
    <main
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#FFF9ED] px-4 py-10 text-[#12343C] sm:px-8"
    >
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link to="/home" className="text-xl font-bold">
          Menu Online
        </Link>

        <div className="flex items-center gap-3">
          <select
            aria-label="Language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="rounded-lg border border-[#EEE6D9] bg-white p-2"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>

          <Link to="/login" className="text-sm font-semibold">
            {t.login}
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl py-16 text-center">
        <h1 className="text-3xl font-extrabold sm:text-5xl">
          {t.title}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-[#69777B]">
          {t.subtitle}
        </p>

        <div className="mt-8 inline-flex rounded-xl border border-[#EEE6D9] bg-white p-1">
          <button
            type="button"
            onClick={() => setYearly(false)}
            className={`rounded-lg px-5 py-2 ${!yearly ? 'bg-[#D97706] text-white' : ''}`}
          >
            {t.monthly}
          </button>

          <button
            type="button"
            onClick={() => setYearly(true)}
            className={`rounded-lg px-5 py-2 ${yearly ? 'bg-[#D97706] text-white' : ''}`}
          >
            {t.yearly}
          </button>
        </div>

        <div className="mt-12 grid gap-6 text-start md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm ${
                plan.popular
                  ? 'border-[#D97706] ring-2 ring-[#D97706]/20'
                  : 'border-[#EEE6D9]'
              }`}
            >
              {plan.popular && (
                <span className="mb-4 self-start rounded-full bg-[#FFF0D9] px-3 py-1 text-xs font-bold text-[#92400E]">
                  {t.popular}
                </span>
              )}

              <h2 className="text-2xl font-bold">{t[plan.id]}</h2>

              <p className="mt-4 text-3xl font-extrabold">
                {plan.price === 0 ? 'Gratuit' : (
                  <>
                    {formatPrice(plan.price)}
                    <span className="ms-1 text-sm font-medium">{t.currency}</span>
                  </>
                )}
              </p>

              {plan.price > 0 && (
                <p className="mt-1 text-sm text-[#69777B]">
                  {yearly ? t.year : t.month}
                </p>
              )}

              <ul className="my-8 flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature.id} className="flex items-center justify-between gap-3 border-b border-[#F3EEE6] pb-3 last:border-0">
                    <span className="text-sm">{t[feature.id]}</span>
                    {renderFeatureValue(feature.value)}
                  </li>
                ))}
              </ul>

              <Link
                to={`/register?plan=${plan.id}`}
                className={`rounded-xl px-4 py-3 text-center font-semibold ${
                  plan.popular
                    ? 'bg-[#D97706] text-white hover:bg-[#B45309]'
                    : 'border border-[#EEE6D9] hover:bg-[#FFF9ED]'
                }`}
              >
                {t.choose}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
