/**
 * Kontaktformular-Backend für die Praxis-Doulgeridis-Website.
 * Gleiches Muster wie der Leads-Endpoint auf click-capybara.com.
 *
 * EINRICHTUNG:
 * 1. Neues Google Sheet anlegen (z.B. "Praxis Doulgeridis – Kontaktanfragen").
 * 2. Erweiterungen → Apps Script öffnen, diesen Code einfügen.
 * 3. Bereitstellen → Neue Bereitstellung → Typ "Web App".
 *    - Ausführen als: Ich (eigenes Google-Konto)
 *    - Zugriff: Jeder
 * 4. Die generierte Web-App-URL kopieren und in der Website als
 *    CONTACT_LEADS_URL eintragen (ersetzt 'REPLACE_WITH_APPS_SCRIPT_URL').
 * 5. Bei jeder Code-Änderung: Bereitstellen → Bereitstellungen verwalten →
 *    Version erhöhen, sonst bleibt die alte Version live.
 */

const SHEET_NAME = 'Anfragen';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const sheet = getOrCreateSheet_();
    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.message || '',
      data.source || ''
    ]);

    // Optional: Praxis per E-Mail benachrichtigen.
    // MailApp.sendEmail({
    //   to: 'praxis@example.de',
    //   subject: 'Neue Nachricht über die Website',
    //   body: 'Name: ' + data.name + '\nE-Mail: ' + data.email +
    //         '\nTelefon: ' + data.phone + '\n\n' + data.message
    // });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Zeitstempel', 'Name', 'E-Mail', 'Telefon', 'Nachricht', 'Quelle']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
