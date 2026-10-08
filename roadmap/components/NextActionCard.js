/**
 * Component: NextActionCard
 * Renders bottom "Your Next Best Step" callout card with interactive action launcher.
 */

export function renderNextAction(nextSteps) {
  const itemsHtml = nextSteps.map((stepText, idx) => `
    <li class="prism-next-item">
      <span class="prism-next-num">0${idx + 1}.</span>
      <span>${stepText}</span>
    </li>
  `).join('');

  return `
    <div class="prism-next-action-card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
        <div>
          <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:#93c5fd;">Personalized Action Plan</span>
          <h2 class="prism-next-title">Your Next Best Step</h2>
          <p class="prism-next-desc">Based on your current academic profile and target career match:</p>
        </div>

        <button class="prism-btn-primary" id="prism-start-next-step-btn" style="background:#2563eb; color:#ffffff; box-shadow:0 4px 14px rgba(37,99,235,0.4);">
          🚀 Start This Step
        </button>
      </div>

      <ul class="prism-next-list" style="margin-top:1rem;">
        ${itemsHtml}
      </ul>
    </div>
  `;
}
