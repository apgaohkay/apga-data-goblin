/**
 * Code.gs  —  Access Point SSP Web App (sspv5)
 *
 * KEY FIX vs previous version:
 *   SSP Visits tab has a TITLE ROW in row 1 and column HEADERS in row 2.
 *   appendByHeader_() now reads CONFIG.HEADER_ROW[sheetName] (default 1) so
 *   SSP Visits correctly reads row 2 while all other tabs still use row 1.
 *
 * Deploy: Extensions → Apps Script → Edit deployment (pencil) → New version → Save.
 * Do NOT create a new deployment — the form's WEB_APP_URL must stay the same.
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
var SS_ID = '1D3wbyiGS3QIwg0CwFutj7tpffUZtmRf0P4HKSlitppM';

var CONFIG = {
  TABS: {
    participants:   'Participants',
    visits:         'SSP Visits',
    events:         'Events',
    attendees:      'Event Attendees',
    checkins:       'Check-Ins',
    rawSubmissions: 'Raw Submissions'
  },

  // Only SSP Visits has a title banner in row 1; its real headers are in row 2.
  // All other tabs have headers in row 1 (default).
  HEADER_ROW: {
    'SSP Visits': 2
  },

  HEADERS: {
    participants: [
      'Participant ID#', 'Initials', 'Birth Year', 'Gender Identity',
      'Race / Ethnicity', 'County', 'ZIP', 'Housing Status',
      'Participant Type', 'Date Registered'
    ],
    visits: [
      'Date', 'Participant ID', 'New / Returning', 'Staff / Vol', 'Location',
      'Housing Status', 'Longs Given', 'Shorts Given', 'FTS Given',
      'Naloxone IM', 'Naloxone Nasal', 'Sec Distrib Kits',
      'Services / Referrals',
      'Reported Reversal?', 'Reversal: Reporter Type', 'Reversal: OD Outcome',
      'Reversal: Nasal Doses Used', 'Reversal: IM Doses Used',
      'Reversal: Gender', 'Reversal: Race / Eth', 'Reversal: Age Range',
      'Reversal: County', 'Notes', 'Logged'
    ],
    events: [
      'Event ID', 'Event Name', 'Date', 'Location', 'Type',
      'Staff / Vol', 'Notes', 'Created'
    ],
    attendees: [
      'Event ID', 'Participant ID', 'Check-In Time', 'Notes'
    ],
    checkins: [
      'Date', 'Participant ID', 'Staff / Vol', 'Location',
      'Notes', 'Logged'
    ]
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Append a row to `sheet` by matching object keys to column headers.
 * Keys in rowObj that don't match any header are silently ignored.
 * Columns in the sheet that have no matching key are left empty.
 *
 * For SSP Visits, headers are in row 2 (CONFIG.HEADER_ROW['SSP Visits'] = 2).
 * For all other tabs, headers are in row 1.
 */
function appendByHeader_(sheet, rowObj) {
  var sheetName = sheet.getName();
  var headerRow  = CONFIG.HEADER_ROW[sheetName] || 1;
  var lastCol    = sheet.getLastColumn();
  if (lastCol < 1) lastCol = 1;

  var headers = sheet.getRange(headerRow, 1, 1, lastCol).getValues()[0];
  var row     = new Array(lastCol).fill('');

  headers.forEach(function(h, i) {
    if (h !== '' && h in rowObj) {
      row[i] = rowObj[h] !== undefined ? rowObj[h] : '';
    }
  });

  sheet.appendRow(row);

  // SSP Visits column B is "Day (auto)" — restore formula after appendRow
  if (sheetName === CONFIG.TABS.visits) {
    var newRow = sheet.getLastRow();
    sheet.getRange(newRow, 2).setFormula(
      '=IF(ISBLANK(A' + newRow + '),"",TEXT(A' + newRow + ',"DDD"))'
    );
  }
}

/** Log every POST to Raw Submissions for audit and date-recovery purposes. */
function rawLog_(ss, action, payload) {
  try {
    var raw = ss.getSheetByName(CONFIG.TABS.rawSubmissions);
    if (!raw) return;
    var now = new Date();
    raw.appendRow([now.toISOString(), action, JSON.stringify(payload)]);
  } catch (e) {
    // Non-fatal: don't let logging failure break a form submit
    Logger.log('rawLog_ error: ' + e.message);
  }
}

/** Return a JSON ContentService response. */
function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Parse integer, defaulting to 0 on NaN/empty. */
function int_(v) {
  var n = parseInt(v, 10);
  return isNaN(n) ? 0 : n;
}

/** Parse a YYYY-MM-DD string safely; falls back to today. */
function parseDate_(s) {
  if (!s) return new Date();
  var m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return new Date();
  // Use local noon to avoid timezone-boundary shift
  return new Date(+m[1], +m[2] - 1, +m[3], 12, 0, 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// doGet  —  returns participant list (and optionally event list)
// ─────────────────────────────────────────────────────────────────────────────
function doGet(e) {
  var ss = SpreadsheetApp.openById(SS_ID);
  var action = (e && e.parameter && e.parameter.action) || 'getParticipants';

  try {
    if (action === 'getParticipants') {
      var pSheet = ss.getSheetByName(CONFIG.TABS.participants);
      var lastRow = pSheet.getLastRow();
      var participants = [];

      if (lastRow >= 2) {
        // Participants headers in row 1; data starts row 2
        var pData = pSheet.getRange(2, 1, lastRow - 1, CONFIG.HEADERS.participants.length)
                          .getValues();
        participants = pData
          .filter(function(r) { return r[0]; }) // must have an ID
          .map(function(r) {
            return {
              id:        String(r[0]),
              initials:  String(r[1] || ''),
              birthYear: r[2] ? String(r[2]) : '',
              gender:    String(r[3] || ''),
              race:      String(r[4] || ''),
              county:    String(r[5] || ''),
              zip:       String(r[6] || ''),
              housing:   String(r[7] || ''),
              type:      String(r[8] || '')
            };
          });
      }
      return jsonOut_({ ok: true, participants: participants });
    }

    if (action === 'getVisits') {
      var vSheet   = ss.getSheetByName(CONFIG.TABS.visits);
      var vHeadRow = CONFIG.HEADER_ROW[CONFIG.TABS.visits] || 1; // row 2
      var vLast    = vSheet.getLastRow();
      var vVisits  = [];

      if (vLast > vHeadRow) {
        var vLastCol = vSheet.getLastColumn();
        var vHeaders = vSheet.getRange(vHeadRow, 1, 1, vLastCol).getValues()[0];
        // Map each needed field to its column index (0-based), -1 if absent
        function col_(name) { return vHeaders.indexOf(name); }
        var idx = {
          date:            col_('Date'),
          participantId:   col_('Participant ID'),
          newOrReturning:  col_('New / Returning'),
          worker:          col_('Staff / Vol'),
          location:        col_('Location'),
          longs:           col_('Longs Given'),
          shorts:          col_('Shorts Given'),
          fts:             col_('FTS Given'),
          naloxIM:         col_('Naloxone IM'),
          naloxNasal:      col_('Naloxone Nasal'),
          secDistrib:      col_('Sec Distrib Kits'),
          reportedReversal: col_('Reported Reversal?'),
          reversalCounty:  col_('Reversal: County')
        };
        var vData = vSheet.getRange(vHeadRow + 1, 1, vLast - vHeadRow, vLastCol).getValues();
        vVisits = vData
          .filter(function(r) { return r[idx.participantId]; })
          .map(function(r) {
            function g(k) { return idx[k] >= 0 ? r[idx[k]] : ''; }
            var d = g('date');
            // Return date as YYYY-MM-DD string for the frontend
            var dateStr = '';
            if (d instanceof Date && !isNaN(d)) {
              dateStr = d.getFullYear() + '-' +
                ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
                ('0' + d.getDate()).slice(-2);
            } else if (d) {
              dateStr = String(d);
            }
            return {
              date:            dateStr,
              participantId:   String(g('participantId')),
              newOrReturning:  String(g('newOrReturning') || ''),
              worker:          String(g('worker') || ''),
              location:        String(g('location') || ''),
              longs:           g('longs') || 0,
              shorts:          g('shorts') || 0,
              fts:             g('fts') || 0,
              naloxIM:         g('naloxIM') || 0,
              naloxNasal:      g('naloxNasal') || 0,
              secDistrib:      g('secDistrib') || 0,
              reportedReversal: String(g('reportedReversal') || ''),
              reversalCounty:  String(g('reversalCounty') || '')
            };
          });
      }
      return jsonOut_({ ok: true, visits: vVisits });
    }

    if (action === 'getEvents') {
      var evSheet = ss.getSheetByName(CONFIG.TABS.events);
      var evLast  = evSheet.getLastRow();
      var events  = [];
      if (evLast >= 2) {
        var evData = evSheet.getRange(2, 1, evLast - 1, CONFIG.HEADERS.events.length).getValues();
        events = evData
          .filter(function(r) { return r[0]; })
          .map(function(r) {
            return { id: String(r[0]), name: String(r[1]), date: r[2], location: String(r[3]) };
          });
      }
      return jsonOut_({ ok: true, events: events });
    }

    return jsonOut_({ ok: false, error: 'Unknown action: ' + action });
  } catch (err) {
    return jsonOut_({ ok: false, error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// doPost  —  handles all form submissions
// ─────────────────────────────────────────────────────────────────────────────
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (le) {
    return jsonOut_({ ok: false, error: 'Server busy — try again in a moment.' });
  }

  try {
    var raw  = e.postData ? e.postData.contents : '';
    var p    = JSON.parse(raw);
    var ss   = SpreadsheetApp.openById(SS_ID);
    var action = p.action;

    // Always log to Raw Submissions first
    rawLog_(ss, action, p);

    // ── registerParticipant ──────────────────────────────────────────────────
    if (action === 'registerParticipant') {
      var pSheet = ss.getSheetByName(CONFIG.TABS.participants);

      // Use client-provided ID (already collision-checked against loaded registry).
      // Fall back to max+1 only if client didn't send one.
      var newId;
      if (p.id && String(p.id).match(/^\d{4}$/)) {
        newId = String(p.id);
      } else {
        // Fallback: find max existing ID via header lookup (not column-order dependent)
        var lastP = pSheet.getLastRow();
        var maxId = 1000;
        if (lastP >= 2) {
          var headers = pSheet.getRange(1, 1, 1, pSheet.getLastColumn()).getValues()[0];
          var idCol = headers.indexOf('Participant ID#');
          if (idCol >= 0) {
            var existingIds = pSheet.getRange(2, idCol + 1, lastP - 1, 1).getValues()
              .map(function(r) { return parseInt(r[0], 10) || 0; });
            maxId = Math.max.apply(null, existingIds);
          }
        }
        newId = String(maxId + 1);
      }

      appendByHeader_(pSheet, {
        'Participant ID#':   newId,
        'Initials':          String(p.initials || '').toUpperCase(),
        'Birth Year':        int_(p.birthYear),
        'Gender Identity':   p.gender  || '',
        'Race / Ethnicity':  p.race    || '',
        'County':            p.county  || '',
        'ZIP':               p.zip     || '',
        'Housing Status':    p.housing || '',
        'Participant Type':  p.participantType || 'SSP',
        'Date Registered':   new Date()
      });

      return jsonOut_({ ok: true, id: String(newId) });
    }

    // ── logVisit ─────────────────────────────────────────────────────────────
    if (action === 'logVisit') {
      return handleLogVisit_(ss, p);
    }

    // ── bulkLogVisits ────────────────────────────────────────────────────────
    if (action === 'bulkLogVisits') {
      var visits = p.visits || [];
      var results = [];
      visits.forEach(function(v) {
        v.action = 'logVisit'; // ensure handler sees correct action
        var r = handleLogVisit_(ss, v);
        results.push(JSON.parse(r.getContent()));
      });
      return jsonOut_({ ok: true, results: results });
    }

    // ── createEvent ──────────────────────────────────────────────────────────
    if (action === 'createEvent') {
      var evSheet = ss.getSheetByName(CONFIG.TABS.events);
      var evLast  = evSheet.getLastRow();
      var maxEv   = 100;
      if (evLast >= 2) {
        var evIds = evSheet.getRange(2, 1, evLast - 1, 1).getValues()
          .map(function(r) { return parseInt(r[0], 10) || 0; });
        maxEv = Math.max.apply(null, evIds);
      }
      var newEvId = maxEv + 1;
      appendByHeader_(evSheet, {
        'Event ID':    newEvId,
        'Event Name':  p.eventName  || '',
        'Date':        parseDate_(p.date),
        'Location':    p.location   || '',
        'Type':        p.eventType  || '',
        'Staff / Vol': p.worker     || '',
        'Notes':       p.notes      || '',
        'Created':     new Date()
      });
      return jsonOut_({ ok: true, eventId: String(newEvId) });
    }

    // ── logAttendee ───────────────────────────────────────────────────────────
    if (action === 'logAttendee') {
      var attSheet = ss.getSheetByName(CONFIG.TABS.attendees);
      appendByHeader_(attSheet, {
        'Event ID':       p.eventId       || '',
        'Participant ID': p.participantId  || '',
        'Check-In Time':  new Date(),
        'Notes':          p.notes         || ''
      });
      return jsonOut_({ ok: true });
    }

    // ── checkIn ───────────────────────────────────────────────────────────────
    if (action === 'checkIn') {
      var ciSheet = ss.getSheetByName(CONFIG.TABS.checkins);
      appendByHeader_(ciSheet, {
        'Date':           parseDate_(p.date),
        'Participant ID': p.participantId || '',
        'Staff / Vol':    p.worker        || '',
        'Location':       p.location      || '',
        'Notes':          p.notes         || '',
        'Logged':         new Date()
      });
      return jsonOut_({ ok: true });
    }

    return jsonOut_({ ok: false, error: 'Unknown action: ' + action });

  } catch (err) {
    Logger.log('doPost error: ' + err.message + '\n' + err.stack);
    return jsonOut_({ ok: false, error: err.message });
  } finally {
    lock.releaseLock();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// handleLogVisit_  —  shared by logVisit and bulkLogVisits
// ─────────────────────────────────────────────────────────────────────────────
function handleLogVisit_(ss, p) {
  var visits = ss.getSheetByName(CONFIG.TABS.visits);

  var reportedReversal = (p.reportedReversal === 'Yes' || p.reportedReversal === true)
    ? 'Yes' : 'No';

  var row = {
    'Date':              parseDate_(p.date),
    'Participant ID':    p.participantId  || '',
    'New / Returning':   p.newOrReturning || '',
    'Staff / Vol':       p.worker         || '',
    'Location':          p.location       || '',
    'Housing Status':    p.housing        || '',
    'Longs Given':       int_(p.longs),
    'Shorts Given':      int_(p.shorts),
    'FTS Given':         int_(p.fts),          // fentanyl test strips — RE-ADDED
    'Naloxone IM':       int_(p.naloxIM),
    'Naloxone Nasal':    int_(p.naloxNasal),
    'Sec Distrib Kits':  int_(p.secDistrib),
    'Services / Referrals':     p.services              || '', // multi-value, "; " separated
    'Recovery Conversations':   p.recoveryConversations || '', // topics discussed/asked about
    'Recovery Notes':           p.recoveryNotes         || '',
    'Reported Reversal?':       reportedReversal,
    'Notes':                    p.notes                 || '',
    'Logged':            new Date()
  };

  // Reversal sub-fields (only written when a reversal was reported)
  if (reportedReversal === 'Yes') {
    row['Reversal: Reporter Type']     = p.reversalReporterType  || '';
    row['Reversal: OD Outcome']        = p.reversalODOutcome     || '';
    row['Reversal: Nasal Doses Used']  = int_(p.reversalNasalDoses);
    row['Reversal: IM Doses Used']     = int_(p.reversalIMDoses);
    row['Reversal: Gender']            = p.reversalGender        || '';
    row['Reversal: Race / Eth']        = p.reversalRace          || '';
    row['Reversal: Age Range']         = p.reversalAgeRange      || '';
    row['Reversal: County']            = p.reversalCounty        || '';
  }

  appendByHeader_(visits, row);
  return jsonOut_({ ok: true });
}
