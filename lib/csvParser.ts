import Papa from 'papaparse'
import type { RawParticipant, RawTeam } from '@/types'

type CsvRow = Record<string, string>

const PARTICIPANT_FIELDS = [
  'name',
  'team',
  'disc',
  'icebreaker',
  'daily_board_mon',
  'daily_board_tue',
  'daily_board_wed',
  'daily_board_thu',
  'daily_board_fri',
  'daily_trivia_mon',
  'daily_trivia_tue',
  'daily_trivia_wed',
  'daily_trivia_thu',
  'daily_trivia_fri',
  'impromptu_six_mon',
  'impromptu_six_tue',
  'impromptu_six_wed',
  'impromptu_six_thu',
  'impromptu_six_fri',
  'steps_mon',
  'steps_tue',
  'steps_wed',
  'steps_thu',
  'steps_fri',
  'virtual_bingo',
  'scavenger_hunt',
  'ai_challenge',
] as const

const TEAM_FIELDS = [
  'team',
  'disc',
  'icebreaker',
  'daily_board_mon',
  'daily_board_tue',
  'daily_board_wed',
  'daily_board_thu',
  'daily_board_fri',
  'daily_trivia_mon',
  'daily_trivia_tue',
  'daily_trivia_wed',
  'daily_trivia_thu',
  'daily_trivia_fri',
  'impromptu_six_mon',
  'impromptu_six_tue',
  'impromptu_six_wed',
  'impromptu_six_thu',
  'impromptu_six_fri',
  'step_bonus_daily_mon',
  'step_bonus_daily_tue',
  'step_bonus_daily_wed',
  'step_bonus_daily_thu',
  'step_bonus_daily_fri',
  'step_bonus_overall',
  'virtual_bingo',
  'scavenger_hunt',
  'ai_challenge',
] as const

function parseCsv(csv: string, requiredHeaders: readonly string[], label: string): CsvRow[] {
  const result = Papa.parse<CsvRow>(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  })

  if (result.errors.length > 0) {
    const firstError = result.errors[0]
    const rowNumber =
      typeof firstError.row === 'number' ? firstError.row + 2 : 'unknown'
    throw new Error(`${label} CSV parse error at row ${rowNumber}: ${firstError.message}`)
  }

  const headers = result.meta.fields ?? []
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header))
  if (missingHeaders.length > 0) {
    throw new Error(
      `${label} CSV is missing required columns: ${missingHeaders.join(', ')}`
    )
  }

  return result.data
}

function num(
  val: string | undefined | null,
  field: string,
  rowNumber: number,
  label: string
): number {
  if (val == null || val.trim() === '') return 0
  const raw = val.trim()
  const n = Number(raw)
  if (Number.isNaN(n)) {
    throw new Error(
      `Invalid numeric value in ${label} CSV at row ${rowNumber}, column "${field}": "${raw}"`
    )
  }
  return n
}

function requiredText(
  val: string | undefined | null,
  field: string,
  rowNumber: number,
  label: string
): string {
  const text = val?.trim() ?? ''
  if (text === '') {
    throw new Error(`Missing "${field}" value in ${label} CSV at row ${rowNumber}`)
  }
  return text
}

export function parseParticipantsCSV(csv: string): RawParticipant[] {
  const rows = parseCsv(csv, PARTICIPANT_FIELDS, 'Individuals')

  return rows.map((row, index) => {
    const rowNumber = index + 2
    return {
      id: `participant-${rowNumber}`,
      name: requiredText(row.name, 'name', rowNumber, 'Individuals'),
      team: requiredText(row.team, 'team', rowNumber, 'Individuals'),
      disc: num(row.disc, 'disc', rowNumber, 'Individuals'),
      icebreaker: num(row.icebreaker, 'icebreaker', rowNumber, 'Individuals'),
      daily_board_mon: num(row.daily_board_mon, 'daily_board_mon', rowNumber, 'Individuals'),
      daily_board_tue: num(row.daily_board_tue, 'daily_board_tue', rowNumber, 'Individuals'),
      daily_board_wed: num(row.daily_board_wed, 'daily_board_wed', rowNumber, 'Individuals'),
      daily_board_thu: num(row.daily_board_thu, 'daily_board_thu', rowNumber, 'Individuals'),
      daily_board_fri: num(row.daily_board_fri, 'daily_board_fri', rowNumber, 'Individuals'),
      daily_trivia_mon: num(row.daily_trivia_mon, 'daily_trivia_mon', rowNumber, 'Individuals'),
      daily_trivia_tue: num(row.daily_trivia_tue, 'daily_trivia_tue', rowNumber, 'Individuals'),
      daily_trivia_wed: num(row.daily_trivia_wed, 'daily_trivia_wed', rowNumber, 'Individuals'),
      daily_trivia_thu: num(row.daily_trivia_thu, 'daily_trivia_thu', rowNumber, 'Individuals'),
      daily_trivia_fri: num(row.daily_trivia_fri, 'daily_trivia_fri', rowNumber, 'Individuals'),
      impromptu_six_mon: num(
        row.impromptu_six_mon,
        'impromptu_six_mon',
        rowNumber,
        'Individuals'
      ),
      impromptu_six_tue: num(
        row.impromptu_six_tue,
        'impromptu_six_tue',
        rowNumber,
        'Individuals'
      ),
      impromptu_six_wed: num(
        row.impromptu_six_wed,
        'impromptu_six_wed',
        rowNumber,
        'Individuals'
      ),
      impromptu_six_thu: num(
        row.impromptu_six_thu,
        'impromptu_six_thu',
        rowNumber,
        'Individuals'
      ),
      impromptu_six_fri: num(
        row.impromptu_six_fri,
        'impromptu_six_fri',
        rowNumber,
        'Individuals'
      ),
      steps_mon: num(row.steps_mon, 'steps_mon', rowNumber, 'Individuals'),
      steps_tue: num(row.steps_tue, 'steps_tue', rowNumber, 'Individuals'),
      steps_wed: num(row.steps_wed, 'steps_wed', rowNumber, 'Individuals'),
      steps_thu: num(row.steps_thu, 'steps_thu', rowNumber, 'Individuals'),
      steps_fri: num(row.steps_fri, 'steps_fri', rowNumber, 'Individuals'),
      virtual_bingo: num(row.virtual_bingo, 'virtual_bingo', rowNumber, 'Individuals'),
      scavenger_hunt: num(row.scavenger_hunt, 'scavenger_hunt', rowNumber, 'Individuals'),
      ai_challenge: num(row.ai_challenge, 'ai_challenge', rowNumber, 'Individuals'),
    }
  })
}

export function parseTeamsCSV(csv: string): RawTeam[] {
  const rows = parseCsv(csv, TEAM_FIELDS, 'Teams')

  return rows.map((row, index) => {
    const rowNumber = index + 2
    return {
      team: requiredText(row.team, 'team', rowNumber, 'Teams'),
      disc: num(row.disc, 'disc', rowNumber, 'Teams'),
      icebreaker: num(row.icebreaker, 'icebreaker', rowNumber, 'Teams'),
      daily_board_mon: num(row.daily_board_mon, 'daily_board_mon', rowNumber, 'Teams'),
      daily_board_tue: num(row.daily_board_tue, 'daily_board_tue', rowNumber, 'Teams'),
      daily_board_wed: num(row.daily_board_wed, 'daily_board_wed', rowNumber, 'Teams'),
      daily_board_thu: num(row.daily_board_thu, 'daily_board_thu', rowNumber, 'Teams'),
      daily_board_fri: num(row.daily_board_fri, 'daily_board_fri', rowNumber, 'Teams'),
      daily_trivia_mon: num(row.daily_trivia_mon, 'daily_trivia_mon', rowNumber, 'Teams'),
      daily_trivia_tue: num(row.daily_trivia_tue, 'daily_trivia_tue', rowNumber, 'Teams'),
      daily_trivia_wed: num(row.daily_trivia_wed, 'daily_trivia_wed', rowNumber, 'Teams'),
      daily_trivia_thu: num(row.daily_trivia_thu, 'daily_trivia_thu', rowNumber, 'Teams'),
      daily_trivia_fri: num(row.daily_trivia_fri, 'daily_trivia_fri', rowNumber, 'Teams'),
      impromptu_six_mon: num(
        row.impromptu_six_mon,
        'impromptu_six_mon',
        rowNumber,
        'Teams'
      ),
      impromptu_six_tue: num(
        row.impromptu_six_tue,
        'impromptu_six_tue',
        rowNumber,
        'Teams'
      ),
      impromptu_six_wed: num(
        row.impromptu_six_wed,
        'impromptu_six_wed',
        rowNumber,
        'Teams'
      ),
      impromptu_six_thu: num(
        row.impromptu_six_thu,
        'impromptu_six_thu',
        rowNumber,
        'Teams'
      ),
      impromptu_six_fri: num(
        row.impromptu_six_fri,
        'impromptu_six_fri',
        rowNumber,
        'Teams'
      ),
      step_bonus_daily_mon: num(
        row.step_bonus_daily_mon,
        'step_bonus_daily_mon',
        rowNumber,
        'Teams'
      ),
      step_bonus_daily_tue: num(
        row.step_bonus_daily_tue,
        'step_bonus_daily_tue',
        rowNumber,
        'Teams'
      ),
      step_bonus_daily_wed: num(
        row.step_bonus_daily_wed,
        'step_bonus_daily_wed',
        rowNumber,
        'Teams'
      ),
      step_bonus_daily_thu: num(
        row.step_bonus_daily_thu,
        'step_bonus_daily_thu',
        rowNumber,
        'Teams'
      ),
      step_bonus_daily_fri: num(
        row.step_bonus_daily_fri,
        'step_bonus_daily_fri',
        rowNumber,
        'Teams'
      ),
      step_bonus_overall: num(
        row.step_bonus_overall,
        'step_bonus_overall',
        rowNumber,
        'Teams'
      ),
      virtual_bingo: num(row.virtual_bingo, 'virtual_bingo', rowNumber, 'Teams'),
      scavenger_hunt: num(row.scavenger_hunt, 'scavenger_hunt', rowNumber, 'Teams'),
      ai_challenge: num(row.ai_challenge, 'ai_challenge', rowNumber, 'Teams'),
    }
  })
}
