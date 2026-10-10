const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center rounded-2xl px-5 py-2 text-sm font-semibold   cursor-pointer focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[var(--surface-dark)] disabled:cursor-not-allowed disabled:opacity-50'

  const variants = {
    primary:
      "flex h-10 cursor-pointer px-3 gap-2 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-600   hover:bg-orange-100 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-300 dark:hover:bg-orange-950/50",

    secondary:
      "flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700  hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-950/50",

    ghost:
      'border border-rose-600 bg-transparent text-rose-600 hover:bg-rose-50 dark:border-rose-400 dark:text-rose-400 dark:hover:bg-rose-950/30',
    danger:
       "flex h-10 cursor-pointer px-3 gap-2 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600   hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/50"

    }

  return (
    <button
      className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button