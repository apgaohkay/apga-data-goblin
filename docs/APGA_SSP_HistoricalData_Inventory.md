# APGA SSP Historical Data Inventory — Pre-Dashboard (thru 2025)

**Purpose:** Inventory of all pre-2026 SSP data files that need to be consolidated into
`APGA_SSP_HistoricalData_PreDashboard_thru2025` before the historical data can feed into
SOR reporting. The dashboard (`data_dashboard_2026` + the Access Point SSP form) went live
in early 2026; everything before that date is "pre-dashboard."

**Owners:** Olive + Riley. Drive moves / tab copies are manual — this doc tells you what to do and in what order.

---

## The target: APGA_SSP_HistoricalData_PreDashboard_thru2025

A single Google Sheet with one tab per data source. Purpose: a read-only reference snapshot that:
- Feeds the SOR Unique Participants count for any period before 2026
- Serves as the audit-trail record if DBHDD asks about pre-2026 visit counts
- Is NOT edited after consolidation — it's a locked archive

**Access:** View-only for everyone except Riley + Olive (matches the naming convention doc's guidance for `APGA_Archive_PreDashboard_SSPData/`).

---

## Coverage timeline (what we know)

| Period | Primary source | Status |
|---|---|---|
| ~2022 | `Intake Responses` (gsheet) | Archive — likely early intake form data |
| Nov 2022–Jan 2023 | `Winder Intakes - Up to 1-28-23` | Archive — Winder location only |
| Nov 2022–Mar 2023 | `winder intakes nov 22 - mar 2` | Archive — overlaps with above; check for duplicates |
| Nov 2022–Dec 2023 | `** SSP Intakes 11/01/22- through 12/29/2023` | Archive — broadest early coverage; **personal gmail owner** |
| 2024 | `Copy of ****2024 NEW Data Collection Log Sheet` | Review — is this a copy or the only copy? |
| 2024 | `Copy of The Real Master 2024 (need jan & Nov-Dec)` | Review — gaps in Jan, Nov, Dec flagged in title |
| 2024 (partial) | `Riley's YES CHEF 2024 Data Collection Log - Copy of SOR FY25 Nov.csv` | Review — likely Nov 2024 only; check if it fills title gap above |
| thru Nov 2024 | `SSP Intakes Log all.csv` | Archive — cumulative CSV export |
| ~2024 | `Intake DB-Grid view (1).csv` | Archive — likely Airtable or similar export |
| Jan 2025 | `Copy of Fillout Results Exported 1/28/25` | Archive — Fillout form export |
| ~2025 | `Copy of SSP Data-2025-MASTER included` | Review — is original still the source of truth? |

---

## Column mapping problem

The pre-dashboard files almost certainly use different column names than `data_dashboard_2026`.
Before anything else, open one representative file from each year and note:

- What fields are captured (initials? DOB? full name?)
- How visit counts are tracked (one row per visit? one row per person?)
- Whether there's a unique participant identifier or just initials+DOB

**Privacy flag:** If any pre-dashboard file contains full names, addresses, or Social Security
numbers — which is possible for 2022-2023 data — do NOT copy that data into the consolidated
archive without first pseudonymizing it. The new system uses anonymous 4-digit Participant IDs.
The crosswalk (initials+birthYear → new anonymous ID) should be built and kept separately, not
embedded in the archive.

---

## Consolidation steps (Olive + Riley)

### Phase 1: Triage the 2024 "copy" files (30 min, with Riley)

These three files are all labeled "copy" but may contain the only surviving copy of 2024 data:

1. **`Copy of The Real Master 2024 (need jan & Nov-Dec)`**
   - Open it. Does it have Jan 2024 and Nov-Dec 2024 data, or are those months blank?
   - Is there a file called `The Real Master 2024` (without "Copy of") anywhere in Drive? If yes, that's the source of truth — this copy can be archived. If no, this IS the real master despite the name.

2. **`Copy of ****2024 NEW Data Collection Log Sheet`**
   - Open it. Is this the same data as the Real Master, or a different format?
   - Search Drive for the original (without "Copy of") to confirm where it is.

3. **`Riley's YES CHEF 2024 Data Collection Log - Copy of SOR FY25 Nov.csv`**
   - Open it. This is probably just November 2024. Does it fill the Nov gap from item 1?

**Decision:** Once you know which 2024 file is the most complete, treat that as the 2024 source of truth. The others are either redundant copies (archive) or gap-fillers (merge the unique rows, then archive).

### Phase 2: Transfer ownership (5 min)

`** SSP Intakes 11/01/22- through 12/29/2023` is owned by a personal Gmail. Before moving it:
- Share → Transfer ownership to the org Google Workspace account
- Or: Export as xlsx → import to a new org-owned sheet → trash the personal-account original

### Phase 3: Create the consolidated archive sheet (1 hour)

Create a new Google Sheet: `APGA_SSP_HistoricalData_PreDashboard_thru2025`

Add one tab per source, in chronological order:

| Tab name | Source file |
|---|---|
| `2022_Intake Responses` | `Intake Responses` gsheet |
| `2022-23_Winder_Nov22-Jan23` | `Winder Intakes - Up to 1-28-23` gsheet |
| `2022-23_Winder_Nov22-Mar23` | `winder intakes nov 22 - mar 2` gsheet |
| `2022-23_AllIntakes_thruDec23` | `** SSP Intakes 11/01/22- through 12/29/2023` |
| `2024_Master` | Best 2024 source (from Phase 1) |
| `2024_AllCSV_thruNov` | `SSP Intakes Log all.csv` |
| `2024_IntakeDB_GridExport` | `Intake DB-Grid view (1).csv` |
| `2025_Jan_Fillout` | `Copy of Fillout Results Exported 1/28/25` |
| `2025_Master` | `Copy of SSP Data-2025-MASTER included` (if no original exists) |

**Do not merge or transform the data** in this step — paste each source as-is into its tab. The raw format is the audit trail. Merging into a single normalized tab is Phase 2 (separate task, requires schema crosswalk).

### Phase 4: Lock down the archive

1. Move the sheet to `APGA_Archive_PreDashboard_SSPData/` folder
2. Set permissions: Editor = Olive + Riley only; Viewer = no broader sharing
3. Add a note to the first tab (a `README` tab) explaining what this file is and that it must not be edited after the archive date

### Phase 5: Move source files to archive folder

Once the consolidated archive is confirmed complete, move each source file to `APGA_Archive_PreDashboard_SSPData/` and delete the three Winder duplicate format files:
- Delete `Winder Intakes - Up to 1-28-23.numbers`
- Delete `Winder Intakes - Up to 1-28-23.csv`

---

## Open questions

1. **Fulcrum exports:** Were the 2023–2024 intakes collected via Fulcrum (mobile data collection)?
   If so, there should be a Fulcrum export ZIP or CSV that's the raw source — it might be inside
   `ZIP_we-sent-back-in-march_DBHDD_SOR-REVIEW` or in a DBHDD review subfolder. If found, it
   should be the spine tab of the archive (most trustworthy source).

2. **Visit counts vs. participant counts:** SOR reporting needs unique participant counts. Do the
   pre-dashboard files track one row per visit (needs dedup for unique count) or one row per
   person (already unique)? This determines whether the SOR summary formula needs adjustment.

3. **Monthly tabs (Jan–May 2026):** `data_dashboard_2026` has Jan–May 2026 monthly tabs with
   visit data but no Participant IDs. These aren't "pre-dashboard" data but they'll need
   backfilled IDs before the SOR counts are fully reliable. Separate task — ask Riley about
   the backfill approach.

---

## After consolidation is done

Update this file with:
- Date consolidated: ___________
- Confirmed by: ___________
- Tab count: ___________
- Date range covered: ___________
- Drive link to archive sheet: ___________
