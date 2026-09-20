export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-ember-300 to-ember-600 font-mono text-base font-bold text-[#1a0f00] shadow-[0_4px_14px_-4px_rgba(245,148,31,0.6)]">
        {'</>'}
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="text-[15px] font-bold tracking-tight text-text">CodeRecall</p>
          <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-faint">
            Remember. Revise. Master.
          </p>
        </div>
      )}
    </div>
  )
}
