/**
 * Component: CareerMilestones
 * Renders sequential milestone progress tracker.
 */

export function renderCareerMilestones(milestones) {
  const listHtml = milestones.map(m => `
    <div class="prism-milestone-item ${m.done ? 'done' : ''}">
      <div class="prism-milestone-check">${m.done ? '✓' : '•'}</div>
      <div class="prism-milestone-info">
        <div class="prism-milestone-name">${m.step}</div>
        <div class="prism-milestone-action">${m.action}</div>
      </div>
      <span class="prism-status-badge ${m.done ? 'completed' : 'not_started'}">${m.status}</span>
    </div>
  `).join('');

  return `
    <div class="prism-card">
      <div class="prism-card-header">
        <div>
          <h2 class="prism-section-title">🏆 Career Milestones</h2>
          <p class="prism-section-subtitle">Track your long-term education and career checkpoints</p>
        </div>
      </div>

      <div class="prism-milestones-list">
        ${listHtml}
      </div>
    </div>
  `;
}
