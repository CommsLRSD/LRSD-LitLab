// ==========================================
// Literacy Interventions Guide - Application
// ==========================================

// Application State
const appState = {
    currentTier: 'tier1',
    currentStep: 'start',
    history: [],
    selections: {}
};

// Tier Definitions with Steps
const TIER_DEFINITIONS = {
    tier1: {
        name: 'Tier 1: Universal Classroom Literacy Interventions',
        steps: [
            'start',
            'principles',
            'screener',
            'effectiveness',
            'studentRate',
            'reteach',
            'moveToTier2',
            'continueMonitor'
        ]
    },
    tier2: {
        name: 'Tier 2: Small Group Interventions',
        steps: [
            'start',
            'requirements',
            'drillDown',
            'interventions',
            'eightWeek',
            'progressMonitor',
            'fadeToTier1',
            'moveToTier3'
        ]
    },
    tier3: {
        name: 'Tier 3: Personalized Interventions',
        steps: [
            'start',
            'introduction',
            'drillDown',
            'interventions',
            'eightWeek',
            'progressMonitor',
            'fadeToTier2',
            'meetClinicians'
        ]
    }
};

// Step Content Definitions
const STEP_CONTENT = {
    // ===== TIER 1 STEPS =====
    tier1_start: {
        title: 'Tier 1: Universal Classroom Literacy Interventions',
        description: 'High-quality instruction for all students (80%)',
        content: `
            <p class="mb-3">This tier focuses on providing high-quality, evidence-based instruction to all students in the general education classroom.</p>
            <div class="info-box">
                <h3>Target Population</h3>
                <p>All students receive Tier 1 instruction as the foundation of the Multi-Tiered System of Supports (MTSS).</p>
            </div>
        `,
        actions: `
            <button class="btn btn-primary btn-full" onclick="navigateToStep('principles')">Begin Tier 1</button>
        `
    },
    
    tier1_principles: {
        title: 'Principles of Explicit and Systematic Instruction',
        description: 'Review the 8 key principles before beginning',
        content: `
            <p class="mb-3">Ensure your instruction incorporates these evidence-based principles:</p>
            <ul class="checklist">
                <li class="checklist-item">Model the skill or strategy explicitly</li>
                <li class="checklist-item">Provide guided practice with immediate feedback</li>
                <li class="checklist-item">Include multiple opportunities for independent practice</li>
                <li class="checklist-item">Use systematic and sequential instruction</li>
                <li class="checklist-item">Incorporate cumulative review of previously learned skills</li>
                <li class="checklist-item">Provide corrective feedback promptly</li>
                <li class="checklist-item">Monitor student progress regularly</li>
                <li class="checklist-item">Adjust instruction based on student data</li>
            </ul>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
                <button class="btn btn-primary" onclick="navigateToStep('screener')">Next: Select Screener</button>
            </div>
        `
    },
    
    tier1_screener: {
        title: 'Select Literacy Screener',
        description: 'Choose the assessment tool you used',
        content: `
            <p class="mb-3">Select the literacy screening tool that was administered:</p>
            <div class="selection-grid">
                <button class="selection-option" data-value="DIBELS" onclick="selectScreener('DIBELS')">DIBELS</button>
                <button class="selection-option" data-value="CTOPP-2" onclick="selectScreener('CTOPP-2')">CTOPP-2</button>
                <button class="selection-option" data-value="THaFoL" onclick="selectScreener('THaFoL')">THaFoL</button>
                <button class="selection-option" data-value="IDAPEL" onclick="selectScreener('IDAPEL')">IDAPEL</button>
            </div>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
            </div>
        `
    },
    
    tier1_effectiveness: {
        title: 'Evaluate Instruction Effectiveness',
        description: 'Based on screener results, was instruction effective?',
        content: `
            <p class="mb-3">Review the screening data and determine if the instruction was effective:</p>
            <div class="info-box mb-3">
                <p><strong>Effective (Blue/Green):</strong> Students are meeting or exceeding benchmarks</p>
                <p><strong>Ineffective (Yellow/Red):</strong> Students are not meeting benchmarks</p>
            </div>
            <div class="binary-choice">
                <button class="selection-option" data-value="effective" onclick="selectEffectiveness('effective')">Effective</button>
                <button class="selection-option" data-value="ineffective" onclick="selectEffectiveness('ineffective')">Ineffective</button>
            </div>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
            </div>
        `
    },
    
    tier1_continueMonitor: {
        title: 'Continue and Monitor',
        description: 'Instruction is effective',
        content: `
            <div class="success-box">
                <h3>✓ Excellent Progress!</h3>
                <p>Students are responding well to Tier 1 instruction. Continue with the general curriculum and monitor progress regularly through universal screening.</p>
            </div>
            <div class="info-box mt-3">
                <h3>Next Steps</h3>
                <p>• Continue high-quality Tier 1 instruction</p>
                <p>• Monitor all students through universal screening (3 times per year)</p>
                <p>• Adjust instruction based on ongoing assessment data</p>
            </div>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
                <button class="btn btn-primary" onclick="resetWizard()">Complete</button>
            </div>
        `
    },
    
    tier1_studentRate: {
        title: 'Student Success Rate',
        description: 'What percentage of students were unsuccessful?',
        content: `
            <p class="mb-3">Instruction was ineffective. Determine the percentage of students who did not meet benchmarks:</p>
            <div class="binary-choice">
                <button class="selection-option" data-value="20plus" onclick="selectStudentRate('20plus')">20% or more of students</button>
                <button class="selection-option" data-value="less20" onclick="selectStudentRate('less20')">Fewer than 20% of students</button>
            </div>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
            </div>
        `
    },
    
    tier1_reteach: {
        title: 'Reteach General Curriculum',
        description: '20% or more students unsuccessful',
        content: `
            <div class="warning-box">
                <h3>Core Instruction Adjustment Needed</h3>
                <p>When 20% or more students are unsuccessful, the core instruction needs to be adjusted for the whole class.</p>
            </div>
            <div class="info-box mt-3">
                <h3>Next Steps</h3>
                <p><strong>Reteach using different strategies:</strong></p>
                <ul class="checklist mt-2">
                    <li class="checklist-item">Review and adjust your instructional approach</li>
                    <li class="checklist-item">Incorporate more explicit modeling and guided practice</li>
                    <li class="checklist-item">Increase opportunities for student response</li>
                    <li class="checklist-item">Provide additional visual supports and scaffolding</li>
                </ul>
            </div>
            <p class="mt-3">Select interventions based on your screener (Screener: ${() => appState.selections.screener || 'Not selected'}):</p>
            <div class="info-box">
                <p><em>Intervention recommendations would be displayed here based on the selected screener and specific skill deficits identified.</em></p>
            </div>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
                <button class="btn btn-primary" onclick="resetWizard()">Complete</button>
            </div>
        `
    },
    
    tier1_moveToTier2: {
        title: 'Move to Tier 2 Interventions',
        description: 'Fewer than 20% students unsuccessful',
        content: `
            <div class="info-box">
                <h3>Tier 2 Interventions Recommended</h3>
                <p>When fewer than 20% of students are unsuccessful, those students need additional targeted support through Tier 2 interventions.</p>
            </div>
            <div class="info-box mt-3">
                <h3>What This Means</h3>
                <p>• The core instruction is working for most students</p>
                <p>• A small group needs supplemental support</p>
                <p>• Students will receive Tier 1 + Tier 2 instruction</p>
            </div>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
                <button class="btn btn-primary" onclick="switchToTier('tier2')">Begin Tier 2</button>
            </div>
        `
    },
    
    // ===== TIER 2 STEPS =====
    tier2_start: {
        title: 'Tier 2: Small Group Interventions',
        description: 'Targeted support for students at risk (15%)',
        content: `
            <p class="mb-3">Tier 2 provides additional, targeted support for students who need more than Tier 1 instruction alone.</p>
            <div class="info-box">
                <h3>Tier 2 Characteristics</h3>
                <p><strong>Delivery:</strong> Small groups (3-6 students)</p>
                <p><strong>Duration:</strong> 20-30 minutes daily</p>
                <p><strong>Setting:</strong> In addition to Tier 1 core instruction</p>
                <p><strong>Target:</strong> Approximately 15% of students</p>
            </div>
        `,
        actions: `
            <button class="btn btn-primary btn-full" onclick="navigateToStep('requirements')">Begin Tier 2</button>
        `
    },
    
    tier2_requirements: {
        title: 'Tier 2 Requirements Checklist',
        description: 'Review key elements for effective Tier 2 interventions',
        content: `
            <p class="mb-3">Ensure your Tier 2 interventions include these elements:</p>
            <ul class="checklist">
                <li class="checklist-item">Small group instruction (3-6 students with similar needs)</li>
                <li class="checklist-item">20-30 minutes of daily instruction</li>
                <li class="checklist-item">Evidence-based interventions targeting specific skill deficits</li>
                <li class="checklist-item">Progress monitoring every 2 weeks</li>
                <li class="checklist-item">Delivered in addition to Tier 1 core instruction</li>
            </ul>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
                <button class="btn btn-primary" onclick="navigateToStep('drillDown')">Next: Select Assessment</button>
            </div>
        `
    },
    
    tier2_drillDown: {
        title: 'Drill Down Assessment',
        description: 'Select diagnostic assessment to identify specific skill deficits',
        content: `
            <p class="mb-3">Use a drill-down assessment to identify the specific literacy skills that need intervention:</p>
            <div class="info-box">
                <p><em>Drill-down assessments help pinpoint exactly which sub-skills within broader literacy areas (e.g., phonemic awareness, phonics, fluency) need targeted instruction.</em></p>
            </div>
            <div class="selection-grid mt-3">
                <button class="selection-option" data-value="phonemic" onclick="selectDrillDown('phonemic')">Phonemic Awareness</button>
                <button class="selection-option" data-value="phonics" onclick="selectDrillDown('phonics')">Phonics</button>
                <button class="selection-option" data-value="fluency" onclick="selectDrillDown('fluency')">Fluency</button>
                <button class="selection-option" data-value="vocabulary" onclick="selectDrillDown('vocabulary')">Vocabulary</button>
                <button class="selection-option" data-value="comprehension" onclick="selectDrillDown('comprehension')">Comprehension</button>
            </div>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
            </div>
        `
    },
    
    tier2_interventions: {
        title: 'Select Interventions',
        description: 'Choose evidence-based interventions for targeted instruction',
        content: `
            <p class="mb-3">Based on your drill-down assessment, select appropriate interventions:</p>
            <div class="info-box">
                <h3>Selected Area: <span id="selectedDrillDown"></span></h3>
                <p class="mt-2"><em>Evidence-based intervention options for this skill area would be displayed here, including program names, materials needed, and implementation guidance.</em></p>
            </div>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
                <button class="btn btn-primary" onclick="navigateToStep('eightWeek')">Next: Begin 8-Week Cycle</button>
            </div>
        `
    },
    
    tier2_eightWeek: {
        title: '8-Week Intervention Cycle',
        description: 'Implement interventions with fidelity',
        content: `
            <div class="info-box">
                <h3>Implementation Guidelines</h3>
                <p><strong>Duration:</strong> 8 weeks of daily intervention</p>
                <p><strong>Frequency:</strong> 20-30 minutes per day, 5 days per week</p>
                <p><strong>Fidelity:</strong> Implement the intervention as designed</p>
                <p><strong>Progress Monitoring:</strong> Assess progress every 2 weeks</p>
            </div>
            <div class="info-box mt-3">
                <h3>During the 8-Week Cycle</h3>
                <ul class="checklist mt-2">
                    <li class="checklist-item">Deliver small group instruction consistently</li>
                    <li class="checklist-item">Use evidence-based intervention materials</li>
                    <li class="checklist-item">Monitor student engagement and response</li>
                    <li class="checklist-item">Adjust as needed based on progress monitoring data</li>
                </ul>
            </div>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
                <button class="btn btn-primary" onclick="navigateToStep('progressMonitor')">Complete 8 Weeks</button>
            </div>
        `
    },
    
    tier2_progressMonitor: {
        title: 'Progress Monitoring Results',
        description: 'Evaluate student progress after 8 weeks',
        content: `
            <p class="mb-3">After 8 weeks of Tier 2 intervention, assess student progress using your screening tool:</p>
            <div class="info-box mb-3">
                <p><strong>Effective:</strong> Student is making adequate progress and meeting benchmarks</p>
                <p><strong>Ineffective:</strong> Student continues to struggle despite intervention</p>
            </div>
            <div class="binary-choice">
                <button class="selection-option" data-value="effective" onclick="selectTier2Effectiveness('effective')">Effective</button>
                <button class="selection-option" data-value="ineffective" onclick="selectTier2Effectiveness('ineffective')">Ineffective</button>
            </div>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
            </div>
        `
    },
    
    tier2_fadeToTier1: {
        title: 'Fade to Tier 1 Supports',
        description: 'Student is making adequate progress',
        content: `
            <div class="success-box">
                <h3>✓ Excellent Progress!</h3>
                <p>The student has responded well to Tier 2 interventions and is now ready to transition back to Tier 1 instruction only.</p>
            </div>
            <div class="info-box mt-3">
                <h3>Next Steps</h3>
                <p>• Gradually fade Tier 2 supports</p>
                <p>• Continue monitoring progress through universal screening</p>
                <p>• Be prepared to reinstate Tier 2 supports if needed</p>
                <p>• Communicate success with student and family</p>
            </div>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
                <button class="btn btn-primary" onclick="resetWizard()">Complete</button>
            </div>
        `
    },
    
    tier2_moveToTier3: {
        title: 'Move to Tier 3 Interventions',
        description: 'More intensive support needed',
        content: `
            <div class="warning-box">
                <h3>Tier 3 Interventions Recommended</h3>
                <p>The student has not made adequate progress with Tier 2 interventions and needs more intensive, individualized support.</p>
            </div>
            <div class="info-box mt-3">
                <h3>What This Means</h3>
                <p>• The student needs more intensive intervention</p>
                <p>• Instruction will be more individualized (1-on-1 or pairs)</p>
                <p>• Frequency and duration will increase</p>
                <p>• Students will receive Tier 1 + Tier 3 instruction</p>
            </div>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
                <button class="btn btn-primary" onclick="switchToTier('tier3')">Begin Tier 3</button>
            </div>
        `
    },
    
    // ===== TIER 3 STEPS =====
    tier3_start: {
        title: 'Tier 3: Personalized Interventions',
        description: 'Intensive, individualized support (5%)',
        content: `
            <p class="mb-3">Tier 3 provides the most intensive level of support for students with significant needs.</p>
            <div class="info-box">
                <h3>Tier 3 Characteristics</h3>
                <p><strong>Delivery:</strong> 1-on-1 or pairs</p>
                <p><strong>Duration:</strong> 45-60 minutes daily</p>
                <p><strong>Setting:</strong> In addition to Tier 1 core instruction</p>
                <p><strong>Target:</strong> Approximately 5% of students</p>
                <p><strong>Assessment:</strong> Comprehensive diagnostic evaluation</p>
            </div>
        `,
        actions: `
            <button class="btn btn-primary btn-full" onclick="navigateToStep('introduction')">Begin Tier 3</button>
        `
    },
    
    tier3_introduction: {
        title: 'Intensive Intervention Characteristics',
        description: 'Understanding Tier 3 requirements',
        content: `
            <p class="mb-3">Tier 3 interventions are characterized by:</p>
            <ul class="checklist">
                <li class="checklist-item">Highly individualized instruction based on comprehensive assessment</li>
                <li class="checklist-item">Increased instructional time (45-60 minutes daily)</li>
                <li class="checklist-item">Smaller group size (1-on-1 or pairs)</li>
                <li class="checklist-item">More frequent progress monitoring (weekly)</li>
                <li class="checklist-item">Specialized interventions targeting specific deficits</li>
                <li class="checklist-item">May involve specialists (reading specialist, special education)</li>
            </ul>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
                <button class="btn btn-primary" onclick="navigateToStep('drillDown')">Next: Comprehensive Assessment</button>
            </div>
        `
    },
    
    tier3_drillDown: {
        title: 'Comprehensive Diagnostic Assessment',
        description: 'In-depth evaluation of literacy skills',
        content: `
            <p class="mb-3">Conduct a comprehensive diagnostic assessment to identify all areas of need:</p>
            <div class="info-box">
                <p><em>Comprehensive diagnostic assessments provide detailed information about a student's literacy skills across multiple domains. This may include formal assessments, informal reading inventories, and diagnostic batteries.</em></p>
            </div>
            <div class="selection-grid mt-3">
                <button class="selection-option" data-value="comprehensive" onclick="selectTier3DrillDown('comprehensive')">Comprehensive Literacy Assessment</button>
                <button class="selection-option" data-value="phonological" onclick="selectTier3DrillDown('phonological')">Phonological Processing</button>
                <button class="selection-option" data-value="decoding" onclick="selectTier3DrillDown('decoding')">Decoding Skills</button>
                <button class="selection-option" data-value="language" onclick="selectTier3DrillDown('language')">Oral Language</button>
            </div>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
            </div>
        `
    },
    
    tier3_interventions: {
        title: 'Select Personalized Interventions',
        description: 'Intensive, individualized intervention strategies',
        content: `
            <p class="mb-3">Based on comprehensive assessment results, select intensive interventions:</p>
            <div class="info-box">
                <h3>Assessment Area: <span id="selectedTier3DrillDown"></span></h3>
                <p class="mt-2"><em>Intensive, research-based intervention programs and strategies for this area would be displayed here. These interventions are typically more specialized and may require additional training or materials.</em></p>
            </div>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
                <button class="btn btn-primary" onclick="navigateToStep('eightWeek')">Next: Begin 8-Week Cycle</button>
            </div>
        `
    },
    
    tier3_eightWeek: {
        title: '8-Week Intensive Intervention Cycle',
        description: 'Implement interventions with high fidelity',
        content: `
            <div class="info-box">
                <h3>Implementation Guidelines</h3>
                <p><strong>Duration:</strong> 8 weeks of daily intervention</p>
                <p><strong>Frequency:</strong> 45-60 minutes per day, 5 days per week</p>
                <p><strong>Group Size:</strong> 1-on-1 or pairs only</p>
                <p><strong>Fidelity:</strong> Implement with high fidelity - specialist delivery recommended</p>
                <p><strong>Progress Monitoring:</strong> Assess progress weekly</p>
            </div>
            <div class="info-box mt-3">
                <h3>During the 8-Week Cycle</h3>
                <ul class="checklist mt-2">
                    <li class="checklist-item">Deliver intensive, individualized instruction</li>
                    <li class="checklist-item">Use specialized intervention materials and programs</li>
                    <li class="checklist-item">Monitor progress weekly with curriculum-based measures</li>
                    <li class="checklist-item">Adjust intervention based on data</li>
                    <li class="checklist-item">Collaborate with specialists and families</li>
                </ul>
            </div>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
                <button class="btn btn-primary" onclick="navigateToStep('progressMonitor')">Complete 8 Weeks</button>
            </div>
        `
    },
    
    tier3_progressMonitor: {
        title: 'Progress Monitoring Results',
        description: 'Evaluate student progress after 8 weeks',
        content: `
            <p class="mb-3">After 8 weeks of intensive Tier 3 intervention, assess student progress:</p>
            <div class="info-box mb-3">
                <p><strong>Effective:</strong> Student is making adequate progress toward goals</p>
                <p><strong>Ineffective:</strong> Student continues to struggle despite intensive intervention</p>
            </div>
            <div class="binary-choice">
                <button class="selection-option" data-value="effective" onclick="selectTier3Effectiveness('effective')">Effective</button>
                <button class="selection-option" data-value="ineffective" onclick="selectTier3Effectiveness('ineffective')">Ineffective</button>
            </div>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
            </div>
        `
    },
    
    tier3_fadeToTier2: {
        title: 'Fade to Tier 2 Supports',
        description: 'Student is making adequate progress',
        content: `
            <div class="success-box">
                <h3>✓ Significant Progress!</h3>
                <p>The student has responded well to Tier 3 interventions and is ready to transition to less intensive Tier 2 supports.</p>
            </div>
            <div class="info-box mt-3">
                <h3>Next Steps</h3>
                <p>• Gradually transition to Tier 2 small group instruction</p>
                <p>• Continue progress monitoring every 2 weeks</p>
                <p>• Be prepared to reinstate Tier 3 if needed</p>
                <p>• Celebrate progress with student and family</p>
            </div>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
                <button class="btn btn-primary" onclick="resetWizard()">Complete</button>
            </div>
        `
    },
    
    tier3_meetClinicians: {
        title: 'Meet with Clinicians',
        description: 'Comprehensive evaluation recommended',
        content: `
            <div class="warning-box">
                <h3>Comprehensive Evaluation Needed</h3>
                <p>The student has not made adequate progress despite intensive Tier 3 interventions. A comprehensive evaluation by clinicians is recommended.</p>
            </div>
            <div class="info-box mt-3">
                <h3>Next Steps</h3>
                <p>• Convene a team meeting (parents, teachers, specialists)</p>
                <p>• Consider referral for comprehensive evaluation</p>
                <p>• Review all intervention data and student work samples</p>
                <p>• Determine if additional assessments are needed</p>
                <p>• Explore additional support services and resources</p>
                <p>• Continue Tier 3 interventions while evaluation is in progress</p>
            </div>
            <div class="info-box mt-3">
                <h3>Important</h3>
                <p>This level of need may indicate a learning disability or other condition that requires specialized services. Collaboration with special education, school psychologists, and other specialists is essential.</p>
            </div>
        `,
        actions: `
            <div class="wizard-actions">
                <button class="btn btn-back" onclick="goBack()">Back</button>
                <button class="btn btn-primary" onclick="resetWizard()">Complete</button>
            </div>
        `
    }
};

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Literacy Interventions Guide - Initializing...');
    setupNavigation();
    setupMobileMenu();
    loadTier('tier1');
    console.log('✅ Ready!');
});

// ==========================================
// Navigation
// ==========================================
function setupNavigation() {
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const tier = e.currentTarget.dataset.tier;
            switchToTier(tier);
        });
    });
}

function switchToTier(tierId) {
    appState.currentTier = tierId;
    appState.currentStep = 'start';
    appState.history = [];
    appState.selections = {};
    
    // Update sidebar active state
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.tier === tierId);
    });
    
    loadTier(tierId);
}

function loadTier(tierId) {
    renderStep(`${tierId}_start`);
}

// ==========================================
// Step Navigation
// ==========================================
function navigateToStep(stepName) {
    appState.history.push(appState.currentStep);
    appState.currentStep = stepName;
    renderStep(`${appState.currentTier}_${stepName}`);
}

function goBack() {
    if (appState.history.length > 0) {
        appState.currentStep = appState.history.pop();
        renderStep(`${appState.currentTier}_${appState.currentStep}`);
    }
}

function resetWizard() {
    switchToTier('tier1');
}

// ==========================================
// Step Rendering
// ==========================================
function renderStep(stepKey) {
    const step = STEP_CONTENT[stepKey];
    if (!step) {
        console.error(`Step not found: ${stepKey}`);
        return;
    }
    
    const container = document.getElementById('wizardContainer');
    
    container.innerHTML = `
        <div class="wizard-container">
            <div class="wizard-header">
                <h2>${step.title}</h2>
                <p>${step.description}</p>
            </div>
            <div class="wizard-step active">
                ${step.content}
                ${step.actions}
            </div>
        </div>
    `;
    
    // Update any dynamic content
    updateDynamicContent();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateDynamicContent() {
    // Update selected drill down area for Tier 2
    const drillDownEl = document.getElementById('selectedDrillDown');
    if (drillDownEl && appState.selections.drillDown) {
        drillDownEl.textContent = appState.selections.drillDown;
    }
    
    // Update selected drill down area for Tier 3
    const tier3DrillDownEl = document.getElementById('selectedTier3DrillDown');
    if (tier3DrillDownEl && appState.selections.tier3DrillDown) {
        tier3DrillDownEl.textContent = appState.selections.tier3DrillDown;
    }
}

// ==========================================
// Selection Handlers
// ==========================================
function selectScreener(screener) {
    appState.selections.screener = screener;
    
    // Update UI to show selection
    document.querySelectorAll('.selection-option').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.value === screener);
    });
    
    // Auto-advance after short delay
    setTimeout(() => {
        navigateToStep('effectiveness');
    }, 500);
}

function selectEffectiveness(effectiveness) {
    appState.selections.effectiveness = effectiveness;
    
    // Update UI
    document.querySelectorAll('.selection-option').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.value === effectiveness);
    });
    
    // Navigate based on selection
    setTimeout(() => {
        if (effectiveness === 'effective') {
            navigateToStep('continueMonitor');
        } else {
            navigateToStep('studentRate');
        }
    }, 500);
}

function selectStudentRate(rate) {
    appState.selections.studentRate = rate;
    
    // Update UI
    document.querySelectorAll('.selection-option').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.value === rate);
    });
    
    // Navigate based on selection
    setTimeout(() => {
        if (rate === '20plus') {
            navigateToStep('reteach');
        } else {
            navigateToStep('moveToTier2');
        }
    }, 500);
}

function selectDrillDown(area) {
    appState.selections.drillDown = area.charAt(0).toUpperCase() + area.slice(1);
    
    // Update UI
    document.querySelectorAll('.selection-option').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.value === area);
    });
    
    // Auto-advance
    setTimeout(() => {
        navigateToStep('interventions');
    }, 500);
}

function selectTier2Effectiveness(effectiveness) {
    appState.selections.tier2Effectiveness = effectiveness;
    
    // Update UI
    document.querySelectorAll('.selection-option').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.value === effectiveness);
    });
    
    // Navigate based on selection
    setTimeout(() => {
        if (effectiveness === 'effective') {
            navigateToStep('fadeToTier1');
        } else {
            navigateToStep('moveToTier3');
        }
    }, 500);
}

function selectTier3DrillDown(area) {
    appState.selections.tier3DrillDown = area.charAt(0).toUpperCase() + area.slice(1).replace(/([A-Z])/g, ' $1').trim();
    
    // Update UI
    document.querySelectorAll('.selection-option').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.value === area);
    });
    
    // Auto-advance
    setTimeout(() => {
        navigateToStep('interventions');
    }, 500);
}

function selectTier3Effectiveness(effectiveness) {
    appState.selections.tier3Effectiveness = effectiveness;
    
    // Update UI
    document.querySelectorAll('.selection-option').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.value === effectiveness);
    });
    
    // Navigate based on selection
    setTimeout(() => {
        if (effectiveness === 'effective') {
            navigateToStep('fadeToTier2');
        } else {
            navigateToStep('meetClinicians');
        }
    }, 500);
}

// ==========================================
// Mobile Menu
// ==========================================
function setupMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const overlay = document.getElementById('sidebarOverlay');
    const sidebar = document.getElementById('sidebar');
    
    if (window.innerWidth <= 768) {
        toggle.style.display = 'flex';
    }
    
    toggle?.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    });
    
    overlay?.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    });
    
    // Close sidebar when nav item clicked on mobile
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                overlay.classList.remove('show');
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            toggle.style.display = 'flex';
        } else {
            toggle.style.display = 'none';
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        }
    });
}
