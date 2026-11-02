import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import translations from '../../i18n/translations'

const plans = [
  {
    id: 'starter',
    price: 0,
    popular: false,
    available: true,
    featureKeys: [
      'pricingStarterFeature1',
      'pricingStarterFeature2',
      'pricingStarterFeature3',
      'pricingStarterFeature4',
    ],
  },
  {
    id: 'pro',
    price: 99,
    popular: true,
    available: false,
    featureKeys: [
      'pricingProFeature1',
      'pricingProFeature2',
      'pricingProFeature3',
      'pricingProFeature4',
    ],
  },
  {
    id: 'business',
    price: 199,
    popular: false,
    available: false,
    featureKeys: [
      'pricingBusinessFeature1',
      'pricingBusinessFeature2',
      'pricingBusinessFeature3',
    ],
  },
]

export default function PricingPage() {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('restaurant_language') || localStorage.getItem('menu_language')
    return ['fr', 'en', 'ar'].includes(saved) ? saved : 'fr'
  })
  const [yearly, setYearly] = useState(false)

  const t = translations[language] || translations.fr
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
          {t.pricingTitle}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-[#69777B]">
          {t.pricingSubtitle}
        </p>

        <div className="mt-8 inline-flex rounded-xl border border-[#EEE6D9] bg-white p-1">
          <button
            type="button"
            onClick={() => setYearly(false)}
            className={`rounded-lg px-5 py-2 ${
              !yearly ? 'bg-[#D97706] text-white' : ''
            }`}
          >
            {t.pricingMonthly}
          </button>

          <button
            type="button"
            onClick={() => setYearly(true)}
            className={`rounded-lg px-5 py-2 ${
              yearly ? 'bg-[#D97706] text-white' : ''
            }`}
          >
            {t.pricingYearly}
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
                  {t.pricingPopular}
                </span>
              )}

              <h2 className="text-2xl font-bold">
                {t[`pricing${plan.id[0].toUpperCase()}${plan.id.slice(1)}`]}
              </h2>

              <p className="mt-4 text-3xl font-extrabold">
                {plan.price === 0 ? t.pricingFree : (
                  <>
                    {formatPrice(plan.price)}
                    <span className="ms-1 text-sm font-medium">
                      {t.pricingCurrency}
                    </span>
                  </>
                )}
              </p>

              {plan.price > 0 && (
                <p className="mt-1 text-sm text-[#69777B]">
                  {yearly ? t.pricingPerYear : t.pricingPerMonth}
                </p>
              )}

              <ul className="my-8 flex-1 space-y-3">
                {plan.featureKeys.map((featureKey) => (
                  <li key={featureKey} className="flex gap-2">
                    <span className="text-[#D97706]">✓</span>
                    <span>{t[featureKey]}</span>
                  </li>
                ))}
              </ul>

              {plan.available ? (
                <Link
                  to="/register"
                  className="rounded-xl border border-[#EEE6D9] px-4 py-3 text-center font-semibold hover:bg-[#FFF9ED]"
                >
                  {t.pricingChoosePlan}
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-xl border border-[#EEE6D9] bg-slate-100 px-4 py-3 text-center font-semibold text-slate-500"
                >
                  {t.pricingComingSoon}
                </button>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
