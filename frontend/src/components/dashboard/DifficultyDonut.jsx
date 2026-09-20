import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const COLORS = { Easy: '#34c07a', Medium: '#ffa726', Hard: '#ef5a5a' }

export default function DifficultyDonut({ data, total }) {
  return (
    <div className="rounded-2xl border border-line bg-panel-2/80 p-5 backdrop-blur-sm">
      <h3 className="text-sm font-semibold text-text">Problems by difficulty</h3>
      <div className="mt-2 flex items-center gap-4">
        <div className="relative h-32 w-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="difficulty"
                innerRadius={38}
                outerRadius={58}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.difficulty} fill={COLORS[entry.difficulty]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono-num text-xl font-bold text-text">{total}</span>
            <span className="text-[10px] text-faint">total</span>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          {data.map((entry) => (
            <div key={entry.difficulty} className="flex items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: COLORS[entry.difficulty] }}
                />
                {entry.difficulty}
              </div>
              <span className="font-mono-num text-text">
                {entry.count} <span className="text-faint">({entry.percent}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
