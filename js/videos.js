/**
 * DENTICAA DENTAL CLINIC - INSTAGRAM VIDEOS & REELS CONTROLLER
 * Official Instagram: @denticaa_dentalclinicjabalpur
 */

const denticaaReelsData = [
  {
    id: "reel-tour",
    category: "tour",
    tag: "Clinic Tour",
    title: "Luxurious Clinic Walkthrough | Denticaa Wright Town",
    description: "Step inside Denticaa Dental Clinic Jabalpur. State-of-the-art painless German tech, sterile environment & warm gold luxury ambiance.",
    duration: "0:45",
    views: "3.2K",
    likes: "420",
    instaUrl: "https://www.instagram.com/ye_hai_jabalpur/reel/DbdgWNZB9QK/",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-dentist-examining-a-patients-teeth-41416-large.mp4",
    posterGradient: "linear-gradient(135deg, #071526 0%, #163a5f 100%)"
  },
  {
    id: "reel-smile",
    category: "makeover",
    tag: "Smile Makeover",
    title: "Damaged & Uneven Front Teeth Transformation",
    description: "From chipped & uneven teeth to a confident, natural smile! See the step-by-step aesthetic composite & veneer restoration.",
    duration: "0:38",
    views: "2.8K",
    likes: "389",
    instaUrl: "https://www.instagram.com/denticaa_dentalclinicjabalpur/reel/Db2-ivMhDgt/",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-dentist-showing-a-patient-their-teeth-in-a-mirror-41415-large.mp4",
    posterGradient: "linear-gradient(135deg, #102a4c 0%, #0d223a 100%)"
  },
  {
    id: "reel-rct",
    category: "treatments",
    tag: "Painless RCT",
    title: "When Do You Need a Root Canal Treatment?",
    description: "Persistent tooth pain, cold/hot sensitivity or swelling? Learn how painless modern rotary RCT saves your natural tooth in 1 single sitting.",
    duration: "0:52",
    views: "4.1K",
    likes: "512",
    instaUrl: "https://www.instagram.com/denticaa_dentalclinicjabalpur/reel/DbHz7EJhbmE/",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-dentist-working-on-a-patients-teeth-41417-large.mp4",
    posterGradient: "linear-gradient(135deg, #0b1f38 0%, #1e3a5f 100%)"
  },
  {
    id: "reel-routine",
    category: "tips",
    tag: "Doctor Tips",
    title: "Dentist's 6-Minute Daily Oral Care Routine",
    description: "Dr. Anmol Jain shares the ultimate 6-minute daily dental health routine for healthy gums, white teeth and fresh breath.",
    duration: "0:48",
    views: "5.6K",
    likes: "680",
    instaUrl: "https://www.instagram.com/denticaa_dentalclinicjabalpur/",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-female-dentist-explaining-a-procedure-to-a-patient-41418-large.mp4",
    posterGradient: "linear-gradient(135deg, #183d6c 0%, #071526 100%)"
  },
  {
    id: "reel-plan",
    category: "tour",
    tag: "₹999 Dental Plan",
    title: "Denticaa Yearly Dental Care Plan at ₹999",
    description: "Protect your family's smile all year long! Get 2 free cleanings, consultations, and major treatment discounts for just ₹999/year.",
    duration: "0:40",
    views: "6.3K",
    likes: "810",
    instaUrl: "https://www.instagram.com/ye_hai_jabalpur/reel/DbdgWNZB9QK/",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-dentist-talking-with-a-patient-in-a-clinic-41414-large.mp4",
    posterGradient: "linear-gradient(135deg, #071526 0%, #c59b27 100%)"
  },
  {
    id: "reel-aligners",
    category: "makeover",
    tag: "Invisible Aligners",
    title: "Invisible Aligners vs Traditional Metal Braces",
    description: "Straighten your teeth discreetly without metal wires. Dr. Kapil Jain explains how customized 3D aligners work effortlessly.",
    duration: "0:55",
    views: "3.9K",
    likes: "460",
    instaUrl: "https://www.instagram.com/denticaa_dentalclinicjabalpur/reel/DbqUyQdBz8p/",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-dentist-adjusting-a-light-above-a-patient-41413-large.mp4",
    posterGradient: "linear-gradient(135deg, #0d223a 0%, #102a4c 100%)"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const reelsGrid = document.getElementById('reelsGrid');
  const filterBtns = document.querySelectorAll('.reel-tab-btn');
  const videoModal = document.getElementById('videoModal');
  const modalVideoPlayer = document.getElementById('modalVideoPlayer');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalInstaLink = document.getElementById('modalInstaLink');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  // Render Reels Cards
  function renderReels(filter = 'all') {
    if (!reelsGrid) return;
    reelsGrid.innerHTML = '';

    const filtered = filter === 'all' 
      ? denticaaReelsData 
      : denticaaReelsData.filter(item => item.category === filter);

    filtered.forEach(reel => {
      const card = document.createElement('div');
      card.className = 'reel-card';
      card.setAttribute('data-id', reel.id);

      card.innerHTML = `
        <div class="reel-top-badges">
          <span class="reel-tag"><i class="fa-solid fa-sparkles"></i> ${reel.tag}</span>
          <span class="reel-insta-icon" title="View on Instagram"><i class="fa-brands fa-instagram"></i></span>
        </div>
        
        <div class="reel-play-btn" title="Play Video">
          <i class="fa-solid fa-play"></i>
        </div>

        <div class="reel-overlay"></div>

        <div class="reel-content">
          <h4 class="reel-title">${reel.title}</h4>
          <p class="reel-desc">${reel.description}</p>
          <div class="reel-footer">
            <span><i class="fa-solid fa-eye"></i> ${reel.views} views</span>
            <span><i class="fa-solid fa-heart"></i> ${reel.likes}</span>
            <span><i class="fa-solid fa-clock"></i> ${reel.duration}</span>
          </div>
        </div>
      `;

      card.style.background = reel.posterGradient;

      card.addEventListener('click', () => {
        openVideoModal(reel);
      });

      reelsGrid.appendChild(card);
    });
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');
      renderReels(category);
    });
  });

  // Modal Open
  function openVideoModal(reel) {
    if (!videoModal || !modalVideoPlayer) return;
    
    modalTitle.textContent = reel.title;
    modalDesc.textContent = reel.description;
    modalInstaLink.href = reel.instaUrl;
    
    modalVideoPlayer.src = reel.videoSrc;
    videoModal.classList.add('active');
    
    modalVideoPlayer.play().catch(e => {
      console.log('Autoplay blocked, user interaction required', e);
    });
  }

  // Modal Close
  function closeVideoModal() {
    if (!videoModal || !modalVideoPlayer) return;
    videoModal.classList.remove('active');
    modalVideoPlayer.pause();
    modalVideoPlayer.currentTime = 0;
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeVideoModal);
  }

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeVideoModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
      closeVideoModal();
    }
  });

  // Initial render
  renderReels('all');
});
