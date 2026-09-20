export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-line bg-panel-2/80 p-6 backdrop-blur-sm transition-colors hover:border-ember-500/30">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ember-400/10 text-ember-400">
        <Icon size={20} strokeWidth={2} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-text">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>
    </div>
  )
}
