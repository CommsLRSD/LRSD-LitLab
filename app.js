// Literacy Interventions - Main Application JavaScript
// Modern, functional implementation with smooth animations and interactions

// ============================================
// State Management
// ============================================
const appState = {
    currentPage: 'home',
    mobileMenuOpen: false,
    flowchartData: null,
    tierFlowchartData: null,
    interventionMenuData: null,
    currentPath: [],
    interventionHistory: [],
    currentTierFlow: null,
    // Screener the user selected (remembered across tiers and the menu so they
    // are never forced to re-choose it). Stored as the intervention-menu
    // screener_id, e.g. "DIBELS".
    selectedScreener: null,
    // Visual flowchart state
    visualFlowchart: {
        nodes: [],
        connections: [],
        currentNodeId: null,
        selectedPath: []
    },
    // Intervention menu state
    interventionMenu: {
        language: 'English',
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
    console.log('Literacy Interventions - Initializing...');

    // Setup reusable evidence marker popup
    setupEvidenceDefinitionsPopup();
    
    // Load intervention data
    await loadInterventionData();
    
    // Load tier flowchart data
    await loadTierFlowchartData();
    
    // Load intervention menu data
    await loadInterventionMenuData();
    
    // Setup navigation
    setupNavigation();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Setup sub-tab navigation
    setupSubTabs();
    
    // Initialize intervention menu
    initializeInterventionMenu();
    
    // Initialize assessment schedules
    await initializeAssessmentSchedules();
    
    // Fix iframe scroll: prevent parent page from scrolling when hovering over the original guide iframe
    setupIframeScrollCapture();
    
    // Add resize listener to update connection line positions and tier titles
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateConnectionLinePositions();
            updateTierTitleOnResize();
        }, 150); // Debounce resize events
    });
    
    console.log('Literacy Interventions - Ready!');
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
// Navigation
// ============================================
function setupNavigation() {
    // Desktop navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const page = e.currentTarget.dataset.page;
            navigateToPage(page);
        });
    });
    
    // Mobile navigation
    document.querySelectorAll('.mobile-nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            const page = e.currentTarget.dataset.page;
            navigateToPage(page);
            closeMobileMenu();
        });
    });
}

function navigateToPage(pageName) {
    // Update state
    appState.currentPage = pageName;
    
    // Update active states in desktop nav
    document.querySelectorAll('.nav-link').forEach(link => {
        const isActive = link.dataset.page === pageName;
        link.classList.toggle('active', isActive);
        link.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    
    // Update active states in mobile nav
    document.querySelectorAll('.mobile-nav-item').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageName);
    });
    
    // Show/hide the main sections
    document.querySelectorAll('.content-section').forEach(section => {
        const sectionId = section.id.replace('-section', '');
        section.classList.toggle('active', sectionId === pageName);
    });
    
    // Lazy-initialize sections on first visit
    if (pageName === 'flowchart') {
        const fc = document.getElementById('flowchart-container');
        if (fc && !fc.dataset.initialized) {
            fc.dataset.initialized = 'true';
            openInteractiveFlowchart();
        }
    } else if (pageName === 'interventions') {
        if (!appState.menuInitialized) {
            appState.menuInitialized = true;
            if (document.querySelector('.dropdown-wizard')) {
                initializeDropdownWizard();
            } else {
                initializeStepBasedMenu();
            }
        } else if (document.querySelector('.dropdown-wizard')) {
            // Already initialized: pre-select the remembered screener if the user
            // picked one elsewhere (e.g. in the flowchart) since the last visit.
            applyRememberedScreenerToMenu();
        }
    }
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupSubTabs() {
    document.querySelectorAll('.subtab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.closest('.subtab-nav')?.dataset.tabGroup;
            if (!group) return;
            // Deactivate all buttons and panels in this group
            document.querySelectorAll(`.subtab-nav[data-tab-group="${group}"] .subtab-btn`).forEach(b => b.classList.remove('active'));
            document.querySelectorAll(`.subtab-panel[data-tab-group="${group}"]`).forEach(p => p.classList.remove('active'));
            // Activate clicked button and target panel
            btn.classList.add('active');
            const target = btn.dataset.subtab;
            const panel = document.getElementById(`subtab-${target}`);
            if (panel) panel.classList.add('active');
        });
    });
}

// ============================================
// Iframe Scroll Capture
// ============================================
function setupIframeScrollCapture() {
    const iframeWrapper = document.querySelector('.original-guide-body');
    if (!iframeWrapper) return;
    
    iframeWrapper.addEventListener('mouseenter', () => {
        document.body.style.overflow = 'hidden';
    });
    
    iframeWrapper.addEventListener('mouseleave', () => {
        document.body.style.overflow = '';
    });
}

// ============================================
// Mobile Menu
// ============================================
function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMobileMenu);
    }
}

function toggleMobileMenu() {
    appState.mobileMenuOpen = !appState.mobileMenuOpen;
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const overlay = document.querySelector('.mobile-nav-overlay');
    
    menuBtn?.classList.toggle('active', appState.mobileMenuOpen);
    overlay?.classList.toggle('active', appState.mobileMenuOpen);
}

function closeMobileMenu() {
    appState.mobileMenuOpen = false;
    document.querySelector('.mobile-menu-btn')?.classList.remove('active');
    document.querySelector('.mobile-nav-overlay')?.classList.remove('active');
}

// ============================================
// Home Menu Cards (removed - no longer in design)
// ============================================
function setupHomeMenuCards() {
    // No-op: home menu cards removed in new design
}

// ============================================
// Flowchart Implementation
// ============================================
function initializeFlowchart() {
    const container = document.getElementById('flowchart-container');
    if (!container) return;
    
    renderFlowchartStart();
}

function renderFlowchartStart() {
    const container = document.getElementById('flowchart-container');
    if (!container || !appState.flowchartData) return;
    
    container.innerHTML = `
        <div class="flowchart-start">
            <div class="start-card">
                <div class="start-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                    </svg>
                </div>
                <h2>Select Your Starting Tier</h2>
                <p>Choose the appropriate intervention tier based on student needs and assessment data</p>
                
                <div class="tier-selection">
                    ${appState.flowchartData.tiers.map(tier => `
                        <button class="tier-option" onclick="selectTier('${tier.id}')">
                            <div class="tier-badge">${tier.name.split('-')[0].trim()}</div>
                            <div class="tier-info">
                                <h3>${tier.name}</h3>
                                <p>${tier.description}</p>
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
    
    // Animate in
    setTimeout(() => {
        document.querySelector('.start-card')?.classList.add('visible');
    }, 100);
}

function selectTier(tierId) {
    const tier = appState.flowchartData.tiers.find(t => t.id === tierId);
    if (!tier) return;
    
    appState.currentPath = [{ type: 'tier', id: tierId, name: tier.name }];
    renderScreenerSelection(tier);
}

function renderScreenerSelection(tier) {
    const container = document.getElementById('flowchart-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="flowchart-step">
            <button class="back-button" onclick="resetFlowchart()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Start
            </button>
            
            <div class="step-card">
                <div class="step-header">
                    <div class="step-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                    </div>
                    <div>
                        <h2>Select Literacy Assessment</h2>
                        <p>Choose the screening tool used to assess student literacy skills</p>
                    </div>
                </div>
                
                <div class="screener-grid">
                    ${tier.screeners.map(screener => `
                        <button class="screener-card" onclick="selectScreener('${tier.id}', '${screener.id}')">
                            <h3>${screener.name}</h3>
                            <p>${screener.description}</p>
                            <div class="card-badge">${screener.testAreas.length} test areas</div>
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        document.querySelector('.step-card')?.classList.add('visible');
    }, 100);
}

function selectScreener(tierId, screenerId) {
    const tier = appState.flowchartData.tiers.find(t => t.id === tierId);
    const screener = tier?.screeners.find(s => s.id === screenerId);
    
    if (!screener) return;
    
    appState.currentPath.push({ type: 'screener', id: screenerId, name: screener.name });
    renderTestAreaSelection(tier, screener);
}

function renderTestAreaSelection(tier, screener) {
    const container = document.getElementById('flowchart-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="flowchart-step">
            <button class="back-button" onclick="goBackInFlow()">
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
                    ${screener.testAreas.map(area => `
                        <button class="area-card" onclick="selectTestArea('${tier.id}', '${screener.id}', '${area.id}')">
                            <div class="area-icon">
                                ${getAreaIcon(area.name)}
                            </div>
                            <h3>${area.name}</h3>
                            <p>${area.pillars.length} intervention strategies available</p>
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        document.querySelector('.step-card')?.classList.add('visible');
    }, 100);
}

function selectTestArea(tierId, screenerId, areaId) {
    const tier = appState.flowchartData.tiers.find(t => t.id === tierId);
    const screener = tier?.screeners.find(s => s.id === screenerId);
    const area = screener?.testAreas.find(a => a.id === areaId);
    
    if (!area) return;
    
    appState.currentPath.push({ type: 'area', id: areaId, name: area.name });
    renderInterventionStrategies(tier, screener, area);
}

function renderInterventionStrategies(tier, screener, area) {
    const container = document.getElementById('flowchart-container');
    if (!container) return;
    
    // Collect all interventions from all pillars
    const allInterventions = area.pillars.flatMap(pillar => 
        pillar.interventions.map(intervention => ({
            ...intervention,
            pillar: pillar.name
        }))
    );
    
    container.innerHTML = `
        <div class="flowchart-step">
            <button class="back-button" onclick="goBackInFlow()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
            </button>
            
            <div class="step-card wide">
                <div class="step-header">
                    <div class="step-icon success">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                    </div>
                    <div>
                        <h2>Recommended Interventions</h2>
                        <p>Evidence-based strategies for ${area.name}</p>
                    </div>
                </div>
                
                <div class="intervention-list">
                    ${allInterventions.map((intervention, index) => `
                        <div class="intervention-card" style="animation-delay: ${index * 0.1}s">
                            <div class="intervention-header">
                                <h3>${intervention.name}</h3>
                                <span class="pillar-badge">${intervention.pillar}</span>
                            </div>
                            <p class="intervention-description">${intervention.description}</p>
                            <div class="intervention-meta">
                                <div class="meta-item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M12 6v6l4 2"/>
                                    </svg>
                                    <span>${intervention.duration}</span>
                                </div>
                                <div class="meta-item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                                        <circle cx="9" cy="7" r="4"/>
                                    </svg>
                                    <span>${intervention.groupSize}</span>
                                </div>
                                <div class="meta-item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6"/>
                                        <line x1="8" y1="2" x2="8" y2="6"/>
                                        <line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                    <span>${intervention.frequency}</span>
                                </div>
                            </div>
                            ${intervention.resources ? `
                                <div class="intervention-resources">
                                    <strong>Resources:</strong> ${intervention.resources}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
                
                <div class="action-buttons">
                    <button class="btn-secondary" onclick="exportInterventions()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Export to PDF
                    </button>
                    <button class="btn-primary" onclick="resetFlowchart()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8"/>
                            <path d="M21 3v5h-5"/>
                        </svg>
                        Start New Assessment
                    </button>
                </div>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        document.querySelector('.step-card')?.classList.add('visible');
    }, 100);
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

function goBackInFlow() {
    appState.currentPath.pop();
    
    if (appState.currentPath.length === 0) {
        resetFlowchart();
        return;
    }
    
    const lastStep = appState.currentPath[appState.currentPath.length - 1];
    const tier = appState.flowchartData.tiers.find(t => t.id === appState.currentPath[0].id);
    
    if (lastStep.type === 'tier') {
        renderScreenerSelection(tier);
    } else if (lastStep.type === 'screener') {
        const screener = tier.screeners.find(s => s.id === lastStep.id);
        renderTestAreaSelection(tier, screener);
    } else if (lastStep.type === 'area') {
        const screener = tier.screeners.find(s => s.id === appState.currentPath[1].id);
        renderTestAreaSelection(tier, screener);
    }
}

function resetFlowchart() {
    appState.currentPath = [];
    renderFlowchartStart();
}

function exportFlowchart() {
    if (appState.currentPath.length === 0) {
        alert('Please complete a pathway first before exporting.');
        return;
    }
    
    const pathText = appState.currentPath.map(step => step.name).join(' → ');
    alert(`Current Path:\n\n${pathText}\n\nExport to PDF feature coming soon!`);
}

function exportInterventions() {
    alert('Export to PDF feature coming soon!\n\nYou can currently print this page using your browser\'s print function (Ctrl/Cmd + P)');
}

// ============================================
// FAQ Functionality
// ============================================
function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const wasActive = faqItem.classList.contains('active');
    
    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked FAQ if it wasn't active
    if (!wasActive) {
        faqItem.classList.add('active');
    }
}

// ============================================
// Visual Flowchart System
// ============================================

// Visual Flowchart Constants
const VF_CONSTANTS = {
    CONNECTION_DISTANCE: 120,         // Distance for horizontal connection line (approximately 3rem gap)
    BEZIER_CONTROL_OFFSET: 40,        // Offset for horizontal bezier curve control points
    ANIMATION_PROGRESS_INCREMENT: 0.06, // Progress increment for dot animation (increased for faster animation)
    LINE_ANIMATION_DURATION: 250,     // Duration of line drawing animation in milliseconds
    SCROLL_DELAY: 100,                // Delay before scrolling to new node
    SCROLL_ANIMATION_DURATION: 600,   // Duration of smooth scroll animation in milliseconds
    PATH_LENGTH_FALLBACK: 100,        // Fallback for SVG path length
    MOBILE_BREAKPOINT: 768            // Breakpoint for mobile layout (matches CSS media query)
};

// ── Shared icon SVG strings ──
// Used across flowchart nodes, endpoints, decisions, and journey review.
// All icons include stroke-linecap="round" stroke-linejoin="round" for proper
// rendering at small sizes (dots, line-caps stay visible even at 12-20 px).
const ICONS = {
    // Status icons (endpoints + decision buttons)
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    danger: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,

    // Decision-button–specific (larger, bolder feel)
    checkmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,

    // Step-type icons (appear inside step badges / journey markers)
    checklist: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>`,
    selection: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    decision: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    infoStep: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>`,
};

// Return the step-type icon for a given node type string
function getStepTypeIcon(nodeType) {
    const map = {
        checklist: ICONS.checklist,
        selection: ICONS.selection,
        decision:  ICONS.decision,
        info:      ICONS.infoStep,
    };
    return map[nodeType] || '';
}

// Helper that returns just the descriptive tier name, stripping the leading
// "Tier N:" prefix (e.g. "Universal Screening & Core Instruction").
function getTierName(fullTitle) {
    if (!fullTitle) return '';
    const idx = fullTitle.indexOf(':');
    return idx === -1 ? fullTitle.trim() : fullTitle.slice(idx + 1).trim();
}

// Helper function to get shortened tier title for mobile
function getTierTitle(fullTitle, isMobile = window.innerWidth <= 768) {
    if (!isMobile) return fullTitle;
    
    // Extract just the tier label (e.g., "Tier ONE" or "Tier 2") from the full title
    const match = fullTitle.match(/^(Tier (?:\d+|[A-Z]+))/);
    return match ? match[1] : fullTitle;
}

// Function to update tier title when resizing between mobile and desktop
function updateTierTitleOnResize() {
    const header = document.querySelector('.visual-flowchart-header h2');
    if (!header) return;
    
    const currentText = header.textContent;
    // Check if we have a tier title pattern
    if (currentText.match(/^Tier (?:\d+|[A-Z]+)/)) {
        const isMobile = window.innerWidth <= 768;
        // Get the full title from FLOWCHART_DEFINITIONS if needed
        const tierMatch = currentText.match(/^Tier (\d+|[A-Z]+)/);
        if (tierMatch) {
            const tierNum = tierMatch[1];
            // Map word numbers to digit keys
            const wordToDigit = { 'ONE': '1', 'TWO': '2', 'THREE': '3' };
            const tierKey = `tier${wordToDigit[tierNum] || tierNum}`;
            if (FLOWCHART_DEFINITIONS[tierKey]) {
                const fullTitle = FLOWCHART_DEFINITIONS[tierKey].title;
                header.textContent = getTierTitle(fullTitle, isMobile);
            }
        }
    }
}

// Node data definitions for each tier's flowchart
const FLOWCHART_DEFINITIONS = {
    tier1: {
        title: 'Tier ONE: Universal Classroom',
        startNode: 'tier1-principles',
        nodes: {
            'tier1-principles': {
                id: 'tier1-principles',
                type: 'checklist',
                title: 'Step 1: Principles of Explicit and Systematic Instruction',
                subtitle: 'Principles of Explicit and Systematic Instruction',
                description: 'Review the following principles before proceeding.',
                items: [
                    'Are the lesson goals clearly stated?',
                    'Is the content presented in digestible, understandable, and logically sequenced steps, as guided by the LRSD Scope and Sequence?',
                    'Is immediate corrective feedback being provided?',
                    'Is guided supported practice sufficient to lead the fluent application?',
                    'Are the activities used to accomplish specific goals?',
                    'Is there a plan for reteaching when necessary?',
                    'Is progress being tracked?',
                    'Does Instruction incorporate the simple view of reading?'
                ],
                nextNode: 'tier1-screener',
                buttonText: 'Continue to Literacy Screener'
            },
            'tier1-screener': {
                id: 'tier1-screener',
                type: 'selection',
                title: 'Step 2: Literacy Screener',
                subtitle: 'Administer literacy screener.',
                description: 'Administer literacy screener.\n\n(DIBELS, CTOPP-2, THaFol, IDAPEL)',
                options: 'screeners', // Will fetch from tierFlowchartData
                nextNode: 'tier1-effectiveness',
                nextHandler: 'selectTier1ScreenerVisual'
            },
            'tier1-effectiveness': {
                id: 'tier1-effectiveness',
                type: 'decision',
                title: 'Step 2: Literacy Screener',
                subtitle: 'Was instruction effective?',
                description: 'Administer literacy screener. (DIBELS, CTOPP-2, THaFol, IDAPEL)\n\nIf you chose the Successful or Unsuccessful mistakenly, simply chose the correct option and continue.',
                choices: [
                    { id: 'effective', label: 'Option A: Instruction Effective', sublabel: 'Subtest result Blue or Green', type: 'success', nextNode: 'tier1-success' },
                    { id: 'ineffective', label: 'Option B: Instruction Ineffective', sublabel: 'Subtest result Yellow or Red', type: 'warning', nextNode: 'tier1-percentage' }
                ]
            },
            'tier1-success': {
                id: 'tier1-success',
                type: 'endpoint',
                status: 'success',
                title: 'Step 3: Success!',
                description: 'Continue and monitor with general curriculum.',
                recommendations: [
                    'Continue and monitor with general curriculum'
                ]
            },
            'tier1-percentage': {
                id: 'tier1-percentage',
                type: 'decision',
                title: 'Route B: Instruction Ineffective',
                subtitle: 'What percentage of students are unsuccessful?',
                description: 'Based on screener results, how many students are below benchmark?',
                choices: [
                    { id: 'more-20', label: 'Option B1', sublabel: 'Instruction unsuccessful for 20% or more of students.', type: 'warning', nextNode: 'tier1-move-tier2' },
                    { id: 'less-20', label: 'Option B2', sublabel: 'Instruction unsuccessful for fewer than 20% of students.', type: 'warning', nextNode: 'tier1-reteach' }
                ]
            },
            'tier1-move-tier2': {
                id: 'tier1-move-tier2',
                type: 'endpoint',
                status: 'info',
                title: 'Tier 2: Small Group Interventions',
                description: 'Instruction unsuccessful for 20% or more of students. This route continues into the Tier Two flowchart.',
                recommendations: [
                    'Continue into the Tier Two flowchart.'
                ],
                actionButton: { text: 'Start Tier 2 Flowchart', action: 'startTier2Visual' }
            },
            'tier1-reteach': {
                id: 'tier1-reteach',
                type: 'endpoint',
                status: 'warning',
                title: 'Step 3: Reteach General Curriculum',
                description: 'Consider areas of weakness discovered via Literacy Screener. Use the Interventions Menu below to find resources.\n\nThis route remains within Tier One.',
                recommendations: [
                    'Consider areas of weakness discovered via Literacy Screener.',
                    'Use the Interventions Menu below to find resources.'
                ],
                actionButton: { text: 'Redo Tier 1', action: 'restartTier1Visual' }
            }
        }
    },
    tier2: {
        title: 'Tier TWO: Small Group Intervention',
        startNode: 'tier2-principles',
        nodes: {
            'tier2-principles': {
                id: 'tier2-principles',
                type: 'checklist',
                title: 'Step 1: Entry',
                journeySummary: 'You ruled out impairments and other barriers as a cause of literacy challenges and confirmed Tier 2 supports were set up correctly.',
                reviewHint: 'Use the process map to reopen this step and review the checklist anytime.',
                leadText: 'Informed by data (See progress monitoring tools).',
                subtitle: 'Rule out that challenges are not the result of:',
                items: [
                    'Vision impairments',
                    'Hearing impairments',
                    'Poor attendance',
                    'MLL',
                    'Other diagnosis'
                ],
                postSections: [
                    {
                        title: 'Group Information',
                        items: [
                            'Led by classroom teachers.',
                            'Approx. 3-5 students per group.',
                            'Students receive intensive, explicit, and systematic instruction in small groups based on specific skill-based literacy goals (not necessarily grade), based on the five pillars of reading instruction as identified by classroom teachers, student services, and administrators.',
                            'Interventions are implemented for a suggested period of 20-40 minutes, three to five times per week for an 8 week period.'
                        ]
                    },
                    {
                        title: 'Progress Monitoring',
                        items: [
                            'Weekly progress monitoring (ex. UFLI, DIBELS Progress Monitoring Assessments).'
                        ]
                    },
                    {
                        title: 'Collaboration',
                        items: [
                            'Team members share progress monitoring results at school based meetings.'
                        ]
                    }
                ],
                nextNode: 'tier2-assessment',
                buttonText: 'Continue to Drill Down Assessment',
                useButton: true
            },
            'tier2-assessment': {
                id: 'tier2-assessment',
                type: 'selection',
                title: 'Step 2: Drill Down Assessment',
                subtitle: 'Administer a drill down assessment.',
                description: 'Use the menu below to find and administer a drill down assessment that aligns with the needs of your students, as determined by the literacy screener.',
                options: 'drillDownAssessments',
                nextNode: 'tier2-intervention',
                nextHandler: 'selectTier2AssessmentVisual'
            },
            'tier2-intervention': {
                id: 'tier2-intervention',
                type: 'selection',
                title: 'Step 3: 8-week Intervention',
                subtitle: 'Select and administer an 8-week intervention.',
                description: 'Use the menu below to find an appropriate intervention, monitor student response with progress monitoring tools (as required), and administer for an 8-week period.',
                options: 'interventions',
                nextNode: 'tier2-progress',
                nextHandler: 'selectTier2InterventionVisual'
            },
            'tier2-progress': {
                id: 'tier2-progress',
                type: 'decision',
                title: 'Step 4: Progress Monitoring',
                subtitle: 'Was instruction effective?',
                description: 'After the 8-week period, administer the regularly scheduled progress monitoring literacy screener (DIBELS, CTOPP-2, THaFol, IDAPEL).\n\nIf you chose the wrong option, simply choose the correct one and continue.',
                choices: [
                    { id: 'improved', label: 'Option A: Instruction Effective', sublabel: 'Subtest result Blue or Green', type: 'success', nextNode: 'tier2-success' },
                    { id: 'no-improvement', label: 'Option B: Instruction Ineffective', sublabel: 'Subtest result Yellow or Red', type: 'warning', nextNode: 'tier2-cycle2-assessment' }
                ]
            },
            'tier2-success': {
                id: 'tier2-success',
                type: 'endpoint',
                status: 'success',
                title: 'Step 5: Success!',
                description: 'Consider fading supports to Tier 1 and monitor.',
                recommendations: [
                    'Consider fading supports to Tier 1 and monitor.'
                ]
            },
            'tier2-cycle2-assessment': {
                id: 'tier2-cycle2-assessment',
                type: 'selection',
                title: 'Step 5: Drill Down Assessment',
                subtitle: 'Administer a second drill down assessment.',
                description: 'Use the menu again to find and administer a drill down assessment that aligns with the needs of your students, as determined by the latest literacy screener.',
                options: 'drillDownAssessments',
                nextNode: 'tier2-cycle2-intervention',
                nextHandler: 'selectTier2AssessmentVisual'
            },
            'tier2-cycle2-intervention': {
                id: 'tier2-cycle2-intervention',
                type: 'selection',
                title: 'Step 6: 8-week Intervention',
                subtitle: 'Alter or continue Tier 2 interventions.',
                description: 'Alter or continue Tier 2 interventions and regularly monitor student response to intervention with progress monitoring tools (as required).',
                options: 'interventions',
                nextNode: 'tier2-cycle2-progress',
                nextHandler: 'selectTier2InterventionVisual'
            },
            'tier2-cycle2-progress': {
                id: 'tier2-cycle2-progress',
                type: 'decision',
                title: 'Step 7: Progress Monitoring',
                subtitle: 'Was instruction effective?',
                description: 'After the 8-week period, administer the regularly scheduled progress monitoring literacy screener (DIBELS, CTOPP-2, THaFol, IDAPEL).\n\nIf you chose the wrong option, simply choose the correct one and continue.',
                choices: [
                    { id: 'improved', label: 'Option A: Instruction Effective', sublabel: 'Subtest result Blue or Green', type: 'success', nextNode: 'tier2-cycle2-success' },
                    { id: 'no-improvement', label: 'Option B: Instruction Ineffective', sublabel: 'Subtest result Yellow or Red', type: 'warning', nextNode: 'tier2-move-tier3' }
                ]
            },
            'tier2-cycle2-success': {
                id: 'tier2-cycle2-success',
                type: 'endpoint',
                status: 'success',
                title: 'Step 8: Success!',
                description: 'Consider fading supports to Tier 1 and monitor.',
                recommendations: [
                    'Consider fading supports to Tier 1 and monitor.'
                ]
            },
            'tier2-move-tier3': {
                id: 'tier2-move-tier3',
                type: 'endpoint',
                status: 'info',
                title: 'Step 8: Move to Tier 3',
                description: 'If student does not make expected progress in Tier 2 following two 8-week intervention cycles, they move into Tier 3. Fewer than 10% of students should need to be in Tier 3.\n\nThis route continues into the Tier Three flowchart.',
                recommendations: [
                    'Continue into the Tier Three flowchart.'
                ],
                actionButton: { text: 'Start Tier 3 Flowchart', action: 'startTier3Visual' }
            }
        }
    },
    tier3: {
        title: 'Tier THREE: Personalized Intervention',
        startNode: 'tier3-intro',
        nodes: {
            'tier3-intro': {
                id: 'tier3-intro',
                type: 'info',
                title: 'Entry Information',
                subtitle: 'Review the following information before proceeding.',
                sections: [
                    {
                        title: 'Entry',
                        items: [
                            'Below benchmark DIBELS composite scores.',
                            'Minimum of two 8-week periods of Tier 2 interventions.',
                            'Minimal progress in Tier 2 interventions, as measured by DIBELS benchmark and UFLI progress monitoring.',
                            'Reading related diagnosis (e.g. specific learning disability in reading, i.e., dyslexia) OR on list for potential diagnosis.'
                        ]
                    },
                    {
                        title: 'Group Information',
                        items: [
                            '1-3 students per group.',
                            'Intervention provided by a teacher trained in structured literacy and administrators of direct instruction.',
                            'Students work towards individualized goals (up to 3) created by the intervention teacher and recorded in the Student-Specific Plan.',
                            'Students receive specialized instruction based on their specific goals.',
                            '25 minute sessions, 4-5 times/week minimum.',
                            'Students with attendance impacting their ability to receive 4-5 lessons/week may be discontinued and placed back in Tier 2 intervention at the administrator\'s discretion.'
                        ]
                    },
                    {
                        title: 'Progress Monitoring',
                        items: [
                            'Interventions are implemented for a minimum of 8 weeks.',
                            'Progress monitoring completed weekly.',
                            'Divisional universal progress monitoring completed at 8-week mark.'
                        ]
                    },
                    {
                        title: 'Collaboration',
                        items: [
                            'Parents notified via letter that student will be receiving Tier 3 interventions.',
                            'Team members share progress monitoring results at school-based meetings.',
                            'Team members consult and collaborate with the School Psychologist, Speech-Language Pathologist, and Occupational Therapist.'
                        ]
                    }
                ],
                nextNode: 'tier3-assessment',
                buttonText: 'I have reviewed this information'
            },
            'tier3-assessment': {
                id: 'tier3-assessment',
                type: 'selection',
                title: 'Step 1: Drill Down Assessment',
                subtitle: 'Administer a drill down assessment.',
                description: 'Use the menu below to find and administer a drill down assessment that aligns with the needs of your students, as determined by the literacy screener.',
                options: 'drillDownAssessments',
                nextNode: 'tier3-intervention',
                nextHandler: 'selectTier3AssessmentVisual'
            },
            'tier3-intervention': {
                id: 'tier3-intervention',
                type: 'selection',
                title: 'Step 2: 8-week Intervention',
                subtitle: 'Select and administer an 8-week intervention.',
                description: 'Use the menu below to find an appropriate intervention, and administer for an 8-week period. Monitor student response to intervention weekly.',
                options: 'interventions',
                nextNode: 'tier3-progress',
                nextHandler: 'selectTier3InterventionVisual'
            },
            'tier3-progress': {
                id: 'tier3-progress',
                type: 'decision',
                title: 'Step 3: Progress Monitoring',
                subtitle: 'Was instruction effective?',
                description: 'After the 8-week period, administer the regularly scheduled progress monitoring literacy screener (DIBELS, CTOPP-2, THaFol, IDAPEL).\n\nIf you chose the wrong option, simply choose the correct one and continue.',
                choices: [
                    { id: 'improved', label: 'Option A: Instruction Effective', sublabel: 'Subtest result Blue or Green', type: 'success', nextNode: 'tier3-success' },
                    { id: 'no-improvement', label: 'Option B: Instruction Ineffective', sublabel: 'Subtest result Yellow or Red', type: 'warning', nextNode: 'tier3-specialist' }
                ]
            },
            'tier3-success': {
                id: 'tier3-success',
                type: 'endpoint',
                status: 'success',
                title: 'Step 4: Success!',
                description: 'Consider fading supports to Tier 1 and monitor.',
                recommendations: [
                    'Consider fading supports to Tier 1 and monitor.'
                ]
            },
            'tier3-specialist': {
                id: 'tier3-specialist',
                type: 'endpoint',
                status: 'warning',
                title: 'Step 4: Meet with Clinicians',
                description: 'Meet with the appropriate clinicians to discuss next steps.'
            }
        }
    }
};

// Initialize the integrated flowchart (new main interface)
function initIntegratedFlowchart(tierId) {
    const container = document.getElementById('flowchart-container');
    if (!container) return;
    
    const flowchartDef = FLOWCHART_DEFINITIONS[tierId];
    if (!flowchartDef) return;
    const showTier1SuccessSidebar = tierId === 'tier1';
    
    // Reset visual flowchart state
    appState.visualFlowchart = {
        nodes: [],
        connections: [],
        currentNodeId: null,
        selectedPath: [],
        tierId: tierId,
        choices: {}, // Track all choices for summary
        checklistProgress: {} // Track per-checklist sub-step index (one item at a time)
    };
    appState.fullJourney = [];
    
    container.classList.remove('flowchart-hidden');
    container.innerHTML = `
        <div class="integrated-flowchart">
            <div class="flowchart-tier-name-bar" id="flowchart-tier-name-bar" role="status" aria-label="Current tier">
                <span class="flowchart-tier-name-value" id="flowchart-tier-name-value">${escapeHtml(getTierName(flowchartDef.title))}</span>
            </div>
            <div class="flowchart-glass-header">
                <button class="flowchart-back-btn" onclick="closeIntegratedFlowchart()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    <span>Back</span>
                </button>
                
                <div class="tier-tabs">
                    <button class="tier-tab ${tierId === 'tier1' ? 'active' : ''}" onclick="switchToTier('tier1')" data-tier="tier1">
                        <span class="tier-number">1</span>
                        <span class="tier-label">Tier 1</span>
                    </button>
                    <button class="tier-tab ${tierId === 'tier2' ? 'active' : ''}" onclick="switchToTier('tier2')" data-tier="tier2">
                        <span class="tier-number">2</span>
                        <span class="tier-label">Tier 2</span>
                    </button>
                    <button class="tier-tab ${tierId === 'tier3' ? 'active' : ''}" onclick="switchToTier('tier3')" data-tier="tier3">
                        <span class="tier-number">3</span>
                        <span class="tier-label">Tier 3</span>
                    </button>
                </div>

                <div class="flowchart-screener-indicator" id="flowchart-screener-indicator" hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    <span class="flowchart-screener-indicator-label">Screener:</span>
                    <span class="flowchart-screener-indicator-value" id="flowchart-screener-indicator-value"></span>
                </div>
            </div>
            
            <div class="flowchart-content-area" id="flowchart-content">
                <div class="journey-shell${showTier1SuccessSidebar ? ' journey-shell-tier1' : ''}">
                    ${showTier1SuccessSidebar ? `
                    <aside class="tier1-success-sidebar" aria-label="Tier 1 instruction success guidance">
                        <div class="tier1-success-sidebar-head">
                            <span class="material-symbols-rounded tier1-success-sidebar-icon" aria-hidden="true">help</span>
                            <h3>How do we determine if instruction is Successful or Unsuccessful?</h3>
                        </div>
                        <div class="tier1-success-sidebar-block">
                            <p class="tier1-success-sidebar-label">
                                <span class="tier1-success-sidebar-indicators" aria-hidden="true">
                                    <span class="tier1-indicator-dot tier1-indicator-blue"></span>
                                    <span class="tier1-indicator-dot tier1-indicator-green"></span>
                                </span>
                                <span>Blue and Green Indicators</span>
                            </p>
                            <p>If student screener results indicate Blue or Green in all areas, instruction is successful.</p>
                        </div>
                        <div class="tier1-success-sidebar-block">
                            <p class="tier1-success-sidebar-label">
                                <span class="tier1-success-sidebar-indicators" aria-hidden="true">
                                    <span class="tier1-indicator-dot tier1-indicator-yellow"></span>
                                    <span class="tier1-indicator-dot tier1-indicator-red"></span>
                                </span>
                                <span>Yellow and Red Indicators</span>
                            </p>
                            <p>If student screener results indicate Yellow or Red in any one area, instruction is unsuccessful.</p>
                            <p class="tier1-success-sidebar-note">Monitoring and interventions are needed.</p>
                            <button class="scores-ref-btn" onclick="navigateToPage('scores')" type="button">
                                <span class="material-symbols-rounded" aria-hidden="true">bar_chart</span>
                                See Understanding Scores &amp; Percentiles
                            </button>
                        </div>
                    </aside>` : ''}
                    <aside class="journey-map" id="journey-map" aria-label="Decision summary">
                        <div class="journey-map-head">
                            <div class="journey-map-head-left">
                                <svg class="journey-map-head-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                                <span class="journey-map-title">Your Decisions</span>
                            </div>
                            <span class="journey-map-count" id="journey-map-count">Step 1</span>
                        </div>
                        <div class="journey-map-bar"><span class="journey-map-bar-fill" id="journey-map-bar-fill"></span></div>
                        <ol class="journey-map-list" id="journey-map-list"></ol>
                        <div class="journey-track" id="flowchart-steps"></div>
                        <button class="journey-map-back" id="carousel-prev-btn" onclick="goToPreviousStep()" style="display: none;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 12H5M12 19l-7-7 7-7"/>
                            </svg>
                            Back one step
                        </button>
                    </aside>
                </div>
            </div>

        </div>
    `;
    
    // One delegated listener handles "revisit this step" on both the trail
    // cards and the process map, so no user data ends up in inline handlers.
    wireJourneyRevisit(container);

    // Apply the tier colour theme so the user always knows which tier they are on
    applyTierTheme(tierId);

    // Reflect any previously chosen screener in the visible header indicator.
    updateScreenerIndicator();

    // Show the first node
    showIntegratedNode(flowchartDef.startNode, null);
}

// Apply a tier-specific colour theme to the active flowchart so the user can
// always tell, at a glance, which tier they are currently working in.
function applyTierTheme(tierId) {
    const fc = document.querySelector('.integrated-flowchart');
    if (!fc) return;
    fc.classList.remove('flowchart-tier-1', 'flowchart-tier-2', 'flowchart-tier-3');
    const num = String(tierId).replace('tier', '');
    if (num === '1' || num === '2' || num === '3') {
        fc.classList.add(`flowchart-tier-${num}`);
    }
}

// Show an explicit "Go to Tier #" transition step so the user is clearly aware
// they are moving from one tier to another before the next tier's flow begins.
function showGoToTierStep(tierId) {
    const stepsContainer = getActiveStepTarget();
    const flowchartDef = FLOWCHART_DEFINITIONS[tierId];
    if (!stepsContainer || !flowchartDef) {
        switchToTier(tierId);
        return;
    }

    const num = String(tierId).replace('tier', '');
    const subtitle = flowchartDef.title.split(':').slice(1).join(':').trim();

    stepsContainer.innerHTML = `
        <div class="go-to-tier-step go-to-tier-${num}">
            <div class="go-to-tier-badge">Tier ${num}</div>
            <h2 class="go-to-tier-heading">Go to Tier ${num}</h2>
            ${subtitle ? `<p class="go-to-tier-sub">${escapeHtml(subtitle)}</p>` : ''}
            <p class="go-to-tier-note">You are moving on to the next tier of support.</p>
            <button class="action-btn action-primary go-to-tier-btn" onclick="switchToTier('${tierId}')">
                Continue to Tier ${num}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
        </div>
    `;

    const prevBtn = document.getElementById('carousel-prev-btn');
    if (prevBtn) prevBtn.style.display = 'none';

    completeJourneyMap(`Moving to Tier ${num}`);

    requestAnimationFrame(() => {
        const step = stepsContainer.querySelector('.go-to-tier-step');
        if (step) step.classList.add('go-to-tier-visible');
    });
    scrollToActiveStep();
}

// Show a node in the integrated flowchart
function showIntegratedNode(nodeId, fromNodeId, choiceId = null, direction = 'forward') {
    const tierId = appState.visualFlowchart.tierId;
    const flowchartDef = FLOWCHART_DEFINITIONS[tierId];
    const nodeData = flowchartDef.nodes[nodeId];
    
    if (!nodeData) {
        console.error(`Node ${nodeId} not found in tier ${tierId}`);
        return;
    }
    
    const stepsContainer = document.getElementById('flowchart-steps');
    if (!stepsContainer) return;
    
    // Add to path
    appState.visualFlowchart.selectedPath.push({ nodeId, fromNodeId, choiceId });
    appState.visualFlowchart.currentNodeId = nodeId;
    
    // Update carousel navigation (prev button, step indicator)
    updateCarouselNav();
    
    // If this is an endpoint, route based on whether it's a tier transition or terminal
    if (nodeData.type === 'endpoint') {
        // Refresh the panel first so the step just answered stays open and
        // the outcome opens in its own row.
        renderJourneyMap(getActiveStepNumber());
        saveCurrentTierToFullJourney();
        const tierTransitionActions = new Set(['startTier2Visual', 'startTier3Visual', 'restartTier2Visual']);
        const primaryAction = nodeData.actionButton?.action;
        const secondaryAction = nodeData.secondaryAction?.action;
        const hasPrimaryTransition = tierTransitionActions.has(primaryAction);
        const hasSecondaryTransition = tierTransitionActions.has(secondaryAction);

        if (hasPrimaryTransition && !hasSecondaryTransition) {
            // Single tier-transition action → go directly to next tier
            const fnMap = {
                startTier2Visual: 'startTier2VisualIntegrated',
                startTier3Visual: 'startTier3VisualIntegrated',
                restartTier2Visual: 'restartTier2VisualIntegrated'
            };
            if (window[fnMap[primaryAction]]) window[fnMap[primaryAction]]();
        } else if (hasPrimaryTransition || hasSecondaryTransition) {
            // Multiple tier-transition options → show choice card (no journey review)
            showTierTransitionChoice(nodeData);
        } else {
            // True terminal endpoint — show the full route animation summary.
            showFinalSummary(nodeData);
        }
        return;
    }
    
    // Journey mode: keep every previous step on screen and render the whole
    // trail, with this node as the active, spotlighted step at the end.
    renderJourney(direction);
}

/* ============================================================
   JOURNEY TRAIL — the whole process stays on screen
   ------------------------------------------------------------
   Every step the user has taken remains visible as a compact,
   connected card above the active step, and the sticky process
   map on the left shows completed, current and upcoming steps
   so the entire process can be understood at a glance.
   ============================================================ */

// Delegate "revisit this step" clicks/keyboard activation for the trail and map
function wireJourneyRevisit(root) {
    if (!root || root.dataset.journeyRevisitWired === 'true') return;
    root.dataset.journeyRevisitWired = 'true';

    const activate = (event) => {
        const target = event.target.closest('[data-revisit-node]');
        if (!target || !root.contains(target)) return;
        if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        undoToStep(target.dataset.revisitNode);
    };

    root.addEventListener('click', activate);
    root.addEventListener('keydown', activate);
}

// Escape a value for safe use inside a double-quoted HTML attribute
function escapeAttr(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Strip the "Step 3: " prefix so numbering is owned by the trail itself
function getStepShortTitle(nodeDef) {
    return String(nodeDef?.title || '').replace(/^Step\s*\d+\s*[:.\-–]\s*/i, '').trim() || 'Step';
}

// Human label for a step type, used on the trail markers and map
function getStepTypeLabel(type) {
    const labels = {
        checklist: 'Check',
        selection: 'Choose',
        decision: 'Decide',
        info: 'Read',
        endpoint: 'Outcome'
    };
    return labels[type] || 'Step';
}

// The answer the user gave at a step, shown on its completed trail card
function getStepAnswerText(nodeId, nodeDef) {
    const choice = appState.visualFlowchart.choices[nodeId];
    if (choice && choice.name) return choice.name;
    if (nodeDef?.type === 'checklist') return 'Reviewed';
    return '';
}

// Look ahead from the current node so the user can see what is still to come.
// Deterministic hops follow nextNode; a branch is shown as a single outcome.
function projectUpcomingSteps(limit = 5) {
    const vf = appState.visualFlowchart;
    const tierDef = FLOWCHART_DEFINITIONS[vf.tierId];
    const upcoming = [];
    if (!tierDef) return upcoming;

    const seen = new Set(vf.selectedPath.map(s => s.nodeId));
    let current = tierDef.nodes[vf.currentNodeId];

    while (current && upcoming.length < limit) {
        if (current.type === 'decision') {
            upcoming.push({ title: 'Outcome & recommendations', type: 'endpoint' });
            break;
        }
        if (current.type === 'endpoint') break;

        const nextId = current.nextNode;
        const next = nextId ? tierDef.nodes[nextId] : null;
        if (!next || seen.has(nextId)) break;

        seen.add(nextId);
        upcoming.push({ id: nextId, title: getStepShortTitle(next), type: next.type });
        current = next;
    }

    return upcoming;
}

// Marker + connector rail that sits beside every trail card
function buildTrailRailHTML(number, state) {
    const marker = state === 'done'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
        : escapeHtml(String(number));
    return `
        <div class="trail-rail trail-rail-${state}">
            <span class="trail-line trail-line-top"></span>
            <span class="trail-marker trail-marker-${state}">${marker}</span>
            <span class="trail-line trail-line-bottom"></span>
        </div>
    `;
}

// Compact card for a step that is already behind the user
function buildTrailDoneCardHTML(nodeDef, number, answer) {
    return `
        <button type="button" class="trail-card trail-card-done" data-revisit-node="${escapeAttr(nodeDef.id)}" title="Revisit this step">
            <span class="trail-card-meta">
                <span class="trail-card-num">Step ${escapeHtml(String(number))}</span>
                <span class="trail-card-type">${escapeHtml(getStepTypeLabel(nodeDef.type))}</span>
            </span>
            <span class="trail-card-title">${escapeHtml(getStepShortTitle(nodeDef))}</span>
            ${answer ? `<span class="trail-card-answer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                ${escapeHtml(answer)}
            </span>` : ''}
            <span class="trail-card-revisit">Revisit</span>
        </button>
    `;
}

// Ghost card teasing the next step in the process
function buildTrailUpcomingHTML(step, number) {
    return `
        <div class="trail-item trail-item-upcoming">
            ${buildTrailRailHTML(number, 'upcoming')}
            <div class="trail-card trail-card-upcoming">
                <span class="trail-card-meta">
                    <span class="trail-card-num">Step ${escapeHtml(String(number))}</span>
                    <span class="trail-card-type">${escapeHtml(getStepTypeLabel(step.type))}</span>
                </span>
                <span class="trail-card-title">${escapeHtml(step.title)}</span>
                <span class="trail-card-next">Coming up next</span>
            </div>
        </div>
    `;
}

// Build the compact trail for every completed step (used on their own by the
// tier-transition and summary screens so context is never lost).
function buildCompletedTrailHTML(includeCurrent = false) {
    const vf = appState.visualFlowchart;
    const tierDef = FLOWCHART_DEFINITIONS[vf.tierId];
    if (!tierDef) return '';

    const path = vf.selectedPath;
    const lastIndex = includeCurrent ? path.length - 1 : path.length - 2;
    let html = '';
    let number = 0;

    path.forEach((step, index) => {
        const nodeDef = tierDef.nodes[step.nodeId];
        if (!nodeDef || nodeDef.type === 'endpoint' || index > lastIndex) return;
        number += 1;
        html += `<div class="trail-item trail-item-done">
            ${buildTrailRailHTML(number, 'done')}
            ${buildTrailDoneCardHTML(nodeDef, number, getStepAnswerText(step.nodeId, nodeDef))}
        </div>`;
    });

    return html;
}

// The 1-based number of the step the user is currently on
function getActiveStepNumber() {
    const vf = appState.visualFlowchart;
    const tierDef = FLOWCHART_DEFINITIONS[vf.tierId];
    const path = vf.selectedPath;
    if (!tierDef) return 1;
    let completed = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const node = tierDef.nodes[path[i].nodeId];
        if (node && node.type !== 'endpoint') completed++;
    }
    return completed + 1;
}

// Everything happens inside the current step's row in the panel; the track is
// only a fallback for when no row is open.
function getActiveStepTarget() {
    return document.getElementById('journey-step-slot') || document.getElementById('flowchart-steps');
}

// Render the whole process inside the Your Decisions panel: answered steps
// stay open and the current step opens in its own row below.
function renderJourney(direction = 'forward') {
    const track = document.getElementById('flowchart-steps');
    const vf = appState.visualFlowchart;
    const tierDef = FLOWCHART_DEFINITIONS[vf.tierId];
    if (!tierDef) return;

    const path = vf.selectedPath;
    const activeStep = path[path.length - 1];
    const activeNode = activeStep ? tierDef.nodes[activeStep.nodeId] : null;

    // The panel owns the whole process, so the old track stays empty.
    if (track) track.innerHTML = '';

    renderJourneyMap(getActiveStepNumber());

    // Re-populate each completed step's open slot so the full content
    // remains visible (in a locked, read-only state) after the user
    // has moved on — no collapsing.
    path.slice(0, path.length - 1).forEach(step => {
        const nodeDef = tierDef.nodes[step.nodeId];
        if (!nodeDef || nodeDef.type === 'endpoint') return;
        const doneSlot = document.getElementById(`journey-step-slot-done-${nodeDef.id}`);
        if (doneSlot) doneSlot.appendChild(createCompletedStepElement(nodeDef));
    });

    // The active step opens inside its own row in the panel, directly beneath
    // the steps already answered — never in a separate area below the list.
    const slot = document.getElementById('journey-step-slot');
    if (activeNode && slot) {
        createIntegratedNodeElement(activeNode, slot, direction);
    }

    scrollToActiveStep();
}

// Decision Summary panel: every completed step becomes a rich card; the current
// step is shown as "in progress"; upcoming steps are previewed as faded entries.
// The panel builds up as the user advances, making the whole journey visible.
function renderJourneyMap(activeNumber) {
    const list = document.getElementById('journey-map-list');
    const countEl = document.getElementById('journey-map-count');
    const barFill = document.getElementById('journey-map-bar-fill');
    const vf = appState.visualFlowchart;
    const tierDef = FLOWCHART_DEFINITIONS[vf.tierId];
    if (!list || !tierDef) return;

    const path = vf.selectedPath;
    const entries = [];
    let number = 0;

    path.forEach((step, index) => {
        const nodeDef = tierDef.nodes[step.nodeId];
        if (!nodeDef) return;
        const isActive = index === path.length - 1;
        if (nodeDef.type === 'endpoint' && !isActive) return;
        number += 1;
        entries.push({
            id: nodeDef.id,
            number,
            title: getStepShortTitle(nodeDef),
            type: nodeDef.type,
            answer: isActive ? '' : getStepAnswerText(nodeDef.id, nodeDef),
            state: isActive ? 'current' : 'done'
        });
    });

    projectUpcomingSteps(3).forEach(step => {
        number += 1;
        entries.push({ number, title: step.title, type: step.type, answer: '', state: 'upcoming' });
    });

    list.innerHTML = entries.map((entry, idx) => {
        const clickable = entry.state === 'done';
        const isCurrent = entry.state === 'current';
        const isDone = entry.state === 'done';

        const marker = isDone
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
            : escapeHtml(String(entry.number));

        return `
            <li class="journey-map-item journey-map-${entry.state}"
                style="animation-delay:${idx * 0.05}s"
                ${clickable ? `role="button" tabindex="0" data-revisit-node="${escapeAttr(entry.id)}" title="Revisit this step"` : ''}
                ${isCurrent ? 'aria-current="step"' : ''}>
                <span class="journey-map-marker">${marker}</span>
                <span class="journey-map-text">
                    <span class="journey-map-step-info">
                        <span class="journey-map-step-num">Step ${escapeHtml(String(entry.number))}</span>
                        <span class="journey-map-type-chip">${escapeHtml(getStepTypeLabel(entry.type))}</span>
                    </span>
                    <span class="journey-map-label">${escapeHtml(entry.title)}</span>
                    ${entry.answer ? `
                        <span class="journey-map-answer">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                            ${escapeHtml(entry.answer)}
                        </span>` : ''}
                    ${isCurrent ? '<span class="journey-map-now"><span class="journey-map-now-dot"></span>In progress</span>' : ''}
                    ${isCurrent ? '<div class="journey-step-slot" id="journey-step-slot"></div>' : ''}
                    ${isDone && entry.id ? `<div class="journey-step-slot-done" id="journey-step-slot-done-${escapeAttr(entry.id)}"></div>` : ''}
                </span>
            </li>
        `;
    }).join('');

    const total = entries.length || 1;
    const current = Math.min(activeNumber || 1, total);
    if (countEl) countEl.textContent = `Step ${current} of ${total}`;
    if (barFill) barFill.style.width = `${Math.round(((current - 1) / total) * 100 + (100 / total) * 0.35)}%`;
}

// Build a compact, read-only view of a completed step so it stays visible
// in its panel row rather than collapsing to just a title + answer chip.
function createCompletedStepElement(nodeData) {
    const el = document.createElement('div');
    el.className = 'completed-step-view';
    const vf = appState.visualFlowchart;
    const choice = vf.choices[nodeData.id];

    let html = '';

    if (nodeData.type === 'decision' && nodeData.choices) {
        const subtitleHtml = nodeData.subtitle
            ? `<p class="completed-step-sub">${escapeHtml(nodeData.subtitle)}</p>`
            : '';
        const buttonsHtml = nodeData.choices.map(c => {
            const taken = choice && c.id === choice.id;
            return `<div class="decision-btn decision-${c.type}${taken ? '' : ' decision-not-taken'}" aria-disabled="true" role="presentation">
                <div class="decision-content">
                    <strong>${escapeHtml(c.label)}</strong>
                    ${c.sublabel ? `<span>${escapeHtml(c.sublabel)}</span>` : ''}
                </div>
            </div>`;
        }).join('');
        html = `${subtitleHtml}<div class="decision-grid completed-grid">${buttonsHtml}</div>`;
    } else if (nodeData.type === 'selection' && choice) {
        if (nodeData.options === 'screeners') {
            // Show all screener options: chosen highlighted, others greyed out
            const tierData = appState.tierFlowchartData?.[vf.tierId];
            const options = tierData?.screeners || [];
            const buttonsHtml = options.map(opt => {
                const taken = opt.id === choice.id || opt.name === choice.name;
                return `<div class="completed-screener-option${taken ? ' completed-screener-taken' : ' completed-screener-other'}" aria-selected="${taken}" role="option">
                    <span class="completed-screener-name">${escapeHtml(opt.name)}</span>
                    ${taken ? `<svg class="completed-screener-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>` : ''}
                </div>`;
            }).join('');
            html = `<div class="completed-screener-grid">${buttonsHtml}</div>`;
        } else if (choice.pathway && choice.pathway.length > 0) {
            // Show file-pathway breadcrumb for drill-down assessments/interventions
            const crumbsHtml = choice.pathway.map((crumb, i) => {
                const isLast = i === choice.pathway.length - 1;
                return `${i > 0 ? '<span class="step-pathway-sep">›</span>' : ''}<span class="step-pathway-item${isLast ? ' step-pathway-final' : ''}">${escapeHtml(crumb)}</span>`;
            }).join('');
            html = `<div class="step-pathway">${crumbsHtml}</div>`;
        } else {
            html = `<div class="journey-map-answer completed-step-answer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                ${escapeHtml(choice.name)}
            </div>`;
        }
    } else if (nodeData.type === 'checklist') {
        // Show the full checklist with all items checked
        const items = nodeData.items || [];
        const itemsHtml = items.map(item => `
            <li class="completed-checklist-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
                <span>${escapeHtml(item)}</span>
            </li>`).join('');
        html = `<ul class="completed-checklist">${itemsHtml}</ul>`;
    }
    // Info nodes have no meaningful choice to display; leave the slot empty.

    el.innerHTML = html;
    return el;
}

// Mark the process map as finished once the journey summary is reached
function completeJourneyMap(label = 'Journey complete') {
    const countEl = document.getElementById('journey-map-count');
    const barFill = document.getElementById('journey-map-bar-fill');
    if (countEl) countEl.textContent = label;
    if (barFill) barFill.style.width = '100%';
    document.querySelectorAll('.journey-map-item.journey-map-current, .journey-map-item.journey-map-upcoming').forEach(item => {
        item.classList.remove('journey-map-current', 'journey-map-upcoming');
        item.classList.add('journey-map-done');
        const now = item.querySelector('.journey-map-now');
        if (now) now.remove();
    });
}

// Bring the spotlighted step into view without losing sight of the trail above
function scrollToActiveStep() {
    const active = document.querySelector('.journey-map-item.journey-map-current, .go-to-tier-step, .journey-review');
    if (!active) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => {
        const header = document.querySelector('.flowchart-glass-header');
        const offset = (header?.getBoundingClientRect().height || 0) + 90;
        const top = window.scrollY + active.getBoundingClientRect().top - offset;
        window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
    });
}

// Create integrated node element (carousel mode - single step)
function createIntegratedNodeElement(nodeData, container, direction = 'forward') {
    const nodeElement = document.createElement('div');
    nodeElement.className = `flowchart-step flowchart-step-${nodeData.type}`;
    nodeElement.setAttribute('data-node-id', nodeData.id);
    
    let content = '';
    
    switch (nodeData.type) {
        case 'checklist':
            // Every point is visible at once, but each one has to be ticked
            // off before the step can be completed.
            appState.visualFlowchart.checklistChecked = appState.visualFlowchart.checklistChecked || {};
            appState.visualFlowchart.checklistChecked[nodeData.id] = [];
            content = createIntegratedChecklistNode(nodeData);
            break;
        case 'selection':
            content = createIntegratedSelectionNode(nodeData);
            break;
        case 'decision':
            content = createIntegratedDecisionNode(nodeData);
            break;
        case 'info':
            content = createIntegratedInfoNode(nodeData);
            break;
        case 'endpoint':
            content = createIntegratedEndpointNode(nodeData);
            break;
        default:
            content = `<div class="step-content"><h3>${nodeData.title}</h3></div>`;
    }
    
    nodeElement.innerHTML = content;
    container.appendChild(nodeElement);
    
    // Animate in based on direction
    const animClass = direction === 'back' ? 'carousel-enter-back' : 'carousel-enter-forward';
    requestAnimationFrame(() => {
        nodeElement.classList.add(animClass);
    });
    
    // Wire up the checklist items if needed
    if (nodeData.type === 'checklist') {
        wireIntegratedChecklist(nodeElement, nodeData);
    }

    // For drill-down / intervention wizard nodes, if a screener has already been
    // chosen earlier in the journey, populate the dependent dropdowns so the user
    // doesn't have to re-select it.
    if (nodeData.type === 'selection') {
        const wizardItemTypes = { drillDownAssessments: 'Assessment', interventions: 'Intervention' };
        if (wizardItemTypes[nodeData.options]) {
            const remembered = getRememberedScreenerId();
            const screenerSel = nodeElement.querySelector('#fw-screener-select');
            if (remembered && screenerSel) {
                screenerSel.value = remembered;
                fwOnScreenerChange(remembered);
            }
        }
    }
}

// Create integrated checklist node – every point is visible in one list.
// The user must tick each point off before the step can be completed; ticked
// points grow slightly larger and bolder so progress is obvious at a glance.
function createIntegratedChecklistNode(nodeData) {
    const items = nodeData.items || [];
    const total = items.length;

    const itemsHTML = items.map((item, index) => `
        <li class="checklist-line-item">
            <label class="checklist-line">
                <input type="checkbox" data-index="${index}">
                <span class="checklist-line-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </span>
                <span class="checklist-line-text">${escapeHtml(item)}</span>
            </label>
        </li>
    `).join('');

    const leadTextHTML = nodeData.leadText
        ? `<p class="checklist-lead-text">${escapeHtml(nodeData.leadText)}</p>`
        : '';

    const postSectionsHTML = nodeData.postSections
        ? nodeData.postSections.map(section => `
            <div class="checklist-post-section">
                <h4 class="checklist-post-section-title">${escapeHtml(section.title)}</h4>
                <ul class="checklist-post-section-list">
                    ${section.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
                </ul>
            </div>
        `).join('')
        : '';

    const continueBtnHTML = nodeData.useButton
        ? `<button class="continue-btn checklist-continue-btn" disabled
               onclick="proceedFromIntegratedChecklist('${escapeAttr(nodeData.id)}', '${escapeAttr(nodeData.nextNode)}')">
               ${escapeHtml(nodeData.buttonText || 'Continue')}
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
           </button>`
        : '';

    return `
        <div class="step-header">
            <div class="step-badge"><span class="step-badge-icon">${getStepTypeIcon(nodeData.type)}</span>${escapeHtml(nodeData.title)}</div>
            <button class="undo-btn" onclick="undoToStep('${escapeAttr(nodeData.id)}')" title="Return to this step">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="11 17 6 12 11 7"/><path d="M18 17v-2a4 4 0 0 0-4-4H6"/>
                </svg>
            </button>
        </div>
        <div class="step-content checklist-full">
            ${leadTextHTML}
            ${nodeData.subtitle ? `<p class="checklist-intro">${escapeHtml(nodeData.subtitle)}</p>` : ''}
            <div class="checklist-meter">
                <div class="checklist-meter-bar"><span class="checklist-meter-fill" style="width: 0%"></span></div>
                <span class="checklist-meter-count">0 of ${total} checked</span>
            </div>
            <ul class="checklist-lines">
                ${itemsHTML}
            </ul>
            ${postSectionsHTML}
            ${continueBtnHTML}
        </div>
    `;
}

// Wire every checklist item so progress updates live and the step auto-advances
// once all points have been checked off (no Continue button required).
// If nodeData.useButton is true, a Continue button is enabled instead.
function wireIntegratedChecklist(nodeElement, nodeData) {
    const checkboxes = Array.from(nodeElement.querySelectorAll('.checklist-line input[type="checkbox"]'));
    const fill = nodeElement.querySelector('.checklist-meter-fill');
    const count = nodeElement.querySelector('.checklist-meter-count');
    const continueBtn = nodeElement.querySelector('.checklist-continue-btn');
    const total = checkboxes.length;
    if (!total) return;

    let autoAdvanceTimer = null;

    const sync = () => {
        const vf = appState.visualFlowchart;
        vf.checklistChecked = vf.checklistChecked || {};
        vf.checklistChecked[nodeData.id] = checkboxes.map(cb => cb.checked);

        const checked = checkboxes.filter(cb => cb.checked).length;
        checkboxes.forEach(cb => {
            const line = cb.closest('.checklist-line');
            if (line) line.classList.toggle('checked', cb.checked);
        });
        if (fill) fill.style.width = `${Math.round((checked / total) * 100)}%`;
        if (count) count.textContent = `${checked} of ${total} checked`;

        if (nodeData.useButton) {
            // Enable the Continue button only when all items are checked
            if (continueBtn) continueBtn.disabled = checked < total;
        } else {
            // Auto-advance once all items are checked
            if (checked === total && nodeData.nextNode) {
                if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
                autoAdvanceTimer = setTimeout(() => {
                    // Guard: only advance if this step is still the active one
                    if (appState.visualFlowchart.currentNodeId === nodeData.id) {
                        proceedFromIntegratedChecklist(nodeData.id, nodeData.nextNode);
                    }
                }, 600);
            }
        }
    };

    checkboxes.forEach(cb => cb.addEventListener('change', sync));
    sync();
}

// Create integrated selection node
function createIntegratedSelectionNode(nodeData) {
    const tierId = appState.visualFlowchart.tierId;
    const tierData = appState.tierFlowchartData?.[tierId];

    // Helper function to escape strings for use in JS string literals
    const escapeJsString = (str) => String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

    const infoBoxHTML = nodeData.infoBox ? `
        <div class="info-callout">
            ${ICONS.info}
            <div>
                <h4>${nodeData.infoBox.title}</h4>
                ${nodeData.infoBox.text ? `<p>${nodeData.infoBox.text}</p>` : ''}
                ${nodeData.infoBox.items ? `<ul>${nodeData.infoBox.items.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
            </div>
        </div>
    ` : '';

    const warningBoxHTML = nodeData.warningBox ? `
        <div class="warning-callout">
            ${ICONS.warning}
            <div>
                <h4>${nodeData.warningBox.title}</h4>
                <p>${nodeData.warningBox.text}</p>
            </div>
        </div>
    ` : '';

    // For drill-down assessments and interventions, use the embedded interventions menu wizard
    const wizardItemTypes = { drillDownAssessments: 'Assessment', interventions: 'Intervention' };
    const itemType = wizardItemTypes[nodeData.options];

    if (itemType) {
        // Initialize wizard state for this node
        const rememberedScreener = getRememberedScreenerId();
        appState.fwState = {
            screener: null,
            screenerData: null,
            subtest: null,
            subtestData: null,
            pillars: [],
            nodeId: nodeData.id,
            handlerName: nodeData.nextHandler,
            itemType: itemType
        };

        const screenerOptionsHtml = buildScreenerDropdownHtml('', rememberedScreener);

        return `
            <div class="step-header">
                <div class="step-badge"><span class="step-badge-icon">${getStepTypeIcon(nodeData.type)}</span>${nodeData.title}</div>
                <button class="undo-btn" onclick="undoToStep('${nodeData.id}')" title="Return to this step">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="11 17 6 12 11 7"/><path d="M18 17v-2a4 4 0 0 0-4-4H6"/>
                    </svg>
                </button>
            </div>
            <div class="step-content">
                <h3>${nodeData.subtitle}</h3>
                <p>${nodeData.description}</p>
                <div class="evidence-popup-entry">
                    <button type="button" class="evidence-info-trigger evidence-info-trigger-inline" aria-label="Show evidence and research based definitions" title="Evidence and research based definitions" onclick="event.stopPropagation();">
                        <span class="material-symbols-rounded" aria-hidden="true">info</span>
                    </button>
                    <span>Evidence and research based definitions</span>
                </div>
                ${infoBoxHTML}
                ${warningBoxHTML}
                <div class="fw-wizard">
                    <div class="fw-wizard-selects">
                        <div class="fw-select-group">
                            <label for="fw-screener-select">Screener</label>
                            <select id="fw-screener-select" class="fw-select" onchange="fwOnScreenerChange(this.value)">
                                ${screenerOptionsHtml}
                            </select>
                        </div>
                        <div class="fw-select-group">
                            <label for="fw-subtest-select">Subtest</label>
                            <select id="fw-subtest-select" class="fw-select" onchange="fwOnSubtestChange(this.value)" disabled>
                                <option value="">Select screener first…</option>
                            </select>
                        </div>
                        <div class="fw-select-group">
                            <label for="fw-pillar-select">Literacy Pillar</label>
                            <select id="fw-pillar-select" class="fw-select" onchange="fwOnPillarChange(this.value)" disabled>
                                <option value="">Select subtest first…</option>
                            </select>
                        </div>
                    </div>
                    <div id="fw-results" class="fw-results"></div>
                </div>
            </div>
        `;
    }

    // Default: flat list of options (used for screener selection in Tier 1)
    const options = tierData?.[nodeData.options] || [];
    const isScreenerNode = nodeData.options === 'screeners';

    const optionsHTML = isScreenerNode
        ? options.map(option => `
        <button class="screener-pill-btn" onclick="selectIntegratedOption('${escapeJsString(nodeData.id)}', '${escapeJsString(option.id)}', '${escapeJsString(option.name)}', '${escapeJsString(nodeData.nextHandler)}')">
            <span class="screener-pill-name">${escapeHtml(option.name)}</span>
            ${option.description ? `<span class="screener-pill-desc">${escapeHtml(option.description)}</span>` : ''}
        </button>
    `).join('')
        : options.map(option => `
        <button class="selection-option" onclick="selectIntegratedOption('${escapeJsString(nodeData.id)}', '${escapeJsString(option.id)}', '${escapeJsString(option.name)}', '${escapeJsString(nodeData.nextHandler)}')">
            <div class="option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    <path d="M9 12l2 2 4-4"/>
                </svg>
            </div>
            <div class="option-details">
                <h4>${option.name}</h4>
                <p>${option.description}</p>
                ${option.administrationTime ? `<span class="option-meta">Time: ${option.administrationTime}</span>` : ''}
                ${option.duration ? `<span class="option-meta">${option.duration} • ${option.frequency}</span>` : ''}
            </div>
            <div class="option-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </div>
        </button>
    `).join('');

    return `
        <div class="step-header">
            <div class="step-badge"><span class="step-badge-icon">${getStepTypeIcon(nodeData.type)}</span>${nodeData.title}</div>
            <button class="undo-btn" onclick="undoToStep('${nodeData.id}')" title="Return to this step">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="11 17 6 12 11 7"/><path d="M18 17v-2a4 4 0 0 0-4-4H6"/>
                </svg>
            </button>
        </div>
        <div class="step-content">
            <h3>${nodeData.subtitle}</h3>
            <p>${nodeData.description}</p>
            ${infoBoxHTML}
            ${warningBoxHTML}
            <div class="${isScreenerNode ? 'screener-pill-grid' : 'selection-grid'}">
                ${optionsHTML}
            </div>
        </div>
    `;
}

// Flowchart embedded intervention wizard: screener change handler
function fwOnScreenerChange(value) {
    if (!appState.fwState) return;
    const subtestSel = document.getElementById('fw-subtest-select');
    const pillarSel = document.getElementById('fw-pillar-select');
    const resultsEl = document.getElementById('fw-results');

    appState.fwState.screener = value || null;
    appState.fwState.screenerData = null;
    appState.fwState.subtest = null;
    appState.fwState.subtestData = null;
    appState.fwState.pillars = [];

    if (pillarSel) { pillarSel.innerHTML = '<option value="">Select subtest first…</option>'; pillarSel.disabled = true; }
    if (resultsEl) resultsEl.innerHTML = '';

    if (!value) {
        if (subtestSel) { subtestSel.innerHTML = '<option value="">Select screener first…</option>'; subtestSel.disabled = true; }
        return;
    }

    const screenerData = (appState.interventionMenuData?.screeners || []).find(s => s.screener_id === value);
    if (!screenerData) return;
    appState.fwState.screenerData = screenerData;

    // Keep the remembered screener in sync so later steps stay pre-selected.
    setRememberedScreener(value);

    if (subtestSel) {
        subtestSel.innerHTML = '<option value="">Select…</option>';
        (screenerData.subtests || []).forEach(st => {
            const opt = document.createElement('option');
            opt.value = st.subtest_code;
            opt.textContent = `${st.subtest_code} – ${st.subtest_name}`;
            subtestSel.appendChild(opt);
        });
        subtestSel.disabled = false;
    }
}

// Flowchart embedded intervention wizard: subtest change handler
function fwOnSubtestChange(value) {
    if (!appState.fwState || !appState.fwState.screenerData) return;
    const pillarSel = document.getElementById('fw-pillar-select');
    const resultsEl = document.getElementById('fw-results');

    appState.fwState.subtest = value || null;
    appState.fwState.subtestData = null;
    appState.fwState.pillars = [];
    if (resultsEl) resultsEl.innerHTML = '';

    if (!value) {
        if (pillarSel) { pillarSel.innerHTML = '<option value="">Select subtest first…</option>'; pillarSel.disabled = true; }
        return;
    }

    const subtestData = (appState.fwState.screenerData.subtests || []).find(s => s.subtest_code === value);
    if (!subtestData) return;
    appState.fwState.subtestData = subtestData;

    const pillars = subtestData.literacy_pillars || [];
    if (pillarSel) {
        pillarSel.innerHTML = '<option value="">Select…</option>';
        if (pillars.length > 1) {
            const allOpt = document.createElement('option');
            allOpt.value = 'ALL';
            allOpt.textContent = 'All Pillars';
            pillarSel.appendChild(allOpt);
        }
        pillars.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p;
            opt.textContent = p;
            pillarSel.appendChild(opt);
        });
        pillarSel.disabled = false;

        // Auto-select if only one pillar
        if (pillars.length === 1) {
            pillarSel.value = pillars[0];
            fwOnPillarChange(pillars[0]);
        }
    }
}

// Flowchart embedded intervention wizard: pillar change handler
function fwOnPillarChange(value) {
    if (!appState.fwState) return;
    const resultsEl = document.getElementById('fw-results');

    if (!value) {
        appState.fwState.pillars = [];
        if (resultsEl) resultsEl.innerHTML = '';
        return;
    }

    const allPillars = appState.fwState.subtestData?.literacy_pillars || [];
    appState.fwState.pillars = value === 'ALL' ? [...allPillars] : [value];
    fwLoadResults();
}

// Flowchart embedded intervention wizard: load and display filtered results
function fwLoadResults() {
    if (!appState.fwState || !appState.fwState.subtestData) return;
    const resultsEl = document.getElementById('fw-results');
    if (!resultsEl) return;

    const { itemType, screenerData, subtestData, pillars } = appState.fwState;
    const program = screenerData?.language === 'English' ? 'English' : 'French Immersion';
    const subtestStart = subtestData.grade_range?.start;
    const subtestEnd = subtestData.grade_range?.end;

    let items = itemType === 'Assessment'
        ? (appState.interventionMenuData?.assessments || [])
        : (appState.interventionMenuData?.interventions || []);

    let filtered = items.filter(item => item.program === program);
    filtered = filtered.filter(item =>
        gradeRangeOverlaps(subtestStart, subtestEnd, item.grade_range?.start, item.grade_range?.end)
    );
    if (pillars && pillars.length > 0) {
        filtered = filtered.filter(item => {
            const itemPillars = item.literacy_pillars || [item.literacy_pillar];
            return pillars.some(p => itemPillars.includes(p));
        });
    }

    if (filtered.length === 0) {
        resultsEl.innerHTML = '<p class="fw-no-results">No matching items found for the selected criteria.</p>';
        return;
    }

    const escapeJs = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    resultsEl.innerHTML = `
        <div class="fw-results-header">${filtered.length} result${filtered.length !== 1 ? 's' : ''}</div>
        <div class="fw-results-list">
            ${filtered.map(item => {
                const gradeText = `${item.grade_range?.start || 'K'}–${item.grade_range?.end || '12'}`;
                const detailText = item.duration
                    ? `${item.duration} • ${item.frequency}`
                    : item.administrationTime ? `Time: ${item.administrationTime}` : '';
                return `<button class="fw-result-item" onclick="fwSelectItem('${escapeJs(item.item_id)}', '${escapeJs(item.name)}')">
                    <div class="fw-result-info">
                        <div class="fw-result-name">${escapeHtml(item.name)}</div>
                        <div class="fw-result-meta">${detailText ? escapeHtml(detailText) + ' • ' : ''}Gr. ${gradeText}</div>
                    </div>
                    <svg class="fw-result-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><path d="M9 18l6-6-6-6"/></svg>
                </button>`;
            }).join('')}
        </div>
    `;
}

// Flowchart embedded intervention wizard: select an item and advance the flowchart
function fwSelectItem(itemId, itemName) {
    if (!appState.fwState) return;
    const { nodeId, handlerName, itemType, screenerData, subtestData, pillars } = appState.fwState;
    if (nodeId && handlerName) {
        // Record the drill-down assessment / intervention selection so the teacher
        // can always keep track of what has been chosen (persisted to localStorage).
        recordSelection(itemType, itemId, itemName, appState.visualFlowchart?.tierId);

        // Build a file-pathway breadcrumb for the completed view and pre-store it
        // so selectIntegratedOption can preserve it when it writes the choice.
        const pathway = [];
        if (screenerData?.screener_name) pathway.push(screenerData.screener_name);
        if (subtestData?.subtest_code) {
            const subtestLabel = subtestData.subtest_name
                ? `${subtestData.subtest_code} — ${subtestData.subtest_name}`
                : subtestData.subtest_code;
            pathway.push(subtestLabel);
        }
        if (pillars && pillars.length === 1) pathway.push(pillars[0]);
        pathway.push(itemName);

        // Pre-populate so selectIntegratedOption can merge it in
        appState.visualFlowchart._pendingPathway = { nodeId, pathway };
        selectIntegratedOption(nodeId, itemId, itemName, handlerName);
        appState.visualFlowchart._pendingPathway = null;
    }
}

// Create integrated decision node
function createIntegratedDecisionNode(nodeData) {
    const choicesHTML = nodeData.choices.map(choice => `
        <button class="decision-btn decision-${choice.type}" onclick="makeIntegratedDecision('${nodeData.id}', '${choice.id}', '${choice.nextNode}')">
            <div class="decision-content">
                <strong>${choice.label}</strong>
                <span>${choice.sublabel}</span>
            </div>
        </button>
    `).join('');
    
    const infoBoxHTML = nodeData.infoBox ? `
        <div class="info-callout">
            ${ICONS.info}
            <div>
                <h4>${nodeData.infoBox.title}</h4>
                ${nodeData.infoBox.text ? `<p>${nodeData.infoBox.text}</p>` : ''}
                ${nodeData.infoBox.items ? `<ul>${nodeData.infoBox.items.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
            </div>
        </div>
    ` : '';
    
    const warningBoxHTML = nodeData.warningBox ? `
        <div class="warning-callout">
            ${ICONS.warning}
            <div>
                <h4>${nodeData.warningBox.title}</h4>
                <p>${nodeData.warningBox.text}</p>
            </div>
        </div>
    ` : '';
    
    return `
        <div class="step-header">
            <div class="step-badge"><span class="step-badge-icon">${getStepTypeIcon(nodeData.type)}</span>${nodeData.title}</div>
            <button class="undo-btn" onclick="undoToStep('${nodeData.id}')" title="Return to this step">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="11 17 6 12 11 7"/><path d="M18 17v-2a4 4 0 0 0-4-4H6"/>
                </svg>
            </button>
        </div>
        <div class="step-content">
            <h3>${nodeData.subtitle}</h3>
            <p>${nodeData.description}</p>
            ${warningBoxHTML}
            ${infoBoxHTML}
            <div class="decision-grid">
                ${choicesHTML}
            </div>
        </div>
    `;
}

// Create integrated info node
function createIntegratedInfoNode(nodeData) {
    const featuresHTML = nodeData.features ? `
        <ul class="feature-list">
            ${nodeData.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
    ` : '';
    
    const sectionsHTML = nodeData.sections ? nodeData.sections.map(section => `
        <div class="info-section">
            <h4>${escapeHtml(section.title)}</h4>
            <ul class="feature-list">
                ${section.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
        </div>
    `).join('') : '';

    const warningBoxHTML = nodeData.warningBox ? `
        <div class="warning-callout">
            ${ICONS.warning}
            <div>
                <h4>${nodeData.warningBox.title}</h4>
                <p>${nodeData.warningBox.text}</p>
            </div>
        </div>
    ` : '';
    
    return `
        <div class="step-header">
            <div class="step-badge"><span class="step-badge-icon">${getStepTypeIcon(nodeData.type)}</span>${nodeData.title}</div>
            <button class="undo-btn" onclick="undoToStep('${nodeData.id}')" title="Return to this step">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="11 17 6 12 11 7"/><path d="M18 17v-2a4 4 0 0 0-4-4H6"/>
                </svg>
            </button>
        </div>
        <div class="step-content">
            <h3>${nodeData.subtitle}</h3>
            ${warningBoxHTML}
            ${nodeData.features ? `<h4>${nodeData.featuresTitle || 'Key Characteristics'}</h4>` : ''}
            ${featuresHTML}
            ${sectionsHTML}
            <button class="action-btn action-primary" onclick="proceedFromIntegratedInfo('${nodeData.id}', '${nodeData.nextNode}')">
                ${nodeData.buttonText}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
    `;
}

// Create integrated endpoint node
function createIntegratedEndpointNode(nodeData) {
    const recommendationsHTML = nodeData.recommendations ? `
        <div class="recommendations-box">
            <h4>Recommendations</h4>
            <ul>
                ${nodeData.recommendations.map(r => `<li>${r}</li>`).join('')}
            </ul>
        </div>
    ` : '';
    
    const warningBoxHTML = nodeData.warningBox ? `
        <div class="warning-callout">
            ${ICONS.warning}
            <div>
                <h4>${nodeData.warningBox.title}</h4>
                <p>${nodeData.warningBox.text}</p>
            </div>
        </div>
    ` : '';
    
    // Whitelist of allowed action names for security
    const allowedActions = ['startTier2Visual', 'startTier3Visual', 'restartTier1Visual', 'restartTier2Visual'];
    
    const actionButtonHTML = nodeData.actionButton && allowedActions.includes(nodeData.actionButton.action) ? `
        <button class="action-btn action-primary" onclick="${nodeData.actionButton.action}Integrated()">
            ${nodeData.actionButton.text}
        </button>
    ` : '';
    
    const secondaryActionHTML = nodeData.secondaryAction && allowedActions.includes(nodeData.secondaryAction.action) ? `
        <button class="action-btn action-secondary" onclick="${nodeData.secondaryAction.action}Integrated()">
            ${nodeData.secondaryAction.text}
        </button>
    ` : '';

    // For pure terminal endpoints (no tier-transition actions), always provide
    // Redo Tier 1 and Done so the user is never left without a next action.
    const defaultActionsHTML = (!actionButtonHTML && !secondaryActionHTML) ? `
        <button class="action-btn action-secondary" onclick="restartCurrentTier()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
            </svg>
            Redo Tier 1
        </button>
        <button class="action-btn action-primary" onclick="closeIntegratedFlowchart()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M20 6L9 17l-5-5"/></svg>
            Done
        </button>
    ` : '';
    
    return `
        <div class="endpoint-card endpoint-${nodeData.status}">
            <div class="endpoint-icon">
                ${ICONS[nodeData.status] || ICONS.info}
            </div>
            <h2>${nodeData.title}</h2>
            <p>${nodeData.description}</p>
            ${warningBoxHTML}
            ${recommendationsHTML}
            <div class="endpoint-actions">
                ${actionButtonHTML}
                ${secondaryActionHTML}
                ${defaultActionsHTML}
            </div>
        </div>
    `;
}

// Update checklist progress for integrated flowchart
function updateIntegratedChecklistProgress(nodeId) {
    const node = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (!node) return;
    
    const checkboxes = node.querySelectorAll('.checklist-item input[type="checkbox"]');
    const continueBtn = node.querySelector('.continue-btn');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    if (continueBtn) {
        continueBtn.disabled = !allChecked;
        if (allChecked) {
            continueBtn.classList.add('btn-ready');
        } else {
            continueBtn.classList.remove('btn-ready');
        }
    }
    
    // Add visual feedback to checked items
    checkboxes.forEach(checkbox => {
        const item = checkbox.closest('.checklist-item');
        if (checkbox.checked) {
            item.classList.add('checked');
        } else {
            item.classList.remove('checked');
        }
    });
}

// Proceed from checklist node
function proceedFromIntegratedChecklist(fromNodeId, toNodeId) {
    // Store checklist completion in choices for summary
    const tierId = appState.visualFlowchart.tierId;
    const tierDef = FLOWCHART_DEFINITIONS[tierId];
    const nodeDef = tierDef?.nodes?.[fromNodeId];
    const itemCount = nodeDef?.items?.length || 0;
    appState.visualFlowchart.choices[fromNodeId] = { 
        id: 'completed', 
        name: `All ${itemCount} principles reviewed ✓`
    };
    markStepCompleted(fromNodeId);
    showIntegratedNode(toNodeId, fromNodeId, 'continue');
}

// Toggle check all / uncheck all for a checklist node
function toggleCheckAll(nodeId) {
    const node = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (!node) return;
    
    const checkboxes = node.querySelectorAll('.checklist-item input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    const newState = !allChecked;
    
    checkboxes.forEach(cb => {
        cb.checked = newState;
    });
    
    // Update button label
    const btn = node.querySelector('.check-all-btn');
    if (btn) {
        const label = btn.querySelector('.check-all-label');
        if (label) {
            label.textContent = newState ? 'Uncheck All' : 'Check All';
        }
    }
    
    updateIntegratedChecklistProgress(nodeId);
}

// Proceed from info node
function proceedFromIntegratedInfo(fromNodeId, toNodeId) {
    // Store info acknowledgment in choices for summary
    const tierId = appState.visualFlowchart.tierId;
    const tierDef = FLOWCHART_DEFINITIONS[tierId];
    const nodeDef = tierDef?.nodes?.[fromNodeId];
    appState.visualFlowchart.choices[fromNodeId] = { 
        id: 'acknowledged', 
        name: nodeDef?.subtitle || 'Reviewed'
    };
    markStepCompleted(fromNodeId);
    showIntegratedNode(toNodeId, fromNodeId, 'continue');
}

// Select an option in selection node
function selectIntegratedOption(nodeId, optionId, optionName, handlerName) {
    // Store choice for summary; merge any pending pathway from fwSelectItem
    const pending = appState.visualFlowchart._pendingPathway;
    const pathway = (pending && pending.nodeId === nodeId) ? pending.pathway : undefined;
    appState.visualFlowchart.choices[nodeId] = pathway
        ? { id: optionId, name: optionName, pathway }
        : { id: optionId, name: optionName };
    
    markStepCompleted(nodeId);
    
    // Highlight selected option (handles both screener-pill-btn and selection-option)
    const node = document.querySelector(`[data-node-id="${CSS.escape(nodeId)}"]`);
    if (node) {
        // screener pill buttons
        node.querySelectorAll('.screener-pill-btn').forEach(opt => {
            opt.classList.add('screener-pill-other');
        });
        const selPill = Array.from(node.querySelectorAll('.screener-pill-btn'))
            .find(btn => btn.getAttribute('onclick')?.includes(CSS.escape(optionId)));
        if (selPill) {
            selPill.classList.add('screener-pill-selected');
            selPill.classList.remove('screener-pill-other');
        }
        // standard selection-option buttons
        node.querySelectorAll('.selection-option').forEach(opt => {
            opt.classList.add('option-disabled');
        });
        const selectedOption = node.querySelector(`.selection-option[onclick*="${CSS.escape(optionId)}"]`);
        if (selectedOption) {
            selectedOption.classList.add('option-selected');
            selectedOption.classList.remove('option-disabled');
        }
    }
    
    // Store selection in state
    appState.currentTierFlow = appState.currentTierFlow || {};
    appState.currentTierFlow[`${nodeId}_selection`] = { id: optionId, name: optionName };
    
    // Whitelist of allowed handler names for security
    const allowedHandlers = [
        'selectTier1ScreenerVisual', 'selectTier2AssessmentVisual', 'selectTier2InterventionVisual',
        'selectTier3AssessmentVisual', 'selectTier3InterventionVisual'
    ];
    
    // Call the handler only if it's in the allowed list
    if (allowedHandlers.includes(handlerName)) {
        if (window[handlerName + 'Integrated']) {
            window[handlerName + 'Integrated'](nodeId, optionId, optionName);
        } else if (window[handlerName]) {
            // Fallback to old handler if new one doesn't exist
            window[handlerName](nodeId, optionId, optionName);
        }
    }
}

// Make a decision in decision node
function makeIntegratedDecision(nodeId, choiceId, nextNodeId) {
    // Store choice for summary
    const node = document.querySelector(`[data-node-id="${CSS.escape(nodeId)}"]`);
    const choiceBtn = node?.querySelector(`.decision-btn[onclick*="${CSS.escape(choiceId)}"]`);
    const choiceLabel = choiceBtn?.querySelector('strong')?.textContent || choiceId;
    appState.visualFlowchart.choices[nodeId] = { id: choiceId, name: choiceLabel };
    
    markStepCompleted(nodeId);
    
    // Highlight selected choice
    if (node) {
        const choices = node.querySelectorAll('.decision-btn');
        choices.forEach(ch => {
            ch.classList.add('decision-disabled');
        });
        if (choiceBtn) {
            choiceBtn.classList.add('decision-selected');
            choiceBtn.classList.remove('decision-disabled');
        }
    }
    
    showIntegratedNode(nextNodeId, nodeId, choiceId);
}

// Mark a step as completed
function markStepCompleted(nodeId) {
    const node = document.querySelector(`.flowchart-step[data-node-id="${CSS.escape(nodeId)}"]`);
    if (node) {
        node.classList.add('step-completed');
        // Disable continue button if exists
        const btn = node.querySelector('.continue-btn');
        if (btn) btn.disabled = true;
    }
}

// Update journey chrome (back button visibility)
function updateCarouselNav() {
    const path = appState.visualFlowchart.selectedPath;
    const prevBtn = document.getElementById('carousel-prev-btn');
    if (prevBtn) {
        prevBtn.style.display = path.length > 1 ? '' : 'none';
    }
}

// Navigate to previous step in carousel
function goToPreviousStep() {
    const path = appState.visualFlowchart.selectedPath;
    if (path.length <= 1) return;
    
    // Remove current step from path
    path.pop();
    
    // Get the step we're going back to
    const targetStep = path[path.length - 1];
    
    // Delete the choice for this step (so they can re-make it)
    delete appState.visualFlowchart.choices[targetStep.nodeId];
    
    // Remove the target from path (showIntegratedNode will re-add it)
    path.pop();
    
    appState.visualFlowchart.currentNodeId = null;
    
    // Show the target node with back animation
    showIntegratedNode(targetStep.nodeId, targetStep.fromNodeId, null, 'back');
}

// Undo to a specific step (carousel mode)

function undoToStep(nodeId) {
    const pathIndex = appState.visualFlowchart.selectedPath.findIndex(step => step.nodeId === nodeId);
    
    if (pathIndex === -1) return;
    
    // If this is the current node, do nothing
    if (appState.visualFlowchart.currentNodeId === nodeId) return;
    
    // Truncate path to before the target step
    appState.visualFlowchart.selectedPath = appState.visualFlowchart.selectedPath.slice(0, pathIndex);
    
    // Remove choices from the target step onwards
    const remainingNodeIds = new Set(appState.visualFlowchart.selectedPath.map(s => s.nodeId));
    Object.keys(appState.visualFlowchart.choices).forEach(key => {
        if (!remainingNodeIds.has(key)) {
            delete appState.visualFlowchart.choices[key];
        }
    });
    
    appState.visualFlowchart.currentNodeId = null;
    
    // Get the from-node info for proper path tracking
    const prevStep = pathIndex > 0 ? appState.visualFlowchart.selectedPath[pathIndex - 1] : null;
    
    // Show the target node with back animation (this re-adds it to the path)
    showIntegratedNode(nodeId, prevStep?.nodeId || null, null, 'back');
}

// Switch to a different tier
function switchToTier(tierId) {
    // Update tab states
    document.querySelectorAll('.tier-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tier === tierId);
    });
    
    // Clear current flowchart content
    const stepsContainer = document.getElementById('flowchart-steps');
    if (stepsContainer) {
        stepsContainer.innerHTML = '';
    }
    
    // Reset state for new tier
    const flowchartDef = FLOWCHART_DEFINITIONS[tierId];
    if (!flowchartDef) return;
    
    appState.visualFlowchart = {
        nodes: [],
        connections: [],
        currentNodeId: null,
        selectedPath: [],
        tierId: tierId,
        choices: {},
        checklistProgress: {}
    };
    
    // Update the sticky bottom tier-name bar
    const tierNameEl = document.getElementById('flowchart-tier-name-value');
    if (tierNameEl) {
        tierNameEl.textContent = getTierName(flowchartDef.title);
    }
    
    // Reset carousel navigation
    const prevBtn = document.getElementById('carousel-prev-btn');
    if (prevBtn) prevBtn.style.display = 'none';
    
    // Apply the tier colour theme for the newly active tier
    applyTierTheme(tierId);

    // Show first node of new tier
    showIntegratedNode(flowchartDef.startNode, null);
}

// Save current tier state to the cross-tier full journey history
function saveCurrentTierToFullJourney() {
    const vf = appState.visualFlowchart;
    if (!appState.fullJourney) appState.fullJourney = [];
    appState.fullJourney.push({
        tierId: vf.tierId,
        selectedPath: vf.selectedPath.slice(),
        choices: Object.assign({}, vf.choices)
    });
}

// Show a simple endpoint card for tier-transition endpoints (no journey history)
function showTierTransitionChoice(nodeData) {
    const stepsContainer = getActiveStepTarget();
    if (!stepsContainer) return;

    const actionFnMap = {
        startTier2Visual: 'startTier2VisualIntegrated',
        startTier3Visual: 'startTier3VisualIntegrated',
        restartTier2Visual: 'restartTier2VisualIntegrated'
    };

    let actionsHTML = '';
    if (nodeData.actionButton && actionFnMap[nodeData.actionButton.action]) {
        const fnName = actionFnMap[nodeData.actionButton.action];
        actionsHTML += `<button class="action-btn action-primary" onclick="${fnName}()">${nodeData.actionButton.text}</button>`;
    }
    if (nodeData.secondaryAction && actionFnMap[nodeData.secondaryAction.action]) {
        const fnName = actionFnMap[nodeData.secondaryAction.action];
        actionsHTML += `<button class="action-btn action-secondary" onclick="${fnName}()">${nodeData.secondaryAction.text}</button>`;
    }
    actionsHTML += `<button class="action-btn action-secondary" onclick="goToPreviousStep()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Go Back
    </button>`;

    const recommendationsHTML = nodeData.recommendations ? `
        <div class="recommendations-box">
            <h4>Recommendations</h4>
            <ul>${nodeData.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
        </div>
    ` : '';

    const warningBoxHTML = nodeData.warningBox ? `
        <div class="warning-callout">
            ${ICONS.warning}
            <div><h4>${nodeData.warningBox.title}</h4><p>${nodeData.warningBox.text}</p></div>
        </div>
    ` : '';

    const statusClasses = { success: 'journey-endpoint-success', info: 'journey-endpoint-info', warning: 'journey-endpoint-warning', danger: 'journey-endpoint-danger' };
    const statusClass = statusClasses[nodeData.status] || 'journey-endpoint-info';

    stepsContainer.innerHTML = `
        <div class="journey-review">
            <div class="journey-flow">
                <div class="journey-endpoint ${statusClass}">
                    <div class="journey-endpoint-icon">${ICONS[nodeData.status] || ICONS.info}</div>
                    <h3>${nodeData.title}</h3>
                    <p>${nodeData.description || ''}</p>
                    ${warningBoxHTML}
                    ${recommendationsHTML}
                </div>
            </div>
            <div class="journey-actions">${actionsHTML}</div>
        </div>
    `;

    const prevBtn = document.getElementById('carousel-prev-btn');
    if (prevBtn) prevBtn.style.display = 'none';
    completeJourneyMap('Tier complete');
    requestAnimationFrame(() => {
        const review = stepsContainer.querySelector('.journey-review');
        if (review) review.classList.add('journey-review-visible');
    });
    scrollToActiveStep();
}

// Per-node plain-language summary lookup. Keys are node IDs; for decision nodes
// the value is an object keyed by choice outcome ('effective'/'ineffective'/etc.).
const NODE_SUMMARIES = {
    // ── Tier 1 ──
    'tier1-principles': {
        text: 'You confirmed that classroom instruction follows the principles of explicit and systematic teaching — the foundation is solid! 📚',
        variant: 'step1'
    },
    'tier1-screener': {
        text: (choice) => `You administered the ${choice || 'literacy screener'} to measure where students are right now. Time to look at the data! 📊`,
        variant: 'selection'
    },
    'tier1-effectiveness': {
        effective:   { text: 'The literacy screener came back Blue or Green — this student is on track and instruction is working! 🎉', variant: 'effective' },
        ineffective: { text: 'The literacy screener showed Yellow or Red — instruction needs some adjustment for this student. 📋', variant: 'ineffective' }
    },
    'tier1-percentage': {
        'more-20':   { text: 'More than 20% of students aren\'t at benchmark — this points to a whole-class instructional gap. Time to look at Tier 2 supports! 📊', variant: 'ineffective' },
        'less-20':   { text: 'Fewer than 20% of students need extra help — targeted reteaching for a small group is the next step! 🔄', variant: 'ineffective' }
    },

    // ── Tier 2 ──
    'tier2-principles': {
        text: 'You ruled out vision, hearing, attendance, language, and other barriers — the student is ready for focused Tier 2 intervention! ✅',
        variant: 'step1'
    },
    'tier2-assessment': {
        text: (choice) => `You selected ${choice || 'a drill-down assessment'} to pinpoint exactly which literacy skills need the most support. 🔍`,
        variant: 'selection'
    },
    'tier2-intervention': {
        text: (choice) => `You chose ${choice || 'an intervention program'} for the 8-week intervention cycle — the focused, small-group work begins! 💪`,
        variant: 'selection'
    },
    'tier2-progress': {
        effective:        { text: 'After the 8-week cycle, the screener came back Blue or Green — the intervention worked! What a great result! 🌟', variant: 'effective' },
        'no-improvement': { text: 'After 8 weeks, the results still show Yellow or Red — the student needs another cycle before we reassess. 📋', variant: 'ineffective' }
    },
    'tier2-cycle2-assessment': {
        text: (choice) => `You selected ${choice || 'a drill-down assessment'} for the second cycle — let\'s get an even clearer picture. 🔍`,
        variant: 'selection'
    },
    'tier2-cycle2-intervention': {
        text: (choice) => `You chose ${choice || 'an intervention program'} for the second 8-week cycle — adjusted and ready to go! 💪`,
        variant: 'selection'
    },
    'tier2-cycle2-progress': {
        effective:        { text: 'The second intervention cycle paid off — the student\'s results are now Blue or Green! Time to consider fading back to Tier 1. 🎉', variant: 'effective' },
        'no-improvement': { text: 'After two full cycles, the student needs more intensive, personalized support — moving on to Tier 3. 📋', variant: 'ineffective' }
    },

    // ── Tier 3 ──
    'tier3-intro': {
        text: 'You reviewed the Tier 3 entry criteria and confirmed this student meets the requirements for intensive, personalized intervention. 📋',
        variant: 'step1'
    },
    'tier3-assessment': {
        text: (choice) => `You selected ${choice || 'a drill-down assessment'} to guide the individualized Tier 3 intervention plan. 🔍`,
        variant: 'selection'
    },
    'tier3-intervention': {
        text: (choice) => `You chose ${choice || 'an intensive intervention program'} for personalized, small-group Tier 3 sessions — every minute counts! 💪`,
        variant: 'selection'
    },
    'tier3-progress': {
        effective:        { text: 'Tier 3 interventions are making a real difference — the student\'s results are now Blue or Green! Let\'s discuss next steps. 🌟', variant: 'effective' },
        'no-improvement': { text: 'The student needs continued Tier 3 support and a closer look with specialists. The team is here for them! 📋', variant: 'ineffective' }
    }
};

// Resolve a choice outcome key from a raw choice object
function resolveChoiceOutcomeKey(choice) {
    if (!choice) return null;
    const id = (choice.id || '').toLowerCase();
    const name = (choice.name || '').toLowerCase();
    if (id.includes('effective') || id.includes('success') || id.includes('improved') ||
        name.includes('effective') || name.includes('success') || name.includes('blue') || name.includes('green')) {
        return 'effective';
    }
    if (id.includes('ineffective') || id.includes('no-improvement') || id.includes('unsuccess') ||
        name.includes('ineffective') || name.includes('unsuccess') || name.includes('yellow') || name.includes('red')) {
        return 'ineffective';
    }
    return id || null;
}

// Build a plain-language sentence for each step in the journey animation
function buildAnimStepBubble(nodeDef, choice) {
    const type = nodeDef.type;
    const nodeId = nodeDef.id || '';
    let label = 'Step summary';
    let mainText = '';
    let subText = '';
    let iconSVG = getStepTypeIcon(type);
    let variant = '';
    const typeClass = type ? ` anim-step-type-${type}` : '';
    const normalizeChoiceName = (raw) => (raw || '').replace(/^Option\s+[A-Z0-9]+\s*:\s*/i, '').trim();
    const chosenName = normalizeChoiceName(choice?.name || choice?.label || '');

    // Look up rich summary for this specific node
    const nodeSummary = NODE_SUMMARIES[nodeId];

    if (nodeSummary) {
        if (type === 'decision' && choice) {
            // Decision nodes have per-outcome sub-objects
            const outcomeKey = resolveChoiceOutcomeKey(choice);
            const outcomeSummary = nodeSummary[outcomeKey] || nodeSummary[choice.id] || null;
            if (outcomeSummary) {
                mainText = outcomeSummary.text;
                variant = outcomeSummary.variant || '';
            }
        } else if (typeof nodeSummary.text === 'function') {
            mainText = nodeSummary.text(chosenName);
            variant = nodeSummary.variant || '';
        } else if (nodeSummary.text) {
            mainText = nodeSummary.text;
            variant = nodeSummary.variant || '';
        }
    }

    // Fall back to journeySummary / generic text if no lookup hit
    if (!mainText) {
        if (type === 'checklist') {
            mainText = nodeDef.journeySummary || `You completed the checklist "${nodeDef.subtitle || nodeDef.title}" and confirmed everything is in order.`;
            variant = variant || 'step1';
            subText = nodeDef.reviewHint || 'You can reopen this step from the process map to review details.';
        } else if (type === 'info') {
            mainText = nodeDef.journeySummary || `You reviewed the entry information for this stage and are ready to proceed.`;
            variant = variant || 'step1';
            subText = nodeDef.reviewHint || 'You can reopen this step from the process map to review details.';
        } else if (type === 'selection') {
            mainText = nodeDef.journeySummary
                ? nodeDef.journeySummary.replace('{choice}', chosenName || 'your selected option')
                : `You selected ${chosenName || 'an option'} — a great choice to guide the next steps!`;
            variant = variant || 'selection';
        } else if (type === 'decision') {
            if (choice) {
                mainText = nodeDef.journeySummary
                    ? nodeDef.journeySummary.replace('{choice}', chosenName || 'your decision')
                    : `Based on the results, you determined: ${chosenName || 'the next action'}.`;
                // Colour-code by the choice if variant not already set
                if (!variant) {
                    const id = (choice.id || '').toLowerCase();
                    const name = (choice.name || '').toLowerCase();
                    if (id.includes('effective') || id.includes('success') || name.includes('effective') || name.includes('success') || name.includes('blue') || name.includes('green')) {
                        variant = 'effective';
                    } else if (id.includes('ineffective') || id.includes('unsuccess') || name.includes('ineffective') || name.includes('unsuccess') || name.includes('yellow') || name.includes('red') || name.includes('20%') || name.includes('20 %')) {
                        variant = 'ineffective';
                    }
                }
            } else {
                mainText = nodeDef.journeySummary || `You completed this decision step: ${nodeDef.title}.`;
            }
            subText = nodeDef.reviewHint || '';
        } else {
            mainText = nodeDef.journeySummary || `You completed this step: ${nodeDef.title}.`;
        }
    }

    return `
        <div class="anim-step-bubble${typeClass}${variant ? ' anim-bubble-' + variant : ''}">
            <div class="anim-step-bubble-icon">${iconSVG}</div>
            <div class="anim-step-bubble-text">
                <div class="anim-step-bubble-label">${escapeHtml(label)}</div>
                <div class="anim-step-bubble-main">${escapeHtml(mainText)}</div>
                ${subText && subText !== mainText ? `<div class="anim-step-bubble-sub">${escapeHtml(subText)}</div>` : ''}
            </div>
        </div>`;
}

// Show the complete cross-tier journey summary at a true terminal endpoint
function showFinalSummary(endpointNodeData) {
    const stepsContainer = getActiveStepTarget();
    if (!stepsContainer) return;

    const fullJourney = appState.fullJourney || [];

    // ── Collect all animation items (tier badges, step bubbles, connectors, endpoint) ──
    // Each item is { html, isConnector }
    const items = [];

    fullJourney.forEach((tierSnapshot, tierIndex) => {
        const tierDef = FLOWCHART_DEFINITIONS[tierSnapshot.tierId];
        if (!tierDef) return;

        const tierLabel = tierDef.title || tierSnapshot.tierId;

        // Tier badge
        if (tierIndex > 0) {
            items.push({ html: `<div class="anim-connector"><div class="anim-connector-line"></div><div class="anim-connector-arrow"></div></div>`, isConnector: true });
        }
        items.push({
            html: `<div class="anim-tier-badge"><span class="anim-tier-badge-inner">${escapeHtml(tierLabel.split(':')[0].trim())}</span></div>`,
            isConnector: false
        });

        tierSnapshot.selectedPath.forEach((step, stepIndex) => {
            const nodeDef = tierDef.nodes[step.nodeId];
            if (!nodeDef) return;

            const choice = tierSnapshot.choices[step.nodeId];
            const isEndpoint = nodeDef.type === 'endpoint';

            // Connector between steps
            if (stepIndex > 0) {
                items.push({ html: `<div class="anim-connector"><div class="anim-connector-line"></div><div class="anim-connector-arrow"></div></div>`, isConnector: true });
            }

            if (isEndpoint) {
                const isNeg = nodeDef.status === 'warning' || nodeDef.status === 'danger';
                const endIcon = isNeg ? ICONS.warning : ICONS.success;
                items.push({
                    html: `<div class="anim-endpoint-card${isNeg ? ' anim-endpoint-ineffective' : ''}">
                        <div class="anim-endpoint-icon">${endIcon}</div>
                        <div class="anim-endpoint-title">${escapeHtml(nodeDef.title)}</div>
                        <div class="anim-endpoint-desc">${escapeHtml(nodeDef.description || '')}</div>
                    </div>`,
                    isConnector: false
                });
            } else {
                items.push({ html: buildAnimStepBubble(nodeDef, choice), isConnector: false });
            }
        });
    });

    // ── Build action buttons ──
    let actionsHTML = '';
    const actionFnMap = { restartTier1Visual: 'restartTier1VisualIntegrated' };
    if (endpointNodeData?.actionButton && actionFnMap[endpointNodeData.actionButton.action]) {
        const fnName = actionFnMap[endpointNodeData.actionButton.action];
        actionsHTML += `<button class="action-btn action-primary" onclick="${fnName}()">${endpointNodeData.actionButton.text}</button>`;
    }
    actionsHTML += `<button class="action-btn action-secondary" onclick="restartCurrentTier()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
            <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
        </svg>
        Start Over
    </button>
    <button class="action-btn action-primary" onclick="closeIntegratedFlowchart()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        Done
    </button>`;

    // ── Render skeleton; all items hidden, to be revealed in sequence ──
    const itemsHTML = items.map((item, i) =>
        `<div class="anim-journey-item" data-anim-idx="${i}">${item.html}</div>`
    ).join('');

    stepsContainer.innerHTML = `
        <div class="journey-review">
            <div class="journey-review-header">
                <h2>Your Complete Journey</h2>
                <p>A summary of your full intervention pathway</p>
            </div>
            <button class="anim-skip-btn" onclick="revealAllAnimJourneyItems(this)" aria-label="Skip animation">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
                Skip animation
            </button>
            <div class="anim-journey-summary journey-flow">${itemsHTML}</div>
            <div class="journey-actions" id="anim-journey-actions" style="display:none;">${actionsHTML}</div>
        </div>
    `;

    const prevBtn = document.getElementById('carousel-prev-btn');
    if (prevBtn) prevBtn.style.display = 'none';
    completeJourneyMap();
    requestAnimationFrame(() => {
        const review = stepsContainer.querySelector('.journey-review');
        if (review) review.classList.add('journey-review-visible');
    });
    scrollToActiveStep();

    // ── Staggered reveal ──
    const STEP_DELAY = 420;    // ms between each non-connector item
    const CONN_DELAY = 180;    // ms for connector line
    const allItems = stepsContainer.querySelectorAll('.anim-journey-item');
    let timeout = 320; // initial delay before first item appears

    allItems.forEach((el, i) => {
        const isConnector = el.querySelector('.anim-connector') !== null;
        const delay = isConnector ? CONN_DELAY : STEP_DELAY;
        setTimeout(() => {
            el.classList.add('anim-visible');
            // Also trigger the inner connector line animation
            const line = el.querySelector('.anim-connector-line');
            const connector = el.querySelector('.anim-connector');
            if (line) line.classList.add('anim-visible');
            if (connector) connector.classList.add('anim-visible');
            // If this is the last item, reveal actions
            if (i === allItems.length - 1) {
                setTimeout(() => {
                    const actions = stepsContainer.querySelector('#anim-journey-actions');
                    if (actions) {
                        actions.style.display = '';
                        actions.style.opacity = '0';
                        actions.style.transition = 'opacity 0.4s ease';
                        requestAnimationFrame(() => { actions.style.opacity = '1'; });
                    }
                    // Hide skip button once done
                    const skipBtn = stepsContainer.querySelector('.anim-skip-btn');
                    if (skipBtn) skipBtn.style.display = 'none';
                }, 350);
            }
        }, timeout);
        timeout += delay;
    });
}

// Immediately reveal all animation items (called by "Skip animation" button)
function revealAllAnimJourneyItems(btn) {
    const container = btn?.closest('.journey-review');
    if (!container) return;
    btn.style.display = 'none';
    container.querySelectorAll('.anim-journey-item').forEach(el => {
        el.classList.add('anim-visible');
        const line = el.querySelector('.anim-connector-line');
        const connector = el.querySelector('.anim-connector');
        if (line) line.classList.add('anim-visible');
        if (connector) connector.classList.add('anim-visible');
    });
    const actions = container.querySelector('#anim-journey-actions');
    if (actions) { actions.style.display = ''; actions.style.opacity = '1'; }
}

// Restart current tier
function restartCurrentTier() {
    initIntegratedFlowchart('tier1');
}

// Close integrated flowchart
function closeIntegratedFlowchart() {
    // Restart the flowchart from Tier 1
    initIntegratedFlowchart('tier1');
}

// Integrated tier transition handlers
function startTier2VisualIntegrated() {
    showGoToTierStep('tier2');
}

function startTier3VisualIntegrated() {
    showGoToTierStep('tier3');
}

function restartTier1VisualIntegrated() {
    appState.fullJourney = [];
    switchToTier('tier1');
}

function restartTier2VisualIntegrated() {
    switchToTier('tier2');
}

// Handler functions for integrated tier 1
function selectTier1ScreenerVisualIntegrated(nodeId, screenerId, screenerName) {
    appState.currentTierFlow = appState.currentTierFlow || {};
    appState.currentTierFlow.screener = screenerId;
    appState.currentTierFlow.screenerName = screenerName;

    // Remember the chosen screener so the user is never forced to re-select it
    // in later tiers, drill-downs, interventions, or the interventions menu.
    setRememberedScreener(screenerName || screenerId);

    showIntegratedNode('tier1-effectiveness', nodeId, screenerId);
}

// Handler functions for integrated tier 2
function selectTier2AssessmentVisualIntegrated(nodeId, assessmentId, assessmentName) {
    appState.currentTierFlow = appState.currentTierFlow || {};
    appState.currentTierFlow.assessment = assessmentId;
    appState.currentTierFlow.assessmentName = assessmentName;
    
    const nextNode = nodeId === 'tier2-cycle2-assessment' ? 'tier2-cycle2-intervention' : 'tier2-intervention';
    showIntegratedNode(nextNode, nodeId, assessmentId);
}

function selectTier2InterventionVisualIntegrated(nodeId, interventionId, interventionName) {
    appState.currentTierFlow = appState.currentTierFlow || {};
    appState.currentTierFlow.intervention = interventionId;
    appState.currentTierFlow.interventionName = interventionName;
    
    const nextNode = nodeId === 'tier2-cycle2-intervention' ? 'tier2-cycle2-progress' : 'tier2-progress';
    showIntegratedNode(nextNode, nodeId, interventionId);
}

// Handler functions for integrated tier 3
function selectTier3AssessmentVisualIntegrated(nodeId, assessmentId, assessmentName) {
    appState.currentTierFlow = appState.currentTierFlow || {};
    appState.currentTierFlow.assessment = assessmentId;
    appState.currentTierFlow.assessmentName = assessmentName;
    
    showIntegratedNode('tier3-intervention', nodeId, assessmentId);
}

function selectTier3InterventionVisualIntegrated(nodeId, interventionId, interventionName) {
    appState.currentTierFlow = appState.currentTierFlow || {};
    appState.currentTierFlow.intervention = interventionId;
    appState.currentTierFlow.interventionName = interventionName;
    
    showIntegratedNode('tier3-progress', nodeId, interventionId);
}

// Initialize the visual flowchart (legacy - kept for backwards compatibility)
function initVisualFlowchart(tierId) {
    // Redirect to integrated flowchart
    initIntegratedFlowchart(tierId);
}

// Show a flowchart node with animation
function showFlowchartNode(nodeId, fromNodeId, choiceId = null) {
    const tierId = appState.visualFlowchart.tierId;
    const flowchartDef = FLOWCHART_DEFINITIONS[tierId];
    const nodeData = flowchartDef.nodes[nodeId];
    
    if (!nodeData) {
        console.error(`Node ${nodeId} not found in tier ${tierId}`);
        return;
    }
    
    const nodesContainer = document.getElementById('vf-nodes');
    const connectionsContainer = document.getElementById('vf-connections');
    
    // Add to path
    appState.visualFlowchart.selectedPath.push({ nodeId, fromNodeId, choiceId });
    appState.visualFlowchart.currentNodeId = nodeId;
    
    // Update progress indicator
    updateProgressIndicator();
    
    // If there's a source node, draw a connection line first
    if (fromNodeId) {
        drawConnectionLine(fromNodeId, nodeId, choiceId, () => {
            // After line animation completes, show the new node
            createNodeElement(nodeData, nodesContainer);
            scrollToNode(nodeId);
        });
    } else {
        // No source node, just show the first node
        createNodeElement(nodeData, nodesContainer);
    }
}

// Draw animated connection line between nodes
function drawConnectionLine(fromNodeId, toNodeId, choiceId, onComplete) {
    const connectionsContainer = document.getElementById('vf-connections');
    const fromNode = document.querySelector(`[data-node-id="${fromNodeId}"]`);
    
    if (!fromNode || !connectionsContainer) {
        if (onComplete) onComplete();
        return;
    }
    
    // Create a placeholder for the target node position
    const nodesContainer = document.getElementById('vf-nodes');
    const existingNodes = nodesContainer.querySelectorAll('.vf-node');
    const lastNode = existingNodes[existingNodes.length - 1];
    
    // Calculate positions
    const containerRect = connectionsContainer.getBoundingClientRect();
    const fromRect = fromNode.getBoundingClientRect();
    
    // Start point (right center of from node)
    const startX = fromRect.right - containerRect.left;
    const startY = fromRect.top + fromRect.height / 2 - containerRect.top;
    
    // End point (estimated - will be left center of the new node)
    const endX = startX + VF_CONSTANTS.CONNECTION_DISTANCE;
    const endY = startY;
    
    // Create SVG path
    const pathId = `path-${fromNodeId}-${toNodeId}`;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Store connection metadata for repositioning
    path.setAttribute('data-from-node', fromNodeId);
    path.setAttribute('data-to-node', toNodeId);
    
    // Create a curved path
    const controlPointOffset = VF_CONSTANTS.BEZIER_CONTROL_OFFSET;
    const d = `M ${startX} ${startY} C ${startX + controlPointOffset} ${startY} ${endX - controlPointOffset} ${endY} ${endX} ${endY}`;
    
    path.setAttribute('id', pathId);
    path.setAttribute('d', d);
    path.setAttribute('class', `vf-connection-path ${choiceId ? `choice-${choiceId}` : ''}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '2');
    
    // Set up animation
    const pathLength = path.getTotalLength ? path.getTotalLength() : VF_CONSTANTS.PATH_LENGTH_FALLBACK;
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;
    
    connectionsContainer.appendChild(path);
    
    // Animate the line drawing
    requestAnimationFrame(() => {
        path.style.transition = 'stroke-dashoffset 0.25s ease-out';
        path.style.strokeDashoffset = '0';
    });
    
    // Add a moving dot animation
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('r', '4');
    dot.setAttribute('class', 'vf-connection-dot');
    connectionsContainer.appendChild(dot);
    
    // Animate dot along the path
    let progress = 0;
    let nodeShown = false;
    const animateDot = () => {
        progress += VF_CONSTANTS.ANIMATION_PROGRESS_INCREMENT;
        
        // Show the new node when we're halfway through the animation
        if (!nodeShown && progress >= 0.5 && onComplete) {
            nodeShown = true;
            onComplete();
        }
        
        if (progress <= 1) {
            const point = getPointOnPath(startX, startY, endX, endY, progress, controlPointOffset);
            dot.setAttribute('cx', point.x);
            dot.setAttribute('cy', point.y);
            requestAnimationFrame(animateDot);
        } else {
            dot.remove();
            // Call onComplete if it wasn't called yet (shouldn't happen with progress >= 0.5 check)
            if (!nodeShown && onComplete) {
                onComplete();
            }
        }
    };
    
    requestAnimationFrame(animateDot);
}

// Get point on cubic bezier curve
function getPointOnPath(x1, y1, x2, y2, t, offset) {
    // Simplified bezier calculation for horizontal path
    const cx1 = x1 + offset;
    const cy1 = y1;
    const cx2 = x2 - offset;
    const cy2 = y2;
    
    const t2 = t * t;
    const t3 = t2 * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    
    return {
        x: mt3 * x1 + 3 * mt2 * t * cx1 + 3 * mt * t2 * cx2 + t3 * x2,
        y: mt3 * y1 + 3 * mt2 * t * cy1 + 3 * mt * t2 * cy2 + t3 * y2
    };
}

// Update all connection line positions (called on resize)
function updateConnectionLinePositions() {
    const connectionsContainer = document.getElementById('vf-connections');
    if (!connectionsContainer) return;
    
    const paths = connectionsContainer.querySelectorAll('.vf-connection-path');
    const containerRect = connectionsContainer.getBoundingClientRect();
    
    paths.forEach(path => {
        const fromNodeId = path.getAttribute('data-from-node');
        const toNodeId = path.getAttribute('data-to-node');
        
        if (!fromNodeId || !toNodeId) return;
        
        const fromNode = document.querySelector(`[data-node-id="${fromNodeId}"]`);
        const toNode = document.querySelector(`[data-node-id="${toNodeId}"]`);
        
        if (!fromNode || !toNode) return;
        
        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();
        
        // Calculate new positions
        const startX = fromRect.right - containerRect.left;
        const startY = fromRect.top + fromRect.height / 2 - containerRect.top;
        const endX = toRect.left - containerRect.left;
        const endY = toRect.top + toRect.height / 2 - containerRect.top;
        
        // Update path
        const controlPointOffset = VF_CONSTANTS.BEZIER_CONTROL_OFFSET;
        const d = `M ${startX} ${startY} C ${startX + controlPointOffset} ${startY} ${endX - controlPointOffset} ${endY} ${endX} ${endY}`;
        
        path.setAttribute('d', d);
    });
}

// Create node element based on type
function createNodeElement(nodeData, container) {
    const nodeElement = document.createElement('div');
    nodeElement.className = `vf-node vf-node-${nodeData.type}`;
    nodeElement.setAttribute('data-node-id', nodeData.id);
    
    let content = '';
    
    switch (nodeData.type) {
        case 'checklist':
            content = createChecklistNode(nodeData);
            break;
        case 'selection':
            content = createSelectionNode(nodeData);
            break;
        case 'decision':
            content = createDecisionNode(nodeData);
            break;
        case 'info':
            content = createInfoNode(nodeData);
            break;
        case 'endpoint':
            content = createEndpointNode(nodeData);
            break;
        default:
            content = `<div class="vf-node-content"><h3>${nodeData.title}</h3></div>`;
    }
    
    nodeElement.innerHTML = content;
    container.appendChild(nodeElement);
    
    // Trigger entrance animation
    requestAnimationFrame(() => {
        nodeElement.classList.add('vf-node-visible');
    });
    
    // Initialize any interactive elements
    initNodeInteractions(nodeData);
}

// Create checklist node HTML
function createChecklistNode(nodeData) {
    const checklistItems = nodeData.items.map((item, index) => `
        <label class="vf-checklist-item" data-index="${index}">
            <input type="checkbox" onchange="updateChecklistProgress('${nodeData.id}')">
            <span class="vf-checkbox-custom"></span>
            <span class="vf-checkbox-label">${item}</span>
        </label>
    `).join('');
    
    return `
        <div class="vf-node-header">
            <div class="vf-node-step-badge"><span class="step-badge-icon">${getStepTypeIcon(nodeData.type)}</span>${nodeData.title}</div>
        </div>
        <div class="vf-node-content">
            <h3>${nodeData.subtitle}</h3>
            <p>${nodeData.description}</p>
            <div class="vf-checklist">
                ${checklistItems}
            </div>
            <button class="vf-continue-btn" disabled onclick="proceedFromChecklist('${nodeData.id}', '${nodeData.nextNode}')">
                ${nodeData.buttonText}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
    `;
}

// Create selection node HTML
function createSelectionNode(nodeData) {
    const tierId = appState.visualFlowchart.tierId;
    const tierData = appState.tierFlowchartData?.[tierId];
    const options = tierData?.[nodeData.options] || [];
    
    const optionsHTML = options.map(option => `
        <button class="vf-selection-option" onclick="selectFlowchartOption('${nodeData.id}', '${option.id}', '${option.name}', '${nodeData.nextHandler}')">
            <div class="vf-option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    <path d="M9 12l2 2 4-4"/>
                </svg>
            </div>
            <div class="vf-option-content">
                <h4>${option.name}</h4>
                <p>${option.description}</p>
                ${option.administrationTime ? `<span class="vf-option-meta">Time: ${option.administrationTime}</span>` : ''}
                ${option.duration ? `<span class="vf-option-meta">${option.duration} • ${option.frequency}</span>` : ''}
            </div>
            <div class="vf-option-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </div>
        </button>
    `).join('');
    
    const infoBoxHTML = nodeData.infoBox ? `
        <div class="vf-info-box">
            ${ICONS.info}
            <div>
                <h4>${nodeData.infoBox.title}</h4>
                ${nodeData.infoBox.text ? `<p>${nodeData.infoBox.text}</p>` : ''}
                ${nodeData.infoBox.items ? `<ul>${nodeData.infoBox.items.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
            </div>
        </div>
    ` : '';
    
    const warningBoxHTML = nodeData.warningBox ? `
        <div class="vf-warning-box">
            ${ICONS.warning}
            <div>
                <h4>${nodeData.warningBox.title}</h4>
                <p>${nodeData.warningBox.text}</p>
            </div>
        </div>
    ` : '';
    
    return `
        <div class="vf-node-header">
            <div class="vf-node-step-badge"><span class="step-badge-icon">${getStepTypeIcon(nodeData.type)}</span>${nodeData.title}</div>
        </div>
        <div class="vf-node-content">
            <h3>${nodeData.subtitle}</h3>
            <p>${nodeData.description}</p>
            ${infoBoxHTML}
            ${warningBoxHTML}
            <div class="vf-selection-grid">
                ${optionsHTML}
            </div>
        </div>
    `;
}

// Create decision node HTML
function createDecisionNode(nodeData) {
    const choicesHTML = nodeData.choices.map(choice => `
        <button class="vf-decision-btn vf-decision-${choice.type}" onclick="makeDecision('${nodeData.id}', '${choice.id}', '${choice.nextNode}')">
            <div class="vf-decision-icon">
                ${choice.type === 'success' ? ICONS.checkmark : choice.type === 'warning' ? ICONS.warning : ICONS.info}
            </div>
            <div class="vf-decision-content">
                <strong>${choice.label}</strong>
                <span>${choice.sublabel}</span>
            </div>
        </button>
    `).join('');
    
    const infoBoxHTML = nodeData.infoBox ? `
        <div class="vf-info-box">
            ${ICONS.info}
            <div>
                <h4>${nodeData.infoBox.title}</h4>
                ${nodeData.infoBox.text ? `<p>${nodeData.infoBox.text}</p>` : ''}
                ${nodeData.infoBox.items ? `<ul>${nodeData.infoBox.items.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
            </div>
        </div>
    ` : '';
    
    const warningBoxHTML = nodeData.warningBox ? `
        <div class="vf-warning-box">
            ${ICONS.warning}
            <div>
                <h4>${nodeData.warningBox.title}</h4>
                <p>${nodeData.warningBox.text}</p>
            </div>
        </div>
    ` : '';
    
    return `
        <div class="vf-node-header">
            <div class="vf-node-step-badge"><span class="step-badge-icon">${getStepTypeIcon(nodeData.type)}</span>${nodeData.title}</div>
        </div>
        <div class="vf-node-content">
            <h3>${nodeData.subtitle}</h3>
            <p>${nodeData.description}</p>
            ${warningBoxHTML}
            ${infoBoxHTML}
            <div class="vf-decision-grid">
                ${choicesHTML}
            </div>
        </div>
    `;
}

// Create info node HTML
function createInfoNode(nodeData) {
    const featuresHTML = nodeData.features ? `
        <ul class="vf-feature-list">
            ${nodeData.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
    ` : '';
    
    const warningBoxHTML = nodeData.warningBox ? `
        <div class="vf-warning-box">
            ${ICONS.warning}
            <div>
                <h4>${nodeData.warningBox.title}</h4>
                <p>${nodeData.warningBox.text}</p>
            </div>
        </div>
    ` : '';
    
    const featuresHeading = nodeData.featuresTitle || 'Key Characteristics';
    
    return `
        <div class="vf-node-header">
            <div class="vf-node-step-badge"><span class="step-badge-icon">${getStepTypeIcon(nodeData.type)}</span>${nodeData.title}</div>
        </div>
        <div class="vf-node-content">
            <h3>${nodeData.subtitle}</h3>
            ${warningBoxHTML}
            ${nodeData.features ? `<h4>${featuresHeading}</h4>` : ''}
            ${featuresHTML}
            <button class="vf-continue-btn" onclick="proceedFromInfo('${nodeData.id}', '${nodeData.nextNode}')">
                ${nodeData.buttonText}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
    `;
}

// Create endpoint node HTML
function createEndpointNode(nodeData) {
    const recommendationsHTML = nodeData.recommendations ? `
        <div class="vf-recommendations">
            <h4>Next Steps:</h4>
            <ul>
                ${nodeData.recommendations.map(r => `<li>${r}</li>`).join('')}
            </ul>
        </div>
    ` : '';
    
    const warningBoxHTML = nodeData.warningBox ? `
        <div class="vf-warning-box">
            ${ICONS.warning}
            <div>
                <h4>${nodeData.warningBox.title}</h4>
                <p>${nodeData.warningBox.text}</p>
            </div>
        </div>
    ` : '';
    
    const actionButtonHTML = nodeData.actionButton ? `
        <button class="vf-action-btn vf-action-primary" onclick="${nodeData.actionButton.action}()">
            ${nodeData.actionButton.text}
        </button>
    ` : '';
    
    const secondaryActionHTML = nodeData.secondaryAction ? `
        <button class="vf-action-btn vf-action-secondary" onclick="${nodeData.secondaryAction.action}()">
            ${nodeData.secondaryAction.text}
        </button>
    ` : '';
    
    return `
        <div class="vf-endpoint vf-endpoint-${nodeData.status}">
            <div class="vf-endpoint-icon">
                ${ICONS[nodeData.status] || ICONS.info}
            </div>
            <h2>${nodeData.title}</h2>
            <p>${nodeData.description}</p>
            ${warningBoxHTML}
            ${recommendationsHTML}
            <div class="vf-endpoint-actions">
                ${actionButtonHTML}
                ${secondaryActionHTML}
                <button class="vf-action-btn vf-action-close" onclick="closeVisualFlowchart()">
                    Return to Interventions
                </button>
            </div>
        </div>
    `;
}

// Initialize node interactions
function initNodeInteractions(nodeData) {
    // Any additional initialization needed for node interactions
}

// Update checklist progress
function updateChecklistProgress(nodeId) {
    const node = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (!node) return;
    
    const checkboxes = node.querySelectorAll('.vf-checklist-item input[type="checkbox"]');
    const continueBtn = node.querySelector('.vf-continue-btn');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    if (continueBtn) {
        continueBtn.disabled = !allChecked;
        if (allChecked) {
            continueBtn.classList.add('vf-btn-ready');
        } else {
            continueBtn.classList.remove('vf-btn-ready');
        }
    }
    
    // Add visual feedback to checked items
    checkboxes.forEach((checkbox, index) => {
        const item = checkbox.closest('.vf-checklist-item');
        if (checkbox.checked) {
            item.classList.add('checked');
        } else {
            item.classList.remove('checked');
        }
    });
}

// Proceed from checklist node
function proceedFromChecklist(fromNodeId, toNodeId) {
    // Mark the from node as completed
    const fromNode = document.querySelector(`[data-node-id="${fromNodeId}"]`);
    if (fromNode) {
        fromNode.classList.add('vf-node-completed');
        // Add click handler to return to this step
        fromNode.addEventListener('click', () => returnToStep(fromNodeId));
        // Disable interactions on completed node
        const btn = fromNode.querySelector('.vf-continue-btn');
        if (btn) btn.disabled = true;
    }
    
    // Show next node with connection line
    showFlowchartNode(toNodeId, fromNodeId, 'continue');
}

// Proceed from info node
function proceedFromInfo(fromNodeId, toNodeId) {
    const fromNode = document.querySelector(`[data-node-id="${fromNodeId}"]`);
    if (fromNode) {
        fromNode.classList.add('vf-node-completed');
        // Add click handler to return to this step
        fromNode.addEventListener('click', () => returnToStep(fromNodeId));
        const btn = fromNode.querySelector('.vf-continue-btn');
        if (btn) btn.disabled = true;
    }
    
    showFlowchartNode(toNodeId, fromNodeId, 'continue');
}

// Select an option in selection node
function selectFlowchartOption(nodeId, optionId, optionName, handlerName) {
    const node = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (node) {
        node.classList.add('vf-node-completed');
        // Add click handler to return to this step
        node.addEventListener('click', () => returnToStep(nodeId));
        // Highlight selected option
        const options = node.querySelectorAll('.vf-selection-option');
        options.forEach(opt => {
            opt.classList.add('vf-option-disabled');
        });
        const selectedOption = node.querySelector(`.vf-selection-option[onclick*="${optionId}"]`);
        if (selectedOption) {
            selectedOption.classList.add('vf-option-selected');
            selectedOption.classList.remove('vf-option-disabled');
        }
    }
    
    // Store selection in state
    appState.currentTierFlow = appState.currentTierFlow || {};
    appState.currentTierFlow[`${nodeId}_selection`] = { id: optionId, name: optionName };
    
    // Call the handler
    if (window[handlerName]) {
        window[handlerName](nodeId, optionId, optionName);
    }
}

// Make a decision in decision node
function makeDecision(nodeId, choiceId, nextNodeId) {
    const node = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (node) {
        node.classList.add('vf-node-completed');
        // Add click handler to return to this step
        node.addEventListener('click', () => returnToStep(nodeId));
        // Highlight selected choice
        const choices = node.querySelectorAll('.vf-decision-btn');
        choices.forEach(ch => {
            ch.classList.add('vf-decision-disabled');
        });
        const selectedChoice = node.querySelector(`.vf-decision-btn[onclick*="${choiceId}"]`);
        if (selectedChoice) {
            selectedChoice.classList.add('vf-decision-selected');
            selectedChoice.classList.remove('vf-decision-disabled');
        }
    }
    
    showFlowchartNode(nextNodeId, nodeId, choiceId);
}

// Scroll to node
function scrollToNode(nodeId) {
    setTimeout(() => {
        const node = document.querySelector(`[data-node-id="${nodeId}"]`);
        if (node) {
            const canvas = document.getElementById('vf-canvas');
            if (!canvas) return;
            
            // Check if we're on mobile (vertical layout) using constant
            const isMobile = window.innerWidth <= VF_CONSTANTS.MOBILE_BREAKPOINT;
            
            if (isMobile) {
                // On mobile, use vertical centering
                node.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center', 
                    inline: 'nearest' 
                });
            } else {
                // On desktop, use custom smooth horizontal scroll for gentler animation
                const nodeRect = node.getBoundingClientRect();
                const canvasRect = canvas.getBoundingClientRect();
                
                // Calculate target scroll position to center the node
                const nodeCenter = nodeRect.left + nodeRect.width / 2;
                const canvasCenter = canvasRect.left + canvasRect.width / 2;
                const scrollOffset = nodeCenter - canvasCenter;
                
                // Animate scroll with smooth easing
                const startScroll = canvas.scrollLeft;
                const targetScroll = startScroll + scrollOffset;
                const startTime = performance.now();
                
                function animateScroll(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / VF_CONSTANTS.SCROLL_ANIMATION_DURATION, 1);
                    
                    // Ease-in-out cubic for smooth acceleration and deceleration
                    const easeProgress = progress < 0.5
                        ? 4 * progress * progress * progress
                        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                    
                    canvas.scrollLeft = startScroll + (targetScroll - startScroll) * easeProgress;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animateScroll);
                    }
                }
                
                requestAnimationFrame(animateScroll);
            }
        }
    }, VF_CONSTANTS.SCROLL_DELAY);
}

// Update progress indicator
function updateProgressIndicator() {
    const progressText = document.querySelector('.vf-progress-text');
    const pathLength = appState.visualFlowchart.selectedPath.length;
    if (progressText) {
        progressText.textContent = `Step ${pathLength}`;
    }
}

// Return to a previous step in the flowchart
function returnToStep(nodeId) {
    // Find the index of this node in the path
    const pathIndex = appState.visualFlowchart.selectedPath.findIndex(step => step.nodeId === nodeId);
    
    if (pathIndex === -1) return; // Node not found in path
    
    // If this is the current node, do nothing
    if (appState.visualFlowchart.currentNodeId === nodeId) return;
    
    // Remove all nodes after this one from the DOM
    const allNodes = document.querySelectorAll('.vf-node');
    const nodesToRemove = [];
    
    allNodes.forEach(node => {
        const dataNodeId = node.getAttribute('data-node-id');
        const nodePathIndex = appState.visualFlowchart.selectedPath.findIndex(step => step.nodeId === dataNodeId);
        if (nodePathIndex > pathIndex) {
            nodesToRemove.push(node);
        }
    });
    
    nodesToRemove.forEach(node => node.remove());
    
    // Remove connections after this node
    const connections = document.querySelectorAll('.vf-connection-path, .vf-connection-dot');
    connections.forEach(conn => {
        const connId = conn.getAttribute('id');
        if (connId) {
            // Check if this connection is after the target node
            const pathIds = connId.split('-').filter(part => part.startsWith('node'));
            if (pathIds.length >= 2) {
                const fromId = pathIds[0];
                const fromIndex = appState.visualFlowchart.selectedPath.findIndex(step => step.nodeId === fromId);
                if (fromIndex > pathIndex) {
                    conn.remove();
                }
            }
        }
    });
    
    // Update the path - remove steps after this one
    appState.visualFlowchart.selectedPath = appState.visualFlowchart.selectedPath.slice(0, pathIndex + 1);
    appState.visualFlowchart.currentNodeId = nodeId;
    
    // Remove completed class from the clicked node and re-enable it
    const targetNode = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (targetNode) {
        targetNode.classList.remove('vf-node-completed');
        
        // Re-enable buttons and options
        const btn = targetNode.querySelector('.vf-continue-btn');
        if (btn) btn.disabled = false;
        
        const options = targetNode.querySelectorAll('.vf-selection-option');
        options.forEach(opt => opt.classList.remove('vf-option-disabled'));
        
        const choices = targetNode.querySelectorAll('.vf-decision-btn');
        choices.forEach(ch => ch.classList.remove('vf-decision-disabled'));
        
        const checkboxes = targetNode.querySelectorAll('.vf-checklist-item input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        if (btn) {
            btn.disabled = true; // Disable continue button until items are checked again
        }
    }
    
    // Update progress indicator
    updateProgressIndicator();
    
    // Scroll to the node
    scrollToNode(nodeId);
}

// Close visual flowchart
function closeVisualFlowchart() {
    const container = document.getElementById('flowchart-container');
    if (container) {
        container.classList.add('flowchart-hidden');
        container.innerHTML = '';
    }
    
    // Reset state
    appState.visualFlowchart = {
        nodes: [],
        connections: [],
        currentNodeId: null,
        selectedPath: []
    };
    appState.currentTierFlow = null;
    
    // Return to interventions options screen
    returnToInterventionsOptions();
}

// Handler functions for tier 1
function selectTier1ScreenerVisual(nodeId, screenerId, screenerName) {
    appState.currentTierFlow = appState.currentTierFlow || {};
    appState.currentTierFlow.screener = screenerId;
    appState.currentTierFlow.screenerName = screenerName;

    setRememberedScreener(screenerName || screenerId);

    showFlowchartNode('tier1-effectiveness', nodeId, screenerId);
}

// Handler functions for tier 2
function selectTier2AssessmentVisual(nodeId, assessmentId, assessmentName) {
    appState.currentTierFlow = appState.currentTierFlow || {};
    appState.currentTierFlow.assessment = assessmentId;
    appState.currentTierFlow.assessmentName = assessmentName;
    
    const nextNode = nodeId === 'tier2-cycle2-assessment' ? 'tier2-cycle2-intervention' : 'tier2-intervention';
    showFlowchartNode(nextNode, nodeId, assessmentId);
}

function selectTier2InterventionVisual(nodeId, interventionId, interventionName) {
    appState.currentTierFlow = appState.currentTierFlow || {};
    appState.currentTierFlow.intervention = interventionId;
    appState.currentTierFlow.interventionName = interventionName;
    
    const nextNode = nodeId === 'tier2-cycle2-intervention' ? 'tier2-cycle2-progress' : 'tier2-progress';
    showFlowchartNode(nextNode, nodeId, interventionId);
}

// Handler functions for tier 3
function selectTier3AssessmentVisual(nodeId, assessmentId, assessmentName) {
    appState.currentTierFlow = appState.currentTierFlow || {};
    appState.currentTierFlow.assessment = assessmentId;
    appState.currentTierFlow.assessmentName = assessmentName;
    
    showFlowchartNode('tier3-intervention', nodeId, assessmentId);
}

function selectTier3InterventionVisual(nodeId, interventionId, interventionName) {
    appState.currentTierFlow = appState.currentTierFlow || {};
    appState.currentTierFlow.intervention = interventionId;
    appState.currentTierFlow.interventionName = interventionName;
    
    showFlowchartNode('tier3-progress', nodeId, interventionId);
}

// Action handlers for endpoint buttons
function startTier2Visual() {
    closeVisualFlowchart();
    setTimeout(() => {
        initVisualFlowchart('tier2');
    }, 300);
}

function startTier3Visual() {
    closeVisualFlowchart();
    setTimeout(() => {
        initVisualFlowchart('tier3');
    }, 300);
}

function restartTier1Visual() {
    closeVisualFlowchart();
    setTimeout(() => {
        initVisualFlowchart('tier1');
    }, 300);
}

function restartTier2Visual() {
    closeVisualFlowchart();
    setTimeout(() => {
        initVisualFlowchart('tier2');
    }, 300);
}

// ============================================
// Flowchart Review Modal
// ============================================

// ============================================
// Tier Flowchart Functions (Legacy - Now using Visual Flowchart)
// ============================================
function startTier1Flowchart() {
    console.log('Starting Tier 1 Visual Flowchart');
    initVisualFlowchart('tier1');
}

function updateTier1Progress() {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    const continueBtn = document.getElementById('tier1-continue-btn');
    
    if (continueBtn) {
        continueBtn.disabled = !allChecked;
    }
}

function proceedToTier1Screener() {
    console.log('Proceeding to Tier 1 screener selection');
    
    const flowchartData = appState.tierFlowchartData?.tier1;
    if (!flowchartData || !flowchartData.screeners) {
        console.error('Tier 1 flowchart data not loaded');
        return;
    }
    
    const container = document.getElementById('flowchart-container');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="backToTier1Step1()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                </button>
                <h2>Tier 1: Select Literacy Screener</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="flowchart-step-wrapper active">
                    <div class="step-indicator">Step 2</div>
                    <div class="step-content-box">
                        <h3>Choose Your Literacy Screener</h3>
                        <p>Select the assessment tool you're using for universal screening:</p>
                        
                        <div class="screener-selection-grid">
                            ${flowchartData.screeners.map(screener => `
                                <button class="screener-option" onclick="selectTier1Screener('${screener.id}', '${screener.name}')">
                                    <div class="screener-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                            <path d="M9 12l2 2 4-4"/>
                                        </svg>
                                    </div>
                                    <h4>${screener.name}</h4>
                                    <p>${screener.description}</p>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function backToTier1Step1() {
    startTier1Flowchart();
}

function selectTier1Screener(screenerId, screenerName) {
    console.log(`Selected screener: ${screenerName}`);
    appState.currentTierFlow = { tier: 1, screener: screenerId, screenerName: screenerName };
    
    const container = document.getElementById('flowchart-container');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="proceedToTier1Screener()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                </button>
                <h2>Tier 1: Evaluate Effectiveness</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="flowchart-step-wrapper active">
                    <div class="step-indicator">Step 3</div>
                    <div class="step-content-box">
                        <h3>Is the instruction effective for most students?</h3>
                        <p>Based on ${screenerName} results and classroom observations:</p>
                        
                        <div class="info-callout">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                            <div>
                                <h4>Consider These Indicators</h4>
                                <ul class="indicator-list">
                                    <li>Are 80% or more students meeting benchmarks?</li>
                                    <li>Is student engagement high during lessons?</li>
                                    <li>Are learning objectives being achieved?</li>
                                    <li>Is progress evident through formative assessments?</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="decision-buttons">
                            <button class="decision-btn success" onclick="tier1InstructionEffective()">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                                <div>
                                    <strong>Yes, Instruction is Effective</strong>
                                    <span>80%+ students meeting benchmarks</span>
                                </div>
                            </button>
                            
                            <button class="decision-btn warning" onclick="tier1InstructionIneffective()">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                <div>
                                    <strong>No, Needs Improvement</strong>
                                    <span>More than 20% students struggling</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function tier1InstructionEffective() {
    const container = document.getElementById('flowchart-container');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="closeTierFlowchart()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Interventions
                </button>
                <h2>Tier 1: Success!</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="success-message">
                    <div class="success-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                    </div>
                    <h2>Core Instruction is Effective!</h2>
                    <p>Your explicit and systematic instruction is working well for the majority of students.</p>
                    
                    <div class="recommendation-box">
                        <h3>Next Steps:</h3>
                        <ul>
                            <li>Continue with current instructional practices</li>
                            <li>Monitor progress through regular formative assessments</li>
                            <li>Conduct universal screening at the next benchmark period</li>
                            <li>For the small percentage of struggling students, consider Tier 2 interventions</li>
                        </ul>
                    </div>
                    
                    <button class="btn-primary" onclick="closeTierFlowchart()">
                        Return to Interventions
                    </button>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function tier1InstructionIneffective() {
    const container = document.getElementById('flowchart-container');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="selectTier1Screener('${appState.currentTierFlow?.screener}', '${appState.currentTierFlow?.screenerName}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                </button>
                <h2>Tier 1: Determine Student Success Rate</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="flowchart-step-wrapper active">
                    <div class="step-indicator">Step 4</div>
                    <div class="step-content-box">
                        <h3>What percentage of students are unsuccessful?</h3>
                        <p>Based on assessment data, how many students are below benchmark?</p>
                        
                        <div class="decision-buttons">
                            <button class="decision-btn primary" onclick="tier1LessThan20Percent()">
                                <div>
                                    <strong>Less than 20% Unsuccessful</strong>
                                    <span>Most students are on track, small group needs support</span>
                                </div>
                            </button>
                            
                            <button class="decision-btn warning" onclick="tier1MoreThan20Percent()">
                                <div>
                                    <strong>20% or More Unsuccessful</strong>
                                    <span>Significant number of students need re-teaching</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function tier1LessThan20Percent() {
    const container = document.getElementById('flowchart-container');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="closeTierFlowchart()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Interventions
                </button>
                <h2>Tier 1: Move to Tier 2</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="info-message">
                    <div class="info-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <h2>Small Group Intervention Recommended</h2>
                    <p>A small percentage of students need additional targeted support.</p>
                    
                    <div class="recommendation-box">
                        <h3>Next Steps:</h3>
                        <ul>
                            <li>Continue Tier 1 core instruction for all students</li>
                            <li>Implement Tier 2 small group interventions for struggling students (typically 15% or less)</li>
                            <li>Use evidence-based intervention strategies</li>
                            <li>Monitor progress every 2-4 weeks</li>
                        </ul>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn-primary" onclick="startTier2Flowchart()">
                            Start Tier 2 Flowchart
                        </button>
                        <button class="btn-secondary" onclick="closeTierFlowchart()">
                            Return to Interventions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function tier1MoreThan20Percent() {
    const container = document.getElementById('flowchart-container');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="closeTierFlowchart()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Interventions
                </button>
                <h2>Tier 1: Re-teach with Different Strategies</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="warning-message">
                    <div class="warning-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <h2>Core Instruction Needs Adjustment</h2>
                    <p>When more than 20% of students are unsuccessful, the core instruction may need to be re-examined and adjusted.</p>
                    
                    <div class="recommendation-box">
                        <h3>Recommended Actions:</h3>
                        <ul>
                            <li><strong>Re-teach</strong> using different instructional strategies</li>
                            <li><strong>Review</strong> the 8 principles of explicit instruction</li>
                            <li><strong>Differentiate</strong> instruction within Tier 1</li>
                            <li><strong>Increase</strong> modeling and guided practice opportunities</li>
                            <li><strong>Adjust</strong> pacing to ensure concept mastery</li>
                            <li><strong>Collaborate</strong> with colleagues to refine approaches</li>
                        </ul>
                    </div>
                    
                    <div class="info-callout">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        <div>
                            <h4>After Re-teaching</h4>
                            <p>Re-assess students and return to this flowchart to determine if Tier 1 instruction is now effective or if students need Tier 2 support.</p>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn-primary" onclick="startTier1Flowchart()">
                            Start Tier 1 Again
                        </button>
                        <button class="btn-secondary" onclick="closeTierFlowchart()">
                            Return to Interventions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function startTier2Flowchart() {
    console.log('Starting Tier 2 Visual Flowchart');
    initVisualFlowchart('tier2');
}

function updateTier2Progress() {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    const continueBtn = document.getElementById('tier2-continue-btn');
    
    if (continueBtn) {
        continueBtn.disabled = !allChecked;
    }
}

function proceedToTier2Assessment() {
    console.log('Proceeding to Tier 2 drill down assessment');
    
    const flowchartData = appState.tierFlowchartData?.tier2;
    if (!flowchartData || !flowchartData.drillDownAssessments) {
        console.error('Tier 2 flowchart data not loaded');
        return;
    }
    
    const container = document.getElementById('flowchart-container');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="startTier2Flowchart()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                </button>
                <h2>Tier 2: Select Drill Down Assessment</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="flowchart-step-wrapper active">
                    <div class="step-indicator">Step 2</div>
                    <div class="step-content-box">
                        <h3>Choose a Drill Down Assessment</h3>
                        <p>Select an assessment that aligns with the areas of weakness identified by the literacy screener:</p>
                        
                        <div class="info-callout">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                            <div>
                                <h4>Purpose of Drill Down Assessments</h4>
                                <p>These assessments provide more detailed information about specific skill gaps, helping you select the most appropriate intervention.</p>
                            </div>
                        </div>
                        
                        <div class="screener-selection-grid">
                            ${flowchartData.drillDownAssessments.map(assessment => `
                                <button class="screener-option" onclick="selectTier2Assessment('${assessment.id}', '${assessment.name}')">
                                    <div class="screener-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                            <path d="M9 12h6m-6 4h6"/>
                                        </svg>
                                    </div>
                                    <h4>${assessment.name}</h4>
                                    <p>${assessment.description}</p>
                                    <small style="color: var(--text-secondary); margin-top: 0.5rem; display: block;">
                                        Time: ${assessment.administrationTime}
                                    </small>
                                </button>
                            `).join('')}
                        </div>
                        
                        <button class="btn-secondary" onclick="openInterventionsMenu('tier2', 'assessments')" style="margin-top: 1.5rem;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; margin-right: 0.5rem;">
                                <path d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                            View All Tier 2 Assessments
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function selectTier2Assessment(assessmentId, assessmentName) {
    console.log(`Selected assessment: ${assessmentName}`);
    appState.currentTierFlow = { ...(appState.currentTierFlow || {}), tier: 2, assessment: assessmentId, assessmentName: assessmentName };
    
    proceedToTier2Intervention();
}

function proceedToTier2Intervention() {
    const flowchartData = appState.tierFlowchartData?.tier2;
    if (!flowchartData || !flowchartData.interventions) {
        console.error('Tier 2 intervention data not loaded');
        return;
    }
    
    const container = document.getElementById('flowchart-container');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="proceedToTier2Assessment()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                </button>
                <h2>Tier 2: Select Intervention</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="flowchart-step-wrapper active">
                    <div class="step-indicator">Step 3</div>
                    <div class="step-content-box">
                        <h3>Choose an 8-Week Intervention</h3>
                        <p>Select an evidence-based intervention that matches the student's specific needs:</p>
                        
                        <div class="info-callout">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                            <div>
                                <h4>8-Week Intervention Cycle</h4>
                                <p>Implement the selected intervention for 8 weeks. Monitor student progress regularly during this period using progress monitoring tools.</p>
                            </div>
                        </div>
                        
                        <div class="screener-selection-grid">
                            ${flowchartData.interventions.map(intervention => `
                                <button class="screener-option" onclick="selectTier2Intervention('${intervention.id}', '${intervention.name}')">
                                    <div class="screener-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                        </svg>
                                    </div>
                                    <h4>${intervention.name}</h4>
                                    <p>${intervention.description}</p>
                                    <small style="color: var(--text-secondary); margin-top: 0.5rem; display: block;">
                                        ${intervention.duration} • ${intervention.frequency}
                                    </small>
                                </button>
                            `).join('')}
                        </div>
                        
                        <button class="btn-secondary" onclick="openInterventionsMenu('tier2', 'interventions')" style="margin-top: 1.5rem;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; margin-right: 0.5rem;">
                                <path d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                            View All Tier 2 Interventions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function selectTier2Intervention(interventionId, interventionName) {
    console.log(`Selected intervention: ${interventionName}`);
    appState.currentTierFlow = { ...(appState.currentTierFlow || {}), intervention: interventionId, interventionName: interventionName };
    
    proceedToTier2ProgressMonitoring();
}

function proceedToTier2ProgressMonitoring() {
    const container = document.getElementById('flowchart-container');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="proceedToTier2Intervention()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                </button>
                <h2>Tier 2: Progress Monitoring</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="flowchart-step-wrapper active">
                    <div class="step-indicator">Step 4</div>
                    <div class="step-content-box">
                        <h3>After 8 Weeks: Conduct Progress Monitoring</h3>
                        <p>Administer a literacy screener to evaluate student progress:</p>
                        
                        <div class="info-callout">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                            <div>
                                <h4>Acceptable Screeners</h4>
                                <ul class="indicator-list">
                                    <li>DIBELS (Dynamic Indicators of Basic Early Literacy Skills)</li>
                                    <li>CTOPP-2 (Comprehensive Test of Phonological Processing)</li>
                                    <li>THaFoL (French literacy screener)</li>
                                    <li>IDAPEL (French early literacy indicators)</li>
                                </ul>
                            </div>
                        </div>
                        
                        <h4 style="margin-top: 2rem; margin-bottom: 1rem;">Did the student show improvement?</h4>
                        
                        <div class="decision-buttons">
                            <button class="decision-btn success" onclick="tier2StudentImproved()">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                                <div>
                                    <strong>Yes, Student Improved</strong>
                                    <span>Blue or Green results - meeting benchmarks</span>
                                </div>
                            </button>
                            
                            <button class="decision-btn warning" onclick="tier2StudentDidNotImprove()">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                <div>
                                    <strong>No Improvement</strong>
                                    <span>Yellow or Red results - below benchmark</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function tier2StudentImproved() {
    const container = document.getElementById('flowchart-container');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="closeTierFlowchart()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Interventions
                </button>
                <h2>Tier 2: Success!</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="success-message">
                    <div class="success-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                    </div>
                    <h2>Student Made Good Progress!</h2>
                    <p>The 8-week Tier 2 intervention was effective. The student is now meeting benchmarks.</p>
                    
                    <div class="recommendation-box">
                        <h3>Next Steps:</h3>
                        <ul>
                            <li>Gradually fade the intervention support</li>
                            <li>Continue to monitor progress closely</li>
                            <li>Return to Tier 1 core instruction</li>
                            <li>Celebrate the student's success!</li>
                        </ul>
                    </div>
                    
                    <button class="btn-primary" onclick="closeTierFlowchart()">
                        Return to Interventions
                    </button>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function tier2StudentDidNotImprove() {
    const container = document.getElementById('flowchart-container');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="proceedToTier2ProgressMonitoring()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                </button>
                <h2>Tier 2: Try a Different Approach</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="warning-message">
                    <div class="warning-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <h2>Second Intervention Cycle Needed</h2>
                    <p>The student did not make expected progress. Let's try a different intervention approach for another 8-week cycle.</p>
                    
                    <div class="recommendation-box">
                        <h3>Recommended Actions:</h3>
                        <ul>
                            <li>Conduct another drill down assessment for more detail</li>
                            <li>Select a different intervention strategy</li>
                            <li>Implement for another 8-week cycle</li>
                            <li>Monitor progress closely</li>
                        </ul>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn-primary" onclick="startTier2Cycle2()">
                            Begin Second 8-Week Cycle
                        </button>
                        <button class="btn-secondary" onclick="closeTierFlowchart()">
                            Return to Interventions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function startTier2Cycle2() {
    console.log('Starting Tier 2 Cycle 2');
    appState.currentTierFlow = { ...(appState.currentTierFlow || {}), cycle: 2 };
    
    proceedToTier2Assessment();
}

function startTier3Flowchart() {
    console.log('Starting Tier 3 Visual Flowchart');
    initVisualFlowchart('tier3');
}

function proceedToTier3Assessment() {
    console.log('Proceeding to Tier 3 drill down assessment');
    
    const flowchartData = appState.tierFlowchartData?.tier3;
    if (!flowchartData || !flowchartData.drillDownAssessments) {
        console.error('Tier 3 flowchart data not loaded');
        return;
    }
    
    const container = document.getElementById('flowchart-container');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="startTier3Flowchart()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                </button>
                <h2>Tier 3: Drill Down Assessment</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="flowchart-step-wrapper active">
                    <div class="step-indicator">Step 1</div>
                    <div class="step-content-box">
                        <h3>Administer a drill down assessment.</h3>
                        <p>Use the menu below to find and administer a drill down assessment that aligns with the needs of your students, as determined by the literacy screener.</p>
                        
                        <div class="screener-selection-grid">
                            ${flowchartData.drillDownAssessments.map(assessment => `
                                <button class="screener-option" onclick="selectTier3Assessment('${assessment.id}', '${assessment.name}')">
                                    <div class="screener-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                            <path d="M9 12h6m-6 4h6"/>
                                        </svg>
                                    </div>
                                    <h4>${assessment.name}</h4>
                                    <p>${assessment.description}</p>
                                    <small style="color: var(--text-secondary); margin-top: 0.5rem; display: block;">
                                        Time: ${assessment.administrationTime}
                                    </small>
                                </button>
                            `).join('')}
                        </div>
                        
                        <button class="btn-secondary" onclick="openInterventionsMenu('tier3', 'assessments')" style="margin-top: 1.5rem;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; margin-right: 0.5rem;">
                                <path d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                            View All Tier 3 Assessments
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function selectTier3Assessment(assessmentId, assessmentName) {
    console.log(`Selected assessment: ${assessmentName}`);
    appState.currentTierFlow = { ...(appState.currentTierFlow || {}), tier: 3, assessment: assessmentId, assessmentName: assessmentName };
    
    proceedToTier3Intervention();
}

function proceedToTier3Intervention() {
    const flowchartData = appState.tierFlowchartData?.tier3;
    if (!flowchartData || !flowchartData.interventions) {
        console.error('Tier 3 intervention data not loaded');
        return;
    }
    
    const container = document.getElementById('flowchart-container');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="proceedToTier3Assessment()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                </button>
                <h2>Tier 3: 8-week Intervention</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="flowchart-step-wrapper active">
                    <div class="step-indicator">Step 2</div>
                    <div class="step-content-box">
                        <h3>Select and administer an 8-week intervention.</h3>
                        <p>Use the menu below to find an appropriate intervention, and administer for an 8-week period. Monitor student response to intervention weekly.</p>
                        
                        <div class="screener-selection-grid">
                            ${flowchartData.interventions.map(intervention => `
                                <button class="screener-option" onclick="selectTier3Intervention('${intervention.id}', '${intervention.name}')">
                                    <div class="screener-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                        </svg>
                                    </div>
                                    <h4>${intervention.name}</h4>
                                    <p>${intervention.description}</p>
                                    <small style="color: var(--text-secondary); margin-top: 0.5rem; display: block;">
                                        ${intervention.duration} • ${intervention.frequency}
                                    </small>
                                </button>
                            `).join('')}
                        </div>
                        
                        <button class="btn-secondary" onclick="openInterventionsMenu('tier3', 'interventions')" style="margin-top: 1.5rem;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; margin-right: 0.5rem;">
                                <path d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                            View All Tier 3 Interventions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function selectTier3Intervention(interventionId, interventionName) {
    console.log(`Selected intervention: ${interventionName}`);
    appState.currentTierFlow = { ...(appState.currentTierFlow || {}), intervention: interventionId, interventionName: interventionName };
    
    proceedToTier3ProgressMonitoring();
}

function proceedToTier3ProgressMonitoring() {
    const container = document.getElementById('flowchart-container');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="proceedToTier3Intervention()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                </button>
                <h2>Tier 3: Progress Monitoring</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="flowchart-step-wrapper active">
                    <div class="step-indicator">Step 3</div>
                    <div class="step-content-box">
                        <h3>Was instruction effective?</h3>
                        <p>After the 8-week period, administer the regularly scheduled progress monitoring literacy screener (DIBELS, CTOPP-2, THaFol, IDAPEL).</p>
                        
                        <p>If you chose the wrong option, simply choose the correct one and continue.</p>
                        
                        <h4 style="margin-top: 2rem; margin-bottom: 1rem;">Was instruction effective?</h4>
                        
                        <div class="decision-buttons">
                            <button class="decision-btn success" onclick="tier3StudentImproved()">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                                <div>
                                    <strong>Option A: Instruction Effective</strong>
                                    <span>Subtest result Blue or Green</span>
                                </div>
                            </button>
                            
                            <button class="decision-btn warning" onclick="tier3StudentDidNotImprove()">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                <div>
                                    <strong>Option B: Instruction Ineffective</strong>
                                    <span>Subtest result Yellow or Red</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function tier3StudentImproved() {
    const container = document.getElementById('flowchart-container');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="closeTierFlowchart()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Interventions
                </button>
                <h2>Tier 3: Success!</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="success-message">
                    <div class="success-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                    </div>
                    <h2>Step 4: Success!</h2>
                    <p>Consider fading supports to Tier 1 and monitor.</p>
                    
                    <div class="action-buttons">
                        <button class="btn-secondary" onclick="closeTierFlowchart()">
                            Return to Interventions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function tier3StudentDidNotImprove() {
    const container = document.getElementById('flowchart-container');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="closeTierFlowchart()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Interventions
                </button>
                <h2>Tier 3: Meet with Clinicians</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="warning-message">
                    <div class="warning-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <h2>Step 4: Meet with Clinicians</h2>
                    <p>Meet with the appropriate clinicians to discuss next steps.</p>
                    
                    <button class="btn-primary" onclick="closeTierFlowchart()">
                        Return to Interventions
                    </button>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeTierFlowchart() {
    // Restart the flowchart from Tier 1
    openInteractiveFlowchart();
}

function openInterventionsMenu(tier, mode = 'interventions') {
    console.log(`Opening Interventions Menu for Tier ${tier}, Mode: ${mode}`);
    
    const tierData = appState.tierFlowchartData?.[`tier${tier}`];
    if (!tierData) {
        console.error(`Tier ${tier} data not loaded`);
        return;
    }
    
    const tierNames = {
        '1': 'Tier 1 - Universal/Core Instruction',
        '2': 'Tier 2 - Small Group Intervention',
        '3': 'Tier 3 - Intensive Individual Intervention'
    };
    
    const container = document.getElementById('flowchart-container');
    if (!container) return;
    
    container.classList.remove('flowchart-hidden');
    
    const items = mode === 'assessments' 
        ? (tierData.drillDownAssessments || [])
        : (tierData.interventions || []);
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="flowchart-tier-view">
                <div class="flowchart-header">
                    <button class="back-button" onclick="closeTierFlowchart()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Back
                    </button>
                    <h2>Interventions Menu - ${tierNames[tier]}</h2>
                </div>
                
                <div class="flowchart-content">
                    <div class="info-callout">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        <div>
                            <h4>No ${mode === 'assessments' ? 'Assessments' : 'Interventions'} Available</h4>
                            <p>No ${mode === 'assessments' ? 'drill-down assessments' : 'intervention resources'} are currently available for Tier ${tier}.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }
    
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="closeTierFlowchart()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                </button>
                <h2>Interventions Menu - ${tierNames[tier]}</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="interventions-menu-header" style="margin-bottom: 2rem;">
                    <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                        <button class="btn-${mode === 'assessments' ? 'primary' : 'secondary'}" onclick="openInterventionsMenu('${tier}', 'assessments')" style="flex: 1; min-width: 200px;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; margin-right: 0.5rem;">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                            Drill-Down Assessments
                        </button>
                        <button class="btn-${mode === 'interventions' ? 'primary' : 'secondary'}" onclick="openInterventionsMenu('${tier}', 'interventions')" style="flex: 1; min-width: 200px;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; margin-right: 0.5rem;">
                                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                            </svg>
                            Intervention Resources
                        </button>
                    </div>
                    
                    <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                        <span style="font-weight: 600; color: var(--text-primary);">Filter by Tier:</span>
                        <button class="btn-${tier === '1' ? 'primary' : 'secondary'}" onclick="openInterventionsMenu('1', '${mode}')" style="padding: 0.5rem 1rem;">Tier 1</button>
                        <button class="btn-${tier === '2' ? 'primary' : 'secondary'}" onclick="openInterventionsMenu('2', '${mode}')" style="padding: 0.5rem 1rem;">Tier 2</button>
                        <button class="btn-${tier === '3' ? 'primary' : 'secondary'}" onclick="openInterventionsMenu('3', '${mode}')" style="padding: 0.5rem 1rem;">Tier 3</button>
                    </div>
                </div>
                
                <h3 style="margin-bottom: 1.5rem; color: var(--text-primary);">
                    ${mode === 'assessments' ? 'Available Assessments' : 'Available Interventions'}
                </h3>
                
                <div class="interventions-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
                    ${items.map(item => `
                        <div class="intervention-card" style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; transition: var(--transition);">
                            <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1rem;">
                                <div style="width: 48px; height: 48px; padding: 0.75rem; background: var(--accent-light); border-radius: 50%; flex-shrink: 0;">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 100%; height: 100%; color: var(--primary);">
                                        ${mode === 'assessments' 
                                            ? '<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/><path d="M9 12h6m-6 4h6"/>'
                                            : '<path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>'
                                        }
                                    </svg>
                                </div>
                                <div style="flex: 1;">
                                    <h4 style="margin: 0 0 0.5rem 0; color: var(--text-primary); font-size: 1.125rem;">${item.name}</h4>
                                    ${item.targetSkills ? `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
                                        ${item.targetSkills.map(skill => `
                                            <span style="background: var(--accent-light); color: var(--primary); padding: 0.25rem 0.75rem; border-radius: var(--radius); font-size: 0.75rem; font-weight: 600;">${skill}</span>
                                        `).join('')}
                                    </div>` : ''}
                                </div>
                            </div>
                            <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">${item.description}</p>
                            ${mode === 'assessments' 
                                ? `<div style="color: var(--text-secondary); font-size: 0.875rem;">
                                    <strong>Administration Time:</strong> ${item.administrationTime}
                                   </div>`
                                : `<div style="color: var(--text-secondary); font-size: 0.875rem;">
                                    <div><strong>Duration:</strong> ${item.duration}</div>
                                    <div><strong>Frequency:</strong> ${item.frequency}</div>
                                    ${item.groupSize ? `<div><strong>Group Size:</strong> ${item.groupSize}</div>` : ''}
                                   </div>`
                            }
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// Intervention Menu Functions
// ============================================
function initializeInterventionMenu() {
    if (!appState.interventionMenuData) {
        console.error('Intervention menu data not loaded');
        return;
    }

    // Initialize all filter options
    updateScreenerOptions();
    updatePillarOptions();
    
    // Tier filter
    const tierSelect = document.getElementById('tier-select');
    if (tierSelect) {
        tierSelect.addEventListener('change', () => {
            // Don't auto-search anymore
        });
    }

    // Language filter
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            appState.interventionMenu.language = e.target.value;
            updateScreenerOptions();
            // Don't auto-search anymore
        });
    }

    // Screener select
    const screenerSelect = document.getElementById('screener-select');
    if (screenerSelect) {
        screenerSelect.addEventListener('change', (e) => {
            updateSubtestOptions();
            // Don't auto-search anymore
        });
    }

    // Subtest select
    const subtestSelect = document.getElementById('subtest-select');
    if (subtestSelect) {
        subtestSelect.addEventListener('change', () => {
            // Don't auto-search anymore
        });
    }

    // Pillar select
    const pillarSelect = document.getElementById('pillar-select');
    if (pillarSelect) {
        pillarSelect.addEventListener('change', () => {
            // Don't auto-search anymore
        });
    }

    // Type select
    const typeSelect = document.getElementById('type-select');
    if (typeSelect) {
        typeSelect.addEventListener('change', () => {
            // Don't auto-search anymore
        });
    }

    // Search button
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', performCompactSearch);
    }

    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetInterventionMenu);
    }

    // Don't perform initial search - let user make choices first
}

// ============================================
// View Toggle for Interventions Section
// ============================================
function showInterventionView(view) {
    const menuView = document.getElementById('intervention-menu-view');
    const flowchartView = document.getElementById('flowchart-container');
    const menuBtn = document.getElementById('menu-view-btn');
    const flowchartBtn = document.getElementById('flowchart-view-btn');
    
    if (view === 'menu') {
        if (menuView) menuView.classList.remove('flowchart-view-hidden');
        if (flowchartView) flowchartView.classList.add('flowchart-view-hidden');
        if (menuBtn) menuBtn.classList.add('active');
        if (flowchartBtn) flowchartBtn.classList.remove('active');
    } else if (view === 'flowchart') {
        if (menuView) menuView.classList.add('flowchart-view-hidden');
        if (flowchartView) flowchartView.classList.remove('flowchart-view-hidden');
        if (menuBtn) menuBtn.classList.remove('active');
        if (flowchartBtn) flowchartBtn.classList.add('active');
        
        // Initialize flowchart if not already initialized
        if (flowchartView && !flowchartView.hasChildNodes()) {
            renderFlowchartStart();
        }
    }
}

function updateScreenerOptions() {
    const screenerSelect = document.getElementById('screener-select');
    if (!screenerSelect || !appState.interventionMenuData) return;
    
    // Use shared helper to build dropdown with all screeners
    screenerSelect.innerHTML = buildScreenerDropdownHtml('');
}

// Shared helper function to build screener dropdown HTML
function buildScreenerDropdownHtml(languageFilter, selectedId) {
    if (!appState.interventionMenuData) return '<option value="">Select...</option>';
    
    let englishScreeners = [];
    let frenchScreeners = [];
    
    if (!languageFilter || languageFilter === '') {
        // Show all screeners
        englishScreeners = appState.interventionMenuData.screeners.filter(s => s.language === 'English');
        frenchScreeners = appState.interventionMenuData.screeners.filter(s => s.language === 'French');
    } else if (languageFilter === 'English') {
        englishScreeners = appState.interventionMenuData.screeners.filter(s => s.language === 'English');
    } else if (languageFilter === 'French') {
        frenchScreeners = appState.interventionMenuData.screeners.filter(s => s.language === 'French');
    }
    
    const optionHtml = (s) => {
        const isSelected = selectedId && s.screener_id === selectedId ? ' selected' : '';
        return `<option value="${s.screener_id}"${isSelected}>${s.screener_name}</option>`;
    };

    let html = '<option value="">Select...</option>';
    
    if (englishScreeners.length > 0) {
        html += '<optgroup label="English">';
        html += englishScreeners.map(optionHtml).join('');
        html += '</optgroup>';
    }
    
    if (frenchScreeners.length > 0) {
        html += '<optgroup label="French Immersion">';
        html += frenchScreeners.map(optionHtml).join('');
        html += '</optgroup>';
    }
    
    return html;
}

// ============================================
// Remembered screener (shared across tiers + menu)
// ============================================

// Resolve any screener identifier (id or display name, any casing) to the
// canonical intervention-menu screener_id. Returns null if it cannot be matched.
function resolveScreenerId(idOrName) {
    if (!idOrName) return null;
    const screeners = appState.interventionMenuData?.screeners || [];
    const needle = String(idOrName).trim().toLowerCase();
    const match = screeners.find(s =>
        String(s.screener_id).toLowerCase() === needle ||
        String(s.screener_name).toLowerCase() === needle
    );
    return match ? match.screener_id : null;
}

// Remember the screener the user selected so it can be pre-selected elsewhere.
function setRememberedScreener(idOrName) {
    const resolved = resolveScreenerId(idOrName);
    if (resolved) {
        appState.selectedScreener = resolved;
    }
    updateScreenerIndicator();
    return resolved;
}

// Get the remembered screener_id (or null if none chosen yet).
function getRememberedScreenerId() {
    return appState.selectedScreener || null;
}

// Resolve a screener_id to its human-friendly display name.
function getScreenerName(idOrName) {
    if (!idOrName) return '';
    const screeners = appState.interventionMenuData?.screeners || [];
    const needle = String(idOrName).trim().toLowerCase();
    const match = screeners.find(s =>
        String(s.screener_id).toLowerCase() === needle ||
        String(s.screener_name).toLowerCase() === needle
    );
    return match ? (match.screener_name || match.screener_id) : String(idOrName);
}

// Reflect the currently selected screener in the visible flowchart indicator so
// the user can always see which screener they chose.
function updateScreenerIndicator() {
    const indicator = document.getElementById('flowchart-screener-indicator');
    if (!indicator) return;
    const valueEl = document.getElementById('flowchart-screener-indicator-value');
    const id = getRememberedScreenerId();
    if (id) {
        if (valueEl) valueEl.textContent = getScreenerName(id);
        indicator.hidden = false;
    } else {
        if (valueEl) valueEl.textContent = '';
        indicator.hidden = true;
    }
}

function updateSubtestOptions() {
    const subtestSelect = document.getElementById('subtest-select');
    const screenerSelect = document.getElementById('screener-select');
    
    if (!subtestSelect || !screenerSelect || !appState.interventionMenuData) return;

    const screenerId = screenerSelect.value;
    
    if (!screenerId) {
        subtestSelect.innerHTML = '<option value="">All Subtests</option>';
        return;
    }

    const screener = appState.interventionMenuData.screeners.find(
        s => s.screener_id === screenerId
    );

    if (!screener) return;

    subtestSelect.innerHTML = '<option value="">All Subtests</option>' +
        screener.subtests.map(st => 
            `<option value="${st.subtest_code}">${st.subtest_code} - ${st.subtest_name}</option>`
        ).join('');
}

function updatePillarOptions() {
    const pillarSelect = document.getElementById('pillar-select');
    if (!pillarSelect || !appState.interventionMenuData) return;

    const pillars = appState.interventionMenuData.literacy_pillars.map(p => p.name);
    
    pillarSelect.innerHTML = '<option value="">All Pillars</option>' +
        pillars.map(p => `<option value="${p}">${p}</option>`).join('');
}

function performCompactSearch() {
    if (!appState.interventionMenuData) return;

    const tierSelect = document.getElementById('tier-select');
    const languageSelect = document.getElementById('language-select');
    const screenerSelect = document.getElementById('screener-select');
    const subtestSelect = document.getElementById('subtest-select');
    const pillarSelect = document.getElementById('pillar-select');
    const typeSelect = document.getElementById('type-select');

    const filters = {
        tier: tierSelect ? tierSelect.value : '',
        language: languageSelect ? languageSelect.value : 'English',
        screener: screenerSelect ? screenerSelect.value : '',
        subtest: subtestSelect ? subtestSelect.value : '',
        pillar: pillarSelect ? pillarSelect.value : '',
        type: typeSelect ? typeSelect.value : ''
    };

    // Validate that mandatory filters are selected
    if (!filters.tier) {
        displayValidationError('Please select a Tier before searching.');
        return;
    }
    if (!filters.pillar) {
        displayValidationError('Please select a Literacy Pillar before searching.');
        return;
    }
    if (!filters.type) {
        displayValidationError('Please select a Type (Assessment or Intervention) before searching.');
        return;
    }

    let results = [];
    
    // Get pillars to search by
    let pillarsToSearch = [];
    if (filters.pillar) {
        pillarsToSearch = [filters.pillar];
    } else if (filters.subtest && filters.screener) {
        // Get pillars from subtest
        const screener = appState.interventionMenuData.screeners.find(
            s => s.screener_id === filters.screener
        );
        if (screener) {
            const subtest = screener.subtests.find(st => st.subtest_code === filters.subtest);
            if (subtest) {
                pillarsToSearch = subtest.literacy_pillars;
            }
        }
    }

    // Collect items based on type filter
    // Language filter removed - show both English and French Immersion items
    if (!filters.type || filters.type === 'Assessment') {
        const assessments = appState.interventionMenuData.assessments.filter(item => {
            // Program match - show all programs if no language filter
            // (Language filter hidden, so always show all)

            // Tier match
            if (filters.tier) {
                if (!item.tiers || !item.tiers.includes(parseInt(filters.tier))) return false;
            }

            // Pillar match - use literacy_pillars array if available, otherwise fall back to literacy_pillar
            if (pillarsToSearch.length > 0) {
                const itemPillars = item.literacy_pillars || [item.literacy_pillar];
                if (!itemPillars.some(p => pillarsToSearch.includes(p))) return false;
            }

            return true;
        });
        results = results.concat(assessments.map(a => ({ ...a, itemType: 'Assessment' })));
    }

    if (!filters.type || filters.type === 'Intervention') {
        const interventions = appState.interventionMenuData.interventions.filter(item => {
            // Program match - show all programs if no language filter
            // (Language filter hidden, so always show all)

            // Tier match
            if (filters.tier) {
                if (!item.tiers || !item.tiers.includes(parseInt(filters.tier))) return false;
            }

            // Pillar match
            if (pillarsToSearch.length > 0) {
                const itemPillars = item.literacy_pillars || [];
                if (!itemPillars.some(p => pillarsToSearch.includes(p))) return false;
            }

            return true;
        });
        results = results.concat(interventions.map(i => ({ ...i, itemType: 'Intervention' })));
    }

    // Sort results
    results.sort((a, b) => {
        // Sort by evidence level first
        const evidenceOrder = { '**': 1, '*': 2, 'none': 3 };
        const aEvidence = evidenceOrder[a.evidence_level] || 3;
        const bEvidence = evidenceOrder[b.evidence_level] || 3;
        if (aEvidence !== bEvidence) return aEvidence - bEvidence;
        
        // Then by name
        return a.name.localeCompare(b.name);
    });

    displayCompactResults(results, filters);
}

function displayValidationError(message) {
    const resultsPanel = document.querySelector('.results-panel');
    if (!resultsPanel) return;

    resultsPanel.innerHTML = `
        <div class="results-header-compact">
            <div class="results-count">Please select all required filters</div>
        </div>
        <div class="results-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
            </svg>
            <p>${message}</p>
            <p style="margin-top: 1rem; color: #666; font-size: 0.9rem;">Required filters: Tier, Literacy Pillar, and Type</p>
        </div>
    `;
}

function displayCompactResults(results, filters) {
    const resultsPanel = document.querySelector('.results-panel');
    if (!resultsPanel) return;

    let filterSummary = [];
    if (filters.tier) filterSummary.push(`Tier ${filters.tier}`);
    // Language filter removed from summary
    if (filters.pillar) filterSummary.push(filters.pillar);
    if (filters.type) filterSummary.push(filters.type);

    const summaryText = filterSummary.length > 0 
        ? `Showing ${results.length} result${results.length !== 1 ? 's' : ''} for ${filterSummary.join(' • ')}`
        : `Showing all ${results.length} result${results.length !== 1 ? 's' : ''}`;

    if (results.length === 0) {
        resultsPanel.innerHTML = `
            <div class="results-header-compact">
                <div class="results-count">${summaryText}</div>
            </div>
            <div class="results-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4M12 16h.01"/>
                </svg>
                <p>No results found matching your filters</p>
            </div>
        `;
        return;
    }

    resultsPanel.innerHTML = `
        <div class="results-header-compact">
            <div class="results-count">${summaryText}</div>
        </div>
        <div class="results-grid-compact">
            ${results.map((item, index) => `
                <div class="result-card-compact" data-index="${index}">
                    <div class="result-header-compact" onclick="toggleResultExpand(${index})">
                        <div>
                            <h4 class="result-name-compact">${item.name}</h4>
                            <div class="result-meta-compact">
                                <span class="badge-grade">${item.grade_range.start}-${item.grade_range.end}</span>
                                <span class="badge-program">${item.program === 'English' ? 'EN' : 'FR'}</span>
                                ${getEvidenceBadgeHtml(item.evidence_level)}
                                ${item.tiers && item.tiers.length > 0
                                    ? `<span class="badge-tier">T${item.tiers.join(',')}</span>`
                                    : ''}
                            </div>
                        </div>
                        <svg class="result-expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 9l-7 7-7-7"/>
                        </svg>
                    </div>
                    <div class="result-details-compact">
                        ${item.itemType === 'Intervention' ? `
                            <div class="result-info"><strong>Addresses:</strong> ${item.literacy_pillars.join(', ')}</div>
                        ` : `
                            <div class="result-info"><strong>Pillar:</strong> ${(item.literacy_pillars || [item.literacy_pillar]).join(', ')}</div>
                            <div class="result-info"><strong>Type:</strong> ${item.assessment_type}</div>
                        `}
                        ${item.url && item.url !== '' && item.url !== '(local resource)' && item.url !== '(SharePoint)' && item.url !== '(Nelson)' ? `
                            <a href="${item.url}" target="_blank" class="result-link-compact" onclick="event.stopPropagation()">
                                View Resource
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                                    <path d="M15 3h6v6"/>
                                    <path d="M10 14L21 3"/>
                                </svg>
                            </a>
                        ` : item.url && item.url !== '' ? `
                            <div class="result-local-compact">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                                Available on ${item.url}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function resetInterventionMenu() {
    // Reset all dropdowns
    const tierSelect = document.getElementById('tier-select');
    const languageSelect = document.getElementById('language-select');
    const screenerSelect = document.getElementById('screener-select');
    const subtestSelect = document.getElementById('subtest-select');
    const pillarSelect = document.getElementById('pillar-select');
    const typeSelect = document.getElementById('type-select');

    if (tierSelect) tierSelect.value = '';
    if (languageSelect) languageSelect.value = 'English';
    if (screenerSelect) screenerSelect.value = '';
    if (subtestSelect) subtestSelect.value = '';
    if (pillarSelect) pillarSelect.value = '';
    if (typeSelect) typeSelect.value = '';

    // Update dependent dropdowns
    updateScreenerOptions();
    updateSubtestOptions();
    
    // Clear results instead of searching
    const resultsPanel = document.querySelector('.results-panel');
    if (resultsPanel) {
        resultsPanel.innerHTML = `
            <div class="results-container">
                <div class="results-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <p>Select your filters and click Search to find interventions and assessments</p>
                </div>
            </div>
        `;
    }
}

// ============================================
// Interventions Options Screen Functions
// ============================================

// New unified flowchart entry point
function openInteractiveFlowchart() {
    console.log('Opening Interactive Flowchart');
    
    // Show and initialize the flowchart container
    const flowchartContainer = document.getElementById('flowchart-container');
    if (flowchartContainer) {
        flowchartContainer.classList.remove('flowchart-view-hidden');
        flowchartContainer.style.display = 'block';
    }
    
    // Start with Tier 1 by default
    initIntegratedFlowchart('tier1');
    
    // Scroll to the top of the flowchart
    if (flowchartContainer) {
        flowchartContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function openTierFlowchart(tierName) {
    console.log(`Opening ${tierName} flowchart directly`);
    
    // Validate tierName
    if (!['tier1', 'tier2', 'tier3'].includes(tierName)) {
        console.error(`Invalid tier name: ${tierName}`);
        return;
    }
    
    // Show and initialize the flowchart container
    const flowchartContainer = document.getElementById('flowchart-container');
    if (flowchartContainer) {
        flowchartContainer.classList.remove('flowchart-view-hidden');
        flowchartContainer.style.display = 'block';
    }
    
    // Start the appropriate tier flowchart
    if (tierName === 'tier1') {
        startTier1Flowchart();
    } else if (tierName === 'tier2') {
        startTier2Flowchart();
    } else if (tierName === 'tier3') {
        startTier3Flowchart();
    }
    
    // Scroll to the top of the flowchart
    if (flowchartContainer) {
        flowchartContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function openInterventionsMenuView() {
    // No-op: sub-tabs handle navigation in new design
    console.log('openInterventionsMenuView called (no-op in new design)');
}

function returnToInterventionsOptions() {
    // No-op: sub-tabs handle navigation in new design
    console.log('returnToInterventionsOptions called (no-op in new design)');
}

// Activate a sub-tab by name (shared helper)
function activateSubTab(target) {
    document.querySelectorAll('.subtab-btn').forEach(function(btn) {
        var isActive = btn.getAttribute('data-subtab') === target;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    document.querySelectorAll('.subtab-panel').forEach(function(panel) {
        var isTarget = panel.getAttribute('data-subtab') === target;
        panel.classList.toggle('active', isTarget);
        panel.hidden = !isTarget;
    });
}

// Navigate to Flowchart page
function navigateToFlowchart() {
    navigateToPage('flowchart');
}

// Navigate to Interventions Menu page
function navigateToFindInterventions() {
    navigateToPage('interventions');
}

// ============================================
// NEW STEP-BASED INTERVENTION MENU
// ============================================

// Menu state
const menuState = {
    currentStep: 1,
    selectedScreener: null,
    selectedScreenerData: null,
    selectedSubtest: null,
    selectedSubtestData: null,
    selectedPillars: [],
    selectedItemType: null
};

// Initialize the step-based menu when view opens
function initializeStepBasedMenu() {
    // Reset state
    menuState.currentStep = 1;
    menuState.selectedScreener = null;
    menuState.selectedScreenerData = null;
    menuState.selectedSubtest = null;
    menuState.selectedSubtestData = null;
    menuState.selectedPillars = [];
    menuState.selectedItemType = null;
    
    // Check for new panel-based wizard
    const stepWizard = document.querySelector('.step-wizard');
    if (stepWizard) {
        // Initialize panel-based wizard
        goToStep(1);
        updateStepPills();
        return;
    }
    
    // Check if we're in single-page mode
    const singlePageMode = document.querySelector('.single-page-steps');
    if (singlePageMode) {
        // Set up single-page accordion mode
        // Step 1 should be active and enabled
        const step1 = document.querySelector('.menu-step-section[data-step="1"]');
        if (step1) {
            step1.classList.add('active');
            step1.classList.remove('disabled', 'completed');
        }
        
        // All other steps should be collapsed and disabled
        for (let i = 2; i <= 5; i++) {
            const step = document.querySelector(`.menu-step-section[data-step="${i}"]`);
            if (step) {
                step.classList.remove('active', 'completed');
                step.classList.add('disabled');
            }
        }
        
        // Clear selections
        document.querySelectorAll('.step-section-selection').forEach(el => {
            el.textContent = '';
        });
    } else {
        // Old multi-page mode
        goToStep(1);
    }
}

// Navigate to a specific step (updated for panel-based wizard)
function goToStep(stepNumber) {
    menuState.currentStep = stepNumber;
    
    // Check for new panel-based wizard
    const stepPanels = document.querySelector('.step-panels');
    if (stepPanels) {
        // Hide all panels
        document.querySelectorAll('.step-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Show current panel
        const currentPanel = document.getElementById(`panel-${stepNumber}`);
        if (currentPanel) {
            currentPanel.classList.add('active');
        }
        
        // Update step pills
        updateStepPills();
        return;
    }
    
    // Legacy code for old multi-step mode
    // Hide all steps
    document.querySelectorAll('.menu-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.getElementById(`step-${stepNumber}`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    // Update progress indicator
    updateProgressIndicator(stepNumber);
    
    // Scroll to top of menu
    const menuView = document.getElementById('subtab-find') || document.getElementById('subtab-flowchart');
    if (menuView) {
        menuView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Update step pills in horizontal bar
function updateStepPills() {
    const pills = document.querySelectorAll('.step-pill');
    const connectors = document.querySelectorAll('.step-bar .step-connector');
    
    pills.forEach((pill, index) => {
        const stepNum = index + 1;
        pill.classList.remove('active', 'completed', 'disabled');
        
        if (stepNum === menuState.currentStep) {
            pill.classList.add('active');
        } else if (stepNum < menuState.currentStep) {
            pill.classList.add('completed');
        } else {
            // Determine if step should be enabled based on previous steps
            let enabled = false;
            if (stepNum === 2 && menuState.selectedScreener) enabled = true;
            else if (stepNum === 3 && menuState.selectedSubtest) enabled = true;
            else if (stepNum === 4 && menuState.selectedPillars && menuState.selectedPillars.length > 0) enabled = true;
            else if (stepNum === 5 && menuState.selectedItemType) enabled = true;
            
            if (!enabled) {
                pill.classList.add('disabled');
            }
        }
    });
    
    // Update connectors
    connectors.forEach((connector, index) => {
        connector.classList.remove('active');
        if (index < menuState.currentStep - 1) {
            connector.classList.add('active');
        }
    });
}

// Update progress indicator
function updateProgressIndicator(currentStep) {
    document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
        const stepNum = index + 1;
        indicator.classList.remove('active', 'completed');
        
        if (stepNum === currentStep) {
            indicator.classList.add('active');
        } else if (stepNum < currentStep) {
            indicator.classList.add('completed');
        }
    });
    
    document.querySelectorAll('.step-connector').forEach((connector, index) => {
        connector.classList.remove('completed');
        if (index < currentStep - 1) {
            connector.classList.add('completed');
        }
    });
}

// Step 1: Select Screener
function selectScreener(screenerId) {
    console.log('Selected screener:', screenerId);
    
    if (!appState.interventionMenuData || !appState.interventionMenuData.screeners) {
        console.error('Intervention menu data not loaded');
        return;
    }
    
    // Find screener data
    const screenerData = appState.interventionMenuData.screeners.find(s => s.screener_id === screenerId);
    if (!screenerData) {
        console.error('Screener not found:', screenerId);
        return;
    }
    
    menuState.selectedScreener = screenerId;
    menuState.selectedScreenerData = screenerData;
    setRememberedScreener(screenerId);
    
    // Load subtests for step 2
    loadSubtests();
    
    // Update step sections and navigate
    updateStepSections();
    
    // Check for new panel-based wizard
    const stepWizard = document.querySelector('.step-wizard');
    if (stepWizard) {
        goToStep(2);
        return;
    }
    
    // Check if we're in single-page mode
    const singlePageMode = document.querySelector('.single-page-steps');
    if (singlePageMode) {
        // Collapse step 1 and expand step 2
        toggleStepSection(1);
        toggleStepSection(2);
    } else {
        // Old multi-page mode
        goToStep(2);
    }
}

// Load subtests for selected screener
function loadSubtests() {
    const container = document.getElementById('subtest-options');
    const screenerNameEl = document.getElementById('selected-screener-name');
    
    if (!container || !menuState.selectedScreenerData) return;
    
    // Update screener name
    if (screenerNameEl) {
        screenerNameEl.textContent = menuState.selectedScreenerData.screener_name;
    }
    
    // Check if we're using the new panel-based wizard
    const isNewWizard = document.querySelector('.step-wizard');
    
    // Generate subtest options
    const subtests = menuState.selectedScreenerData.subtests || [];
    
    if (isNewWizard) {
        // New compact button style
        container.innerHTML = subtests.map(subtest => {
            const escapedCode = escapeHtml(subtest.subtest_code);
            const escapedName = escapeHtml(subtest.subtest_name);
            return `
                <button class="subtest-btn" data-subtest-code="${escapedCode}">
                    <strong>${escapedCode}</strong>
                    <span>${escapedName}</span>
                </button>
            `;
        }).join('');
    } else {
        // Legacy card style
        container.innerHTML = subtests.map(subtest => {
            const escapedCode = escapeHtml(subtest.subtest_code);
            const escapedName = escapeHtml(subtest.subtest_name);
            const escapedDesc = escapeHtml(subtest.description);
            return `
                <button class="option-item" data-subtest-code="${escapedCode}">
                    <div class="option-item-content">
                        <div class="option-item-title">${escapedCode} - ${escapedName}</div>
                        <div class="option-item-subtitle">
                            Grades ${subtest.grade_range.start}-${subtest.grade_range.end} • 
                            ${escapedDesc}
                        </div>
                    </div>
                    <svg class="option-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </button>
            `;
        }).join('');
    }
    
    // Add event listeners (for both old and new styles)
    container.querySelectorAll('.option-item, .subtest-btn').forEach(button => {
        button.addEventListener('click', () => {
            selectSubtest(button.dataset.subtestCode);
        });
    });
}

// Step 2: Select Subtest
function selectSubtest(subtestCode) {
    console.log('Selected subtest:', subtestCode);
    
    if (!menuState.selectedScreenerData) return;
    
    // Find subtest data
    const subtestData = menuState.selectedScreenerData.subtests.find(s => s.subtest_code === subtestCode);
    if (!subtestData) {
        console.error('Subtest not found:', subtestCode);
        return;
    }
    
    menuState.selectedSubtest = subtestCode;
    menuState.selectedSubtestData = subtestData;
    
    // Load pillars for step 3
    loadPillars();
    
    // Update step sections and navigate
    updateStepSections();
    
    // Check for new panel-based wizard
    const stepWizard = document.querySelector('.step-wizard');
    if (stepWizard) {
        goToStep(3);
        return;
    }
    
    // Check if we're in single-page mode
    const singlePageMode = document.querySelector('.single-page-steps');
    if (singlePageMode) {
        // Collapse step 2 and expand step 3
        toggleStepSection(2);
        toggleStepSection(3);
    } else {
        // Old multi-page mode
        goToStep(3);
    }
}

// Load pillars for selected subtest
function loadPillars() {
    const infoContainer = document.getElementById('pillar-info');
    const optionsContainer = document.getElementById('pillar-options');
    
    if (!infoContainer || !optionsContainer || !menuState.selectedSubtestData) return;
    
    const pillars = menuState.selectedSubtestData.literacy_pillars || [];
    const isNewWizard = document.querySelector('.step-wizard');
    
    // Show info as chips for new wizard, or as text for legacy
    if (isNewWizard) {
        infoContainer.innerHTML = pillars.map(pillar => {
            const escapedPillar = escapeHtml(pillar);
            return `<span class="pillar-chip">${escapedPillar}</span>`;
        }).join('');
    } else {
        infoContainer.innerHTML = `
            <p><strong>${menuState.selectedSubtestData.subtest_name}</strong> measures: ${pillars.join(', ')}</p>
        `;
    }
    
    // If single pillar, auto-select it
    if (pillars.length === 1) {
        menuState.selectedPillars = [pillars[0]];
        if (isNewWizard) {
            optionsContainer.innerHTML = `
                <div class="pillar-checkbox-item">
                    <input type="checkbox" id="pillar-0" checked disabled>
                    <label for="pillar-0">${escapeHtml(pillars[0])}</label>
                </div>
            `;
        } else {
            optionsContainer.innerHTML = `
                <div class="checkbox-option checked">
                    <input type="checkbox" id="pillar-0" checked disabled>
                    <label for="pillar-0">${escapeHtml(pillars[0])}</label>
                </div>
            `;
        }
    } else {
        // Multiple pillars - show checkboxes
        menuState.selectedPillars = [...pillars]; // Select all by default
        
        if (isNewWizard) {
            optionsContainer.innerHTML = pillars.map((pillar, index) => {
                const escapedPillar = escapeHtml(pillar);
                return `
                    <div class="pillar-checkbox-item" data-pillar="${escapedPillar}" data-index="${index}">
                        <input type="checkbox" id="pillar-${index}" checked>
                        <label for="pillar-${index}">${escapedPillar}</label>
                    </div>
                `;
            }).join('');
        } else {
            optionsContainer.innerHTML = pillars.map((pillar, index) => {
                const escapedPillar = escapeHtml(pillar);
                return `
                    <div class="checkbox-option checked" data-pillar="${escapedPillar}" data-index="${index}">
                        <input type="checkbox" id="pillar-${index}" checked>
                        <label for="pillar-${index}">${escapedPillar}</label>
                    </div>
                `;
            }).join('');
        }
        
        // Add event listeners to checkboxes
        optionsContainer.querySelectorAll('.checkbox-option, .pillar-checkbox-item').forEach(option => {
            const checkbox = option.querySelector('input[type="checkbox"]');
            const pillarIndex = parseInt(option.dataset.index);
            const pillarName = pillars[pillarIndex];
            
            checkbox.addEventListener('change', (e) => {
                togglePillarCheckbox(pillarName, option, e.target.checked);
            });
        });
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getEvidenceBadgeHtml(evidenceLevel) {
    if (evidenceLevel !== '*' && evidenceLevel !== '**') return '';
    return `
        <span class="badge-evidence evidence-marker-group">
            <span class="evidence-marker-text">${escapeHtml(evidenceLevel)}</span>
            <button type="button" class="evidence-info-trigger" aria-label="Show evidence and research based definitions" onclick="event.stopPropagation();">
                <span class="material-symbols-rounded" aria-hidden="true">info</span>
            </button>
        </span>
    `;
}

function setupEvidenceDefinitionsPopup() {
    if (document.getElementById('evidence-definitions-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'evidence-definitions-modal';
    modal.className = 'evidence-definitions-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="evidence-definitions-dialog" role="dialog" aria-modal="true" aria-label="Evidence definitions">
            <button type="button" class="evidence-definitions-close" aria-label="Close">
                <span class="material-symbols-rounded" aria-hidden="true">close</span>
            </button>
            <div class="evidence-definition-block">
                <strong>* Evidence Based: Most rigorous and trusted</strong>
                <p>Definition: The program or practice has been tested through high-quality peer reviewed research (often randomized controlled trials or quasi-experimental studies) and has demonstrated statistically significant positive outcomes.</p>
            </div>
            <div class="evidence-definition-block">
                <strong>** Research Based: Less rigorous than evidence-based</strong>
                <p>Definition: The program is based on sound theories or methods that have been validated by some research, but the program itself may not have been directly studied for evidence of its effectiveness.</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.addEventListener('click', (event) => {
        const trigger = event.target.closest('.evidence-info-trigger');
        if (!trigger) return;
        const popup = document.getElementById('evidence-definitions-modal');
        if (!popup) return;
        popup.classList.add('active');
        popup.setAttribute('aria-hidden', 'false');
        document.body.classList.add('evidence-modal-open');
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.closest('.evidence-definitions-close')) {
            closeEvidenceDefinitionsPopup();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeEvidenceDefinitionsPopup();
        }
    });
}

function closeEvidenceDefinitionsPopup() {
    const modal = document.getElementById('evidence-definitions-modal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('evidence-modal-open');
}

// Toggle pillar checkbox selection
function togglePillarCheckbox(pillar, element, isChecked) {
    if (isChecked) {
        // Add to selection
        if (!menuState.selectedPillars.includes(pillar)) {
            menuState.selectedPillars.push(pillar);
        }
        element.classList.add('checked');
    } else {
        // Remove from selection
        menuState.selectedPillars = menuState.selectedPillars.filter(p => p !== pillar);
        element.classList.remove('checked');
    }
    
    console.log('Selected pillars:', menuState.selectedPillars);
}

// Validate and proceed from step 3
function proceedFromStep3() {
    if (menuState.selectedPillars.length === 0) {
        alert('Please select at least one literacy pillar to continue.');
        return;
    }
    
    // Update step sections
    updateStepSections();
    
    // Check for new panel-based wizard
    const stepWizard = document.querySelector('.step-wizard');
    if (stepWizard) {
        goToStep(4);
        return;
    }
    
    // Check if we're in single-page mode
    const singlePageMode = document.querySelector('.single-page-steps');
    if (singlePageMode) {
        // Collapse step 3 and expand step 4
        toggleStepSection(3);
        toggleStepSection(4);
    } else {
        // Old multi-page mode
        goToStep(4);
    }
}

// Step 4: Select Item Type
function selectItemType(type) {
    console.log('Selected item type:', type);
    
    menuState.selectedItemType = type;
    
    // Load and display results
    loadResults();
    
    // Update step sections
    updateStepSections();
    
    // Check for new panel-based wizard
    const stepWizard = document.querySelector('.step-wizard');
    if (stepWizard) {
        goToStep(5);
        return;
    }
    
    // Check if we're in single-page mode
    const singlePageMode = document.querySelector('.single-page-steps');
    if (singlePageMode) {
        // Collapse step 4 and expand step 5
        toggleStepSection(4);
        toggleStepSection(5);
    } else {
        // Old multi-page mode
        goToStep(5);
    }
}

// Helper function to check grade range overlap
function gradeRangeOverlaps(subtestStart, subtestEnd, itemStart, itemEnd) {
    // Convert grades to numbers for comparison (K=0, 1=1, etc.)
    const gradeToNum = (grade) => {
        if (grade === 'K' || grade === 'M') return 0;
        return parseInt(grade);
    };
    
    const subStart = gradeToNum(subtestStart);
    const subEnd = gradeToNum(subtestEnd);
    const itStart = gradeToNum(itemStart);
    const itEnd = gradeToNum(itemEnd);
    
    // Check if ranges overlap
    return itStart <= subEnd && itEnd >= subStart;
}

// Load and display results
function loadResults() {
    const breadcrumb = document.getElementById('results-breadcrumb');
    const summary = document.getElementById('step5-results-summary');
    const container = document.getElementById('step5-results-container');
    
    if (!container || !menuState.selectedScreenerData || !menuState.selectedSubtestData) return;
    
    // Update breadcrumb
    if (breadcrumb) {
        breadcrumb.innerHTML = `
            <strong>${menuState.selectedScreenerData.screener_name}</strong> > 
            <strong>${menuState.selectedSubtestData.subtest_code}</strong> > 
            <strong>${menuState.selectedPillars.join(', ')}</strong> > 
            <strong>${menuState.selectedItemType}</strong>
        `;
    }
    
    // Get program based on screener language
    const program = menuState.selectedScreenerData.language === 'English' ? 'English' : 'French Immersion';
    
    // Get subtest grade range
    const subtestGradeStart = menuState.selectedSubtestData.grade_range.start;
    const subtestGradeEnd = menuState.selectedSubtestData.grade_range.end;
    
    // Filter results
    let results = [];
    if (menuState.selectedItemType === 'Assessment') {
        results = (appState.interventionMenuData.assessments || []).filter(item => {
            // Check program match
            if (item.program !== program) return false;
            
            // Check grade range overlap
            if (!gradeRangeOverlaps(subtestGradeStart, subtestGradeEnd, 
                                   item.grade_range.start, item.grade_range.end)) {
                return false;
            }
            
            // Check pillar match
            const itemPillars = item.literacy_pillars || [item.literacy_pillar];
            return menuState.selectedPillars.some(pillar => itemPillars.includes(pillar));
        });
    } else {
        // Intervention
        results = (appState.interventionMenuData.interventions || []).filter(item => {
            // Check program match
            if (item.program !== program) return false;
            
            // Check grade range overlap
            if (!gradeRangeOverlaps(subtestGradeStart, subtestGradeEnd,
                                   item.grade_range.start, item.grade_range.end)) {
                return false;
            }
            
            // Check pillar match (interventions can have multiple pillars)
            const itemPillars = item.literacy_pillars || [];
            return menuState.selectedPillars.some(pillar => itemPillars.includes(pillar));
        });
    }
    
    // Sort by evidence level, then name
    results.sort((a, b) => {
        // Evidence level priority: ** > * > none
        const evidenceOrder = { '**': 3, '*': 2, 'none': 1 };
        const aEvidence = evidenceOrder[a.evidence_level] || 1;
        const bEvidence = evidenceOrder[b.evidence_level] || 1;
        
        if (aEvidence !== bEvidence) {
            return bEvidence - aEvidence; // Higher first
        }
        
        return a.name.localeCompare(b.name);
    });
    
    // Update summary
    if (summary) {
        summary.innerHTML = `
            <p><strong>${results.length}</strong> result${results.length !== 1 ? 's' : ''} found</p>
        `;
    }
    
    // Display results
    if (results.length === 0) {
        container.innerHTML = `
            <div class="results-empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                </svg>
                <p>No results found for this combination. Try selecting different pillars or starting a new search.</p>
            </div>
        `;
        return;
    }
    
    // Render as compact expandable list
    container.innerHTML = `
        <div class="results-grid-compact">
            ${results.map((item, index) => {
                const pillars = item.literacy_pillars || [item.literacy_pillar];
                const evidenceBadge = getEvidenceBadgeHtml(item.evidence_level);
                
                // Escape and validate data
                const itemName = escapeHtml(item.name);
                const itemProgram = escapeHtml(item.program);
                const escapedPillars = pillars.map(p => escapeHtml(p)).join(', ');
                
                // Validate URL (only allow http/https)
                let safeUrl = '';
                let isLocalResource = false;
                if (item.url) {
                    if (item.url === '(SharePoint)' || item.url === '(local resource)' || item.url === '(Nelson)') {
                        isLocalResource = true;
                    } else {
                        try {
                            const url = new URL(item.url);
                            if (url.protocol === 'http:' || url.protocol === 'https:') {
                                safeUrl = item.url;
                            }
                        } catch (e) {
                            // Invalid URL, leave empty
                        }
                    }
                }
                
                return `
                    <div class="result-card-compact" data-index="${index}">
                        <div class="result-header-compact" onclick="toggleResultExpand(${index})">
                            <div>
                                <h4 class="result-name-compact">${itemName}</h4>
                                <div class="result-meta-compact">
                                    <span class="badge-grade">${item.grade_range.start}-${item.grade_range.end}</span>
                                    <span class="badge-program">${itemProgram === 'English' ? 'EN' : 'FR'}</span>
                                    ${evidenceBadge}
                                </div>
                            </div>
                            <svg class="result-expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 9l-7 7-7-7"/>
                            </svg>
                        </div>
                        <div class="result-details-compact">
                            <div class="result-info"><strong>Addresses:</strong> ${escapedPillars}</div>
                            ${safeUrl ? `
                                <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="result-link-compact" onclick="event.stopPropagation()">
                                    View Resource
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                                        <path d="M15 3h6v6"/>
                                        <path d="M10 14L21 3"/>
                                    </svg>
                                </a>
                            ` : isLocalResource ? `
                                <div class="result-local-compact">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                    Available on ${item.url}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Restart menu
function restartMenu() {
    initializeStepBasedMenu();
}

// ===== NEW SINGLE-PAGE ACCORDION FUNCTIONS =====

function toggleStepSection(stepNumber) {
    const section = document.querySelector(`.menu-step-section[data-step="${stepNumber}"]`);
    if (!section) return;
    
    // Don't allow toggling if section is disabled
    if (section.classList.contains('disabled')) return;
    
    // Toggle active class
    const wasActive = section.classList.contains('active');
    
    // Close all other sections
    document.querySelectorAll('.menu-step-section').forEach(s => {
        if (s !== section) {
            s.classList.remove('active');
        }
    });
    
    // Toggle this section
    if (wasActive) {
        section.classList.remove('active');
    } else {
        section.classList.add('active');
        // Scroll section into view
        setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

function updateStepSections() {
    // Update step 1
    const step1 = document.querySelector('.menu-step-section[data-step="1"]');
    if (step1) {
        const selection1 = document.getElementById('step-1-selection');
        if (menuState.selectedScreenerData) {
            if (selection1) selection1.textContent = menuState.selectedScreenerData.name;
            step1.classList.add('completed');
            step1.classList.remove('disabled');
        } else {
            if (selection1) selection1.textContent = '';
            step1.classList.remove('completed');
        }
    }
    
    // Update step 2
    const step2 = document.querySelector('.menu-step-section[data-step="2"]');
    if (step2) {
        const selection2 = document.getElementById('step-2-selection');
        if (menuState.selectedSubtestData) {
            if (selection2) selection2.textContent = menuState.selectedSubtestData.name;
            step2.classList.add('completed');
            step2.classList.remove('disabled');
        } else {
            if (selection2) selection2.textContent = '';
            step2.classList.remove('completed');
        }
        
        // Enable/disable step 2 based on step 1
        if (menuState.selectedScreener) {
            step2.classList.remove('disabled');
        } else {
            step2.classList.add('disabled');
        }
    }
    
    // Update step 3
    const step3 = document.querySelector('.menu-step-section[data-step="3"]');
    if (step3) {
        const selection3 = document.getElementById('step-3-selection');
        if (menuState.selectedPillars && menuState.selectedPillars.length > 0) {
            if (selection3) selection3.textContent = menuState.selectedPillars.join(', ');
            step3.classList.add('completed');
            step3.classList.remove('disabled');
        } else {
            if (selection3) selection3.textContent = '';
            step3.classList.remove('completed');
        }
        
        // Enable/disable step 3 based on step 2
        if (menuState.selectedSubtest) {
            step3.classList.remove('disabled');
        } else {
            step3.classList.add('disabled');
        }
    }
    
    // Update step 4
    const step4 = document.querySelector('.menu-step-section[data-step="4"]');
    if (step4) {
        const selection4 = document.getElementById('step-4-selection');
        if (menuState.selectedItemType) {
            if (selection4) selection4.textContent = menuState.selectedItemType;
            step4.classList.add('completed');
            step4.classList.remove('disabled');
        } else {
            if (selection4) selection4.textContent = '';
            step4.classList.remove('completed');
        }
        
        // Enable/disable step 4 based on step 3
        if (menuState.selectedPillars && menuState.selectedPillars.length > 0) {
            step4.classList.remove('disabled');
        } else {
            step4.classList.add('disabled');
        }
    }
    
    // Update step 5
    const step5 = document.querySelector('.menu-step-section[data-step="5"]');
    if (step5) {
        const selection5 = document.getElementById('step-5-selection');
        
        // Enable/disable step 5 based on step 4
        if (menuState.selectedItemType) {
            step5.classList.remove('disabled');
            if (selection5) {
                const breadcrumb = `${menuState.selectedScreenerData?.name} > ${menuState.selectedSubtestData?.name} > ${menuState.selectedPillars?.join(', ')} > ${menuState.selectedItemType}`;
                selection5.textContent = '';
            }
        } else {
            step5.classList.add('disabled');
            if (selection5) selection5.textContent = '';
        }
    }
}

function toggleResultExpand(index) {
    const card = document.querySelectorAll('.result-card-compact')[index];
    if (card) {
        card.classList.toggle('expanded');
    }
}

function restartMenu() {
    initializeStepBasedMenu();
}

// Update openInterventionsMenuView to initialize the new menu
window.openInterventionsMenuView = function() {
    // No-op for navigation in new design
};

// ============================================
// Export for global use
// ============================================
window.navigateToPage = navigateToPage;
window.selectTier = selectTier;
window.selectScreener = selectScreener;
window.selectTestArea = selectTestArea;
window.goBackInFlow = goBackInFlow;
window.resetFlowchart = resetFlowchart;
window.exportFlowchart = exportFlowchart;
window.exportInterventions = exportInterventions;
window.toggleFAQ = toggleFAQ;
window.startTier1Flowchart = startTier1Flowchart;
window.startTier2Flowchart = startTier2Flowchart;
window.startTier3Flowchart = startTier3Flowchart;
window.openInterventionsMenu = openInterventionsMenu;
window.closeTierFlowchart = closeTierFlowchart;
window.updateTier1Progress = updateTier1Progress;
window.updateTier2Progress = updateTier2Progress;
window.proceedToTier1Screener = proceedToTier1Screener;
window.proceedToTier2Assessment = proceedToTier2Assessment;
window.proceedToTier3Assessment = proceedToTier3Assessment;
window.backToTier1Step1 = backToTier1Step1;
window.selectTier1Screener = selectTier1Screener;
window.tier1InstructionEffective = tier1InstructionEffective;
window.tier1InstructionIneffective = tier1InstructionIneffective;
window.tier1LessThan20Percent = tier1LessThan20Percent;
window.tier1MoreThan20Percent = tier1MoreThan20Percent;
window.selectTier2Assessment = selectTier2Assessment;
window.proceedToTier2Intervention = proceedToTier2Intervention;
window.selectTier2Intervention = selectTier2Intervention;
window.proceedToTier2ProgressMonitoring = proceedToTier2ProgressMonitoring;
window.tier2StudentImproved = tier2StudentImproved;
window.tier2StudentDidNotImprove = tier2StudentDidNotImprove;
window.startTier2Cycle2 = startTier2Cycle2;
window.selectTier3Assessment = selectTier3Assessment;
window.proceedToTier3Intervention = proceedToTier3Intervention;
window.selectTier3Intervention = selectTier3Intervention;
window.proceedToTier3ProgressMonitoring = proceedToTier3ProgressMonitoring;
window.tier3StudentImproved = tier3StudentImproved;
window.tier3StudentDidNotImprove = tier3StudentDidNotImprove;

// Visual Flowchart exports
window.initVisualFlowchart = initVisualFlowchart;
window.closeVisualFlowchart = closeVisualFlowchart;
window.updateChecklistProgress = updateChecklistProgress;
window.proceedFromChecklist = proceedFromChecklist;
window.proceedFromInfo = proceedFromInfo;
window.selectFlowchartOption = selectFlowchartOption;
window.makeDecision = makeDecision;
window.selectTier1ScreenerVisual = selectTier1ScreenerVisual;
window.selectTier2AssessmentVisual = selectTier2AssessmentVisual;
window.selectTier2InterventionVisual = selectTier2InterventionVisual;
window.selectTier3AssessmentVisual = selectTier3AssessmentVisual;
window.selectTier3InterventionVisual = selectTier3InterventionVisual;
window.startTier2Visual = startTier2Visual;
window.startTier3Visual = startTier3Visual;
window.restartTier1Visual = restartTier1Visual;
window.restartTier2Visual = restartTier2Visual;
window.showInterventionView = showInterventionView;
window.openTierFlowchart = openTierFlowchart;
window.returnToInterventionsOptions = returnToInterventionsOptions;
window.activateSubTab = activateSubTab;
window.navigateToFlowchart = navigateToFlowchart;
window.navigateToFindInterventions = navigateToFindInterventions;

// Integrated flowchart exports
window.openInteractiveFlowchart = openInteractiveFlowchart;
window.initIntegratedFlowchart = initIntegratedFlowchart;
window.closeIntegratedFlowchart = closeIntegratedFlowchart;
window.switchToTier = switchToTier;
window.restartCurrentTier = restartCurrentTier;
window.undoToStep = undoToStep;
window.goToPreviousStep = goToPreviousStep;
window.proceedFromIntegratedChecklist = proceedFromIntegratedChecklist;
window.proceedFromIntegratedInfo = proceedFromIntegratedInfo;
window.selectIntegratedOption = selectIntegratedOption;
window.makeIntegratedDecision = makeIntegratedDecision;
window.fwOnScreenerChange = fwOnScreenerChange;
window.fwOnSubtestChange = fwOnSubtestChange;
window.fwOnPillarChange = fwOnPillarChange;
window.fwSelectItem = fwSelectItem;
window.showFinalSummary = showFinalSummary;
window.selectTier1ScreenerVisualIntegrated = selectTier1ScreenerVisualIntegrated;
window.selectTier2AssessmentVisualIntegrated = selectTier2AssessmentVisualIntegrated;
window.selectTier2InterventionVisualIntegrated = selectTier2InterventionVisualIntegrated;
window.selectTier3AssessmentVisualIntegrated = selectTier3AssessmentVisualIntegrated;
window.selectTier3InterventionVisualIntegrated = selectTier3InterventionVisualIntegrated;
window.startTier2VisualIntegrated = startTier2VisualIntegrated;
window.startTier3VisualIntegrated = startTier3VisualIntegrated;
window.restartTier1VisualIntegrated = restartTier1VisualIntegrated;
window.restartTier2VisualIntegrated = restartTier2VisualIntegrated;

// New step-based intervention menu exports
window.initializeStepBasedMenu = initializeStepBasedMenu;
window.selectScreener = selectScreener;
window.selectSubtest = selectSubtest;
window.selectItemType = selectItemType;
window.goToStep = goToStep;
window.proceedFromStep3 = proceedFromStep3;
window.restartMenu = restartMenu;
window.toggleStepSection = toggleStepSection;
window.toggleResultExpand = toggleResultExpand;

// ============================================
// DROPDOWN WIZARD FUNCTIONS
// ============================================

function onScreenerDropdownChange(screenerId) {
    if (!screenerId) {
        resetDropdownsFrom('subtest');
        return;
    }
    
    console.log('Dropdown: Selected screener:', screenerId);
    
    if (!appState.interventionMenuData || !appState.interventionMenuData.screeners) {
        console.error('Intervention menu data not loaded');
        return;
    }
    
    const screenerData = appState.interventionMenuData.screeners.find(s => s.screener_id === screenerId);
    if (!screenerData) {
        console.error('Screener not found:', screenerId);
        return;
    }
    
    menuState.selectedScreener = screenerId;
    menuState.selectedScreenerData = screenerData;

    // Keep the remembered screener in sync across the app.
    setRememberedScreener(screenerId);
    
    // Populate subtest dropdown
    const subtestSelect = document.getElementById('subtest-select');
    if (subtestSelect) {
        subtestSelect.innerHTML = '<option value="">Select...</option>';
        const subtests = screenerData.subtests || [];
        subtests.forEach(subtest => {
            const option = document.createElement('option');
            option.value = subtest.subtest_code;
            option.textContent = `${subtest.subtest_code} - ${subtest.subtest_name}`;
            subtestSelect.appendChild(option);
        });
        subtestSelect.disabled = false;
    }
    
    // Reset downstream dropdowns
    resetDropdownsFrom('pillar');
}

function onSubtestDropdownChange(subtestCode) {
    if (!subtestCode) {
        resetDropdownsFrom('pillar');
        return;
    }
    
    console.log('Dropdown: Selected subtest:', subtestCode);
    
    if (!menuState.selectedScreenerData) return;
    
    const subtestData = menuState.selectedScreenerData.subtests.find(s => s.subtest_code === subtestCode);
    if (!subtestData) {
        console.error('Subtest not found:', subtestCode);
        return;
    }
    
    menuState.selectedSubtest = subtestCode;
    menuState.selectedSubtestData = subtestData;
    
    // Populate pillar dropdown
    const pillarSelect = document.getElementById('pillar-select');
    if (pillarSelect) {
        pillarSelect.innerHTML = '<option value="">Select...</option>';
        const pillars = subtestData.literacy_pillars || [];
        
        // Add "All Pillars" option if multiple
        if (pillars.length > 1) {
            const allOption = document.createElement('option');
            allOption.value = 'ALL';
            allOption.textContent = 'All Pillars';
            pillarSelect.appendChild(allOption);
        }
        
        pillars.forEach(pillar => {
            const option = document.createElement('option');
            option.value = pillar;
            option.textContent = pillar;
            pillarSelect.appendChild(option);
        });
        
        pillarSelect.disabled = false;
        
        // Auto-select if only one pillar
        if (pillars.length === 1) {
            pillarSelect.value = pillars[0];
            onPillarDropdownChange(pillars[0]);
            return; // Don't reset type dropdown when auto-selecting
        }
    }
    
    // Reset downstream dropdowns
    resetDropdownsFrom('type');
}

function onPillarDropdownChange(pillarValue) {
    if (!pillarValue) {
        resetDropdownsFrom('type');
        return;
    }
    
    console.log('Dropdown: Selected pillar:', pillarValue);
    
    if (pillarValue === 'ALL') {
        menuState.selectedPillars = [...(menuState.selectedSubtestData?.literacy_pillars || [])];
    } else {
        menuState.selectedPillars = [pillarValue];
    }
    
    // Enable type dropdown
    const typeSelect = document.getElementById('type-select');
    if (typeSelect) {
        typeSelect.value = '';
        typeSelect.disabled = false;
    }
    menuState.selectedItemType = null;
    
    // Hide results
    const resultsSection = document.getElementById('dropdown-results');
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }
}

function onTypeDropdownChange(typeValue) {
    if (!typeValue) {
        const resultsSection = document.getElementById('dropdown-results');
        if (resultsSection) {
            resultsSection.style.display = 'none';
        }
        return;
    }
    
    console.log('Dropdown: Selected type:', typeValue);
    
    menuState.selectedItemType = typeValue;
    
    // Load and display results
    loadDropdownResults();
}

function loadDropdownResults() {
    const resultsSection = document.getElementById('dropdown-results');
    const countEl = document.getElementById('results-count-compact');
    const listEl = document.getElementById('results-list-compact');
    
    if (!resultsSection || !listEl || !menuState.selectedSubtestData) return;
    
    // Get program based on screener language
    const program = menuState.selectedScreenerData?.language === 'English' ? 'English' : 'French Immersion';
    
    // Get subtest grade range
    const subtestStart = menuState.selectedSubtestData.grade_range?.start;
    const subtestEnd = menuState.selectedSubtestData.grade_range?.end;
    
    // Get items from the correct data source
    let items = [];
    if (menuState.selectedItemType === 'Assessment') {
        items = appState.interventionMenuData?.assessments || [];
    } else {
        items = appState.interventionMenuData?.interventions || [];
    }
    
    // Filter by program
    let filtered = items.filter(item => item.program === program);
    
    // Filter by grade range
    filtered = filtered.filter(item => {
        const itemStart = item.grade_range?.start;
        const itemEnd = item.grade_range?.end;
        return gradeRangeOverlaps(subtestStart, subtestEnd, itemStart, itemEnd);
    });
    
    // Filter by selected pillars
    if (menuState.selectedPillars && menuState.selectedPillars.length > 0) {
        filtered = filtered.filter(item => {
            const itemPillars = item.literacy_pillars || [item.literacy_pillar];
            return menuState.selectedPillars.some(p => itemPillars.includes(p));
        });
    }
    
    // Update count
    if (countEl) {
        countEl.textContent = `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`;
    }
    
    // Render compact results
    listEl.innerHTML = filtered.map(item => {
        const gradeText = `${item.grade_range?.start || 'K'}-${item.grade_range?.end || '12'}`;
        const langBadge = program === 'French Immersion' ? 'FR' : 'EN';
        
        return `
            <div class="result-row">
                <span class="result-name-compact">${escapeHtml(item.name)}</span>
                <div class="result-badges">
                    <span class="result-badge grade">${gradeText}</span>
                    <span class="result-badge lang">${langBadge}</span>
                </div>
            </div>
        `;
    }).join('');
    
    // Show results
    resultsSection.style.display = 'block';
}

function resetDropdownsFrom(startFrom) {
    const order = ['subtest', 'pillar', 'type'];
    const startIndex = order.indexOf(startFrom);
    
    if (startIndex === -1) return;
    
    for (let i = startIndex; i < order.length; i++) {
        const select = document.getElementById(`${order[i]}-select`);
        if (select) {
            select.value = '';
            select.disabled = true;
            if (order[i] !== 'type') {
                select.innerHTML = '<option value="">Select...</option>';
            }
        }
    }
    
    // Clear state
    if (startFrom === 'subtest' || startFrom === 'pillar' || startFrom === 'type') {
        if (startFrom === 'subtest') {
            menuState.selectedSubtest = null;
            menuState.selectedSubtestData = null;
        }
        if (startFrom === 'subtest' || startFrom === 'pillar') {
            menuState.selectedPillars = [];
        }
        if (startFrom === 'subtest' || startFrom === 'pillar' || startFrom === 'type') {
            menuState.selectedItemType = null;
        }
    }
    
    // Hide results
    const resultsSection = document.getElementById('dropdown-results');
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }
}

function initializeDropdownWizard() {
    // Reset all state
    menuState.currentStep = 1;
    menuState.selectedScreener = null;
    menuState.selectedScreenerData = null;
    menuState.selectedSubtest = null;
    menuState.selectedSubtestData = null;
    menuState.selectedPillars = [];
    menuState.selectedItemType = null;
    
    // Reset language filter
    const languageFilter = document.getElementById('language-filter');
    if (languageFilter) {
        languageFilter.value = '';
    }
    
    // Reset screener dropdown and repopulate with all screeners
    const screenerSelect = document.getElementById('screener-select');
    if (screenerSelect) {
        screenerSelect.value = '';
        // Trigger language filter to repopulate all screeners
        onLanguageFilterChange('');
    }
    
    resetDropdownsFrom('subtest');

    // If the user already chose a screener (e.g. in the flowchart), pre-select it
    // here for convenience so they don't have to choose it again.
    applyRememberedScreenerToMenu();
}

// Pre-select the remembered screener in the interventions menu dropdown wizard
// and populate its dependent dropdowns, mirroring a manual selection.
function applyRememberedScreenerToMenu() {
    const remembered = getRememberedScreenerId();
    if (!remembered) return;
    const screenerSelect = document.getElementById('screener-select');
    if (!screenerSelect) return;
    // Don't clobber a selection the user is already working with.
    if (screenerSelect.value) return;
    // Only apply if the screener exists as an option in the current list.
    const hasOption = Array.from(screenerSelect.options).some(o => o.value === remembered);
    if (!hasOption) return;
    screenerSelect.value = remembered;
    onScreenerDropdownChange(remembered);
}

// Override restartMenu to work with dropdown wizard
function restartMenu() {
    const dropdownWizard = document.querySelector('.dropdown-wizard');
    if (dropdownWizard) {
        initializeDropdownWizard();
    } else {
        initializeStepBasedMenu();
    }
}

// Override openInterventionsMenuView to initialize dropdown wizard
window.openInterventionsMenuView = function() {
    // No-op for navigation (sub-tabs handle it in new design)
    // Just initialize the dropdown wizard if present
    const dropdownWizard = document.querySelector('.dropdown-wizard');
    if (dropdownWizard) {
        initializeDropdownWizard();
    }
};

// Language filter function
function onLanguageFilterChange(language) {
    const screenerSelect = document.getElementById('screener-select');
    if (!screenerSelect) return;
    
    // Use shared helper to build dropdown HTML
    screenerSelect.innerHTML = buildScreenerDropdownHtml(language);
    
    // Reset downstream dropdowns
    resetDropdownsFrom('subtest');
}

// Export new dropdown functions
window.onScreenerDropdownChange = onScreenerDropdownChange;
window.onSubtestDropdownChange = onSubtestDropdownChange;
window.onPillarDropdownChange = onPillarDropdownChange;
window.onTypeDropdownChange = onTypeDropdownChange;
window.onLanguageFilterChange = onLanguageFilterChange;
window.initializeDropdownWizard = initializeDropdownWizard;
window.restartMenu = restartMenu;



// ============================================
// ASSESSMENT SCHEDULES MODULE
// ============================================

// Store schedules data
let schedulesData = null;

// Fetch assessment schedules data
async function fetchSchedules() {
    try {
        const response = await fetch('data/assessment-schedules.json');
        if (!response.ok) throw new Error('Failed to load assessment schedules data');
        schedulesData = await response.json();
        console.log('Assessment schedules data loaded successfully');
        return schedulesData;
    } catch (error) {
        console.error('Error loading assessment schedules data:', error);
        return null;
    }
}

// Render the calendar view - COMPLETELY REDESIGNED
function renderScheduleCalendar(data) {
    const container = document.getElementById('calendar-container');
    if (!container || !data) return;
    
    let html = '';
    
    // Render each program
    data.programs.forEach(program => {
        html += `
            <div class="schedule-program">
                <h3 class="program-title">
                    <svg class="program-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${program.id === 'english' 
                            ? '<path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>'
                            : '<path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01M16 17h.01"/>'
                        }
                    </svg>
                    ${safeText(program.name)}
                </h3>
                <div class="grade-cards">
        `;
        
        // Render each grade as a card
        program.grades.forEach(grade => {
            const assessments = grade.events.filter(e => e.type === 'assessment');
            const reports = grade.events.find(e => e.type === 'report');
            const intervention = grade.events.find(e => e.type === 'intervention');
            
            html += `
                <div class="grade-card">
                    <div class="grade-header">${safeText(grade.label)}</div>
                    <div class="timeline">
            `;
            
            // Render assessments
            assessments.forEach(assessment => {
                const color = data.legend.assessmentColors[assessment.label] || 'gray';
                html += `
                    <div class="timeline-item">
                        <div class="assessment-badge ${color}">
                            ${safeText(assessment.label)}
                        </div>
                        <div class="period-label">${safeText(assessment.period)}</div>
                        ${assessment.note ? `<div class="note">${safeText(assessment.note)}</div>` : ''}
                    </div>
                `;
            });
            
            // Render intervention period
            if (intervention) {
                html += `
                    <div class="timeline-item intervention">
                        <div class="intervention-label">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <rect x="0" y="7" width="16" height="2" rx="1"/>
                            </svg>
                            Intervention Period
                        </div>
                        <div class="period-label">${intervention.start} - ${intervention.end}</div>
                    </div>
                `;
            }
            
            // Render report cards
            if (reports && reports.periods) {
                html += `
                    <div class="timeline-item reports">
                        <div class="report-label">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                                <circle cx="8" cy="8" r="6"/>
                                <path d="M6 8l2 2 4-4"/>
                            </svg>
                            Report Cards
                        </div>
                        <div class="period-label">${reports.periods.join(', ')}</div>
                    </div>
                `;
            }
            
            html += `
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Render legend
    renderLegend(data);
}

// Render the legend
function renderLegend(data) {
    const container = document.getElementById('calendar-legend');
    if (!container || !data) return;
    
    // Get unique assessment types
    const assessmentTypes = new Set();
    Object.keys(data.legend.assessmentColors).forEach(key => {
        assessmentTypes.add(key.replace('*', ''));
    });
    
    let html = `
        <div class="legend-section">
            <h4 class="legend-title">Assessment Types</h4>
            <div class="legend-items">
    `;
    
    Array.from(assessmentTypes).forEach(label => {
        const color = data.legend.assessmentColors[label] || 'gray';
        html += `
            <div class="legend-item">
                <span class="legend-badge ${color}">${safeText(label)}</span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    if (data.notes && data.notes.length > 0) {
        html += `
            <div class="legend-section notes-section">
                <h4 class="legend-title">Notes</h4>
        `;
        
        data.notes.forEach(note => {
            html += `<p class="note-text">${safeText(note)}</p>`;
        });
        
        html += `
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Render the table view
function renderScheduleTable(data) {
    const container = document.getElementById('table-container');
    if (!container || !data) return;
    
    let html = '';
    
    // Render each program
    data.programs.forEach(program => {
        html += `
            <div class="program-block">
                <div class="program-header">
                    <svg class="program-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${program.id === 'english' 
                            ? '<path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>'
                            : '<path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01M16 17h.01"/>'
                        }
                    </svg>
                    <h3>${safeText(program.name)}</h3>
                </div>
                <div class="schedule-table">
                    <div class="schedule-row header">
                        <div class="schedule-cell">Grade Level</div>
                        <div class="schedule-cell">Assessments</div>
                        <div class="schedule-cell">Timing</div>
                    </div>
        `;
        
        program.grades.forEach(grade => {
            const assessments = grade.events.filter(e => e.type === 'assessment');
            const assessmentsList = assessments.map(a => a.label).join(', ');
            const timingList = [...new Set(assessments.map(a => a.period))].join(', ');
            
            html += `
                <div class="schedule-row">
                    <div class="schedule-cell"><strong>${safeText(grade.label)}</strong></div>
                    <div class="schedule-cell">${safeText(assessmentsList)}</div>
                    <div class="schedule-cell">${safeText(timingList)}</div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Setup schedule toggle
function applyScheduleToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-segment');
    const calendarView = document.getElementById('schedule-calendar-view');
    const tableView = document.getElementById('schedule-table-view');
    
    if (!toggleButtons.length || !calendarView || !tableView) return;
    
    // Restore saved preference or default to calendar
    const savedView = localStorage.getItem('schedule_view_preference') || 'calendar';
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const view = button.dataset.view;
            
            // Update active state
            toggleButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            
            // Show/hide views
            if (view === 'calendar') {
                calendarView.classList.add('active');
                tableView.classList.remove('active');
                calendarView.removeAttribute('hidden');
                tableView.setAttribute('hidden', '');
            } else {
                calendarView.classList.remove('active');
                tableView.classList.add('active');
                calendarView.setAttribute('hidden', '');
                tableView.removeAttribute('hidden');
            }
            
            // Save preference
            localStorage.setItem('schedule_view_preference', view);
        });
        
        // Set initial state
        if (button.dataset.view === savedView) {
            button.click();
        }
    });
    
    // Add keyboard navigation for toggle
    const toggleContainer = document.querySelector('.schedule-toggle');
    if (toggleContainer) {
        toggleContainer.addEventListener('keydown', (e) => {
            const buttons = Array.from(toggleButtons);
            const currentIndex = buttons.findIndex(btn => btn.classList.contains('active'));
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = e.key === 'ArrowLeft' 
                    ? (currentIndex - 1 + buttons.length) % buttons.length
                    : (currentIndex + 1) % buttons.length;
                buttons[nextIndex].click();
                buttons[nextIndex].focus();
            }
        });
    }
}

// Safe text helper to prevent XSS
function safeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize assessment schedules
async function initializeAssessmentSchedules() {
    const data = await fetchSchedules();
    if (data) {
        renderScheduleCalendar(data);
        renderScheduleTable(data);
        applyScheduleToggle();
    }
}

// Export functions
window.initializeAssessmentSchedules = initializeAssessmentSchedules;

// ============================================
// SELECTION HISTORY TRACKER
// ============================================
// Records every drill-down assessment and intervention the teacher selects in
// the flowchart, persists it to localStorage (so it survives navigation and
// reloads), and surfaces it in an always-accessible side panel. Teachers can
// add notes to each entry and export the whole history as a CSV file.

const SELECTION_HISTORY_KEY = 'litlab_selection_history';

// Load the saved selection history from localStorage (returns an array).
function loadSelectionHistory() {
    try {
        const raw = localStorage.getItem(SELECTION_HISTORY_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.error('Could not read selection history:', err);
        return [];
    }
}

// Persist the selection history array to localStorage.
function saveSelectionHistory(history) {
    try {
        localStorage.setItem(SELECTION_HISTORY_KEY, JSON.stringify(history));
    } catch (err) {
        console.error('Could not save selection history:', err);
    }
}

// Turn a tierId such as "tier2" into a friendly label such as "Tier 2".
function tierLabelFromId(tierId) {
    const num = String(tierId || '').replace('tier', '');
    return num ? `Tier ${num}` : '';
}

// Record a drill-down assessment or intervention selection.
function recordSelection(type, itemId, itemName, tierId) {
    if (!itemName) return;
    const history = loadSelectionHistory();
    // Capture the screener that was active for this selection so entries can be
    // grouped by screener in the history panel.
    const screenerId = appState.fwState?.screener || getRememberedScreenerId() || '';
    const screenerName = appState.fwState?.screenerData?.screener_name || getScreenerName(screenerId) || '';
    const entry = {
        id: `sel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: type || 'Selection',
        itemId: itemId || '',
        name: itemName,
        tier: tierLabelFromId(tierId),
        screener: screenerName,
        date: new Date().toISOString(),
        notes: ''
    };
    history.push(entry);
    saveSelectionHistory(history);
    renderHistoryPanel();
    // Glow the history tab to signal a new entry, leaving it until the user opens
    // the panel, rather than popping the whole panel open.
    markHistoryUnseen();
}

// Format an ISO date string for display.
function formatHistoryDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit'
    });
}

// Render the history list and count badge inside the static panel shell.
function renderHistoryPanel() {
    const list = document.getElementById('selection-tracker-list');
    const countEl = document.getElementById('selection-tracker-count');
    const history = loadSelectionHistory();

    if (countEl) {
        countEl.textContent = String(history.length);
        countEl.classList.toggle('is-empty', history.length === 0);
    }

    if (!list) return;

    if (history.length === 0) {
        list.innerHTML = `
            <div class="history-empty">
                <p>No drill-downs or interventions selected yet.</p>
                <p class="history-empty-hint">Your selections from the flowchart will appear here.</p>
            </div>`;
        return;
    }

    // Newest first, grouped into sections by the screener that was active.
    const ordered = history.slice().reverse();

    const renderEntry = (entry) => {
        const tierNum = String(entry.tier || '').replace(/\D/g, '');
        const tierClass = tierNum ? `history-tier-${tierNum}` : '';
        const typeLabel = entry.type === 'Assessment' ? 'Drill-Down Assessment' : (entry.type || 'Selection');
        return `
            <div class="history-entry ${tierClass}" data-entry-id="${escapeHtml(entry.id)}">
                <div class="history-entry-top">
                    <span class="history-entry-type">${escapeHtml(typeLabel)}</span>
                    ${entry.tier ? `<span class="history-entry-tier">${escapeHtml(entry.tier)}</span>` : ''}
                    <button class="history-entry-delete" title="Remove this entry" aria-label="Remove this entry" onclick="deleteHistoryEntry('${escapeHtml(entry.id)}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                </div>
                <div class="history-entry-name">${escapeHtml(entry.name)}</div>
                <div class="history-entry-date">Selected: ${escapeHtml(formatHistoryDate(entry.date))}</div>
                <textarea class="history-entry-notes" rows="2" placeholder="Add notes about this selection…" oninput="updateHistoryNote('${escapeHtml(entry.id)}', this.value)">${escapeHtml(entry.notes || '')}</textarea>
            </div>`;
    };

    // Preserve the order in which each screener group first appears (newest first).
    const groups = [];
    const groupIndex = {};
    ordered.forEach(entry => {
        const key = entry.screener && String(entry.screener).trim() ? entry.screener : '';
        if (!(key in groupIndex)) {
            groupIndex[key] = groups.length;
            groups.push({ key, label: key || 'No screener selected', entries: [] });
        }
        groups[groupIndex[key]].entries.push(entry);
    });

    list.innerHTML = groups.map(group => `
        <div class="history-section">
            <div class="history-section-header">
                <span class="history-section-title">${escapeHtml(group.label)}</span>
                <span class="history-section-count">${group.entries.length}</span>
            </div>
            <div class="history-section-entries">
                ${group.entries.map(renderEntry).join('')}
            </div>
        </div>`).join('');
}

// Update the note for a specific entry.
function updateHistoryNote(entryId, value) {
    const history = loadSelectionHistory();
    const entry = history.find(e => e.id === entryId);
    if (!entry) return;
    entry.notes = value;
    saveSelectionHistory(history);
}

// Delete a single entry.
function deleteHistoryEntry(entryId) {
    let history = loadSelectionHistory();
    history = history.filter(e => e.id !== entryId);
    saveSelectionHistory(history);
    renderHistoryPanel();
}

// Clear the entire history (with confirmation).
function clearSelectionHistory() {
    const history = loadSelectionHistory();
    if (history.length === 0) return;
    const ok = window.confirm('Clear ALL saved selections and notes? This cannot be undone.');
    if (!ok) return;
    saveSelectionHistory([]);
    renderHistoryPanel();
}

// Escape a single CSV field.
function csvEscape(value) {
    const str = String(value == null ? '' : value);
    if (/[",\r\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// Export the history as a downloadable CSV file.
function exportHistoryCsv() {
    const history = loadSelectionHistory();
    if (history.length === 0) {
        window.alert('There are no selections to export yet.');
        return;
    }

    const headers = ['Type', 'Name', 'Tier', 'Date Selected', 'Notes'];
    const rows = history.map(e => [
        e.type === 'Assessment' ? 'Drill-Down Assessment' : (e.type || 'Selection'),
        e.name,
        e.tier,
        formatHistoryDate(e.date),
        e.notes || ''
    ].map(csvEscape).join(','));

    const csv = [headers.map(csvEscape).join(','), ...rows].join('\r\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `litlab-selection-history-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Open/close the side panel.
function toggleHistoryPanel(forceOpen) {
    const tracker = document.getElementById('selection-tracker');
    if (!tracker) return;
    const willOpen = typeof forceOpen === 'boolean' ? forceOpen : !tracker.classList.contains('open');
    tracker.classList.toggle('open', willOpen);
    const toggle = tracker.querySelector('.selection-tracker-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', String(willOpen));
    // Opening the panel counts as "checking" the new entries, so clear the glow.
    if (willOpen) clearHistoryUnseen();
}

// Add a persistent glow to the history tab to signal unchecked new entries.
function markHistoryUnseen() {
    const tracker = document.getElementById('selection-tracker');
    const toggle = document.querySelector('.selection-tracker-toggle');
    if (!toggle) return;
    // If the panel is already open, the user is already looking at it.
    if (tracker && tracker.classList.contains('open')) return;
    toggle.classList.add('has-unseen');
}

// Remove the glow once the user has opened (checked) the history panel.
function clearHistoryUnseen() {
    const toggle = document.querySelector('.selection-tracker-toggle');
    if (toggle) toggle.classList.remove('has-unseen');
}

// Initialize the panel on load.
document.addEventListener('DOMContentLoaded', () => {
    renderHistoryPanel();
    initHistoryTrackerDrag();
});

// Make the floating History tab draggable along the vertical axis so users can
// reposition it out of the way. The chosen position is remembered per browser.
function initHistoryTrackerDrag() {
    const tracker = document.getElementById('selection-tracker');
    if (!tracker) return;
    const toggle = tracker.querySelector('.selection-tracker-toggle');
    if (!toggle) return;

    const STORAGE_KEY = 'litlab-history-tab-top';
    const EDGE_MARGIN = 8;
    const DRAG_THRESHOLD = 4;

    function clampTop(top) {
        const h = toggle.offsetHeight || 80;
        const max = Math.max(EDGE_MARGIN, window.innerHeight - h - EDGE_MARGIN);
        return Math.min(Math.max(top, EDGE_MARGIN), max);
    }

    function applyTop(top) {
        toggle.classList.add('is-positioned');
        toggle.style.top = clampTop(top) + 'px';
    }

    // Restore any previously saved position.
    const saved = parseFloat(localStorage.getItem(STORAGE_KEY));
    if (!Number.isNaN(saved)) applyTop(saved);

    let dragging = false;
    let moved = false;
    let startY = 0;
    let startTop = 0;

    function onPointerMove(e) {
        if (!dragging) return;
        const dy = e.clientY - startY;
        if (!moved && Math.abs(dy) > DRAG_THRESHOLD) {
            moved = true;
            toggle.classList.add('is-dragging');
        }
        if (moved) {
            e.preventDefault();
            applyTop(startTop + dy);
        }
    }

    function onPointerUp() {
        if (!dragging) return;
        dragging = false;
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        toggle.classList.remove('is-dragging');
        if (moved) {
            localStorage.setItem(STORAGE_KEY, String(parseFloat(toggle.style.top)));
        }
    }

    toggle.addEventListener('pointerdown', (e) => {
        if (e.button != null && e.button !== 0) return;
        dragging = true;
        moved = false;
        startY = e.clientY;
        startTop = toggle.getBoundingClientRect().top;
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
    });

    toggle.addEventListener('click', () => {
        // A click that concludes a drag should not toggle the panel. `moved`
        // stays set until the next pointerdown, so a genuine click (no drag)
        // is never suppressed even if the post-drag click never fires.
        if (moved) return;
        toggleHistoryPanel();
    });

    // Keep the tab on-screen if the viewport is resized.
    window.addEventListener('resize', () => {
        if (toggle.classList.contains('is-positioned')) {
            applyTop(parseFloat(toggle.style.top));
        }
    });
}

// Selection history exports
window.recordSelection = recordSelection;
window.renderHistoryPanel = renderHistoryPanel;
window.updateHistoryNote = updateHistoryNote;
window.deleteHistoryEntry = deleteHistoryEntry;
window.clearSelectionHistory = clearSelectionHistory;
window.exportHistoryCsv = exportHistoryCsv;
window.toggleHistoryPanel = toggleHistoryPanel;
window.showGoToTierStep = showGoToTierStep;
window.applyTierTheme = applyTierTheme;
