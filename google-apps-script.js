/**
 * ==============================================================================
 * DENTICAA DENTAL CLINIC — ALL-IN-ONE GOOGLE SHEETS, EMAIL & WHATSAPP ENGINE
 * SPREADSHEET ID: 1pRm8qoV1_UXtKwUBWfH8bXE90EE8pd0u-Ee3eLR50qk
 * ==============================================================================
 * 
 * ACTIVATION STEPS (Takes 60 seconds):
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1pRm8qoV1_UXtKwUBWfH8bXE90EE8pd0u-Ee3eLR50qk/edit
 * 2. In top menu, click Extensions > Apps Script.
 * 3. Delete any default code, paste THIS ENTIRE FILE content, and click Save (💾).
 * 4. Click Deploy > New Deployment:
 *    - Click the Gear icon ⚙️ > Select "Web app"
 *    - Description: "Denticaa Leads Engine"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 5. Click "Deploy", authorize access with your Google account.
 * 6. Copy the "Web app URL" (starts with https://script.google.com/macros/s/...) and paste it in js/main.js at window.DENTICAA_WEBHOOK_URL.
 * ==============================================================================
 */

const CONFIG = {
  // Your Google Sheet ID:
  SPREADSHEET_ID: "1pRm8qoV1_UXtKwUBWfH8bXE90EE8pd0u-Ee3eLR50qk",

  // Email notifications recipient:
  NOTIFICATION_EMAIL: "mehragagan844@gmail.com",

  // Dr. Kapil Jain's WhatsApp Number:
  DOCTOR_WHATSAPP_PHONE: "917509194919",

  // Optional: CallMeBot Free WhatsApp API key (leave empty if not activated yet)
  CALLMEBOT_API_KEY: "" 
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Open the Denticaa Sheet
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getActiveSheet();

    // Auto-create Header Row if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        "Timestamp", "Token No", "Patient Name", "Mobile Number", 
        "Email Address", "Selected Doctor", "Treatment Required", 
        "Appointment Date", "Time Slot", "Payment Mode", "Status", "Patient Notes"
      ];
      sheet.appendRow(headers);
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#0F141C");
      headerRange.setFontColor("#C59B27");
      headerRange.setFontWeight("bold");
      headerRange.setFontSize(11);
    }

    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const token = data.tokenNumber || "DNT-" + Math.floor(1000 + Math.random() * 9000);
    const name = data.patientName || "Anonymous";
    const phone = data.patientPhone || "N/A";
    const email = data.patientEmail || "N/A";
    const doctor = data.preferredDoctor || "Dr. Kapil Jain";
    const treatment = data.treatment || "General Consultation";
    const date = data.preferredDate || "N/A";
    const timeSlot = data.timeSlot || "N/A";
    const paymentMode = data.paymentMode || "Pending / Pay at Clinic";
    const status = data.status || "Confirmed";
    const message = data.message || "None";

    // 1. Append Appointment Data Row
    sheet.appendRow([
      timestamp,
      token,
      name,
      phone,
      email,
      doctor,
      treatment,
      date,
      timeSlot,
      paymentMode,
      status,
      message
    ]);

    // Format new row styling
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 12).setFontFamily("Plus Jakarta Sans");
    sheet.getRange(lastRow, 2).setFontWeight("bold").setFontColor("#059669"); // Green Token

    // 2. Send Instant Email Alert
    sendEmailNotification({
      timestamp,
      token,
      name,
      phone,
      email,
      doctor,
      treatment,
      date,
      timeSlot,
      paymentMode,
      message
    });

    // 3. Send Automated WhatsApp Notification (if CallMeBot API key is configured)
    if (CONFIG.CALLMEBOT_API_KEY) {
      sendWhatsAppNotification({
        token,
        name,
        phone,
        doctor,
        treatment,
        date,
        timeSlot,
        paymentMode
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", token: token }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper: Beautiful HTML Email to Clinic
function sendEmailNotification(data) {
  try {
    const subject = `🦷 New Appointment [${data.token}] — ${data.name} (${data.treatment})`;
    const htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F7; border: 2px solid #C59B27; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <div style="background: #0F141C; padding: 24px 20px; text-align: center; color: #FFFFFF;">
          <h2 style="color: #E5D5BA; margin: 0 0 4px 0; font-size: 1.5rem; letter-spacing: 1.5px;">DENTICAA DENTAL CARE</h2>
          <span style="font-size: 0.78rem; color: #94A3B8; text-transform: uppercase; letter-spacing: 1.5px;">New Patient Consultation Alert</span>
        </div>

        <div style="padding: 24px;">
          <div style="background: #10B981; color: #FFFFFF; font-weight: bold; padding: 10px 16px; border-radius: 10px; text-align: center; margin-bottom: 20px; font-size: 1.1rem; letter-spacing: 0.5px;">
            🎟️ Priority Token: #${data.token}
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
            <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 10px 0; color: #64748B; font-weight: 600;">Patient Name:</td><td style="padding: 10px 0; color: #0F172A; font-weight: 700;">${data.name}</td></tr>
            <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 10px 0; color: #64748B; font-weight: 600;">Contact Phone:</td><td style="padding: 10px 0; color: #0F172A; font-weight: 700;"><a href="tel:${data.phone}" style="color: #B45309; text-decoration: none;">${data.phone}</a></td></tr>
            <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 10px 0; color: #64748B; font-weight: 600;">Email:</td><td style="padding: 10px 0; color: #0F172A;">${data.email}</td></tr>
            <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 10px 0; color: #64748B; font-weight: 600;">Consulting Doctor:</td><td style="padding: 10px 0; color: #0F172A; font-weight: 700;">${data.doctor}</td></tr>
            <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 10px 0; color: #64748B; font-weight: 600;">Required Treatment:</td><td style="padding: 10px 0; color: #0F172A; font-weight: 700;">${data.treatment}</td></tr>
            <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 10px 0; color: #64748B; font-weight: 600;">Date & Time Slot:</td><td style="padding: 10px 0; color: #059669; font-weight: 700;">${data.date} • ${data.timeSlot}</td></tr>
            <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 10px 0; color: #64748B; font-weight: 600;">Payment Mode:</td><td style="padding: 10px 0; color: #B45309; font-weight: 700;">${data.paymentMode}</td></tr>
            <tr><td style="padding: 10px 0; color: #64748B; font-weight: 600;">Patient Symptoms/Notes:</td><td style="padding: 10px 0; color: #0F172A;">${data.message}</td></tr>
          </table>

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://wa.me/91${data.phone}?text=Hello%20${encodeURIComponent(data.name)},%20this%20is%20Denticaa%20Dental%20Care.%20We%20received%20your%20consultation%20token%20%23${data.token}%20for%20${encodeURIComponent(data.date)}." style="background: #25D366; color: #FFFFFF; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 0.95rem;">
              💬 Click to WhatsApp Patient (${data.name})
            </a>
          </div>
        </div>

        <div style="background: #F1F5F9; padding: 14px; text-align: center; font-size: 0.78rem; color: #64748B;">
          Denticaa Dental Care • Ground Floor, Nalini Apartment, Wright Town, Jabalpur • Call: 9575216655
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: CONFIG.NOTIFICATION_EMAIL,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (err) {
    Logger.log("Email error: " + err.toString());
  }
}

// Helper: Automated WhatsApp message via CallMeBot API
function sendWhatsAppNotification(data) {
  try {
    const msg = 
`🦷 *NEW DENTICAA APPOINTMENT*
----------------------------------------
🎟️ *Token No:* #${data.token}
👤 *Patient:* ${data.name}
📞 *Mobile:* ${data.phone}
👨‍⚕️ *Doctor:* ${data.doctor}
🩺 *Treatment:* ${data.treatment}
📅 *Date & Slot:* ${data.date} (${data.timeSlot})
💰 *Payment:* ${data.paymentMode}
----------------------------------------
_Auto-logged in Google Sheet_`;

    const url = `https://api.callmebot.com/whatsapp.php?phone=+${CONFIG.DOCTOR_WHATSAPP_PHONE}&text=${encodeURIComponent(msg)}&apikey=${CONFIG.CALLMEBOT_API_KEY}`;
    UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  } catch (err) {
    Logger.log("WhatsApp error: " + err.toString());
  }
}
