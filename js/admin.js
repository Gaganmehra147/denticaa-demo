/* ==========================================================================
   DENTICAA DENTAL CLINIC — ADMIN CRM & CMS CONTROLLER
   Handles Password Auth (denticaa123), Leads Table, Transcripts & Transformations CMS
   ========================================================================== */

const CORRECT_ADMIN_PASSWORD = 'denticaa123';

document.addEventListener('DOMContentLoaded', () => {
  if (!window.denticaaCRM) {
    console.warn('Denticaa CRM store not found, creating fallback...');
    if (typeof DenticaaCRMStore !== 'undefined') {
      window.denticaaCRM = new DenticaaCRMStore();
    }
  }

  // 1. AUTHENTICATION & PASSWORD PROTECTION
  const authOverlay = document.getElementById('authOverlay');
  const authForm = document.getElementById('authForm');
  const authInput = document.getElementById('authPasswordInput');
  const authToggleEye = document.getElementById('authToggleEye');
  const authErrorMsg = document.getElementById('authErrorMsg');
  const btnLogout = document.getElementById('btnLogoutCRM');

  function checkAuth() {
    const isLogged = sessionStorage.getItem('denticaa_admin_auth') === 'true';
    if (isLogged) {
      if (authOverlay) authOverlay.style.display = 'none';
      initCRM();
    } else {
      if (authOverlay) authOverlay.style.display = 'flex';
      setTimeout(() => authInput?.focus(), 100);
    }
  }

  authForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = (authInput?.value || '').trim();
    if (entered === CORRECT_ADMIN_PASSWORD || entered.toLowerCase() === 'denticaa123') {
      sessionStorage.setItem('denticaa_admin_auth', 'true');
      if (authOverlay) authOverlay.style.display = 'none';
      if (authErrorMsg) authErrorMsg.style.display = 'none';
      initCRM();
    } else {
      if (authErrorMsg) authErrorMsg.style.display = 'block';
      if (authInput) {
        authInput.value = '';
        authInput.focus();
      }
    }
  });

  authToggleEye?.addEventListener('click', () => {
    if (!authInput) return;
    authInput.type = authInput.type === 'password' ? 'text' : 'password';
    authToggleEye.innerHTML = authInput.type === 'password' ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>';
  });

  btnLogout?.addEventListener('click', () => {
    sessionStorage.removeItem('denticaa_admin_auth');
    if (authOverlay) authOverlay.style.display = 'flex';
    if (authInput) {
      authInput.value = '';
      authInput.focus();
    }
  });

  // Tab Switcher
  window.switchCRMTab = function(tab) {
    const tabLeads = document.getElementById('crmTabLeads');
    const tabMemberships = document.getElementById('crmTabMemberships');
    const tabInter = document.getElementById('crmTabInternational');
    const tabTr = document.getElementById('crmTabTransformations');
    const btnLeads = document.getElementById('tabBtnLeads');
    const btnMemberships = document.getElementById('tabBtnMemberships');
    const btnInter = document.getElementById('tabBtnInternational');
    const btnTr = document.getElementById('tabBtnTransformations');

    if (tabLeads) tabLeads.style.display = tab === 'leads' ? 'block' : 'none';
    if (tabMemberships) tabMemberships.style.display = tab === 'memberships' ? 'block' : 'none';
    if (tabInter) tabInter.style.display = tab === 'international' ? 'block' : 'none';
    if (tabTr) tabTr.style.display = tab === 'transformations' ? 'block' : 'none';

    btnLeads?.classList.toggle('active', tab === 'leads');
    btnMemberships?.classList.toggle('active', tab === 'memberships');
    btnInter?.classList.toggle('active', tab === 'international');
    btnTr?.classList.toggle('active', tab === 'transformations');

    if (tab === 'leads' && window.renderLeads) window.renderLeads();
    if (tab === 'memberships' && window.renderMembershipDirectory) window.renderMembershipDirectory();
    if (tab === 'international' && window.renderInternationalLeads) window.renderInternationalLeads();
    if (tab === 'transformations' && window.renderTransformationsCMS) renderTransformationsCMS();
  };

  // 2. INITIALIZE CRM COMPONENTS
  function initCRM() {
    const tableBody = document.getElementById('crmTableBody');
    const searchInput = document.getElementById('crmSearchInput');
    const filterType = document.getElementById('crmFilterType');
    const filterDoctor = document.getElementById('crmFilterDoctor');
    const filterStatus = document.getElementById('crmFilterStatus');
    const btnExport = document.getElementById('btnExportCSV');

    const statTotal = document.getElementById('statTotalLeads');
    const statNew = document.getElementById('statNewLeads');
    const statConfirmed = document.getElementById('statConfirmedLeads');
    const statBot = document.getElementById('statBotLeads');
    const statDocSplit = document.getElementById('statDoctorSplit');

    // Details Modal
    const detailsModal = document.getElementById('leadDetailsModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalLeadTitle = document.getElementById('modalLeadTitle');
    const modalLeadSourceBadge = document.getElementById('modalLeadSourceBadge');
    const modalPatientName = document.getElementById('modalPatientName');
    const modalPatientPhone = document.getElementById('modalPatientPhone');
    const modalPatientAgeGender = document.getElementById('modalPatientAgeGender');
    const modalTreatment = document.getElementById('modalTreatment');
    const modalDoctor = document.getElementById('modalDoctor');
    const modalDateSlot = document.getElementById('modalDateSlot');
    const modalMessage = document.getElementById('modalMessage');
    const modalChatTranscriptWrap = document.getElementById('modalChatTranscriptWrap');
    const modalChatTranscript = document.getElementById('modalChatTranscript');
    const modalClinicalNotes = document.getElementById('modalClinicalNotes');
    const modalWhatsAppBtn = document.getElementById('modalWhatsAppBtn');
    const modalSaveNotesBtn = document.getElementById('modalSaveNotesBtn');

    // Transformations CMS
    const btnUploadTr = document.getElementById('btnUploadTransformation');
    const uploadTrModal = document.getElementById('uploadTrModal');
    const uploadTrCloseBtn = document.getElementById('uploadTrCloseBtn');
    const uploadTrCancelBtn = document.getElementById('uploadTrCancelBtn');
    const uploadTrForm = document.getElementById('uploadTrForm');

    let currentActiveLeadId = null;

    function updateStats() {
      const stats = window.denticaaCRM.getStats();
      const allLeads = window.denticaaCRM.getLeads();
      const interLeads = allLeads.filter(l => l.type === 'dental_tourism' || (l.patientPhone && l.patientPhone.startsWith('+')));

      if (statTotal) statTotal.textContent = stats.total;
      if (statNew) statNew.textContent = stats.newLeads;
      if (statConfirmed) statConfirmed.textContent = stats.confirmed;
      if (statBot) statBot.textContent = stats.chatbotLeads;
      if (statDocSplit) statDocSplit.textContent = `${stats.drKapilLeads} / ${stats.drAnmollLeads}`;

      const badgeInter = document.getElementById('badgeInternationalCount');
      const statInterTotal = document.getElementById('statInterTotal');
      const statInterActive = document.getElementById('statInterActive');
      const statInterCountries = document.getElementById('statInterCountries');

      if (badgeInter) badgeInter.textContent = interLeads.length;
      if (statInterTotal) statInterTotal.textContent = interLeads.length;
      if (statInterActive) statInterActive.textContent = interLeads.filter(l => l.status !== 'Cancelled' && l.status !== 'Completed').length;
      if (statInterCountries) {
        const countries = new Set(interLeads.map(l => l.patientCountry || 'International'));
        statInterCountries.textContent = countries.size || (interLeads.length ? 1 : 0);
      }
    }

    window.renderInternationalLeads = function() {
      const interTableBody = document.getElementById('crmInterTableBody');
      if (!interTableBody) return;

      const allLeads = window.denticaaCRM.getLeads();
      const interLeads = allLeads.filter(l => l.type === 'dental_tourism' || (l.patientPhone && l.patientPhone.startsWith('+')));

      if (!interLeads.length) {
        interTableBody.innerHTML = `
          <tr>
            <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-muted);">
              <i class="fa-solid fa-plane" style="font-size: 2rem; margin-bottom: 8px; display: block; color: var(--border-subtle);"></i>
              No international patient inquiries received yet.
            </td>
          </tr>
        `;
        return;
      }

      interTableBody.innerHTML = interLeads.map(lead => {
        const cleanPhone = (lead.patientPhone || '').replace(/[^0-9]/g, '');
        const waText = encodeURIComponent(`Hello ${lead.patientName}, this is Dr. Kapil Jain & Team from Denticaa Dental Care, Jabalpur regarding your Dental Tourism inquiry for ${lead.treatment}.`);
        const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`;
        const mailUrl = `mailto:${lead.patientEmail || ''}?subject=Dental%20Tourism%20Plan%20%26%20Quote%20-%20Denticaa%20Dental%20Care&body=Dear%20${encodeURIComponent(lead.patientName)},%0D%0A%0D%0AThank%20you%20for%20contacting%20Denticaa%20Dental%20Care,%20India.`;

        return `
          <tr data-id="${lead.id}">
            <td>
              <span style="font-weight: 700; font-size: 0.82rem; color: #059669;">${lead.id}</span>
              <div style="font-size: 0.7rem; color: var(--text-muted);">${new Date(lead.createdAt).toLocaleDateString()}</div>
            </td>
            <td>
              <div class="patient-name-text">${lead.patientName}</div>
              <span style="font-size: 0.74rem; background: #ECFDF5; color: #065F46; padding: 2px 6px; border-radius: 4px; font-weight: 700;">
                ${lead.patientCountry || '🌍 Global Patient'}
              </span>
            </td>
            <td>
              <a href="tel:${cleanPhone}" style="color: var(--text-dark); text-decoration: none; font-weight: 600; font-size: 0.84rem;">
                <i class="fa-solid fa-phone" style="color: var(--gold-dark); font-size: 0.72rem;"></i> ${lead.patientPhone}
              </a>
            </td>
            <td>
              <a href="${mailUrl}" style="color: #2563EB; text-decoration: none; font-size: 0.82rem; word-break: break-all;">
                ${lead.patientEmail || '<span style="color:#94A3B8;">N/A</span>'}
              </a>
            </td>
            <td>
              <span style="font-weight: 600; color: var(--text-dark);">${lead.treatment}</span>
            </td>
            <td>
              <span style="font-size: 0.84rem;">${lead.preferredDoctor || 'Dr. Kapil Jain'}</span>
            </td>
            <td>
              <span style="font-weight: 600; font-size: 0.84rem; color: #92400E; background: #FEF3C7; padding: 2px 8px; border-radius: 4px;">
                ${lead.preferredDate || 'Flexible'}
              </span>
            </td>
            <td>
              <select class="status-badge status-${(lead.status || 'new').toLowerCase()}" onchange="changeLeadStatus('${lead.id}', this.value)">
                <option value="New" ${lead.status === 'New' ? 'selected' : ''}>New</option>
                <option value="Contacted" ${lead.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                <option value="Confirmed" ${lead.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                <option value="Completed" ${lead.status === 'Completed' ? 'selected' : ''}>Completed</option>
                <option value="Cancelled" ${lead.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
              </select>
            </td>
            <td>
              <div style="display: flex; gap: 6px;">
                <a href="${waUrl}" target="_blank" class="table-action-btn btn-wa-action" title="WhatsApp Patient">
                  <i class="fa-brands fa-whatsapp"></i>
                </a>
                <a href="${mailUrl}" class="table-action-btn" title="Email Patient" style="color: #2563EB;">
                  <i class="fa-regular fa-envelope"></i>
                </a>
                <button class="table-action-btn" onclick="openLeadDetails('${lead.id}')" title="View Full Details">
                  <i class="fa-regular fa-eye"></i>
                </button>
                <button class="table-action-btn btn-del-action" onclick="deleteLeadItem('${lead.id}')" title="Delete">
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    };

    window.renderLeads = function() {
      const allLeads = window.denticaaCRM.getLeads();
      const query = (searchInput?.value || '').toLowerCase().trim();
      const typeVal = filterType?.value || 'all';
      const doctorVal = filterDoctor?.value || 'all';
      const statusVal = filterStatus?.value || 'all';

      const filtered = allLeads.filter(lead => {
        const matchSearch = !query || 
          (lead.patientName || '').toLowerCase().includes(query) ||
          (lead.patientPhone || '').includes(query) ||
          (lead.treatment || '').toLowerCase().includes(query) ||
          (lead.preferredDoctor || '').toLowerCase().includes(query);

        const matchType = typeVal === 'all' || lead.type === typeVal;
        const matchDoctor = doctorVal === 'all' || (lead.preferredDoctor || '').includes(doctorVal);
        const matchStatus = statusVal === 'all' || lead.status === statusVal;

        return matchSearch && matchType && matchDoctor && matchStatus;
      });

      if (!tableBody) return;

      if (!filtered.length) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
              <i class="fa-solid fa-inbox" style="font-size: 2rem; margin-bottom: 8px; display: block; color: var(--border-subtle);"></i>
              No patient inquiries match your search criteria.
            </td>
          </tr>
        `;
        return;
      }

      tableBody.innerHTML = filtered.map(lead => {
        const isBot = lead.type === 'chatbot';
        const sourceClass = isBot ? 'source-bot' : 'source-form';
        const sourceLabel = isBot ? '<i class="fa-solid fa-robot"></i> AI Chatbot' : '<i class="fa-solid fa-file-lines"></i> Form Booking';

        const waText = encodeURIComponent(`Hello ${lead.patientName}, this is Denticaa Dental Care, Wright Town regarding your consultation.`);
        const waUrl = `https://wa.me/91${lead.patientPhone}?text=${waText}`;

        return `
          <tr data-id="${lead.id}">
            <td>
              <div style="display: flex; flex-direction: column; gap: 3px;">
                <span style="font-weight: 700; font-size: 0.82rem; color: var(--gold-dark);">${lead.id}</span>
                <span class="source-pill ${sourceClass}">${sourceLabel}</span>
              </div>
            </td>
            <td>
              <div class="patient-name-text">${lead.patientName}</div>
              <a href="tel:${lead.patientPhone}" style="color: var(--text-dark); text-decoration: none; font-weight: 600; font-size: 0.82rem;">
                <i class="fa-solid fa-phone" style="font-size: 0.74rem; color: var(--gold-dark);"></i> ${lead.patientPhone}
              </a>
            </td>
            <td>
              <span style="font-size: 0.85rem; font-weight: 600;">${lead.patientAge || 'N/A'} • ${lead.patientGender || 'N/A'}</span>
            </td>
            <td>
              <span style="font-weight: 600;">${lead.treatment}</span>
            </td>
            <td>
              <span style="font-size: 0.85rem;">${lead.preferredDoctor}</span>
            </td>
            <td>
              <div style="display: flex; flex-direction: column;">
                <span style="font-weight: 600; font-size: 0.84rem;">${lead.preferredDate || 'Flexible'}</span>
                <span style="font-size: 0.74rem; color: var(--text-muted);">${lead.timeSlot || ''}</span>
              </div>
            </td>
            <td>
              <select class="status-badge status-${(lead.status || 'new').toLowerCase()}" onchange="changeLeadStatus('${lead.id}', this.value)">
                <option value="New" ${lead.status === 'New' ? 'selected' : ''}>New</option>
                <option value="Contacted" ${lead.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                <option value="Confirmed" ${lead.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                <option value="Completed" ${lead.status === 'Completed' ? 'selected' : ''}>Completed</option>
                <option value="Cancelled" ${lead.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
              </select>
            </td>
            <td>
              <div style="display: flex; align-items: center; gap: 6px;">
                <button class="table-action-btn" title="View Details & Transcript" onclick="openLeadModal('${lead.id}')">
                  <i class="fa-regular fa-eye"></i>
                </button>
                <a href="${waUrl}" target="_blank" class="table-action-btn btn-wa-action" title="WhatsApp">
                  <i class="fa-brands fa-whatsapp"></i>
                </a>
                <button class="table-action-btn btn-del-action" title="Delete" onclick="deleteLeadItem('${lead.id}')">
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    window.changeLeadStatus = function(leadId, newStatus) {
      window.denticaaCRM.updateLead(leadId, { status: newStatus });
      updateStats();
      renderLeads();
    };

    window.deleteLeadItem = function(leadId) {
      if (confirm(`Delete lead ${leadId}?`)) {
        window.denticaaCRM.deleteLead(leadId);
        updateStats();
        renderLeads();
      }
    };

    window.openLeadModal = function(leadId) {
      const leads = window.denticaaCRM.getLeads();
      const lead = leads.find(l => l.id === leadId);
      if (!lead) return;

      currentActiveLeadId = leadId;

      if (modalLeadTitle) modalLeadTitle.textContent = `${lead.patientName} (${lead.id})`;
      if (modalLeadSourceBadge) {
        modalLeadSourceBadge.className = `source-pill ${lead.type === 'chatbot' ? 'source-bot' : 'source-form'}`;
        modalLeadSourceBadge.innerHTML = lead.type === 'chatbot' ? '<i class="fa-solid fa-robot"></i> AI Chatbot Lead' : '<i class="fa-solid fa-file-lines"></i> Consultation Form';
      }

      if (modalPatientName) modalPatientName.textContent = lead.patientName;
      if (modalPatientPhone) modalPatientPhone.textContent = lead.patientPhone;
      if (modalPatientAgeGender) modalPatientAgeGender.textContent = `${lead.patientAge || 'Not specified'} • ${lead.patientGender || 'Not specified'}`;
      if (modalTreatment) modalTreatment.textContent = lead.treatment;
      if (modalDoctor) modalDoctor.textContent = lead.preferredDoctor;
      if (modalDateSlot) modalDateSlot.textContent = `${lead.preferredDate} (${lead.timeSlot})`;
      if (modalMessage) modalMessage.textContent = lead.message || 'No note submitted.';
      if (modalClinicalNotes) modalClinicalNotes.value = lead.notes || '';

      if (modalWhatsAppBtn) {
        const waText = encodeURIComponent(`Hello ${lead.patientName}, this is Dr. Kapil Jain / Dr. Mrs Anmoll Jain from Denticaa regarding your consultation.`);
        modalWhatsAppBtn.href = `https://wa.me/91${lead.patientPhone}?text=${waText}`;
      }

      if (modalChatTranscriptWrap && modalChatTranscript) {
        if (lead.chatTranscript && Array.isArray(lead.chatTranscript) && lead.chatTranscript.length) {
          modalChatTranscriptWrap.style.display = 'block';
          modalChatTranscript.innerHTML = lead.chatTranscript.map(turn => `
            <div class="transcript-bubble transcript-${turn.role === 'user' ? 'user' : 'model'}">
              <strong>${turn.role === 'user' ? '👤 Patient' : '🤖 Denticaa AI'}:</strong> ${turn.text}
            </div>
          `).join('');
        } else {
          modalChatTranscriptWrap.style.display = 'none';
        }
      }

      detailsModal?.classList.add('active');
    };

    modalSaveNotesBtn?.addEventListener('click', () => {
      if (!currentActiveLeadId) return;
      const notes = modalClinicalNotes?.value || '';
      window.denticaaCRM.updateLead(currentActiveLeadId, { notes });
      alert('Notes saved successfully!');
      detailsModal?.classList.remove('active');
      renderLeads();
    });

    modalCloseBtn?.addEventListener('click', () => detailsModal?.classList.remove('active'));
    detailsModal?.addEventListener('click', (e) => { if (e.target === detailsModal) detailsModal.classList.remove('active'); });

    // Filter listeners
    searchInput?.addEventListener('input', renderLeads);
    filterType?.addEventListener('change', renderLeads);
    filterDoctor?.addEventListener('change', renderLeads);
    filterStatus?.addEventListener('change', renderLeads);
    btnExport?.addEventListener('click', () => window.denticaaCRM.exportToCSV());

    const btnExportInter = document.getElementById('btnExportInterCSV');
    btnExportInter?.addEventListener('click', () => {
      const allLeads = window.denticaaCRM.getLeads();
      const interLeads = allLeads.filter(l => l.type === 'dental_tourism' || (l.patientPhone && l.patientPhone.startsWith('+')));
      
      const headers = ['Inquiry ID', 'Patient Name', 'Country', 'Phone', 'Email', 'Treatment', 'Doctor', 'Travel Window', 'Status', 'Date', 'Notes'];
      const rows = interLeads.map(l => [
        `"${l.id}"`,
        `"${l.patientName}"`,
        `"${l.patientCountry || 'Global'}"`,
        `"${l.patientPhone}"`,
        `"${l.patientEmail || ''}"`,
        `"${l.treatment}"`,
        `"${l.preferredDoctor}"`,
        `"${l.preferredDate || 'Flexible'}"`,
        `"${l.status}"`,
        `"${new Date(l.createdAt).toLocaleDateString()}"`,
        `"${(l.message || l.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Denticaa_Dental_Tourism_Leads_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    // 3. MEMBERSHIP PLANS & SUBSCRIBERS DIRECTORY CONTROLLER
    window.renderMembershipDirectory = function() {
      const tableBody = document.getElementById('crmMembershipsTableBody');
      const searchVal = (document.getElementById('crmMembershipSearchInput')?.value || '').toLowerCase().trim();
      if (!tableBody) return;

      const allLeads = window.denticaaCRM.getLeads();
      const members = allLeads.filter(l => l.type === 'membership_plan' || (l.id && l.id.startsWith('MEM-')));

      // Update Badges & Stats
      const badgeCount = document.getElementById('badgeMembershipsCount');
      if (badgeCount) badgeCount.textContent = members.length;

      const statTotal = document.getElementById('statTotalMemberships');
      const statRevenue = document.getElementById('statMembershipRevenue');
      const statFamily = document.getElementById('statFamilyCountCovered');
      const statExpiring = document.getElementById('statExpiringSoonMembers');

      let totalRev = 0;
      let totalLives = 0;
      let expiringCount = 0;
      const now = new Date();

      members.forEach(m => {
        const priceNum = parseInt((m.planPrice || '0').replace(/[^0-9]/g, '')) || (m.planName && m.planName.includes('4,999') ? 4999 : (m.planName && m.planName.includes('2,999') ? 2999 : 999));
        totalRev += priceNum;

        const famMatch = (m.familyMembers || '1').match(/\d+/);
        totalLives += famMatch ? parseInt(famMatch[0]) : 1;

        if (m.expiryDate) {
          const exp = new Date(m.expiryDate);
          const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
          if (diffDays <= 30 && diffDays >= 0) expiringCount++;
        }
      });

      if (statTotal) statTotal.textContent = members.length;
      if (statRevenue) statRevenue.textContent = '₹' + totalRev.toLocaleString('en-IN');
      if (statFamily) statFamily.textContent = totalLives + ' Lives';
      if (statExpiring) statExpiring.textContent = expiringCount;

      // Filter
      const filtered = members.filter(m => {
        if (!searchVal) return true;
        return (m.patientName || '').toLowerCase().includes(searchVal) ||
               (m.patientPhone || '').toLowerCase().includes(searchVal) ||
               (m.id || '').toLowerCase().includes(searchVal) ||
               (m.planName || '').toLowerCase().includes(searchVal) ||
               (m.address || '').toLowerCase().includes(searchVal);
      });

      if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 36px;">No membership subscribers found matching your search.</td></tr>`;
        return;
      }

      tableBody.innerHTML = filtered.map(m => {
        const expDate = m.expiryDate ? new Date(m.expiryDate) : null;
        let daysRemaining = expDate ? Math.ceil((expDate - now) / (1000 * 60 * 60 * 24)) : 365;
        let statusBadge = '<span style="background: #D1FAE5; color: #065F46; font-size: 0.76rem; font-weight: 800; padding: 4px 10px; border-radius: 50px; border: 1px solid #A7F3D0; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-circle-check"></i> Active (' + daysRemaining + 'd left)</span>';
        
        if (daysRemaining <= 0) {
          statusBadge = '<span style="background: #FEE2E2; color: #991B1B; font-size: 0.76rem; font-weight: 800; padding: 4px 10px; border-radius: 50px; border: 1px solid #FCA5A5; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-triangle-exclamation"></i> Expired</span>';
        } else if (daysRemaining <= 30) {
          statusBadge = '<span style="background: #FEF3C7; color: #92400E; font-size: 0.76rem; font-weight: 800; padding: 4px 10px; border-radius: 50px; border: 1px solid #FDE68A; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-clock"></i> Expiring Soon (' + daysRemaining + 'd)</span>';
        }

        const cleanPhone = (m.patientPhone || '').replace(/[^0-9+]/g, '');
        const waLink = `https://wa.me/${cleanPhone.startsWith('91') || cleanPhone.startsWith('+') ? cleanPhone.replace('+', '') : '91' + cleanPhone}?text=Hello%20${encodeURIComponent(m.patientName)},%20greetings%20from%20Denticaa%20Dental%20Care.%20Regarding%20your%20${encodeURIComponent(m.planName || 'Membership')}...`;

        return `
          <tr>
            <td><strong style="color: var(--gold-dark); font-family: monospace; font-size: 0.95rem;">${m.id}</strong></td>
            <td>
              <div style="font-weight: 700; color: var(--text-dark); font-size: 0.94rem;">${m.patientName}</div>
              <div style="font-size: 0.76rem; color: var(--text-muted);"><i class="fa-solid fa-location-dot"></i> ${m.address || 'Jabalpur'}</div>
            </td>
            <td>
              <strong style="color: #0F172A; font-size: 0.88rem;">${m.planName || 'Denticaa Prime'}</strong>
              <div style="font-size: 0.76rem; color: #059669; font-weight: 700;">${m.planPrice || '₹999'} / Year</div>
            </td>
            <td><span style="font-size: 0.82rem; font-weight: 600; color: #475569;">${m.familyMembers || '1 Member'}</span></td>
            <td style="font-size: 0.84rem; color: #334155;">${m.startDate || new Date(m.createdAt).toLocaleDateString()}</td>
            <td style="font-size: 0.84rem; font-weight: 700; color: #0F172A;">${m.expiryDate || '1 Year Valid'}</td>
            <td>${statusBadge}</td>
            <td>
              <span style="font-size: 0.78rem; font-weight: 700; color: #059669; background: #ECFDF5; padding: 3px 8px; border-radius: 6px; border: 1px solid #A7F3D0;">
                <i class="fa-solid fa-check"></i> ${m.paymentMode || 'Paid'}
              </span>
            </td>
            <td>
              <div style="display: flex; gap: 6px;">
                <a href="${waLink}" target="_blank" class="table-action-btn" title="Chat on WhatsApp" style="background: #ECFDF5; color: #059669; border-color: #A7F3D0;">
                  <i class="fa-brands fa-whatsapp"></i>
                </a>
                ${m.patientEmail ? `<a href="mailto:${m.patientEmail}" class="table-action-btn" title="Send Email"><i class="fa-regular fa-envelope"></i></a>` : ''}
                <button class="table-action-btn btn-del-action" onclick="deleteMembershipItem('${m.id}')" title="Delete Member">
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    };

    window.deleteMembershipItem = function(id) {
      if (confirm('Are you sure you want to remove this member record?')) {
        window.denticaaCRM.deleteLead(id);
        renderMembershipDirectory();
      }
    };

    window.exportMembershipsCSV = function() {
      const allLeads = window.denticaaCRM.getLeads();
      const members = allLeads.filter(l => l.type === 'membership_plan' || (l.id && l.id.startsWith('MEM-')));
      if (!members.length) return alert('No membership records to export.');

      const headers = ['Membership ID', 'Member Name', 'Phone', 'Email', 'Plan', 'Fee', 'Family Count', 'Address', 'Start Date', 'Expiry Date', 'Payment Mode', 'Status', 'Notes'];
      const rows = members.map(m => [
        `"${m.id}"`,
        `"${m.patientName}"`,
        `"${m.patientPhone}"`,
        `"${m.patientEmail || ''}"`,
        `"${m.planName || ''}"`,
        `"${m.planPrice || ''}"`,
        `"${m.familyMembers || '1'}"`,
        `"${(m.address || '').replace(/"/g, '""')}"`,
        `"${m.startDate || ''}"`,
        `"${m.expiryDate || ''}"`,
        `"${m.paymentMode || ''}"`,
        `"${m.status}"`,
        `"${(m.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Denticaa_Membership_Subscribers_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // 4. TRANSFORMATIONS CMS CONTROLLER
    window.renderTransformationsCMS = function() {
      const grid = document.getElementById('trCmsGrid');
      if (!grid) return;

      const list = window.denticaaCRM.getTransformations();
      if (!list.length) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">No smile transformations available. Click "+ Upload New Transformation" to add one.</p>';
        return;
      }

      grid.innerHTML = list.map(tr => `
        <div class="tr-cms-card" data-id="${tr.id}">
          <div class="tr-cms-img-pair">
            <img src="${tr.beforeImg}" alt="Before">
            <span class="tr-cms-img-label lbl-before">BEFORE</span>
            <img src="${tr.afterImg}" alt="After">
            <span class="tr-cms-img-label lbl-after">AFTER RESULT</span>
          </div>
          <div class="tr-cms-body">
            <div>
              <span style="font-size: 0.74rem; font-weight: 700; color: var(--gold-dark); background: var(--gold-subtle); padding: 3px 8px; border-radius: var(--radius-sm);">${tr.tag}</span>
              <h4 class="font-serif" style="font-size: 1.1rem; margin: 8px 0 4px 0;">${tr.title}</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 12px;">${tr.desc}</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 10px;">
              <span style="font-size: 0.76rem; font-weight: 600; color: var(--text-dark);">${tr.doctor}</span>
              <button class="table-action-btn btn-del-action" onclick="deleteTransformationItem('${tr.id}')" title="Delete Transformation">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `).join('');
    };

    window.deleteTransformationItem = function(id) {
      if (confirm('Are you sure you want to remove this smile transformation?')) {
        window.denticaaCRM.deleteTransformation(id);
        renderTransformationsCMS();
      }
    };

    // Upload Transformation Modal
    btnUploadTr?.addEventListener('click', () => uploadTrModal?.classList.add('active'));
    uploadTrCloseBtn?.addEventListener('click', () => uploadTrModal?.classList.remove('active'));
    uploadTrCancelBtn?.addEventListener('click', () => uploadTrModal?.classList.remove('active'));

    uploadTrForm?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = document.getElementById('trTitle')?.value.trim();
      const tag = document.getElementById('trTag')?.value.trim();
      const doctor = document.getElementById('trDoctor')?.value;
      const desc = document.getElementById('trDesc')?.value.trim();

      const beforeFile = document.getElementById('trBeforeFile')?.files[0];
      const afterFile = document.getElementById('trAfterFile')?.files[0];
      const beforeUrl = document.getElementById('trBeforeUrl')?.value.trim();
      const afterUrl = document.getElementById('trAfterUrl')?.value.trim();

      // Read files or fallback to URLs
      const readFileAsBase64 = (file) => new Promise((resolve) => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });

      const beforeBase64 = beforeFile ? await readFileAsBase64(beforeFile) : (beforeUrl || 'images/before-crowding.png');
      const afterBase64 = afterFile ? await readFileAsBase64(afterFile) : (afterUrl || 'images/after-crowding.png');

      window.denticaaCRM.saveTransformation({
        title,
        tag,
        doctor,
        desc,
        beforeImg: beforeBase64,
        afterImg: afterBase64
      });

      alert('Smile transformation uploaded successfully! It is now live on the website.');
      uploadTrForm.reset();
      uploadTrModal?.classList.remove('active');
      renderTransformationsCMS();
    });

    // Listeners for live sync
    window.addEventListener('denticaa_lead_added', () => {
      updateStats();
      renderLeads();
      if (window.renderInternationalLeads) renderInternationalLeads();
      if (window.renderMembershipDirectory) renderMembershipDirectory();
    });
    window.addEventListener('denticaa_lead_updated', () => {
      updateStats();
      renderLeads();
      if (window.renderInternationalLeads) renderInternationalLeads();
      if (window.renderMembershipDirectory) renderMembershipDirectory();
    });

    updateStats();
    renderLeads();
    if (window.renderInternationalLeads) renderInternationalLeads();
    if (window.renderMembershipDirectory) renderMembershipDirectory();
  }

  // Check authentication on page load
  checkAuth();
});
