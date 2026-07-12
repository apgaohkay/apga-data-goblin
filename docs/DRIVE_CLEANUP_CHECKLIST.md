# APGA Drive Cleanup Checklist — Phase 1 (July 2026)

Source: GoogleDrive_Triage_May2026. This is the **click-through execution list** for Olive and Riley — the Drive connector doesn't have delete/move/rename tools, so these are manual steps, but they're small. Each one should take 5–10 seconds in Drive.

---

## DELETE (safe to do right now — all confirmed duplicates or shortcuts)

These files add zero information. They're copies and root-level shortcuts that clutter the view and create confusion about which file is real.

| File | Location | Why |
|---|---|---|
| `Copy of AnnexD_March2026_FY26_SOR_AccessPointofGeorgia.docx` | My Drive (root) | Duplicate of the filed March Annex D |
| `FY26_03_AnnexD_AccessPointofGeorgia.docx` *(shortcut)* | My Drive (root) | Shortcut — pin the folder instead |
| `SOR_Payroll_Details_DBHDD_REVIEW.xlsx` *(shortcut)* | My Drive (root) | Shortcut cluttering root |
| `SORFY25-26_GrantPeriod_Reconciliation` *(shortcut)* | My Drive (root) | Shortcut cluttering root |
| `AH_SOR_Invoices_Reconciliation` *(shortcut)* | My Drive (root) | Shortcut cluttering root |

**How to bulk-delete shortcuts from root:** In Drive, switch to list view, sort by Type → right-click each shortcut → Remove. Or select all shortcuts at once and trash together.

**Additional confirmed deletes (other sections):**

| File | Location | Why |
|---|---|---|
| `5.1 Administrative Policy & Procedure (PDF)` | Policy subfolder | Older version, superseded by live gdoc |
| `5.3 CONFLICTS OF INTEREST POLICY (1).pdf` *(Olive's copy)* | Olive's policies subfolder | Duplicate — Riley's copy in her subfolder is the original |
| `5.3 CONFLICTS OF INTEREST POLICY (1).pdf` *(Jasmine's copy)* | Jasmine's folder | Second duplicate of same file |
| `Recordkeeping Policy- ... .docx` *(Olive's copy)* | Olive's policies subfolder | Duplicate — Jasmine's copy is the original |
| `Naloxone_Safe_Yet_Hard_to_Access_V1.mp4` *(Jan 30 upload)* | Media folder | Same file uploaded twice 2 days apart — Jan 28 version is the original |
| `24-25 Gen Liab-HNO Auto-Prof Liab policy.pdf` | My Drive (root) | Same file is in proper insurance subfolder — delete root copy |
| `olive's Copy of JWCo. Proportional Type Worksheet` | My Drive (root) | Second copy of a design worksheet unrelated to APGA compliance |
| `restored Copy of Inventory Master` *(SHORTCUT)* | Operations folder | Shortcut to a "Copy of" file — pin the folder instead |
| `Copy of The Real Master 2024` *(SHORTCUT)* | Operations folder | Shortcut to a copy — inception-level redundancy |
| `MASTER: Budget Spreadsheet` *(SHORTCUT)* | Operations folder | Shortcut to Riley's master budget — pin folder or use Starred |
| `Zip sent to DBHDD before Exit Conference` *(SHORTCUT)* | My Drive (root) | Old shortcut — the real ZIP is in review subfolder |
| `2020_03_20-Payroll-check-Riley.pdf` | My Drive (root) | Same file is in `02 PAYROLL` folder — delete root duplicate |

---

## ARCHIVE (move to the appropriate archive subfolder)

| File | Current location | Move to | Notes |
|---|---|---|---|
| `SOR_Payroll_Details_DBHDD_REVIEW.xlsx` | `01_Budget_Plan_Payroll` folder | `APGA_Archive_SOR_FY25/` or similar | Older version superseded by `SOR_Payroll_Details_AUDIT_READY` |
| `[exported 3/2/26] WORKSHEETS_DBHDD_SOR_REVIEW.xlsx` | My Drive (root) | `APGA_Archive_SOR_FY25/` | Point-in-time March export — keep for audit trail, not for editing |

Rename on archive: `APGA_SOR_PayrollDetails_DBHDD_Review_2026-04.xlsx` and `APGA_SOR_WorksheetExport_DBHDD_2026-03-02.xlsx`.

---

## MOVE

| File | From | To | New name |
|---|---|---|---|
| `2026-05-22-Timesheet_Lopez.docx` | My Drive (root) | HR/Timesheets folder (create if needed) | `APGA_HR_Timesheet_Lopez_2026-05-22.docx` |

---

## ARCHIVE (additional items from full triage)

These are confirmed historical files that should be moved to an appropriate archive subfolder.
No data loss — just organizing so working Drive is clean.

| File | Current location | Move to | Notes |
|---|---|---|---|
| `OEND Training Signups (old sign up bucket from website)` | My Drive (root) | `z_ARCHIVE/` or `APGA_Archive_OEND/` | Says "old" in the title — historical signup data |
| `Olive & Monica's Drafts Budget Justification` | My Drive (root) | `APGA_Archive_SOR_FY25/` | Draft doc — was this finalized? If finalized: delete. If not and no final exists: archive |
| `Naloxone orders - batch post chaos` | My Drive (root) | `z_ARCHIVE/` | Historical order tracking |
| `Liberating Naloxone Webinar Notes - November 29, 2023` | My Drive (root) | `z_ARCHIVE/` | Old webinar notes |
| `[naloxone] GOCAT Application Dummy Doc` | My Drive (root) | `z_ARCHIVE/` | Old application draft |
| `Copy of SPP: Types of fiscal sponsorship` | My Drive (root) | `z_ARCHIVE/` | Reference doc, not active |
| `Administrative Policy & Procedure-(MASTER-6/'24)` | Policy folder | Archive subfolder | Superseded by 6/25 version — keep 1 year back |

Rename on archive using naming convention: e.g. `APGA_OEND_TrainingSignups_Pre2026.xlsx`.

---

## MOVE (additional)

| File | From | To | Notes |
|---|---|---|---|
| `2026_03_20-Payroll-check-Riley.pdf` | My Drive (root) | `02 PAYROLL` folder | Duplicate location — keep the subfolder copy, trash root copy |

---

## REVIEW — needs Olive's eyes before action

These files are ambiguous (status Unknown in triage). Open each, compare with the source-of-truth version, and decide: keep in place / merge / delete / archive.

| File | Location | Question |
|---|---|---|
| `FINAL SOR FY25 Reporting for DBHDd` | My Drive (root) | Is this the same content as `FY25 SOR YearEnd Reporting - Access Point Georgia` in SOR Reports folder? If yes → delete the root copy, the YearEnd version in the folder is the real one. |
| `IN PROGRESS: State Opioid Response (SOR).docx` | My Drive (root) | Last modified April 2025 — over a year stale. Archive to `z_ARCHIVE/` or delete? |
| `not done SOR_GrantPeriod_Reconciliation_AUDIT_READY` | My Drive (root) | The "not done" prefix is a flag. Is this still being worked on, or is `SORFY25-26_GrantPeriod_Reconciliation` the live version? If live version is current → rename/delete this one. |
| `Supporting_SOR_Payroll_Details_DBHDD_Review.xlsx` | Review subfolder | Same data as `SOR_Payroll_Details_AUDIT_READY`? If redundant → archive. |
| `Supporting_SOR_GrantPeriod_Reconciliation_FY25-26.xlsx` | Review subfolder | Same data as `SORFY25-26_GrantPeriod_Reconciliation`? If redundant → archive. |
| `[temp. from sheena]Contract_Tracking_Template_Fixed_DBHDD` | My Drive (root) | Was this merged into your main tracker? If yes → delete. If no → rename without "temp. from sheena" prefix and file it. |
| `Copy of Personal Timesheet` | My Drive (root) | Old gsheet, last modified Feb 2025. Whose is it? If no longer needed → delete. |
| `OEND - casual chat with` | My Drive (root) | Incomplete title — looks like an abandoned notes doc. Archive or delete? |
| `Overdose Prevention & Naloxone Administration Training` *(SHORTCUT)* | My Drive (root) | Old shortcut from 2024. Does the target still exist? If yes → keep shortcut or use Starred. If target is gone → trash the shortcut. |
| `notion-training-structure.txt` | My Drive (root) | Notion export from Nov 2024. Was this structure implemented? If yes → archive. If abandoned → delete. |
| `Copy of REVERSAL Log` *(gform)* | My Drive (root) | Copy of a Google Form. Is the original reversal log form still active? If yes → delete this copy. If original is gone → decide if this copy should replace it. |
| `Ttax compliance Form.docx` | My Drive (root) | Tax compliance form. Was this for a one-time filing? If filed and done → archive. |
| `Copy of JWCo. Proportional Type Worksheet` | My Drive (root) | Design worksheet unrelated to APGA ops. Delete or archive? |
| `Copy of Financial Transactions / Reports 2024` *(SHORTCUT)* | Subfolder | Shortcut to financial reports. Does the target still exist? If yes → verify it's in the right folder. |
| `Copy of Interview Questions - MASTER` *(SHORTCUT)* | Operations folder | HR shortcut. Is the original in a logical place already? If yes → verify target, then decide if shortcut adds value or clutters. |
| `restored Copy of Inventory Master 6/20/2025` | My Drive (root) | "Restored" copy — is this the active inventory? If yes → rename per convention. If there's a newer version → archive this one. |
| `MASTER - Procurement Policy` *(SHORTCUT)* | Operations folder | Shortcut to procurement policy. Verify target still exists. |

---

## SSP DATA FILES — two steps

**Step 1: Safe deletes (do now) — Winder intake duplicates**

Same data was exported in three formats; keep only the gsheet version as the reference.

| File | Location | Why |
|---|---|---|
| `Winder Intakes - Up to 1-28-23.numbers` | Secure Drive | Same data as the gsheet — Apple Numbers format, redundant |
| `Winder Intakes - Up to 1-28-23.csv` | Secure Drive | Same data as the gsheet — CSV export, redundant |

**Step 2: Consolidation (requires coordination with Riley)**

Do NOT delete or move the files below until `APGA_SSP_HistoricalData_PreDashboard_thru2025` is confirmed complete. See `docs/APGA_SSP_HistoricalData_Inventory.md` for the full data inventory and consolidation instructions.

Files to consolidate, in order of coverage period:

| File | Type | Period | Status | Action after consolidation |
|---|---|---|---|---|
| `Intake Responses` | gsheet | ~2022 | Archive | Move to `APGA_Archive_PreDashboard_SSPData/` |
| `** SSP Intakes 11/01/22- through 12/29/2023` | gsheet | Nov 2022–Dec 2023 | Archive | Move to archive folder *(owned by personal gmail — request transfer first)* |
| `winder intakes nov 22 - mar 2` | gsheet | Nov 2022–Mar 2023 | Archive | Move to archive folder |
| `Winder Intakes - Up to 1-28-23` | gsheet | Nov 2022–Jan 2023 | Archive | Move to archive folder (keep this one, delete the .numbers and .csv above) |
| `Intake DB-Grid view (1).csv` | csv | ~2024 | Archive | Move to archive folder |
| `Copy of ****2024 NEW Data Collection Log Sheet` | gsheet | 2024 | Review | Verify it's a copy of the real 2024 log, then archive |
| `Copy of The Real Master 2024 (need jan & Nov-Dec` | gsheet | 2024 | Review | Same — verify original still exists, then archive this copy |
| `Riley's YES CHEF 2024 Data Collection Log - Copy of SOR FY25 Nov.csv` | csv | 2024 (partial) | Review | Check if this fills gaps missing from the master, then archive |
| `SSP Intakes Log all.csv` | csv | through Nov 2024 | Archive | Move to archive folder |
| `Copy of SSP Data-2025-MASTER included` | gsheet | ~2025 | Review | Is original still the SOT? If yes → archive this copy |
| `Copy of Fillout Results Exported 1/28/25` | gsheet | Jan 2025 | Archive | Move to archive folder |

**Question for Olive before consolidation:**
- `** SSP Intakes 11/01/22-...` is owned by a personal gmail. Transfer ownership to the org account before moving to archive folder.
- `Copy of The Real Master 2024` has "(need jan & Nov-Dec)" in the title — are those months missing from all sources or just from this copy?
- Is there a Fulcrum export anywhere? The 2023–2024 data may have come from Fulcrum (mobile data collection app). If so, that export is the raw source and should be the spine of the archive.

---

## When done

Once the above is complete:
1. Check My Drive root: should contain only active working files and properly named folders — no shortcuts, no "Copy of", no "not done" prefixes.
2. Update `GoogleDrive_Triage_May2026` statuses to `Done` for each completed item.
3. Confirm the naming convention doc (`docs/APGA_NamingConvention_2026.md` in this repo) with Riley, then apply it going forward as files are touched.
