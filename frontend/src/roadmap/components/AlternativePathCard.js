/**
 * Component: AlternativePathCard
 * Renders low-cost and alternative flexible pathways comparison.
 */

export function renderAlternativePathways(pathways) {
  const cardsHtml = pathways.map(path => {
    const isPrimary = path.is_primary;
    const badgeClass = isPrimary ? '' : 'alternative';
    
    return `
      <div class="prism-alt-card ${isPrimary ? 'primary' : ''}">
        <span class="prism-alt-badge ${badgeClass}">${path.type}</span>
        <h3 class="prism-alt-title">${path.title}</h3>

        <div class="prism-alt-stats-row">
          <span class="prism-alt-stat">💵 ${path.cost_level}</span>
          <span class="prism-alt-stat">⏳ ${path.duration}</span>
          <span class="prism-alt-stat">🎯 ${path.difficulty}</span>
        </div>

        <ul class="prism-alt-steps">
          <li style="margin-bottom:0.4rem;"><strong>Key Advantage:</strong> ${path.advantages}</li>
          <li style="margin-bottom:0.4rem;"><strong>Trade-off:</strong> ${path.trade_offs}</li>
        </ul>

        <div class="prism-alt-advantage">
          <strong>Next Action:</strong> ${path.next_step}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="prism-card">
      <div class="prism-card-header">
        <div>
          <h2 class="prism-section-title">🔄 Alternative Pathways (Lower-Cost & Flexible Routes)</h2>
          <p class="prism-section-subtitle">Practical alternate routes if traditional 4-year degree options face financial or location constraints</p>
        </div>
      </div>

      <div class="prism-alt-grid">
        ${cardsHtml}
      </div>
    </div>
  `;
}
