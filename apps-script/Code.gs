/**
 * Access Point of Georgia — SSP Data System backend
 * ==================================================
 * Google Apps Script web app that connects the "Access Point SSP" form
 * (index.html in this repo) to the data_dashboard_2026 spreadsheet.
 *
 * HOW TO INSTALL (5 minutes):
 *  1. Open data_dashboard_2026 → Extensions → Apps Script.
 *  2. Replace everything in Code.gs with this file. Save (💾).
 *  3. Check CONFIG below: the tab names must match the real tab names in the
 *     spreadsheet EXACTLY (case-sensitive). If a tab doesn't exist yet the
 *     script creates it with the right headers on first use.
 *  4. Deploy → Manage deployments → ✏️ Edit (pencil) on the existing
 *     deployment → Version: "New version" → Deploy.
 *     ⚠️ Do NOT create a brand-new deployment — that mints a new /exec URL
 *     and the form would still point at the old one. Editing the existing
 *     deployment keeps the URL the form already uses.
 *     (Settings: Execute as: Me · Who has access: Anyone)
 *  5. Test: open the /exec URL in a browser — you should see JSON starting
 *     with {"ok":true,"participants":[...
 *
 * WHY THE FORM BROKE (most common causes, in order of likelihood):
 *  - A tab was renamed (e.g. "SSP Visits" → "SSP Visits/Log") and the script
 *    still referenced the old name → getSheetByName() returned null.
 *  - Someone re-deployed as a NEW deployment, changing the /exec URL.
 *  - Columns were inserted/moved and the script wrote by fixed column index.
 *  This version fixes all three failure modes: tab names live in CONFIG,
 *  missing tabs are auto-created, and every write is header-driven — it looks
 *  up column positions by header name at write time, so inserting or
 *  reordering columns can't silently corrupt data again.
 */

// ═══════════════════ CONFIG — edit tab names here only ═══════════════════
var CONFIG = {
  TABS: {
    participants: 'Participants',
    visits:       'SSP Visits',
    events:       'Events',
    attendees:    'Event Attendees',
    checkins:     'Check-Ins',
    reversals:    'Reversals'
  },
  // Header rows used when a tab has to be created from scratch.
  HEADERS: {
    participants: ['Participant ID','Initials','Birth Year','Gender','Race','Participant Type','Zip','County','Registered'],
    visits:       ['Date','Participant ID','New/Returning','Location','Worker','Longs','Shorts','Nalox IM','Nalox Nasal','Sec Distrib','Returned Syringes','Reversal Count','Housing','Notes','Logged'],
    events:       ['Event ID','Title','Date','Event Type','Trainer','Duration','Format','Location','Partner','Funder','Notes','Created'],
    attendees:    ['Event ID','Initials','Age Range','Race','Zip','County','Relationship','Nalox IM','Nalox Nasal','Sec Distrib','Participant ID','Completion','Logged'],
    checkins:     ['Time','Participant ID','Notes','Logged'],
    reversals:    ['Date','Participant ID','Reporter Type','OD Outcome','Nasal Doses','IM Doses','OD Gender','OD Race','OD Age','OD County','Logged']
  }
};

// ═══════════════════ Entry points ═══════════════════

/** GET → participant registry for the form's initials+year lookup. */
function doGet() {
  var sheet = ensureSheet_('participants');
  var rows = sheet.getDataRange().getValues();
  var col = headerIndex_(rows[0] || []);
  var participants = [];
  for (var i = 1; i < rows.length; i++) {
    var id = rows[i][col['Participant ID']];
    if (id === '' || id == null) continue;
    participants.push({
      id: Number(id),
      initials: String(rows[i][col['Initials']] || '').toUpperCase(),
      year: String(rows[i][col['Birth Year']] || '')
    });
  }
  return json_({ ok: true, participants: participants });
}

/** POST → dispatch on payload.action. */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // serialize writes; two phones can submit at once
  try {
    var p = JSON.parse(e.postData.contents);
    switch (p.action) {
      case 'registerParticipant': return json_(registerParticipant_(p));
      case 'logVisit':            return json_(logVisit_(p));
      case 'bulkLogVisits':
        var results = (p.visits || []).map(logVisit_);
        return json_({ ok: true, logged: results.length });
      case 'createEvent':         return json_(createEvent_(p));
      case 'logAttendee':         return json_(logAttendee_(p));
      case 'checkIn':             return json_(checkIn_(p));
      default:
        return json_({ ok: false, error: 'Unknown action: ' + p.action });
    }
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// ═══════════════════ Handlers ═══════════════════

function registerParticipant_(p) {
  var sheet = ensureSheet_('participants');
  var existing = findParticipant_(sheet, { id: p.id });
  if (existing) return { ok: true, id: existing.id, existed: true };
  appendByHeader_(sheet, {
    'Participant ID': Number(p.id),
    'Initials': String(p.initials || '').toUpperCase(),
    'Birth Year': p.birthYear || '',
    'Gender': p.gender || '',
    'Race': p.race || '',
    'Participant Type': p.participantType || '',
    'Zip': p.zip || '',
    'County': p.county || '',
    'Registered': new Date()
  });
  return { ok: true, id: Number(p.id), existed: false };
}

function logVisit_(p) {
  var pid = String(p.participantId || '').trim();

  // Grid imports may send initials+birthYear instead of a PID.
  // Resolve against the registry; auto-register when genuinely new.
  if (!pid && p.initials) {
    var sheet = ensureSheet_('participants');
    var match = findParticipant_(sheet, { initials: p.initials, year: p.birthYear });
    if (match) {
      pid = String(match.id);
    } else {
      pid = String(newParticipantId_(sheet));
      appendByHeader_(sheet, {
        'Participant ID': Number(pid),
        'Initials': String(p.initials || '').toUpperCase(),
        'Birth Year': p.birthYear || '',
        'Gender': p.gender || '',
        'Race': p.race || '',
        'Participant Type': 'SSP',
        'Zip': p.zip || '',
        'County': p.county || '',
        'Registered': new Date()
      });
    }
  }
  if (!pid) return { ok: false, error: 'logVisit: no participantId and no initials' };

  // Privacy rule: the visits tab stores the anonymous ID ONLY —
  // never initials, birth year, or other identifiers.
  appendByHeader_(ensureSheet_('visits'), {
    'Date': p.date || '',
    'Participant ID': Number(pid),
    'New/Returning': p.newOrReturning || '',
    'Location': p.location || '',
    'Worker': p.worker || '',
    'Longs': num_(p.longs),
    'Shorts': num_(p.shorts),
    'Nalox IM': num_(p.naloxIM),
    'Nalox Nasal': num_(p.naloxNasal),
    'Sec Distrib': num_(p.secDistrib),
    'Returned Syringes': p.returnedSyringes === 'yes' ? 'yes' : num_(p.returnedSyringes),
    'Reversal Count': num_(p.reversalCount),
    'Housing': p.housing || '',
    'Notes': p.notes || '',
    'Logged': new Date()
  });

  (p.reversals || []).forEach(function (r) {
    appendByHeader_(ensureSheet_('reversals'), {
      'Date': p.date || '',
      'Participant ID': Number(pid),
      'Reporter Type': r.reporterType || '',
      'OD Outcome': r.odOutcome || '',
      'Nasal Doses': r.nasalDoses || '',
      'IM Doses': r.imDoses || '',
      'OD Gender': r.odGender || '',
      'OD Race': r.odRace || '',
      'OD Age': r.odAge || '',
      'OD County': r.odCounty || '',
      'Logged': new Date()
    });
  });

  return { ok: true, participantId: Number(pid) };
}

function createEvent_(p) {
  appendByHeader_(ensureSheet_('events'), {
    'Event ID': p.eventId || '',
    'Title': p.title || '',
    'Date': p.date || '',
    'Event Type': p.eventType || '',
    'Trainer': p.trainer || '',
    'Duration': p.duration || '',
    'Format': p.format || '',
    'Location': p.location || '',
    'Partner': p.partner || '',
    'Funder': p.funder || '',
    'Notes': p.notes || '',
    'Created': new Date()
  });
  return { ok: true, eventId: p.eventId };
}

function logAttendee_(p) {
  appendByHeader_(ensureSheet_('attendees'), {
    'Event ID': p.eventId || '',
    'Initials': String(p.initials || '').toUpperCase(),
    'Age Range': p.ageRange || '',
    'Race': p.race || '',
    'Zip': p.zip || '',
    'County': p.county || '',
    'Relationship': p.relationship || '',
    'Nalox IM': num_(p.naloxIM),
    'Nalox Nasal': num_(p.naloxNasal),
    'Sec Distrib': num_(p.secDistrib),
    'Participant ID': p.participantId ? Number(p.participantId) : '',
    'Completion': p.completion || '',
    'Logged': new Date()
  });
  return { ok: true };
}

function checkIn_(p) {
  appendByHeader_(ensureSheet_('checkins'), {
    'Time': p.time || new Date().toISOString(),
    'Participant ID': p.participantId ? Number(p.participantId) : '',
    'Notes': p.notes || '',
    'Logged': new Date()
  });
  return { ok: true };
}

// ═══════════════════ Helpers ═══════════════════

/** Get a tab by CONFIG key; create it with headers if it doesn't exist. */
function ensureSheet_(key) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var name = CONFIG.TABS[key];
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(CONFIG.HEADERS[key]);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(CONFIG.HEADERS[key]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Map header name → 0-based column index. */
function headerIndex_(headerRow) {
  var map = {};
  headerRow.forEach(function (h, i) { map[String(h).trim()] = i; });
  return map;
}

/**
 * Append a row by matching object keys to header names, so column order in
 * the sheet never matters. Headers missing from the sheet are appended to
 * the header row automatically (never overwrites existing columns).
 */
function appendByHeader_(sheet, obj) {
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var col = headerIndex_(headers);
  var keys = Object.keys(obj);
  // add any missing headers to the right
  keys.forEach(function (k) {
    if (!(k in col)) {
      headers.push(k);
      sheet.getRange(1, headers.length).setValue(k);
      col[k] = headers.length - 1;
    }
  });
  var row = new Array(headers.length).fill('');
  keys.forEach(function (k) { row[col[k]] = obj[k]; });
  sheet.appendRow(row);
}

/** Find a participant by {id} or {initials, year}. Returns {id,...} or null. */
function findParticipant_(sheet, q) {
  var rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return null;
  var col = headerIndex_(rows[0]);
  for (var i = 1; i < rows.length; i++) {
    if (q.id != null && q.id !== '' && Number(rows[i][col['Participant ID']]) === Number(q.id)) {
      return { id: Number(rows[i][col['Participant ID']]) };
    }
    if (q.initials &&
        String(rows[i][col['Initials']]).toUpperCase() === String(q.initials).toUpperCase() &&
        String(rows[i][col['Birth Year']]) === String(q.year || '')) {
      return { id: Number(rows[i][col['Participant ID']]) };
    }
  }
  return null;
}

/** Random 4-digit ID not already in the registry (matches front-end scheme). */
function newParticipantId_(sheet) {
  var rows = sheet.getDataRange().getValues();
  var col = headerIndex_(rows[0] || []);
  var used = {};
  for (var i = 1; i < rows.length; i++) used[Number(rows[i][col['Participant ID']])] = true;
  var id;
  do { id = Math.floor(Math.random() * 9000) + 1000; } while (used[id]);
  return id;
}

function num_(v) {
  var n = Number(String(v == null ? '' : v).trim());
  return isNaN(n) ? 0 : n;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
