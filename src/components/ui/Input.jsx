const Input = ({ label, className = '', ...props }) => {
  return (
    <label className="block w-full">
      {label && (
        <span className="mb-2 block text-sm font-medium text-ink dark:text-[#dfe7eb]">
          {label}
        </span>
      )}

      <input
        className={`w-full rounded-3xl border border-line bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted focus:border-brand dark:border-[#234b58] dark:bg-[#0f1d22] dark:text-white dark:placeholder:text-[#a9b7bd] ${className}`}
        {...props}
      />
    </label>
  )
}

export default Input