/**
 * PRISM Engine - Education Roadmap, Exams & Scholarships Module
 * Responsible Developer: Mathi
 * Main Orchestrator Class: PrismRoadmapModule
 */

import { MOCK_PRISM_DATA } from './data/mock_prism_data.js';
import { renderCareerHeader } from './components/CareerHeader.js';
import { renderRoadmapTimeline, renderStepModal } from './components/RoadmapTimeline.js';
import { renderSkillProgress } from './components/SkillProgress.js';
import { renderExamsSection } from './components/ExamCard.js';
import { renderScholarshipsSection } from './components/ScholarshipCard.js';
import { renderAlternativePathways } from './components/AlternativePathCard.js';
import { renderFinancialFit } from './components/FinancialFitCard.js';
import { renderCareerMilestones } from './components/CareerMilestones.js';
import { renderNextAction } from './components/NextActionCard.js';

export class PrismRoadmapModule {
  constructor(containerId, options = {}) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!this.container) {
      console.error(`[PrismRoadmapModule] Container #${containerId} not found in DOM.`);
      return;
    }

    this.dataSources = options.dataSources || MOCK_PRISM_DATA;
    this.activeCareerId = options.initialCareer || 'ai_engineer';
    this.activeExamFilter = 'All';
    this.currentData = this.dataSources[this.activeCareerId] || this.dataSources['ai_engineer'];

    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  /**
   * Primary entry point for updating data dynamically from PRISM Engine API
   */
  setCareerData(careerData) {
    if (!careerData) return;
    this.currentData = careerData;
    this.render();
    this.attachEventListeners();
  }

  render() {
    const data = this.currentData;
    const availableCareers = Object.keys(this.dataSources).map(key => ({
      id: key,
      name: this.dataSources[key].career,
      score: this.dataSources[key].career_score
    }));

    this.container.innerHTML = `
      <div class="prism-roadmap-root">
        <div class="prism-container">
          
          <!-- Section 1: Career Header -->
          ${renderCareerHeader(data, availableCareers)}

          <!-- Main Desktop Grid: Left Content / Right Sidebar -->
          <div class="prism-main-grid">
            
            <!-- LEFT MAIN CONTENT -->
            <div class="prism-left-col">
              
              <!-- Section 2: Education Roadmap Visual Timeline -->
              ${renderRoadmapTimeline(data.roadmap)}

              <!-- Section 3: Skills to Build -->
              ${renderSkillProgress(data.skills)}

              <!-- Section 6: Alternative Pathways (Low Cost / Flexible) -->
              ${renderAlternativePathways(data.alternative_pathways)}

              <!-- Section 4: Entrance Exams -->
              ${renderExamsSection(data.exams, this.activeExamFilter)}

              <!-- Section 5: Scholarships & Financial Aid -->
              ${renderScholarshipsSection(data.scholarships)}

              <!-- Section 9: Personalized Next Action -->
              ${renderNextAction(data.next_steps)}

            </div>

            <!-- RIGHT SIDEBAR STATS & FINANCIAL FIT -->
            <div class="prism-right-sidebar">

              <!-- Quick Stats Card -->
              <div class="prism-card" style="margin-bottom:1.25rem;">
                <h3 style="font-size:0.95rem; font-weight:700; color:var(--prism-navy-900); margin-bottom:0.75rem; display:flex; align-items:center; gap:0.4rem;">
                  📊 Career Quick Stats
                </h3>
                <div style="font-size:0.825rem; color:var(--prism-slate-600); line-height:1.6;">
                  <div style="display:flex; justify-content:space-between; padding:0.3rem 0; border-bottom:1px solid var(--prism-slate-100);">
                    <span>Avg Entry Salary:</span>
                    <strong style="color:var(--prism-navy-900);">${data.quick_stats ? data.quick_stats.avg_entry_salary : '₹8-12 LPA'}</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between; padding:0.3rem 0; border-bottom:1px solid var(--prism-slate-100);">
                    <span>Industry Growth:</span>
                    <strong style="color:var(--prism-emerald-600);">${data.quick_stats ? data.quick_stats.industry_growth : '+25%'}</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between; padding:0.3rem 0;">
                    <span>Hiring Demand:</span>
                    <strong style="color:var(--prism-navy-900);">${data.quick_stats ? data.quick_stats.hiring_demand : 'High'}</strong>
                  </div>
                </div>
              </div>
              
              <!-- Section 7: Financial-Aware Pathway -->
              ${renderFinancialFit(data.financial_fit)}

              <!-- Section 8: Career Milestones -->
              ${renderCareerMilestones(data.milestones)}

              <!-- Print / Save Pathway Widget -->
              <div style="margin-top:1.5rem; text-align:center;">
                <button id="prism-print-btn" class="prism-btn-detail" style="width:100%; padding:0.65rem; font-size:0.85rem;">
                  🖨️ Export / Print Education Pathway
                </button>
              </div>

            </div>

          </div>

        </div>

        <!-- Dynamic Modal Container -->
        <div id="prism-modal-wrapper"></div>
      </div>
    `;
  }

  attachEventListeners() {
    // 1. Career Switcher Dropdown
    const selectEl = this.container.querySelector('#prism-career-select');
    if (selectEl) {
      selectEl.addEventListener('change', (e) => {
        const newId = e.target.value;
        if (this.dataSources[newId]) {
          this.activeCareerId = newId;
          this.currentData = this.dataSources[newId];
          this.render();
          this.attachEventListeners();
        }
      });
    }

    // 2. Exam Filter Chips
    const filterChips = this.container.querySelectorAll('[data-exam-filter]');
    filterChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        const filterVal = e.target.getAttribute('data-exam-filter');
        this.activeExamFilter = filterVal;
        
        // Re-render exams container
        const examCardContainer = this.container.querySelector('.prism-exams-grid').parentElement;
        if (examCardContainer) {
          examCardContainer.outerHTML = renderExamsSection(this.currentData.exams, this.activeExamFilter);
          this.attachEventListeners();
        }
      });
    });

    // 3. Step Detail Buttons
    const detailBtns = this.container.querySelectorAll('.prism-btn-detail[data-step-index]');
    detailBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stepIdx = parseInt(e.target.getAttribute('data-step-index'), 10);
        const stepData = this.currentData.roadmap[stepIdx];
        if (stepData) {
          this.openModal(renderStepModal(stepData));
        }
      });
    });

    // 4. Start Next Step Button
    const startNextBtn = this.container.querySelector('#prism-start-next-step-btn');
    if (startNextBtn) {
      startNextBtn.addEventListener('click', () => {
        const nextStepsHtml = this.currentData.next_steps.map((s, i) => `
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.6rem;">
            <input type="checkbox" id="next-chk-${i}" style="width:16px; height:16px;" />
            <label for="next-chk-${i}" style="font-size:0.875rem; color:var(--prism-navy-900); cursor:pointer;">${s}</label>
          </div>
        `).join('');

        const modalHtml = `
          <div class="prism-modal-backdrop" id="prism-step-modal">
            <div class="prism-modal-box">
              <button class="prism-modal-close" id="prism-modal-close-btn">&times;</button>
              <h2 style="font-size:1.35rem; font-weight:800; color:var(--prism-navy-900); margin-bottom:0.5rem;">🚀 Launching Your Next Steps</h2>
              <p style="font-size:0.875rem; color:var(--prism-slate-600); margin-bottom:1rem;">Mark actions as you complete them to update your PRISM AI career progression tracker:</p>
              
              <div style="background:var(--prism-slate-50); padding:1rem; border-radius:var(--prism-radius-md); border:1px solid var(--prism-slate-200); margin-bottom:1.25rem;">
                ${nextStepsHtml}
              </div>

              <div style="display:flex; justify-content:flex-end;">
                <button class="prism-btn-primary" id="prism-modal-done-btn">Save Progress</button>
              </div>
            </div>
          </div>
        `;
        this.openModal(modalHtml);
      });
    }

    // 5. Print Button
    const printBtn = this.container.querySelector('#prism-print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  openModal(modalHtml) {
    const modalWrapper = this.container.querySelector('#prism-modal-wrapper');
    if (!modalWrapper) return;

    modalWrapper.innerHTML = modalHtml;

    const closeBtn = modalWrapper.querySelector('#prism-modal-close-btn');
    const doneBtn = modalWrapper.querySelector('#prism-modal-done-btn');
    const backdrop = modalWrapper.querySelector('#prism-step-modal');

    const closeModal = () => {
      modalWrapper.innerHTML = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (doneBtn) doneBtn.addEventListener('click', closeModal);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }
  }
}
