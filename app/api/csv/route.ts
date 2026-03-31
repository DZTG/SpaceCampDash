import { NextRequest, NextResponse } from 'next/server'

// URLs hardcoded as primary source — not secrets, public read-only Google Sheets.
// Env vars override these if set.
const HARDCODED_URLS: Record<string, string> = {
  individual:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5eDbjpSUhG7oTlEobgfj9RZxizRB6h5mcInZu8oIL0x6h3X8wSn9mpDWmdUqDhMscZy_lGv6Ih8Nx/pub?gid=1949849097&single=true&output=csv',
  team: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5eDbjpSUhG7oTlEobgfj9RZxizRB6h5mcInZu8oIL0x6h3X8wSn9mpDWmdUqDhMscZy_lGv6Ih8Nx/pub?gid=0&single=true&output=csv',
}

export async function GET(request: NextRequest) {
  const sheet = request.nextUrl.searchParams.get('sheet')

  if (!sheet || !(sheet in HARDCODED_URLS)) {
    return NextResponse.json(
      { error: `Invalid sheet param: "${sheet}". Must be "individual" or "team".` },
      { status: 400 }
    )
  }

  // Env var overrides hardcoded URL if present
  const envKey =
    sheet === 'individual'
      ? process.env.NEXT_PUBLIC_SHEET_INDIVIDUAL_URL
      : process.env.NEXT_PUBLIC_SHEET_TEAM_URL

  const url = (envKey ?? '').trim() || HARDCODED_URLS[sheet]

  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SpaceCampDash/1.0)' },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Google Sheets returned HTTP ${res.status} for sheet: ${sheet}` },
        { status: res.status }
      )
    }

    const csv = await res.text()
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Fetch failed', url },
      { status: 502 }
    )
  }
}
