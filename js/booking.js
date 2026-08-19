/**
 * DENTICAA DENTAL CLINIC - APPOINTMENT BOOKING & WHATSAPP SYNC
 * Clinic Phone / WhatsApp: +91 95752 16655
 */

document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('denticaaBookingForm');
  const appointmentDateInput = document.getElementById('appointmentDate');

  // Set min date to today
  if (appointmentDateInput) {
    const today = new Date().toISOString().split('T')[0];
    appointmentDateInput.min = today;
    appointmentDateInput.value = today;
  }

  if (!bookingForm) return;

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('patientName').value.trim();
    const phone = document.getElementById('patientPhone').value.trim();
    const email = document.getElementById('patientEmail').value.trim() || 'Not provided';
    const service = document.getElementById('serviceSelect').value;
    const doctor = document.getElementById('doctorSelect').value;
    const date = document.getElementById('appointmentDate').value;
    const timeSlot = document.getElementById('timeSlotSelect').value;
    const message = document.getElementById('patientMessage').value.trim() || 'None';

    if (!name || !phone || !service || !date || !timeSlot) {
      alert('Please fill in all required fields (Name, Phone, Service, Date, Time Slot).');
      return;
    }

    // Build WhatsApp message
    const formattedMessage = encodeURIComponent(
`*🦷 Denticaa Dental Clinic - Appointment Request*
----------------------------------------
👤 *Patient Name:* ${name}
📞 *Phone Number:* ${phone}
📧 *Email:* ${email}
🩺 *Selected Treatment:* ${service}
👨‍⚕️ *Doctor Preference:* ${doctor}
📅 *Preferred Date:* ${date}
⏰ *Time Slot:* ${timeSlot}
📝 *Note / Symptoms:* ${message}
----------------------------------------
_Sent from Denticaa Dental Clinic Official Website_`
    );

    const whatsappUrl = `https://wa.me/917509194919?text=${formattedMessage}`;

    // Show Success Modal or Toast
    showBookingConfirmation(name, service, date, timeSlot, whatsappUrl);
  });

  function showBookingConfirmation(name, service, date, timeSlot, whatsappUrl) {
    const modalHTML = `
      <div id="confirmModal" style="position: fixed; inset: 0; background: rgba(5,14,26,0.85); backdrop-filter: blur(10px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
        <div style="background: #ffffff; border-radius: 24px; padding: 36px; max-width: 480px; width: 100%; text-align: center; border: 2px solid #c59b27; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
          <div style="width: 70px; height: 70px; background: #ecfdf5; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 20px auto; border: 2px solid #10b981;">
            <i class="fa-solid fa-check"></i>
          </div>
          <h3 style="font-size: 1.5rem; color: #0b1f38; margin-bottom: 8px;">Appointment Prepared!</h3>
          <p style="color: #475569; font-size: 0.95rem; margin-bottom: 20px;">
            Thank you, <strong>${name}</strong>. Your consultation request for <strong>${service}</strong> on <strong>${date} (${timeSlot})</strong> is ready to confirm on WhatsApp.
          </p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <a href="${whatsappUrl}" target="_blank" class="btn btn-whatsapp" style="width: 100%; font-size: 1.05rem;">
              <i class="fa-brands fa-whatsapp"></i> Confirm on WhatsApp
            </a>
            <button id="closeConfirmModal" class="btn btn-navy" style="width: 100%;">
              Close Window
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const confirmModal = document.getElementById('confirmModal');
    const closeConfirmModal = document.getElementById('closeConfirmModal');

    closeConfirmModal.addEventListener('click', () => {
      confirmModal.remove();
      bookingForm.reset();
    });
  }
});
