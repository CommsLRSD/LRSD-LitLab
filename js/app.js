// Application State
const appState = {
    interventionsData: null,
    currentFilters: {
        tier: '',
        screener: '',
        testArea: '',
        pillar: ''
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadInterventionsData();
    initializeNavigation();
    initializeFilters();
    populateTierFilter();
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
                loadPage(page);
            }
        });
    });
}

// Show interventions section
function showInterventionsSection() {
    document.getElementById('interventions-section').style.display = 'block';
    document.getElementById('dynamic-content').style.display = 'none';
}

// Load page content
async function loadPage(pageName) {
    const dynamicContent = document.getElementById('dynamic-content');
    const interventionsSection = document.getElementById('interventions-section');
    
    interventionsSection.style.display = 'none';
    dynamicContent.style.display = 'block';
    
    try {
        const response = await fetch(`pages/${pageName}.html`);
        if (!response.ok) {
            throw new Error(`Failed to load page: ${pageName}`);
        }
        const content = await response.text();
        dynamicContent.innerHTML = content;
    } catch (error) {
        console.error('Error loading page:', error);
        dynamicContent.innerHTML = `
            <div class="error-message">
                <h3>Error Loading Page</h3>
                <p>Sorry, we couldn't load the requested page. Please try again.</p>
            </div>
        `;
    }
}

// Initialize filter dropdowns
function initializeFilters() {
    const tierFilter = document.getElementById('tier-filter');
    const screenerFilter = document.getElementById('screener-filter');
    const testAreaFilter = document.getElementById('testarea-filter');
    const pillarFilter = document.getElementById('pillar-filter');
    const resetButton = document.getElementById('reset-filters');
    
    tierFilter.addEventListener('change', () => {
        appState.currentFilters.tier = tierFilter.value;
        populateScreenerFilter();
        resetSubsequentFilters('screener');
        updateResults();
    });
    
    screenerFilter.addEventListener('change', () => {
        appState.currentFilters.screener = screenerFilter.value;
        populateTestAreaFilter();
        resetSubsequentFilters('testArea');
        updateResults();
    });
    
    testAreaFilter.addEventListener('change', () => {
        appState.currentFilters.testArea = testAreaFilter.value;
        populatePillarFilter();
        resetSubsequentFilters('pillar');
        updateResults();
    });
    
    pillarFilter.addEventListener('change', () => {
        appState.currentFilters.pillar = pillarFilter.value;
        updateResults();
    });
    
    resetButton.addEventListener('click', resetFilters);
}

// Populate Tier filter
function populateTierFilter() {
    const tierFilter = document.getElementById('tier-filter');
    if (!appState.interventionsData) return;
    
    const tiers = appState.interventionsData.tiers;
    tierFilter.innerHTML = '<option value="">Select Tier</option>';
    
    tiers.forEach(tier => {
        const option = document.createElement('option');
        option.value = tier.id;
        option.textContent = tier.name;
        tierFilter.appendChild(option);
    });
}

// Populate Screener filter
function populateScreenerFilter() {
    const screenerFilter = document.getElementById('screener-filter');
    screenerFilter.innerHTML = '<option value="">Select Screener</option>';
    screenerFilter.disabled = true;
    
    if (!appState.currentFilters.tier) return;
    
    const tier = appState.interventionsData.tiers.find(t => t.id === appState.currentFilters.tier);
    if (tier && tier.screeners) {
        tier.screeners.forEach(screener => {
            const option = document.createElement('option');
            option.value = screener.id;
            option.textContent = screener.name;
            screenerFilter.appendChild(option);
        });
        screenerFilter.disabled = false;
    }
}

// Populate Test Area filter
function populateTestAreaFilter() {
    const testAreaFilter = document.getElementById('testarea-filter');
    testAreaFilter.innerHTML = '<option value="">Select Test Area</option>';
    testAreaFilter.disabled = true;
    
    if (!appState.currentFilters.tier || !appState.currentFilters.screener) return;
    
    const tier = appState.interventionsData.tiers.find(t => t.id === appState.currentFilters.tier);
    const screener = tier.screeners.find(s => s.id === appState.currentFilters.screener);
    
    if (screener && screener.testAreas) {
        screener.testAreas.forEach(testArea => {
            const option = document.createElement('option');
            option.value = testArea.id;
            option.textContent = testArea.name;
            testAreaFilter.appendChild(option);
        });
        testAreaFilter.disabled = false;
    }
}

// Populate Pillar filter
function populatePillarFilter() {
    const pillarFilter = document.getElementById('pillar-filter');
    pillarFilter.innerHTML = '<option value="">Select Pillar</option>';
    pillarFilter.disabled = true;
    
    if (!appState.currentFilters.tier || !appState.currentFilters.screener || !appState.currentFilters.testArea) return;
    
    const tier = appState.interventionsData.tiers.find(t => t.id === appState.currentFilters.tier);
    const screener = tier.screeners.find(s => s.id === appState.currentFilters.screener);
    const testArea = screener.testAreas.find(ta => ta.id === appState.currentFilters.testArea);
    
    if (testArea && testArea.pillars) {
        testArea.pillars.forEach(pillar => {
            const option = document.createElement('option');
            option.value = pillar.id;
            option.textContent = pillar.name;
            pillarFilter.appendChild(option);
        });
        pillarFilter.disabled = false;
    }
}

// Reset subsequent filters
function resetSubsequentFilters(fromFilter) {
    const filterHierarchy = ['tier', 'screener', 'testArea', 'pillar'];
    const startIndex = filterHierarchy.indexOf(fromFilter);
    
    for (let i = startIndex; i < filterHierarchy.length; i++) {
        const filterName = filterHierarchy[i];
        appState.currentFilters[filterName] = '';
        
        const filterElement = document.getElementById(`${filterName === 'testArea' ? 'testarea' : filterName}-filter`);
        if (filterElement) {
            filterElement.innerHTML = `<option value="">Select ${filterName.charAt(0).toUpperCase() + filterName.slice(1)}</option>`;
            if (i > startIndex) {
                filterElement.disabled = true;
            }
        }
    }
}

// Reset all filters
function resetFilters() {
    appState.currentFilters = {
        tier: '',
        screener: '',
        testArea: '',
        pillar: ''
    };
    
    document.getElementById('tier-filter').value = '';
    document.getElementById('screener-filter').value = '';
    document.getElementById('screener-filter').disabled = true;
    document.getElementById('testarea-filter').value = '';
    document.getElementById('testarea-filter').disabled = true;
    document.getElementById('pillar-filter').value = '';
    document.getElementById('pillar-filter').disabled = true;
    
    populateScreenerFilter();
    populateTestAreaFilter();
    populatePillarFilter();
    updateResults();
}

// Update results based on filters
function updateResults() {
    const resultsContainer = document.getElementById('interventions-results');
    
    // If no pillar is selected, show info message
    if (!appState.currentFilters.pillar) {
        resultsContainer.innerHTML = '<p class="info-message">Please select all filters to view available interventions.</p>';
        return;
    }
    
    // Get interventions for selected pillar
    const tier = appState.interventionsData.tiers.find(t => t.id === appState.currentFilters.tier);
    const screener = tier.screeners.find(s => s.id === appState.currentFilters.screener);
    const testArea = screener.testAreas.find(ta => ta.id === appState.currentFilters.testArea);
    const pillar = testArea.pillars.find(p => p.id === appState.currentFilters.pillar);
    
    if (!pillar || !pillar.interventions || pillar.interventions.length === 0) {
        resultsContainer.innerHTML = '<p class="info-message">No interventions found for the selected criteria.</p>';
        return;
    }
    
    // Display interventions
    let html = '<div class="interventions-list">';
    pillar.interventions.forEach(intervention => {
        html += `
            <div class="intervention-card">
                <h3>${intervention.name}</h3>
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
    
    resultsContainer.innerHTML = html;
}

// Show error message
function showError(message) {
    const resultsContainer = document.getElementById('interventions-results');
    resultsContainer.innerHTML = `<div class="error-message">${message}</div>`;
}
