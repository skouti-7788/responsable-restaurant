import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const plans = [
  { id: 'starter', popular: false },
  { id: 'pro', popular: true },
  { id: 'business', popular: false },
]

const features = [
  { id: 'menuQr', values: ['included', 'included', 'included'] },
  { id: 'meals', values: ['30', 'unlimited', 'unlimited'] },
  { id: 'categories', values: ['5', 'unlimited', 'unlimited'] },
  { id: 'orders', values: ['locked', 'included', 'included'] },
  { id: 'tables', values: ['locked', 'included', 'included'] },
  { id: 'staff', values: ['locked', 'locked', 'included'] },
  { id: 'appearance', values: ['basic', 'advanced', 'advanced'] },
]

const translations = {
  fr: {
    title: 'Choisissez la formule adaptée à votre restaurant',
    subtitle: 'Comparez les fonctionnalités et choisissez la formule qui correspond à vos besoins.',
    feature: 'Fonctionnalité',
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
    included: '✓',
    locked: 'Verrouillé',
    basic: 'Basique',
    advanced: 'Avancée',
    choose: 'Choisir cette formule',
    popular: 'La plus populaire',
    login: 'Se connecter',
    home: 'Accueil',
  },
  en: {
    title: 'Choose the right plan for your restaurant',
    subtitle: 'Compare features and choose the plan that fits your needs.',
    feature: 'Feature',
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
    included: '✓',
    locked: 'Locked',
    basic: 'Basic',
    advanced: 'Advanced',
    choose: 'Choose this plan',
    popular: 'Most popular',
    login: 'Log in',
    home: 'Home',
  },
  ar: {
    title: 'اختر الباقة المناسبة لمطعمك',
    subtitle: 'قارن بين المميزات واختر الباقة التي تناسب احتياجاتك.',
    feature: 'الميزة',
    starter: 'Starter',
    pro: 'Pro',
    business: 'Business',
    menuQr: 'القائمة + رمز QR',
    meals: 'الوجبات',
    categories: 'الأصناف',
    orders: 'الطلبات',
    tables: 'الطاولات',
    staff: 'الموظفون',
    appearance: 'التخصيص والمظهر',
    included: '✓',
    locked: 'مقفل',
    basic: 'أساسي',
    advanced: 'متقدم',
    choose: 'اختر هذه الباقة',
    popular: 'الأكثر شعبية',
    login: 'تسجيل الدخول',
    home: 'الرئيسية',
  },
}

export default function PricingPage() {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('menu_language')
    return ['fr', 'en', 'ar'].includes(saved) ? saved : 'fr'
  })

  const t = translations[language]
  const isArabic = language === 'ar'

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
    localStorage.setItem('menu_language', language)
  }, [language, isArabic])

  const renderValue = (value) => {
    if (value === 'included') {
      return <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ECFDF3] font-bold text-[#15803D]">✓</span>
    }

    if (value === 'locked') {
      return <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#9CA3AF]"><span aria-hidden="true">🔒</span>{t.locked}</span>
    }

    return <span className="font-semibold text-[#12343C]">{t[value] ?? value}</span>
  }

  return (
    <main dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-[#FFF9ED] px-4 py-8 text-[#12343C] sm:px-8 sm:py-12">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link to="/home" className="text-xl font-bold">Menu Online</Link>

        <div className="flex items-center gap-3">
          <select
            aria-label="Language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="rounded-lg border border-[#EEE6D9] bg-white p-2 text-sm"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
          <Link to="/login" className="text-sm font-semibold hover:text-[#D97706]">{t.login}</Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl py-12 sm:py-16">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">{t.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-[#69777B]">{t.subtitle}</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#EEE6D9] bg-white shadow-sm">
          <table className="w-full min-w-[680px] border-collapse text-center">
            <thead>
              <tr className="border-b border-[#EEE6D9]">
                <th scope="col" className="w-[28%] px-5 py-6 text-start text-sm font-bold text-[#69777B]">{t.feature}</th>
                {plans.map((plan) => (
                  <th key={plan.id} scope="col" className={`px-5 py-6 ${plan.popular ? 'bg-[#FFF7E8]' : ''}`}>
                    {plan.popular && <span className="mb-2 inline-block rounded-full bg-[#FFF0D9] px-3 py-1 text-xs font-bold text-[#92400E]">{t.popular}</span>}
                    <div className="text-xl font-extrabold">{t[plan.id]}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {features.map((feature, index) => (
                <tr key={feature.id} className={index % 2 === 0 ? 'bg-[#FFFCF7]' : 'bg-white'}>
                  <th scope="row" className="border-t border-[#F1ECE3] px-5 py-5 text-start text-sm font-semibold">{t[feature.id]}</th>
                  {feature.values.map((value, planIndex) => (
                    <td key={plans[planIndex].id} className={`border-t border-[#F1ECE3] px-5 py-5 ${plans[planIndex].popular ? 'bg-[#FFF7E8]/70' : ''}`}>
                      {renderValue(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="border-t border-[#EEE6D9]">
                <td className="px-5 py-6" />
                {plans.map((plan) => (
                  <td key={plan.id} className={`px-5 py-6 ${plan.popular ? 'bg-[#FFF7E8]/70' : ''}`}>
                    <Link
                      to={`/register?plan=${plan.id}`}
                      className={`inline-flex w-full max-w-[190px] items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition ${plan.popular ? 'bg-[#D97706] text-white hover:bg-[#B45309]' : 'border border-[#E7DCCB] text-[#12343C] hover:bg-[#FFF9ED]'}`}
                    >
                      {t.choose}
                    </Link>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="mt-4 text-center text-xs text-[#8A9698]">{t.home}: <Link to="/home" className="font-semibold underline underline-offset-2">Menu Online</Link></p>
      </section>
    </main>
  )
}
