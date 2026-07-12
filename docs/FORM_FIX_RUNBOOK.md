# Fixing the form → data_dashboard_2026 connection

The "Access Point SSP" form (`index.html`) talks to the spreadsheet through a
Google Apps Script **web app** bound to `data_dashboard_2026`. The form sends
six kinds of submissions, and on page load it downloads the participant
registry for the initials + birth-year lookup:

| Direction | Action | Writes to tab |
|---|---|---|
| GET (page load) | — registry download | reads **Participants** |
| POST | `registerParticipant` | **Participants** |
| POST | `logVisit` | **SSP Visits** (+ **Reversals**) |
| POST | `bulkLogVisits` | **SSP Visits** (batch, used by Import tab) |
| POST | `createEvent` | **Events** |
| POST | `logAttendee` | **Event Attendees** |
| POST | `checkIn` | **Check-Ins** |

## The fix

`apps-script/Code.gs` in this repo is a complete replacement backend.
Install steps are in the header comment of that file — short version:

1. `data_dashboard_2026` → **Extensions → Apps Script** → replace `Code.gs`.
2. Make the tab names in `CONFIG.TABS` match the spreadsheet's real tab names.
3. **Deploy → Manage deployments → edit the EXISTING deployment → New
   version.** (A brand-new deployment would change the URL the form uses.)
4. Open the `/exec` URL in a browser: seeing
   `{"ok":true,"participants":[...]}` means the GET side works.
5. Submit a test intake from the form, confirm a row lands in
   **Participants**, then delete the test row.

## How to tell what was broken (for the record)

- **`/exec` URL shows an error page or "Script function not found: doGet"** →
  the deployment is stale or the script was edited without redeploying.
- **URL returns JSON but new submissions don't appear** → tab name mismatch:
  the old script called `getSheetByName('...')` with a name that no longer
  exists (renaming a tab breaks it silently). The new backend auto-creates
  missing tabs, so this failure mode is gone — but check `CONFIG.TABS` so it
  writes to the tabs you expect rather than creating fresh ones.
- **Lookup always says "No match found"** → GET side broken or Participants
  headers changed. New backend reads by header names: `Participant ID`,
  `Initials`, `Birth Year`.
- **Rows land in the wrong columns** → old script wrote by fixed column
  position after someone inserted a column. New backend writes by header
  name, so column order no longer matters.

## Privacy notes (deliberate design, don't undo)

- **SSP Visits stores the anonymous Participant ID only.** Initials and birth
  year live only in the Participants registry tab. The backend enforces this
  even when the Import grid sends initials — it resolves (or creates) the ID
  and discards identifiers from the visit row.
- The web app is deployed "Anyone can access" so the form works without login.
  That means the participant registry (ID + initials + birth year) is readable
  by anyone who has the exact `/exec` URL. That's the existing design and it is
  low-risk (no names, no full DOB), but keep the URL out of public posts, and
  if it ever leaks: Deploy → Manage deployments → Archive, then create a new
  deployment and update `WEB_APP_URL` in `index.html`.

## After it works

- Log 2–3 real-shaped test visits via the Visit Log tab AND one bulk import
  batch — the next SOR reporting cycle depends on both paths.
- The daily `[BACKUP yyyy-mm-dd]` copies of the dashboard keep a safety net;
  once the form is verified, old backups from before the fix can be pruned to
  the two most recent.
