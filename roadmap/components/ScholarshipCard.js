/**
 * Component: ScholarshipCard
 * Renders Scholarships & Financial Aid section cards.
 */

export function renderScholarshipsSection(scholarships) {
  const cardsHtml = scholarships.map(sch => `
    <div class="prism-scholarship-card">
      <div>
        <span style="font-size:0.7rem; font-weight:600; color:var(--prism-slate-500); display:block; margin-bottom:0.2rem;">${sch.provider}</span>
        <h3 class="prism-scholarship-name">${sch.name}</h3>
        <div class="prism-benefit-badge">💰 Benefit: ${sch.benefit}</div>

        <div class="prism-scholarship-details">
          <p style="margin-bottom:0.4rem;"><strong>Eligibility:</strong> ${sch.eligibility}</p>
          <p style="margin-bottom:0.4rem;"><strong>Application Window:</strong> ${sch.deadline}</p>
          <p style="color:var(--prism-emerald-600); font-weight:500;">✓ Match Reason: ${sch.why_eligible}</p>
        </div>
      </div>

      <div>
        <a href="${sch.apply_url}" target="_blank" rel="noopener noreferrer" class="prism-btn-link" style="background:var(--prism-emerald-50); color:var(--prism-emerald-600); border-color:var(--prism-emerald-100);">
          <span>View & Apply</span> ↗
        </a>
      </div>
    </div>
  `).join('');

  return `
    <div class="prism-card">
      <div class="prism-card-header">
        <div>
          <h2 class="prism-section-title">🎓 Scholarships & Financial Aid</h2>
          <p class="prism-section-subtitle">Verified government and foundation schemes matching your income & academic profile</p>
        </div>
      </div>

      <div class="prism-scholarships-grid">
        ${cardsHtml}
      </div>
      <span class="prism-demo-tag">* Data verified with National Scholarship Portal (NSP) & official foundation schedules.</span>
    </div>
  `;
}
