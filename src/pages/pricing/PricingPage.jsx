import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const plans = [
  {
    id: 'starter',
    price: 0,
    popular: false,
    available: true,
    features: {
      fr: ['Menu QR', 'Jusqu’à 5 catégories', 'Jusqu’à 30 plats', 'Personnalisation de base'],
      en: ['QR menu', 'Up to 5 categories', 'Up to 30 meals', 'Basic appearance customization'],
      ar: ['قائمة QR', 'حتى 5 فئات', 'حتى 30 وجبة', 'تخصيص أساسي للمظهر'],
    },
  },
  {
    id: 'pro',
    price: 99,
    popular: true,
    available: false,
    features: {
      fr: ['Tout le plan Starter', 'Catégories et plats illimités', 'Commandes et tables', 'Personnalisation avancée'],
      en: ['Everything in Starter', 'Unlimited categories and meals', 'Orders and tables', 'Advanced appearance customization'],
      ar: ['جميع مميزات Starter', 'فئات ووجبات غير محدودة', 'الطلبات والطاولات', 'تخصيص متقدم للمظهر'],
    },
  },
  {
    id: 'business',
    price: 199,
    popular: false,
    available: false,
    features: {
      fr: ['Tout le plan Pro', 'Gestion du personnel', 'Toutes les fonctionnalités avancées'],
      en: ['Everything in Pro', 'Staff management', 'All advanced features'],
      ar: ['جميع مميزات Pro', 'إدارة الموظفين', 'جميع الميزات المتقدمة'],
    },
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
    free: 'Gratuit',
    choose: 'Choisir cette formule',
    unavailable: 'Bientôt disponible',
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
    free: 'Free',
    choose: 'Choose this plan',
    unavailable: 'Coming soon',
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
    free: 'مجانية',
    choose: 'اختر هذه الباقة',
    unavailable: 'قريباً',
    popular: 'الأكثر طلباً',
    currency: 'درهم',
    login: 'تسجيل الدخول',
  },
}

export default function PricingPage() {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('restaurant_language') || localStorage.getItem('menu_language')
    return ['fr', 'en', 'ar'].includes(saved) ? saved : 'fr'
  })

  const [yearly, setYearly] = useState(false)
  const t = translations[language]
  const isArabic = language === 'ar'

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
    localStorage.setItem('restaurant_language', language)
  }, [language, isArabic])

  const formatPrice = (price) => {
    const total = yearly ? price * 10 : price

    return new Intl.NumberFormat(
      language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-MA' : 'en',
      { maximumFractionDigits: 0 }
    ).format(total)
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
            onChange={(e) => setLanguage(e.target.value)}
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
            className={`rounded-lg px-5 py-2 ${
              !yearly ? 'bg-[#D97706] text-white' : ''
            }`}
          >
            {t.monthly}
          </button>

          <button
            type="button"
            onClick={() => setYearly(true)}
            className={`rounded-lg px-5 py-2 ${
              yearly ? 'bg-[#D97706] text-white' : ''
            }`}
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

              <h2 className="text-2xl font-bold">
                {t[plan.id]}
              </h2>

              <p className="mt-4 text-3xl font-extrabold">
                {plan.price === 0 ? t.free : (
                  <>
                    {formatPrice(plan.price)}
                    <span className="ms-1 text-sm font-medium">
                      {t.currency}
                    </span>
                  </>
                )}
              </p>

              {plan.price > 0 && (
                <p className="mt-1 text-sm text-[#69777B]">
                  {yearly ? t.year : t.month}
                </p>
              )}

              <ul className="my-8 flex-1 space-y-3">
                {plan.features[language].map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="text-[#D97706]">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.available ? (
                <Link
                  to="/register"
                  className="rounded-xl border border-[#EEE6D9] px-4 py-3 text-center font-semibold hover:bg-[#FFF9ED]"
                >
                  {t.choose}
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-xl border border-[#EEE6D9] bg-slate-100 px-4 py-3 text-center font-semibold text-slate-500"
                >
                  {t.unavailable}
                </button>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
