import Papa from 'papaparse'
import type { RawParticipant, RawTeam } from '@/types'

function num(val: string | undefined | null): number {
  if (val == null || val.trim() === '') return 0
  const n = Number(val.trim())
  return isNaN(n) ? 0 : n
}

function str(val: string | undefined | null): string {
  return val?.trim() ?? ''
}

export function parseParticipantsCSV(csv: string): RawParticipant[] {
  const result = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  })

  return result.data
    .map((row) => ({
      name: str(row.name),
      team: str(row.team),
      disc: num(row.disc),
      icebreaker: num(row.icebreaker),
      daily_board_mon: num(row.daily_board_mon),
      daily_board_tue: num(row.daily_board_tue),
      daily_board_wed: num(row.daily_board_wed),
      daily_board_thu: num(row.daily_board_thu),
      daily_board_fri: num(row.daily_board_fri),
      daily_trivia_mon: num(row.daily_trivia_mon),
      daily_trivia_tue: num(row.daily_trivia_tue),
      daily_trivia_wed: num(row.daily_trivia_wed),
      daily_trivia_thu: num(row.daily_trivia_thu),
      daily_trivia_fri: num(row.daily_trivia_fri),
      impromptu_six_mon: num(row.impromptu_six_mon),
      impromptu_six_tue: num(row.impromptu_six_tue),
      impromptu_six_wed: num(row.impromptu_six_wed),
      impromptu_six_thu: num(row.impromptu_six_thu),
      impromptu_six_fri: num(row.impromptu_six_fri),
      steps_mon: num(row.steps_mon),
      steps_tue: num(row.steps_tue),
      steps_wed: num(row.steps_wed),
      steps_thu: num(row.steps_thu),
      steps_fri: num(row.steps_fri),
      virtual_bingo: num(row.virtual_bingo),
      scavenger_hunt: num(row.scavenger_hunt),
      ai_challenge: num(row.ai_challenge),
    }))
    .filter((p) => p.name !== '')
}

export function parseTeamsCSV(csv: string): RawTeam[] {
  const result = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  })

  return result.data
    .map((row) => ({
      team: str(row.team),
      disc: num(row.disc),
      icebreaker: num(row.icebreaker),
      daily_board_mon: num(row.daily_board_mon),
      daily_board_tue: num(row.daily_board_tue),
      daily_board_wed: num(row.daily_board_wed),
      daily_board_thu: num(row.daily_board_thu),
      daily_board_fri: num(row.daily_board_fri),
      daily_trivia_mon: num(row.daily_trivia_mon),
      daily_trivia_tue: num(row.daily_trivia_tue),
      daily_trivia_wed: num(row.daily_trivia_wed),
      daily_trivia_thu: num(row.daily_trivia_thu),
      daily_trivia_fri: num(row.daily_trivia_fri),
      impromptu_six_mon: num(row.impromptu_six_mon),
      impromptu_six_tue: num(row.impromptu_six_tue),
      impromptu_six_wed: num(row.impromptu_six_wed),
      impromptu_six_thu: num(row.impromptu_six_thu),
      impromptu_six_fri: num(row.impromptu_six_fri),
      step_bonus_daily_mon: num(row.step_bonus_daily_mon),
      step_bonus_daily_tue: num(row.step_bonus_daily_tue),
      step_bonus_daily_wed: num(row.step_bonus_daily_wed),
      step_bonus_daily_thu: num(row.step_bonus_daily_thu),
      step_bonus_daily_fri: num(row.step_bonus_daily_fri),
      step_bonus_overall: num(row.step_bonus_overall),
      virtual_bingo: num(row.virtual_bingo),
      scavenger_hunt: num(row.scavenger_hunt),
      ai_challenge: num(row.ai_challenge),
    }))
    .filter((t) => t.team !== '')
}
