import { useState } from 'react'
import Toggle from '@/components/ui/Toggle'
import Button from '@/components/ui/Button'

export default function SettingsPage() {
  const [dailyReminder, setDailyReminder] = useState(true)
  const [emailDigest, setEmailDigest] = useState(false)
  const [dailyGoal, setDailyGoal] = useState(5)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text">Settings</h1>
        <p className="mt-1 text-sm text-muted">Manage how CodeRecall reminds you and holds your data.</p>
      </div>

      <div className="rounded-2xl border border-line bg-panel-2/80 p-5 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-text">Revision preferences</h3>
        <div className="divide-y divide-line/70">
          <Toggle
            checked={dailyReminder}
            onChange={setDailyReminder}
            label="Daily revision reminder"
            description="Notify me when problems are due for revision."
          />
          <Toggle
            checked={emailDigest}
            onChange={setEmailDigest}
            label="Weekly email digest"
            description="Send a summary of my progress every Monday."
          />
          <div className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-text">Daily revision goal</p>
              <p className="mt-0.5 text-xs text-muted">How many problems to aim for each day.</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={1}
                max={15}
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-28 accent-ember-500"
              />
              <span className="w-6 text-right font-mono-num text-sm text-text">{dailyGoal}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-panel-2/80 p-5 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-text">Account</h3>
        <p className="mt-1 text-sm text-muted">
          Manage your password and account access from your profile.
        </p>
        <div className="mt-4">
          <Button variant="secondary" to="/profile">Open profile settings</Button>
        </div>
      </div>
    </div>
  )
}
