/* ==========================================================================
   DENTICAA DENTAL CLINIC — ADMIN CRM & CMS CONTROLLER
   Handles Password Auth (denticaa123), Leads Table, Transcripts & Transformations CMS
   ========================================================================== */

const CORRECT_ADMIN_PASSWORD = 'denticaa123';

document.addEventListener('DOMContentLoaded', () => {
  if (!window.denticaaCRM) return;

  // 1. AUTHENTICATION & LOCK SCREEN
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
      authInput?.focus();
    }
  }

  authForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = (authInput?.value || '').trim();
    if (entered === CORRECT_ADMIN_PASSWORD) {
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
    if (authInput) authInput.value = '';
  });

  // Tab Switcher
  window.switchCRMTab = function(tab) {
    const tabLeads = document.getElementById('crmTabLeads');
    const tabTr = document.getElementById('crmTabTransformations');
    const btnLeads = document.getElementById('tabBtnLeads');
    const btnTr = document.getElementById('tabBtnTransformations');

    if (tab === 'leads') {
      if (tabLeads) tabLeads.style.display = 'block';
      if (tabTr) tabTr.style.display = 'none';
      btnLeads?.classList.add('active');
      btnTr?.classList.remove('active');
    } else {
      if (tabLeads) tabLeads.style.display = 'none';
      if (tabTr) tabTr.style.display = 'block';
      btnLeads?.classList.remove('active');
      btnTr?.classList.add('active');
      renderTransformationsCMS();
    }
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
      if (statTotal) statTotal.textContent = stats.total;
      if (statNew) statNew.textContent = stats.newLeads;
      if (statConfirmed) statConfirmed.textContent = stats.confirmed;
      if (statBot) statBot.textContent = stats.chatbotLeads;
      if (statDocSplit) statDocSplit.textContent = `${stats.drKapilLeads} / ${stats.drAnmollLeads}`;
    }

    function renderLeads() {
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

    // 3. TRANSFORMATIONS CMS CONTROLLER
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
    window.addEventListener('denticaa_lead_added', () => { updateStats(); renderLeads(); });
    window.addEventListener('denticaa_lead_updated', () => { updateStats(); renderLeads(); });

    updateStats();
    renderLeads();
  }

  // Check authentication on load
  checkAuth();
});
