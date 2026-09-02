const Button = ({
  children,
  // variant = 'primary',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50'

  const variants = {
    primary:
      'bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',

    // secondary:
    //   'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',

    // ghost:
    //   'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',

    // danger:
    //   'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  }

  return (
    <button
      className={`${base} ${variants.primary}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button