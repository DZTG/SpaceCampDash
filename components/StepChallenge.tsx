'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { Participant, TeamData, DayKey } from '@/types'
import { DAYS, DAY_LABELS } from '@/types'
import { config, getTeamColor } from '@/lib/config'
import TeamBadge from './TeamBadge'

interface StepChallengeProps {
  individuals: Participant[]
  teams: TeamData[]
}

type StepKey = `steps_${DayKey}`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="glass px-3 py-2 text-xs space-y-1">
        <p className="text-white font-semibold mb-1">{label}</p>
        {payload.map((p: { name: string; value: number; color: string }) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {p.value.toLocaleString()} steps
          </p>
        ))}
      </div>
    )
  }
  return null
}

function renderLegendText(value: string) {
  return <span style={{ color: getTeamColor(value) }}>{value}</span>
}

export default function StepChallenge({ individuals, teams }: StepChallengeProps) {
  const chartTeams =
    teams.length > 0
      ? teams.map((team) => ({ name: team.team, color: team.color }))
      : config.teams.map((team) => ({ name: team.name, color: team.color }))

  // Build chart data: combined team steps per day
  const chartData = DAYS.map((day) => {
    const stepKey = `steps_${day}` as StepKey
    const entry: Record<string, string | number> = { day: DAY_LABELS[day] }
    chartTeams.forEach((teamCfg) => {
      const teamMembers = individuals.filter((p) => p.team === teamCfg.name)
      entry[teamCfg.name] = teamMembers.reduce(
        (sum, p) => sum + (p[stepKey] as number),
        0
      )
    })
    return entry
  })

  // Top 5 individual steppers by cumulative total
  const topSteppers = [...individuals]
    .map((p) => ({
      id: p.id,
      name: p.name,
      team: p.team,
      color: getTeamColor(p.team),
      total: DAYS.reduce((sum, day) => sum + (p[`steps_${day}` as StepKey] as number), 0),
    }))
    .filter((p) => p.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  // Daily step bonus winners from the same team sheet data used in standings
  const dailyBonusWinners = DAYS.map((day) => {
    const bonusKey = `step_bonus_daily_${day}` as const
    const maxBonus = Math.max(0, ...teams.map((team) => team[bonusKey]))
    const winners =
      maxBonus > 0
        ? teams
            .filter((team) => team[bonusKey] === maxBonus)
            .map((team) => ({ name: team.team, color: team.color }))
        : []

    return { day: DAY_LABELS[day], winners, bonus: maxBonus }
  })

  // Overall step bonus winner (team + individual)
  const maxTeamBonus = Math.max(0, ...teams.map((team) => team.step_bonus_overall))
  const overallTeamWinners =
    maxTeamBonus > 0
      ? teams
          .filter((team) => team.step_bonus_overall === maxTeamBonus)
          .map((team) => ({ name: team.team, color: team.color }))
      : []

  const overallIndividualMax = Math.max(...topSteppers.map((t) => t.total), 0)
  const overallIndividualWinners = topSteppers.filter(
    (t) => t.total === overallIndividualMax && overallIndividualMax > 0
  )

  const rankMedals = ['🥇', '🥈', '🥉', '4th', '5th']

  return (
    <section className="space-y-6">
      <h2 className="section-heading">👟 Step Challenge Deep Dive</h2>

      {/* Grouped bar chart */}
      <div className="glass p-4">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-4">
          Combined Team Steps Per Day
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="day"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
              }
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Legend
              formatter={renderLegendText}
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            />
            {chartTeams.map((teamCfg) => (
              <Bar
                key={teamCfg.name}
                dataKey={teamCfg.name}
                fill={teamCfg.color}
                radius={[3, 3, 0, 0]}
                maxBarSize={28}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 5 steppers */}
        <div className="glass p-5 space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
            Top 5 Steppers (Cumulative)
          </p>
          {topSteppers.length === 0 && (
            <p className="text-slate-500 text-sm">No step data yet</p>
          )}
          {topSteppers.map((stepper, i) => (
            <div key={stepper.id} className="flex items-center gap-2">
              <span className="text-sm w-6 text-center">
                {i < 3 ? rankMedals[i] : <span className="text-slate-500 text-xs">{rankMedals[i]}</span>}
              </span>
              <span className="text-sm text-white font-semibold flex-1 truncate">
                {stepper.name}
              </span>
              <TeamBadge name={stepper.team} color={stepper.color} size="sm" />
              <span className="font-bold text-sm" style={{ color: stepper.color }}>
                {stepper.total.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Bonus callouts */}
        <div className="space-y-4">
          {/* Daily winners */}
          <div className="glass p-5 space-y-3">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
              Daily Step Bonus Winners (Team)
            </p>
            {dailyBonusWinners.map(({ day, winners, bonus }) => (
              <div key={day} className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-8">{day}</span>
                {winners.length === 0 ? (
                  <span className="text-slate-600 text-xs">—</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {winners.map((w) => (
                      <TeamBadge key={w.name} name={w.name} color={w.color} size="sm" />
                    ))}
                    <span className="text-xs text-slate-500 self-center">
                      +{bonus} pts
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Overall winners */}
          <div className="glass p-5 space-y-3">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
              Overall Step Bonus Winner
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-16">Team</span>
                {overallTeamWinners.length === 0 ? (
                  <span className="text-slate-600 text-xs">No data yet</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {overallTeamWinners.map((w) => (
                      <TeamBadge key={w.name} name={w.name} color={w.color} size="sm" />
                    ))}
                    <span className="text-xs text-slate-500 self-center">
                      +{maxTeamBonus} pts
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-16">Individual</span>
                {overallIndividualWinners.length === 0 ? (
                  <span className="text-slate-600 text-xs">No data yet</span>
                ) : (
                  <div className="flex flex-wrap gap-1 items-center">
                    {overallIndividualWinners.map((w) => (
                      <span key={w.id} className="text-sm font-semibold text-white">
                        {w.name}
                      </span>
                    ))}
                    <span className="text-xs text-slate-500">
                      {overallIndividualMax.toLocaleString()} total steps · +2 pts
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
