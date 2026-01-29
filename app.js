// Literacy Pal - Modern Single Page Application
// Mobile-first design with full-page modals

// ============================================
// State Management
// ============================================
const appState = {
    currentModal: null,
    flowchartData: null,
    tierFlowchartData: null,
    interventionMenuData: null,
    currentPath: [],
    currentTierFlow: null,
    interventionMenu: {
        language: '',
        screener: null,
        subtest: null,
        pillars: [],
        itemType: null
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
    
    // Setup event listeners
    setupModalTriggers();
    setupModalCloseHandlers();
    setupFAQAccordions();
    setupInterventionCards();
    setupInterventionMenuFilters();
    
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
        console.log('Intervention data loaded');
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
        console.log('Tier flowchart data loaded');
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
        console.log('Intervention menu data loaded');
    } catch (error) {
        console.error('Error loading intervention menu data:', error);
        appState.interventionMenuData = { screeners: [], interventions: [], assessments: [], literacy_pillars: [] };
    }
}

// ============================================
// Modal System
// ============================================
function setupModalTriggers() {
    // Feature cards that open modals
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.dataset.modal;
            openModal(modalId);
        });
    });
}

function setupModalCloseHandlers() {
    // Close button handlers
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // ESC key handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && appState.currentModal) {
            closeModal(appState.currentModal);
        }
    });
    
    // Back button in interventions menu
    const backToTiers = document.querySelector('.back-to-tiers');
    if (backToTiers) {
        backToTiers.addEventListener('click', () => {
            showTierOptions();
        });
    }
    
    // Reset filters button
    const resetFilters = document.querySelector('.reset-filters');
    if (resetFilters) {
        resetFilters.addEventListener('click', () => {
            resetInterventionMenuFilters();
        });
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Close any open modal first
    if (appState.currentModal) {
        document.getElementById(appState.currentModal)?.classList.remove('active');
    }
    
    // Open the new modal
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    appState.currentModal = modalId;
    
    // Focus management
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea');
    if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
    }
    
    // Scroll to top of modal
    modal.scrollTop = 0;
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    appState.currentModal = null;
    
    // Reset interventions modal state when closing
    if (modalId === 'interventions-modal') {
        showTierOptions();
    }
    
    // Reset flowchart modal
    if (modalId === 'flowchart-modal') {
        const container = document.getElementById('flowchart-container');
        if (container) container.innerHTML = '';
    }
}

// ============================================
// FAQ Accordion
// ============================================
function setupFAQAccordions() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;
            
            // Toggle current
            question.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('open', !isExpanded);
        });
    });
}

// ============================================
// Intervention Cards
// ============================================
function setupInterventionCards() {
    // Tier cards
    document.querySelectorAll('[data-action="open-tier"]').forEach(card => {
        card.addEventListener('click', () => {
            const tier = card.dataset.tier;
            openTierFlowchart(tier);
        });
    });
    
    // Menu card
    const menuCard = document.querySelector('[data-action="open-menu"]');
    if (menuCard) {
        menuCard.addEventListener('click', () => {
            showInterventionsMenu();
        });
    }
}

function showTierOptions() {
    const tierOptions = document.querySelector('.tier-options');
    const menuPanel = document.getElementById('interventions-menu-panel');
    
    if (tierOptions) tierOptions.style.display = 'flex';
    if (menuPanel) menuPanel.style.display = 'none';
}

function showInterventionsMenu() {
    const tierOptions = document.querySelector('.tier-options');
    const menuPanel = document.getElementById('interventions-menu-panel');
    
    if (tierOptions) tierOptions.style.display = 'none';
    if (menuPanel) menuPanel.style.display = 'block';
}

// ============================================
// Tier Flowchart
// ============================================
function openTierFlowchart(tier) {
    appState.currentTierFlow = tier;
    appState.currentPath = [];
    
    // Open flowchart modal
    openModal('flowchart-modal');
    
    // Update title
    const title = document.getElementById('flowchart-title');
    if (title) {
        const tierNames = {
            tier1: 'Tier 1 - Universal Screening',
            tier2: 'Tier 2 - Small Group',
            tier3: 'Tier 3 - Intensive Individual'
        };
        title.textContent = tierNames[tier] || 'Tier Flowchart';
    }
    
    // Render flowchart start
    renderFlowchartStart();
}

function renderFlowchartStart() {
    const container = document.getElementById('flowchart-container');
    if (!container || !appState.flowchartData) return;
    
    const tier = appState.flowchartData.tiers?.find(t => t.id === appState.currentTierFlow);
    
    if (!tier) {
        container.innerHTML = `
            <div class="flowchart-start">
                <div class="start-card">
                    <div class="start-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 16v-4M12 8h.01"/>
                        </svg>
                    </div>
                    <h2>No Data Available</h2>
                    <p>Flowchart data is not available for this tier.</p>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="flowchart-start">
            <div class="start-card">
                <div class="start-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                </div>
                <h2>Select Literacy Assessment</h2>
                <p>Choose the screening tool used to assess student literacy skills</p>
                
                <div class="tier-selection">
                    ${tier.screeners.map(screener => `
                        <button class="tier-option" onclick="selectScreener('${screener.id}')">
                            <div class="tier-badge">${screener.name.substring(0, 2)}</div>
                            <div class="tier-info">
                                <h3>${screener.name}</h3>
                                <p>${screener.description || `${screener.testAreas?.length || 0} test areas`}</p>
                            </div>
                            <svg class="tier-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function selectScreener(screenerId) {
    const tier = appState.flowchartData.tiers?.find(t => t.id === appState.currentTierFlow);
    const screener = tier?.screeners?.find(s => s.id === screenerId);
    
    if (!screener) return;
    
    appState.currentPath.push({ type: 'screener', id: screenerId, name: screener.name });
    renderTestAreaSelection(screener);
}

function renderTestAreaSelection(screener) {
    const container = document.getElementById('flowchart-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="flowchart-step">
            <button class="back-button" onclick="goBackInFlowchart()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
            </button>
            
            <div class="step-card">
                <div class="step-header">
                    <div class="step-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                        </svg>
                    </div>
                    <div>
                        <h2>Select Focus Area</h2>
                        <p>Choose the literacy skill area that needs intervention</p>
                    </div>
                </div>
                
                <div class="area-grid">
                    ${(screener.testAreas || []).map(area => `
                        <button class="area-card" onclick="selectTestArea('${screener.id}', '${area.id}')">
                            <div class="area-icon">
                                ${getAreaIcon(area.name)}
                            </div>
                            <h3>${area.name}</h3>
                            <p>${area.pillars?.length || 0} intervention strategies</p>
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function selectTestArea(screenerId, areaId) {
    const tier = appState.flowchartData.tiers?.find(t => t.id === appState.currentTierFlow);
    const screener = tier?.screeners?.find(s => s.id === screenerId);
    const area = screener?.testAreas?.find(a => a.id === areaId);
    
    if (!area) return;
    
    appState.currentPath.push({ type: 'area', id: areaId, name: area.name });
    renderInterventionStrategies(area);
}

function renderInterventionStrategies(area) {
    const container = document.getElementById('flowchart-container');
    if (!container) return;
    
    // Collect all interventions from all pillars
    const allInterventions = (area.pillars || []).flatMap(pillar => 
        (pillar.interventions || []).map(intervention => ({
            ...intervention,
            pillar: pillar.name
        }))
    );
    
    container.innerHTML = `
        <div class="flowchart-step">
            <button class="back-button" onclick="goBackInFlowchart()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
            </button>
            
            <div class="step-card wide">
                <div class="step-header">
                    <div class="step-icon success">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div>
                        <h2>Recommended Interventions</h2>
                        <p>Evidence-based strategies for ${area.name}</p>
                    </div>
                </div>
                
                <div class="intervention-list">
                    ${allInterventions.length > 0 ? allInterventions.map((intervention, index) => `
                        <div class="intervention-card" style="animation-delay: ${index * 0.1}s">
                            <div class="intervention-header">
                                <h3>${intervention.name}</h3>
                                <span class="pillar-badge">${intervention.pillar}</span>
                            </div>
                            <p class="intervention-description">${intervention.description || 'No description available.'}</p>
                            <div class="intervention-meta">
                                ${intervention.duration ? `
                                    <div class="meta-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <circle cx="12" cy="12" r="10"/>
                                            <path d="M12 6v6l4 2"/>
                                        </svg>
                                        <span>${intervention.duration}</span>
                                    </div>
                                ` : ''}
                                ${intervention.groupSize ? `
                                    <div class="meta-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                                            <circle cx="9" cy="7" r="4"/>
                                        </svg>
                                        <span>${intervention.groupSize}</span>
                                    </div>
                                ` : ''}
                                ${intervention.frequency ? `
                                    <div class="meta-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6"/>
                                            <line x1="8" y1="2" x2="8" y2="6"/>
                                            <line x1="3" y1="10" x2="21" y2="10"/>
                                        </svg>
                                        <span>${intervention.frequency}</span>
                                    </div>
                                ` : ''}
                            </div>
                            ${intervention.resources ? `
                                <div class="intervention-resources">
                                    <strong>Resources:</strong> ${intervention.resources}
                                </div>
                            ` : ''}
                        </div>
                    `).join('') : `
                        <div class="intervention-card">
                            <p class="intervention-description">No interventions found for this area. Please check the interventions menu for more options.</p>
                        </div>
                    `}
                </div>
                
                <div class="action-buttons">
                    <button class="btn-primary" onclick="resetFlowchart()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8"/>
                            <path d="M21 3v5h-5"/>
                        </svg>
                        Start Over
                    </button>
                </div>
            </div>
        </div>
    `;
}

function goBackInFlowchart() {
    if (appState.currentPath.length === 0) {
        renderFlowchartStart();
        return;
    }
    
    appState.currentPath.pop();
    
    if (appState.currentPath.length === 0) {
        renderFlowchartStart();
    } else {
        const lastStep = appState.currentPath[appState.currentPath.length - 1];
        const tier = appState.flowchartData.tiers?.find(t => t.id === appState.currentTierFlow);
        const screener = tier?.screeners?.find(s => s.id === lastStep.id);
        if (screener) {
            renderTestAreaSelection(screener);
        } else {
            renderFlowchartStart();
        }
    }
}

function resetFlowchart() {
    appState.currentPath = [];
    renderFlowchartStart();
}

function getAreaIcon(areaName) {
    const icons = {
        'Phonemic Awareness': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>',
        'Phonics': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
        'Fluency': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
        'Vocabulary': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>',
        'Comprehension': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>'
    };
    return icons[areaName] || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>';
}

// ============================================
// Intervention Menu Filters
// ============================================
function setupInterventionMenuFilters() {
    const languageFilter = document.getElementById('language-filter');
    const screenerSelect = document.getElementById('screener-select');
    const subtestSelect = document.getElementById('subtest-select');
    const pillarSelect = document.getElementById('pillar-select');
    const typeSelect = document.getElementById('type-select');
    
    if (languageFilter) {
        languageFilter.addEventListener('change', (e) => {
            appState.interventionMenu.language = e.target.value;
            filterScreenerOptions();
            updateMenuResults();
        });
    }
    
    if (screenerSelect) {
        screenerSelect.addEventListener('change', (e) => {
            appState.interventionMenu.screener = e.target.value;
            updateSubtestOptions();
            updateMenuResults();
        });
    }
    
    if (subtestSelect) {
        subtestSelect.addEventListener('change', (e) => {
            appState.interventionMenu.subtest = e.target.value;
            updatePillarOptions();
            updateMenuResults();
        });
    }
    
    if (pillarSelect) {
        pillarSelect.addEventListener('change', (e) => {
            appState.interventionMenu.pillars = e.target.value ? [e.target.value] : [];
            typeSelect.disabled = false;
            updateMenuResults();
        });
    }
    
    if (typeSelect) {
        typeSelect.addEventListener('change', (e) => {
            appState.interventionMenu.itemType = e.target.value;
            updateMenuResults();
        });
    }
}

function filterScreenerOptions() {
    const screenerSelect = document.getElementById('screener-select');
    if (!screenerSelect) return;
    
    const language = appState.interventionMenu.language;
    
    // Show/hide options based on language
    screenerSelect.querySelectorAll('optgroup').forEach(group => {
        const groupLabel = group.label;
        if (!language) {
            group.style.display = '';
        } else if (language === 'English' && groupLabel === 'English') {
            group.style.display = '';
        } else if (language === 'French' && groupLabel === 'French Immersion') {
            group.style.display = '';
        } else {
            group.style.display = 'none';
        }
    });
    
    // Reset dependent selects
    screenerSelect.value = '';
    appState.interventionMenu.screener = null;
    resetDependentSelects();
}

function resetDependentSelects() {
    const subtestSelect = document.getElementById('subtest-select');
    const pillarSelect = document.getElementById('pillar-select');
    const typeSelect = document.getElementById('type-select');
    
    if (subtestSelect) {
        subtestSelect.innerHTML = '<option value="">Select...</option>';
        subtestSelect.disabled = true;
    }
    if (pillarSelect) {
        pillarSelect.innerHTML = '<option value="">Select...</option>';
        pillarSelect.disabled = true;
    }
    if (typeSelect) {
        typeSelect.value = '';
        typeSelect.disabled = true;
    }
    
    appState.interventionMenu.subtest = null;
    appState.interventionMenu.pillars = [];
    appState.interventionMenu.itemType = null;
}

function updateSubtestOptions() {
    const subtestSelect = document.getElementById('subtest-select');
    if (!subtestSelect || !appState.interventionMenuData) return;
    
    const screener = appState.interventionMenu.screener;
    
    if (!screener) {
        resetDependentSelects();
        return;
    }
    
    // Find screener data
    const screenerData = appState.interventionMenuData.screeners?.find(s => s.name === screener);
    const subtests = screenerData?.subtests || [];
    
    subtestSelect.innerHTML = '<option value="">Select...</option>' + 
        subtests.map(s => `<option value="${s}">${s}</option>`).join('');
    subtestSelect.disabled = subtests.length === 0;
    
    // Reset dependent selects
    const pillarSelect = document.getElementById('pillar-select');
    const typeSelect = document.getElementById('type-select');
    
    if (pillarSelect) {
        pillarSelect.innerHTML = '<option value="">Select...</option>';
        pillarSelect.disabled = true;
    }
    if (typeSelect) {
        typeSelect.value = '';
        typeSelect.disabled = true;
    }
    
    appState.interventionMenu.subtest = null;
    appState.interventionMenu.pillars = [];
    appState.interventionMenu.itemType = null;
}

function updatePillarOptions() {
    const pillarSelect = document.getElementById('pillar-select');
    if (!pillarSelect || !appState.interventionMenuData) return;
    
    const pillars = appState.interventionMenuData.literacy_pillars || [];
    
    pillarSelect.innerHTML = '<option value="">Select...</option>' + 
        pillars.map(p => `<option value="${p}">${p}</option>`).join('');
    pillarSelect.disabled = pillars.length === 0;
    
    const typeSelect = document.getElementById('type-select');
    if (typeSelect) {
        typeSelect.value = '';
        typeSelect.disabled = true;
    }
    
    appState.interventionMenu.pillars = [];
    appState.interventionMenu.itemType = null;
}

function updateMenuResults() {
    const resultsList = document.getElementById('results-list');
    const resultsCount = document.getElementById('results-count');
    
    if (!resultsList || !resultsCount || !appState.interventionMenuData) return;
    
    // Filter logic
    const { screener, subtest, pillars, itemType } = appState.interventionMenu;
    
    let results = [];
    
    // Combine interventions and assessments
    const allItems = [
        ...(appState.interventionMenuData.interventions || []).map(i => ({ ...i, type: 'Intervention' })),
        ...(appState.interventionMenuData.assessments || []).map(a => ({ ...a, type: 'Assessment' }))
    ];
    
    // Apply filters
    results = allItems.filter(item => {
        if (screener && item.screener !== screener) return false;
        if (subtest && item.subtest !== subtest) return false;
        if (pillars.length > 0 && !pillars.some(p => item.pillars?.includes(p))) return false;
        if (itemType && item.type !== itemType) return false;
        return true;
    });
    
    // Update count
    resultsCount.textContent = `${results.length} result${results.length !== 1 ? 's' : ''}`;
    
    // Render results
    if (results.length === 0) {
        resultsList.innerHTML = '<p style="color: var(--gray-500); text-align: center; padding: 1rem;">No results found. Try adjusting your filters.</p>';
    } else {
        resultsList.innerHTML = results.map(item => `
            <div class="result-item">
                <h4>${item.name}</h4>
                <p>${item.description || item.type}</p>
            </div>
        `).join('');
    }
}

function resetInterventionMenuFilters() {
    const languageFilter = document.getElementById('language-filter');
    const screenerSelect = document.getElementById('screener-select');
    
    if (languageFilter) languageFilter.value = '';
    if (screenerSelect) {
        screenerSelect.value = '';
        screenerSelect.querySelectorAll('optgroup').forEach(group => {
            group.style.display = '';
        });
    }
    
    appState.interventionMenu = {
        language: '',
        screener: null,
        subtest: null,
        pillars: [],
        itemType: null
    };
    
    resetDependentSelects();
    updateMenuResults();
}

// ============================================
// Global Functions (called from HTML)
// ============================================
window.selectScreener = selectScreener;
window.selectTestArea = selectTestArea;
window.goBackInFlowchart = goBackInFlowchart;
window.resetFlowchart = resetFlowchart;
window.openTierFlowchart = openTierFlowchart;
