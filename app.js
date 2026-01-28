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
    interventionMenuData: null,
    currentPath: [],
    interventionHistory: [],
    currentTierFlow: null,
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
    console.log('Literacy Pal - Initializing...');
    
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
    
    // Setup home menu cards
    setupHomeMenuCards();
    
    // Initialize intervention menu
    initializeInterventionMenu();
    
    // Add resize listener to update connection line positions
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateConnectionLinePositions();
        }, 150); // Debounce resize events
    });
    
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

// Node data definitions for each tier's flowchart
const FLOWCHART_DEFINITIONS = {
    tier1: {
        title: 'Tier 1: Universal Screening & Core Instruction',
        startNode: 'tier1-principles',
        nodes: {
            'tier1-principles': {
                id: 'tier1-principles',
                type: 'checklist',
                title: 'Step 1: Review Principles',
                subtitle: 'Review Principles of Explicit and Systematic Instruction',
                description: 'Check off all 8 principles before proceeding',
                items: [
                    'Clear learning objectives are stated',
                    'Instruction is sequenced and scaffolded',
                    'Teacher models skills explicitly',
                    'Guided practice with feedback is provided',
                    'Independent practice opportunities are given',
                    'Regular assessment and progress monitoring',
                    'Cumulative review is integrated',
                    'Instruction is responsive to student needs'
                ],
                nextNode: 'tier1-screener',
                buttonText: 'Continue to Literacy Screener'
            },
            'tier1-screener': {
                id: 'tier1-screener',
                type: 'selection',
                title: 'Step 2: Select Screener',
                subtitle: 'Choose Your Literacy Screener',
                description: 'Select the assessment tool you are using for universal screening',
                options: 'screeners', // Will fetch from tierFlowchartData
                nextHandler: 'selectTier1ScreenerVisual'
            },
            'tier1-effectiveness': {
                id: 'tier1-effectiveness',
                type: 'decision',
                title: 'Step 3: Evaluate Effectiveness',
                subtitle: 'Is the instruction effective for most students?',
                description: 'Based on screener results and classroom observations',
                infoBox: {
                    title: 'Consider These Indicators',
                    items: [
                        'Are 80% or more students meeting benchmarks?',
                        'Is student engagement high during lessons?',
                        'Are learning objectives being achieved?',
                        'Is progress evident through formative assessments?'
                    ]
                },
                choices: [
                    { id: 'effective', label: 'Yes, Instruction is Effective', sublabel: '80%+ students meeting benchmarks', type: 'success', nextNode: 'tier1-success' },
                    { id: 'ineffective', label: 'No, Needs Improvement', sublabel: 'More than 20% students struggling', type: 'warning', nextNode: 'tier1-percentage' }
                ]
            },
            'tier1-success': {
                id: 'tier1-success',
                type: 'endpoint',
                status: 'success',
                title: 'Core Instruction is Effective!',
                description: 'Your explicit and systematic instruction is working well for the majority of students.',
                recommendations: [
                    'Continue with current instructional practices',
                    'Monitor progress through regular formative assessments',
                    'Conduct universal screening at the next benchmark period',
                    'For students still struggling, consider Tier 2 interventions'
                ]
            },
            'tier1-percentage': {
                id: 'tier1-percentage',
                type: 'decision',
                title: 'Step 4: Student Success Rate',
                subtitle: 'What percentage of students are unsuccessful?',
                description: 'Based on assessment data, how many students are below benchmark?',
                choices: [
                    { id: 'less-20', label: 'Less than 20% Unsuccessful', sublabel: 'Most students on track, small group needs support', type: 'primary', nextNode: 'tier1-move-tier2' },
                    { id: 'more-20', label: '20% or More Unsuccessful', sublabel: 'Significant number need re-teaching', type: 'warning', nextNode: 'tier1-reteach' }
                ]
            },
            'tier1-move-tier2': {
                id: 'tier1-move-tier2',
                type: 'endpoint',
                status: 'info',
                title: 'Small Group Intervention Recommended',
                description: 'A small percentage of students need additional targeted support.',
                recommendations: [
                    'Continue Tier 1 core instruction for all students',
                    'Implement Tier 2 small group interventions for struggling students',
                    'Use evidence-based intervention strategies',
                    'Monitor progress every 2-4 weeks'
                ],
                actionButton: { text: 'Start Tier 2 Flowchart', action: 'startTier2Visual' }
            },
            'tier1-reteach': {
                id: 'tier1-reteach',
                type: 'endpoint',
                status: 'warning',
                title: 'Core Instruction Needs Adjustment',
                description: 'When more than 20% of students are unsuccessful, the core instruction may need to be re-examined and adjusted.',
                recommendations: [
                    'Re-teach using different instructional strategies',
                    'Review the 8 principles of explicit instruction',
                    'Differentiate instruction within Tier 1',
                    'Increase modeling and guided practice opportunities',
                    'Adjust pacing to ensure concept mastery',
                    'Collaborate with colleagues to refine approaches'
                ],
                actionButton: { text: 'Start Tier 1 Again', action: 'restartTier1Visual' }
            }
        }
    },
    tier2: {
        title: 'Tier 2: Small Group Intervention',
        startNode: 'tier2-principles',
        nodes: {
            'tier2-principles': {
                id: 'tier2-principles',
                type: 'checklist',
                title: 'Step 1: Review Principles',
                subtitle: 'Review Principles of Tier 2 Intervention',
                description: 'Check off all 5 principles before proceeding',
                items: [
                    'Small group instruction (3-6 students)',
                    'Daily sessions of 20-30 minutes',
                    'Targeted skill instruction based on assessment data',
                    'Progress monitoring every 2-4 weeks',
                    'Evidence-based intervention program'
                ],
                nextNode: 'tier2-assessment',
                buttonText: 'Continue to Drill Down Assessment'
            },
            'tier2-assessment': {
                id: 'tier2-assessment',
                type: 'selection',
                title: 'Step 2: Select Assessment',
                subtitle: 'Choose a Drill Down Assessment',
                description: 'Select an assessment that aligns with the areas of weakness identified by the literacy screener',
                options: 'drillDownAssessments',
                infoBox: {
                    title: 'Purpose of Drill Down Assessments',
                    text: 'These assessments provide more detailed information about specific skill gaps, helping you select the most appropriate intervention.'
                },
                nextHandler: 'selectTier2AssessmentVisual'
            },
            'tier2-intervention': {
                id: 'tier2-intervention',
                type: 'selection',
                title: 'Step 3: Select Intervention',
                subtitle: 'Choose an 8-Week Intervention',
                description: 'Select an evidence-based intervention that matches the student\'s specific needs',
                options: 'interventions',
                infoBox: {
                    title: '8-Week Intervention Cycle',
                    text: 'Implement the selected intervention for 8 weeks. Monitor student progress regularly during this period using progress monitoring tools.'
                },
                nextHandler: 'selectTier2InterventionVisual'
            },
            'tier2-progress': {
                id: 'tier2-progress',
                type: 'decision',
                title: 'Step 4: Progress Monitoring',
                subtitle: 'After 8 Weeks: Did the student show improvement?',
                description: 'Administer a literacy screener to evaluate student progress',
                infoBox: {
                    title: 'Acceptable Screeners',
                    items: ['DIBELS', 'CTOPP-2', 'THaFoL', 'IDAPEL']
                },
                choices: [
                    { id: 'improved', label: 'Yes, Student Improved', sublabel: 'Blue or Green results - meeting benchmarks', type: 'success', nextNode: 'tier2-success' },
                    { id: 'no-improvement', label: 'No Improvement', sublabel: 'Yellow or Red results - below benchmark', type: 'warning', nextNode: 'tier2-try-again' }
                ]
            },
            'tier2-success': {
                id: 'tier2-success',
                type: 'endpoint',
                status: 'success',
                title: 'Student Made Good Progress!',
                description: 'The 8-week Tier 2 intervention was effective. The student is now meeting benchmarks.',
                recommendations: [
                    'Gradually fade the intervention support',
                    'Continue to monitor progress closely',
                    'Return to Tier 1 core instruction',
                    'Celebrate the student\'s success!'
                ]
            },
            'tier2-try-again': {
                id: 'tier2-try-again',
                type: 'endpoint',
                status: 'warning',
                title: 'Second Intervention Cycle Needed',
                description: 'The student did not make expected progress. Let\'s try a different intervention approach for another 8-week cycle.',
                recommendations: [
                    'Conduct another drill down assessment for more detail',
                    'Select a different intervention strategy',
                    'Implement for another 8-week cycle',
                    'Monitor progress closely'
                ],
                actionButton: { text: 'Begin Second 8-Week Cycle', action: 'restartTier2Visual' },
                secondaryAction: { text: 'Move to Tier 3', action: 'startTier3Visual' }
            }
        }
    },
    tier3: {
        title: 'Tier 3: Intensive Individual Intervention',
        startNode: 'tier3-intro',
        nodes: {
            'tier3-intro': {
                id: 'tier3-intro',
                type: 'info',
                title: 'Begin Tier 3',
                subtitle: 'Intensive Individual Intervention',
                warningBox: {
                    title: 'Important Note',
                    text: 'Tier 3 interventions are for students who have not responded to two cycles of Tier 2 intervention. Typically, fewer than 10% of students require this level of support.'
                },
                featuresTitle: 'Characteristics of Tier 3 Interventions',
                features: [
                    'Individual or very small group (1-3 students)',
                    'Intensive daily sessions (45-60 minutes)',
                    'Highly specialized, research-based programs',
                    'Weekly progress monitoring',
                    'Collaboration with specialists and clinicians'
                ],
                nextNode: 'tier3-assessment',
                buttonText: 'Begin Tier 3 Process'
            },
            'tier3-assessment': {
                id: 'tier3-assessment',
                type: 'selection',
                title: 'Step 2: Comprehensive Assessment',
                subtitle: 'Select Comprehensive Diagnostic Assessment',
                description: 'Choose a highly targeted assessment to identify specific literacy gaps',
                options: 'drillDownAssessments',
                warningBox: {
                    title: 'Tier 3 Assessment',
                    text: 'These comprehensive assessments provide very detailed information to guide intensive intervention selection. Consider consulting with specialists.'
                },
                nextHandler: 'selectTier3AssessmentVisual'
            },
            'tier3-intervention': {
                id: 'tier3-intervention',
                type: 'selection',
                title: 'Step 3: Select Intervention',
                subtitle: 'Choose an Intensive Intervention Program',
                description: 'Select a highly specialized, research-based program for intensive support',
                options: 'interventions',
                warningBox: {
                    title: '8-Week Intensive Cycle',
                    text: 'Implement the intervention for 8 weeks with weekly progress monitoring. These programs often require specialized training.'
                },
                nextHandler: 'selectTier3InterventionVisual'
            },
            'tier3-progress': {
                id: 'tier3-progress',
                type: 'decision',
                title: 'Step 4: Progress Monitoring',
                subtitle: 'After 8 Weeks: Evaluate Student Progress',
                description: 'Administer a literacy screener to determine if the intensive intervention was effective',
                warningBox: {
                    title: 'Important',
                    text: 'You should have been monitoring progress weekly throughout the 8-week cycle. Now it\'s time to evaluate overall progress.'
                },
                infoBox: {
                    title: 'Acceptable Screeners',
                    items: ['DIBELS', 'CTOPP-2', 'THaFoL', 'IDAPEL']
                },
                choices: [
                    { id: 'improved', label: 'Yes, Student Improved', sublabel: 'Blue or Green results - showing progress', type: 'success', nextNode: 'tier3-success' },
                    { id: 'no-improvement', label: 'No Improvement', sublabel: 'Yellow or Red results - needs specialist support', type: 'warning', nextNode: 'tier3-specialist' }
                ]
            },
            'tier3-success': {
                id: 'tier3-success',
                type: 'endpoint',
                status: 'success',
                title: 'Student Showed Improvement!',
                description: 'The intensive Tier 3 intervention was effective. The student is making progress.',
                recommendations: [
                    'Gradually fade intervention support while monitoring closely',
                    'Consider moving to Tier 2 with reduced intensity',
                    'Continue progress monitoring frequently',
                    'Celebrate progress and maintain momentum',
                    'May return to Tier 1 if sufficient progress is maintained'
                ],
                actionButton: { text: 'Move to Tier 2', action: 'startTier2Visual' }
            },
            'tier3-specialist': {
                id: 'tier3-specialist',
                type: 'endpoint',
                status: 'danger',
                title: 'Clinician Consultation Required',
                description: 'The student has not responded to intensive intervention. Specialized assessment and support is needed.',
                recommendations: [
                    'Schedule a meeting with school clinicians and specialists',
                    'Consider referral to special education staff',
                    'Consult with speech-language pathologists',
                    'Work with school psychologists',
                    'Collaborate with reading specialists',
                    'Discuss formal special education assessment'
                ],
                warningBox: {
                    title: 'Important Note',
                    text: 'This student needs specialized support beyond what this app can provide. Work with your school\'s student support team to determine the best path forward.'
                }
            }
        }
    }
};

// Initialize the visual flowchart
function initVisualFlowchart(tierId) {
    const container = document.getElementById('flowchart-container');
    if (!container) return;
    
    const flowchartDef = FLOWCHART_DEFINITIONS[tierId];
    if (!flowchartDef) return;
    
    // Reset visual flowchart state
    appState.visualFlowchart = {
        nodes: [],
        connections: [],
        currentNodeId: null,
        selectedPath: [],
        tierId: tierId
    };
    
    container.classList.remove('flowchart-hidden');
    container.innerHTML = `
        <div class="visual-flowchart">
            <div class="visual-flowchart-header">
                <button class="vf-back-button" onclick="closeVisualFlowchart()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Interventions
                </button>
                <h2>${flowchartDef.title}</h2>
                <div class="vf-progress-indicator">
                    <span class="vf-progress-text">Step 1</span>
                </div>
            </div>
            <div class="visual-flowchart-canvas" id="vf-canvas">
                <svg class="vf-connections" id="vf-connections"></svg>
                <div class="vf-nodes" id="vf-nodes"></div>
            </div>
        </div>
    `;
    
    // Add horizontal-only scroll behavior
    const canvas = document.getElementById('vf-canvas');
    if (canvas) {
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            canvas.scrollLeft += e.deltaY;
        }, { passive: false });
    }
    
    // Show the first node
    showFlowchartNode(flowchartDef.startNode, null);
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
    path.setAttribute('stroke-width', '3');
    
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
    dot.setAttribute('r', '6');
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
            <div class="vf-node-step-badge">${nodeData.title}</div>
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4m0-4h.01"/>
            </svg>
            <div>
                <h4>${nodeData.infoBox.title}</h4>
                ${nodeData.infoBox.text ? `<p>${nodeData.infoBox.text}</p>` : ''}
                ${nodeData.infoBox.items ? `<ul>${nodeData.infoBox.items.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
            </div>
        </div>
    ` : '';
    
    const warningBoxHTML = nodeData.warningBox ? `
        <div class="vf-warning-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div>
                <h4>${nodeData.warningBox.title}</h4>
                <p>${nodeData.warningBox.text}</p>
            </div>
        </div>
    ` : '';
    
    return `
        <div class="vf-node-header">
            <div class="vf-node-step-badge">${nodeData.title}</div>
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
                ${choice.type === 'success' ? `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 13l4 4L19 7"/>
                    </svg>
                ` : choice.type === 'warning' ? `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                ` : `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4m0-4h.01"/>
                    </svg>
                `}
            </div>
            <div class="vf-decision-content">
                <strong>${choice.label}</strong>
                <span>${choice.sublabel}</span>
            </div>
        </button>
    `).join('');
    
    const infoBoxHTML = nodeData.infoBox ? `
        <div class="vf-info-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4m0-4h.01"/>
            </svg>
            <div>
                <h4>${nodeData.infoBox.title}</h4>
                ${nodeData.infoBox.text ? `<p>${nodeData.infoBox.text}</p>` : ''}
                ${nodeData.infoBox.items ? `<ul>${nodeData.infoBox.items.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
            </div>
        </div>
    ` : '';
    
    const warningBoxHTML = nodeData.warningBox ? `
        <div class="vf-warning-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div>
                <h4>${nodeData.warningBox.title}</h4>
                <p>${nodeData.warningBox.text}</p>
            </div>
        </div>
    ` : '';
    
    return `
        <div class="vf-node-header">
            <div class="vf-node-step-badge">${nodeData.title}</div>
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div>
                <h4>${nodeData.warningBox.title}</h4>
                <p>${nodeData.warningBox.text}</p>
            </div>
        </div>
    ` : '';
    
    const featuresHeading = nodeData.featuresTitle || 'Key Characteristics';
    
    return `
        <div class="vf-node-header">
            <div class="vf-node-step-badge">${nodeData.title}</div>
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
    const statusIcons = {
        success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
        info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>`,
        warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
        danger: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>`
    };
    
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
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
                ${statusIcons[nodeData.status]}
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
    
    showFlowchartNode('tier1-effectiveness', nodeId, screenerId);
}

// Handler functions for tier 2
function selectTier2AssessmentVisual(nodeId, assessmentId, assessmentName) {
    appState.currentTierFlow = appState.currentTierFlow || {};
    appState.currentTierFlow.assessment = assessmentId;
    appState.currentTierFlow.assessmentName = assessmentName;
    
    showFlowchartNode('tier2-intervention', nodeId, assessmentId);
}

function selectTier2InterventionVisual(nodeId, interventionId, interventionName) {
    appState.currentTierFlow = appState.currentTierFlow || {};
    appState.currentTierFlow.intervention = interventionId;
    appState.currentTierFlow.interventionName = interventionName;
    
    showFlowchartNode('tier2-progress', nodeId, interventionId);
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
        container.style.display = 'none';
        container.innerHTML = '';
    }
    
    // Return to interventions options screen
    returnToInterventionsOptions();
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

    const languageSelect = document.getElementById('language-select');
    const language = languageSelect ? languageSelect.value : 'English';
    
    const screeners = appState.interventionMenuData.screeners.filter(
        s => s.language === language
    );

    screenerSelect.innerHTML = '<option value="">All Screeners</option>' +
        screeners.map(s => `<option value="${s.screener_id}">${s.screener_name}</option>`).join('');
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
    if (!filters.type || filters.type === 'Assessment') {
        const assessments = appState.interventionMenuData.assessments.filter(item => {
            // Program match
            const programMatch = item.program === (filters.language === 'English' ? 'English' : 'French Immersion');
            if (!programMatch) return false;

            // Pillar match
            if (pillarsToSearch.length > 0) {
                if (!pillarsToSearch.includes(item.literacy_pillar)) return false;
            }

            return true;
        });
        results = results.concat(assessments.map(a => ({ ...a, itemType: 'Assessment' })));
    }

    if (!filters.type || filters.type === 'Intervention') {
        const interventions = appState.interventionMenuData.interventions.filter(item => {
            // Program match
            const programMatch = item.program === (filters.language === 'English' ? 'English' : 'French Immersion');
            if (!programMatch) return false;

            // Tier match
            if (filters.tier) {
                if (!item.tiers.includes(parseInt(filters.tier))) return false;
            }

            // Pillar match
            if (pillarsToSearch.length > 0) {
                if (!item.literacy_pillars.some(p => pillarsToSearch.includes(p))) return false;
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

function displayCompactResults(results, filters) {
    const resultsPanel = document.querySelector('.results-panel');
    if (!resultsPanel) return;

    let filterSummary = [];
    if (filters.tier) filterSummary.push(`Tier ${filters.tier}`);
    if (filters.language) filterSummary.push(filters.language);
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
            ${results.map(item => `
                <div class="result-card-compact">
                    <div class="result-header-compact">
                        <div>
                            <h4 class="result-name-compact">${item.name}</h4>
                            <div class="result-meta-compact">
                                <span class="badge-grade">${item.grade_range.start}-${item.grade_range.end}</span>
                                <span class="badge-program">${item.program === 'English' ? 'EN' : 'FR'}</span>
                                ${item.evidence_level && item.evidence_level !== 'none' 
                                    ? `<span class="badge-evidence">${item.evidence_level}</span>` 
                                    : ''}
                                ${item.itemType === 'Intervention' 
                                    ? `<span class="badge-tier">T${item.tiers.join(',')}</span>`
                                    : ''}
                            </div>
                        </div>
                    </div>
                    <div class="result-details-compact">
                        ${item.itemType === 'Intervention' ? `
                            <div class="result-info"><strong>Pillars:</strong> ${item.literacy_pillars.join(', ')}</div>
                        ` : `
                            <div class="result-info"><strong>Pillar:</strong> ${item.literacy_pillar}</div>
                            <div class="result-info"><strong>Type:</strong> ${item.assessment_type}</div>
                        `}
                    </div>
                    ${item.url && item.url !== '' && item.url !== '(local resource)' && item.url !== '(SharePoint)' && item.url !== '(Nelson)' ? `
                        <a href="${item.url}" target="_blank" class="result-link-compact">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                                <path d="M15 3h6v6"/>
                                <path d="M10 14L21 3"/>
                            </svg>
                            View Resource
                        </a>
                    ` : item.url && item.url !== '' ? `
                        <div class="result-local-compact">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            ${item.url}
                        </div>
                    ` : ''}
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
function openTierFlowchart(tierName) {
    console.log(`Opening ${tierName} flowchart directly`);
    
    // Validate tierName
    if (!['tier1', 'tier2', 'tier3'].includes(tierName)) {
        console.error(`Invalid tier name: ${tierName}`);
        return;
    }
    
    // Hide the options screen
    const optionsScreen = document.getElementById('interventions-options-screen');
    if (optionsScreen) {
        optionsScreen.style.display = 'none';
    }
    
    // Hide the menu view
    const menuView = document.getElementById('interventions-menu-full-view');
    if (menuView) {
        menuView.style.display = 'none';
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
    console.log('Opening Interventions Menu View');
    
    // Hide the options screen
    const optionsScreen = document.getElementById('interventions-options-screen');
    if (optionsScreen) {
        optionsScreen.style.display = 'none';
    }
    
    // Show the menu view
    const menuView = document.getElementById('interventions-menu-full-view');
    if (menuView) {
        menuView.style.display = 'block';
    }
    
    // Hide the flowchart
    const flowchartContainer = document.getElementById('flowchart-container');
    if (flowchartContainer) {
        flowchartContainer.classList.add('flowchart-view-hidden');
        flowchartContainer.style.display = 'none';
    }
    
    // Scroll to the menu view
    if (menuView) {
        menuView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function returnToInterventionsOptions() {
    console.log('Returning to Interventions Options');
    
    // Show the options screen
    const optionsScreen = document.getElementById('interventions-options-screen');
    if (optionsScreen) {
        optionsScreen.style.display = 'block';
    }
    
    // Hide the menu view
    const menuView = document.getElementById('interventions-menu-full-view');
    if (menuView) {
        menuView.style.display = 'none';
    }
    
    // Hide the flowchart
    const flowchartContainer = document.getElementById('flowchart-container');
    if (flowchartContainer) {
        flowchartContainer.classList.add('flowchart-view-hidden');
        flowchartContainer.style.display = 'none';
    }
    
    // Scroll to the options screen
    if (optionsScreen) {
        optionsScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
window.openInterventionsMenuView = openInterventionsMenuView;
window.returnToInterventionsOptions = returnToInterventionsOptions;

