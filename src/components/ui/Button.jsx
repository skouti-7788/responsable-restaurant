const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0f1d22] disabled:cursor-not-allowed disabled:opacity-50'

  const variants = {
    primary:
      'bg-brand text-white hover:bg-brand-dark shadow-lg shadow-orange-200 dark:shadow-orange-950/20',
    secondary:
      'border border-line bg-white text-ink hover:bg-sand dark:border-[#234b58] dark:bg-[#18353d] dark:text-white dark:hover:bg-[#234b58]',
    ghost:
      'bg-transparent text-ink hover:bg-sand dark:text-white dark:hover:bg-[#18353d]',
    danger:
      'bg-red-600 text-white hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-400',
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