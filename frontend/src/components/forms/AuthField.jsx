export default function AuthField({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-text">{label}</label>
      <input
        {...props}
        className={`h-11 w-full rounded-xl border bg-panel-3/70 px-3.5 text-sm text-text placeholder:text-faint outline-none transition-colors focus:border-ember-500/50 ${
          error ? 'border-hard/50' : 'border-line'
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-hard">{error}</p>}
    </div>
  )
}
