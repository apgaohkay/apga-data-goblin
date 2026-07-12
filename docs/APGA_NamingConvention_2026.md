# APGA File Naming Convention — v1.0 (July 2026)

**Status: PROPOSED — confirm with Riley, then this is the law of the land.**

## The schema

```
[ORG]_[CATEGORY]_[DESCRIPTOR]_[DATE or VERSION]
```

- **ORG** — always `APGA`. This makes our files instantly recognizable in shared
  folders, email attachments, and funder uploads.
- **CATEGORY** — one word from the controlled list below. Pick the closest one;
  don't invent new categories without adding them to this doc.
- **DESCRIPTOR** — short CamelCase or hyphen-free description of what the file
  actually is. Add qualifiers like `AuditReady` or `FINAL` here if needed.
- **DATE or VERSION** — `YYYY-MM` or `YYYY-MM-DD` for dated files,
  `FY26-03` style for fiscal-year deliverables, or `v2` for versioned documents.
  Dates sort correctly; "new", "latest", and "Copy of" do not.

## Category vocabulary

| Category | Use for |
|---|---|
| `SOR` | State Opioid Response grant deliverables: Annex D, Annex J, programmatic reports, DBHDD correspondence |
| `Finance` | Payroll, invoices, reconciliation, budgets, checks |
| `SSP` | Syringe services program data: visit logs, intake data, dashboards, historical archives |
| `OEND` | Overdose education & naloxone distribution: trainings, event logs, reversal reports |
| `Compliance` | Audit responses, trackers, policies, certifications |
| `Contractor` | 1099 agreements, contractor invoices, timesheets |
| `HR` | Timesheets, personnel files |
| `Comms` | Outreach materials, flyers, social media assets |
| `Template` | Blank templates (also keep them in the Templates folder) |

## Examples

| Bad (real patterns from our Drive) | Good |
|---|---|
| `Copy of AnnexD_March2026_FY26_SOR_AccessPointofGeorgia.docx` | `APGA_SOR_AnnexD_FY26-03.docx` |
| `not done SOR_GrantPeriod_Reconciliation_AUDIT_READY` | `APGA_Finance_GrantReconciliation_AuditReady_FY25-26` |
| `invoice summary and pay sheets april may 2026` | `APGA_Finance_InvoiceSummary_2026-04-05` |
| `2026-05-22-Timesheet_Lopez.docx` | `APGA_HR_Timesheet_Lopez_2026-05-22.docx` |
| `data spreadsheet (1)` | `APGA_SSP_VisitLog_2024` |

## Rules of thumb

1. **Rename as you touch.** No big-bang rename project — when you open a file to
   work on it, fix its name.
2. **Never keep "Copy of" in a name.** Either it's the real file (rename it) or
   it's a duplicate (delete it).
3. **Shortcuts don't live in My Drive root.** Pin folders instead, or use
   Starred.
4. **`FINAL` means final.** If a file says FINAL and you need to change it,
   version it: `_FINAL_v2` is banned; use a date instead.
5. **One source of truth per document.** If two files compete, the triage rule
   is: newer + more complete wins, the other gets `z_ARCHIVE` treatment.
6. **Archive prefix.** Files kept only for history move to the Archive folder;
   if they must stay in place, prefix with `z_` so they sort to the bottom.

## Folder conventions

- `APGA_Archive_PreDashboard_SSPData/` — locked-down home of
  `APGA_SSP_HistoricalData_PreDashboard_thru2025` and the raw source files it
  was consolidated from. View-only for everyone except Riley + Olive.
- `t_SOR Templates/` → rename to `APGA_Templates_SOR/` when convenient.
- Working folders stay shallow: max ~2 levels deep before a file has to justify
  its existence.
