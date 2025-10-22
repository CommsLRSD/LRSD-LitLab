// Application State
const appState = {
    interventionsData: null,
    currentTier: null,
    currentFilters: {
        screener: '',
        testArea: '',
        pillar: ''
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadInterventionsData();
    initializeNavigation();
    initializeTierSelection();
    initializeStepExpansion();
});

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
    const navLinks = document.querySelectorAll('#main-nav a');
    
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
}

// Show tier dashboard
function showTierDashboard() {
    document.querySelector('.tier-dashboard').style.display = 'grid';
    document.getElementById('intervention-process').style.display = 'none';
    appState.currentTier = null;
    appState.currentFilters = { screener: '', testArea: '', pillar: '' };
}

// Initialize step expansion
function initializeStepExpansion() {
    const expandButtons = document.querySelectorAll('.btn-expand');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', () => {
            const stepNum = button.getAttribute('data-step');
            const stepItem = button.closest('.step-item');
            const stepDetails = stepItem.querySelector('.step-details');
            const allButtons = stepItem.querySelectorAll('.btn-expand');
            
            if (stepDetails.style.display === 'none' || !stepDetails.style.display) {
                stepDetails.style.display = 'block';
                allButtons.forEach(btn => {
                    if (btn.textContent === 'Show Details') {
                        btn.style.display = 'none';
                    }
                });
            } else {
                stepDetails.style.display = 'none';
                allButtons.forEach(btn => {
                    if (btn.textContent === 'Show Details') {
                        btn.style.display = 'inline-block';
                    }
                });
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
    });
    
    testareaSelect.addEventListener('change', () => {
        appState.currentFilters.testArea = testareaSelect.value;
        populateStepPillars();
        resetInterventions();
    });
    
    pillarSelect.addEventListener('change', () => {
        appState.currentFilters.pillar = pillarSelect.value;
        displayStepInterventions();
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
