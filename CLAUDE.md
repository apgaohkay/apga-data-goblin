# Access Point SSP — Data Goblin

Harm reduction data collection app for Access Point of Georgia's Syringe Services Program.

## Architecture

- **`index.html`** — single-file web app, deployed via GitHub Pages (or similar)
- **Google Apps Script (`Code.gs`)** — backend, deployed as a web app
- **Google Spreadsheet** (`1D3wbyiGS3QIwg0CwFutj7tpffUZtmRf0P4HKSlitppM`) — data store

The frontend posts JSON to the Apps Script web app URL. The Apps Script reads/writes to the spreadsheet.

## Critical: Apps Script Deployment

**Saved code ≠ live code.** After any change to `Code.gs`, you MUST:
1. Deploy → Manage deployments → pencil icon → Version: New version → Deploy

The web app URL in `index.html` (`WEB_APP_URL`) must match the current active deployment. If behavior suddenly breaks across the board, the URL may be stale — create a new deployment and update the URL.

**Deployment settings:** Execute as: Me / Who has access: Anyone

## Critical: CORS

Apps Script blocks CORS preflight requests. The POST helper must NEVER include a `Content-Type` header — doing so triggers a preflight that kills all form submissions with a network error.

```js
// CORRECT
fetch(WEB_APP_URL, { method: 'POST', body: JSON.stringify(payload) })

// WRONG — breaks everything
fetch(WEB_APP_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: ... })
```

## Critical: Apps Script Response Format

`Code.gs` returns `{ success: true, ... }` — NOT `{ ok: true }`. All response checks must accept both:

```js
if (data.ok || data.success) { ... }
```

## Non-Negotiable Features

These must work at all times. Do not remove or break them:

### 1. Participant Registry Lookup
- The registry loads on page load via `doGet` (GET request to `WEB_APP_URL`)
- Volunteers look up participants by initials + birth year to get their PID
- **This is the most critical feature.** Volunteers cannot do their job without it.
- If lookup breaks, check: (1) deployment is current, (2) GET request reaches the URL, (3) `Participants` sheet tab name matches exactly

### 2. Participant Registration
- Generates a 4-digit PID client-side (checked against local registry to avoid collisions)
- Sends `id` field in the payload — Apps Script uses `data.id` to write to the sheet
- After success, immediately pushes new participant to local `participants` array so the next registration in the same session gets a different PID
- When reloading from sheet after registration, merge fresh data with locally-added entries (the new person may not be in the sheet response yet)

### 3. SSP Visit Log
- Requires a participant to be selected (via lookup, search result, OR manual PID entry)
- Manual PID entry field exists for participants who have their card but aren't findable in search yet
- Submits to `action: 'logVisit'` → writes to 'SSP Visits' sheet tab

### 4. Visit Date
- Always append `T12:00:00` when parsing date strings in Apps Script to avoid UTC midnight → Eastern off-by-one-day bug:
  ```js
  new Date(dateStr + 'T12:00:00')
  ```

## Apps Script: Code.gs Structure

Three actions only (keep it slim):
- `registerParticipant` → writes to 'Participants' sheet
- `logVisit` → writes to 'SSP Visits' sheet via `_appendVisitRow()`
- `bulkLogVisits` → loop over visits, opens spreadsheet ONCE, calls `_appendVisitRow()` per visit

**Sheet tab names must match exactly:** `Participants`, `SSP Visits`

`_appendVisitRow(vSheet, ss, data)` is the single function that writes a visit row. Both `logVisit` and `bulkLogVisits` use it. Do not duplicate this logic.

## Participant Registry: Local State Management

```js
let participants = []; // loaded from sheet on page load
```

After registration: push new entry AND merge with any background sheet reload so collisions are avoided across multiple registrations in one session.

After lookup: the selected participant's ID populates a hidden `#participantId` input that the visit submit reads.

## What Has Been Cut (Do Not Re-Add)

- Events / OEND training tab — moved to a separate form
- Check-in queue — removed
- Reversal detail sheet (Reversals tab) — reversal count lives in SSP Visits row only
- Backup / reconcile scripts — Google Sheets version history is sufficient
- `parseCode`, `applyCode`, `GENDER_MAP`, `RACE_MAP` — dead code, removed

## Manual Reconciliation

If visits land in Raw Submissions but not SSP Visits, run `processRawSubmissions()` from the Apps Script editor toolbar. This is the manual fallback. Clear Raw Submissions rows after running to avoid double-import.

## Naloxone Counts

IM and Nasal: 0, 1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20
(0–4 individual, then counts of 2 up to 20 — participants regularly receive 8–10+ kits)

## Counties Served

Clarke, Oconee, Jackson, Madison, Barrow, Oglethorpe, Elbert, Hart, Franklin, Stephens, Habersham, Rabun, Other
