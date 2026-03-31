'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { TeamData } from '@/types'
import { RANK_MEDALS } from '@/types'

interface TeamStandingsProps {
  teams: TeamData[]
}

function TeamCard({ team }: { team: TeamData }) {
  const isFirst = team.rank === 1
  const medal = RANK_MEDALS[team.rank]

  return (
    <div
      className="glass glass-hover p-5 flex flex-col gap-3 relative overflow-hidden transition-all"
      style={{
        borderColor: isFirst ? `${team.color}80` : `${team.color}30`,
        borderWidth: '1px',
        borderStyle: 'solid',
        ...(isFirst
          ? { boxShadow: `0 0 40px ${team.color}30, 0 0 80px ${team.color}15` }
          : {}),
      }}
    >
      {/* Rank badge */}
      <div className="flex items-center justify-between">
        <span className="text-2xl">{medal ?? `#${team.rank}`}</span>
        {isFirst && (
          <span className="text-xs font-bold text-yellow-400 tracking-widest uppercase">
            🏆 Leader
          </span>
        )}
      </div>

      {/* Team name */}
      <div>
        <p className="font-bold text-lg text-white leading-tight">{team.team}</p>
      </div>

      {/* Total points */}
      <div className="flex items-end gap-1">
        <span
          className="text-4xl font-extrabold"
          style={{ color: team.color }}
        >
          {team.total}
        </span>
        <span className="text-slate-400 text-sm mb-1">pts</span>
      </div>

      {/* Color accent bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-60"
        style={{ background: team.color }}
      />
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="glass px-3 py-2 text-sm">
        <p className="text-white font-semibold mb-1">{label}</p>
        <p style={{ color: payload[0].payload.color }}>
          {payload[0].value} pts
        </p>
      </div>
    )
  }
  return null
}

export default function TeamStandings({ teams }: TeamStandingsProps) {
  const sorted = [...teams].sort((a, b) => a.rank - b.rank)
  const chartData = sorted.map((t) => ({ name: t.team, total: t.total, color: t.color }))

  return (
    <section className="space-y-4 animate-fade-in">
      <h2 className="section-heading">🛸 Mission Standings</h2>

      {/* Team cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sorted.map((team) => (
          <TeamCard key={team.team} team={team} />
        ))}
      </div>

      {/* Bar chart */}
      <div className="glass p-4">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-3">
          Total Points Comparison
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="rgba(255,255,255,0.06)"
            />
            <XAxis
              type="number"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="total" radius={[0, 4, 4, 0]} maxBarSize={32}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
