// Literacy Pal - Main Application JavaScript
// Modern, functional implementation with smooth animations and interactions

// ============================================
// State Management
// ============================================
const appState = {
    currentPage: 'home',
    mobileMenuOpen: false,
    flowchartData: null,
    tierFlowchartData: null,
    currentPath: [],
    interventionHistory: [],
    currentTierFlow: null
};

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Literacy Pal - Initializing...');
    
    // Load intervention data
    await loadInterventionData();
    
    // Load tier flowchart data
    await loadTierFlowchartData();
    
    // Setup navigation
    setupNavigation();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Setup home menu cards
    setupHomeMenuCards();
    
    // Initialize flowchart
    initializeFlowchart();
    
    console.log('✅ Literacy Pal - Ready!');
});

// ============================================
// Data Loading
// ============================================
async function loadInterventionData() {
    try {
        const response = await fetch('data/interventions.json');
        if (!response.ok) throw new Error('Failed to load intervention data');
        appState.flowchartData = await response.json();
        console.log('📊 Intervention data loaded successfully');
    } catch (error) {
        console.error('❌ Error loading intervention data:', error);
        appState.flowchartData = { tiers: [] };
    }
}

async function loadTierFlowchartData() {
    try {
        const response = await fetch('data/tier-flowcharts.json');
        if (!response.ok) throw new Error('Failed to load tier flowchart data');
        appState.tierFlowchartData = await response.json();
        console.log('📊 Tier flowchart data loaded successfully');
    } catch (error) {
        console.error('❌ Error loading tier flowchart data:', error);
        appState.tierFlowchartData = { tier1: {}, tier2: {}, tier3: {} };
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
    
    // Sidebar navigation
    document.querySelectorAll('.sidebar-item').forEach(link => {
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
        link.classList.toggle('active', link.dataset.page === pageName);
    });
    
    // Update active states in sidebar
    document.querySelectorAll('.sidebar-item').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageName);
    });
    
    // Update active states in mobile nav
    document.querySelectorAll('.mobile-nav-item').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageName);
    });
    
    // Show/hide sections
    document.querySelectorAll('.content-section').forEach(section => {
        const sectionId = section.id.replace('-section', '');
        section.classList.toggle('active', sectionId === pageName);
    });
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
// Home Menu Cards
// ============================================
function setupHomeMenuCards() {
    document.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const page = e.currentTarget.dataset.page;
            if (page) {
                navigateToPage(page);
            }
        });
    });
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
// Tier Flowchart Functions
// ============================================
function startTier1Flowchart() {
    console.log('Starting Tier 1 Flowchart');
    const container = document.getElementById('flowchart-container');
    if (!container) return;
    
    container.classList.remove('flowchart-hidden');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="closeTierFlowchart()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Interventions
                </button>
                <h2>Tier 1: Universal Screening & Core Instruction</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="flowchart-step-wrapper active">
                    <div class="step-indicator">Step 1</div>
                    <div class="step-content-box">
                        <h3>Review Principles of Explicit and Systematic Instruction</h3>
                        <p>Check off all 8 principles before proceeding:</p>
                        
                        <div class="checklist">
                            <label class="checklist-item">
                                <input type="checkbox" onchange="updateTier1Progress()">
                                <span>Clear learning objectives are stated</span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" onchange="updateTier1Progress()">
                                <span>Instruction is sequenced and scaffolded</span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" onchange="updateTier1Progress()">
                                <span>Teacher models skills explicitly</span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" onchange="updateTier1Progress()">
                                <span>Guided practice with feedback is provided</span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" onchange="updateTier1Progress()">
                                <span>Independent practice opportunities are given</span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" onchange="updateTier1Progress()">
                                <span>Regular assessment and progress monitoring</span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" onchange="updateTier1Progress()">
                                <span>Cumulative review is integrated</span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" onchange="updateTier1Progress()">
                                <span>Instruction is responsive to student needs</span>
                            </label>
                        </div>
                        
                        <button id="tier1-continue-btn" class="btn-primary" disabled onclick="proceedToTier1Screener()">
                            Continue to Literacy Screener
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Smooth scroll to flowchart
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 16v-4m0-4h.01"/>
                            </svg>
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
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M5 13l4 4L19 7"/>
                                </svg>
                                <div>
                                    <strong>Yes, Instruction is Effective</strong>
                                    <span>80%+ students meeting benchmarks</span>
                                </div>
                            </button>
                            
                            <button class="decision-btn warning" onclick="tier1InstructionIneffective()">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
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
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
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
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
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
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 16v-4m0-4h.01"/>
                        </svg>
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
    console.log('Starting Tier 2 Flowchart');
    const container = document.getElementById('flowchart-container');
    if (!container) return;
    
    container.classList.remove('flowchart-hidden');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="closeTierFlowchart()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Interventions
                </button>
                <h2>Tier 2: Small Group Intervention</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="flowchart-step-wrapper active">
                    <div class="step-indicator">Step 1</div>
                    <div class="step-content-box">
                        <h3>Review Principles of Explicit and Systematic Instruction for Tier 2</h3>
                        <p>Check off all 5 principles before proceeding:</p>
                        
                        <div class="checklist">
                            <label class="checklist-item">
                                <input type="checkbox" onchange="updateTier2Progress()">
                                <span>Small group instruction (3-6 students)</span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" onchange="updateTier2Progress()">
                                <span>Daily sessions of 20-30 minutes</span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" onchange="updateTier2Progress()">
                                <span>Targeted skill instruction based on assessment data</span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" onchange="updateTier2Progress()">
                                <span>Progress monitoring every 2-4 weeks</span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" onchange="updateTier2Progress()">
                                <span>Evidence-based intervention program</span>
                            </label>
                        </div>
                        
                        <button id="tier2-continue-btn" class="btn-primary" disabled onclick="proceedToTier2Assessment()">
                            Continue to Drill Down Assessment
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 16v-4m0-4h.01"/>
                            </svg>
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
    appState.currentTierFlow = { ...appState.currentTierFlow, tier: 2, assessment: assessmentId, assessmentName: assessmentName };
    
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
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 16v-4m0-4h.01"/>
                            </svg>
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
    appState.currentTierFlow = { ...appState.currentTierFlow, intervention: interventionId, interventionName: interventionName };
    
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
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 16v-4m0-4h.01"/>
                            </svg>
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
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M5 13l4 4L19 7"/>
                                </svg>
                                <div>
                                    <strong>Yes, Student Improved</strong>
                                    <span>Blue or Green results - meeting benchmarks</span>
                                </div>
                            </button>
                            
                            <button class="decision-btn warning" onclick="tier2StudentDidNotImprove()">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
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
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
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
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
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
    appState.currentTierFlow = { ...appState.currentTierFlow, cycle: 2 };
    
    proceedToTier2Assessment();
}

function startTier3Flowchart() {
    console.log('Starting Tier 3 Flowchart');
    const container = document.getElementById('flowchart-container');
    if (!container) return;
    
    container.classList.remove('flowchart-hidden');
    container.innerHTML = `
        <div class="flowchart-tier-view">
            <div class="flowchart-header">
                <button class="back-button" onclick="closeTierFlowchart()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Interventions
                </button>
                <h2>Tier 3: Intensive Individual Intervention</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="flowchart-step-wrapper active">
                    <div class="step-indicator">Begin Tier 3</div>
                    <div class="step-content-box">
                        <div class="info-callout warning">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 8v4m0 4h.01"/>
                            </svg>
                            <div>
                                <h4>Important Note</h4>
                                <p>Tier 3 interventions are for students who have not responded to two cycles of Tier 2 intervention. Typically, fewer than 10% of students require this level of support.</p>
                            </div>
                        </div>
                        
                        <h3>Characteristics of Tier 3 Interventions</h3>
                        <ul class="feature-list">
                            <li>Individual or very small group (1-3 students)</li>
                            <li>Intensive daily sessions (45-60 minutes)</li>
                            <li>Highly specialized, research-based programs</li>
                            <li>Weekly progress monitoring</li>
                            <li>Collaboration with specialists and clinicians</li>
                        </ul>
                        
                        <button class="btn-primary" onclick="proceedToTier3Assessment()">
                            Begin Tier 3 Process
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                <h2>Tier 3: Comprehensive Assessment</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="flowchart-step-wrapper active">
                    <div class="step-indicator">Step 2</div>
                    <div class="step-content-box">
                        <h3>Select Comprehensive Diagnostic Assessment</h3>
                        <p>Choose a highly targeted assessment to identify specific literacy gaps:</p>
                        
                        <div class="info-callout warning">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 8v4m0 4h.01"/>
                            </svg>
                            <div>
                                <h4>Tier 3 Assessment</h4>
                                <p>These comprehensive assessments provide very detailed information to guide intensive intervention selection. Consider consulting with specialists.</p>
                            </div>
                        </div>
                        
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
    appState.currentTierFlow = { ...appState.currentTierFlow, tier: 3, assessment: assessmentId, assessmentName: assessmentName };
    
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
                <h2>Tier 3: Select Intensive Intervention</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="flowchart-step-wrapper active">
                    <div class="step-indicator">Step 3</div>
                    <div class="step-content-box">
                        <h3>Choose an Intensive Intervention Program</h3>
                        <p>Select a highly specialized, research-based program for intensive support:</p>
                        
                        <div class="info-callout warning">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 8v4m0 4h.01"/>
                            </svg>
                            <div>
                                <h4>8-Week Intensive Cycle</h4>
                                <p>Implement the intervention for 8 weeks with <strong>weekly progress monitoring</strong>. These programs often require specialized training.</p>
                            </div>
                        </div>
                        
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
    appState.currentTierFlow = { ...appState.currentTierFlow, intervention: interventionId, interventionName: interventionName };
    
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
                    <div class="step-indicator">Step 4</div>
                    <div class="step-content-box">
                        <h3>After 8 Weeks: Evaluate Student Progress</h3>
                        <p>Administer a literacy screener to determine if the intensive intervention was effective:</p>
                        
                        <div class="info-callout warning">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 8v4m0 4h.01"/>
                            </svg>
                            <div>
                                <h4>Important</h4>
                                <p>You should have been monitoring progress <strong>weekly</strong> throughout the 8-week cycle. Now it's time to evaluate overall progress.</p>
                            </div>
                        </div>
                        
                        <div class="info-callout">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 16v-4m0-4h.01"/>
                            </svg>
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
                            <button class="decision-btn success" onclick="tier3StudentImproved()">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M5 13l4 4L19 7"/>
                                </svg>
                                <div>
                                    <strong>Yes, Student Improved</strong>
                                    <span>Blue or Green results - showing progress</span>
                                </div>
                            </button>
                            
                            <button class="decision-btn warning" onclick="tier3StudentDidNotImprove()">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
                                <div>
                                    <strong>No Improvement</strong>
                                    <span>Yellow or Red results - needs specialist support</span>
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
                <h2>Tier 3: Progress Made!</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="success-message">
                    <div class="success-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <h2>Student Showed Improvement!</h2>
                    <p>The intensive Tier 3 intervention was effective. The student is making progress.</p>
                    
                    <div class="recommendation-box">
                        <h3>Next Steps:</h3>
                        <ul>
                            <li>Gradually fade intervention support while monitoring closely</li>
                            <li>Consider moving to Tier 2 with reduced intensity</li>
                            <li>Continue progress monitoring frequently</li>
                            <li>Celebrate progress and maintain momentum</li>
                            <li>May return to Tier 1 if sufficient progress is maintained</li>
                        </ul>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn-primary" onclick="startTier2Flowchart()">
                            Move to Tier 2
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
                <h2>Tier 3: Specialist Support Needed</h2>
            </div>
            
            <div class="flowchart-content">
                <div class="warning-message">
                    <div class="warning-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                    </div>
                    <h2>Clinician Consultation Required</h2>
                    <p>The student has not responded to intensive intervention. Specialized assessment and support is needed.</p>
                    
                    <div class="recommendation-box">
                        <h3>Recommended Next Steps:</h3>
                        <ul>
                            <li><strong>Schedule a meeting</strong> with school clinicians and specialists</li>
                            <li><strong>Consider referral</strong> to special education staff</li>
                            <li><strong>Consult with:</strong>
                                <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                                    <li>Speech-language pathologists</li>
                                    <li>School psychologists</li>
                                    <li>Reading specialists</li>
                                    <li>Special education coordinators</li>
                                </ul>
                            </li>
                            <li><strong>Discuss:</strong> Formal special education assessment</li>
                            <li><strong>Explore:</strong> Medical or developmental evaluations if appropriate</li>
                        </ul>
                    </div>
                    
                    <div class="info-callout warning">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 8v4m0 4h.01"/>
                        </svg>
                        <div>
                            <h4>Important Note</h4>
                            <p>This student needs specialized support beyond what this app can provide. Work with your school's student support team to determine the best path forward.</p>
                        </div>
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

function closeTierFlowchart() {
    const container = document.getElementById('flowchart-container');
    if (container) {
        container.classList.add('flowchart-hidden');
        container.innerHTML = '';
    }
    
    // Scroll back to tier cards
    const interventionsSection = document.getElementById('interventions-section');
    if (interventionsSection) {
        interventionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 16v-4m0-4h.01"/>
                        </svg>
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
