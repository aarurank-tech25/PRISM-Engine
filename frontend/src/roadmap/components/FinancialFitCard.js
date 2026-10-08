/**
 * Component: FinancialFitCard
 * Renders Financial Feasibility assessment widget based on PRISM engine data.
 */

export function renderFinancialFit(finData) {
  const statusClass = finData.status_code;
  const statusTitle = finData.status;

  const costFormatted = finData.estimated_cost ? `${finData.currency}${finData.estimated_cost.toLocaleString('en-IN')}` : 'N/A';
  const budgetFormatted = finData.available_budget ? `${finData.currency}${finData.available_budget.toLocaleString('en-IN')}` : 'N/A';
  const gapFormatted = finData.gap > 0 ? `${finData.currency}${finData.gap.toLocaleString('en-IN')}` : '₹0 (No Gap)';

  return `
    <div class="prism-financial-box ${statusClass}">
      <div class="prism-financial-status">
        <span>💳 Financial Assessment:</span> ${statusTitle}
      </div>

      <div class="prism-fin-metric-row">
        <span>Estimated Education Cost:</span>
        <strong style="color:var(--prism-navy-900);">${costFormatted}</strong>
      </div>

      <div class="prism-fin-metric-row">
        <span>Available Education Budget:</span>
        <strong style="color:var(--prism-navy-900);">${budgetFormatted}</strong>
      </div>

      <div class="prism-fin-metric-row" style="padding-top:0.35rem; border-top:1px dashed rgba(0,0,0,0.1);">
        <span>Financial Gap / Deficit:</span>
        <strong style="color:${finData.gap > 0 ? 'var(--prism-rose-600)' : 'var(--prism-emerald-600)'};">${gapFormatted}</strong>
      </div>

      <p class="prism-fin-action-text">
        <strong>Recommended Strategy:</strong> ${finData.action_recommendation}
      </p>
    </div>
  `;
}
