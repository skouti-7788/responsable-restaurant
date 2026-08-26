const Input = ({ label, className = '', ...props }) => {
  return (
    <label className="block w-full">
      {label && (
        <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}

      <input
        className={`w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-100 dark:placeholder:text-slate-500 ${className}`}
        {...props}
      />
    </label>
  )
}

export default Input