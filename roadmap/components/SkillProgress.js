/**
 * Component: SkillProgress
 * Renders categorized skill sections (FOUNDATION, CORE, ADVANCED) with progress indicators.
 */

export function renderSkillProgress(skillsData) {
  const renderGroup = (label, skills) => {
    if (!skills || skills.length === 0) return '';

    const rowsHtml = skills.map(skill => {
      const levelClass = skill.progress >= 75 ? 'high' : skill.progress >= 50 ? 'medium' : 'low';
      return `
        <div class="prism-skill-row">
          <div class="prism-skill-info">
            <span class="prism-skill-name">${skill.name}</span>
            <span class="prism-skill-val">${skill.progress}% · <span style="font-weight:500; font-size:0.75rem; color:var(--prism-slate-500);">${skill.status}</span></span>
          </div>
          <div class="prism-progress-bg">
            <div class="prism-progress-fill ${levelClass}" style="width: ${skill.progress}%;"></div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="prism-skill-group">
        <div class="prism-group-label">${label}</div>
        ${rowsHtml}
      </div>
    `;
  };

  return `
    <div class="prism-card">
      <div class="prism-card-header">
        <div>
          <h2 class="prism-section-title">⚡ Skills to Build</h2>
          <p class="prism-section-subtitle">Personalized technical and analytical competencies required for this role</p>
        </div>
      </div>

      ${renderGroup('FOUNDATION SKILLS', skillsData.foundation)}
      ${renderGroup('CORE COMPETENCIES', skillsData.core)}
      ${renderGroup('ADVANCED SPECIALIZATION', skillsData.advanced)}
    </div>
  `;
}
