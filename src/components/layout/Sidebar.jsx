import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  TableProperties,
  QrCode,
  UserCircle,
  Users,
  Palette,
  LockKeyhole,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import translations from '../../i18n/translations'
import hasPermission from '../../utils/permissions'
import axiosClient from '../../api/axiosClient'

const Sidebar = () => {
  const language = useSelector((state) => state.ui.language)
  const user = useSelector((state) => state.auth.user)
  const [planFeatures, setPlanFeatures] = useState(null)

  const t = translations[language] || translations.en

  const allLinks = [
    {
      to: '/',
      label: t.dashboard,
      icon: LayoutDashboard,
    },
    {
      to: '/categories',
      label: t.categories,
      icon: BarChart3,
    },
    {
      to: '/meals',
      label: t.meals,
      icon: UtensilsCrossed,
    },
    {
      to: '/orders',
      label: t.orders,
      icon: ClipboardList,
      feature: 'orders',
    },
    {
      to: '/tables',
      label: t.tables,
      icon: TableProperties,
      feature: 'tables',
    },
    {
      to: '/staff',
      label: t.staff || 'Staff',
      icon: Users,
      feature: 'staff',
    },
    {
      to: '/appearance',
      label: t.appearance,
      icon: Palette,
    },  
    {
      to: '/profile',
      label: t.profile,
      icon: UserCircle,
    },
    {
      to: '/qr-code',
      label: t.qrCode,
      icon: QrCode,
    },
   
  ]

  // Role-based filtering
  // Role-based filtering with permissions
  const mapToPermission = {
    '/': 'dashboard.view',
    '/profile': 'profile.view',
    '/categories': 'categories.view',
    '/meals': 'meals.view',
    '/orders': 'orders.view',
    '/tables': 'tables.view',
    '/appearance': 'appearance.view',
    '/qr-code': 'qrcode.view',
    '/staff': 'staff.view',

  }

  const links = (user?.role === 'owner')
    ? allLinks : allLinks.filter((l) => {
        const perm = mapToPermission[l.to]
        if (!perm) return true
        return hasPermission(user, perm)
      })
  useEffect(() => {
    if (user?.role !== 'owner') {
      setPlanFeatures(null)
      return
    }

    let active = true

    axiosClient.get('/subscription/')
      .then(({ data }) => {
        if (active) {
          setPlanFeatures(data?.plan?.features || {})
        }
      })
      .catch((error) => {
        console.error('Load subscription features error:', error)
        if (active) {
          // Do not show misleading lock icons when subscription status is unknown.
          setPlanFeatures(null)
        }
      })

    return () => {
      active = false
    }
  }, [user?.role])

  useEffect(() => {
      document.documentElement.dir =
        language === 'ar'
          ? 'rtl'
          : 'ltr'
  
      document.documentElement.lang =
        language
    }, [language])
  return (
    <aside
      className="group fixed left-0 top-0 z-40 h-screen w-20 overflow-hidden border-r border-line bg-white px-3 py-6 text-ink  hover:w-64 dark:border-[var(--surface-dark-card)] dark:bg-[var(--surface-dark)] dark:text-white rtl:left-auto rtl:right-0 rtl:border-r-0 rtl:border-l"
    >
      <div className="mb-8 flex h-12 items-center gap-3 px-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white shadow-lg shadow-orange-200 dark:shadow-orange-950/30">
          R
        </div>

        <div className="whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <p className="text-sm font-semibold text-ink dark:text-white">
            Restaurant
          </p>

          <p className="text-xs text-muted dark:text-[var(--color-sand)]">
            Manager
          </p>
        </div>
      </div>

      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon, feature }) => {
          const isPlanLocked =
            user?.role === 'owner' &&
            !!feature &&
            planFeatures?.[feature] === false

          return (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex h-12 items-center gap-3 rounded-2xl px-3 text-sm font-medium   ${
                isActive
                  ? 'bg-sand text-brand dark:bg-[var(--surface-dark-card)] dark:text-brand'
                  : 'text-ink hover:bg-sand hover:text-brand dark:text-[var(--color-sand)] dark:hover:bg-[var(--surface-dark-card)] dark:hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />

            <span className="flex min-w-0 flex-1 items-center justify-between gap-3 whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {label}
              {isPlanLocked && (
                <LockKeyhole
                  className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
                  aria-label={t.planFeatureLocked || 'Upgrade required'}
                  title={t.planFeatureLocked || 'Upgrade required'}
                />
              )}
            </span>
          </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
 
