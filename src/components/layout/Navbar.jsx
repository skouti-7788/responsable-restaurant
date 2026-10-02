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
  clearNotafication,
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
  dispatch(logout())

  document.documentElement.dir = 'ltr'
  // document.documentElement.classList.remove('dark')
   dispatch(
              toggleTheme('light')
            )
}
 
 
  // =====================================================
  // OPEN NOTIFICATIONS
  // =====================================================

  const handleNotificationClick = () => {
    if(notafication === true){navigate('/orders')}  
    dispatch(
      clearNotafication()
    )
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <header className="flex items-center justify-between border-b border-line bg-white px-8 py-4 transition-colors lg:mx-10 dark:border-[#234b58] dark:bg-[#0f1d22]">

      <div>
        <h1 className="text-xl font-semibold text-ink dark:text-white">
          {t.managerDashboard || 'Manager Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleNotificationClick}
          className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-white text-ink transition hover:bg-sand dark:border-[#234b58] dark:bg-[#18353d] dark:text-[#dfe7eb] dark:hover:bg-[#234b58]"
          aria-label="Notifications"
        >
          <Bell size={20} />

          {notafication && (
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-white dark:ring-[#0f1d22]" />
          )}
        </button>

        <div className="group relative">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-white text-ink transition hover:bg-sand dark:border-[#234b58] dark:bg-[#18353d] dark:text-[#dfe7eb] dark:hover:bg-[#234b58]"
            aria-label="Language"
          >
            <Languages size={20} />
          </button>

          <div className="pointer-events-none absolute right-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
            <div className="w-44 rounded-2xl border border-line bg-white p-2 shadow-xl dark:border-[#234b58] dark:bg-[#18353d]">
              {languages.map((item) => (
                <button
                  key={item.locale}
                  type="button"
                  onClick={() => dispatch(setLanguage(item.locale))}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                    language === item.locale
                      ? 'bg-sand text-brand dark:bg-[#234b58] dark:text-[#ffb347]'
                      : 'text-ink hover:bg-sand dark:text-[#dfe7eb] dark:hover:bg-[#234b58]'
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
          onClick={() => dispatch(toggleTheme())}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-white text-ink transition hover:bg-sand dark:border-[#234b58] dark:bg-[#18353d] dark:text-[#dfe7eb] dark:hover:bg-[#234b58]"
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
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-line bg-white px-4 text-sm font-medium text-ink transition hover:bg-sand dark:border-[#234b58] dark:bg-[#18353d] dark:text-white dark:hover:bg-[#234b58]"
        >
          {t.logout}
        </button>

      </div>
    </header>
  )
}

export default Navbar
 
