import { NavLink } from 'react-router-dom'
import {
  Home,
  User,
  Layers,
  ListChecks,
  QrCode, 
  Armchair,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import axiosClient from '../../api/axiosClient'
// import { setLanguage } from '../../store/uiSlice'
import translations from '../../i18n/translations'

const navItems = [
  { to: '/', labelKey: 'dashboard', icon: Home },
  { to: '/categories', labelKey: 'categories', icon: Layers },
  { to: '/meals', labelKey: 'meals', icon: ListChecks },
  { to: '/orders', labelKey: 'orders', icon: ListChecks },
  { to: '/tables', labelKey: 'tables', icon: Armchair }, 
  { to: '/qr-code', labelKey: 'qrCode', icon: QrCode },
  { to: '/profile', labelKey: 'profile', icon: User },

]

const Sidebar = () => {
  // const dispatch = useDispatch()

  const { language } = useSelector((state) => state.ui)
  const [restaurants, setRestaurants] = useState([])
  const t = translations[language]
   useEffect(() => {
      const loadRestaurantData =
        async () => {
          try {
            const response =
              await axiosClient.get(
                '/restaurants'
              )
  
            const restaurantsData =
              response.data.data ||
              response.data ||
              []
  
            setRestaurants(
              restaurantsData
            ) 
          } catch (err) {
            console.error(
              'Failed to load restaurant data:',
              err
            )
  
            setRestaurants([])
             
          }
        }
  
      loadRestaurantData()
    }, [])
  
  return (
    <aside className="group left-0 top-0 z-40 h-screen w-20 overflow-hidden border-r border-slate-200 bg-white px-3 py-6 text-slate-900 transition-all duration-300 hover:w-64 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">

      {/* Logo */}
      <div className="mb-8 flex h-10 items-center gap-3 px-2">

        <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-2xl bg-sky-500 font-bold text-slate-950">
          {restaurants[0]?.name?.charAt(0)?.toUpperCase() || 'R'}
        </div>

        <div className="whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t.restaurant || 'Restaurant'} {restaurants[0]?.name || ''}

          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {restaurants[0]?.email}
          </p>
        </div>

      </div>

      {/* Navigation */}
      <nav className="space-y-2">

        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex h-12 items-center gap-3 rounded-2xl px-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-sky-50 text-sky-600 dark:bg-slate-800 dark:text-sky-300'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <Icon className="h-5 w-5 min-w-5" />

              <span className="whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {t[item.labelKey]}
              </span>
            </NavLink>
          )
        })}

      </nav> 
    </aside>
  )
}

export default Sidebar