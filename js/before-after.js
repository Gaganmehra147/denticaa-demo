/* ==========================================================================
   DENTICAA DENTAL CLINIC — DYNAMIC BEFORE & AFTER SLIDER CONTROLLER
   Dynamically loads transformations from CRM store and controls split image sliders
   ========================================================================== */

function renderAndInitTransformations() {
  const grid = document.getElementById('transformationsGrid');
  if (!grid) return;

  const transformations = (window.denticaaCRM && window.denticaaCRM.getTransformations) 
    ? window.denticaaCRM.getTransformations() 
    : [
        {
          id: 'TR-1',
          tag: 'Clear Aligners • 9 Months',
          title: 'Severe Crowding Corrected',
          desc: 'Treated by Dr. Kapil Jain with custom clear aligners, achieving symmetrical arch alignment without tooth extraction.',
          beforeImg: 'images/before-crowding.png',
          afterImg: 'images/after-crowding.png'
        },
        {
          id: 'TR-2',
          tag: 'Porcelain Veneers • 2 Visits',
          title: 'Hollywood Smile Makeover',
          desc: 'Designed by Dr. Mrs Anmoll Jain with ultra-thin porcelain veneers to restore chipped enamel and brighten shade permanently.',
          beforeImg: 'images/before-veneers.png',
          afterImg: 'images/after-veneers.png'
        },
        {
          id: 'TR-3',
          tag: 'Ceramic Braces • 14 Months',
          title: 'Deep Bite & Spacing Closure',
          desc: 'Treated with aesthetic ceramic braces by Dr. Kapil Jain, restoring functional chewing harmony and facial balance.',
          beforeImg: 'images/before-spacing.png',
          afterImg: 'images/after-spacing.png'
        }
      ];

  // Render cards HTML
  grid.innerHTML = transformations.map((tr, index) => `
    <div class="ba-card" data-id="${tr.id || index}">
      <div class="ba-slider-wrapper">
        <img src="${tr.afterImg}" alt="${tr.title} - After Result" class="ba-img ba-img-after">
        <div class="ba-before-wrap" style="width: 50%;">
          <img src="${tr.beforeImg}" alt="${tr.title} - Before Treatment" class="ba-img ba-img-before">
        </div>
        <div class="ba-handle" style="left: 50%;">
          <span>&lt; &gt;</span>
        </div>
        <span class="ba-badge ba-badge-before">BEFORE</span>
        <span class="ba-badge ba-badge-after">AFTER RESULT</span>
        <input type="range" min="0" max="100" value="50" class="ba-range-slider" aria-label="Before and after comparison slider">
      </div>
      <div class="ba-card-body">
        <span class="ba-tag"><i class="fa-regular fa-clock"></i> ${tr.tag}</span>
        <h3 class="ba-title font-serif">${tr.title}</h3>
        <p class="ba-desc">${tr.desc}</p>
      </div>
    </div>
  `).join('');

  // Attach interactive slider event listeners
  const sliderWrappers = grid.querySelectorAll('.ba-slider-wrapper');

  sliderWrappers.forEach((wrapper) => {
    const beforeWrap = wrapper.querySelector('.ba-before-wrap');
    const handle = wrapper.querySelector('.ba-handle');
    const rangeInput = wrapper.querySelector('.ba-range-slider');
    const beforeImg = wrapper.querySelector('.ba-img-before');

    function syncImageWidth() {
      if (beforeImg && wrapper) {
        beforeImg.style.width = `${wrapper.getBoundingClientRect().width}px`;
      }
    }

    syncImageWidth();
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => syncImageWidth());
      ro.observe(wrapper);
    }
    window.addEventListener('resize', syncImageWidth);
    window.addEventListener('orientationchange', () => setTimeout(syncImageWidth, 100));

    function updateSlider(val) {
      const percentage = Math.max(0, Math.min(100, val));
      if (beforeWrap) beforeWrap.style.width = `${percentage}%`;
      if (handle) handle.style.left = `${percentage}%`;
      if (rangeInput) rangeInput.value = percentage;
    }

    if (rangeInput) {
      rangeInput.addEventListener('input', (e) => {
        updateSlider(e.target.value);
      });
    }

    let isInteracting = false;

    function handlePointerMove(clientX) {
      const rect = wrapper.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      let percentage = (offsetX / rect.width) * 100;
      updateSlider(percentage);
    }

    wrapper.addEventListener('pointerdown', (e) => {
      isInteracting = true;
      handlePointerMove(e.clientX);
    });

    window.addEventListener('pointerup', () => {
      isInteracting = false;
    });

    wrapper.addEventListener('pointermove', (e) => {
      if (isInteracting) {
        handlePointerMove(e.clientX);
      }
    });

    wrapper.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX);
      }
    }, { passive: true });

    wrapper.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX);
      }
    }, { passive: true });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderAndInitTransformations();

  // Listen to CRM updates
  window.addEventListener('denticaa_transformations_updated', () => {
    renderAndInitTransformations();
  });
});
