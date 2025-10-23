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

// Tier and Step definitions (same as before)
const TIER_DEFINITIONS = {
    tier1: {
        id: 'tier1',
        name: 'Tier 1 - Universal Classroom Literacy Interventions',
        steps: [
            { id: 'tier1-intro', type: 'checklist', title: 'Principles of Explicit and Systematic Instruction' },
            { id: 'tier1-screener', type: 'selection', title: 'Select Literacy Screener' },
            { id: 'tier1-effectiveness', type: 'binary-choice', title: 'Evaluate Instruction Effectiveness' },
            { id: 'tier1-percentage', type: 'binary-choice', title: 'Student Success Rate' },
            { id: 'tier1-reteach', type: 'final', title: 'Reteach Using Different Strategies' },
            { id: 'tier1-move-tier2', type: 'final', title: 'Move to Tier 2 Interventions' }
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
            { id: 'tier2-fade-tier1', type: 'final', title: 'Fade to Tier 1 Supports' },
            { id: 'tier2-move-tier3', type: 'final', title: 'Move to Tier 3 Interventions' }
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
            { id: 'tier3-fade-tier2', type: 'final', title: 'Fade to Tier 2 Supports' },
            { id: 'tier3-clinicians', type: 'final', title: 'Meet with Clinicians' }
        ]
    }
};

// Keep STEP_CONTENT the same as before
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
        placeholder: 'Assessment selection will be based on your screener choice',
        buttonText: 'Continue'
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeTierSelection();
    initializeMobileMenu();
    initializeAccordions();
    initializeFAQs();
});

// Navigation between main sections
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const sections = document.querySelectorAll('.content-section');
    
    // Desktop navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            switchSection(targetPage, navLinks);
        });
    });
    
    // Mobile navigation
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            switchSection(targetPage, navLinks);
            closeMobileMenu();
        });
    });
    
    function switchSection(targetPage, navLinks) {
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(targetPage + '-section');
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === targetPage) {
                link.classList.add('active');
            }
        });
    }
}

// Tier selection handlers
function initializeTierSelection() {
    const tierPaths = document.querySelectorAll('.tier-path');
    const tierActions = document.querySelectorAll('.tier-action');
    
    tierPaths.forEach(path => {
        const button = path.querySelector('.tier-action');
        if (button) {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const tier = path.getAttribute('data-tier');
                startTierJourney(tier);
            });
        }
    });
}

function startTierJourney(tier) {
    appState.currentTier = tier;
    appState.currentStep = 0;
    appState.stepHistory = [];
    
    // Show wizard container
    const wizardContainer = document.getElementById('wizard-container');
    if (wizardContainer) {
        wizardContainer.classList.remove('hidden');
        displayCurrentStep();
        
        // Scroll to wizard
        wizardContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function displayCurrentStep() {
    const wizardContainer = document.getElementById('wizard-container');
    if (!wizardContainer || !appState.currentTier) return;
    
    const tierDef = TIER_DEFINITIONS[appState.currentTier];
    if (!tierDef) return;
    
    const step = tierDef.steps[appState.currentStep];
    if (!step) return;
    
    const stepContent = STEP_CONTENT[step.id];
    if (!stepContent) return;
    
    // Create step HTML
    let html = `
        <div class="wizard-step">
            <div class="wizard-header">
                <h3>${stepContent.title}</h3>
                <p>${stepContent.description}</p>
            </div>
            <div class="wizard-body">
    `;
    
    // Add content based on step type
    if (stepContent.checklist) {
        html += '<ul class="checklist">';
        stepContent.checklist.forEach(item => {
            html += `<li>${item}</li>`;
        });
        html += '</ul>';
    }
    
    if (stepContent.options) {
        if (Array.isArray(stepContent.options) && typeof stepContent.options[0] === 'string') {
            // Simple string options
            html += '<div class="options-list">';
            stepContent.options.forEach(option => {
                html += `<button class="option-btn" data-value="${option}">${option}</button>`;
            });
            html += '</div>';
        } else if (Array.isArray(stepContent.options)) {
            // Object options with value and label
            html += '<div class="options-list">';
            stepContent.options.forEach(option => {
                html += `<button class="option-btn" data-value="${option.value}">${option.label}</button>`;
            });
            html += '</div>';
        }
    }
    
    if (stepContent.content) {
        html += '<ul class="content-list">';
        stepContent.content.forEach(item => {
            html += `<li>${item}</li>`;
        });
        html += '</ul>';
    }
    
    html += `
            </div>
            <div class="wizard-footer">
    `;
    
    // Add back button if not first step
    if (appState.stepHistory.length > 0) {
        html += '<button class="wizard-btn wizard-btn-back">Back</button>';
    }
    
    // Add main action button
    html += `<button class="wizard-btn wizard-btn-primary">${stepContent.buttonText || 'Continue'}</button>`;
    
    html += `
            </div>
        </div>
    `;
    
    wizardContainer.innerHTML = html;
    
    // Attach event listeners
    attachWizardListeners();
}

function attachWizardListeners() {
    // Primary button
    const primaryBtn = document.querySelector('.wizard-btn-primary');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', handlePrimaryAction);
    }
    
    // Back button
    const backBtn = document.querySelector('.wizard-btn-back');
    if (backBtn) {
        backBtn.addEventListener('click', handleBackAction);
    }
    
    // Option buttons
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove selected class from all options
            optionBtns.forEach(b => b.classList.remove('selected'));
            // Add selected class to clicked option
            this.classList.add('selected');
        });
    });
}

function handlePrimaryAction() {
    const tierDef = TIER_DEFINITIONS[appState.currentTier];
    const step = tierDef.steps[appState.currentStep];
    const stepContent = STEP_CONTENT[step.id];
    
    // Check if an option needs to be selected
    const selectedOption = document.querySelector('.option-btn.selected');
    if (stepContent.options && !selectedOption) {
        alert('Please select an option before continuing');
        return;
    }
    
    // Save history
    appState.stepHistory.push(appState.currentStep);
    
    // Move to next step
    if (appState.currentStep < tierDef.steps.length - 1) {
        appState.currentStep++;
        displayCurrentStep();
    } else {
        // End of wizard
        finishWizard();
    }
}

function handleBackAction() {
    if (appState.stepHistory.length > 0) {
        appState.currentStep = appState.stepHistory.pop();
        displayCurrentStep();
    }
}

function finishWizard() {
    const wizardContainer = document.getElementById('wizard-container');
    if (wizardContainer) {
        wizardContainer.innerHTML = `
            <div class="wizard-complete">
                <h3>Journey Complete!</h3>
                <p>Thank you for using Literacy Pal</p>
                <button class="wizard-btn wizard-btn-primary" onclick="resetWizard()">Start New Journey</button>
            </div>
        `;
    }
}

function resetWizard() {
    appState.currentTier = null;
    appState.currentStep = null;
    appState.stepHistory = [];
    
    const wizardContainer = document.getElementById('wizard-container');
    if (wizardContainer) {
        wizardContainer.classList.add('hidden');
        wizardContainer.innerHTML = '';
    }
}

// Mobile menu handlers
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            mobileNavOverlay.classList.toggle('active');
        });
    }
}

function closeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove('active');
    }
    if (mobileNavOverlay) {
        mobileNavOverlay.classList.remove('active');
    }
}

// FAQ accordion handlers
function initializeFAQs() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked FAQ if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// Assessment tool accordion handlers
function initializeAccordions() {
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all accordions
            document.querySelectorAll('.accordion-trigger').forEach(t => {
                t.classList.remove('active');
                if (t.nextElementSibling) {
                    t.nextElementSibling.style.maxHeight = null;
                }
            });
            
            // Open clicked accordion if it wasn't active
            if (!isActive) {
                this.classList.add('active');
                if (content) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            }
        });
    });
}
