export default function StatCard({ icon: Icon, value, label, tone = 'ember' }) {
  const toneStyles = {
    ember: 'text-ember-400 bg-ember-400/10',
    easy: 'text-easy bg-easy/10',
    hard: 'text-hard bg-hard/10',
    muted: 'text-muted bg-white/5',
  }
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-panel-2/80 p-4 backdrop-blur-sm transition-colors hover:border-ember-500/30">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneStyles[tone]}`}>
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="font-mono-num text-xl font-semibold leading-tight text-text">{value}</p>
        <p className="truncate text-xs text-muted">{label}</p>
      </div>
    </div>
  )
}
