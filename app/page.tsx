'use client'

import { useSheetData } from '@/hooks/useSheetData'
import Header from '@/components/Header'
import TeamStandings from '@/components/TeamStandings'
import ActivityBreakdown from '@/components/ActivityBreakdown'
import CrewRankings from '@/components/CrewRankings'
import StepChallenge from '@/components/StepChallenge'
import LoadingSkeleton from '@/components/LoadingSkeleton'

export default function Home() {
  const { individuals, teams, lastUpdated, isLoading, error, refresh, secondsUntilRefresh } =
    useSheetData()

  const hasData = teams.length > 0 && individuals.length > 0

  return (
    <>
      {/* Starfield background */}
      <div className="starfield" aria-hidden="true" />

      <div className="relative z-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {/* Header is always shown */}
          <Header
            lastUpdated={lastUpdated}
            isLoading={isLoading}
            secondsUntilRefresh={secondsUntilRefresh}
            onRefresh={refresh}
          />

          {/* Error state */}
          {error && (
            <div className="glass border border-red-500/30 p-5 text-center space-y-3 animate-fade-in">
              <p className="text-red-400 text-sm font-medium">
                ⚠️ Failed to load scoreboard data
              </p>
              <p className="text-slate-500 text-xs font-mono">{error}</p>
              <p className="text-slate-400 text-xs">
                Make sure your Google Sheet URLs are set in{' '}
                <code className="text-slate-300">.env.local</code> and the tabs are published
                as CSV.
              </p>
              <button
                onClick={refresh}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm text-white transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading skeleton */}
          {isLoading && !hasData && <LoadingSkeleton />}

          {/* Main content */}
          {hasData && (
            <>
              <TeamStandings teams={teams} />
              <ActivityBreakdown individuals={individuals} teams={teams} />
              <CrewRankings individuals={individuals} />
              <StepChallenge individuals={individuals} teams={teams} />
            </>
          )}

          {/* Empty state (data fetched but no rows) */}
          {!isLoading && !error && !hasData && (
            <div className="glass p-12 text-center space-y-3 animate-fade-in">
              <p className="text-4xl">🚀</p>
              <p className="text-white font-semibold text-lg">
                Awaiting Mission Data
              </p>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                No scoreboard data found. Make sure your Google Sheets are published as CSV
                and the URLs are configured in your environment variables.
              </p>
              <button
                onClick={refresh}
                className="mt-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm text-white transition"
              >
                Refresh
              </button>
            </div>
          )}

          {/* Footer */}
          <footer className="text-center text-xs text-slate-700 pb-4">
            85SIXTY Space Camp Scoreboard · Data refreshes every 5 minutes
          </footer>
        </div>
      </div>
    </>
  )
}
