/**
 * Component: CareerHeader
 * Renders the top career summary header, fit score badge, matching skills, and career selector.
 */

export function renderCareerHeader(data, availableCareers, onCareerChange) {
  const matchingSkillsHtml = data.matching_skills.map(skill => `
    <span class="prism-skill-pill">${skill}</span>
  `).join('');

  const careerOptionsHtml = availableCareers.map(c => `
    <option value="${c.id}" ${c.id === data.career.toLowerCase().replace(/\s+/g, '_') ? 'selected' : ''}>
      ${c.name} (${c.score}% Fit)
    </option>
  `).join('');

  return `
    <div class="prism-header-card">
      <div class="prism-career-switcher">
        <span>Switch PRISM Recommendation Demo:</span>
        <select id="prism-career-select" class="prism-career-select">
          ${careerOptionsHtml}
        </select>
      </div>

      <div class="prism-header-top">
        <div>
          <div class="prism-career-badge-group">
            <span class="prism-badge-tag">PRISM AI Recommendation</span>
            <span class="prism-badge-tag" style="background: rgba(37,99,235,0.2); color:#bfdbfe;">${data.education_level}</span>
          </div>
          <h1 class="prism-career-title">${data.career}</h1>
          <p class="prism-career-description">
            "${data.short_description}"
          </p>
        </div>

        <div class="prism-fit-card">
          <div class="prism-fit-label">Career Fit</div>
          <div class="prism-fit-val">${data.career_score}%</div>
          <div class="prism-fit-sub">Strong Match</div>
        </div>
      </div>

      <div class="prism-matching-skills">
        <span class="prism-matching-label">Your Strong Matches:</span>
        ${matchingSkillsHtml}
      </div>
    </div>
  `;
}
