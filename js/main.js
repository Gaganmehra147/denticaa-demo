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

// 4. Show Celebratory Booking Confirmation Modal (No WhatsApp Auto-Redirect)
function showCelebratoryBookingModal(details) {
  // Trigger fireworks burst!
  triggerCelebratoryFireworks();

  const existing = document.getElementById('appointmentSuccessModal');
  if (existing) existing.remove();

  const docPhone = details.doctor.includes('Anmoll') ? '919575552165' : '919575216665';
  const optionalWaUrl = `https://wa.me/${docPhone}?text=${encodeURIComponent(`Hello Denticaa, I just submitted an appointment request for ${details.name} on ${details.date} (${details.timeSlot}).`)}`;

  const modalHTML = `
    <div id="appointmentSuccessModal" style="position: fixed; inset: 0; background: rgba(15, 20, 28, 0.85); backdrop-filter: blur(12px); z-index: 10003; display: flex; align-items: center; justify-content: center; padding: 20px; animation: modalFadeIn 0.35s ease;">
      <div style="background: var(--bg-card, #FAF9F7); border: 2px solid var(--gold-border, #E5D5BA); border-radius: 28px; padding: 40px 36px; max-width: 520px; width: 100%; text-align: center; box-shadow: 0 25px 70px rgba(0,0,0,0.4); position: relative;">
        
        <!-- Animated Glowing Success Badge -->
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #FFFFFF; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.4rem; margin: 0 auto 20px auto; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4); border: 3px solid #FFFFFF;">
          <i class="fa-solid fa-check"></i>
        </div>

        <span style="font-size: 0.78rem; font-weight: 800; color: #059669; background: #D1FAE5; padding: 4px 14px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; display: inline-block; margin-bottom: 10px;">
          <i class="fa-solid fa-sparkles"></i> Confirmed in Clinic System
        </span>

        <h3 class="font-serif" style="font-size: 1.75rem; color: var(--text-dark, #1A1F28); margin-bottom: 8px; line-height: 1.2;">
          🎉 Appointment Booked!
        </h3>
        <p style="color: var(--text-muted, #5A6270); font-size: 0.94rem; margin-bottom: 24px; line-height: 1.5;">
          Thank you, <strong>${details.name}</strong>! Your consultation request has been successfully registered at Denticaa Dental Care.
        </p>

        <!-- Summary Ticket Box -->
        <div style="background: #FFFFFF; border: 1.5px solid var(--border-subtle, #E8E3DC); border-radius: 16px; padding: 18px 20px; text-align: left; margin-bottom: 24px; box-shadow: 0 4px 14px rgba(0,0,0,0.04);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.88rem;">
            <span style="color: #64748B; font-weight: 600;">👨‍⚕️ Doctor:</span>
            <span style="color: #0F172A; font-weight: 700;">${details.doctor}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.88rem;">
            <span style="color: #64748B; font-weight: 600;">🩺 Treatment:</span>
            <span style="color: #0F172A; font-weight: 700;">${details.service}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.88rem;">
            <span style="color: #64748B; font-weight: 600;">📅 Date & Slot:</span>
            <span style="color: #059669; font-weight: 700;">${details.date} • ${details.timeSlot}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.84rem; border-top: 1px dashed #CBD5E1; padding-top: 8px; margin-top: 8px;">
            <span style="color: #64748B; font-weight: 600;">📍 Location:</span>
            <span style="color: #0F172A; font-weight: 600;">Wright Town, Jabalpur</span>
          </div>
        </div>

        <p style="font-size: 0.82rem; color: #64748B; margin-bottom: 22px;">
          📞 Our clinic reception team will call/message you shortly to confirm your token.
        </p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button id="closeSuccessModalBtn" class="btn btn-gold btn-lg" style="width: 100%; cursor: pointer;">
            <i class="fa-solid fa-circle-check"></i> Done / Great!
          </button>
          <a href="${optionalWaUrl}" target="_blank" class="btn btn-whatsapp btn-sm" style="width: 100%; text-decoration: none; justify-content: center;">
            <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp (Optional)
          </a>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('appointmentSuccessModal');
  const closeBtn = document.getElementById('closeSuccessModalBtn');

  closeBtn?.addEventListener('click', () => {
    modal.remove();
    const canvas = document.getElementById('fireworksCanvas');
    if (canvas) canvas.remove();
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
      const canvas = document.getElementById('fireworksCanvas');
      if (canvas) canvas.remove();
    }
  });
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
