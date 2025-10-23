// Application State
const appState = {
    interventionsData: null,
    currentTier: null,
    currentStep: null,
    stepHistory: [],
    selectedData: {
        screener: null,
        effectiveness: null,
        percentageUnsuccessful: null,
        drillDownAssessment: null,
        interventionChoice: null,
        progressResult: null
    }
};

// Tier definitions with steps
const TIER_DEFINITIONS = {
    tier1: {
        id: 'tier1',
        name: 'Tier 1 - Universal Classroom Literacy Interventions',
        steps: [
            { id: 'tier1-intro', type: 'checklist', title: 'Principles of Explicit and Systematic Instruction' },
            { id: 'tier1-screener', type: 'selection', title: 'Select Literacy Screener' },
            { id: 'tier1-effectiveness', type: 'binary-choice', title: 'Evaluate Instruction Effectiveness' },
            { id: 'tier1-percentage', type: 'binary-choice', title: 'Student Success Rate' }, // conditional
            { id: 'tier1-reteach', type: 'final', title: 'Reteach Using Different Strategies' }, // conditional
            { id: 'tier1-move-tier2', type: 'final', title: 'Move to Tier 2 Interventions' } // conditional
        ]
    },
    tier2: {
        id: 'tier2',
        name: 'Tier 2 - Small Group Interventions',
        steps: [
            { id: 'tier2-intro', type: 'checklist', title: 'Small Group Intervention Requirements' },
            { id: 'tier2-drilldown', type: 'selection', title: 'Select Drill Down Assessments' },
            { id: 'tier2-intervention', type: 'placeholder', title: 'Choose Interventions' },
            { id: 'tier2-8weeks', type: 'info', title: '8-Week Intervention Cycle' },
            { id: 'tier2-progress', type: 'binary-choice', title: 'Progress Monitoring Results' },
            { id: 'tier2-fade-tier1', type: 'final', title: 'Fade to Tier 1 Supports' }, // conditional
            { id: 'tier2-move-tier3', type: 'final', title: 'Move to Tier 3 Interventions' } // conditional
        ]
    },
    tier3: {
        id: 'tier3',
        name: 'Tier 3 - Personalized Interventions',
        steps: [
            { id: 'tier3-intro', type: 'info', title: 'Intensive Personalized Interventions' },
            { id: 'tier3-drilldown', type: 'selection', title: 'Select Drill Down Assessments' },
            { id: 'tier3-intervention', type: 'placeholder', title: 'Choose Personalized Interventions' },
            { id: 'tier3-8weeks', type: 'info', title: '8-Week Intensive Intervention Cycle' },
            { id: 'tier3-progress', type: 'binary-choice', title: 'Progress Monitoring Results' },
            { id: 'tier3-fade-tier2', type: 'final', title: 'Fade to Tier 2 Supports' }, // conditional
            { id: 'tier3-clinicians', type: 'final', title: 'Meet with Clinicians' } // conditional
        ]
    }
};

// Step content definitions
const STEP_CONTENT = {
    'tier1-intro': {
        title: 'Principles of Explicit and Systematic Instruction',
        description: 'Ensure these key principles are in place for all students:',
        checklist: [
            'Clear learning objectives are stated at the beginning of each lesson',
            'Skills are taught systematically, following a logical progression',
            'Teacher models the skill with think-alouds and demonstrations',
            'Students receive guided practice with immediate feedback',
            'Independent practice is provided with gradual release of responsibility'
        ],
        buttonText: 'Start Assessment'
    },
    'tier1-screener': {
        title: 'Select Literacy Screener',
        description: 'Choose the literacy screener used to assess students:',
        options: ['DIBELS', 'CTOPP-2', 'THaFoL', 'IDAPEL'],
        buttonText: 'Continue'
    },
    'tier1-effectiveness': {
        title: 'Evaluate Instruction Effectiveness',
        description: 'Based on screening results and classroom observations, was the instruction effective?',
        options: [
            { value: 'effective', label: 'Effective - Students are meeting benchmarks' },
            { value: 'ineffective', label: 'Ineffective - Students are not meeting benchmarks' }
        ],
        buttonText: 'Continue'
    },
    'tier1-percentage': {
        title: 'Student Success Rate',
        description: 'Was the instruction unsuccessful for more than 20% of students?',
        options: [
            { value: 'more-than-20', label: 'Yes - More than 20% unsuccessful' },
            { value: 'less-than-20', label: 'No - Less than 20% unsuccessful' }
        ],
        buttonText: 'Continue'
    },
    'tier1-reteach': {
        title: 'Reteach Using Different Strategies',
        description: 'When less than 20% of students are unsuccessful, it indicates that core instruction is generally effective but needs adjustment for a small group.',
        content: [
            'Review and adjust your instructional approach',
            'Use different teaching methods or materials',
            'Provide additional modeling and scaffolding',
            'Consider alternative examples and practice activities',
            'Monitor progress and reteach as needed'
        ],
        buttonText: 'Return to Dashboard'
    },
    'tier1-move-tier2': {
        title: 'Move to Tier 2 Interventions',
        description: 'When more than 20% of students are unsuccessful, it indicates a need for more intensive, small-group interventions.',
        content: [
            'Students will receive targeted small-group instruction',
            'Interventions will be provided 20-30 minutes daily',
            'Progress will be monitored bi-weekly to monthly',
            'Instruction will be more explicit and systematic'
        ],
        buttonText: 'Go to Tier 2',
        nextTier: 'tier2'
    },
    'tier2-intro': {
        title: 'Small Group Intervention Requirements',
        description: 'Ensure these elements are in place for Tier 2 interventions:',
        checklist: [
            'Small groups of 3-6 students with similar needs',
            '20-30 minutes of intervention daily, in addition to core instruction',
            'Evidence-based intervention programs and strategies',
            'Progress monitoring conducted bi-weekly to monthly',
            'Interventions provided for at least 8 weeks before making changes'
        ],
        buttonText: 'Start Assessment'
    },
    'tier2-drilldown': {
        title: 'Select Drill Down Assessments',
        description: 'Choose drill-down assessments based on the screener and areas of concern:',
        placeholder: 'Assessment selection will be based on the screener chosen in Tier 1 (or selected here if starting at Tier 2) and the specific subtest results.',
        buttonText: 'Continue'
    },
    'tier2-intervention': {
        title: 'Choose Interventions',
        description: 'Select evidence-based interventions matched to student needs:',
        placeholder: 'Intervention options will be displayed based on the chosen screener, drill-down assessment results, and skill deficits identified.',
        buttonText: 'Begin Intervention'
    },
    'tier2-8weeks': {
        title: '8-Week Intervention Cycle',
        description: 'Implement the selected interventions with fidelity:',
        content: [
            'Provide daily 20-30 minute intervention sessions',
            'Use evidence-based strategies consistently',
            'Monitor student engagement and response',
            'Conduct progress monitoring bi-weekly or monthly',
            'Document implementation fidelity',
            'Graph student progress data',
            'Review data after 8 weeks to make decisions'
        ],
        buttonText: 'Complete Cycle & Review'
    },
    'tier2-progress': {
        title: 'Progress Monitoring Results',
        description: 'After 8 weeks of intervention, evaluate student progress:',
        options: [
            { value: 'effective', label: 'Effective - Student is making adequate progress' },
            { value: 'ineffective', label: 'Ineffective - Student is not making adequate progress' }
        ],
        buttonText: 'Continue'
    },
    'tier2-fade-tier1': {
        title: 'Fade to Tier 1 Supports',
        description: 'Student has made adequate progress and can return to Tier 1 with monitoring.',
        content: [
            'Gradually reduce the frequency of Tier 2 interventions',
            'Continue monitoring progress in Tier 1',
            'Provide booster sessions as needed',
            'Communicate progress with classroom teacher',
            'Plan for re-entry to Tier 2 if progress stalls'
        ],
        buttonText: 'Return to Dashboard'
    },
    'tier2-move-tier3': {
        title: 'Move to Tier 3 Interventions',
        description: 'Student requires more intensive, individualized interventions.',
        content: [
            'Student will receive intensive 1-on-1 or very small group instruction',
            'Interventions will be provided 45-60 minutes daily',
            'Progress will be monitored weekly',
            'Instruction will be highly individualized and explicit'
        ],
        buttonText: 'Go to Tier 3',
        nextTier: 'tier3'
    },
    'tier3-intro': {
        title: 'Intensive Personalized Interventions',
        description: 'Tier 3 interventions are the most intensive level of support, designed for students with significant literacy needs.',
        content: [
            'One-on-one or groups of 1-2 students maximum',
            '45-60 minutes of intervention daily',
            'Highly specialized, evidence-based programs',
            'Weekly progress monitoring',
            'Provided by highly trained interventionists',
            'Comprehensive assessment and ongoing data review'
        ],
        buttonText: 'Start Assessment'
    },
    'tier3-drilldown': {
        title: 'Select Drill Down Assessments',
        description: 'Comprehensive diagnostic assessments to pinpoint specific deficits:',
        placeholder: 'Detailed assessment selection will be based on comprehensive diagnostic testing, including phonological processing, orthographic knowledge, morphological awareness, and other literacy components.',
        buttonText: 'Continue'
    },
    'tier3-intervention': {
        title: 'Choose Personalized Interventions',
        description: 'Select intensive, individualized interventions:',
        placeholder: 'Intervention options will include specialized programs such as structured literacy approaches (e.g., Orton-Gillingham based programs), intensive reading interventions, and evidence-based strategies tailored to the specific skill deficits.',
        buttonText: 'Begin Intensive Intervention'
    },
    'tier3-8weeks': {
        title: '8-Week Intensive Intervention Cycle',
        description: 'Implement intensive interventions with high fidelity:',
        content: [
            'Provide daily 45-60 minute intensive intervention sessions',
            'Use highly specialized, evidence-based programs',
            'Maintain detailed records of student responses',
            'Conduct weekly progress monitoring',
            'Adjust instruction based on daily and weekly data',
            'Graph and analyze progress continuously',
            'Collaborate with team members regularly',
            'Review comprehensive data after 8 weeks'
        ],
        buttonText: 'Complete Cycle & Review'
    },
    'tier3-progress': {
        title: 'Progress Monitoring Results',
        description: 'After 8 weeks of intensive intervention, evaluate student progress:',
        options: [
            { value: 'effective', label: 'Effective - Student is making adequate progress' },
            { value: 'ineffective', label: 'Ineffective - Student is not making adequate progress' }
        ],
        buttonText: 'Continue'
    },
    'tier3-fade-tier2': {
        title: 'Fade to Tier 2 Supports',
        description: 'Student has made adequate progress and can transition to less intensive support.',
        content: [
            'Gradually reduce the frequency and duration of Tier 3 interventions',
            'Transition to Tier 2 small group interventions',
            'Continue weekly progress monitoring initially',
            'Provide booster sessions in Tier 3 as needed',
            'Maintain communication with intervention team'
        ],
        buttonText: 'Return to Dashboard'
    },
    'tier3-clinicians': {
        title: 'Meet with Clinicians',
        description: 'Student continues to struggle despite intensive interventions. Additional evaluation and support are needed.',
        content: [
            'Schedule a comprehensive team meeting',
            'Review all assessment and intervention data',
            'Consider referral for additional evaluations (e.g., special education, speech-language, psychological)',
            'Explore alternative interventions or modifications',
            'Consider if additional services or support are needed',
            'Develop a comprehensive plan with input from specialists',
            'Continue Tier 3 interventions while evaluations are conducted'
        ],
        buttonText: 'Return to Dashboard'
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadInterventionsData();
    initializeNavigation();
    initializeTierSelection();
    initializeMobileMenu();
    animatePageLoad();
});

// Animate page load with Motion One (only on initial load)
function animatePageLoad() {
    if (typeof Motion !== 'undefined') {
        // Animate sidebar navigation items - one-time only
        Motion.animate(
            '#sidebar-nav li',
            { x: [-50, 0], opacity: [0, 1] },
            { delay: Motion.stagger(0.1), duration: 0.5, easing: 'ease-out' }
        );

        // Animate tier cards on initial load - one-time only
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

            // Animate section transition
            if (typeof Motion !== 'undefined') {
                const visibleSection = document.querySelector('section:not([style*="display: none"])');
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
    
    // Reset to tier dashboard
    showTierDashboard();
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
    
    tierButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tierId = button.getAttribute('data-tier');
            startTierWizard(tierId);
        });
    });
}

// Start tier wizard
function startTierWizard(tierId) {
    appState.currentTier = TIER_DEFINITIONS[tierId];
    appState.stepHistory = [];
    appState.selectedData = {
        screener: null,
        effectiveness: null,
        percentageUnsuccessful: null,
        drillDownAssessment: null,
        interventionChoice: null,
        progressResult: null
    };
    
    // Hide tier dashboard
    document.querySelector('.tier-dashboard').style.display = 'none';
    
    // Show wizard container
    let wizardContainer = document.getElementById('wizard-container');
    if (!wizardContainer) {
        wizardContainer = document.createElement('div');
        wizardContainer.id = 'wizard-container';
        const interventionsSection = document.getElementById('interventions-section');
        interventionsSection.appendChild(wizardContainer);
    }
    wizardContainer.innerHTML = '';
    wizardContainer.style.display = 'block';
    
    // Navigate to first step
    navigateToStep(appState.currentTier.steps[0].id);
}

// Navigate to a specific step
function navigateToStep(stepId, isBack = false) {
    if (!isBack) {
        appState.stepHistory.push(appState.currentStep);
    }
    appState.currentStep = stepId;
    
    const stepDef = getCurrentStepDefinition();
    const stepContent = STEP_CONTENT[stepId];
    
    renderStep(stepDef, stepContent);
}

// Go back to previous step
function goBack() {
    if (appState.stepHistory.length > 0) {
        const previousStep = appState.stepHistory.pop();
        if (previousStep) {
            appState.currentStep = previousStep;
            const stepDef = getCurrentStepDefinition();
            if (stepDef) {
                const stepContent = STEP_CONTENT[previousStep];
                renderStep(stepDef, stepContent);
            } else {
                // Step not found, go back to dashboard
                showTierDashboard();
            }
        } else {
            // Go back to dashboard
            showTierDashboard();
        }
    } else {
        // No history, go back to dashboard
        showTierDashboard();
    }
}

// Get current step definition
function getCurrentStepDefinition() {
    return appState.currentTier.steps.find(s => s.id === appState.currentStep);
}

// Render a step
function renderStep(stepDef, stepContent) {
    const wizardContainer = document.getElementById('wizard-container');
    
    // Clear previous content with animation
    const existingContent = wizardContainer.querySelector('.wizard-step');
    if (existingContent && typeof Motion !== 'undefined') {
        Motion.animate(existingContent, { opacity: 0, y: -20 }, { duration: 0.3 }).finished.then(() => {
            renderStepContent();
        });
    } else {
        renderStepContent();
    }
    
    function renderStepContent() {
        let html = '<div class="wizard-step active">';
        
        // Back button
        html += '<button class="btn-back" onclick="goBack()">← Back</button>';
        
        // Wizard content
        html += '<div class="wizard-content">';
        html += `<h2>${stepContent.title}</h2>`;
        html += `<p class="description">${stepContent.description}</p>`;
        
        // Render based on step type
        switch (stepDef.type) {
            case 'checklist':
                html += renderChecklist(stepContent);
                break;
            case 'selection':
                html += renderSelection(stepContent, stepDef);
                break;
            case 'binary-choice':
                html += renderBinaryChoice(stepContent, stepDef);
                break;
            case 'placeholder':
                html += renderPlaceholder(stepContent);
                break;
            case 'info':
                html += renderInfo(stepContent);
                break;
            case 'final':
                html += renderFinal(stepContent);
                break;
        }
        
        html += '</div></div>';
        
        wizardContainer.innerHTML = html;
        
        // Animate in with Motion One
        if (typeof Motion !== 'undefined') {
            const newContent = wizardContainer.querySelector('.wizard-step');
            Motion.animate(newContent, { opacity: [0, 1], y: [20, 0] }, { duration: 0.4, easing: [0.4, 0, 0.2, 1] });
        }
    }
}

// Render checklist step
function renderChecklist(stepContent) {
    let html = '<div class="wizard-checklist"><ul>';
    stepContent.checklist.forEach(item => {
        html += `<li>${item}</li>`;
    });
    html += '</ul></div>';
    
    html += '<div class="wizard-buttons center">';
    html += `<button class="btn-primary" onclick="handleChecklistComplete()">${stepContent.buttonText}</button>`;
    html += '</div>';
    
    return html;
}

// Render selection step
function renderSelection(stepContent, stepDef) {
    let html = '';
    
    if (stepDef.id === 'tier2-drilldown' || stepDef.id === 'tier3-drilldown') {
        // Show placeholder for drill-down assessments
        html += '<div class="placeholder-box">';
        html += '<h4>🔍 Drill-Down Assessment Selection</h4>';
        html += `<p>${stepContent.placeholder}</p>`;
        html += '</div>';
    } else if (stepContent.options) {
        // Show options
        html += '<div class="option-grid">';
        stepContent.options.forEach(option => {
            html += `<button class="btn-option" onclick="handleOptionSelect('${option}', '${stepDef.id}')">${option}</button>`;
        });
        html += '</div>';
    }
    
    html += '<div class="wizard-buttons center">';
    html += `<button class="btn-primary" onclick="handleSelectionComplete('${stepDef.id}')">${stepContent.buttonText}</button>`;
    html += '</div>';
    
    return html;
}

// Render binary choice step
function renderBinaryChoice(stepContent, stepDef) {
    let html = '<div class="option-grid">';
    stepContent.options.forEach(option => {
        html += `<button class="btn-option" onclick="handleBinaryChoice('${option.value}', '${stepDef.id}')">${option.label}</button>`;
    });
    html += '</div>';
    
    return html;
}

// Render placeholder step
function renderPlaceholder(stepContent) {
    let html = '<div class="placeholder-box">';
    html += '<h4>📚 Intervention Selection</h4>';
    html += `<p>${stepContent.placeholder}</p>`;
    html += '</div>';
    
    html += '<div class="wizard-buttons center">';
    html += `<button class="btn-primary" onclick="handlePlaceholderComplete()">${stepContent.buttonText}</button>`;
    html += '</div>';
    
    return html;
}

// Render info step
function renderInfo(stepContent) {
    let html = '<div class="wizard-checklist"><ul>';
    stepContent.content.forEach(item => {
        html += `<li>${item}</li>`;
    });
    html += '</ul></div>';
    
    html += '<div class="wizard-buttons center">';
    html += `<button class="btn-primary" onclick="handleInfoComplete()">${stepContent.buttonText}</button>`;
    html += '</div>';
    
    return html;
}

// Render final step
function renderFinal(stepContent) {
    let html = '<div class="wizard-checklist"><ul>';
    stepContent.content.forEach(item => {
        html += `<li>${item}</li>`;
    });
    html += '</ul></div>';
    
    html += '<div class="wizard-buttons center">';
    if (stepContent.nextTier) {
        html += `<button class="btn-primary" onclick="handleFinalWithNextTier('${stepContent.nextTier}')">${stepContent.buttonText}</button>`;
    } else {
        html += `<button class="btn-primary" onclick="handleFinalComplete()">${stepContent.buttonText}</button>`;
    }
    html += '</div>';
    
    return html;
}

// Handler functions (called from rendered HTML)
window.handleChecklistComplete = function() {
    goToNextStep();
};

window.handleOptionSelect = function(option, stepId) {
    // Store selection
    if (stepId === 'tier1-screener') {
        appState.selectedData.screener = option;
    }
    
    // Visual feedback
    document.querySelectorAll('.btn-option').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
};

window.handleSelectionComplete = function(stepId) {
    // Validate selection if needed
    if (stepId === 'tier1-screener' && !appState.selectedData.screener) {
        alert('Please select a screener option.');
        return;
    }
    
    goToNextStep();
};

window.handleBinaryChoice = function(value, stepId) {
    // Store selection
    if (stepId === 'tier1-effectiveness') {
        appState.selectedData.effectiveness = value;
    } else if (stepId === 'tier1-percentage') {
        appState.selectedData.percentageUnsuccessful = value;
    } else if (stepId === 'tier2-progress') {
        appState.selectedData.progressResult = value;
    } else if (stepId === 'tier3-progress') {
        appState.selectedData.progressResult = value;
    }
    
    // Navigate based on choice
    if (stepId === 'tier1-effectiveness') {
        if (value === 'effective') {
            // Instruction is effective, return to dashboard
            showSuccessMessage('Great! Students are meeting benchmarks. Continue with core instruction and monitor progress.');
            setTimeout(() => showTierDashboard(), 2000);
        } else {
            // Instruction is ineffective, go to percentage question
            goToNextStep();
        }
    } else if (stepId === 'tier1-percentage') {
        if (value === 'less-than-20') {
            navigateToStep('tier1-reteach');
        } else {
            navigateToStep('tier1-move-tier2');
        }
    } else if (stepId === 'tier2-progress') {
        if (value === 'effective') {
            navigateToStep('tier2-fade-tier1');
        } else {
            navigateToStep('tier2-move-tier3');
        }
    } else if (stepId === 'tier3-progress') {
        if (value === 'effective') {
            navigateToStep('tier3-fade-tier2');
        } else {
            navigateToStep('tier3-clinicians');
        }
    }
};

window.handlePlaceholderComplete = function() {
    goToNextStep();
};

window.handleInfoComplete = function() {
    goToNextStep();
};

window.handleFinalComplete = function() {
    showTierDashboard();
};

window.handleFinalWithNextTier = function(nextTierId) {
    startTierWizard(nextTierId);
};

// Go to next step in sequence
function goToNextStep() {
    const currentStepIndex = appState.currentTier.steps.findIndex(s => s.id === appState.currentStep);
    if (currentStepIndex < appState.currentTier.steps.length - 1) {
        const nextStep = appState.currentTier.steps[currentStepIndex + 1];
        navigateToStep(nextStep.id);
    } else {
        // No more steps, return to dashboard
        showTierDashboard();
    }
}

// Show tier dashboard
function showTierDashboard() {
    document.querySelector('.tier-dashboard').style.display = 'grid';
    const wizardContainer = document.getElementById('wizard-container');
    if (wizardContainer) {
        wizardContainer.style.display = 'none';
    }
    
    appState.currentTier = null;
    appState.currentStep = null;
    appState.stepHistory = [];

    // Animate tier cards back in
    if (typeof Motion !== 'undefined') {
        Motion.animate(
            '.tier-card',
            { y: [30, 0], opacity: [0, 1], scale: [0.95, 1] },
            { delay: Motion.stagger(0.1), duration: 0.5, easing: [0.4, 0, 0.2, 1] }
        );
    }
}

// Show error message
function showError(message) {
    const mainContent = document.getElementById('main-content');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    mainContent.prepend(errorDiv);
}

// Show success message
function showSuccessMessage(message) {
    const wizardContainer = document.getElementById('wizard-container');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    wizardContainer.prepend(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}
