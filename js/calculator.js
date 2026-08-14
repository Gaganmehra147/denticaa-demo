/**
 * DENTICAA DENTAL CLINIC - TREATMENT & COST ESTIMATOR CALCULATOR
 * Inspired by modern super speciality dental tools
 */

const dentalEstimatorData = {
  rct: {
    title: "Painless Laser Root Canal (RCT)",
    estimate: "₹2,499 - ₹4,500",
    period: "per tooth",
    specs: [
      "Single-Sitting 45-Min Procedure",
      "Painless German Rotary Technology",
      "Laser Canal Sterilization & Bio-Sealing",
      "Includes Digital X-Ray Check"
    ],
    bookingParam: "Painless Root Canal (RCT)"
  },
  veneers: {
    title: "Hollywood Smile & Porcelain Veneers",
    estimate: "₹6,999 - ₹12,000",
    period: "per tooth",
    specs: [
      "Customized 3D Digital Smile Preview",
      "Ultra-Thin High Strength E-Max Porcelain",
      "Zero Staining & 10+ Year Durability",
      "Closes Gaps & Fixes Chipped Teeth"
    ],
    bookingParam: "Cosmetic Smile Makeover / Veneers"
  },
  implants: {
    title: "Swiss / Titanium Dental Implants",
    estimate: "₹18,999 - ₹32,000",
    period: "per implant unit",
    specs: [
      "Lifetime Structural Warranty",
      "Instant Loading Tooth Crown Option",
      "Preserves Natural Facial Bone Structure",
      "99.8% Clinical Integration Success"
    ],
    bookingParam: "Dental Implants"
  },
  aligners: {
    title: "Invisible Clear Aligners",
    estimate: "₹34,999 - ₹65,000",
    period: "full customized treatment",
    specs: [
      "100% Transparent & Barely Noticeable",
      "No Painful Metal Wires or Food Restrictions",
      "Complete 3D Digital Progression Video",
      "Easy Monthly EMI Options Available"
    ],
    bookingParam: "Invisible Clear Aligners"
  },
  whitening: {
    title: "Laser Teeth Whitening Luxury Spa",
    estimate: "₹4,500 - ₹7,500",
    period: "complete session",
    specs: [
      "Up to 8 Shades Lighter in 45 Minutes",
      "Enamel-Safe Zero Sensitivity Formula",
      "Removes Years of Tea/Coffee/Tobacco Stains",
      "Includes Anti-Sensitivity Polishing"
    ],
    bookingParam: "Teeth Whitening / Bleaching"
  },
  membership: {
    title: "Denticaa Yearly Care Plan",
    estimate: "₹999",
    period: "1 Full Year Membership",
    specs: [
      "2 Free Professional Cleanings & Polishings",
      "Unlimited Doctor Consultations",
      "Flat 20% Discount on All Treatments",
      "VIP Priority Slot Booking"
    ],
    bookingParam: "Yearly Dental Plan (₹999)"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const optBtns = document.querySelectorAll('.calc-opt-btn');
  const resTitle = document.getElementById('calcResTitle');
  const resPrice = document.getElementById('calcResPrice');
  const resPeriod = document.getElementById('calcResPeriod');
  const resSpecs = document.getElementById('calcResSpecs');
  const calcBookBtn = document.getElementById('calcBookBtn');

  if (!optBtns.length || !resTitle) return;

  function updateCalculator(key) {
    const data = dentalEstimatorData[key];
    if (!data) return;

    resTitle.textContent = data.title;
    resPrice.textContent = data.estimate;
    resPeriod.textContent = ` (${data.period})`;

    resSpecs.innerHTML = '';
    data.specs.forEach(spec => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${spec}`;
      resSpecs.appendChild(li);
    });

    if (calcBookBtn) {
      calcBookBtn.href = `https://wa.me/919575216655?text=${encodeURIComponent('Hello Denticaa Dental Clinic, I want to book a consultation for ' + data.bookingParam + ' (' + data.estimate + ')')}`;
    }
  }

  optBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      optBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-treatment');
      updateCalculator(key);
    });
  });

  // Default selection
  updateCalculator('rct');
});
