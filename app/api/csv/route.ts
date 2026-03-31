import { NextRequest, NextResponse } from 'next/server'

const SHEET_URLS: Record<string, string | undefined> = {
  individual: process.env.NEXT_PUBLIC_SHEET_INDIVIDUAL_URL,
  team: process.env.NEXT_PUBLIC_SHEET_TEAM_URL,
}

export async function GET(request: NextRequest) {
  const sheet = request.nextUrl.searchParams.get('sheet')

  if (!sheet || !(sheet in SHEET_URLS)) {
    return NextResponse.json({ error: 'Invalid sheet param' }, { status: 400 })
  }

  const url = SHEET_URLS[sheet]
  if (!url) {
    return NextResponse.json(
      { error: `Sheet URL not configured for: ${sheet}` },
      { status: 500 }
    )
  }

  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) {
      return NextResponse.json(
        { error: `Google Sheets returned HTTP ${res.status}` },
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
      { error: err instanceof Error ? err.message : 'Fetch failed' },
      { status: 502 }
    )
  }
}
