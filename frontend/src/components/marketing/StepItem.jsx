export default function StepItem({ number, title, description }) {
  return (
    <div className="flex flex-1 items-start gap-4 sm:flex-col sm:items-center sm:text-center">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-ember-500/30 bg-ember-500/10 font-mono-num text-base font-bold text-ember-300">
        {number}
      </div>
      <div className="sm:max-w-[170px]">
        <p className="text-sm font-semibold text-text">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p>
      </div>
    </div>
  )
}
