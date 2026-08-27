// const Button = ({ children, variant = 'primary', ...props }) => {
//   const base = 'inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
//   const variants = {
//     primary: 'bg-sky-500 text-slate-950 hover:bg-sky-400',
//     secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
//     ghost: 'bg-transparent text-slate-200 hover:bg-slate-900',
//     danger: 'bg-rose-500 text-white hover:bg-rose-400',
//   }
//   return (
//     <button className={`${base} ${variants[variant] || variants.primary}`} {...props}>
//       {children}
//     </button>
//   )
// }

// export default Button
const Button = ({
  children,
  variant = 'primary',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50'

  const variants = {
    primary:
      'bg-sky-500 text-slate-950 hover:bg-sky-400',

    secondary:
      'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',

    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900',

    danger:
      'bg-rose-500 text-white hover:bg-rose-400',
  }

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button