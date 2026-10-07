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

import {
  markNewOrdersViewed,
  resetOrdersState,
} from '../../store/orderSlice'
 
// import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = ( ) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    language,
    theme,
  } = useSelector(
    (state) => state.ui
  )

  // =====================================================
  // NOTIFICATION
  // =====================================================

  const notafication = useSelector(
    (state) => state.orders.notafication
  )

  const t =
    translations[language] ||
    translations.en ||
    {}
  
  // =====================================================
  // LANGUAGES
  // =====================================================

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

  // =====================================================
  // LOGOUT
  // =====================================================

const onLgout = () => {
  dispatch(resetOrdersState())
  dispatch(logout())

  document.documentElement.dir = 'ltr'
  dispatch( toggleTheme('light') )
  window.location.href = '/login'
}
 
 
  // =====================================================
  // OPEN NOTIFICATIONS
  // =====================================================

  const handleNotificationClick = () => {
  if (!notafication) {
    return
  }

  dispatch(markNewOrdersViewed())

  navigate('/orders')
}

  // =====================================================
  // UI
  // =====================================================

  return (
    <header className="flex items-center justify-between border-b border-line bg-white px-8 py-4 transition-colors lg:mx-10 dark:border-[var(--surface-dark-card)] dark:bg-[var(--surface-dark)]">

      <div>
        <h1 className="text-xl font-semibold text-ink dark:text-white">
          {t.managerDashboard || 'Manager Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Button */}
        <button
          type="button"
          onClick={handleNotificationClick}
          className="relative inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-line bg-white text-ink transition hover:bg-sand dark:border-[var(--surface-dark-card)] dark:bg-[var(--surface-dark-card)] dark:text-[var(--color-sand)] dark:hover:bg-[#1f4a54]"
          aria-label="Notifications"
        >
          <Bell size={20} />

          {notafication && (
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-white dark:ring-[#0f1d22]" />
          )}
        </button>

        <div className="group relative">
          {/* Language Button */}
          <button
            type="button"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-line bg-white text-ink transition hover:bg-sand dark:border-[var(--surface-dark-card)] dark:bg-[var(--surface-dark-card)] dark:text-[var(--color-sand)] dark:hover:bg-[#1f4a54]"
            aria-label="Language"
          >
            <Languages size={20} />
          </button>

          <div className="pointer-events-none absolute right-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
            <div className="w-44 rounded-2xl border border-line bg-white p-2 shadow-xl dark:border-[var(--surface-dark-card)] dark:bg-[var(--surface-dark-card)]">
              {languages.map((item) => (
                <button
                  key={item.locale}
                  type="button"
                  onClick={() => dispatch(setLanguage(item.locale))}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                          language === item.locale
                            ? 'bg-sand text-brand dark:bg-[var(--surface-dark-card)] dark:text-brand'
                            : 'text-ink hover:bg-sand dark:text-[var(--color-sand)] dark:hover:bg-[#1f4a54]'
                        }`}
                >

                    <span>
                      {
                        item.label
                      }
                    </span>

                    {language ===
                      item.locale && (
                      <span className="text-xs font-semibold">
                        ✓
                      </span>
                    )}

                  </button>
                )
              )}

            </div>
          </div>
        </div>

        {/* =================================================
            Light / Dark Mode
        ================================================= */}

        <button
          type="button"
          onClick={() => dispatch(toggleTheme('dark'))}
          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-line bg-white text-ink transition hover:bg-sand dark:border-[var(--surface-dark-card)] dark:bg-[var(--surface-dark-card)] dark:text-[var(--color-sand)] dark:hover:bg-[#1f4a54]"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* =================================================
            Logout
        ================================================= */}

        <button
          type="button"
          onClick={onLgout}
          className="inline-flex h-11 cursor-pointer items-center justify-center rounded-2xl border border-line bg-white px-4 text-sm font-medium text-ink transition hover:bg-sand dark:border-[var(--surface-dark-card)] dark:bg-[var(--surface-dark-card)] dark:text-white dark:hover:bg-[#1f4a54]"
        >
          {t.logout}
        </button>

      </div>
    </header>
  )
}

export default Navbar
 
