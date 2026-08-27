// import { Outlet } from 'react-router-dom'
// import Sidebar from './Sidebar'
// import Navbar from './Navbar'

// const SidebarLayout = () => {
//   return (
//     //  <div className="min-h-screen bg-slate-950 text-slate-100 lg:flex"> 
//     <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 lg:flex"> 

//       <Sidebar />
//       <div className="flex-1 lg:pl-72">
//         <Navbar />
//         <main className="px-4 py-6 sm:px-6 lg:px-8">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   ) 
// }

// export default SidebarLayout
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const SidebarLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 lg:flex">

      <Sidebar />

      <div className="flex-1 lg:pl-85">
        <Navbar />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

    </div>
  )
}

export default SidebarLayout