'use client'

import ActivityCard, { type TeamActivityScore, type TopScorer } from './ActivityCard'
import type { Participant, TeamData, DayKey } from '@/types'
import { DAYS } from '@/types'
import { getTopIndividuals, getTeamDailyByDay } from '@/lib/scoring'
import { getTeamColor } from '@/lib/config'

interface ActivityBreakdownProps {
  individuals: Participant[]
  teams: TeamData[]
}

function makeTeamScores(
  teams: TeamData[],
  keys: Array<keyof TeamData>
): TeamActivityScore[] {
  return teams.map((t) => ({
    team: t.team,
    color: t.color,
    total: keys.reduce((sum, k) => sum + ((t[k] as number) ?? 0), 0),
  }))
}

function makeTeamScoresDaily(
  teams: TeamData[],
  prefix: 'daily_board' | 'daily_trivia' | 'impromptu_six' | 'step_bonus_daily'
): TeamActivityScore[] {
  return teams.map((t) => ({
    team: t.team,
    color: t.color,
    total: DAYS.reduce(
      (sum, day) => sum + ((t[`${prefix}_${day}` as keyof TeamData] as number) ?? 0),
      0
    ),
    daily: getTeamDailyByDay(t, prefix),
  }))
}

function topScorers(
  individuals: Participant[],
  scoreFn: (p: Participant) => number
): TopScorer[] {
  return getTopIndividuals(individuals, scoreFn, 3).map((x) => ({
    ...x,
    teamColor: getTeamColor(x.team),
  }))
}

function stepBonusTopScorers(individuals: Participant[]): TopScorer[] {
  return topScorers(
    individuals,
    (p) => p.stepBonusDaily + p.stepBonusOverall
  )
}

export default function ActivityBreakdown({
  individuals,
  teams,
}: ActivityBreakdownProps) {
  const activities = [
    {
      name: 'DISC Assessment',
      emoji: '🧠',
      teamScores: makeTeamScores(teams, ['disc']),
      topScorers: topScorers(individuals, (p) => p.disc),
    },
    {
      name: 'Icebreaker',
      emoji: '👋',
      teamScores: makeTeamScores(teams, ['icebreaker']),
      topScorers: topScorers(individuals, (p) => p.icebreaker),
    },
    {
      name: 'Daily Board',
      emoji: '📋',
      isDaily: true,
      teamScores: makeTeamScoresDaily(teams, 'daily_board'),
      topScorers: topScorers(
        individuals,
        (p) =>
          p.daily_board_mon +
          p.daily_board_tue +
          p.daily_board_wed +
          p.daily_board_thu +
          p.daily_board_fri
      ),
    },
    {
      name: 'Daily Trivia',
      emoji: '❓',
      isDaily: true,
      teamScores: makeTeamScoresDaily(teams, 'daily_trivia'),
      topScorers: topScorers(
        individuals,
        (p) =>
          p.daily_trivia_mon +
          p.daily_trivia_tue +
          p.daily_trivia_wed +
          p.daily_trivia_thu +
          p.daily_trivia_fri
      ),
    },
    {
      name: 'Impromptu Six',
      emoji: '🎲',
      isDaily: true,
      teamScores: makeTeamScoresDaily(teams, 'impromptu_six'),
      topScorers: topScorers(
        individuals,
        (p) =>
          p.impromptu_six_mon +
          p.impromptu_six_tue +
          p.impromptu_six_wed +
          p.impromptu_six_thu +
          p.impromptu_six_fri
      ),
    },
    {
      name: 'Virtual Bingo',
      emoji: '🎱',
      teamScores: makeTeamScores(teams, ['virtual_bingo']),
      topScorers: topScorers(individuals, (p) => p.virtual_bingo),
    },
    {
      name: 'Daily Step Challenge',
      emoji: '👟',
      isDaily: true,
      teamScores: makeTeamScoresDaily(teams, 'step_bonus_daily'),
      topScorers: stepBonusTopScorers(individuals),
    },
    {
      name: 'Scavenger Hunt',
      emoji: '🔍',
      teamScores: makeTeamScores(teams, ['scavenger_hunt']),
      topScorers: topScorers(individuals, (p) => p.scavenger_hunt),
    },
    {
      name: 'AI Challenge',
      emoji: '🤖',
      teamScores: makeTeamScores(teams, ['ai_challenge']),
      topScorers: topScorers(individuals, (p) => p.ai_challenge),
    },
  ]

  return (
    <section className="space-y-4">
      <h2 className="section-heading">⚡ Activity Breakdown</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((act) => (
          <ActivityCard
            key={act.name}
            name={act.name}
            emoji={act.emoji}
            teamScores={act.teamScores}
            topScorers={act.topScorers}
            isDaily={act.isDaily}
          />
        ))}
      </div>
    </section>
  )
}
