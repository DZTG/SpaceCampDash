'use client'

import TeamBadge from './TeamBadge'
import { DAY_LABELS, type DayKey } from '@/types'

const DAYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri']

export interface TeamActivityScore {
  team: string
  color: string
  total: number
  daily?: number[]
}

export interface TopScorer {
  name: string
  team: string
  teamColor: string
  score: number
}

interface ActivityCardProps {
  name: string
  emoji: string
  teamScores: TeamActivityScore[]
  topScorers: TopScorer[]
  isDaily?: boolean
}

export default function ActivityCard({
  name,
  emoji,
  teamScores,
  topScorers,
  isDaily = false,
}: ActivityCardProps) {
  const maxTeamTotal = Math.max(...teamScores.map((t) => t.total), 1)

  return (
    <div className="glass glass-hover p-5 flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-xl">{emoji}</span>
        <h3 className="font-semibold text-slate-100 text-sm">{name}</h3>
      </div>

      {/* Team scores */}
      <div className="space-y-2">
        {[...teamScores]
          .sort((a, b) => b.total - a.total)
          .map((ts) => (
            <div key={ts.team}>
              <div className="flex items-center justify-between mb-0.5">
                <span
                  className="text-xs font-medium truncate max-w-[70%]"
                  style={{ color: ts.color }}
                >
                  {ts.team}
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: ts.color }}
                >
                  {ts.total}
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(ts.total / maxTeamTotal) * 100}%`,
                    background: ts.color,
                    opacity: 0.75,
                  }}
                />
              </div>
            </div>
          ))}
      </div>

      {/* Daily breakdown (Mon–Fri mini grid) */}
      {isDaily && (
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1.5">
            Daily Breakdown
          </p>
          <div className="grid grid-cols-5 gap-1 text-center">
            {DAYS.map((day, i) => (
              <div key={day} className="space-y-0.5">
                <p className="text-slate-500 text-[10px]">{DAY_LABELS[day]}</p>
                {teamScores.map((ts) => (
                  <div
                    key={ts.team}
                    className="text-[11px] font-semibold rounded px-0.5 py-0.5"
                    style={{
                      color: ts.color,
                      background: `${ts.color}15`,
                    }}
                  >
                    {ts.daily?.[i] ?? 0}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top individual scorers */}
      {topScorers.length > 0 && (
        <div className="border-t border-white/5 pt-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1.5">
            Top Crew
          </p>
          <div className="space-y-1">
            {topScorers.slice(0, 3).map((scorer, i) => (
              <div key={scorer.name} className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 w-4 text-center">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                </span>
                <span className="text-slate-200 truncate flex-1">{scorer.name}</span>
                <TeamBadge name={scorer.team} color={scorer.teamColor} size="sm" />
                <span
                  className="font-bold w-6 text-right"
                  style={{ color: scorer.teamColor }}
                >
                  {scorer.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
