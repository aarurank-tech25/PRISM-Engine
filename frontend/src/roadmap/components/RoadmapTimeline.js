/**
 * Component: RoadmapTimeline
 * Renders vertical timeline container and modal drawer for step details.
 */

import { renderRoadmapStep } from './RoadmapStep.js';

export function renderRoadmapTimeline(roadmap) {
  const stepsHtml = roadmap.map((step, idx) => renderRoadmapStep(step, idx)).join('');

  return `
    <div class="prism-card">
      <div class="prism-card-header">
        <div>
          <h2 class="prism-section-title">🗺️ Your Education Roadmap</h2>
          <p class="prism-section-subtitle">Realistic step-by-step career progression recommended for you</p>
        </div>
      </div>

      <div class="prism-timeline-container">
        <div class="prism-timeline-line"></div>
        ${stepsHtml}
      </div>
    </div>
  `;
}

export function renderStepModal(step) {
  const coursesHtml = step.details.courses.map(c => `<li>📚 ${c}</li>`).join('');
  const projectsHtml = step.details.projects.length > 0 ? 
    step.details.projects.map(p => `<li>🚀 ${p}</li>`).join('') : '<li>No specific projects required at this stage.</li>';
  const checklistHtml = step.details.checklist.map((item, idx) => `
    <li style="margin-bottom:0.4rem; display:flex; align-items:flex-start; gap:0.5rem;">
      <input type="checkbox" id="chk-${idx}" style="margin-top:0.2rem;" />
      <label for="chk-${idx}" style="font-size:0.85rem; color:var(--prism-navy-900); cursor:pointer;">${item}</label>
    </li>
  `).join('');

  return `
    <div class="prism-modal-backdrop" id="prism-step-modal">
      <div class="prism-modal-box">
        <button class="prism-modal-close" id="prism-modal-close-btn">&times;</button>
        <span style="font-size:0.75rem; font-weight:700; color:var(--prism-blue-600); letter-spacing:0.05em;">${step.step_number}</span>
        <h2 style="font-size:1.35rem; font-weight:800; color:var(--prism-navy-900); margin:0.2rem 0 0.5rem 0;">${step.title}</h2>
        <p style="font-size:0.9rem; color:var(--prism-slate-600); margin-bottom:1.25rem;">${step.short_description}</p>

        <div style="background:var(--prism-slate-50); padding:1rem; border-radius:var(--prism-radius-md); border:1px solid var(--prism-slate-200); margin-bottom:1rem;">
          <h4 style="font-size:0.85rem; font-weight:700; color:var(--prism-navy-900); margin-bottom:0.5rem;">Recommended Courses & Study Material:</h4>
          <ul style="font-size:0.825rem; color:var(--prism-slate-600); list-style:none; line-height:1.6;">
            ${coursesHtml}
          </ul>
        </div>

        <div style="background:var(--prism-slate-50); padding:1rem; border-radius:var(--prism-radius-md); border:1px solid var(--prism-slate-200); margin-bottom:1rem;">
          <h4 style="font-size:0.85rem; font-weight:700; color:var(--prism-navy-900); margin-bottom:0.5rem;">Recommended Hands-on Projects:</h4>
          <ul style="font-size:0.825rem; color:var(--prism-slate-600); list-style:none; line-height:1.6;">
            ${projectsHtml}
          </ul>
        </div>

        <div style="margin-bottom:1.25rem;">
          <h4 style="font-size:0.85rem; font-weight:700; color:var(--prism-navy-900); margin-bottom:0.5rem;">Action Checklist:</h4>
          <ul style="list-style:none;">
            ${checklistHtml}
          </ul>
        </div>

        <div style="display:flex; justify-content:flex-end;">
          <button class="prism-btn-primary" id="prism-modal-done-btn">Got It & Mark Progress</button>
        </div>
      </div>
    </div>
  `;
}
