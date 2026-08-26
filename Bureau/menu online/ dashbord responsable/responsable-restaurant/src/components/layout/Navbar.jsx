 import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/authSlice'
import {
  Bell,
  Moon,
  Sun,
  Languages,
} from 'lucide-react'
import translations from '../../i18n/translations'
import {
  toggleTheme,
  setLanguage,
} from '../../store/uiSlice'
import { useEffect } from 'react'
const Navbar = () => {
  const dispatch = useDispatch()

  const { language, theme } = useSelector(
    (state) => state.ui
  )

  const t = translations[language]

  const languages = [
    {
      locale: 'en',
      label: t.english,
    },
    {
      locale: 'fr',
      label: t.french,
    },
    {
      locale: 'ar',
      label: t.arabic,
    },
  ]
  useEffect(() => {
  document.documentElement.dir =
    language === 'ar' ? 'rtl' : 'ltr'

  document.documentElement.lang =
    language
}, [language])
  
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 transition-colors dark:border-slate-800 dark:bg-slate-950">

      {/* Dashboard */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
          {t.managerDashboard || 'Manager Dashboard'}

        </h1>

        {/* <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your menu, orders, and restaurant profile in one place.
        </p> */}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">

        {/* Notifications */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        {/* Language */}
        <div className="group relative">

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Language"
          >
            <Languages size={20} />
          </button>

          {/* Language Menu */}
          <div className="pointer-events-none absolute right-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">

            <div className="w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">

              {languages.map((item) => (
                <button
                  key={item.locale}
                  type="button"
                  onClick={() =>
                    dispatch(
                      setLanguage(item.locale)
                    ) 
                  }
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                    language === item.locale
                      ? 'bg-sky-100 text-sky-700 dark:bg-slate-800 dark:text-sky-300'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{item.label}</span>

                  {language === item.locale && (
                    <span className="text-xs font-semibold">
                      ✓
                    </span>
                  )}
                </button>
              ))}

            </div>
          </div>
        </div>

        {/* Light / Dark Mode */}
        <button
          type="button"
          onClick={() =>
            dispatch(toggleTheme())
          }
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={() =>
            dispatch(logout())
          }
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          {t.logout}
        </button>

      </div>
    </header>
  )
}

export default Navbar