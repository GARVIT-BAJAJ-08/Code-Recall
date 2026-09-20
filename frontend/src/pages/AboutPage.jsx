import { Brain, AlertTriangle, RefreshCw, Zap } from 'lucide-react'

const SECTIONS = [
  {
    icon: Brain,
    title: 'What CodeRecall is',
    body: "CodeRecall is a revision layer for coding interview practice. You keep solving problems wherever you already do — LeetCode, a textbook, an interview prep course — and save them here with a topic, difficulty, and any notes worth remembering. From that point on, CodeRecall owns the scheduling: it decides when each problem should come back and surfaces it automatically.",
  },
  {
    icon: AlertTriangle,
    title: "Why normal LeetCode practice isn't enough",
    body: 'Solving a problem once proves you can solve it once. Without a second and third look, most of that reasoning fades within days — so weeks later, the same pattern shows up in an interview and it feels unfamiliar again. Grinding through new problems non-stop optimizes for volume, not retention, and volume alone rarely holds up under interview pressure.',
  },
  {
    icon: RefreshCw,
    title: 'How spaced revision helps',
    body: "Spaced revision brings a problem back right before you'd naturally forget it, rather than on a fixed weekly schedule or not at all. Each review either pushes the next one further out (you solved it easily) or pulls it closer in (you struggled), so your time concentrates on the patterns that are actually shaky instead of ones you've already locked in.",
  },
  {
    icon: Zap,
    title: 'How CodeRecall automates it',
    body: "After every revision you mark one of four outcomes — solved easily, solved with difficulty, couldn't solve, or saw the solution. CodeRecall runs that outcome through a deterministic scheduling formula (the same kind Anki and SuperMemo use) to set the next revision date, update a per-problem difficulty score, and roll everything up into topic mastery and streak stats on your dashboard.",
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text sm:text-3xl">About CodeRecall</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted sm:text-base">
          A short explanation of what CodeRecall does and the idea it's built on.
        </p>
      </div>

      <div className="mt-10 space-y-5">
        {SECTIONS.map((s) => (
          <div key={s.title} className="rounded-2xl border border-line bg-panel-2/80 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ember-400/10 text-ember-400">
                <s.icon size={17} />
              </div>
              <h2 className="text-base font-semibold text-text">{s.title}</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
