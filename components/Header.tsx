'use client'

import { useState } from 'react'
import { config, DAY_NUMBERS } from '@/lib/config'

interface HeaderProps {
  lastUpdated: Date | null
  isLoading: boolean
  secondsUntilRefresh: number
  onRefresh: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function InfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="glass relative z-10 max-w-lg w-full p-6 space-y-4 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">How are scores updated?</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
          <p>
            <span className="text-white font-semibold">1. The scorekeeper</span> enters
            activity completions and points directly into a Google Sheet — one tab for
            individual scores, one for team-level scores.
          </p>
          <p>
            <span className="text-white font-semibold">2. Google Sheets</span> publishes
            each tab as a public CSV file (via File → Share → Publish to web). No API key
            or login required.
          </p>
          <p>
            <span className="text-white font-semibold">3. This dashboard</span> fetches
            both CSV files directly in your browser, parses them, computes all totals
            (including step-challenge bonuses), and displays the results — all client-side.
          </p>
          <p>
            <span className="text-white font-semibold">4. Refresh cadence:</span> data
            auto-refreshes every 5 minutes. Use the Refresh button for an instant update.
          </p>
          <div className="glass p-3 text-xs text-slate-400">
            Note: Google Sheets may take up to 5 minutes to propagate changes to the
            published CSV after the scorekeeper saves the file.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Header({
  lastUpdated,
  isLoading,
  secondsUntilRefresh,
  onRefresh,
}: HeaderProps) {
  const [showInfo, setShowInfo] = useState(false)

  const isLive = lastUpdated
    ? Date.now() - lastUpdated.getTime() < 10 * 60 * 1000
    : false

  const dayNumber = DAY_NUMBERS[config.currentDay] ?? 1
  const dayEmojis = ['🌑', '🌒', '🌓', '🌔', '🌕']

  return (
    <>
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}

      <header className="glass p-6 md:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Title */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              🚀 {config.eventName}
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-medium tracking-widest uppercase">
              Mission Scoreboard
            </p>
          </div>

          {/* Day badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="glass px-4 py-2 text-sm font-semibold text-slate-200 whitespace-nowrap">
              {dayEmojis[dayNumber - 1]} Day {dayNumber} —{' '}
              <span className="text-white">{config.currentDay}</span>
            </span>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          {/* Live indicator */}
          {isLive && !isLoading && (
            <div className="flex items-center gap-1.5">
              <div className="live-dot" />
              <span className="text-emerald-400 font-medium">Live</span>
            </div>
          )}

          {/* Last updated */}
          {lastUpdated && (
            <span>
              Updated{' '}
              {lastUpdated.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          )}

          {!isLoading && lastUpdated && (
            <span className="text-slate-500">•</span>
          )}

          {/* Countdown */}
          {!isLoading && lastUpdated && (
            <span>
              Refreshing in{' '}
              <span className="text-slate-300 font-mono font-medium">
                {formatTime(secondsUntilRefresh)}
              </span>
            </span>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Info button */}
          <button
            onClick={() => setShowInfo(true)}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            title="How are scores updated?"
          >
            <span className="text-base">ℹ️</span>
            <span className="hidden sm:inline">How scores work</span>
          </button>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                       bg-white/10 hover:bg-white/15 border border-white/10
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span className={isLoading ? 'animate-spin inline-block' : ''}>
              {isLoading ? '⏳' : '🔄'}
            </span>
            {isLoading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
      </header>
    </>
  )
}
