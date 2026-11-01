import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'

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
    save: '2 mois offerts',
    faqTitle: 'Questions fréquentes',
    faq1q: 'Le menu avec QR Code est-il inclus dans toutes les formules?',
    faq1a: 'Oui. Le menu et le QR Code sont inclus dans Starter, Pro et Business.',
    faq2q: 'Quelle est la différence entre Starter et Pro?',
    faq2a: 'Starter est limité à 30 plats et 5 catégories. Pro propose des plats et catégories illimités, ainsi que les commandes et les tables.',
    faq3q: 'Quelle est la différence entre Pro et Business?',
    faq3a: 'Business inclut toutes les fonctionnalités de Pro, avec en plus la gestion du personnel.',
    faq4q: 'Que comprend la personnalisation avancée?',
    faq4a: 'La personnalisation avancée est disponible avec les formules Pro et Business. Starter inclut la personnalisation basique.',
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
    free: 'Gratuit',
    login: 'Se connecter',
  },
  en: {
    title: 'Choose your plan',
    subtitle: 'Grow your restaurant with Menu Online.',
    monthly: 'Monthly',
    yearly: 'Yearly',
    save: '2 months free',
    faqTitle: 'Frequently asked questions',
    faq1q: 'Is the menu with QR Code included in every plan?',
    faq1a: 'Yes. The menu and QR Code are included in Starter, Pro and Business.',
    faq2q: 'What is the difference between Starter and Pro?',
    faq2a: 'Starter is limited to 30 meals and 5 categories. Pro offers unlimited meals and categories, plus orders and tables.',
    faq3q: 'What is the difference between Pro and Business?',
    faq3a: 'Business includes all Pro features, plus staff management.',
    faq4q: 'What does advanced appearance include?',
    faq4a: 'Advanced appearance is available with Pro and Business. Starter includes basic appearance.',
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
    free: 'Free',
    login: 'Log in',
  },
  ar: {
    title: 'اختر الباقة المناسبة لك',
    subtitle: 'طوّر مطعمك مع Menu Online.',
    monthly: 'شهري',
    yearly: 'سنوي',
    save: 'شهران مجاناً',
    faqTitle: 'الأسئلة الشائعة',
    faq1q: 'واش القائمة مع رمز QR متوفرة فكل الباقات؟',
    faq1a: 'نعم، القائمة ورمز QR متوفران في Starter وPro وBusiness.',
    faq2q: 'شنو الفرق بين Starter وPro؟',
    faq2a: 'Starter محدودة في 30 وجبة و5 أصناف. أما Pro فتقدم وجبات وأصنافاً غير محدودة، مع الطلبات والطاولات.',
    faq3q: 'شنو الفرق بين Pro وBusiness؟',
    faq3a: 'Business فيها جميع مميزات Pro، وزيادة عليها إدارة الموظفين.',
    faq4q: 'شنو كتعني التخصيصات المتقدمة؟',
    faq4a: 'التخصيص المتقدم متوفر في Pro وBusiness، أما Starter فتتضمن التخصيص الأساسي.',
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
    free: 'مجاناً',
    login: 'تسجيل الدخول',
  },
}

export default function PricingPage() {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('menu_language')
    return ['fr', 'en', 'ar'].includes(saved) ? saved : 'fr'
  })
  const [yearly, setYearly] = useState(false)
  const [apiPlans, setApiPlans] = useState([])

  useEffect(() => {
    let active = true

    axiosClient.get('/plans')
      .then(({ data }) => {
        if (active && Array.isArray(data?.plans)) {
          setApiPlans(data.plans)
        }
      })
      .catch((error) => {
        console.error('Unable to load pricing plans:', error)
      })

    return () => {
      active = false
    }
  }, [])

  const t = translations[language]
  const isArabic = language === 'ar'

  const displayedPlans = apiPlans.length
    ? apiPlans.map((plan) => ({
        id: plan.id,
        price: Number(plan.price_monthly ?? 0),
        yearlyPrice: Number(plan.price_yearly ?? (Number(plan.price_monthly ?? 0) * 10)),
        popular: plan.id === 'pro',
        features: [
          { id: 'menuQr', value: plan.features?.menu_qr ? 'included' : 'locked' },
          { id: 'meals', value: plan.limits?.meals == null ? 'unlimited' : String(plan.limits.meals) },
          { id: 'categories', value: plan.limits?.categories == null ? 'unlimited' : String(plan.limits.categories) },
          { id: 'orders', value: plan.features?.orders ? 'included' : 'locked' },
          { id: 'tables', value: plan.features?.tables ? 'included' : 'locked' },
          { id: 'staff', value: plan.features?.staff ? 'included' : 'locked' },
          { id: 'appearance', value: plan.features?.appearance ?? 'basic' },
        ],
      }))
    : plans

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
    localStorage.setItem('menu_language', language)
  }, [language, isArabic])

  const formatPrice = (price) => {
    const selectedPlan = displayedPlans.find((plan) => plan.price === price)
    const total = yearly ? (selectedPlan?.yearlyPrice ?? price * 10) : price
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
        {yearly && (
          <p className="mt-3 text-sm font-semibold text-[#15803D]">{t.save}</p>
        )}

        <div className="mt-12 grid gap-6 text-start md:grid-cols-3">
          {displayedPlans.map((plan) => (
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
                {plan.price === 0 ? t.free : (
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
                to={`/register?plan=${plan.id}&billing_interval=${yearly ? 'yearly' : 'monthly'}`}
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

        <section className="mx-auto mt-20 max-w-3xl text-start">
          <h2 className="mb-6 text-center text-2xl font-extrabold">{t.faqTitle}</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((number) => (
              <details key={number} className="group rounded-xl border border-[#EEE6D9] bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {t[`faq${number}q`]}
                    <span className="text-[#D97706] transition group-open:rotate-45">＋</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-[#69777B]">{t[`faq${number}a`]}</p>
              </details>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
