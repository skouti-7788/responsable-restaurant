const Input = ({ label, className = '', ...props }) => {
  return (
    <label className="block w-full">
      {label && (
        <span className="mb-2 block text-sm font-medium text-ink dark:text-[var(--color-sand)]">
          {label}
        </span>
      )}

      <input
        className={`w-full rounded-3xl border border-line bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted focus:border-brand dark:border-[var(--surface-dark-card)] dark:bg-[var(--surface-dark)] dark:text-white dark:placeholder:text-[var(--color-muted)] ${className}`}
        {...props}
      />
    </label>
  )
}

export default Input