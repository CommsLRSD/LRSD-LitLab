// Application State
const appState = {
    interventionsData: null,
    currentTier: null,
    currentFilters: {
        screener: '',
        testArea: '',
        pillar: ''
    },
    completedSteps: new Set()
};

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadInterventionsData();
    initializeNavigation();
    initializeTierSelection();
    initializeStepExpansion();
    initializeMobileMenu();
    animatePageLoad();
});

// Animate page load with Motion One
function animatePageLoad() {
    if (typeof Motion !== 'undefined') {
        // Animate sidebar navigation items
        Motion.animate(
            '#sidebar-nav li',
            { x: [-50, 0], opacity: [0, 1] },
            { delay: Motion.stagger(0.1), duration: 0.5, easing: 'ease-out' }
        );

        // Animate tier cards on initial load
        Motion.animate(
            '.tier-card',
            { y: [50, 0], opacity: [0, 1], scale: [0.9, 1] },
            { delay: Motion.stagger(0.15), duration: 0.6, easing: [0.4, 0, 0.2, 1] }
        );
    }
}

// Initialize mobile menu
function initializeMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            
            // Animate hamburger menu
            if (typeof Motion !== 'undefined') {
                const spans = mobileToggle.querySelectorAll('span');
                if (sidebar.classList.contains('active')) {
                    Motion.animate(spans[0], { rotate: 45, y: 8 }, { duration: 0.3 });
                    Motion.animate(spans[1], { opacity: 0 }, { duration: 0.2 });
                    Motion.animate(spans[2], { rotate: -45, y: -8 }, { duration: 0.3 });
                } else {
                    Motion.animate(spans[0], { rotate: 0, y: 0 }, { duration: 0.3 });
                    Motion.animate(spans[1], { opacity: 1 }, { duration: 0.2 });
                    Motion.animate(spans[2], { rotate: 0, y: 0 }, { duration: 0.3 });
                }
            }
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !mobileToggle.contains(e.target) &&
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    }
}

// Load interventions data from JSON
async function loadInterventionsData() {
    try {
        const response = await fetch('data/interventions.json');
        if (!response.ok) {
            throw new Error('Failed to load interventions data');
        }
        appState.interventionsData = await response.json();
    } catch (error) {
        console.error('Error loading interventions data:', error);
        showError('Failed to load intervention data. Please refresh the page.');
    }
}

// Initialize navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('#sidebar-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');
            
            const page = link.getAttribute('data-page');
            
            if (page === 'interventions') {
                showInterventionsSection();
            } else {
                showSection(page);
            }

            // Close mobile menu after selection
            const sidebar = document.getElementById('sidebar');
            if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }

            // Animate section transition with Motion One
            if (typeof Motion !== 'undefined') {
                const visibleSection = document.querySelector('section[style="display: block;"]');
                if (visibleSection) {
                    Motion.animate(
                        visibleSection,
                        { opacity: [0, 1], y: [20, 0] },
                        { duration: 0.5, easing: [0.4, 0, 0.2, 1] }
                    );
                }
            }
        });
    });
}

// Show interventions section
function showInterventionsSection() {
    hideAllSections();
    document.getElementById('interventions-section').style.display = 'block';
}

// Show specific section
function showSection(sectionName) {
    hideAllSections();
    const sectionId = sectionName + '-section';
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
}

// Hide all content sections
function hideAllSections() {
    const sections = [
        'interventions-section',
        'assessment-schedules-section',
        'understanding-scores-section',
        'faqs-section',
        'resources-section'
    ];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'none';
        }
    });
}

// Initialize tier selection
function initializeTierSelection() {
    const tierButtons = document.querySelectorAll('.btn-tier');
    const backButton = document.getElementById('back-to-tiers');
    
    tierButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tierId = button.getAttribute('data-tier');
            showTierProcess(tierId);
        });
    });
    
    backButton.addEventListener('click', () => {
        showTierDashboard();
    });
}

// Show tier process view
function showTierProcess(tierId) {
    const tier = appState.interventionsData.tiers.find(t => t.id === tierId);
    if (!tier) return;
    
    appState.currentTier = tier;
    appState.currentFilters = { screener: '', testArea: '', pillar: '' };
    appState.completedSteps = new Set();
    
    // Update header
    document.getElementById('process-tier-title').textContent = tier.name;
    document.getElementById('process-tier-description').textContent = tier.description;
    
    // Hide dashboard, show process
    document.querySelector('.tier-dashboard').style.display = 'none';
    document.getElementById('intervention-process').style.display = 'block';
    
    // Reset and populate step selections
    document.getElementById('step-testarea').innerHTML = '<option value="">Select Test Area</option>';
    document.getElementById('step-pillar').innerHTML = '<option value="">Select Skill Area</option>';
    document.getElementById('step-interventions-list').innerHTML = '<p class="info-message">Select options in steps above to view available interventions.</p>';
    
    // Populate step 2 screener options
    populateStepScreeners();
    
    // Initialize step states - only step 1 is unlocked
    updateStepStates();

    // Animate steps with Motion One
    if (typeof Motion !== 'undefined') {
        Motion.animate(
            '#process-header',
            { scale: [0.9, 1], opacity: [0, 1], y: [-20, 0] },
            { duration: 0.5, easing: [0.4, 0, 0.2, 1] }
        );

        Motion.animate(
            '.step-item',
            { x: [-50, 0], opacity: [0, 1] },
            { delay: Motion.stagger(0.1, { start: 0.2 }), duration: 0.6, easing: [0.4, 0, 0.2, 1] }
        );
    }
}

// Show tier dashboard
function showTierDashboard() {
    document.querySelector('.tier-dashboard').style.display = 'grid';
    document.getElementById('intervention-process').style.display = 'none';
    appState.currentTier = null;
    appState.currentFilters = { screener: '', testArea: '', pillar: '' };
    appState.completedSteps = new Set();

    // Animate tier cards back in with Motion One
    if (typeof Motion !== 'undefined') {
        Motion.animate(
            '.tier-card',
            { y: [30, 0], opacity: [0, 1], scale: [0.95, 1] },
            { delay: Motion.stagger(0.1), duration: 0.5, easing: [0.4, 0, 0.2, 1] }
        );
    }
}

// Update step states based on completion
function updateStepStates() {
    const steps = document.querySelectorAll('.step-item');
    
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('locked', 'completed');
        
        // Step 1 is always unlocked
        if (stepNum === 1) {
            return;
        }
        
        // Check if previous step is completed
        if (appState.completedSteps.has(stepNum - 1)) {
            // Previous step is complete, this step is unlocked
            if (appState.completedSteps.has(stepNum)) {
                step.classList.add('completed');
            }
        } else {
            // Previous step is not complete, lock this step
            step.classList.add('locked');
        }
    });
}

// Mark step as completed
function completeStep(stepNum) {
    appState.completedSteps.add(stepNum);
    updateStepStates();
    
    // Animate the completion
    if (typeof Motion !== 'undefined') {
        const stepItem = document.querySelector(`.step-item[data-step="${stepNum}"]`);
        if (stepItem) {
            Motion.animate(
                stepItem,
                { scale: [1, 1.05, 1], borderColor: ['#f5f5f5', '#2BA680', '#2BA680'] },
                { duration: 0.6, easing: [0.4, 0, 0.2, 1] }
            );
        }
    }
}

// Initialize step expansion
function initializeStepExpansion() {
    const expandButtons = document.querySelectorAll('.btn-expand');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', () => {
            const stepNum = parseInt(button.getAttribute('data-step'));
            const stepItem = button.closest('.step-item');
            const stepDetails = stepItem.querySelector('.step-details');
            const allButtons = stepItem.querySelectorAll('.btn-expand');
            
            // Check if step is locked
            if (stepItem.classList.contains('locked')) {
                return;
            }
            
            if (stepDetails.style.display === 'none' || !stepDetails.style.display) {
                stepDetails.style.display = 'block';
                allButtons.forEach(btn => {
                    if (btn.textContent === 'Show Details') {
                        btn.style.display = 'none';
                    }
                });
                
                // Mark step 1 as completed when expanded
                if (stepNum === 1) {
                    completeStep(1);
                }

                // Animate step details expansion with Motion One
                if (typeof Motion !== 'undefined') {
                    Motion.animate(
                        stepDetails,
                        { height: ['0px', 'auto'], opacity: [0, 1] },
                        { duration: 0.4, easing: [0.4, 0, 0.2, 1] }
                    );
                }
            } else {
                // Animate step details collapse with Motion One
                if (typeof Motion !== 'undefined') {
                    Motion.animate(
                        stepDetails,
                        { height: ['auto', '0px'], opacity: [1, 0] },
                        { duration: 0.3, easing: [0.4, 0, 0.2, 1] }
                    ).finished.then(() => {
                        stepDetails.style.display = 'none';
                        allButtons.forEach(btn => {
                            if (btn.textContent === 'Show Details') {
                                btn.style.display = 'inline-block';
                            }
                        });
                    });
                } else {
                    stepDetails.style.display = 'none';
                    allButtons.forEach(btn => {
                        if (btn.textContent === 'Show Details') {
                            btn.style.display = 'inline-block';
                        }
                    });
                }
            }
        });
    });
    
    // Add event listeners for step selections
    const screenerSelect = document.getElementById('step-screener');
    const testareaSelect = document.getElementById('step-testarea');
    const pillarSelect = document.getElementById('step-pillar');
    
    screenerSelect.addEventListener('change', () => {
        appState.currentFilters.screener = screenerSelect.value;
        populateStepTestAreas();
        resetPillarAndInterventions();
        
        // Check if both screener and test area are selected to complete step 2
        if (appState.currentFilters.screener && appState.currentFilters.testArea) {
            completeStep(2);
        }
    });
    
    testareaSelect.addEventListener('change', () => {
        appState.currentFilters.testArea = testareaSelect.value;
        populateStepPillars();
        resetInterventions();
        
        // Complete step 2 when test area is selected
        if (appState.currentFilters.screener && appState.currentFilters.testArea) {
            completeStep(2);
        }
    });
    
    pillarSelect.addEventListener('change', () => {
        appState.currentFilters.pillar = pillarSelect.value;
        displayStepInterventions();
        
        // Complete step 3 when pillar is selected
        if (appState.currentFilters.pillar) {
            completeStep(3);
        }
    });
}

// Populate screeners in step 2
function populateStepScreeners() {
    const screenerSelect = document.getElementById('step-screener');
    screenerSelect.innerHTML = '<option value="">Select Screener</option>';
    
    if (!appState.currentTier) return;
    
    appState.currentTier.screeners.forEach(screener => {
        const option = document.createElement('option');
        option.value = screener.id;
        option.textContent = screener.name;
        screenerSelect.appendChild(option);
    });
}

// Populate test areas in step 2
function populateStepTestAreas() {
    const testareaSelect = document.getElementById('step-testarea');
    testareaSelect.innerHTML = '<option value="">Select Test Area</option>';
    
    if (!appState.currentFilters.screener) return;
    
    const screener = appState.currentTier.screeners.find(s => s.id === appState.currentFilters.screener);
    if (screener && screener.testAreas) {
        screener.testAreas.forEach(testArea => {
            const option = document.createElement('option');
            option.value = testArea.id;
            option.textContent = testArea.name;
            testareaSelect.appendChild(option);
        });
    }
}

// Populate pillars in step 3
function populateStepPillars() {
    const pillarSelect = document.getElementById('step-pillar');
    pillarSelect.innerHTML = '<option value="">Select Skill Area</option>';
    
    if (!appState.currentFilters.screener || !appState.currentFilters.testArea) return;
    
    const screener = appState.currentTier.screeners.find(s => s.id === appState.currentFilters.screener);
    const testArea = screener.testAreas.find(ta => ta.id === appState.currentFilters.testArea);
    
    if (testArea && testArea.pillars) {
        testArea.pillars.forEach(pillar => {
            const option = document.createElement('option');
            option.value = pillar.id;
            option.textContent = pillar.name;
            pillarSelect.appendChild(option);
        });
    }
}

// Display interventions in step 4
function displayStepInterventions() {
    const interventionsList = document.getElementById('step-interventions-list');
    
    if (!appState.currentFilters.pillar) {
        interventionsList.innerHTML = '<p class="info-message">Select options in steps above to view available interventions.</p>';
        return;
    }
    
    const screener = appState.currentTier.screeners.find(s => s.id === appState.currentFilters.screener);
    const testArea = screener.testAreas.find(ta => ta.id === appState.currentFilters.testArea);
    const pillar = testArea.pillars.find(p => p.id === appState.currentFilters.pillar);
    
    if (!pillar || !pillar.interventions || pillar.interventions.length === 0) {
        interventionsList.innerHTML = '<p class="info-message">No interventions found for the selected criteria.</p>';
        return;
    }
    
    let html = '<div class="interventions-list">';
    pillar.interventions.forEach(intervention => {
        html += `
            <div class="intervention-card">
                <h4>${intervention.name}</h4>
                <p>${intervention.description}</p>
                <div class="intervention-meta">
                    <span><strong>Duration:</strong> ${intervention.duration}</span>
                    <span><strong>Group Size:</strong> ${intervention.groupSize}</span>
                    <span><strong>Frequency:</strong> ${intervention.frequency}</span>
                </div>
                ${intervention.resources ? `<p><strong>Resources:</strong> ${intervention.resources}</p>` : ''}
            </div>
        `;
    });
    html += '</div>';
    
    interventionsList.innerHTML = html;
    
    // Mark step 4 as completed when interventions are displayed
    completeStep(4);

    // Animate intervention cards with Motion One
    if (typeof Motion !== 'undefined') {
        Motion.animate(
            '.intervention-card',
            { y: [30, 0], opacity: [0, 1], scale: [0.95, 1] },
            { delay: Motion.stagger(0.1), duration: 0.5, easing: [0.4, 0, 0.2, 1] }
        );
    }
}

// Reset step selections
function resetStepSelections() {
    document.getElementById('step-screener').innerHTML = '<option value="">Select Screener</option>';
    document.getElementById('step-testarea').innerHTML = '<option value="">Select Test Area</option>';
    document.getElementById('step-pillar').innerHTML = '<option value="">Select Skill Area</option>';
    document.getElementById('step-interventions-list').innerHTML = '<p class="info-message">Select options in steps above to view available interventions.</p>';
}

// Reset pillar and interventions
function resetPillarAndInterventions() {
    document.getElementById('step-pillar').innerHTML = '<option value="">Select Skill Area</option>';
    appState.currentFilters.pillar = '';
    resetInterventions();
}

// Reset interventions
function resetInterventions() {
    document.getElementById('step-interventions-list').innerHTML = '<p class="info-message">Select options in steps above to view available interventions.</p>';
}

// Show error message
function showError(message) {
    const mainContent = document.getElementById('main-content');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    mainContent.prepend(errorDiv);
}
