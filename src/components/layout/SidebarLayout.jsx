import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

const SidebarLayout = () => {
  const language = useSelector(
    (state) => state.ui.language
  )

  useEffect(() => {
    document.documentElement.dir =
      language === 'ar'
        ? 'rtl'
        : 'ltr'

    document.documentElement.lang =
      language
  }, [language])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      <Sidebar />

      <div
        className="
          min-w-0
          ml-20
          transition-all duration-300
          rtl:ml-0 rtl:mr-20
        "
      >
        <Navbar />

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  )
}

export default SidebarLayout