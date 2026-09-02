import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const SidebarLayout = () => {
  return (
    <div className="min-h-screen min-w-0 bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">

      <Sidebar />

      <div className="min-w-0 lg:pl-20">
        <Navbar />

        <main className="min-w-0 max-w-full px-4 py-6">
          <Outlet />
        </main>
      </div>

    </div>
  )
}

export default SidebarLayout