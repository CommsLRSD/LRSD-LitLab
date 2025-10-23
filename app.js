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
        placeholder: 'Assessment selection will be based on
