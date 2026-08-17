/* ==========================================================================
   DENTICAA DENTAL CLINIC — SMART MULTILINGUAL GEMINI AI DENTAL CHATBOT
   Features: Name, Phone, Age, Gender, Slot Conflict Check & CRM Lead Booking
   ========================================================================== */

const GEMINI_API_KEY = "AQ.Ab8RN6LbfJAate3ek5nyDpm2P4HfYQEbWEalClHiUfWI2CnL7A";

const DENTICAA_SYSTEM_PROMPT = `
You are the official AI Dental Concierge for "Denticaa Dental Clinic" in Wright Town, Jabalpur (M.P.), India.
Your goal is to answer patients' questions accurately in their language (Hindi, Hinglish, or English), and politely collect all booking details to schedule an appointment.

REQUIRED BOOKING DETAILS TO COLLECT FROM THE PATIENT:
1. Patient's Full Name
2. Contact Mobile Number (10-digit)
3. Age & Gender
4. Preferred Doctor (Dr. Kapil Jain for Orthodontics/Aligners/Braces OR Dr. Mrs Anmoll Jain for Cosmetic/Veneers/Laser RCT/Whitening)
5. Preferred Date
6. Preferred Time Slot (Morning 10:30 AM - 01:30 PM OR Evening 05:00 PM - 08:30 PM)

SLOT CONFLICT RULE:
- If an appointment for the doctor on that date and time slot is already occupied, politely inform them:
  "Is time aur date par doctor ka appointment already booked hai. Kripya aap koi aur date ya time slot choose kijiye."
- Once valid details are confirmed, end with:
  "Thank you for visiting Denticaa! 🙏 Aapka appointment aapke chune hue time par book ho gaya hai."

CLINIC INFORMATION:
- Clinic: Denticaa Dental Care, Ground Floor, Nalini Apartment, Near Astha Medical, Mohanlal Hargobindas Hospital Road, Wright Town, Jabalpur, MP 482001.
- Doctors:
  * Dr. Kapil Jain (BDS, MDS Orthodontics & Dentofacial Orthopedics — 14+ yrs exp, People's College Bhopal 2012, expert in braces, invisible clear aligners, dental microscopes). Phone: +91 9575216655.
  * Dr. Mrs Anmoll Jain (BDS Cosmetic Dental Surgeon — expert in Hollywood smile makeovers, porcelain veneers, single-sitting painless laser root canals, LED whitening). Phone: +91 9575552165.
- Timings: Morning (10:30 AM – 01:30 PM), Evening (05:00 PM – 08:30 PM).

COMMUNICATION STYLE:
- Always reply in the same language the patient used (Hindi, Hinglish, or English).
- Keep replies empathetic, concise, and helpful (2-4 lines).
`;

class DenticaaAIChatbot {
  constructor() {
    this.messages = [];
    this.isOpen = false;
    this.bookingState = {
      name: '',
      phone: '',
      age: '',
      gender: '',
      doctor: '',
      treatment: '',
      date: '',
      timeSlot: ''
    };
    this.initUI();
    this.bindEvents();
  }

  initUI() {
    if (!document.getElementById('denticaaChatbotModal')) {
      const chatHTML = `
        <!-- DENTICAA AI CHATBOT MODAL WIDGET -->
        <div class="chatbot-modal" id="denticaaChatbotModal">
          <div class="chatbot-header">
            <div class="chatbot-header-info">
              <div class="chatbot-avatar">
                <img src="images/denticaa-logo.png" alt="Denticaa AI" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
                <span class="chatbot-online-pulse"></span>
              </div>
              <div>
                <h4 class="chatbot-title">Denticaa AI Assistant</h4>
                <p class="chatbot-status">🟢 Online • Hindi & English Support</p>
              </div>
            </div>
            <div class="chatbot-header-actions">
              <button class="chatbot-header-btn" id="chatbotClearBtn" title="Clear Chat"><i class="fa-solid fa-rotate-right"></i></button>
              <button class="chatbot-header-btn" id="chatbotCloseBtn" title="Close Chat"><i class="fa-solid fa-xmark"></i></button>
            </div>
          </div>

          <!-- Quick Help Chips -->
          <div class="chatbot-quick-chips">
            <button class="chip-btn" data-query="Mujhe Dr. Kapil Jain se Braces / Aligners ka appointment book karna hai">📅 Book Dr. Kapil (Braces/Aligners)</button>
            <button class="chip-btn" data-query="Mujhe Dr. Anmoll Jain se Painless Laser RCT / Smile Makeover book karna hai">📅 Book Dr. Anmoll (Laser RCT/Veneers)</button>
            <button class="chip-btn" data-query="Kya Root Canal me dard hota hai?">💉 Painless Laser RCT</button>
            <button class="chip-btn" data-query="Clinic timings aur Wright Town location bataiye">📍 Timings & Location</button>
          </div>

          <!-- Chat Body -->
          <div class="chatbot-body" id="chatbotBody">
            <div class="chat-msg chat-msg-bot">
              <div class="msg-content">
                <p>Namaste! 🙏 Welcome to <strong>Denticaa Dental Care, Wright Town</strong>.</p>
                <p>Mai Denticaa ka Multilingual AI Assistant hu. Aap mujhse Hindi, Hinglish ya English me dental queries pooch sakte hain ya direct <strong>Appointment Schedule</strong> kar sakte hain!</p>
              </div>
              <span class="msg-time">Just now</span>
            </div>
          </div>

          <!-- Chat Footer Input -->
          <form class="chatbot-footer" id="chatbotForm">
            <input type="text" id="chatbotInput" class="chatbot-input" placeholder="Apna sawaal ya booking details Hindi/English me likhein..." autocomplete="off" required>
            <button type="submit" class="chatbot-send-btn" id="chatbotSendBtn" title="Send Query">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', chatHTML);
    }
  }

  bindEvents() {
    const closeBtn = document.getElementById('chatbotCloseBtn');
    const clearBtn = document.getElementById('chatbotClearBtn');
    const form = document.getElementById('chatbotForm');
    const input = document.getElementById('chatbotInput');
    const chipBtns = document.querySelectorAll('.chip-btn');

    closeBtn?.addEventListener('click', () => this.toggleChat(false));

    clearBtn?.addEventListener('click', () => {
      this.messages = [];
      this.bookingState = { name: '', phone: '', age: '', gender: '', doctor: '', treatment: '', date: '', timeSlot: '' };
      const body = document.getElementById('chatbotBody');
      if (body) {
        body.innerHTML = `
          <div class="chat-msg chat-msg-bot">
            <div class="msg-content">
              <p>Chat reset ho gaya hai. Aap mujhse koi bhi naya dental sawaal ya appointment booking ke liye pooch sakte hain!</p>
            </div>
            <span class="msg-time">Just now</span>
          </div>
        `;
      }
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      this.handleUserMessage(text);
    });

    chipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        this.handleUserMessage(query);
      });
    });
  }

  toggleChat(forceState) {
    const modal = document.getElementById('denticaaChatbotModal');
    if (!modal) return;
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;

    if (this.isOpen) {
      modal.classList.add('active');
      document.getElementById('chatbotInput')?.focus();
    } else {
      modal.classList.remove('active');
    }
  }

  appendMessage(role, text, options = {}) {
    const body = document.getElementById('chatbotBody');
    if (!body) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg chat-msg-${role === 'user' ? 'user' : 'bot'}`;

    let formattedText = text.replace(/\n/g, '<br>');

    let actionBtnHtml = '';
    if (options.whatsappUrl) {
      actionBtnHtml = `
        <div style="margin-top: 10px;">
          <a href="${options.whatsappUrl}" target="_blank" class="btn-chat-wa">
            <i class="fa-brands fa-whatsapp"></i> Confirm on WhatsApp with Doctor
          </a>
        </div>
      `;
    }

    msgDiv.innerHTML = `
      <div class="msg-content">
        <p>${formattedText}</p>
        ${actionBtnHtml}
      </div>
      <span class="msg-time">${timeStr}</span>
    `;

    body.appendChild(msgDiv);
    body.scrollTop = body.scrollHeight;
    this.messages.push({ role, text });
  }

  showTypingIndicator() {
    const body = document.getElementById('chatbotBody');
    if (!body) return;

    const typingDiv = document.createElement('div');
    typingDiv.id = 'chatbotTyping';
    typingDiv.className = 'chat-msg chat-msg-bot typing-indicator-msg';
    typingDiv.innerHTML = `
      <div class="msg-content typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    body.appendChild(typingDiv);
    body.scrollTop = body.scrollHeight;
  }

  hideTypingIndicator() {
    const typing = document.getElementById('chatbotTyping');
    if (typing) typing.remove();
  }

  async handleUserMessage(userText) {
    this.appendMessage('user', userText);
    this.showTypingIndicator();

    // Extract details from current message
    this.extractBookingDetails(userText);

    // Check if user has provided complete booking info
    const bookingResult = this.processAppointmentBooking(userText);

    if (bookingResult.handled) {
      this.hideTypingIndicator();
      this.appendMessage('bot', bookingResult.reply, { whatsappUrl: bookingResult.whatsappUrl });
      return;
    }

    // Call Gemini API for smart conversational understanding
    try {
      const reply = await this.callGeminiAPI(userText);
      this.hideTypingIndicator();

      let waUrl = null;
      if (this.bookingState.phone) {
        const docPhone = this.bookingState.doctor.includes('Anmoll') ? '919575552165' : '919575216655';
        waUrl = `https://wa.me/${docPhone}?text=${encodeURIComponent(`Hello Denticaa, I would like to book consultation for ${this.bookingState.name || 'Patient'}`)}`;
      }

      this.appendMessage('bot', reply, { whatsappUrl: waUrl });
    } catch (err) {
      console.warn('Gemini API fallback to local smart engine:', err);
      this.hideTypingIndicator();
      const fallbackReply = this.getLocalFallbackResponse(userText);
      this.appendMessage('bot', fallbackReply);
    }
  }

  extractBookingDetails(text) {
    // 1. Phone number
    const phoneMatch = text.match(/(\+91[\-\s]?)?[6789]\d{9}/);
    if (phoneMatch) {
      this.bookingState.phone = phoneMatch[0].replace(/\D/g, '').slice(-10);
    }

    // 2. Name
    const nameMatch = text.match(/(?:naam|name is|i am|mera naam|name:)\s*([a-zA-Z\s]{2,25})/i);
    if (nameMatch) {
      this.bookingState.name = nameMatch[1].trim();
    }

    // 3. Age
    const ageMatch = text.match(/(?:age|umar|saal|year|yrs?)\s*[:=]?\s*(\d{1,2})/i) || text.match(/\b(\d{1,2})\s*(?:saal|years?|yr|yrs)\b/i);
    if (ageMatch) {
      this.bookingState.age = ageMatch[1];
    }

    // 4. Gender
    if (/\b(male|purush|ladka|gent|m)\b/i.test(text) && !/\b(female|mahila)\b/i.test(text)) {
      this.bookingState.gender = 'Male';
    } else if (/\b(female|mahila|ladki|woman|f)\b/i.test(text)) {
      this.bookingState.gender = 'Female';
    }

    // 5. Doctor preference
    if (/kapil|ortho|braces|aligner/i.test(text)) {
      this.bookingState.doctor = 'Dr. Kapil Jain';
    } else if (/anmoll|cosmetic|whitening|rct|root canal|veneer/i.test(text)) {
      this.bookingState.doctor = 'Dr. Mrs Anmoll Jain';
    }

    // 6. Treatment
    if (/aligner|invisible/i.test(text)) this.bookingState.treatment = 'Clear Aligners';
    else if (/brace/i.test(text)) this.bookingState.treatment = 'Braces & Orthodontics';
    else if (/rct|root canal|pain|dard/i.test(text)) this.bookingState.treatment = 'Laser Root Canal (RCT)';
    else if (/veneer|smile|makeover/i.test(text)) this.bookingState.treatment = 'Hollywood Smile / Veneers';
    else if (/implant/i.test(text)) this.bookingState.treatment = 'Dental Implants';
    else if (/whitening/i.test(text)) this.bookingState.treatment = 'Teeth Whitening';

    // 7. Date extraction (YYYY-MM-DD or keywords like kal/tomorrow)
    const dateMatch = text.match(/\b(202\d-\d{2}-\d{2})\b/) || text.match(/\b(\d{1,2})[-/](\d{1,2})[-/](202\d|\d{2})\b/);
    if (dateMatch) {
      this.bookingState.date = dateMatch[0];
    } else if (/kal|tomorrow/i.test(text)) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.bookingState.date = tomorrow.toISOString().split('T')[0];
    } else if (/aaj|today/i.test(text)) {
      this.bookingState.date = new Date().toISOString().split('T')[0];
    }

    // 8. Time Slot extraction
    if (/morning|subah|10|11|12|1\s*pm/i.test(text)) {
      this.bookingState.timeSlot = 'Morning (10:30 AM - 01:30 PM)';
    } else if (/evening|shaam|dophar|5|6|7|8/i.test(text)) {
      this.bookingState.timeSlot = 'Evening (05:00 PM - 08:30 PM)';
    }
  }

  processAppointmentBooking(userText) {
    const s = this.bookingState;

    // Check if user has given at least phone number + appointment intent
    const hasBookingIntent = s.phone && (s.date || s.timeSlot || /book|appointment|schedule|time/i.test(userText));

    if (!hasBookingIntent) {
      return { handled: false };
    }

    // If missing date, set default to next working day
    if (!s.date) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      s.date = tomorrow.toISOString().split('T')[0];
    }

    // If missing time slot, default to Morning
    if (!s.timeSlot) {
      s.timeSlot = 'Morning (10:30 AM - 01:30 PM)';
    }

    // If missing doctor, assign based on treatment
    if (!s.doctor) {
      s.doctor = s.treatment.includes('Aligner') || s.treatment.includes('Braces') ? 'Dr. Kapil Jain' : 'Dr. Mrs Anmoll Jain';
    }

    // 1. Check Slot Availability for Conflict
    if (window.denticaaCRM) {
      const check = window.denticaaCRM.checkSlotAvailability(s.doctor, s.date, s.timeSlot);

      if (!check.available) {
        // Conflicting slot detected!
        return {
          handled: true,
          reply: `⚠️ **Slot Already Booked!**\n\n${s.doctor} ka **${s.date}** ko **${s.timeSlot}** par already kisi patient ka appointment book hai.\n\n👉 Aap kripya koi doosra date ya time slot (jaise *${check.suggestedSlot}* ya koi anya date) chuniye.`
        };
      }

      // 2. Slot is Available -> Save to CRM
      const newLead = window.denticaaCRM.saveLead({
        type: 'chatbot',
        patientName: s.name || 'Chat Patient',
        patientPhone: s.phone,
        patientAge: s.age || 'Not specified',
        patientGender: s.gender || 'Not specified',
        treatment: s.treatment || 'General Consultation',
        preferredDoctor: s.doctor,
        preferredDate: s.date,
        timeSlot: s.timeSlot,
        message: `Booked via Denticaa AI Assistant. Age: ${s.age || 'N/A'}, Gender: ${s.gender || 'N/A'}. User input: "${userText}"`,
        chatTranscript: [...this.messages, { role: 'user', text: userText }],
        status: 'Confirmed'
      });

      const docPhone = s.doctor.includes('Anmoll') ? '919575552165' : '919575216655';
      const waMsg = encodeURIComponent(`*🦷 Denticaa Appointment Confirmation*\n\n👤 *Patient:* ${s.name || 'Patient'}\n📞 *Phone:* ${s.phone}\n🎂 *Age/Gender:* ${s.age || 'N/A'} / ${s.gender || 'N/A'}\n👨‍⚕️ *Doctor:* ${s.doctor}\n🩺 *Treatment:* ${s.treatment || 'Consultation'}\n📅 *Date:* ${s.date}\n⏰ *Slot:* ${s.timeSlot}\n\n_Booked via Denticaa AI Assistant_`);
      const whatsappUrl = `https://wa.me/${docPhone}?text=${waMsg}`;

      // Closing confirmation message
      const closingReply = `✅ **Thank you for visiting Denticaa!** 🙏\n\n` +
        `Aapka appointment aapke chune hue time par successfully book ho gaya hai!\n\n` +
        `📋 **Booking Summary:**\n` +
        `• **Patient:** ${s.name || 'Patient'} (${s.age ? `Age: ${s.age}` : ''} ${s.gender || ''})\n` +
        `• **Doctor:** ${s.doctor}\n` +
        `• **Treatment:** ${s.treatment || 'Dental Consultation'}\n` +
        `• **Date:** ${s.date}\n` +
        `• **Time Slot:** ${s.timeSlot}\n\n` +
        `Hamari clinic team aapko jald hi confirmation call/WhatsApp karegi. Aap niche diye button se direct WhatsApp par bhi connect kar sakte hain.`;

      return {
        handled: true,
        reply: closingReply,
        whatsappUrl: whatsappUrl
      };
    }

    return { handled: false };
  }

  async callGeminiAPI(userText) {
    const formattedContents = [
      {
        role: "user",
        parts: [{ text: DENTICAA_SYSTEM_PROMPT }]
      },
      {
        role: "model",
        parts: [{ text: "Namaste! I am the Denticaa AI Assistant. I will assist with dental guidance, collect patient Name, Phone, Age, Gender, Doctor, Date, and Time Slot, check conflicts, and confirm warmly." }]
      }
    ];

    const recentMessages = this.messages.slice(-6);
    recentMessages.forEach(m => {
      formattedContents.push({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      });
    });

    formattedContents.push({
      role: "user",
      parts: [{ text: userText }]
    });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: formattedContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 400
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || this.getLocalFallbackResponse(userText);
  }

  getLocalFallbackResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('aligner') || q.includes('invisible') || q.includes('straight')) {
      return "Denticaa me **Dr. Kapil Jain (BDS, MDS Orthodontics)** invisible clear aligners provide karte hain. Ye bilkul transparent hote hain. Consultation ke liye aap apna Name, Phone, Age aur preferred date/time slot yaha share kar sakte hain!";
    }
    if (q.includes('rct') || q.includes('root canal') || q.includes('pain') || q.includes('dard')) {
      return "Denticaa me **Dr. Mrs Anmoll Jain** painless single-sitting laser root canal treatment karti hain. Appointment book karne ke liye apna Name, Mobile number aur time slot batayein.";
    }
    if (q.includes('timing') || q.includes('location') || q.includes('address')) {
      return "📍 **Location:** Ground Floor, Nalini Apartment, Mohanlal Hargobindas Hospital Road, Wright Town, Jabalpur.\n⏰ **Timings:** Morning: 10:30 AM - 01:30 PM | Evening: 05:00 PM - 08:30 PM (Mon-Sat).\n📞 Phone: 9575216655 / 9575552165.";
    }

    return "Denticaa Dental Care me Dr. Kapil Jain (Ortho/Aligners) aur Dr. Mrs Anmoll Jain (Cosmetic/Laser RCT) available hain. Consultation book karne ke liye aap apna **Name, Mobile number, Age, Gender aur preferred Date/Time** yaha likhein!";
  }
}

// Global Chatbot Instance
document.addEventListener('DOMContentLoaded', () => {
  window.denticaaChatbot = new DenticaaAIChatbot();
});
