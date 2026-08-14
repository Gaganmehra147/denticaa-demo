/* ==========================================================================
   DENTICAA DENTAL CLINIC — UNIFIED CRM & TRANSFORMATION STORE
   Handles Leads, Appointments, Slot Conflict Checking, and Before/After CMS
   ========================================================================== */

const CRM_STORAGE_KEY = 'denticaa_crm_leads_v1';
const TRANSFORMATIONS_STORAGE_KEY = 'denticaa_transformations_v1';

// Initial Demo Seed Leads
const INITIAL_DEMO_LEADS = [
  {
    id: 'LEAD-101',
    type: 'form',
    patientName: 'Rahul Mehra',
    patientPhone: '9826154820',
    patientEmail: 'rahul.mehra@gmail.com',
    patientAge: '27',
    patientGender: 'Male',
    treatment: 'Clear Aligners',
    preferredDoctor: 'Dr. Kapil Jain',
    preferredDate: '2026-08-16',
    timeSlot: 'Morning (10:30 AM - 01:30 PM)',
    message: 'Looking for invisible aligners for upper and lower teeth crowding. Need 3D digital simulation.',
    status: 'Confirmed',
    source: 'Website Consultation Form',
    createdAt: '2026-08-13T10:30:00.000Z',
    notes: 'Dr. Kapil consulted on phone. Initial scan scheduled for Saturday morning session.'
  },
  {
    id: 'CHAT-102',
    type: 'chatbot',
    patientName: 'Pooja Agrawal',
    patientPhone: '9425187340',
    patientEmail: 'pooja.agr@yahoo.com',
    patientAge: '29',
    patientGender: 'Female',
    treatment: 'Laser Root Canal (RCT)',
    preferredDoctor: 'Dr. Mrs Anmoll Jain',
    preferredDate: '2026-08-14',
    timeSlot: 'Evening (05:00 PM - 08:30 PM)',
    message: 'Inquired via AI Chatbot: Severe molar pain, requested single-sitting painless laser RCT.',
    chatTranscript: [
      { role: 'user', text: 'Mujhe daant me bahut dard ho raha hai kya aap painless RCT karte hain?' },
      { role: 'model', text: 'Namaste! Haan bilkul, Denticaa me Dr. Mrs Anmoll Jain single-sitting painless laser root canal karti hain. Isme bilkul bhi dard nahi hota.' },
      { role: 'user', text: 'Mera naam Pooja Agrawal hai, age 29 Female, mobile 9425187340. Kal shaam ka appointment mil sakta hai?' },
      { role: 'model', text: 'Thank you for visiting Denticaa! 🙏 Aapka appointment Dr. Mrs Anmoll Jain ke sath 2026-08-14 ko Evening slot (05:00 PM - 08:30 PM) par book ho gaya hai.' }
    ],
    status: 'Confirmed',
    source: 'Denticaa Multilingual AI Chatbot',
    createdAt: '2026-08-13T14:15:00.000Z',
    notes: 'Urgent pain case. Confirmed for evening laser RCT appointment.'
  },
  {
    id: 'LEAD-103',
    type: 'form',
    patientName: 'Vikram S. Patel',
    patientPhone: '9893041289',
    patientEmail: 'vikram.patel@outlook.com',
    patientAge: '34',
    patientGender: 'Male',
    treatment: 'Hollywood Smile / Veneers',
    preferredDoctor: 'Dr. Mrs Anmoll Jain',
    preferredDate: '2026-08-18',
    timeSlot: 'Morning (10:30 AM - 01:30 PM)',
    message: 'Interested in porcelain veneers for front 6 teeth smile makeover before family wedding.',
    status: 'Contacted',
    source: 'Website Consultation Form',
    createdAt: '2026-08-12T16:45:00.000Z',
    notes: 'Sent smile catalog and pricing options on WhatsApp.'
  },
  {
    id: 'CHAT-104',
    type: 'chatbot',
    patientName: 'Ankit Sharma',
    patientPhone: '9754129876',
    patientEmail: '',
    patientAge: '22',
    patientGender: 'Male',
    treatment: 'Braces & Orthodontics',
    preferredDoctor: 'Dr. Kapil Jain',
    preferredDate: '2026-08-15',
    timeSlot: 'Evening (05:00 PM - 08:30 PM)',
    message: 'Inquired via AI Chatbot: Ceramic braces consultation.',
    chatTranscript: [
      { role: 'user', text: 'Ceramic braces lagwane hain. Ankit Sharma, 22 Male, 9754129876. 15th evening slot chahiye.' },
      { role: 'model', text: 'Thank you for visiting Denticaa! 🙏 Aapka appointment Dr. Kapil Jain ke sath 2026-08-15 ko Evening slot par confirm ho gaya hai.' }
    ],
    status: 'Confirmed',
    source: 'Denticaa Multilingual AI Chatbot',
    createdAt: '2026-08-13T16:00:00.000Z',
    notes: 'College student looking for aesthetic ceramic braces.'
  }
];

// Initial Demo Seed Transformations
const INITIAL_DEMO_TRANSFORMATIONS = [
  {
    id: 'TR-1',
    tag: 'Clear Aligners • 9 Months',
    title: 'Severe Crowding Corrected',
    doctor: 'Dr. Kapil Jain',
    desc: 'Treated by Dr. Kapil Jain with custom clear aligners, achieving symmetrical arch alignment without tooth extraction.',
    beforeImg: 'images/before-crowding.png',
    afterImg: 'images/after-crowding.png',
    createdAt: '2026-08-10'
  },
  {
    id: 'TR-2',
    tag: 'Porcelain Veneers • 2 Visits',
    title: 'Hollywood Smile Makeover',
    doctor: 'Dr. Mrs Anmoll Jain',
    desc: 'Designed by Dr. Mrs Anmoll Jain with ultra-thin porcelain veneers to restore chipped enamel and brighten shade permanently.',
    beforeImg: 'images/before-veneers.png',
    afterImg: 'images/after-veneers.png',
    createdAt: '2026-08-11'
  },
  {
    id: 'TR-3',
    tag: 'Ceramic Braces • 14 Months',
    title: 'Deep Bite & Spacing Closure',
    doctor: 'Dr. Kapil Jain',
    desc: 'Treated with aesthetic ceramic braces by Dr. Kapil Jain, restoring functional chewing harmony and facial balance.',
    beforeImg: 'images/before-spacing.png',
    afterImg: 'images/after-spacing.png',
    createdAt: '2026-08-12'
  }
];

class DenticaaCRMStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(CRM_STORAGE_KEY)) {
      localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_LEADS));
    }
    if (!localStorage.getItem(TRANSFORMATIONS_STORAGE_KEY)) {
      localStorage.setItem(TRANSFORMATIONS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_TRANSFORMATIONS));
    }
  }

  // --- LEADS MANAGEMENT ---
  getLeads() {
    try {
      const data = localStorage.getItem(CRM_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading CRM leads:', e);
      return [];
    }
  }

  saveLead(leadData) {
    const leads = this.getLeads();
    const newLead = {
      id: leadData.id || `${leadData.type === 'chatbot' ? 'CHAT' : 'LEAD'}-${Date.now().toString().slice(-4)}`,
      type: leadData.type || 'form',
      patientName: leadData.patientName || 'Anonymous Visitor',
      patientPhone: leadData.patientPhone || 'Not provided',
      patientEmail: leadData.patientEmail || '',
      patientAge: leadData.patientAge || 'Not specified',
      patientGender: leadData.patientGender || 'Not specified',
      treatment: leadData.treatment || 'General Consultation',
      preferredDoctor: leadData.preferredDoctor || 'Any Available Specialist',
      preferredDate: leadData.preferredDate || new Date().toISOString().split('T')[0],
      timeSlot: leadData.timeSlot || 'Morning (10:30 AM - 01:30 PM)',
      message: leadData.message || '',
      chatTranscript: leadData.chatTranscript || null,
      status: leadData.status || 'New',
      source: leadData.source || (leadData.type === 'chatbot' ? 'Denticaa Multilingual AI Chatbot' : 'Website Consultation Form'),
      createdAt: new Date().toISOString(),
      notes: leadData.notes || ''
    };

    leads.unshift(newLead);
    localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(leads));

    // Dispatch global event for live syncing
    window.dispatchEvent(new CustomEvent('denticaa_lead_added', { detail: newLead }));
    return newLead;
  }

  updateLead(leadId, updates) {
    const leads = this.getLeads();
    const index = leads.findIndex(l => l.id === leadId);
    if (index !== -1) {
      leads[index] = { ...leads[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(leads));
      window.dispatchEvent(new CustomEvent('denticaa_lead_updated', { detail: leads[index] }));
      return leads[index];
    }
    return null;
  }

  deleteLead(leadId) {
    let leads = this.getLeads();
    leads = leads.filter(l => l.id !== leadId);
    localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(leads));
    window.dispatchEvent(new CustomEvent('denticaa_lead_deleted', { detail: { id: leadId } }));
    return true;
  }

  // --- APPOINTMENT SLOT CONFLICT CHECKER ---
  checkSlotAvailability(doctorName, dateStr, timeSlotStr) {
    const leads = this.getLeads();
    if (!dateStr || !timeSlotStr) return { available: true };

    const cleanDate = dateStr.trim();
    const isMorning = /morning|10|11|12|1/i.test(timeSlotStr);
    const isEvening = /evening|5|6|7|8/i.test(timeSlotStr);

    const conflictingLead = leads.find(lead => {
      // Only check active or confirmed bookings
      if (lead.status === 'Cancelled') return false;

      const sameDate = (lead.preferredDate || '').trim() === cleanDate;
      if (!sameDate) return false;

      // Doctor matching
      let sameDoctor = false;
      if (!doctorName || doctorName.includes('Any') || (lead.preferredDoctor || '').includes('Any')) {
        sameDoctor = true;
      } else {
        const docKey = doctorName.toLowerCase().includes('kapil') ? 'kapil' : 'anmoll';
        const leadDocKey = (lead.preferredDoctor || '').toLowerCase().includes('kapil') ? 'kapil' : 'anmoll';
        sameDoctor = (docKey === leadDocKey);
      }

      if (!sameDoctor) return false;

      // Time slot matching
      const leadIsMorning = /morning|10|11|12|1/i.test(lead.timeSlot || '');
      const leadIsEvening = /evening|5|6|7|8/i.test(lead.timeSlot || '');

      return (isMorning && leadIsMorning) || (isEvening && leadIsEvening);
    });

    if (conflictingLead) {
      return {
        available: false,
        conflictWith: conflictingLead,
        suggestedSlot: isMorning ? 'Evening (05:00 PM - 08:30 PM)' : 'Morning (10:30 AM - 01:30 PM)'
      };
    }

    return { available: true };
  }

  getStats() {
    const leads = this.getLeads();
    return {
      total: leads.length,
      newLeads: leads.filter(l => l.status === 'New').length,
      confirmed: leads.filter(l => l.status === 'Confirmed').length,
      contacted: leads.filter(l => l.status === 'Contacted').length,
      completed: leads.filter(l => l.status === 'Completed').length,
      chatbotLeads: leads.filter(l => l.type === 'chatbot').length,
      formLeads: leads.filter(l => l.type === 'form').length,
      drKapilLeads: leads.filter(l => (l.preferredDoctor || '').includes('Kapil')).length,
      drAnmollLeads: leads.filter(l => (l.preferredDoctor || '').includes('Anmoll')).length
    };
  }

  exportToCSV() {
    const leads = this.getLeads();
    if (!leads.length) return '';

    const headers = ['Lead ID', 'Type', 'Patient Name', 'Phone', 'Age', 'Gender', 'Email', 'Treatment', 'Doctor', 'Date', 'Time Slot', 'Status', 'Source', 'Created At', 'Notes'];
    const rows = leads.map(l => [
      l.id,
      l.type,
      `"${(l.patientName || '').replace(/"/g, '""')}"`,
      `"${l.patientPhone || ''}"`,
      `"${l.patientAge || ''}"`,
      `"${l.patientGender || ''}"`,
      `"${l.patientEmail || ''}"`,
      `"${(l.treatment || '').replace(/"/g, '""')}"`,
      `"${(l.preferredDoctor || '').replace(/"/g, '""')}"`,
      l.preferredDate || '',
      `"${l.timeSlot || ''}"`,
      l.status || 'New',
      `"${l.source || ''}"`,
      l.createdAt || '',
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Denticaa_CRM_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- SMILE TRANSFORMATIONS CMS ---
  getTransformations() {
    try {
      const data = localStorage.getItem(TRANSFORMATIONS_STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_DEMO_TRANSFORMATIONS;
    } catch (e) {
      console.error('Error reading transformations:', e);
      return INITIAL_DEMO_TRANSFORMATIONS;
    }
  }

  saveTransformation(data) {
    const list = this.getTransformations();
    const newTr = {
      id: data.id || `TR-${Date.now().toString().slice(-4)}`,
      tag: data.tag || 'Smile Makeover',
      title: data.title || 'Smile Transformation',
      doctor: data.doctor || 'Dr. Kapil Jain',
      desc: data.desc || '',
      beforeImg: data.beforeImg || 'images/before-crowding.png',
      afterImg: data.afterImg || 'images/after-crowding.png',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const existingIdx = list.findIndex(t => t.id === newTr.id);
    if (existingIdx !== -1) {
      list[existingIdx] = newTr;
    } else {
      list.unshift(newTr);
    }

    localStorage.setItem(TRANSFORMATIONS_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('denticaa_transformations_updated', { detail: list }));
    return newTr;
  }

  deleteTransformation(id) {
    let list = this.getTransformations();
    list = list.filter(t => t.id !== id);
    localStorage.setItem(TRANSFORMATIONS_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('denticaa_transformations_updated', { detail: list }));
    return true;
  }
}

// Global instance
window.denticaaCRM = new DenticaaCRMStore();
