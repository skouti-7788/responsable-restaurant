import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-sand px-4 py-16 text-center transition-colors dark:bg-[var(--surface-dark)]">

    <div className="max-w-xl rounded-[2rem] border border-line bg-white p-10 shadow-card transition-colors dark:border-[var(--surface-dark-card)] dark:bg-[var(--surface-dark-card)]">

      <p className="text-sm uppercase tracking-[0.35em] text-brand-dark dark:text-brand">
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
        className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-2xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
      >
        Return home
      </Link>

    </div>
  </div>
)

export default NotFoundPage