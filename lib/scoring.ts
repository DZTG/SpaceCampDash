import type { RawParticipant, RawTeam, Participant, TeamData, DayKey } from '@/types'
import { DAYS } from '@/types'
import { getTeamColor } from './config'

type StepKey = keyof Pick<
  RawParticipant,
  'steps_mon' | 'steps_tue' | 'steps_wed' | 'steps_thu' | 'steps_fri'
>

const STEP_KEYS: Record<DayKey, StepKey> = {
  mon: 'steps_mon',
  tue: 'steps_tue',
  wed: 'steps_wed',
  thu: 'steps_thu',
  fri: 'steps_fri',
}

export function computeParticipants(raw: RawParticipant[]): Participant[] {
  // Per-person accumulated step bonuses
  const stepBonusDaily: Record<string, number> = {}
  const stepBonusOverall: Record<string, number> = {}
  raw.forEach((p) => {
    stepBonusDaily[p.name] = 0
    stepBonusOverall[p.name] = 0
  })

  // Daily step bonus: 1 pt to the top stepper each day (ties all win)
  DAYS.forEach((day) => {
    const key = STEP_KEYS[day]
    const values = raw.map((p) => p[key] as number)
    const maxSteps = Math.max(...values)
    if (maxSteps > 0) {
      raw
        .filter((p) => (p[key] as number) === maxSteps)
        .forEach((p) => {
          stepBonusDaily[p.name] += 1
        })
    }
  })

  // Overall step bonus: 2 pts to top cumulative stepper (ties all win)
  const cumulative = raw.map((p) => ({
    name: p.name,
    total: DAYS.reduce((sum, day) => sum + (p[STEP_KEYS[day]] as number), 0),
  }))
  const maxTotal = Math.max(...cumulative.map((c) => c.total))
  if (maxTotal > 0) {
    cumulative
      .filter((c) => c.total === maxTotal)
      .forEach((c) => {
        stepBonusOverall[c.name] = 2
      })
  }

  return raw.map((p) => {
    const sbd = stepBonusDaily[p.name]
    const sbo = stepBonusOverall[p.name]
    const total =
      p.disc +
      p.icebreaker +
      p.daily_board_mon +
      p.daily_board_tue +
      p.daily_board_wed +
      p.daily_board_thu +
      p.daily_board_fri +
      p.daily_trivia_mon +
      p.daily_trivia_tue +
      p.daily_trivia_wed +
      p.daily_trivia_thu +
      p.daily_trivia_fri +
      p.impromptu_six_mon +
      p.impromptu_six_tue +
      p.impromptu_six_wed +
      p.impromptu_six_thu +
      p.impromptu_six_fri +
      p.virtual_bingo +
      p.scavenger_hunt +
      p.ai_challenge +
      sbd +
      sbo

    return { ...p, stepBonusDaily: sbd, stepBonusOverall: sbo, total }
  })
}

export function computeTeams(raw: RawTeam[]): TeamData[] {
  const withTotals = raw.map((t) => {
    const total =
      t.disc +
      t.icebreaker +
      t.daily_board_mon +
      t.daily_board_tue +
      t.daily_board_wed +
      t.daily_board_thu +
      t.daily_board_fri +
      t.daily_trivia_mon +
      t.daily_trivia_tue +
      t.daily_trivia_wed +
      t.daily_trivia_thu +
      t.daily_trivia_fri +
      t.impromptu_six_mon +
      t.impromptu_six_tue +
      t.impromptu_six_wed +
      t.impromptu_six_thu +
      t.impromptu_six_fri +
      t.step_bonus_daily_mon +
      t.step_bonus_daily_tue +
      t.step_bonus_daily_wed +
      t.step_bonus_daily_thu +
      t.step_bonus_daily_fri +
      t.step_bonus_overall +
      t.virtual_bingo +
      t.scavenger_hunt +
      t.ai_challenge

    return {
      ...t,
      total,
      color: getTeamColor(t.team),
      rank: 0,
    }
  })

  // Sort by total descending and assign ranks
  withTotals.sort((a, b) => b.total - a.total)
  withTotals.forEach((t, i) => {
    t.rank = i + 1
  })

  return withTotals
}

// ─── Activity helpers used by components ────────────────────────────────────

export function getIndividualDailyTotal(
  p: Participant,
  prefix: 'daily_board' | 'daily_trivia' | 'impromptu_six' | 'steps'
): number {
  return DAYS.reduce(
    (sum, day) => sum + (p[`${prefix}_${day}` as keyof Participant] as number),
    0
  )
}

export function getTeamDailyByDay(
  team: TeamData,
  prefix:
    | 'daily_board'
    | 'daily_trivia'
    | 'impromptu_six'
    | 'step_bonus_daily'
): number[] {
  return DAYS.map(
    (day) => team[`${prefix}_${day}` as keyof TeamData] as number
  )
}

export function getTopIndividuals(
  participants: Participant[],
  scoreFn: (p: Participant) => number,
  limit = 3
): Array<{ name: string; team: string; score: number }> {
  return [...participants]
    .map((p) => ({ name: p.name, team: p.team, score: scoreFn(p) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
