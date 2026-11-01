import { Link } from 'react-router-dom'
import { Check, ArrowLeft, Sparkles } from 'lucide-react'

const plans = [
  {
    key: 'starter',
    name: 'Starter',
    description: 'Everything you need to publish your digital menu.',
    features: ['Digital menu', 'Up to 30 meals', 'Up to 5 categories', 'QR code', 'Basic appearance', 'Profile and dashboard'],
    unavailable: ['Orders management', 'Tables management', 'Staff management'],
    action: 'Create free account',
    featured: false,
  },
  {
    key: 'pro',
    name: 'Pro',
    description: 'For restaurants ready to manage daily operations.',
    features: ['Everything in Starter', 'Unlimited meals and categories', 'Orders management', 'Tables management', 'Advanced appearance'],
    unavailable: ['Staff management'],
    action: 'Upgrade options coming soon',
    featured: true,
  },
  {
    key: 'business',
    name: 'Business',
    description: 'More control for restaurants with a team.',
    features: ['Everything in Pro', 'Staff management'],
    unavailable: [],
    action: 'Upgrade options coming soon',
    featured: false,
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-sand px-4 py-12 text-ink dark:bg-[#0f1d22] dark:text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link to="/home" className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-brand">
          <ArrowLeft size={16} /> Back to home
        </Link>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            <Sparkles size={14} /> MenuOnline plans
          </span>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Choose the plan that fits your restaurant</h1>
          <p className="mt-3 text-sm text-muted">Start with a digital menu, then unlock operational tools as your restaurant grows.</p>
          <p className="mt-2 text-xs text-muted">Plan prices and online payments will be announced soon.</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <section key={plan.key} className={`rounded-3xl border bg-white p-6 shadow-sm dark:border-[var(--surface-dark-card)] dark:bg-[var(--surface-dark)] ${plan.featured ? 'border-brand ring-2 ring-brand/20' : 'border-line'}`}>
              {plan.featured && <span className="mb-3 inline-block rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">Most popular</span>}
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p className="mt-2 min-h-10 text-sm text-muted">{plan.description}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((feature) => <li key={feature} className="flex items-start gap-2"><Check size={17} className="mt-0.5 shrink-0 text-brand" />{feature}</li>)}
                {plan.unavailable.map((feature) => <li key={feature} className="text-muted line-through">{feature}</li>)}
              </ul>
              <div className="mt-8 border-t border-line pt-5 dark:border-[var(--surface-dark-card)]">
                {plan.key === 'starter'
                  ? <Link to="/register" className="inline-flex w-full justify-center rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white hover:opacity-90">{plan.action}</Link>
                  : <button type="button" disabled className="w-full cursor-not-allowed rounded-xl bg-sand px-4 py-3 text-sm font-semibold text-muted dark:bg-[var(--surface-dark-card)]">{plan.action}</button>}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
