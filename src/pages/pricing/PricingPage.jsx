import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import appTranslations from '../../i18n/translations'

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
    price: null,
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
    price: null,
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
    subscriptionCurrent: 'Votre abonnement actuel',
        subscriptionEndsAt: 'Se termine le',
        subscriptionCancelScheduled: 'Annulation prévue à la fin de la période.',
        subscriptionCancel: 'Annuler l’abonnement',
        subscriptionCanceling: 'Annulation...',
        subscriptionCancelConfirm: 'Voulez-vous vraiment annuler cet abonnement ?',
        subscriptionCancelSuccess: 'L’annulation a été programmée.',
        subscriptionCancelError: 'Impossible d’annuler l’abonnement.',
        planStatusUnavailable: 'Impossible de charger votre abonnement.',
        loading: 'Chargement...',
        dashboard: 'Tableau de bord',
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
    comingSoon: 'Bientôt disponible',
  },
  en: {
    subscriptionCurrent: 'Your current subscription',
        subscriptionEndsAt: 'Ends on',
        subscriptionCancelScheduled: 'Cancellation is scheduled at the end of the period.',
        subscriptionCancel: 'Cancel subscription',
        subscriptionCanceling: 'Cancelling...',
        subscriptionCancelConfirm: 'Are you sure you want to cancel this subscription?',
        subscriptionCancelSuccess: 'Cancellation has been scheduled.',
        subscriptionCancelError: 'Unable to cancel the subscription.',
        planStatusUnavailable: 'Unable to load your subscription.',
        loading: 'Loading...',
        dashboard: 'Dashboard',
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
    comingSoon: 'Coming soon',
  },
  ar: {
    subscriptionCurrent: 'الاشتراك الحالي',
        subscriptionEndsAt: 'ينتهي في',
        subscriptionCancelScheduled: 'تمت جدولة الإلغاء في نهاية الفترة.',
        subscriptionCancel: 'إلغاء الاشتراك',
        subscriptionCanceling: 'جارٍ الإلغاء...',
        subscriptionCancelConfirm: 'هل أنت متأكد أنك تريد إلغاء هذا الاشتراك؟',
        subscriptionCancelSuccess: 'تمت جدولة إلغاء الاشتراك.',
        subscriptionCancelError: 'تعذر إلغاء الاشتراك.',
        planStatusUnavailable: 'تعذر تحميل معلومات الاشتراك.',
        loading: 'جارٍ التحميل...',
        dashboard: 'لوحة التحكم',
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
    comingSoon: 'قريباً',
  },
}

export default function PricingPage() {
  const language = useSelector((state) => state.ui.language)
  const user = useSelector((state) => state.auth.user)
  const restaurantId = useSelector((state) => state.restaurant.profile?.id) ?? user?.restaurant_id
  const [yearly, setYearly] = useState(false)

  const t = { ...translations[language], ...(appTranslations[language] || appTranslations.fr) }
  const isArabic = language === 'ar'

  const displayedPlans = plans

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
  }, [language, isArabic])

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

        <Link to={user ? '/home' : '/login'} className="text-sm font-semibold">
          {user ? (t.dashboard || 'Dashboard') : t.login}
        </Link>
      </header>

      <section className="mx-auto max-w-6xl py-16 text-center">
        <h1 className="text-3xl font-extrabold sm:text-5xl">
          {t.title}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-[#69777B]">
          {t.subtitle}
        </p>
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
                {plan.price === 0 ? t.free : t.comingSoon}
              </p>

              <ul className="my-8 flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature.id} className="flex items-center justify-between gap-3 border-b border-[#F3EEE6] pb-3 last:border-0">
                    <span className="text-sm">{t[feature.id]}</span>
                    {renderFeatureValue(feature.value)}
                  </li>
                ))}
              </ul>

              {plan.id === 'starter' ? (
                <Link
                  to={`/register?plan=${plan.id}&billing_interval=${yearly ? 'yearly' : 'monthly'}`}
                  className="rounded-xl border border-[#EEE6D9] px-4 py-3 text-center font-semibold hover:bg-[#FFF9ED]"
                >
                  {t.choose}
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  title={t.comingSoon}
                  className="cursor-not-allowed rounded-xl bg-[#F3EEE6] px-4 py-3 text-center font-semibold text-[#69777B]"
                >
                  {t.comingSoon}
                </button>
              )}
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
