// Application State
const appState = {
    interventionsData: null,
    currentTier: null,
    flowchartNodes: [],
    selectedPath: [],
    currentDecision: null
};

// Flowchart Decision Tree
const FLOWCHART_TREE = {
    root: {
        id: 'start',
        type: 'start',
        title: 'Begin Assessment',
        description: 'Start your literacy intervention journey',
        next: 'tier-selection'
    },
    'tier-selection': {
        id: 'tier-selection',
        type: 'decision',
        title: 'Select Starting Point',
        description: 'Where would you like to begin?',
        options: [
            {
                id: 'tier1',
                label: 'Tier 1 - Universal Instruction',
                subtitle: 'For all students',
                next: 'tier1-screener'
            },
            {
                id: 'tier2',
                label: 'Tier 2 - Targeted Support',
                subtitle: 'For at-risk students',
                next: 'tier2-assessment'
            },
            {
                id: 'tier3',
                label: 'Tier 3 - Intensive Intervention',
                subtitle: 'For high-need students',
                next: 'tier3-assessment'
            }
        ]
    },
    'tier1-screener': {
        id: 'tier1-screener',
        type: 'decision',
        title: 'Select Screener',
        description: 'Which assessment tool are you using?',
        options: [
            { id: 'dibels', label: 'DIBELS', next: 'tier1-effectiveness' },
            { id: 'fastbridge', label: 'FastBridge', next: 'tier1-effectiveness' },
            { id: 'aimsweb', label: 'AIMSweb', next: 'tier1-effectiveness' },
            { id: 'other', label: 'Other Assessment', next: 'tier1-effectiveness' }
        ]
    },
    'tier1-effectiveness': {
        id: 'tier1-effectiveness',
        type: 'decision',
        title: 'Instruction Effectiveness',
        description: 'Is current instruction meeting student needs?',
        options: [
            {
                id: 'effective',
                label: 'Yes - Students meeting benchmarks',
                next: 'maintain-tier1'
            },
            {
                id: 'ineffective',
                label: 'No - Students below benchmarks',
                next: 'tier1-percentage'
            }
        ]
    },
    'tier1-percentage': {
        id: 'tier1-percentage',
        type: 'decision',
        title: 'Student Success Rate',
        description: 'What percentage of students are unsuccessful?',
        options: [
            {
                id: 'less-20',
                label: 'Less than 20%',
                next: 'reteach-strategies'
            },
            {
                id: 'more-20',
                label: 'More than 20%',
                next: 'move-tier2'
            }
        ]
    },
    'maintain-tier1': {
        id: 'maintain-tier1',
        type: 'endpoint',
        title: 'Continue Current Instruction',
        description: 'Maintain high-quality core instruction',
        recommendations: [
            'Continue current instructional practices',
            'Monitor progress quarterly',
            'Differentiate within core instruction',
            'Celebrate student success'
        ]
    },
    'reteach-strategies': {
        id: 'reteach-strategies',
        type: 'endpoint',
        title: 'Reteach with Different Strategies',
        description: 'Adjust instruction for small group',
        recommendations: [
            'Identify specific skill gaps',
            'Use alternative teaching methods',
            'Provide additional practice opportunities',
            'Monitor progress bi-weekly',
            'Consider flexible grouping'
        ]
    },
    'move-tier2': {
        id: 'move-tier2',
        type: 'transition',
        title: 'Transition to Tier 2',
        description: 'Students need targeted intervention',
        next: 'tier2-assessment'
    },
    'tier2-assessment': {
        id: 'tier2-assessment',
        type: 'decision',
        title: 'Diagnostic Assessment',
        description: 'Select area of focus',
        options: [
            { id: 'phonemic', label: 'Phonemic Awareness', next: 'tier2-intervention' },
            { id: 'phonics', label: 'Phonics & Decoding', next: 'tier2-intervention' },
            { id: 'fluency', label: 'Reading Fluency', next: 'tier2-intervention' },
            { id: 'comprehension', label: 'Comprehension', next: 'tier2-intervention' },
            { id: 'vocabulary', label: 'Vocabulary', next: 'tier2-intervention' }
        ]
    },
    'tier2-intervention': {
        id: 'tier2-intervention',
        type: 'decision',
        title: '8-Week Intervention Cycle',
        description: 'Implement small group intervention',
        options: [
            {
                id: 'progress-made',
                label: 'Progress Made - Meeting goals',
                next: 'fade-tier1'
            },
            {
                id: 'some-progress',
                label: 'Some Progress - Continue intervention',
                next: 'continue-tier2'
            },
            {
                id: 'no-progress',
                label: 'Minimal Progress - Intensify support',
                next: 'move-tier3'
            }
        ]
    },
    'fade-tier1': {
        id: 'fade-tier1',
        type: 'endpoint',
        title: 'Fade to Tier 1',
        description: 'Gradually reduce intervention',
        recommendations: [
            'Reduce intervention frequency',
            'Monitor for maintenance',
            'Ensure strong core instruction',
            'Plan for booster sessions if needed'
        ]
    },
    'continue-tier2': {
        id: 'continue-tier2',
        type: 'endpoint',
        title: 'Continue Tier 2',
        description: 'Maintain current intervention',
        recommendations: [
            'Continue current intervention',
            'Adjust group composition if needed',
            'Review intervention fidelity',
            'Monitor progress bi-weekly'
        ]
    },
    'move-tier3': {
        id: 'move-tier3',
        type: 'transition',
        title: 'Transition to Tier 3',
        description: 'Student needs intensive intervention',
        next: 'tier3-assessment'
    },
    'tier3-assessment': {
        id: 'tier3-assessment',
        type: 'decision',
        title: 'Comprehensive Assessment',
        description: 'Identify specific learning needs',
        options: [
            { id: 'dyslexia', label: 'Dyslexia Indicators', next: 'tier3-intervention' },
            { id: 'language', label: 'Language Processing', next: 'tier3-intervention' },
            { id: 'executive', label: 'Executive Function', next: 'tier3-intervention' },
            { id: 'multiple', label: 'Multiple Areas', next: 'tier3-intervention' }
        ]
    },
    'tier3-intervention': {
        id: 'tier3-intervention',
        type: 'decision',
        title: 'Intensive 1:1 Intervention',
        description: 'Daily intensive support',
        options: [
            {
                id: 'significant-progress',
                label: 'Significant Progress',
                next: 'fade-tier2'
            },
            {
                id: 'steady-progress',
                label: 'Steady Progress - Continue',
                next: 'continue-tier3'
            },
            {
                id: 'minimal-progress',
                label: 'Minimal Progress',
                next: 'special-education'
            }
        ]
    },
    'fade-tier2': {
        id: 'fade-tier2',
        type: 'endpoint',
        title: 'Fade to Tier 2',
        description: 'Reduce intervention intensity',
        recommendations: [
            'Transition to small group',
            'Maintain progress monitoring',
            'Plan transition carefully',
            'Communicate with all stakeholders'
        ]
    },
    'continue-tier3': {
        id: 'continue-tier3',
        type: 'endpoint',
        title: 'Continue Tier 3',
        description: 'Maintain intensive support',
        recommendations: [
            'Continue 1:1 intervention',
            'Weekly progress monitoring',
            'Regular team meetings',
            'Consider additional assessments'
        ]
    },
    'special-education': {
        id: 'special-education',
        type: 'endpoint',
        title: 'Special Education Referral',
        description: 'Consider comprehensive evaluation',
        recommendations: [
            'Document all interventions tried',
            'Gather progress monitoring data',
            'Schedule team meeting',
            'Consider special education evaluation',
            'Involve parents in decision'
        ]
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeMobileMenu();
    loadInterventionsData();
    
    // Start flowchart if on interventions page
    const interventionsSection = document.getElementById('interventions-section');
    if (interventionsSection && interventionsSection.classList.contains('active')) {
        initializeFlowchart();
    }
});

// Navigation functions
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const sections = document.querySelectorAll('.content-section');
    
    function switchSection(targetPage) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(targetPage + '-section');
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Initialize flowchart if switching to interventions
            if (targetPage === 'interventions') {
                setTimeout(() => initializeFlowchart(), 100);
            }
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === targetPage) {
                link.classList.add('active');
            }
        });
        
        // Update mobile nav
        mobileNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === targetPage) {
                item.classList.add('active');
            }
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            switchSection(targetPage);
        });
    });
    
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            switchSection(targetPage);
            closeMobileMenu();
        });
    });
}

// Mobile menu functions
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

// Load interventions data
async function loadInterventionsData() {
    try {
        const response = await fetch('./data/interventions.json');
        if (response.ok) {
            appState.interventionsData = await response.json();
        }
    } catch (error) {
        console.error('Error loading interventions data:', error);
    }
}

// Flowchart functions
function initializeFlowchart() {
    const container = document.getElementById('flowchart-container');
    if (!container) return;
    
    // Clear existing flowchart
    container.innerHTML = '';
    appState.flowchartNodes = [];
    appState.selectedPath = [];
    
    // Create SVG for connections
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('flowchart-connections');
    container.appendChild(svg);
    
    // Create nodes container
    const nodesContainer = document.createElement('div');
    nodesContainer.classList.add('flowchart-nodes');
    container.appendChild(nodesContainer);
    
    // Add start node
    addFlowchartNode(FLOWCHART_TREE.root, null, 0);
}

function addFlowchartNode(nodeData, parentId, level) {
    const nodesContainer = document.querySelector('.flowchart-nodes');
    if (!nodesContainer) return;
    
    // Check if node already exists
    if (appState.flowchartNodes.find(n => n.id === nodeData.id)) {
        return;
    }
    
    // Create node element
    const node = document.createElement('div');
    node.classList.add('flowchart-node', `node-${nodeData.type}`);
    node.setAttribute('data-node-id', nodeData.id);
    node.setAttribute('data-level', level);
    
    // Position node
    const existingAtLevel = appState.flowchartNodes.filter(n => n.level === level);
    const xOffset = existingAtLevel.length * 320;
    const yOffset = level * 180;
    
    node.style.left = `${xOffset}px`;
    node.style.top = `${yOffset}px`;
    
    // Add node content
    let nodeContent = `
        <div class="node-header">
            <h3>${nodeData.title}</h3>
            <p>${nodeData.description}</p>
        </div>
    `;
    
    if (nodeData.type === 'decision' && nodeData.options) {
        nodeContent += '<div class="node-options">';
        nodeData.options.forEach(option => {
            nodeContent += `
                <button class="node-option" data-option-id="${option.id}" data-next="${option.next || ''}">
                    <span class="option-label">${option.label}</span>
                    ${option.subtitle ? `<span class="option-subtitle">${option.subtitle}</span>` : ''}
                </button>
            `;
        });
        nodeContent += '</div>';
    } else if (nodeData.type === 'endpoint' && nodeData.recommendations) {
        nodeContent += '<div class="node-recommendations">';
        nodeData.recommendations.forEach(rec => {
            nodeContent += `<div class="recommendation-item">• ${rec}</div>`;
        });
        nodeContent += '</div>';
    } else if (nodeData.type === 'transition') {
        nodeContent += `
            <button class="node-continue" data-next="${nodeData.next}">
                Continue to Next Step →
            </button>
        `;
    } else if (nodeData.type === 'start') {
        nodeContent += `
            <button class="node-start" data-next="${nodeData.next}">
                Begin Assessment
            </button>
        `;
    }
    
    node.innerHTML = nodeContent;
    nodesContainer.appendChild(node);
    
    // Animate node appearance
    setTimeout(() => {
        node.classList.add('node-visible');
    }, 50);
    
    // Store node data
    appState.flowchartNodes.push({
        id: nodeData.id,
        element: node,
        level: level,
        parentId: parentId,
        data: nodeData
    });
    
    // Draw connection from parent
    if (parentId) {
        setTimeout(() => {
            drawConnection(parentId, nodeData.id);
        }, 100);
    }
    
    // Attach event listeners
    attachNodeListeners(node, nodeData);
    
    // Adjust container height
    adjustContainerHeight();
}

function attachNodeListeners(node, nodeData) {
    // Handle option clicks
    const options = node.querySelectorAll('.node-option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            const optionId = this.getAttribute('data-option-id');
            const nextId = this.getAttribute('data-next');
            
            // Mark as selected
            options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            // Add to path
            appState.selectedPath.push({
                nodeId: nodeData.id,
                optionId: optionId
            });
            
            // Remove any nodes after this level
            removeNodesAfterLevel(nodeData.level);
            
            // Add next node
            if (nextId && FLOWCHART_TREE[nextId]) {
                setTimeout(() => {
                    addFlowchartNode(FLOWCHART_TREE[nextId], nodeData.id, nodeData.level + 1);
                }, 300);
            }
        });
    });
    
    // Handle continue/start buttons
    const continueBtn = node.querySelector('.node-continue, .node-start');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            const nextId = this.getAttribute('data-next');
            
            this.classList.add('clicked');
            
            if (nextId && FLOWCHART_TREE[nextId]) {
                setTimeout(() => {
                    addFlowchartNode(FLOWCHART_TREE[nextId], nodeData.id, nodeData.level + 1);
                }, 300);
            }
        });
    }
    
    // Handle reset button (for endpoints)
    if (nodeData.type === 'endpoint') {
        const resetBtn = document.createElement('button');
        resetBtn.className = 'node-reset';
        resetBtn.textContent = 'Start New Assessment';
        resetBtn.addEventListener('click', resetFlowchart);
        node.appendChild(resetBtn);
    }
}

function drawConnection(fromId, toId) {
    const svg = document.querySelector('.flowchart-connections');
    const fromNode = appState.flowchartNodes.find(n => n.id === fromId);
    const toNode = appState.flowchartNodes.find(n => n.id === toId);
    
    if (!svg || !fromNode || !toNode) return;
    
    const fromElement = fromNode.element;
    const toElement = toNode.element;
    
    // Calculate positions
    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();
    const containerRect = svg.parentElement.getBoundingClientRect();
    
    const fromX = fromRect.left - containerRect.left + fromRect.width / 2;
    const fromY = fromRect.top - containerRect.top + fromRect.height;
    const toX = toRect.left - containerRect.left + toRect.width / 2;
    const toY = toRect.top - containerRect.top;
    
    // Create path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const midY = fromY + (toY - fromY) / 2;
    
    const d = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;
    path.setAttribute('d', d);
    path.classList.add('flowchart-connection');
    
    // Animate path
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    
    svg.appendChild(path);
    
    setTimeout(() => {
        path.style.strokeDashoffset = '0';
    }, 50);
}

function removeNodesAfterLevel(level) {
    const nodesToRemove = appState.flowchartNodes.filter(n => n.level > level);
    const svg = document.querySelector('.flowchart-connections');
    
    nodesToRemove.forEach(node => {
        // Remove element with fade animation
        node.element.classList.remove('node-visible');
        setTimeout(() => {
            node.element.remove();
        }, 300);
    });
    
    // Remove from state
    appState.flowchartNodes = appState.flowchartNodes.filter(n => n.level <= level);
    
    // Clear connections and redraw
    if (svg) {
        svg.innerHTML = '';
        appState.flowchartNodes.forEach(node => {
            if (node.parentId) {
                drawConnection(node.parentId, node.id);
            }
        });
    }
}

function resetFlowchart() {
    const container = document.getElementById('flowchart-container');
    if (!container) return;
    
    // Fade out all nodes
    const nodes = container.querySelectorAll('.flowchart-node');
    nodes.forEach(node => {
        node.classList.remove('node-visible');
    });
    
    // Reset after animation
    setTimeout(() => {
        initializeFlowchart();
    }, 300);
}

function adjustContainerHeight() {
    const container = document.getElementById('flowchart-container');
    if (!container) return;
    
    const maxY = Math.max(...appState.flowchartNodes.map(n => {
        const rect = n.element.getBoundingClientRect();
        return parseInt(n.element.style.top) + rect.height;
    }), 0);
    
    container.style.minHeight = `${maxY + 100}px`;
}

// Export functionality
function exportFlowchart() {
    const data = {
        timestamp: new Date().toISOString(),
        path: appState.selectedPath,
        nodes: appState.flowchartNodes.map(n => ({
            id: n.id,
            title: n.data.title,
            type: n.data.type
        }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `literacy-assessment-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}
