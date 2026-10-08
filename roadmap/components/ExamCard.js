/**
 * Component: ExamCard
 * Renders entrance exam cards with category filtering and official link redirects.
 */

export function renderExamsSection(exams, activeFilter = 'All') {
  const categories = ['All', 'Engineering', 'Science / Computer Apps', 'Higher Studies'];
  
  const filteredExams = activeFilter === 'All' ? exams : exams.filter(e => e.stream.toLowerCase().includes(activeFilter.toLowerCase()) || activeFilter.toLowerCase().includes(e.stream.toLowerCase()));

  const filterChipsHtml = categories.map(cat => `
    <button class="prism-filter-chip ${cat === activeFilter ? 'active' : ''}" data-exam-filter="${cat}">
      ${cat}
    </button>
  `).join('');

  const examCardsHtml = filteredExams.map(exam => `
    <div class="prism-exam-card">
      <div>
        <span style="font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--prism-blue-600);">${exam.level}</span>
        <h3 class="prism-exam-title">${exam.name}</h3>
        <p class="prism-exam-purpose">${exam.purpose}</p>

        <div class="prism-exam-meta-table">
          <div class="prism-exam-row">
            <span class="prism-exam-key">Eligibility:</span>
            <span class="prism-exam-val">${exam.eligibility}</span>
          </div>
          <div class="prism-exam-row">
            <span class="prism-exam-key">Application:</span>
            <span class="prism-exam-val">${exam.application_period}</span>
          </div>
        </div>

        <p style="font-size:0.775rem; color:var(--prism-slate-600); margin-bottom:1rem; line-height:1.4;">
          <strong style="color:var(--prism-navy-900);">Why it matters:</strong> ${exam.why_it_matters}
        </p>
      </div>

      <div>
        <a href="${exam.official_url}" target="_blank" rel="noopener noreferrer" class="prism-btn-link">
          <span>View Official Details</span> ↗
        </a>
      </div>
    </div>
  `).join('');

  return `
    <div class="prism-card">
      <div class="prism-card-header">
        <div>
          <h2 class="prism-section-title">📝 Relevant Entrance Exams</h2>
          <p class="prism-section-subtitle">National and state-level exams relevant to your career path</p>
        </div>
      </div>

      <div class="prism-filter-bar">
        ${filterChipsHtml}
      </div>

      <div class="prism-exams-grid">
        ${examCardsHtml.length > 0 ? examCardsHtml : '<p style="font-size:0.875rem; color:var(--prism-slate-500); grid-column:1/-1;">No entrance exams match the selected filter.</p>'}
      </div>
      <span class="prism-demo-tag">* Official portal links connect directly to NTA and examining body portals.</span>
    </div>
  `;
}
