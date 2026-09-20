import { ArrowRight, Target, Shuffle, LineChart, PlusCircle, Brain, TrendingUp, Info } from 'lucide-react'
import Button from '@/components/ui/Button'
import FeatureCard from '@/components/marketing/FeatureCard'
import StepItem from '@/components/marketing/StepItem'

const STEPS = [
  { number: 1, title: 'Add problems', description: 'Save any problem with its topic, difficulty, and your notes.' },
  { number: 2, title: 'Solve', description: 'Work through it whenever you sit down to practice.' },
  { number: 3, title: 'Track performance', description: 'Tell CodeRecall how it went in one tap.' },
  { number: 4, title: 'Automatic revision', description: 'It comes back exactly when you\'re likely to forget it.' },
]

const FEATURES = [
  {
    icon: Target,
    title: 'Smart Revision',
    description: 'A priority queue that ranks problems by how overdue and difficult they are, so you always work on what matters most.',
  },
  {
    icon: Shuffle,
    title: 'Random Practice',
    description: 'Pull a random problem from your due list, or build a custom set filtered by topic and difficulty.',
  },
  {
    icon: LineChart,
    title: 'Progress Tracking',
    description: 'See mastery per topic, revision streaks, and activity trends so you know exactly where you stand.',
  },
]

export default function LandingPage() {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-ember-500/25 bg-ember-500/10 px-3 py-1 text-xs font-medium text-ember-300">
          <Brain size={13} />
          Spaced revision for coding interviews
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-3xl font-bold leading-tight text-text sm:text-5xl sm:leading-tight">
          Remember what you code.
          <br />
          Revise what you forget.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm text-muted sm:text-base">
          CodeRecall saves every problem you solve and brings it back for revision right
          before you'd naturally forget it — so the patterns actually stick.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button to="/signup" size="lg">
            Get Started
            <ArrowRight size={17} />
          </Button>
          <Button to="/login" variant="secondary" size="lg">
            Login
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="rounded-2xl border border-line bg-panel-2/80 p-6 backdrop-blur-sm sm:p-8">
          <div className="mb-8 text-center">
            <h2 className="text-lg font-semibold text-text sm:text-xl">How it works</h2>
            <p className="mt-1 text-sm text-muted">Four steps, running on autopilot after the first one.</p>
          </div>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            {STEPS.map((step) => (
              <StepItem key={step.number} {...step} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-lg font-semibold text-text sm:text-xl">Built for actual retention</h2>
          <p className="mt-1 text-sm text-muted">Not just a list of solved problems — a system that keeps them solved.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24 text-center sm:px-6">
        <div className="rounded-2xl border border-ember-500/20 bg-gradient-to-br from-ember-500/10 to-transparent p-8 sm:p-10">
          <TrendingUp size={26} className="mx-auto text-ember-400" />
          <h2 className="mt-4 text-xl font-bold text-text sm:text-2xl">
            Ready to stop re-learning problems you've already solved?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Add your first problem in under a minute — CodeRecall handles the scheduling from there.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button to="/signup" size="lg">
              <PlusCircle size={16} />
              Create your account
            </Button>
            <Button to="/about" variant="ghost" size="lg">
              <Info size={15} />
              Learn more
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
