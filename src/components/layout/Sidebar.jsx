import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  TableProperties,
  QrCode,
  UserCircle,
} from 'lucide-react'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'Profile', icon: UserCircle },
  { to: '/categories', label: 'Categories', icon: BarChart3 },
  { to: '/meals', label: 'Meals', icon: UtensilsCrossed },
  { to: '/orders', label: 'Orders', icon: ClipboardList },
  { to: '/tables', label: 'Tables', icon: TableProperties },
  { to: '/qr-code', label: 'QR Codes', icon: QrCode },
]

const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white p-5 lg:flex lg:flex-col dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-lg font-bold text-white">
          M
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Menu
          </p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Online
          </h2>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-sky-100 text-sky-700 dark:bg-slate-800 dark:text-sky-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar