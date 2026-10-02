import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-sand px-4 py-16 text-center transition-colors dark:bg-[#0f1d22]">

    <div className="max-w-xl rounded-[2rem] border border-line bg-white p-10 shadow-card transition-colors dark:border-[#234b58] dark:bg-[#18353d]">

      <p className="text-sm uppercase tracking-[0.35em] text-brand-dark dark:text-[#ffb347]">
        404 error
      </p>

      <h1 className="mt-4 text-5xl font-semibold text-ink dark:text-white">
        Page not found
      </h1>

      <p className="mt-4 text-muted dark:text-slate-400">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center rounded-2xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
      >
        Return home
      </Link>

    </div>
  </div>
)

export default NotFoundPage