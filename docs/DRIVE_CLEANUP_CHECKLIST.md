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

**How to bulk-delete shortcuts from root:** In Drive, switch to list view, sort by Type → right-click each shortcut → Remove. Or select all 4 shortcuts at once and trash together.

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

---

## SSP DATA FILES — separate process

The SSP data files (Fulcrum exports, 2024-25 sheets, CSV/Fillout exports, Winder intakes) are being handled under the **historical data consolidation** task. See `APGA_SSP_HistoricalData_PreDashboard_thru2025` setup notes once Drive access is stable. Do not delete or move any SSP data files until the consolidation is confirmed complete.

---

## When done

Once the above is complete:
1. Check My Drive root: should contain only active working files and properly named folders — no shortcuts, no "Copy of", no "not done" prefixes.
2. Update `GoogleDrive_Triage_May2026` statuses to `Done` for each completed item.
3. Confirm the naming convention doc (`docs/APGA_NamingConvention_2026.md` in this repo) with Riley, then apply it going forward as files are touched.
