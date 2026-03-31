# 🚀 85SIXTY Space Camp — Mission Scoreboard

A live, auto-refreshing team engagement scoreboard built with Next.js, Tailwind CSS, and Recharts. Data is pulled directly from two Google Sheets tabs published as public CSV — no API key or backend required.

---

## Table of Contents

1. [Google Sheet Setup](#1-google-sheet-setup)
2. [Publish Tabs as CSV](#2-publish-tabs-as-csv)
3. [Configure Environment Variables](#3-configure-environment-variables)
4. [Run Locally](#4-run-locally)
5. [Deploy to Vercel](#5-deploy-to-vercel)
6. [Updating the Current Day](#6-updating-the-current-day)
7. [Daily Scorekeeper Instructions](#7-daily-scorekeeper-instructions)

---

## 1. Google Sheet Setup

Create a single Google Sheet with **two tabs** named exactly as shown below.

### Tab 1: `scores_individual`

Row 1 must be the header row with these exact column names (case-sensitive, lowercase with underscores):

| Column | Type | Description |
|---|---|---|
| `name` | text | Participant's full name |
| `team` | text | Must exactly match one of your `NEXT_PUBLIC_TEAM_1`–`TEAM_4` values |
| `disc` | 0 or 1 | Completed DISC assessment |
| `icebreaker` | 0 or 1 | Participated in icebreaker |
| `daily_board_mon` | 0 or 1 | Daily board — Monday |
| `daily_board_tue` | 0 or 1 | Daily board — Tuesday |
| `daily_board_wed` | 0 or 1 | Daily board — Wednesday |
| `daily_board_thu` | 0 or 1 | Daily board — Thursday |
| `daily_board_fri` | 0 or 1 | Daily board — Friday |
| `daily_trivia_mon` | integer | Trivia points — Monday |
| `daily_trivia_tue` | integer | Trivia points — Tuesday |
| `daily_trivia_wed` | integer | Trivia points — Wednesday |
| `daily_trivia_thu` | integer | Trivia points — Thursday |
| `daily_trivia_fri` | integer | Trivia points — Friday |
| `impromptu_six_mon` | 0 or 1 | Impromptu Six attended — Monday |
| `impromptu_six_tue` | 0 or 1 | Impromptu Six attended — Tuesday |
| `impromptu_six_wed` | 0 or 1 | Impromptu Six attended — Wednesday |
| `impromptu_six_thu` | 0 or 1 | Impromptu Six attended — Thursday |
| `impromptu_six_fri` | 0 or 1 | Impromptu Six attended — Friday |
| `steps_mon` | integer | Raw step count — Monday |
| `steps_tue` | integer | Raw step count — Tuesday |
| `steps_wed` | integer | Raw step count — Wednesday |
| `steps_thu` | integer | Raw step count — Thursday |
| `steps_fri` | integer | Raw step count — Friday |
| `virtual_bingo` | integer | Points from Virtual Bingo |
| `scavenger_hunt` | integer | Points from Scavenger Hunt |
| `ai_challenge` | integer | Points from AI Challenge |

> ⚠️ Do **not** add a `total` column — the dashboard computes totals client-side.

---

### Tab 2: `scores_team`

Row 1 must be the header row. One row per team (4 rows total).

| Column | Type | Description |
|---|---|---|
| `team` | text | Must exactly match `NEXT_PUBLIC_TEAM_1`–`TEAM_4` |
| `disc` | integer | Sum of member DISC completions |
| `icebreaker` | integer | Sum of member icebreaker completions |
| `daily_board_mon` – `daily_board_fri` | integer | Sum of member board points per day |
| `daily_trivia_mon` – `daily_trivia_fri` | integer | Sum of member trivia points per day |
| `impromptu_six_mon` – `impromptu_six_fri` | integer | Sum of member Impromptu Six points per day |
| `step_bonus_daily_mon` – `step_bonus_daily_fri` | 0 or 2 | 2 if this team had highest combined steps that day, else 0 |
| `step_bonus_overall` | 0 or 5 | 5 if this team had highest combined steps for the full week, else 0 |
| `virtual_bingo` | integer | Team's Virtual Bingo points |
| `scavenger_hunt` | integer | Team's Scavenger Hunt points |
| `ai_challenge` | integer | Team's AI Challenge points |

> ⚠️ Do **not** add a `total` column.

---

## 2. Publish Tabs as CSV

You must publish **each tab separately** to get two CSV URLs.

**For `scores_individual`:**
1. Open your Google Sheet
2. Click **File → Share → Publish to web**
3. In the first dropdown, select the **`scores_individual`** tab
4. In the second dropdown, select **Comma-separated values (.csv)**
5. Click **Publish** and copy the URL

**For `scores_team`:**
1. Repeat the same process, but select the **`scores_team`** tab
2. Copy that URL separately

The URLs will look like:
```
https://docs.google.com/spreadsheets/d/e/XXXX/pub?gid=YYYY&single=true&output=csv
```

> 📝 After publishing, Google may take up to 5 minutes to reflect new edits in the CSV output.

---

## 3. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and set:

```env
NEXT_PUBLIC_SHEET_INDIVIDUAL_URL=<paste scores_individual CSV URL>
NEXT_PUBLIC_SHEET_TEAM_URL=<paste scores_team CSV URL>

NEXT_PUBLIC_EVENT_NAME=85SIXTY Space Camp
NEXT_PUBLIC_CURRENT_DAY=Monday

NEXT_PUBLIC_TEAM_1=Team Alpha
NEXT_PUBLIC_TEAM_2=Team Bravo
NEXT_PUBLIC_TEAM_3=Team Charlie
NEXT_PUBLIC_TEAM_4=Team Delta

NEXT_PUBLIC_TEAM_1_COLOR=#6366F1
NEXT_PUBLIC_TEAM_2_COLOR=#EC4899
NEXT_PUBLIC_TEAM_3_COLOR=#10B981
NEXT_PUBLIC_TEAM_4_COLOR=#F59E0B
```

> ⚠️ **Team names must exactly match** the `team` column values in both Google Sheets tabs (including capitalization and spaces).

---

## 4. Run Locally

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Deploy to Vercel

1. Push this repo to GitHub (or GitLab / Bitbucket)
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. In **Environment Variables**, add all the `NEXT_PUBLIC_*` variables from your `.env.local`
4. Click **Deploy**

Vercel will automatically rebuild and redeploy when you push new commits.

---

## 6. Updating the Current Day

The `NEXT_PUBLIC_CURRENT_DAY` variable controls the "Day N — Weekday" badge in the header.

**Option A — Vercel dashboard (requires redeploy):**
1. Go to your project in the Vercel dashboard
2. **Settings → Environment Variables**
3. Edit `NEXT_PUBLIC_CURRENT_DAY` (e.g., change `Monday` → `Tuesday`)
4. Go to **Deployments** → click the three-dot menu on the latest deployment → **Redeploy**

**Option B — Vercel CLI (faster):**
```bash
vercel env rm NEXT_PUBLIC_CURRENT_DAY production
vercel env add NEXT_PUBLIC_CURRENT_DAY production
# enter "Tuesday" (or whatever day) when prompted
vercel --prod
```

> 💡 Since this variable is baked into the static build (`NEXT_PUBLIC_`), a redeploy is required for changes to take effect. The redeploy typically takes about 60 seconds on Vercel.

---

## 7. Daily Scorekeeper Instructions

### Start of day
- Update `NEXT_PUBLIC_CURRENT_DAY` in Vercel to today's day name and redeploy

### Throughout the day (update in Google Sheets)

**scores_individual tab:**
- Set `disc` = 1 for anyone who completed the DISC assessment
- Set `icebreaker` = 1 for anyone who participated
- Set `daily_board_<day>` = 1 (e.g., `daily_board_mon`) for everyone who completed the daily board that day
- Enter trivia points in `daily_trivia_<day>` for each participant
- Set `impromptu_six_<day>` = 1 for attendees of that day's Impromptu Six meeting
- Enter raw step counts in `steps_<day>` for each participant (just the number, e.g., 8432)
- Enter `virtual_bingo`, `scavenger_hunt`, `ai_challenge` points as events complete

**scores_team tab:**
- Update the team-level columns to match the sums (or enter team-specific scores for bingo, scavenger hunt, AI challenge)
- For `step_bonus_daily_<day>`: enter `2` for the team with the highest combined steps that day, `0` for all others
- At end of week, enter `5` for `step_bonus_overall` for the winning team

> ✅ The dashboard will pick up your changes within ~5 minutes (Google's CSV publish delay) and auto-refreshes every 5 minutes. Participants can also hit **Refresh** for an instant update.

---

## Scoring Reference

| Activity | Individual | Team |
|---|---|---|
| DISC Assessment | 1 pt (completion) | sum of members |
| Icebreaker | 1 pt (completion) | sum of members |
| Daily Board | 1 pt/day × 5 days | sum of members/day |
| Daily Trivia | variable/day | sum of members/day |
| Impromptu Six | 1 pt/meeting × 5 | sum of members/day |
| Virtual Bingo | variable | from sheet |
| Scavenger Hunt | variable | from sheet |
| AI Challenge | variable | from sheet |
| Step Challenge (daily) | 1 pt — top stepper/day | 2 pts — top team/day |
| Step Challenge (overall) | 2 pts — top cumulative | 5 pts — top team overall |

Individual step bonuses are computed automatically by the dashboard from raw step data — no manual entry needed in `scores_individual`.
