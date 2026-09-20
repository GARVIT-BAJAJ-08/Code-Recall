import { Zap, Target } from 'lucide-react'
import Button from '@/components/ui/Button'
import botHero from '@/assets/images/bot-hero.webp'

export default function HeroBanner({ dueCount, onStartRevision, name }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-panel-2/90 backdrop-blur-sm">
      <img
        src={botHero}
        alt=""
        className="pointer-events-none absolute -right-16 top-1/2 hidden h-[135%] max-w-none -translate-y-1/2 opacity-40 [mask-image:linear-gradient(to_left,black_20%,transparent_85%)] sm:block"
      />
      <div className="relative flex flex-col gap-5 p-6 sm:p-8">
        <p className="text-sm font-medium text-muted">{greeting}, {name || 'there'} 👋</p>
        <h1 className="max-w-md text-2xl font-bold leading-tight text-text sm:text-[28px]">
          Ready to recall what you've solved?
        </h1>
        <p className="max-w-sm text-sm text-muted">
          {dueCount > 0
            ? `${dueCount} ${dueCount === 1 ? 'problem is' : 'problems are'} due for revision today.`
            : "You're all caught up — nothing due today."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={onStartRevision} size="lg">
            <Zap size={17} />
            Start today's revision
          </Button>
          <Button to="/smart" variant="secondary" size="lg">
            <Target size={16} />
            Smart revision
          </Button>
        </div>
      </div>
    </div>
  )
}
