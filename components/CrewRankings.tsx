'use client'

import { useState } from 'react'
import type { Participant } from '@/types'
import { RANK_MEDALS } from '@/types'
import { config, getTeamColor } from '@/lib/config'
import TeamBadge from './TeamBadge'

interface CrewRankingsProps {
  individuals: Participant[]
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="h-1 bg-white/5 rounded-full overflow-hidden w-12">
      <div
        className="h-full rounded-full"
        style={{ width: `${max > 0 ? (value / max) * 100 : 0}%`, background: color }}
      />
    </div>
  )
}

export default function CrewRankings({ individuals }: CrewRankingsProps) {
  const [activeTeam, setActiveTeam] = useState<string>('All')

  const sorted = [...individuals].sort((a, b) => b.total - a.total)
  const filtered =
    activeTeam === 'All' ? sorted : sorted.filter((p) => p.team === activeTeam)
  const rankById = sorted.reduce<Record<string, number>>((acc, participant, index) => {
    const previous = sorted[index - 1]
    const rank =
      index === 0 || participant.total !== previous.total ? index + 1 : acc[previous.id]
    acc[participant.id] = rank
    return acc
  }, {})

  const maxTotal = sorted[0]?.total ?? 1

  const filters = ['All', ...config.teams.map((t) => t.name)]

  return (
    <section className="space-y-4">
      <h2 className="section-heading">👨‍🚀 Crew Rankings</h2>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const color = f === 'All' ? '#94a3b8' : getTeamColor(f)
          const isActive = activeTeam === f
          return (
            <button
              key={f}
              onClick={() => setActiveTeam(f)}
              className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
              style={{
                background: isActive ? `${color}30` : 'rgba(255,255,255,0.05)',
                color: isActive ? color : '#94a3b8',
                border: `1px solid ${isActive ? `${color}60` : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              {f}
            </button>
          )
        })}
      </div>

      {/* Rankings table */}
      <div className="glass overflow-hidden">
        {/* Desktop table header */}
        <div className="hidden md:grid grid-cols-[2.5rem_1fr_8rem_6rem_6rem_6rem_6rem_6rem_5rem] gap-2 px-4 py-2 border-b border-white/5 text-xs text-slate-500 uppercase tracking-wider font-medium">
          <div>#</div>
          <div>Name</div>
          <div>Team</div>
          <div className="text-center">Board</div>
          <div className="text-center">Trivia</div>
          <div className="text-center">Steps</div>
          <div className="text-center">Other</div>
          <div className="text-right">Total</div>
          <div />
        </div>

        {filtered.length === 0 && (
          <div className="px-6 py-10 text-center text-slate-500 text-sm">
            No participants yet
          </div>
        )}

        {filtered.map((p) => {
          const globalRank = rankById[p.id]
          const medal = RANK_MEDALS[globalRank]
          const color = getTeamColor(p.team)
          const boardTotal =
            p.daily_board_mon +
            p.daily_board_tue +
            p.daily_board_wed +
            p.daily_board_thu +
            p.daily_board_fri
          const triviaTotal =
            p.daily_trivia_mon +
            p.daily_trivia_tue +
            p.daily_trivia_wed +
            p.daily_trivia_thu +
            p.daily_trivia_fri
          const stepsBonus = p.stepBonusDaily + p.stepBonusOverall
          const other =
            p.disc +
            p.icebreaker +
            p.impromptu_six_mon +
            p.impromptu_six_tue +
            p.impromptu_six_wed +
            p.impromptu_six_thu +
            p.impromptu_six_fri +
            p.virtual_bingo +
            p.scavenger_hunt +
            p.ai_challenge

          return (
            <div
              key={p.id}
              className={`px-4 py-3 border-b border-white/5 last:border-0 transition-colors hover:bg-white/3
                ${globalRank <= 3 ? 'bg-white/2' : ''}`}
            >
              {/* Mobile layout */}
              <div className="md:hidden flex items-center gap-3">
                <div className="w-8 text-center text-sm font-bold">
                  {medal ? (
                    <span>{medal}</span>
                  ) : (
                    <span className="text-slate-500">{globalRank}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                  <TeamBadge name={p.team} color={color} size="sm" />
                </div>
                <div
                  className="text-lg font-extrabold"
                  style={{ color }}
                >
                  {p.total}
                  <span className="text-xs text-slate-400 font-normal ml-0.5">pts</span>
                </div>
              </div>

              {/* Desktop layout */}
              <div className="hidden md:grid grid-cols-[2.5rem_1fr_8rem_6rem_6rem_6rem_6rem_6rem_5rem] gap-2 items-center">
                <div className="text-sm font-bold text-center">
                  {medal ?? (
                    <span className="text-slate-500 font-mono text-xs">{globalRank}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                </div>
                <div>
                  <TeamBadge name={p.team} color={color} size="sm" />
                </div>
                <div className="text-center text-sm text-slate-300">{boardTotal}</div>
                <div className="text-center text-sm text-slate-300">{triviaTotal}</div>
                <div className="text-center text-sm text-slate-300">{stepsBonus}</div>
                <div className="text-center text-sm text-slate-300">{other}</div>
                <div
                  className="text-right font-bold text-base"
                  style={{ color }}
                >
                  {p.total}
                </div>
                <div className="flex justify-end">
                  <MiniBar value={p.total} max={maxTotal} color={color} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-slate-600 text-right">
        Showing {filtered.length} of {sorted.length} crew members
      </p>
    </section>
  )
}
