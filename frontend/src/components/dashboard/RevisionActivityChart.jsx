import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function RevisionActivityChart({ data }) {
  return (
    <div className="rounded-2xl border border-line bg-panel-2/80 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Revision activity</h3>
        <span className="text-xs text-faint">Last 7 days</span>
      </div>
      <div className="mt-3 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#23262f" strokeDasharray="3 4" />
            <XAxis
              dataKey="label"
              tick={{ fill: '#5c5f6c', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: '#5c5f6c', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip
              contentStyle={{
                background: '#14161f',
                border: '1px solid #23262f',
                borderRadius: 10,
                fontSize: 12,
              }}
              labelStyle={{ color: '#8b8d9a' }}
              cursor={{ stroke: '#ffa726', strokeOpacity: 0.2, strokeWidth: 20 }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#ffa726"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#ffa726', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
