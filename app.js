// Literacy Pal - Refactored Application JavaScript
// Modal-based UI with hub/dashboard layout
// ============================================

// ============================================
// State Management
// ============================================
const appState = {
    activeModal: null,
    flowchartData: null,
    tierFlowchartData: null,
    interventionMenuData: null,
    interventionMenu: {
        language: 'English',
        screener: null,
        subtest: null,
        pillars: [],
        itemType: null
    },
    currentTierStep: {},
    checklistStates: {
        tier1: new Array(8).fill(false),
        tier2: new Array(5).fill(false),
        tier3: new Array(4).fill(false)
    }
};

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Literacy Pal - Initializing...');
    
    // Load data
    await Promise.all([
        loadInterventionData(),
        loadTierFlowchartData(),
        loadInterventionMenuData()
    ]);
    
    // Setup modal triggers
    setupModalTriggers();
    
    // Setup keyboard navigation
    setupKeyboardNav();
    
    // Initialize tier content
    initializeTierContent();
    
    // Setup quick nav visibility
    setupQuickNav();
    
    console.log('Literacy Pal - Ready!');
});

// ============================================
// Data Loading
// ============================================
async function loadInterventionData() {
    try {
        const response = await fetch('data/interventions.json');
        if (!response.ok) throw new Error('Failed to load intervention data');
        appState.flowchartData = await response.json();
        console.log('Intervention data loaded successfully');
    } catch (error) {
        console.error('Error loading intervention data:', error);
        appState.flowchartData = { tiers: [] };
    }
}

async function loadTierFlowchartData() {
    try {
        const response = await fetch('data/tier-flowcharts.json');
        if (!response.ok) throw new Error('Failed to load tier flowchart data');
        appState.tierFlowchartData = await response.json();
        console.log('Tier flowchart data loaded successfully');
    } catch (error) {
        console.error('Error loading tier flowchart data:', error);
        appState.tierFlowchartData = { tier1: {}, tier2: {}, tier3: {} };
    }
}

async function loadInterventionMenuData() {
    try {
        const response = await fetch('data/intervention-menu.json');
        if (!response.ok) throw new Error('Failed to load intervention menu data');
        appState.interventionMenuData = await response.json();
        console.log('Intervention menu data loaded successfully');
    } catch (error) {
        console.error('Error loading intervention menu data:', error);
        appState.interventionMenuData = { screeners: [], interventions: [], assessments: [], literacy_pillars: [] };
    }
}

// ============================================
// Modal Management
// ============================================
function setupModalTriggers() {
    // Hub card triggers
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.dataset.modal;
            openModal(modalId);
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Close any open modal first
    if (appState.activeModal) {
        closeModal(appState.activeModal, false);
    }
    
    // Open new modal
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    appState.activeModal = modalId;
    
    // Show quick nav
    document.getElementById('quick-nav')?.classList.add('visible');
    
    // Focus first focusable element
    setTimeout(() => {
        const focusable = modal.querySelector('button, [href], input, select, textarea');
        focusable?.focus();
    }, 100);
}

function closeModal(modalId, animate = true) {
    const modal = document.getElementById(modalId || appState.activeModal);
    if (!modal) return;
    
    modal.setAttribute('aria-hidden', 'true');
    
    if (modalId === appState.activeModal || !modalId) {
        appState.activeModal = null;
        document.body.classList.remove('modal-open');
        document.getElementById('quick-nav')?.classList.remove('visible');
    }
}

function setupKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && appState.activeModal) {
            closeModal(appState.activeModal);
        }
    });
}

function setupQuickNav() {
    document.querySelectorAll('.quick-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.dataset.modal;
            if (modalId) {
                openModal(modalId);
            }
        });
    });
}

// ============================================
// Tier Flowchart Content
// ============================================
function initializeTierContent() {
    renderTier1Content();
    renderTier2Content();
    renderTier3Content();
}

function renderTier1Content() {
    const container = document.getElementById('tier1-content');
    if (!container) return;
    
    const tier1Data = appState.tierFlowchartData?.tier1 || {};
    const principles = tier1Data.principles || [
        "Use explicit, direct instruction",
        "Teach in a systematic, sequential manner",
        "Provide multiple practice opportunities",
        "Give immediate corrective feedback",
        "Use scaffolding and modeling",
        "Ensure high student engagement",
        "Monitor progress frequently",
        "Differentiate based on student needs"
    ];
    
    container.innerHTML = `
        <div class="tier-content">
            <div class="tier-intro">
                <h3>Universal Screening & Core Instruction</h3>
                <p>Tier 1 applies to all students. Review principles, administer screening, and evaluate results to determine if additional support is needed.</p>
            </div>
            
            <div class="flowchart-steps">
                <div class="flow-step">
                    <div class="step-number">1</div>
                    <h4>Review Principles of Explicit Instruction</h4>
                    <p>Complete this checklist before proceeding to screening.</p>
                    <ul class="checklist">
                        ${principles.map((p, i) => `
                            <li>
                                <input type="checkbox" id="t1-check-${i}" 
                                    ${appState.checklistStates.tier1[i] ? 'checked' : ''}
                                    onchange="updateTier1Checklist(${i}, this.checked)">
                                <label for="t1-check-${i}">${p}</label>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="flow-step">
                    <div class="step-number">2</div>
                    <h4>Administer Literacy Screener</h4>
                    <p>Screen all students using a validated literacy assessment tool.</p>
                    <button class="menu-btn" onclick="openModal('menu-modal')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                        Open Interventions Menu
                    </button>
                </div>
                
                <div class="flow-step">
                    <div class="step-number">3</div>
                    <h4>Evaluate Results</h4>
                    <p>Review screening data to determine effectiveness of core instruction.</p>
                    <div class="decision-paths">
                        <div class="path-card success">
                            <h5>✓ Most Students Blue/Green</h5>
                            <p>Core instruction is effective. Continue monitoring.</p>
                        </div>
                        <div class="path-card warning">
                            <h5>⚠ Many Yellow/Red Results</h5>
                            <p>Review percentage of struggling students.</p>
                        </div>
                    </div>
                </div>
                
                <div class="flow-step">
                    <div class="step-number">4</div>
                    <h4>Determine Next Steps</h4>
                    <p>Based on the percentage of students showing weak results:</p>
                    <div class="decision-paths">
                        <div class="path-card" onclick="openModal('menu-modal')">
                            <h5>≥20% Struggling</h5>
                            <p>Reteach core instruction. Access Tier 1 resources.</p>
                        </div>
                        <div class="path-card" onclick="openModal('tier2-modal')">
                            <h5>&lt;20% Struggling</h5>
                            <p>Move individual students to Tier 2 small group support.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderTier2Content() {
    const container = document.getElementById('tier2-content');
    if (!container) return;
    
    const tier2Data = appState.tierFlowchartData?.tier2 || {};
    const principles = tier2Data.principles || [
        "Target specific skill deficits",
        "Use research-based intervention programs",
        "Maintain small group size (3-6 students)",
        "Provide intervention 3-5 times per week",
        "Monitor progress every 1-2 weeks"
    ];
    
    container.innerHTML = `
        <div class="tier-content">
            <div class="tier-intro">
                <h3>Small Group Intervention</h3>
                <p>Tier 2 provides targeted support for students not responding to core instruction. Implement 8-week intervention cycles with progress monitoring.</p>
            </div>
            
            <div class="flowchart-steps">
                <div class="flow-step">
                    <div class="step-number">1</div>
                    <h4>Review Tier 2 Principles</h4>
                    <p>Ensure your intervention approach aligns with best practices.</p>
                    <ul class="checklist">
                        ${principles.map((p, i) => `
                            <li>
                                <input type="checkbox" id="t2-check-${i}"
                                    ${appState.checklistStates.tier2[i] ? 'checked' : ''}
                                    onchange="updateTier2Checklist(${i}, this.checked)">
                                <label for="t2-check-${i}">${p}</label>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="flow-step">
                    <div class="step-number">2</div>
                    <h4>Administer Drill Down Assessment</h4>
                    <p>Identify specific skill gaps for targeted intervention.</p>
                    <button class="menu-btn" onclick="openModal('menu-modal')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                        Find Assessments
                    </button>
                </div>
                
                <div class="flow-step">
                    <div class="step-number">3</div>
                    <h4>Deliver 8-Week Intervention</h4>
                    <p>Implement targeted intervention matching student needs.</p>
                    <button class="menu-btn" onclick="openModal('menu-modal')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                        Find Interventions
                    </button>
                </div>
                
                <div class="flow-step">
                    <div class="step-number">4</div>
                    <h4>Evaluate Progress</h4>
                    <p>After the 8-week cycle, assess student improvement.</p>
                    <div class="decision-paths">
                        <div class="path-card success">
                            <h5>✓ Blue/Green Results</h5>
                            <p>Fade support. Return to Tier 1 with monitoring.</p>
                        </div>
                        <div class="path-card warning">
                            <h5>⚠ Yellow/Red Results</h5>
                            <p>Repeat cycle with adjusted approach or move to Tier 3.</p>
                        </div>
                    </div>
                </div>
                
                <div class="flow-step">
                    <div class="step-number">5</div>
                    <h4>Second Cycle (If Needed)</h4>
                    <p>If the first cycle was not effective, try a different intervention approach.</p>
                    <div class="decision-paths">
                        <div class="path-card success" onclick="openModal('tier1-modal')">
                            <h5>✓ Improved</h5>
                            <p>Return to Tier 1 with monitoring.</p>
                        </div>
                        <div class="path-card" onclick="openModal('tier3-modal')">
                            <h5>Still Struggling</h5>
                            <p>Move to Tier 3 intensive support.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderTier3Content() {
    const container = document.getElementById('tier3-content');
    if (!container) return;
    
    const tier3Data = appState.tierFlowchartData?.tier3 || {};
    const characteristics = tier3Data.characteristics || [
        "Individual or very small group (1-3 students)",
        "Intensive, specialized intervention programs",
        "45-60 minutes daily of intervention",
        "Weekly progress monitoring"
    ];
    
    container.innerHTML = `
        <div class="tier-content">
            <div class="tier-intro">
                <h3>Intensive Individual Intervention</h3>
                <p>Tier 3 is for students who have not responded to two cycles of Tier 2. These students receive intensive, individualized support.</p>
            </div>
            
            <div class="flowchart-steps">
                <div class="flow-step">
                    <div class="step-number">1</div>
                    <h4>Tier 3 Characteristics</h4>
                    <p>Ensure intensive support is in place:</p>
                    <ul class="checklist">
                        ${characteristics.map((c, i) => `
                            <li>
                                <input type="checkbox" id="t3-check-${i}"
                                    ${appState.checklistStates.tier3[i] ? 'checked' : ''}
                                    onchange="updateTier3Checklist(${i}, this.checked)">
                                <label for="t3-check-${i}">${c}</label>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="flow-step">
                    <div class="step-number">2</div>
                    <h4>Targeted Drill Down Assessment</h4>
                    <p>Use detailed diagnostic assessments to pinpoint specific needs.</p>
                    <button class="menu-btn" onclick="openModal('menu-modal')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                        Find Tier 3 Assessments
                    </button>
                </div>
                
                <div class="flow-step">
                    <div class="step-number">3</div>
                    <h4>Deliver Intensive 8-Week Intervention</h4>
                    <p>Implement specialized, intensive intervention with weekly progress monitoring.</p>
                    <button class="menu-btn" onclick="openModal('menu-modal')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                        Find Intensive Interventions
                    </button>
                </div>
                
                <div class="flow-step">
                    <div class="step-number">4</div>
                    <h4>Evaluate Progress</h4>
                    <p>Assess response to intensive intervention.</p>
                    <div class="decision-paths">
                        <div class="path-card success">
                            <h5>✓ Improvement Shown</h5>
                            <p>Fade support gradually. May return to Tier 1 or 2.</p>
                        </div>
                        <div class="path-card">
                            <h5>No Response</h5>
                            <p>Consult with specialists. Consider formal evaluation.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Checklist update functions
function updateTier1Checklist(index, checked) {
    appState.checklistStates.tier1[index] = checked;
}

function updateTier2Checklist(index, checked) {
    appState.checklistStates.tier2[index] = checked;
}

function updateTier3Checklist(index, checked) {
    appState.checklistStates.tier3[index] = checked;
}

// ============================================
// Intervention Menu Functions
// ============================================
function resetInterventionMenu() {
    // Reset state
    appState.interventionMenu = {
        language: '',
        screener: null,
        subtest: null,
        pillars: [],
        itemType: null
    };
    
    // Reset select elements
    document.getElementById('language-filter').value = '';
    document.getElementById('screener-select').value = '';
    document.getElementById('subtest-select').value = '';
    document.getElementById('subtest-select').disabled = true;
    document.getElementById('pillar-select').value = '';
    document.getElementById('pillar-select').disabled = true;
    document.getElementById('type-select').value = '';
    document.getElementById('type-select').disabled = true;
    
    // Clear results
    const resultsContainer = document.getElementById('menu-results');
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="results-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                </svg>
                <p>Select filters above to find interventions</p>
            </div>
        `;
    }
}

function onLanguageFilterChange(value) {
    appState.interventionMenu.language = value;
    filterScreenerOptions();
}

function filterScreenerOptions() {
    const screenerSelect = document.getElementById('screener-select');
    const language = appState.interventionMenu.language;
    
    // Show/hide optgroups based on language selection
    const optgroups = screenerSelect.querySelectorAll('optgroup');
    optgroups.forEach(group => {
        if (!language) {
            group.style.display = '';
        } else if (group.label === 'English' && language === 'English') {
            group.style.display = '';
        } else if (group.label === 'French Immersion' && language === 'French') {
            group.style.display = '';
        } else {
            group.style.display = 'none';
        }
    });
    
    // Reset dependent fields
    screenerSelect.value = '';
    onScreenerDropdownChange('');
}

function onScreenerDropdownChange(value) {
    appState.interventionMenu.screener = value;
    
    const subtestSelect = document.getElementById('subtest-select');
    
    if (!value) {
        subtestSelect.innerHTML = '<option value="">Select...</option>';
        subtestSelect.disabled = true;
        onSubtestDropdownChange('');
        return;
    }
    
    // Get subtests for selected screener
    const screenerData = appState.interventionMenuData?.screeners?.find(s => s.name === value);
    const subtests = screenerData?.subtests || [];
    
    subtestSelect.innerHTML = '<option value="">Select...</option>';
    subtests.forEach(subtest => {
        const option = document.createElement('option');
        option.value = subtest.name;
        option.textContent = subtest.name;
        subtestSelect.appendChild(option);
    });
    
    subtestSelect.disabled = subtests.length === 0;
    onSubtestDropdownChange('');
}

function onSubtestDropdownChange(value) {
    appState.interventionMenu.subtest = value;
    
    const pillarSelect = document.getElementById('pillar-select');
    
    if (!value) {
        pillarSelect.innerHTML = '<option value="">Select...</option>';
        pillarSelect.disabled = true;
        onPillarDropdownChange('');
        return;
    }
    
    // Get pillars for selected subtest
    const screenerData = appState.interventionMenuData?.screeners?.find(s => s.name === appState.interventionMenu.screener);
    const subtestData = screenerData?.subtests?.find(st => st.name === value);
    const pillars = subtestData?.pillars || appState.interventionMenuData?.literacy_pillars || [];
    
    pillarSelect.innerHTML = '<option value="">Select...</option>';
    (Array.isArray(pillars) ? pillars : []).forEach(pillar => {
        const option = document.createElement('option');
        const pillarName = typeof pillar === 'string' ? pillar : pillar.name;
        option.value = pillarName;
        option.textContent = pillarName;
        pillarSelect.appendChild(option);
    });
    
    pillarSelect.disabled = pillars.length === 0;
    onPillarDropdownChange('');
}

function onPillarDropdownChange(value) {
    appState.interventionMenu.pillars = value ? [value] : [];
    
    const typeSelect = document.getElementById('type-select');
    typeSelect.disabled = !value;
    typeSelect.value = '';
    
    onTypeDropdownChange('');
}

function onTypeDropdownChange(value) {
    appState.interventionMenu.itemType = value;
    
    if (!value) {
        const resultsContainer = document.getElementById('menu-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="results-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <p>Select a type to see results</p>
                </div>
            `;
        }
        return;
    }
    
    displayMenuResults();
}

function displayMenuResults() {
    const resultsContainer = document.getElementById('menu-results');
    if (!resultsContainer) return;
    
    const { screener, subtest, pillars, itemType } = appState.interventionMenu;
    
    // Find matching items
    let items = [];
    
    if (itemType === 'Assessment') {
        items = appState.interventionMenuData?.assessments?.filter(a => {
            return (!pillars.length || pillars.some(p => a.pillars?.includes(p)));
        }) || [];
    } else if (itemType === 'Intervention') {
        items = appState.interventionMenuData?.interventions?.filter(i => {
            return (!pillars.length || pillars.some(p => i.pillars?.includes(p)));
        }) || [];
    }
    
    if (items.length === 0) {
        resultsContainer.innerHTML = `
            <div class="results-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                </svg>
                <p>No ${itemType.toLowerCase()}s found for the selected criteria</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = `
        <div class="results-count">${items.length} ${itemType.toLowerCase()}${items.length !== 1 ? 's' : ''} found</div>
        <div class="results-list">
            ${items.map(item => `
                <div class="result-card">
                    <h4>${item.name}</h4>
                    <p>${item.description || ''}</p>
                    <div class="result-meta">
                        ${item.tiers ? `<span class="result-tag">Tier ${item.tiers.join(', ')}</span>` : ''}
                        ${item.pillars ? item.pillars.map(p => `<span class="result-tag">${p}</span>`).join('') : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ============================================
// FAQ Toggle
// ============================================
function toggleFAQ(button) {
    const faqItem = button.closest('.faq-item');
    if (!faqItem) return;
    
    const wasOpen = faqItem.classList.contains('open');
    
    // Close all FAQ items in the same category
    const category = faqItem.closest('.faq-category');
    if (category) {
        category.querySelectorAll('.faq-item.open').forEach(item => {
            item.classList.remove('open');
        });
    }
    
    // Toggle current item
    if (!wasOpen) {
        faqItem.classList.add('open');
    }
}

// ============================================
// Make functions globally available
// ============================================
window.openModal = openModal;
window.closeModal = closeModal;
window.resetInterventionMenu = resetInterventionMenu;
window.onLanguageFilterChange = onLanguageFilterChange;
window.onScreenerDropdownChange = onScreenerDropdownChange;
window.onSubtestDropdownChange = onSubtestDropdownChange;
window.onPillarDropdownChange = onPillarDropdownChange;
window.onTypeDropdownChange = onTypeDropdownChange;
window.toggleFAQ = toggleFAQ;
window.updateTier1Checklist = updateTier1Checklist;
window.updateTier2Checklist = updateTier2Checklist;
window.updateTier3Checklist = updateTier3Checklist;
