/**
 * APGA SSP Historical Data Archive Builder
 * =========================================
 * Run this script ONCE to create APGA_SSP_HistoricalData_PreDashboard_thru2025.
 *
 * HOW TO RUN (10 minutes total):
 *  1. In Drive, create a NEW blank Google Sheet (File → New → Spreadsheet)
 *     Name it exactly: APGA_SSP_HistoricalData_PreDashboard_thru2025
 *  2. Extensions → Apps Script → replace Code.gs with this file → Save (💾)
 *  3. Run buildArchive() — authorize when prompted (needs Drive + Sheets access)
 *  4. Review each tab. Tabs marked ⚠️ = file not found in Drive → paste manually.
 *  5. Move the sheet to APGA_Archive_PreDashboard_SSPData/ folder in Drive
 *  6. Share → change Olive + Riley to Editor, remove broader access
 *
 * ⚠️ NEVER run this inside data_dashboard_2026.
 *    It only writes to the sheet it's installed in.
 *
 * After it runs: see APGA_SSP_HistoricalData_Inventory.md in the docs/ repo
 * for open questions (2024 gaps, Fulcrum export, personal-gmail ownership).
 */

var SOURCES = [
  {
    tab:    '2022_Intake Responses',
    name:   'Intake Responses',
    type:   'gsheet',
    period: '~2022',
    notes:  'Early intake form data'
  },
  {
    tab:    '2022-23_Winder_Nov22-Jan23',
    name:   'Winder Intakes - Up to 1-28-23',
    type:   'gsheet',
    period: 'Nov 2022–Jan 2023',
    notes:  'Winder location only. Keep gsheet; Numbers + CSV copies are confirmed duplicates (delete those).'
  },
  {
    tab:    '2022-23_Winder_Nov22-Mar23',
    name:   'winder intakes nov 22 - mar 2',
    type:   'gsheet',
    period: 'Nov 2022–Mar 2023',
    notes:  'Winder location only. Overlaps with Nov22-Jan23 tab — expect duplicate rows.'
  },
  {
    tab:    '2022-23_AllIntakes_thruDec23',
    name:   '** SSP Intakes 11/01/22- through 12/29/2023',
    type:   'gsheet',
    period: 'Nov 2022–Dec 2023',
    notes:  'Broadest early coverage. OWNED BY PERSONAL GMAIL — transfer ownership to org account first, or this script may not be able to open it.'
  },
  {
    tab:    '2024_Master',
    name:   'Copy of The Real Master 2024',
    type:   'gsheet',
    period: '2024',
    notes:  'Best available 2024 source. Title says "need jan & Nov-Dec" — verify if those months are missing.'
  },
  {
    tab:    '2024_AllCSV_thruNov',
    name:   'SSP Intakes Log all.csv',
    type:   'csv',
    period: 'through Nov 2024',
    notes:  'Cumulative CSV export'
  },
  {
    tab:    '2024_IntakeDB_GridExport',
    name:   'Intake DB-Grid view (1).csv',
    type:   'csv',
    period: '~2024',
    notes:  'Likely Airtable or similar export'
  },
  {
    tab:    '2025_Jan_Fillout',
    name:   'Copy of Fillout Results Exported 1/28/25',
    type:   'gsheet',
    period: 'Jan 2025',
    notes:  'Fillout form export'
  },
  {
    tab:    '2025_Master',
    name:   'Copy of SSP Data-2025-MASTER included',
    type:   'gsheet',
    period: '~2025',
    notes:  'Verify whether the original (without "Copy of") still exists as source of truth'
  }
];

// ─── Entry point ────────────────────────────────────────────────────────────

function buildArchive() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var log = [];

  // Safety check: refuse to run inside data_dashboard_2026
  var title = ss.getName();
  if (title.toLowerCase().indexOf('dashboard') !== -1 ||
      title.toLowerCase().indexOf('data_dashboard') !== -1) {
    SpreadsheetApp.getUi().alert(
      '🚫 STOP\n\nThis script detected it may be running inside the live dashboard.\n' +
      'Create a NEW blank sheet and run from there.'
    );
    return;
  }

  log.push('Starting archive build in: ' + title);
  log.push('Date: ' + new Date().toLocaleDateString());
  log.push('');

  // README tab first
  addReadmeTab_(ss, log);

  // Copy each source
  SOURCES.forEach(function (src) {
    try {
      if (src.type === 'gsheet') {
        copyGsheetSource_(ss, src, log);
      } else {
        copyCsvSource_(ss, src, log);
      }
    } catch (err) {
      log.push('❌ ' + src.tab + ': ' + String(err));
      errorTab_(ss, src, String(err));
    }
  });

  // Move README to position 1, delete empty default Sheet1
  var readme = ss.getSheetByName('README');
  if (readme) { ss.setActiveSheet(readme); ss.moveActiveSheet(1); }
  var blank = ss.getSheetByName('Sheet1');
  if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 1) {
    ss.deleteSheet(blank);
  }

  var summary = log.join('\n');
  Logger.log(summary);
  SpreadsheetApp.getUi().alert(
    'Archive build complete!\n\n' + summary +
    '\n\n─────────────────────────\n' +
    'Next steps:\n' +
    '1. Review ⚠️ tabs — paste source data manually for any not found\n' +
    '2. Move sheet to APGA_Archive_PreDashboard_SSPData/ folder\n' +
    '3. Restrict permissions: Editor = Olive + Riley only'
  );
}

// ─── Source handlers ────────────────────────────────────────────────────────

function copyGsheetSource_(ss, src, log) {
  var file = findFile_(src.name, 'application/vnd.google-apps.spreadsheet');
  if (!file) {
    log.push('⚠️  ' + src.tab + ': not found — "' + src.name + '"');
    notFoundTab_(ss, src);
    return;
  }

  var sourceSheet;
  try {
    sourceSheet = SpreadsheetApp.openById(file.getId()).getSheets()[0];
  } catch (e) {
    log.push('⚠️  ' + src.tab + ': found but cannot open (check sharing) — ' + file.getUrl());
    notFoundTab_(ss, src, 'File found but could not open: ' + file.getUrl() + '\nPossibly owned by personal Gmail — transfer ownership first.');
    return;
  }

  var data = sourceSheet.getDataRange().getValues();
  if (data.length === 0) {
    log.push('⚠️  ' + src.tab + ': file is empty');
    notFoundTab_(ss, src, 'File found but contains no data: ' + file.getUrl());
    return;
  }

  var dest = ensureTab_(ss, src.tab);
  writeSourceNote_(dest, src, file.getUrl());
  dest.getRange(3, 1, data.length, data[0].length || 1).setValues(data);
  dest.setFrozenRows(3);
  log.push('✅ ' + src.tab + ': ' + data.length + ' rows copied from "' + file.getName() + '"');
}

function copyCsvSource_(ss, src, log) {
  // CSVs: search any mime type since Drive stores uploaded CSVs as text/csv or application/octet-stream
  var file = findFile_(src.name, null);
  if (!file) {
    log.push('⚠️  ' + src.tab + ': CSV not found — "' + src.name + '"');
    notFoundTab_(ss, src);
    return;
  }

  var content = file.getBlob().getDataAsString('UTF-8');
  var rows = Utilities.parseCsv(content);
  if (!rows || rows.length === 0) {
    log.push('⚠️  ' + src.tab + ': CSV is empty');
    notFoundTab_(ss, src, 'File found but empty: ' + file.getUrl());
    return;
  }

  var dest = ensureTab_(ss, src.tab);
  writeSourceNote_(dest, src, file.getUrl());
  dest.getRange(3, 1, rows.length, rows[0].length || 1).setValues(rows);
  dest.setFrozenRows(3);
  log.push('✅ ' + src.tab + ': ' + rows.length + ' rows copied from CSV "' + file.getName() + '"');
}

// ─── Tab builders ────────────────────────────────────────────────────────────

function addReadmeTab_(ss, log) {
  var sheet = ensureTab_(ss, 'README');

  var rows = [
    ['APGA SSP Historical Data Archive — Pre-Dashboard (through 2025)'],
    [''],
    ['PURPOSE',       'Read-only reference snapshot of all SSP visit data before the 2026 dashboard went live.'],
    ['CREATED',       new Date().toLocaleDateString()],
    ['OWNERS',        'Olive + Riley — Editor access only. No broader sharing.'],
    [''],
    ['⚠️ DO NOT EDIT', 'This file is a locked archive. Do not add, delete, or change any data rows after the archive date.'],
    ['⚠️ PRIVACY',    'Pre-2026 data may contain real names, full DOB, or other identifiers. Do not share outside Olive + Riley without pseudonymizing first. New system uses anonymous 4-digit Participant IDs; old data does not.'],
    [''],
    ['HOW TO USE',    'Each tab = one source file, copied as-is. The raw format IS the audit trail. Do not normalize or merge.'],
    ['SOR COUNTS',    'For unique participant counts, ask Riley — dedup logic depends on whether source files track one row per visit or one row per person.'],
    [''],
    ['OPEN QUESTIONS', ''],
    ['1. Fulcrum exports',   'Were 2023–2024 intakes collected via Fulcrum (mobile app)? Check ZIP_we-sent-back-in-march_DBHDD_SOR-REVIEW — a Fulcrum CSV/ZIP there would be the most trustworthy raw source.'],
    ['2. Personal Gmail',    '"** SSP Intakes 11/01/22-..." is owned by a personal Gmail. Transfer ownership to org account, or this script could not open it. Tab 2022-23_AllIntakes_thruDec23 may be empty — paste manually.'],
    ['3. 2024 gaps',         '"Copy of The Real Master 2024" title notes "need jan & Nov-Dec" — those months may be missing. Check Riley\'s YES CHEF CSV for Nov fill-in.'],
    ['4. Visit vs person',   'Do these files track one row per VISIT or one row per PERSON? Affects how SOR unique-participant counts work.'],
    [''],
    ['TAB INDEX', '', '', ''],
    ['Tab', 'Source file', 'Period', 'Notes']
  ];

  SOURCES.forEach(function (s) {
    rows.push([s.tab, s.name, s.period, s.notes]);
  });

  sheet.clearContents();
  sheet.getRange(1, 1, rows.length, 4).setValues(rows);

  // Formatting
  sheet.getRange(1, 1).setFontSize(13).setFontWeight('bold');
  sheet.getRange(3, 1, 9, 1).setFontWeight('bold');
  sheet.getRange(13, 1, 5, 1).setFontWeight('bold');
  sheet.getRange(rows.length - SOURCES.length - 1, 1, 1, 4).setFontWeight('bold').setBackground('#e8eaf6');
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 320);
  sheet.setColumnWidth(3, 140);
  sheet.setColumnWidth(4, 440);
  sheet.setFrozenRows(1);
  log.push('✅ README tab created');
}

function notFoundTab_(ss, src, detail) {
  var sheet = ensureTab_(ss, src.tab);
  sheet.clearContents();
  var msg = [
    ['⚠️ SOURCE FILE NOT FOUND — PASTE DATA MANUALLY'],
    ['Expected file name:', src.name],
    ['Period:', src.period],
    ['Notes:', src.notes],
    [''],
    ['ACTION:', 'Find this file in Drive, open it, copy all data, and paste starting at row 8 of this tab.']
  ];
  if (detail) msg.push(['Detail:', detail]);
  msg.push(['']);
  msg.push(['Paste headers in row 8, data from row 9 down.']);
  sheet.getRange(1, 1, msg.length, 2).setValues(msg);
  sheet.getRange(1, 1).setFontWeight('bold').setFontColor('#b71c1c').setFontSize(11);
}

function errorTab_(ss, src, errMsg) {
  var sheet = ensureTab_(ss, src.tab);
  sheet.clearContents();
  var msg = [
    ['❌ ERROR COPYING SOURCE'],
    ['File:', src.name],
    ['Error:', errMsg],
    [''],
    ['ACTION:', 'Open the source file manually and paste its data starting at row 6.']
  ];
  sheet.getRange(1, 1, msg.length, 2).setValues(msg);
  sheet.getRange(1, 1).setFontWeight('bold').setFontColor('#b71c1c');
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function findFile_(name, mimeType) {
  var q = 'title = "' + name.replace(/"/g, '\\"') + '" and trashed = false';
  if (mimeType) q += ' and mimeType = "' + mimeType + '"';
  var results = DriveApp.searchFiles(q);
  if (results.hasNext()) return results.next();

  // Fallback: partial title match (first 30 chars) in case of slight name variation
  var partial = name.substring(0, 30).replace(/"/g, '\\"');
  q = 'title contains "' + partial + '" and trashed = false';
  if (mimeType) q += ' and mimeType = "' + mimeType + '"';
  results = DriveApp.searchFiles(q);
  return results.hasNext() ? results.next() : null;
}

function ensureTab_(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function writeSourceNote_(sheet, src, url) {
  sheet.clearContents();
  sheet.getRange(1, 1).setValue(
    '[ARCHIVE SOURCE: ' + src.name + ' | Period: ' + src.period +
    ' | Archived: ' + new Date().toLocaleDateString() + ' | ' + url + ']'
  );
  sheet.getRange(1, 1).setFontColor('#757575').setFontStyle('italic');
  sheet.getRange(2, 1).setValue('[' + src.notes + ']');
  sheet.getRange(2, 1).setFontColor('#757575').setFontStyle('italic');
  // Row 3 onward = raw data (set by caller)
}
