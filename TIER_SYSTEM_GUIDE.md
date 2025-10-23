# Tier Intervention System Guide

This document describes the 3-tier literacy intervention system implemented in the Literacy Pal web application.

## Overview

The application implements a step-by-step wizard system that guides educators through the Multi-Tiered System of Supports (MTSS) for literacy interventions. Only one step is visible at a time, with back button functionality available throughout the process.

## Tier 1: Universal Classroom Literacy Interventions

**Target:** 80% of students  
**Delivery:** Whole class, core curriculum

### Flow

1. **Principles Checklist**: Review 5 key principles of explicit and systematic instruction
2. **Select Screener**: Choose from DIBELS, CTOPP-2, THaFoL, or IDAPEL
3. **Evaluate Effectiveness**: Determine if instruction is effective
   - **If Effective**: Return to dashboard with success message
   - **If Ineffective**: Continue to step 4
4. **Student Success Rate**: Assess percentage of unsuccessful students
   - **Less than 20%**: Reteach using different strategies (return to dashboard)
   - **More than 20%**: Move to Tier 2 interventions

## Tier 2: Small Group Interventions

**Target:** 15% of students  
**Delivery:** Small groups (3-6 students), 20-30 minutes daily

### Flow

1. **Requirements Checklist**: Review 5 key elements for Tier 2 interventions
2. **Drill Down Assessments**: Select assessments based on screener and subtest results (placeholder)
3. **Choose Interventions**: Select evidence-based interventions matched to needs (placeholder)
4. **8-Week Cycle**: Implement interventions with fidelity
5. **Progress Monitoring**: Evaluate student progress after 8 weeks
   - **If Effective**: Fade to Tier 1 supports (return to dashboard)
   - **If Ineffective**: Move to Tier 3 interventions

## Tier 3: Personalized Interventions

**Target:** 5% of students  
**Delivery:** 1-on-1 or pairs, 45-60 minutes daily

### Flow

1. **Intensive Interventions Info**: Review characteristics of Tier 3 interventions
2. **Drill Down Assessments**: Comprehensive diagnostic assessments (placeholder)
3. **Choose Interventions**: Select intensive, individualized interventions (placeholder)
4. **8-Week Intensive Cycle**: Implement intensive interventions with high fidelity
5. **Progress Monitoring**: Evaluate student progress after 8 weeks
   - **If Effective**: Fade to Tier 2 supports (return to dashboard)
   - **If Ineffective**: Meet with clinicians (return to dashboard)

## Key Features

### Step-by-Step Navigation
- Only one step is visible at a time
- Smooth transitions between steps using Motion One animations
- Clear visual feedback for user actions

### Back Button
- Available on every step
- Maintains navigation history
- Returns to previous step or dashboard as appropriate

### Branching Logic
- Tier 1: Branches based on effectiveness and percentage of unsuccessful students
- Tier 2: Branches based on progress monitoring results
- Tier 3: Branches based on progress monitoring results

### Placeholders
- Drill-down assessment selection is marked as a placeholder for future content
- Intervention selection is marked as a placeholder for future content
- Both placeholders clearly indicate what content will be added

### User Experience
- No constantly running animations
- Single welcoming animation on initial page load
- Smooth, modern transitions triggered only by user interaction
- Responsive design for mobile and desktop

## Technical Implementation

### Files Modified
- `app.js`: Complete rewrite with wizard-based navigation system
- `index.html`: Updated to use wizard container instead of old step system
- `styles.css`: Removed infinite animations, added wizard styles

### Key Functions
- `startTierWizard(tierId)`: Initializes wizard for selected tier
- `navigateToStep(stepId)`: Moves to specific step with history tracking
- `goBack()`: Navigates to previous step using history
- `renderStep()`: Renders step content based on type (checklist, selection, binary-choice, etc.)

### Data Structures
- `TIER_DEFINITIONS`: Defines steps for each tier
- `STEP_CONTENT`: Contains content for each step
- `appState`: Tracks current tier, step, history, and user selections

## Future Enhancements

1. **Assessment Content**: Add actual drill-down assessment options based on screener types
2. **Intervention Library**: Populate intervention selection with evidence-based strategies
3. **Progress Tracking**: Add ability to save and track student progress over time
4. **Reports**: Generate reports showing intervention history and outcomes
5. **Direct Tier Access**: Allow starting at Tier 2 or Tier 3 without going through Tier 1
