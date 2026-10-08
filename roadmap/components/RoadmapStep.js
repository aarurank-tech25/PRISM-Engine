/**
 * Component: RoadmapStep
 * Renders individual step card in the visual timeline.
 */

export function renderRoadmapStep(step, index) {
  const statusClass = step.status;
  const statusLabel = step.status === 'completed' ? 'Completed' :
                      step.status === 'in_progress' ? 'In Progress' : 'Not Started';

  const skillsHtml = step.recommended_skills.map(s => `
    <span class="prism-tag-mini">${s}</span>
  `).join('');

  return `
    <div class="prism-step-item status-${statusClass}">
      <div class="prism-step-dot">${index + 1}</div>
      <div class="prism-step-card">
        <div class="prism-step-meta">
          <span class="prism-step-num">${step.step_number}</span>
          <span class="prism-status-badge ${statusClass}">${statusLabel}</span>
        </div>
        <h3 class="prism-step-title">${step.title}</h3>
        <p class="prism-step-desc">${step.short_description}</p>
        
        <div class="prism-step-details-grid">
          <div>
            <span style="font-weight:600; color:var(--prism-slate-600); margin-right:0.35rem;">Learn:</span>
            <div class="prism-step-skills" style="display:inline-flex;">${skillsHtml}</div>
          </div>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <span>⏱️ ${step.estimated_duration}</span>
            <button class="prism-btn-detail" data-step-index="${index}">View Details</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
