'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Participant, TeamData } from '@/types'
import { parseParticipantsCSV, parseTeamsCSV } from '@/lib/csvParser'
import { computeParticipants, computeTeams } from '@/lib/scoring'
import { config } from '@/lib/config'

const REFRESH_MS = 5 * 60 * 1000 // 5 minutes

export interface UseSheetDataReturn {
  individuals: Participant[]
  teams: TeamData[]
  lastUpdated: Date | null
  isLoading: boolean
  error: string | null
  refresh: () => void
  secondsUntilRefresh: number
}

export function useSheetData(): UseSheetDataReturn {
  const [individuals, setIndividuals] = useState<Participant[]>([])
  const [teams, setTeams] = useState<TeamData[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(REFRESH_MS / 1000)

  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scheduleCountdown = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current)
    setSecondsUntilRefresh(REFRESH_MS / 1000)
    countdownRef.current = setInterval(() => {
      setSecondsUntilRefresh((s) => (s <= 1 ? 0 : s - 1))
    }, 1000)
  }, [])

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const bust = `&_cb=${Date.now()}`
      const [indRes, teamRes] = await Promise.all([
        fetch(config.sheetIndividualUrl + bust, { cache: 'no-store' }),
        fetch(config.sheetTeamUrl + bust, { cache: 'no-store' }),
      ])

      if (!indRes.ok) throw new Error(`Individuals sheet: HTTP ${indRes.status}`)
      if (!teamRes.ok) throw new Error(`Teams sheet: HTTP ${teamRes.status}`)

      const [indCsv, teamCsv] = await Promise.all([indRes.text(), teamRes.text()])

      const rawIndividuals = parseParticipantsCSV(indCsv)
      const rawTeams = parseTeamsCSV(teamCsv)

      setIndividuals(computeParticipants(rawIndividuals))
      setTeams(computeTeams(rawTeams))
      setLastUpdated(new Date())
      scheduleCountdown()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch scoreboard data')
    } finally {
      setIsLoading(false)
    }
  }, [scheduleCountdown])

  // Initial fetch + auto-refresh
  useEffect(() => {
    fetchData()
    refreshTimerRef.current = setInterval(fetchData, REFRESH_MS)
    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [fetchData])

  const refresh = useCallback(() => {
    if (refreshTimerRef.current) clearInterval(refreshTimerRef.current)
    fetchData()
    refreshTimerRef.current = setInterval(fetchData, REFRESH_MS)
  }, [fetchData])

  return { individuals, teams, lastUpdated, isLoading, error, refresh, secondsUntilRefresh }
}
