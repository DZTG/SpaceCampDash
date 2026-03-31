export interface TeamConfig {
  name: string
  color: string
}

export interface AppConfig {
  eventName: string
  currentDay: string
  sheetIndividualUrl: string
  sheetTeamUrl: string
  teams: TeamConfig[]
}

export const config: AppConfig = {
  eventName: process.env.NEXT_PUBLIC_EVENT_NAME ?? '85SIXTY Space Camp',
  currentDay: process.env.NEXT_PUBLIC_CURRENT_DAY ?? 'Monday',
  sheetIndividualUrl: process.env.NEXT_PUBLIC_SHEET_INDIVIDUAL_URL ?? '',
  sheetTeamUrl: process.env.NEXT_PUBLIC_SHEET_TEAM_URL ?? '',
  teams: [
    {
      name: process.env.NEXT_PUBLIC_TEAM_1 || 'Team Alpha',
      color: process.env.NEXT_PUBLIC_TEAM_1_COLOR || '#6366F1',
    },
    {
      name: process.env.NEXT_PUBLIC_TEAM_2 || 'Team Bravo',
      color: process.env.NEXT_PUBLIC_TEAM_2_COLOR || '#EC4899',
    },
    {
      name: process.env.NEXT_PUBLIC_TEAM_3 || 'Team Charlie',
      color: process.env.NEXT_PUBLIC_TEAM_3_COLOR || '#10B981',
    },
    {
      name: process.env.NEXT_PUBLIC_TEAM_4 || 'Team Delta',
      color: process.env.NEXT_PUBLIC_TEAM_4_COLOR || '#F59E0B',
    },
  ],
}

export function getTeamColor(teamName: string): string {
  return config.teams.find((t) => t.name === teamName)?.color || '#6B7280'
}

export const DAY_NUMBERS: Record<string, number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
}
