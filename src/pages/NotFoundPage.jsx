// import { Link } from 'react-router-dom'

// const NotFoundPage = () => (
//   <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16 text-center">
//     <div className="max-w-xl rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 shadow-card">
//       <p className="text-sm uppercase tracking-[0.35em] text-sky-400/80">404 error</p>
//       <h1 className="mt-4 text-5xl font-semibold text-slate-100">Page not found</h1>
//       <p className="mt-4 text-slate-400">The page you are looking for does not exist or has been moved.</p>
//       <Link
//         to="/"
//         className="mt-8 inline-flex items-center justify-center rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
//       >
//         Return home
//       </Link>
//     </div>
//   </div>
// )

// export default NotFoundPage
import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16 text-center transition-colors dark:bg-slate-950">

    <div className="max-w-xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-card transition-colors dark:border-slate-800 dark:bg-slate-900/95">

      <p className="text-sm uppercase tracking-[0.35em] text-sky-500 dark:text-sky-400/80">
        404 error
      </p>

      <h1 className="mt-4 text-5xl font-semibold text-slate-900 dark:text-slate-100">
        Page not found
      </h1>

      <p className="mt-4 text-slate-500 dark:text-slate-400">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
      >
        Return home
      </Link>

    </div>
  </div>
)

export default NotFoundPage