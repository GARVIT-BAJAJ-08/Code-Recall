export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-panel-3 text-faint">
          <Icon size={22} strokeWidth={1.5} />
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-text">{title}</p>
        {description && <p className="mt-1 max-w-xs text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}
