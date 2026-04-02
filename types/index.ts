export interface RawParticipant {
  id: string
  name: string
  team: string
  disc: number
  icebreaker: number
  daily_board_mon: number
  daily_board_tue: number
  daily_board_wed: number
  daily_board_thu: number
  daily_board_fri: number
  daily_trivia_mon: number
  daily_trivia_tue: number
  daily_trivia_wed: number
  daily_trivia_thu: number
  daily_trivia_fri: number
  impromptu_six_mon: number
  impromptu_six_tue: number
  impromptu_six_wed: number
  impromptu_six_thu: number
  impromptu_six_fri: number
  steps_mon: number
  steps_tue: number
  steps_wed: number
  steps_thu: number
  steps_fri: number
  virtual_bingo: number
  scavenger_hunt: number
  ai_challenge: number
}

export interface Participant extends RawParticipant {
  stepBonusDaily: number
  stepBonusOverall: number
  total: number
}

export interface RawTeam {
  team: string
  disc: number
  icebreaker: number
  daily_board_mon: number
  daily_board_tue: number
  daily_board_wed: number
  daily_board_thu: number
  daily_board_fri: number
  daily_trivia_mon: number
  daily_trivia_tue: number
  daily_trivia_wed: number
  daily_trivia_thu: number
  daily_trivia_fri: number
  impromptu_six_mon: number
  impromptu_six_tue: number
  impromptu_six_wed: number
  impromptu_six_thu: number
  impromptu_six_fri: number
  step_bonus_daily_mon: number
  step_bonus_daily_tue: number
  step_bonus_daily_wed: number
  step_bonus_daily_thu: number
  step_bonus_daily_fri: number
  step_bonus_overall: number
  virtual_bingo: number
  scavenger_hunt: number
  ai_challenge: number
}

export interface TeamData extends RawTeam {
  total: number
  color: string
  rank: number
}

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri'
export const DAYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri']
export const DAY_LABELS: Record<DayKey, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
}

export const RANK_MEDALS: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
}
