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
} from 'lucide-react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import translations from '../../i18n/translations'
import hasPermission from '../../utils/permissions'

const Sidebar = () => {
  const language = useSelector((state) => state.ui.language)
  const user = useSelector((state) => state.auth.user)

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
    },
    {
      to: '/tables',
      label: t.tables,
      icon: TableProperties,
    },
    {
      to: '/staff',
      label: t.staff || 'Staff',
      icon: Users,
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
      document.documentElement.dir =
        language === 'ar'
          ? 'rtl'
          : 'ltr'
  
      document.documentElement.lang =
        language
    }, [language])
  return (
    <aside
      className=" group fixed left-0 top-0 z-40 h-screen w-20 overflow-hidden border-r border-slate-200 bg-white px-3 py-6 text-slate-900 transition-all duration-300 hover:w-64 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 rtl:left-auto rtl:right-0 rtl:border-r-0 rtl:border-l "
    >
      {/* Logo / Brand */}
      <div className="mb-8 flex h-12 items-center gap-3 px-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">
          R
        </div>

        <div className="whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <p className="text-sm font-semibold">
            Restaurant
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manager
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex h-12 items-center gap-3 rounded-2xl px-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-sky-50 text-sky-600 dark:bg-slate-800 dark:text-sky-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />

            <span className="whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
 
