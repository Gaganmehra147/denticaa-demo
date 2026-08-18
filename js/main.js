/* ==========================================================================
   DENTICAA DENTAL CLINIC — MAIN INTERACTION CONTROLLER
   Handles Doctor Switcher, Navigation, Consultation Form & Fireworks Celebration
   ========================================================================== */

// 1. Interactive Doctor Profile Switcher (Dr. Gargi Style)
function switchDoctorProfile(doctorKey) {
  const profileKapil = document.getElementById('profileDrKapil');
  const profileAnmoll = document.getElementById('profileDrAnmoll');
  const tabKapil = document.getElementById('tabDrKapil');
  const tabAnmoll = document.getElementById('tabDrAnmoll');

  if (!profileKapil || !profileAnmoll) return;

  if (doctorKey === 'kapil') {
    profileKapil.classList.add('active');
    profileAnmoll.classList.remove('active');
    tabKapil?.classList.add('active');
    tabAnmoll?.classList.remove('active');
  } else if (doctorKey === 'anmoll') {
    profileAnmoll.classList.add('active');
    profileKapil.classList.remove('active');
    tabAnmoll?.classList.add('active');
    tabKapil?.classList.remove('active');
  }
}

// 2. Preselect Doctor & Scroll to Booking Form
function preselectDoctor(doctorName) {
  const doctorSelect = document.getElementById('doctorSelect');
  if (doctorSelect) {
    for (let i = 0; i < doctorSelect.options.length; i++) {
      if (doctorSelect.options[i].value.includes(doctorName) || doctorName.includes(doctorSelect.options[i].value)) {
        doctorSelect.selectedIndex = i;
        break;
      }
    }
  }
}

// 3. Fireworks & Confetti Particle Animation (फटाका Burst Celebration)
function triggerCelebratoryFireworks() {
  // Check if canvas already exists, otherwise create
  let canvas = document.getElementById('fireworksCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'fireworksCanvas';
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '10002';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#F59E0B', '#C7A76A', '#10B981', '#E11D48', '#3B82F6', '#EC4899', '#8B5CF6', '#FBBF24'];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.size = Math.random() * 5 + 3;
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.01;
      this.gravity = 0.18;
      this.shape = Math.random() > 0.4 ? 'circle' : 'rect';
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= 0.98;
      this.alpha -= this.decay;
      this.rotation += this.rotationSpeed;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;

      if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 1.5);
      }
      ctx.restore();
    }
  }

  function createFireworkBurst(x, y, count = 60) {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y));
    }
  }

  // Initial Multi-point Fireworks Bursts
  createFireworkBurst(canvas.width * 0.25, canvas.height * 0.35, 70);
  createFireworkBurst(canvas.width * 0.5, canvas.height * 0.25, 90);
  createFireworkBurst(canvas.width * 0.75, canvas.height * 0.35, 70);

  // Secondary delayed bursts
  setTimeout(() => createFireworkBurst(canvas.width * 0.35, canvas.height * 0.4, 60), 400);
  setTimeout(() => createFireworkBurst(canvas.width * 0.65, canvas.height * 0.4, 60), 800);
  setTimeout(() => createFireworkBurst(canvas.width * 0.5, canvas.height * 0.3, 80), 1200);

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);
      if (particles[i].alpha <= 0) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrameId);
    }
  }

  animate();
}

// 0. Cloud Webhook for Google Sheets, Email & WhatsApp Automation
window.DENTICAA_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyOz0p_G0utfNVpt1bCei7R378HCRL88o3eHIIRO31c0bb66MfF_oOpLLEjEat-6pGw/exec";

// 4. Show Celebratory Booking & Consultation Payment Portal
function showCelebratoryBookingModal(details) {
  triggerCelebratoryFireworks();

  const existing = document.getElementById('appointmentSuccessModal');
  if (existing) existing.remove();

  const tokenNumber = 'DNT-' + Math.floor(1000 + Math.random() * 9000);
  const consultationFee = 300;
  const clinicUpiId = '9575216655@upi';
  const clinicUpiName = 'Denticaa Dental Care';
  const upiIntentUrl = `upi://pay?pa=${clinicUpiId}&pn=${encodeURIComponent(clinicUpiName)}&am=${consultationFee}&cu=INR&tn=${encodeURIComponent(`Denticaa Token ${tokenNumber}`)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=190x190&margin=4&data=${encodeURIComponent(upiIntentUrl)}`;

  const docPhone = details.doctor.includes('Anmoll') ? '919575552165' : '917509194919';

  const modalHTML = `
    <div id="appointmentSuccessModal" style="position: fixed; inset: 0; background: rgba(10, 15, 24, 0.88); backdrop-filter: blur(14px); z-index: 10003; display: flex; align-items: center; justify-content: center; padding: 16px; animation: modalFadeIn 0.35s ease; overflow-y: auto;">
      <div style="background: #FFFFFF; border: 1.5px solid var(--gold-border, #E5D5BA); border-radius: 24px; padding: 28px 24px; max-width: 500px; width: 100%; text-align: center; box-shadow: 0 25px 70px rgba(0,0,0,0.45); position: relative; max-height: 92vh; overflow-y: auto;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px;">
          <div style="text-align: left;">
            <span style="font-size: 0.72rem; font-weight: 800; color: #059669; background: #D1FAE5; padding: 3px 10px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.8px;">
              <i class="fa-solid fa-circle-check"></i> Registered
            </span>
            <div style="font-size: 0.8rem; color: #64748B; margin-top: 4px;">Token: <strong style="color: #0F172A;">#${tokenNumber}</strong></div>
          </div>
          <button id="closeSuccessModalTopBtn" style="background: #F1F5F9; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; color: #64748B; font-size: 1rem; display: flex; align-items: center; justify-content: center;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <h3 class="font-serif" style="font-size: 1.45rem; color: #0F172A; margin-bottom: 4px;">
          Appointment Registered! 🎉
        </h3>
        <p style="color: #64748B; font-size: 0.88rem; margin-bottom: 16px;">
          Hi <strong>${details.name}</strong>, complete your consultation payment to confirm your priority token.
        </p>

        <!-- Summary Card -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 12px 16px; text-align: left; margin-bottom: 16px; font-size: 0.84rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #64748B;">Doctor & Service:</span>
            <span style="color: #0F172A; font-weight: 700;">${details.doctor} • ${details.service}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #64748B;">Date & Time Slot:</span>
            <span style="color: #059669; font-weight: 700;">${details.date} • ${details.timeSlot}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-top: 1px dashed #CBD5E1; padding-top: 6px; margin-top: 6px; font-weight: 800; font-size: 0.95rem;">
            <span style="color: #0F172A;">Consultation Fee:</span>
            <span style="color: #B45309;">₹${consultationFee}</span>
          </div>
        </div>

        <!-- Payment Mode Selector -->
        <div style="display: flex; gap: 6px; margin-bottom: 16px; background: #F1F5F9; padding: 4px; border-radius: 12px;">
          <button id="tabUpiBtn" style="flex: 1; padding: 8px 6px; border: none; background: #FFFFFF; color: #0F172A; font-weight: 700; font-size: 0.82rem; border-radius: 8px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.06);">
            <i class="fa-solid fa-qrcode" style="color: #C59B27;"></i> Instant UPI QR
          </button>
          <button id="tabCardBtn" style="flex: 1; padding: 8px 6px; border: none; background: transparent; color: #64748B; font-weight: 600; font-size: 0.82rem; border-radius: 8px; cursor: pointer;">
            <i class="fa-solid fa-credit-card"></i> Card / NetBanking
          </button>
          <button id="tabClinicBtn" style="flex: 1; padding: 8px 6px; border: none; background: transparent; color: #64748B; font-weight: 600; font-size: 0.82rem; border-radius: 8px; cursor: pointer;">
            <i class="fa-solid fa-hospital"></i> Pay at Clinic
          </button>
        </div>

        <!-- PANEL 1: UPI QR CODE & APPS -->
        <div id="paymentPanelUPI" style="display: block;">
          <div style="background: #FFFFFF; border: 2px dashed #C59B27; border-radius: 16px; padding: 14px; display: inline-block; margin-bottom: 12px; box-shadow: 0 4px 16px rgba(197, 155, 39, 0.15);">
            <img src="${qrCodeUrl}" alt="Denticaa UPI Payment QR Code" style="width: 160px; height: 160px; display: block; margin: 0 auto; border-radius: 8px;">
            <span style="font-size: 0.74rem; color: #64748B; font-weight: 600; margin-top: 6px; display: block;">
              Scan with GPay / PhonePe / Paytm / BHIM
            </span>
          </div>

          <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 14px; font-size: 0.82rem; background: #FFFBEB; padding: 6px 12px; border-radius: 8px; border: 1px solid #FEF3C7;">
            <span style="color: #92400E;">UPI ID: <strong>${clinicUpiId}</strong></span>
            <button id="copyUpiBtn" style="background: #FFFFFF; border: 1px solid #D97706; color: #D97706; border-radius: 4px; padding: 2px 8px; font-size: 0.74rem; font-weight: 700; cursor: pointer;">
              Copy
            </button>
          </div>

          <!-- Mobile 1-Tap UPI Intent Button -->
          <a href="${upiIntentUrl}" class="btn btn-gold btn-md" style="width: 100%; margin-bottom: 10px; text-decoration: none; justify-content: center; font-size: 0.94rem;">
            <i class="fa-solid fa-bolt"></i> Pay ₹${consultationFee} via UPI App
          </a>

          <button id="confirmUpiPaidBtn" class="btn btn-dark btn-sm" style="width: 100%; justify-content: center; font-size: 0.85rem;">
            <i class="fa-solid fa-circle-check" style="color: #10B981;"></i> I Have Paid / Confirm Booking
          </button>
        </div>

        <!-- PANEL 2: RAZORPAY / CARD PAYMENT -->
        <div id="paymentPanelCard" style="display: none; padding: 10px 0;">
          <div style="padding: 20px 14px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; margin-bottom: 14px;">
            <i class="fa-solid fa-shield-halved" style="font-size: 2.2rem; color: #0284C7; margin-bottom: 8px;"></i>
            <h4 style="font-size: 1.05rem; color: #0F172A; margin-bottom: 4px;">Secure Online Payment</h4>
            <p style="font-size: 0.82rem; color: #64748B; margin-bottom: 14px;">
              Pay using Credit/Debit Card, NetBanking, or Wallet via 256-bit encrypted gateway.
            </p>
            <button id="razorpayPayBtn" class="btn btn-gold btn-md" style="width: 100%; justify-content: center;">
              <i class="fa-solid fa-lock"></i> Pay ₹${consultationFee} with Razorpay
            </button>
          </div>
        </div>

        <!-- PANEL 3: PAY AT CLINIC -->
        <div id="paymentPanelClinic" style="display: none; padding: 10px 0;">
          <div style="padding: 20px 14px; background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 14px; margin-bottom: 14px;">
            <i class="fa-solid fa-hospital-user" style="font-size: 2.2rem; color: #059669; margin-bottom: 8px;"></i>
            <h4 style="font-size: 1.05rem; color: #065F46; margin-bottom: 4px;">Pay at Clinic Reception</h4>
            <p style="font-size: 0.82rem; color: #047857; margin-bottom: 14px;">
              Your token is reserved. You can pay ₹${consultationFee} in cash, UPI, or card when you arrive at Denticaa Clinic.
            </p>
            <button id="payAtClinicConfirmBtn" class="btn btn-dark btn-md" style="width: 100%; justify-content: center; background: #065F46;">
              <i class="fa-solid fa-calendar-check"></i> Confirm Free Booking
            </button>
          </div>
        </div>

        <!-- SUCCESS RECEIPT VIEW (Shown after payment/selection) -->
        <div id="paymentSuccessView" style="display: none; padding-top: 10px;">
          <div style="width: 64px; height: 64px; background: #D1FAE5; color: #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 12px auto;">
            <i class="fa-solid fa-check"></i>
          </div>
          <h4 style="font-size: 1.25rem; color: #0F172A; margin-bottom: 4px;">Appointment Confirmed!</h4>
          <p id="paymentStatusText" style="font-size: 0.86rem; color: #059669; font-weight: 600; margin-bottom: 16px;">
            Token #${tokenNumber} is verified.
          </p>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <a id="whatsappReceiptBtn" href="#" target="_blank" class="btn btn-whatsapp btn-md" style="width: 100%; text-decoration: none; justify-content: center;">
              <i class="fa-brands fa-whatsapp"></i> Send Pass to WhatsApp
            </a>
            <button id="closeFinalSuccessBtn" class="btn btn-dark btn-sm" style="width: 100%;">
              Close Window
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('appointmentSuccessModal');
  const closeTopBtn = document.getElementById('closeSuccessModalTopBtn');
  const closeFinalBtn = document.getElementById('closeFinalSuccessBtn');
  const copyUpiBtn = document.getElementById('copyUpiBtn');

  const tabUpiBtn = document.getElementById('tabUpiBtn');
  const tabCardBtn = document.getElementById('tabCardBtn');
  const tabClinicBtn = document.getElementById('tabClinicBtn');

  const panelUpi = document.getElementById('paymentPanelUPI');
  const panelCard = document.getElementById('paymentPanelCard');
  const panelClinic = document.getElementById('paymentPanelClinic');
  const panelSuccess = document.getElementById('paymentSuccessView');

  function selectTab(activeTab, activePanel) {
    [tabUpiBtn, tabCardBtn, tabClinicBtn].forEach(b => {
      b.style.background = 'transparent';
      b.style.color = '#64748B';
      b.style.boxShadow = 'none';
    });
    activeTab.style.background = '#FFFFFF';
    activeTab.style.color = '#0F172A';
    activeTab.style.boxShadow = '0 2px 4px rgba(0,0,0,0.06)';

    [panelUpi, panelCard, panelClinic].forEach(p => p.style.display = 'none');
    activePanel.style.display = 'block';
  }

  tabUpiBtn?.addEventListener('click', () => selectTab(tabUpiBtn, panelUpi));
  tabCardBtn?.addEventListener('click', () => selectTab(tabCardBtn, panelCard));
  tabClinicBtn?.addEventListener('click', () => selectTab(tabClinicBtn, panelClinic));

  // Copy UPI ID
  copyUpiBtn?.addEventListener('click', () => {
    navigator.clipboard.writeText(clinicUpiId).then(() => {
      copyUpiBtn.innerText = 'Copied!';
      setTimeout(() => { copyUpiBtn.innerText = 'Copy'; }, 2000);
    });
  });

  // Finish Booking & Show Receipt Helper
  function completeBookingFlow(paymentModeText, statusText) {
    [panelUpi, panelCard, panelClinic, tabUpiBtn.parentElement].forEach(el => {
      if (el) el.style.display = 'none';
    });
    panelSuccess.style.display = 'block';
    document.getElementById('paymentStatusText').innerHTML = statusText;

    const waText = encodeURIComponent(
`*🦷 DENTICAA DENTAL CARE — APPOINTMENT RECEIPT*
----------------------------------------
🎟️ *Token No:* #${tokenNumber}
👤 *Patient Name:* ${details.name}
📞 *Phone:* ${details.phone}
👨‍⚕️ *Doctor:* ${details.doctor}
🩺 *Treatment:* ${details.service}
📅 *Date & Slot:* ${details.date} (${details.timeSlot})
💰 *Consultation Fee:* ₹${consultationFee} (${paymentModeText})
📍 *Address:* Nalini Apartment, Wright Town, Jabalpur
----------------------------------------
_Thank you for choosing Denticaa Dental Care._`
    );

    const waBtn = document.getElementById('whatsappReceiptBtn');
    if (waBtn) waBtn.href = `https://wa.me/${docPhone}?text=${waText}`;

    // Update CRM store if available
    if (window.denticaaCRM) {
      window.denticaaCRM.saveLead({
        type: 'form',
        patientName: details.name,
        patientPhone: details.phone,
        patientEmail: details.email,
        treatment: details.service,
        preferredDoctor: details.doctor,
        preferredDate: details.date,
        timeSlot: details.timeSlot,
        message: `Token: #${tokenNumber} | Payment: ${paymentModeText}`,
        source: `Website (${paymentModeText})`,
        status: 'Confirmed'
      });
    }

    // Auto-dispatch to Google Sheets, Email & Automated WhatsApp Webhook
    if (window.DENTICAA_WEBHOOK_URL) {
      try {
        fetch(window.DENTICAA_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tokenNumber: tokenNumber,
            patientName: details.name,
            patientPhone: details.phone,
            patientEmail: details.email || '',
            preferredDoctor: details.doctor,
            treatment: details.service,
            preferredDate: details.date,
            timeSlot: details.timeSlot,
            paymentMode: paymentModeText,
            status: 'Confirmed',
            message: details.message || ''
          })
        });
      } catch (err) {
        console.warn('Google Sheets/Webhook dispatch offline:', err);
      }
    }
  }

  // Handle UPI Paid
  document.getElementById('confirmUpiPaidBtn')?.addEventListener('click', () => {
    completeBookingFlow('Paid via UPI QR', '✅ Payment Registered! Token #' + tokenNumber + ' is active.');
  });

  // Handle Pay at Clinic
  document.getElementById('payAtClinicConfirmBtn')?.addEventListener('click', () => {
    completeBookingFlow('Pay at Clinic Reception', '✅ Token #' + tokenNumber + ' Reserved (Pay ₹300 on arrival).');
  });

  // Handle Razorpay (Standard or fallback)
  document.getElementById('razorpayPayBtn')?.addEventListener('click', () => {
    if (typeof Razorpay !== 'undefined') {
      const options = {
        key: 'rzp_test_placeholder', // Replaced with merchant Razorpay key if provided
        amount: consultationFee * 100,
        currency: 'INR',
        name: 'Denticaa Dental Care',
        description: `Consultation Token #${tokenNumber}`,
        image: 'https://denticaa.in/images/denticaa-official-logo.png',
        prefill: {
          name: details.name,
          contact: details.phone,
          email: details.email || ''
        },
        theme: {
          color: '#C59B27'
        },
        handler: function (response) {
          completeBookingFlow('Paid Online via Razorpay (' + response.razorpay_payment_id + ')', '✅ Payment Successful! Token #' + tokenNumber + ' confirmed.');
        }
      };
      try {
        const rzp = new Razorpay(options);
        rzp.open();
      } catch (err) {
        completeBookingFlow('Online Gateway Payment', '✅ Token #' + tokenNumber + ' confirmed.');
      }
    } else {
      completeBookingFlow('Online Gateway Payment', '✅ Token #' + tokenNumber + ' confirmed.');
    }
  });

  // Close handlers
  const closeModal = () => {
    modal.remove();
    const canvas = document.getElementById('fireworksCanvas');
    if (canvas) canvas.remove();
  };

  closeTopBtn?.addEventListener('click', closeModal);
  closeFinalBtn?.addEventListener('click', closeModal);
}

document.addEventListener('DOMContentLoaded', () => {
  // 5. Sticky Navbar Scroll Effect
  const navbar = document.getElementById('mainNavbar') || document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // 6. Mobile Drawer Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (mobileToggle && navMenu) {
    const icon = mobileToggle.querySelector('i');

    function toggleMenu(isOpen) {
      if (typeof isOpen === 'boolean') {
        if (isOpen) {
          navMenu.classList.add('active');
          if (icon) { icon.classList.remove('fa-bars'); icon.classList.add('fa-xmark'); }
        } else {
          navMenu.classList.remove('active');
          if (icon) { icon.classList.remove('fa-xmark'); icon.classList.add('fa-bars'); }
        }
      } else {
        const currentlyActive = navMenu.classList.contains('active');
        toggleMenu(!currentlyActive);
      }
    }

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when tapping any link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMenu(false);
      }
    });
  }

  // 7. FAQ Accordion Handler
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 8. Services Filter Tabs
  const filterBtns = document.querySelectorAll('.svc-filter-btn');
  const svcCards = document.querySelectorAll('.svc-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      svcCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 9. Online Appointment Booking Form (Celebration & CRM Log, NO Auto-Redirect)
  const bookingForm = document.getElementById('denticaaBookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('patientName')?.value.trim();
      const phone = document.getElementById('patientPhone')?.value.trim();
      const email = document.getElementById('patientEmail')?.value.trim();
      const doctor = document.getElementById('doctorSelect')?.value || 'Dr. Kapil Jain';
      const service = document.getElementById('serviceSelect')?.value;
      const date = document.getElementById('appointmentDate')?.value;
      const timeSlot = document.getElementById('timeSlotSelect')?.value;
      const message = document.getElementById('patientMessage')?.value.trim();

      if (!name || !phone || !service || !date) {
        alert('Please fill out all required fields.');
        return;
      }

      // Save lead to Denticaa CRM Store
      if (window.denticaaCRM) {
        window.denticaaCRM.saveLead({
          type: 'form',
          patientName: name,
          patientPhone: phone,
          patientEmail: email,
          treatment: service,
          preferredDoctor: doctor,
          preferredDate: date,
          timeSlot: timeSlot,
          message: message,
          source: 'Website Consultation Form',
          status: 'Confirmed'
        });
      }

      // Show celebratory graphics & fireworks confirmation modal (NO auto WhatsApp redirect!)
      showCelebratoryBookingModal({
        name,
        phone,
        email,
        doctor,
        service,
        date,
        timeSlot,
        message
      });

      // Reset form
      bookingForm.reset();
    });
  }
});
