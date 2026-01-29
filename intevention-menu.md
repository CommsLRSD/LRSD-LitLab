# LRSD Literacy Interventions & Assessments Data Structure
## Complete Guide for Menu-Driven Navigation Application

**Document Version:** 3.0  
**Last Updated:** January 29, 2026  
**Audience:** Development Team, Coding AI  
**Key Update:** Screeners & Subtests fully mapped with accurate pillar relationships

---

## TABLE OF CONTENTS

1. [Executive Overview](#executive-overview)
2. [Navigation Flow Architecture](#navigation-flow-architecture)
3. [Screeners & Subtests with Pillar Mapping](#screeners--subtests-with-pillar-mapping)
4. [Interventions Database](#interventions-database)
5. [Assessments Database](#assessments-database)
6. [Literacy Pillars Reference](#literacy-pillars-reference)
7. [Implementation Guide for Developers](#implementation-guide-for-developers)
8. [Data Structure & Schema](#data-structure--schema)
9. [Filter Logic & Query Specifications](#filter-logic--query-specifications)
10. [User Journey Examples](#user-journey-examples)

---

## EXECUTIVE OVERVIEW

### Purpose

This application provides educators in the Louis Riel School Division (LRSD) with a guided, menu-driven interface to quickly identify appropriate literacy assessments and interventions based on:

1. **Screener Selection** - Which literacy screening tool they used (DIBELS, CTOPP-2, THaFoL, IDAPEL)
2. **Subtest Selection** - Which specific subtest was administered
3. **Literacy Pillar** - Which literacy component was measured by that subtest
4. **Item Type** - Whether they need a Drill Down Assessment or Intervention
5. **Filtered Results** - A curated list of relevant assessments or interventions

### Problem It Solves

Teachers previously had to manually cross-reference multiple documents to find:
- What literacy pillar a screener subtest measures
- Which assessments drill down deeper into that pillar
- Which interventions address that specific pillar
- Grade ranges, evidence levels, and URLs for each resource

This app eliminates that friction by automating the filtering process.

### Key Data Points

| Metric | Value |
|--------|-------|
| **Unique Interventions** | 37 |
| **Unique Drill-Down Assessments** | 15 |
| **Total Filterable Items** | 52 |
| **Screeners (English)** | DIBELS (K-6), CTOPP-2 (K-3) |
| **Screeners (French Immersion)** | THaFoL (K-3), IDAPEL (K-3) |
| **Total Screener Subtests** | 15 |
| **Literacy Pillars** | 7 |
| **Programs Supported** | English (36 items), French Immersion (16 items) |
| **Intervention Tiers** | 3 (Tier 1, 2, 3) |
| **Evidence Levels** | 3 (* = Evidence-Based, ** = Research-Based, or No Designation) |

---

## NAVIGATION FLOW ARCHITECTURE

### User Journey (Step-by-Step)

The user must progress through these steps sequentially. Each step depends on the previous selection.

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: SELECT LITERACY SCREENER                             │
│ User chooses which literacy screener they administered        │
│ Options available: DIBELS | CTOPP-2 | THaFoL | IDAPEL        │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: SELECT SUBTEST (Dependent on Screener)              │
│ Menu dynamically shows ONLY subtests belonging to selected   │
│ screener. User cannot see unrelated screener subtests        │
│ Example: Selecting DIBELS shows LNF, PSF, NWF-CLS, etc.     │
│          Selecting IDAPEL shows only Facilité en lecture...  │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: DISPLAY SUBTEST DETAILS & PILLAR SELECTION          │
│ System automatically extracts & shows which literacy         │
│ pillar(s) the selected subtest measures                      │
│ Example: "LNF measures: Alphabetic Principle (K-3)"          │
│ If subtest measures multiple pillars, show all options       │
│ User clicks to select pillar(s) or auto-select if single     │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: CHOOSE ITEM TYPE                                     │
│ User selects: Drill-Down Assessment OR Intervention          │
│ This determines which database query runs next               │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: DISPLAY FILTERED RESULTS                             │
│ Show all items that match:                                   │
│ • Program (English or French Immersion based on screener)    │
│ • Grade range (overlapping with subtest grade range)         │
│ • Literacy pillar(s) (matching selected pillar(s))           │
│ • Item type (Assessment OR Intervention)                     │
│ Include: Name, Grade Range, Evidence Level, Program, URL     │
└─────────────────────────────────────────────────────────────┘
```

### Critical Conceptual Distinction

**SCREENER SUBTESTS ≠ DRILL-DOWN ASSESSMENTS**

- **Screener Subtests** (DIBELS: LNF, CTOPP-2: Blending, THaFoL: FNL)
  - Are **menu navigation categories** in the app
  - Not listed in the Assessments Database
  - Used to filter and route to relevant drill-down assessments
  - Are themselves screening/universal assessment tools

- **Drill-Down Assessments** (CC3 & LeNS, CORE Phonics Survey, Letter Identification Assessment)
  - Are **detailed diagnostic tools** used AFTER screening results indicate a need
  - ARE listed in the Assessments Database
  - Target specific literacy pillars for deeper investigation
  - Help inform more intensive intervention decisions

---

## SCREENERS & SUBTESTS WITH PILLAR MAPPING

### Overview of Screener Structure

The menu has 4 screeners total:
- **2 English Screeners:** DIBELS, CTOPP-2
- **2 French Immersion Screeners:** THaFoL, IDAPEL

When a user selects a screener, only that screener's subtests display in the next menu. Subtests from other screeners are hidden.

---

### ENGLISH SCREENERS

#### DIBELS (Dynamic Indicators of Basic Early Literacy Skills)

**Screener Metadata:**
- **Full Name:** Dynamic Indicators of Basic Early Literacy Skills
- **Language:** English
- **Grade Range:** K-6
- **Publisher:** University of Oregon
- **Type:** Universal Screening Tool (Tier 1)

**Subtests of DIBELS:**

When user selects DIBELS, the following subtests become available for selection:

| Subtest Code | Subtest Name | Grade Range | Literacy Pillars Measured | Notes |
|--------------|-------------|-------------|---------------------------|-------|
| LNF | Letter Naming Fluency | K-3 | Alphabetic Principle | Measures automaticity of letter naming |
| PSF | Phonemic Segmentation Fluency | K-2 | Phonemic Awareness | Measures ability to segment phonemes |
| NWF-CLS | Nonsense Word Fluency: Correct Letter Sounds | K-2 | Alphabetic Principle, Phonemic Awareness, Phonics | Measures letter-sound knowledge in isolation |
| NWF-WRC | Nonsense Word Fluency: Words Read Correctly | 1-3 | Alphabetic Principle, Phonics, Reading Fluency | Measures ability to blend sounds into words |
| WRF | Word Reading Fluency | 1-6 | Alphabetic Principle, Phonics, Reading Fluency | Measures automaticity of real word reading |
| ORF-ACC | Oral Reading Fluency: Accuracy | 1-6 | Phonics, Reading Fluency | Measures accuracy percentage in connected text |
| ORF-WC | Oral Reading Fluency: Words Correct | 1-6 | Phonics, Reading Fluency | Measures total words read correctly per minute |
| Maze | Maze | 2-6 | Reading Fluency, Reading Comprehension | Measures reading comprehension via word choice task |

**How to Use in Menu:**
- User selects DIBELS in Step 1
- Step 2 shows 8 subtests above
- User selects one subtest (e.g., LNF)
- Step 3 automatically displays: "This subtest measures: Alphabetic Principle"
- User auto-advances or confirms
- Step 4: User chooses Assessment or Intervention
- Step 5: System filters to show results matching Alphabetic Principle + selected item type + English program + K-3 grade range

---

#### CTOPP-2 (Comprehensive Test of Phonological Processing, Second Edition)

**Screener Metadata:**
- **Full Name:** Comprehensive Test of Phonological Processing, Second Edition
- **Language:** English
- **Grade Range:** K-3
- **Publisher:** Pro-Ed
- **Type:** Standardized Diagnostic Assessment (Tier 2/3)

**Subtests of CTOPP-2:**

When user selects CTOPP-2, the following subtests become available for selection:

| Subtest Code | Subtest Name | Grade Range | Literacy Pillars Measured | Notes |
|--------------|-------------|-------------|---------------------------|-------|
| Blending | Blending | K-3 | Phonemic Awareness | Oral task: blend individual sounds into words |
| Elision | Elision | K-3 | Phonemic Awareness | Oral task: delete phonemes from words |

**How to Use in Menu:**
- User selects CTOPP-2 in Step 1
- Step 2 shows 2 subtests above
- User selects one subtest (e.g., Blending)
- Step 3 automatically displays: "This subtest measures: Phonemic Awareness"
- Both subtests measure the same pillar, so Step 3 is auto-selected
- Step 4: User chooses Assessment or Intervention
- Step 5: System filters to show results matching Phonemic Awareness + selected item type + English program + K-3 grade range

---

### FRENCH IMMERSION SCREENERS

#### THaFoL (Test d'Habileté de Lecture)

**Screener Metadata:**
- **Full Name:** Test d'Habileté de Lecture (French Reading Ability Test)
- **Language:** French Immersion
- **Grade Range:** K-3
- **Type:** Universal Screening Tool (Tier 1)

**Subtests of THaFoL:**

When user selects THaFoL, the following subtests become available for selection:

| Subtest Code | Subtest Name (French) | Subtest Name (English Translation) | Grade Range | Literacy Pillars Measured | Notes |
|--------------|----------------------|-----------------------------------|-------------|---------------------------|-------|
| FNL | Facilité à nommer des lettres | Letter Naming Fluency | K-3 | Alphabetic Principle | Automaticity of letter naming in French |
| FNM | Facilité à lire des non-mots | Nonsense Word Reading Fluency | K-3 | Phonics | Measures decoding ability with French phonics patterns |
| FLM | Facilité à lire des mots | Word Reading Fluency | K-3 | Phonics, Reading Fluency | Automaticity of real word reading in French |
| FRO | Facilité en lecture orale | Oral Reading Fluency | K-3 | Reading Fluency | Connected text reading fluency in French |

**How to Use in Menu:**
- User selects THaFoL in Step 1
- Step 2 shows 4 subtests above
- User selects one subtest (e.g., FNL)
- Step 3 automatically displays: "This subtest measures: Alphabetic Principle"
- Step 4: User chooses Assessment or Intervention
- Step 5: System filters to show results matching Alphabetic Principle + selected item type + French Immersion program + K-3 grade range

---

#### IDAPEL (Instruments de Dépistage de l'Alphabétisation Précoce en Lecture)

**Screener Metadata:**
- **Full Name:** Instruments de Dépistage de l'Alphabétisation Précoce en Lecture
- **Language:** French Immersion
- **Grade Range:** K-3
- **Type:** Diagnostic Assessment Tool (Tier 2)

**Subtests of IDAPEL:**

When user selects IDAPEL, the following subtest becomes available for selection:

| Subtest Code | Subtest Name (French) | Subtest Name (English Translation) | Grade Range | Literacy Pillars Measured | Notes |
|--------------|----------------------|-----------------------------------|-------------|---------------------------|-------|
| FRO | Facilité en lecture orale | Oral Reading Fluency | K-3 | Reading Fluency | Connected text fluency assessment |

**How to Use in Menu:**
- User selects IDAPEL in Step 1
- Step 2 shows only 1 subtest (FRO)
- User selects FRO (or it auto-selects since only one option)
- Step 3 automatically displays: "This subtest measures: Reading Fluency"
- Step 4: User chooses Assessment or Intervention
- Step 5: System filters to show results matching Reading Fluency + selected item type + French Immersion program + K-3 grade range

---

## INTERVENTIONS DATABASE

### Complete Interventions Listing

Each intervention is listed **ONCE** per unique `NAME + GRADE_RANGE` combination. All tiers and pillars for that unique combination are included in that single entry.

| ID | Intervention Name | Grade Range | Program | Tiers | Literacy Pillars | Evidence Level | URL |
|-----|-------------------|-------------|---------|-------|------------------|----------------|-----|
| INT-001 | Abracadabra | 1-2 | French Immersion | 1, 2 | Alphabetic Principle, Phonemic Awareness, Phonics, Reading Fluency, Reading Comprehension | * | https://literacy.concordia.ca/resources/abra/teacher/fr/index.php |
| INT-002 | Alec | M-5 | French Immersion | 1, 2 | Alphabetic Principle, Phonics | (no designation) | https://alec-edu.com/ |
| INT-003 | Amira Learning | K-8 | English | 2, 3 | Phonics, Reading Fluency | * | https://amiralearning.com/amira-reading |
| INT-004 | Barton Reading and Spelling | 3-12 | English | 2, 3 | Phonemic Awareness, Phonics, Vocabulary, Orthography | ** | https://bartonreading.com/ |
| INT-005 | Handwriting Without Tears | K-2 | English | 1, 2 | Orthography | (no designation) | |
| INT-006 | Heggerty | K-2 | English | 1, 2, 3 | Alphabetic Principle, Phonemic Awareness | ** | https://heggerty.org/ |
| INT-007 | Kilpatrick -- Equipped for Reading Success | K-2 | English | 2, 3 | Phonemic Awareness | ** | |
| INT-008 | Lexia Core 5 | K-5 | French Immersion | 1 | Alphabetic Principle, Phonemic Awareness, Phonics, Reading Fluency, Vocabulary, Reading Comprehension, Orthography | * | https://www.lexialearning.com/core5 |
| INT-009 | Lexia Power Up | 6-12 | English | 2, 3 | Phonics, Reading Fluency, Vocabulary, Reading Comprehension, Orthography | * | https://www.lexialearning.com/powerup |
| INT-010 | Lindamood Bell's Seeing Stars | 2-12 | English | 2, 3 | Orthography | (no designation) | https://lindamoodbell.com/program/seeing-stars-program |
| INT-011 | Lindamood Phoneme Sequencing | K-3 | English | 3 | Phonemic Awareness | ** | https://lindamoodbell.com/program/lindamood-phoneme-sequencing-program |
| INT-012 | Orton-Gillingham | K-12 | English | 1, 2, 3 | Alphabetic Principle, Phonemic Awareness, Reading Fluency, Reading Comprehension, Orthography | ** | https://www.ortonacademy.org/ |
| INT-013 | Page par Page | M-2 | French Immersion | 1, 2, 3 | Alphabetic Principle, Phonics, Reading Fluency, Reading Comprehension | (no designation) | |
| INT-014 | Phonémique -- Version 1 | M-3 | French Immersion | 1, 2, 3 | Phonemic Awareness | (no designation) | |
| INT-015 | Phonémique -- Version 2 | M-3 | French Immersion | 1, 2, 3 | Phonemic Awareness | (no designation) | |
| INT-016 | Programme d'intervention en lecture et en orthographe (PILO) | M-3 | French Immersion | 2, 3 | Alphabetic Principle, Phonics, Orthography | (no designation) | (SharePoint) |
| INT-017 | Remediation Plus Systems | K-3 | English | 1, 2 | Phonemic Awareness, Phonics, Reading Fluency, Reading Comprehension, Orthography | * | http://www.remediationplus.com/products/the-remediation-plus-system/ |
| INT-018 | Remediation Plus Systems | 4-8 | English | 2 | Reading Fluency, Reading Comprehension, Vocabulary | * | http://www.remediationplus.com/products/the-remediation-plus-system/ |
| INT-019 | Ressource CBE | M-2 | French Immersion | 1, 2, 3 | Alphabetic Principle, Phonics | (no designation) | https://lrsdcdn.sharepoint.com/sites/TeachingLearning/curriculum/Literacy/Early%20Literacy/Forms/AllItems.aspx?csf=1&web=1&e=mIBlD4&CID=8ec8404f%2D3d7b%2D471d%2Da489%2D43660cc2ad46&FolderCTID=0x012000F20499129962D74E9046ECDF35332B03&id=%2Fsites%2FTeachingLearning%2Fcurriculum%2FLiteracy%2FEarly%20Literacy%2FLitt%C3%A9ratie%20structur%C3%A9e%2FLa%20phon%C3%A9tique%2FLe%C3%A7ons%20du%20CBE%20pour%20la%20Maternelle%20%C3%A0%20la%206e%20ann%C3%A9e |
| INT-020 | Ressource CBE | M-4 | French Immersion | 2 | Alphabetic Principle | (no designation) | https://lrsdcdn.sharepoint.com/sites/TeachingLearning/curriculum/Literacy/Early%20Literacy/Forms/AllItems.aspx?csf=1&web=1&e=mIBlD4&CID=8ec8404f%2D3d7b%2D471d%2Da489%2D43660cc2ad46&FolderCTID=0x012000F20499129962D74E9046ECDF35332B03&id=%2Fsites%2FTeachingLearning%2Fcurriculum%2FLiteracy%2FEarly%20Literacy%2FLitt%C3%A9ratie%20structur%C3%A9e%2FLa%20phon%C3%A9tique%2FLe%C3%A7ons%20du%20CBE%20pour%20la%20Maternelle%20%C3%A0%20la%206e%20ann%C3%A9e |
| INT-021 | REWARDS | 4-12 | English | 2, 3 | Reading Fluency, Vocabulary, Orthography | ** | https://www.voyagersopris.com/products/reading/rewards/overview |
| INT-022 | Saxon Reading Foundations | K-2 | English | 1, 2, 3 | Phonemic Awareness, Reading Fluency, Orthography | ** | https://www.heinemann.com/saxon-reading-foundations/ |
| INT-023 | Son au graphe | 3-12 | French Immersion | 1, 2, 3 | Alphabetic Principle, Phonics | (no designation) | |
| INT-024 | SRA Corrective Reading | K-3 | English | 2, 3 | Reading Comprehension, Orthography | * | https://pages.nelson.com/assets/pdf/SC%20BRO%20Corrective%20Reading%20NE_NELSON.pdf |
| INT-025 | SRA Corrective Reading | 3-12 | English | 2, 3 | Alphabetic Principle, Phonemic Awareness, Phonics, Reading Fluency, Reading Comprehension | * | https://pages.nelson.com/assets/pdf/SC%20BRO%20Corrective%20Reading%20NE_NELSON.pdf |
| INT-026 | SRA Early Interventions in Reading Skills | K-3 | English | 2 | Phonemic Awareness, Reading Fluency | * | https://www.nelson.com/documents/Assessment/early%20interventions%20in%20reading-brochure.pdf |
| INT-027 | SRA Open Court | K-3 | English | 1, 2 | Phonics, Reading Fluency, Vocabulary, Reading Comprehension | * | https://pages.nelson.com/assets/pdf/open_court.pdf |
| INT-028 | SRA Open Court | 4-6 | English | 2 | Reading Fluency, Vocabulary, Reading Comprehension | * | https://pages.nelson.com/assets/pdf/open_court.pdf |
| INT-029 | SRA Reading Mastery | K-6 | English | 2 | Alphabetic Principle, Phonemic Awareness, Phonics, Reading Fluency, Vocabulary, Reading Comprehension, Orthography | * | https://www.mheducation.com/unitas/school/explore/sites/direct-instruction/reading-mastery-transformations-program-overview-brochure.pdf |
| INT-030 | STARI | 6-9 | English | 2, 3 | Reading Fluency, Reading Comprehension | ** | https://www.serpinstitute.org/stari |
| INT-031 | UFLI Manual | K-2 | English | 1, 2 | Alphabetic Principle, Phonemic Awareness, Phonics, Reading Fluency, Vocabulary, Reading Comprehension, Orthography | ** | https://ufli.education.ufl.edu/foundations-materials/ |
| INT-032 | UFLI Manual | K-8 | English | 2, 3 | Alphabetic Principle, Phonemic Awareness, Phonics, Reading Fluency, Vocabulary, Reading Comprehension, Orthography | ** | https://ufli.education.ufl.edu/foundations-materials/ |
| INT-033 | Wilson Fundations | K-3 | English | 1, 2 | Alphabetic Principle, Phonemic Awareness, Phonics, Reading Fluency, Vocabulary, Reading Comprehension, Orthography | * | https://www.wilsonlanguage.com/programs/fundations/ |
| INT-034 | Wilson Reading System | 2-12 | English | 3 | Alphabetic Principle, Orthography | ** | https://www.wilsonlanguage.com/programs/wilson-reading-system/ |
| INT-035 | Words Their Way | K-12 | English | 1, 2, 3 | Orthography | (no designation) | |
| INT-036 | WordGen Elementary | 4-5 | English | 1 | Vocabulary | ** | https://www.serpinstitute.org/wordgen-elementary |
| INT-037 | WordGen Weekly | 6-8 | English | 1 | Vocabulary | ** | https://www.serpinstitute.org/wordgen-weekly |

### Key Intervention Tagging Principles

**Unique Item Definition:**
- An intervention is UNIQUE based on `NAME + GRADE_RANGE` combination
- Example: "Remediation Plus Systems (K-3)" and "Remediation Plus Systems (4-8)" are TWO separate items in the database
- Example: "UFLI Manual (K-2)" and "UFLI Manual (K-8)" are TWO separate items in the database

**Multiple Tiers in Single Entry:**
- "Wilson Fundations (K-3)" addresses Tiers 1 AND 2 → Listed once with `Tiers: [1, 2]`
- NOT listed separately for Tier 1 and again for Tier 2

**Multiple Pillars in Single Entry:**
- "Wilson Fundations (K-3)" addresses 7 pillars → Listed once with all 7 pillars in the Literacy Pillars column
- NOT listed separately for each pillar

**Tier Definitions:**
- **Tier 1:** Universal/Foundational interventions (all students, preventative)
- **Tier 2:** Supplemental interventions (targeted for students showing risk factors)
- **Tier 3:** Intensive interventions (for students with significant deficits)

---

## ASSESSMENTS DATABASE

### Complete Drill-Down Assessments Listing

These are **diagnostic assessment tools** used for detailed, targeted assessment AFTER screener results indicate a need. They are NOT screener subtests.

Each drill-down assessment is listed **ONCE** per unique `NAME + GRADE_RANGE` combination.

| ID | Assessment Name | Grade Range | Program | Literacy Pillar | Evidence Level | URL |
|-----|-------------------|-------------|---------|-----------------|----------------|-----|
| ASSESS-001 | CC3 & LeNS | K-3 | English | Alphabetic Principle | (no designation) | (SharePoint) |
| ASSESS-002 | CORE Phonics Survey | K-12 | English | Phonics | (no designation) | (SharePoint) |
| ASSESS-003 | French CORE Phonics Assessment | K-12 | French Immersion | Phonics | (no designation) | (SharePoint) |
| ASSESS-004 | Gallistel-Ellis (Reading) | K-2 | English | Alphabetic Principle | (no designation) | (SharePoint) |
| ASSESS-005 | Heggerty -- Letter Name Sounds | 3-8 | English | Alphabetic Principle | ** | (SharePoint) |
| ASSESS-006 | Identification du nom et du son des lettres de l'alphabet | M-2 | French Immersion | Alphabetic Principle | (no designation) | (SharePoint) |
| ASSESS-007 | Letter Identification Assessment | K-2 | English | Alphabetic Principle | (no designation) | (SharePoint) |
| ASSESS-008 | Quick Phonics Screener | K-12 | English | Phonics | (no designation) | (SharePoint) |
| ASSESS-009 | Really Great Reading -- DAER | K | English | Alphabetic Principle | (no designation) | |
| ASSESS-010 | Really Great Reading -- DAEES | 1 | English | Alphabetic Principle | (no designation) | |
| ASSESS-011 | Lindamood Phoneme Sequencing (Assessment) | K-3 | English | Phonemic Awareness | ** | https://lindamoodbell.com/program/lindamood-phoneme-sequencing-program |
| ASSESS-012 | Lindamood Bell's Seeing Stars (Assessment) | 2-12 | English | Orthography | (no designation) | https://lindamoodbell.com/program/seeing-stars-program |
| ASSESS-013 | Barton Reading and Spelling (Assessment) | 3-12 | English | Orthography | ** | https://bartonreading.com/ |
| ASSESS-014 | Kilpatrick -- Phonemic Awareness Battery | K-2 | English | Phonemic Awareness | ** | |
| ASSESS-015 | SRA Reading Inventory | K-6 | English | Reading Fluency | * | (Nelson) |

### Assessment Classification

**Assessment Type:**
- **Diagnostic:** Detailed, targeted assessment tools used for deeper investigation of specific literacy components after screener results indicate a need

**Important Note on Structure:**
- Each assessment in the database measures exactly ONE literacy pillar (single pillar per assessment row)
- This is different from interventions, which can measure multiple pillars
- The relationship is: Screener Subtest → Pillar(s) → Assessments that measure that/those pillar(s)

**What is NOT in this table:**
- **Screener subtests** (DIBELS: LNF, CTOPP-2: Blending, THaFoL: FNL, IDAPEL: FRO)
  - These are menu navigation categories, not drill-down assessments
  - They live in the Screeners & Subtests section as filter triggers

---

## LITERACY PILLARS REFERENCE

These seven literacy pillars form the foundation of evidence-based reading instruction (based on NRP, NICHD, and IES research). Use these exact names throughout the system.

### 1. Alphabetic Principle
**Definition:** Understanding that letters represent sounds and that letter combinations follow patterns and rules.

**Key Concepts:**
- Letter identification and naming
- Letter-sound correspondence (phoneme-grapheme mapping)
- Sound segmentation and blending
- Letter formation and directionality

**Related Screener Subtests:**
- DIBELS: LNF (Letter Naming Fluency)
- DIBELS: NWF-CLS (Nonsense Word Fluency: Correct Letter Sounds)
- DIBELS: NWF-WRC (Nonsense Word Fluency: Words Read Correctly)
- DIBELS: WRF (Word Reading Fluency)
- THaFoL: FNL (Facilité à nommer des lettres)

**Related Drill-Down Assessments:**
- CC3 & LeNS
- Letter Identification Assessment
- Gallistel-Ellis (Reading)
- Heggerty -- Letter Name Sounds
- Really Great Reading -- DAER/DAEES
- Identification du nom et du son des lettres de l'alphabet

**Related Interventions:**
- Heggerty (K-2)
- Wilson Fundations (K-3)
- UFLI Manual (K-2, K-8)
- Orton-Gillingham (K-12)
- SRA Corrective Reading (3-12)
- SRA Reading Mastery (K-6)
- Wilson Reading System (2-12)
- Alec (M-5)
- Abracadabra (1-2)
- Remediation Plus Systems (K-3)

---

### 2. Phonemic Awareness
**Definition:** The ability to hear, identify, and manipulate individual phonemes (sounds) in spoken words, without visual support.

**Key Concepts:**
- Phoneme isolation, identification, categorization
- Phoneme blending and segmentation
- Phoneme deletion, reversal, substitution

**Related Screener Subtests:**
- DIBELS: PSF (Phonemic Segmentation Fluency)
- DIBELS: NWF-CLS (Nonsense Word Fluency: Correct Letter Sounds)
- CTOPP-2: Blending
- CTOPP-2: Elision

**Related Drill-Down Assessments:**
- Lindamood Phoneme Sequencing (Assessment)
- Kilpatrick -- Phonemic Awareness Battery

**Related Interventions:**
- Heggerty (K-2)
- Phonémique Version 1 & 2 (French)
- Lindamood Phoneme Sequencing (K-3)
- Remediation Plus Systems (K-3)
- Kilpatrick -- Equipped for Reading Success (K-2)
- SRA Corrective Reading (3-12)
- SRA Reading Mastery (K-6)
- SRA Early Interventions in Reading Skills (K-3)
- Saxon Reading Foundations (K-2)
- UFLI Manual (K-2, K-8)
- Orton-Gillingham (K-12)
- Abracadabra (1-2)
- Lexia Core 5 (K-5)

---

### 3. Phonics
**Definition:** The relationship between letters and sounds; the ability to use letter-sound correspondences to decode written words (decoding) and to spell words (encoding).

**Key Concepts:**
- Letter-sound rules and patterns
- Consonant sounds and blends, vowel patterns
- Syllable types and division rules
- Irregular words and morphemic elements

**Related Screener Subtests:**
- DIBELS: NWF-CLS (Nonsense Word Fluency: Correct Letter Sounds)
- DIBELS: NWF-WRC (Nonsense Word Fluency: Words Read Correctly)
- DIBELS: WRF (Word Reading Fluency)
- DIBELS: ORF-ACC (Oral Reading Fluency: Accuracy)
- DIBELS: ORF-WC (Oral Reading Fluency: Words Correct)
- THaFoL: FNM (Facilité à lire des non-mots)
- THaFoL: FLM (Facilité à lire des mots)

**Related Drill-Down Assessments:**
- CORE Phonics Survey
- Quick Phonics Screener
- French CORE Phonics Assessment

**Related Interventions:**
- Wilson Fundations (K-3)
- UFLI Manual (K-2, K-8)
- Lexia Core 5 (K-5)
- SRA Open Court (K-3, 4-6)
- Barton Reading and Spelling (3-12)
- SRA Reading Mastery (K-6)
- SRA Corrective Reading (K-3, 3-12)
- Amira Learning (K-8)
- Orton-Gillingham (K-12)
- Remediation Plus Systems (K-3)
- Page par Page (M-2)
- Ressource CBE (M-2, M-4)
- Son au graphe (3-12)
- PILO (M-3)
- Abracadabra (1-2)
- Alec (M-5)

---

### 4. Reading Fluency
**Definition:** Speed, accuracy, and prosody (expression) in oral and silent reading of connected text, reflecting automaticity in word recognition.

**Key Concepts:**
- Automaticity in word recognition
- Speed of reading (words per minute)
- Accuracy in connected text, prosody
- Repeated reading strategies

**Related Screener Subtests:**
- DIBELS: NWF-WRC (Nonsense Word Fluency: Words Read Correctly)
- DIBELS: WRF (Word Reading Fluency)
- DIBELS: ORF-ACC (Oral Reading Fluency: Accuracy)
- DIBELS: ORF-WC (Oral Reading Fluency: Words Correct)
- DIBELS: Maze
- THaFoL: FLM (Facilité à lire des mots)
- THaFoL: FRO (Facilité en lecture orale)
- IDAPEL: FRO (Facilité en lecture orale)

**Related Drill-Down Assessments:**
- SRA Reading Inventory

**Related Interventions:**
- SRA Open Court (K-3, 4-6)
- Remediation Plus Systems (K-3, 4-8)
- Saxon Reading Foundations (K-2)
- Amira Learning (K-8)
- REWARDS (4-12)
- STARI (6-9)
- UFLI Manual (K-2, K-8)
- SRA Reading Mastery (K-6)
- SRA Corrective Reading (K-3, 3-12)
- SRA Early Interventions in Reading Skills (K-3)
- Orton-Gillingham (K-12)
- Page par Page (M-2)
- Abracadabra (1-2)
- Lexia Core 5 (K-5)
- Lexia Power Up (6-12)

---

### 5. Vocabulary
**Definition:** Understanding and using word meanings, both receptive (understanding words heard or read) and expressive (using words in speaking and writing).

**Key Concepts:**
- Receptive and expressive vocabulary
- Semantic relationships (synonyms, antonyms, categories)
- Multiple meanings of words
- Academic vocabulary instruction

**Related Screener Subtests:**
- None (vocabulary is not directly measured by screener subtests in this system)

**Related Drill-Down Assessments:**
- None (vocabulary assessment would require separate tools)

**Related Interventions:**
- WordGen Elementary (4-5)
- WordGen Weekly (6-8)
- UFLI Manual (K-2, K-8)
- Lexia Core 5 (K-5)
- SRA Open Court (K-3, 4-6)
- Lexia Power Up (6-12)
- Remediation Plus Systems (4-8)
- SRA Reading Mastery (K-6)
- REWARDS (4-12)
- Barton Reading and Spelling (3-12)

---

### 6. Reading Comprehension
**Definition:** Understanding and deriving meaning from written text, integrating visual symbols, phonological codes, orthographic patterns, word meanings, grammar, and discourse structure.

**Key Concepts:**
- Literal, inferential, and evaluative comprehension
- Main idea identification
- Text structure understanding
- Summarization and reading strategies

**Related Screener Subtests:**
- DIBELS: Maze

**Related Drill-Down Assessments:**
- None currently listed (comprehension assessment would require separate tools)

**Related Interventions:**
- SRA Open Court (K-3, 4-6)
- Orton-Gillingham (K-12)
- Lexia Core 5 (K-5)
- Abracadabra (1-2)
- SRA Corrective Reading (K-3, 3-12)
- Remediation Plus Systems (K-3, 4-8)
- SRA Reading Mastery (K-6)
- STARI (6-9)
- Lexia Power Up (6-12)
- Page par Page (M-2)

---

### 7. Orthography
**Definition:** Spelling and the structure/patterns of written words, including conventions of written language and the ability to recognize and produce correctly spelled words.

**Key Concepts:**
- Spelling rules and patterns
- Phonetically regular vs. irregular spellings
- Morphophonemic relationships
- Capitalization and punctuation conventions

**Related Screener Subtests:**
- None (orthography is not directly measured by screener subtests in this system)

**Related Drill-Down Assessments:**
- Lindamood Bell's Seeing Stars (Assessment)
- Barton Reading and Spelling (Assessment)
- CORE Phonics Survey (includes orthography component)

**Related Interventions:**
- Words Their Way (K-12)
- Handwriting Without Tears (K-2)
- Lindamood Bell's Seeing Stars (2-12)
- Barton Reading and Spelling (3-12)
- Wilson Fundations (K-3)
- Wilson Reading System (2-12)
- UFLI Manual (K-2, K-8)
- SRA Corrective Reading (K-3, 3-12)
- Saxon Reading Foundations (K-2)
- Remediation Plus Systems (K-3, 4-8)
- SRA Reading Mastery (K-6)
- REWARDS (4-12)
- Lexia Power Up (6-12)
- Lexia Core 5 (K-5)
- PILO (M-3)
- Ressource CBE (M-2, M-4)

---

## IMPLEMENTATION GUIDE FOR DEVELOPERS

### Core Menu Logic (In Plain Language)

**This section explains the menu behavior WITHOUT coding syntax. A specialized AI can translate this into actual code.**

#### The Menu Has These 5 Steps:

**Step 1: Screener Selection**
- Display 4 options: DIBELS, CTOPP-2, THaFoL, IDAPEL
- User picks one screener
- Store this selection (you'll need it to filter Step 2)

**Step 2: Subtest Selection (Dependent on Step 1)**
- Query the database for all subtests belonging to the selected screener
- Display ONLY those subtests in a dropdown or list
- Hide all other screener subtests
- User picks one subtest
- Store this selection

**Step 3: Display Pillar(s) and Let User Select (Dependent on Step 2)**
- Look up the selected subtest in the database
- Find which literacy pillar(s) it measures
- Display the pillar name(s) to the user
- If only 1 pillar: auto-select it, move forward
- If multiple pillars: show them as checkboxes or radio buttons, let user select which one(s) they want to focus on
- Store selected pillar(s)

**Step 4: Choose Item Type (Independent)**
- Show two options: "Drill-Down Assessment" OR "Intervention"
- User picks one
- Store this selection

**Step 5: Query and Display Results (Dependent on All Previous Steps)**
- Based on:
  - Selected screener (determines program: English or French Immersion)
  - Selected subtest (determines grade range)
  - Selected pillar(s)
  - Selected item type (Assessment or Intervention)
- Query the Interventions table OR Assessments table
- Filter to show only items that:
  - Match the program (English or French Immersion)
  - Have a grade range that overlaps with the subtest grade range
  - Address the selected pillar(s)
- Sort results by: Evidence Level first, then Grade Range, then Alphabetically by Name
- Display: Name, Grade Range, Evidence Level, Program (if mixed), URL

#### Program Determination Logic

The screener you select determines which program you're filtering by:

- **DIBELS** → English program
- **CTOPP-2** → English program
- **THaFoL** → French Immersion program
- **IDAPEL** → French Immersion program

So when filtering Interventions and Assessments in Step 5, only show items marked as English or French Immersion as appropriate.

#### Grade Range Overlap Logic

The subtest you select in Step 2 has a grade range (e.g., K-3 for DIBELS LNF).

In Step 5, when filtering Interventions and Assessments, show only items whose grade range overlaps with the subtest grade range.

Examples of overlap:
- Subtest range K-3 overlaps with intervention range K-2 (yes, K-2 is within K-3)
- Subtest range K-3 overlaps with intervention range 1-2 (yes, 1-2 is within K-3)
- Subtest range K-3 overlaps with intervention range 4-6 (no, no overlap)
- Subtest range K-3 overlaps with intervention range K-5 (yes, K-3 is within K-5)

#### Multiple Pillar Handling

Some screener subtests measure multiple pillars. Examples:
- DIBELS NWF-CLS measures: Alphabetic Principle, Phonemic Awareness, Phonics (3 pillars)
- DIBELS WRF measures: Alphabetic Principle, Phonics, Reading Fluency (3 pillars)

When a subtest measures multiple pillars:
- In Step 3, show user all pillars as options
- User can select ONE or MULTIPLE pillars to search
- In Step 5, show results that address ANY of the selected pillars

Example: User selects DIBELS WRF (measures 3 pillars) and then selects both Phonics AND Reading Fluency. In Step 5, show interventions that address Phonics OR Reading Fluency (or both).

#### French vs English Consideration

Make sure French intervention/assessment names display correctly:
- Some interventions have French names: "Abracadabra", "Phonémique -- Version 1", "Programme d'intervention en lecture et en orthographe (PILO)"
- Some assessments have French names: "Identification du nom et du son des lettres de l'alphabet"
- In results, you can show the French name with English translation if helpful

#### No Back-Tracking Between Screeners

Critical UX rule: Once user selects a screener in Step 1, they cannot switch to a different screener's subtests. If they want to search using a different screener, they need to start over (go back to Step 1 and begin fresh).

This prevents confusion like: "User selected DIBELS but is looking at CTOPP-2 subtests."

---

### UI/UX Design Recommendations (Plain Language)

**Screen 1: Screener Selection**
- Title: "Step 1: Select Your Literacy Screener"
- Instructions: "Which screener did you administer to your student?"
- Options: 4 radio buttons or buttons, one for each screener
- Groups optional: Can group as "English Screeners" and "French Immersion Screeners"
- Next button to proceed to Step 2

**Screen 2: Subtest Selection**
- Title: "Step 2: Select the Subtest"
- Instruction: "You selected [Screener Name]. Which subtest did you administer?"
- Display all subtests for the selected screener only
- Format as: dropdown, radio buttons, or list
- Include in display: Subtest code, Full name, Grade range
- Back button to return to Step 1
- Next button to proceed to Step 3

**Screen 3: Pillar Display and Selection**
- Title: "Step 3: Literacy Pillar(s)"
- Show: "Your selected subtest measures the following:"
- Display pillar name(s)
- Optional: Include 1-2 sentence definition of the pillar
- If single pillar: Show it selected (auto-select, proceed to Step 4)
- If multiple pillars: Show as checkboxes, let user select one or more
- Back button to return to Step 2
- Next button to proceed to Step 4

**Screen 4: Item Type Selection**
- Title: "Step 4: What Are You Looking For?"
- Instructions: "Choose whether you need a drill-down assessment or an intervention strategy"
- Two clear options:
  - Option A: "Drill-Down Assessment" with short description: "A detailed diagnostic tool to understand more about this specific skill"
  - Option B: "Intervention" with short description: "A teaching strategy or program to address this skill"
- Format as: radio buttons, toggle, or large clickable cards
- Back button to return to Step 3
- Next/Search button to proceed to Step 5

**Screen 5: Results Display**
- Title: "Results: [Screener] > [Subtest] > [Pillar(s)]"
- Show count: "X results found"
- If 0 results: "No results found for this combination. Try a different screener or pillar."
- Display results as a sortable/filterable table or list
- Columns: Name, Grade Range, Program (if applicable), Evidence Level, Link/URL
- Evidence level visual indicator: * = Evidence-Based, ** = Research-Based, blank = No designation
- Each result is clickable to see more details or open URL
- New Search button to start over from Step 1

---

### Filtering Edge Cases to Handle

**Case 1: Subtest has single pillar**
- Example: CTOPP-2 Blending → Only Phonemic Awareness
- Auto-select the pillar in Step 3, don't make user choose

**Case 2: Subtest has multiple pillars**
- Example: DIBELS NWF-CLS → 3 pillars
- Let user select one or more pillars
- If they select multiple, show results for any of those pillars (OR logic)

**Case 3: No interventions found for a pillar**
- Example: User searches for Vocabulary interventions
- Display: "No drill-down assessments found for this pillar. Try searching for Interventions instead."

**Case 4: User is French immersion, all results show French**
- When user selects THaFoL or IDAPEL, all results will automatically be French Immersion program
- You don't need a separate French/English toggle

**Case 5: Grade range mismatch**
- Example: Subtest is K-2, but intervention starts at 3
- Don't show that intervention (no grade overlap)
- But DO show an intervention if grades overlap at all (even partially)

---

### Technology Stack Recommendations

**Frontend:**
- React, Vue.js, or similar for interactive dropdown/selection UI
- Responsive design for tablet and desktop use
- Accessibility-first (WCAG 2.1 AA compliance)
- Clear focus states and keyboard navigation

**Backend:**
- Node.js/Express, Python/Flask, or similar for API
- Database: PostgreSQL or MongoDB
- API returns JSON results for Step 5 filtering

**Data Storage:**
- Store Screeners & Subtests as one data structure
- Store Interventions as one table/collection
- Store Assessments as one table/collection
- Store Literacy Pillars as reference data
- Use lookups to map subtests to pillars, interventions to pillars, assessments to pillars

**Deployment:**
- LRSD SharePoint integration (embed as web part) OR standalone web app
- Hosted on Netlify, GitHub Pages, or similar
- Offline support consideration: cache data locally so it works without internet

---

## DATA STRUCTURE & SCHEMA

### How to Organize the Data

**The core data is organized into 4 main sections:**

1. **Screeners Table** - Lists all screeners (DIBELS, CTOPP-2, THaFoL, IDAPEL)
2. **Subtests Table** - Lists all subtests, each linked to a screener
3. **Pillar-to-Subtest Mapping** - Shows which pillar(s) each subtest measures (lookup table)
4. **Interventions Table** - Lists all interventions, each linked to one or more pillars
5. **Assessments Table** - Lists all assessments, each linked to one pillar

#### Example Data Structure Pseudocode (Not Real Code, Just Conceptual)

```
SCREENERS:
  - screener_id: "DIBELS"
    name: "DIBELS"
    language: "English"
    grade_range_start: "K"
    grade_range_end: "6"

  - screener_id: "CTOPP-2"
    name: "CTOPP-2"
    language: "English"
    grade_range_start: "K"
    grade_range_end: "3"

  - screener_id: "THaFoL"
    name: "THaFoL"
    language: "French Immersion"
    grade_range_start: "K"
    grade_range_end: "3"

  - screener_id: "IDAPEL"
    name: "IDAPEL"
    language: "French Immersion"
    grade_range_start: "K"
    grade_range_end: "3"

SUBTESTS:
  - subtest_id: 1
    screener_id: "DIBELS"
    subtest_code: "LNF"
    subtest_name: "Letter Naming Fluency"
    grade_range_start: "K"
    grade_range_end: "3"

  - subtest_id: 2
    screener_id: "DIBELS"
    subtest_code: "PSF"
    subtest_name: "Phonemic Segmentation Fluency"
    grade_range_start: "K"
    grade_range_end: "2"

  - subtest_id: 3
    screener_id: "CTOPP-2"
    subtest_code: "Blending"
    subtest_name: "Blending"
    grade_range_start: "K"
    grade_range_end: "3"

  - subtest_id: 4
    screener_id: "THaFoL"
    subtest_code: "FNL"
    subtest_name: "Facilité à nommer des lettres"
    grade_range_start: "K"
    grade_range_end: "3"

  - subtest_id: 5
    screener_id: "IDAPEL"
    subtest_code: "FRO"
    subtest_name: "Facilité en lecture orale"
    grade_range_start: "K"
    grade_range_end: "3"

SUBTEST_PILLARS (Maps which pillar each subtest measures):
  - subtest_id: 1, pillar: "Alphabetic Principle"
  - subtest_id: 2, pillar: "Phonemic Awareness"
  - subtest_id: 3, pillar: "Phonemic Awareness"
  - subtest_id: 4, pillar: "Alphabetic Principle"
  - subtest_id: 5, pillar: "Reading Fluency"

LITERACY_PILLARS:
  - pillar_id: 1, pillar_name: "Alphabetic Principle"
  - pillar_id: 2, pillar_name: "Phonemic Awareness"
  - pillar_id: 3, pillar_name: "Phonics"
  - pillar_id: 4, pillar_name: "Reading Fluency"
  - pillar_id: 5, pillar_name: "Vocabulary"
  - pillar_id: 6, pillar_name: "Reading Comprehension"
  - pillar_id: 7, pillar_name: "Orthography"

INTERVENTIONS:
  - item_id: "INT-001"
    name: "Abracadabra"
    grade_range_start: "1"
    grade_range_end: "2"
    program: "French Immersion"
    evidence_level: "*"
    url: "https://..."
    pillars: ["Alphabetic Principle", "Phonemic Awareness", "Phonics", "Reading Fluency", "Reading Comprehension"]

  - item_id: "INT-006"
    name: "Heggerty"
    grade_range_start: "K"
    grade_range_end: "2"
    program: "English"
    evidence_level: "**"
    url: "https://heggerty.org/"
    pillars: ["Alphabetic Principle", "Phonemic Awareness"]

ASSESSMENTS:
  - item_id: "ASSESS-001"
    name: "CC3 & LeNS"
    grade_range_start: "K"
    grade_range_end: "3"
    program: "English"
    pillar: "Alphabetic Principle"
    evidence_level: "(no designation)"
    url: "(SharePoint)"

  - item_id: "ASSESS-002"
    name: "CORE Phonics Survey"
    grade_range_start: "K"
    grade_range_end: "12"
    program: "English"
    pillar: "Phonics"
    evidence_level: "(no designation)"
    url: "(SharePoint)"
```

#### Relationships Summary (Without SQL)

- **Each Screener** has many **Subtests**
- **Each Subtest** maps to one or more **Literacy Pillars** (via Subtest_Pillars lookup)
- **Each Intervention** addresses one or more **Literacy Pillars**
- **Each Assessment** addresses exactly one **Literacy Pillar**

To find interventions for a subtest:
1. User selects Subtest
2. Look up which Pillar(s) that Subtest measures
3. Find all Interventions that address any of those Pillars
4. Filter by grade range and program
5. Display results

---

## FILTER LOGIC & QUERY SPECIFICATIONS

### Step-by-Step Filter Logic (Plain Language)

**Step 1 → Step 2: Load Subtests**
```
When user selects a screener (Step 1):
1. Look up all subtests where screener_id matches the selected screener
2. Display those subtests and ONLY those subtests
3. Hide all other subtests from other screeners
```

**Step 2 → Step 3: Load Pillars**
```
When user selects a subtest (Step 2):
1. Look up which pillar(s) that subtest measures
2. Display pillar name(s) and definition
3. If single pillar: auto-select it
4. If multiple pillars: show as selectable options
```

**Step 3 → Step 4: Pillar Selection Ready**
```
When user selects pillar(s) (Step 3):
1. Store the selected pillar(s)
2. Proceed to Step 4 to ask about item type
```

**Step 4 → Step 5: Determine Query Type**
```
When user selects item type (Step 4):
1. Store whether they want Assessments or Interventions
2. Prepare to query the appropriate table in Step 5
```

**Step 5: Execute Filter Query**
```
When Step 5 loads:
1. Gather all the selections:
   - Screener (determines program: English or French Immersion)
   - Subtest (determines grade range)
   - Pillar(s) selected
   - Item type (Assessment or Intervention)

2. If searching for ASSESSMENTS:
   - Query Assessments table
   - Filter where:
     * program matches screener language (English or French Immersion)
     * grade_range_start <= subtest_grade_range_end AND grade_range_end >= subtest_grade_range_start
     * pillar is in the selected pillar list
   - Sort by: evidence_level, grade_range, name

3. If searching for INTERVENTIONS:
   - Query Interventions table
   - Filter where:
     * program matches screener language (English or French Immersion)
     * grade_range_start <= subtest_grade_range_end AND grade_range_end >= subtest_grade_range_start
     * ANY of the pillars in the intervention's pillar list match ANY of the selected pillars
   - Sort by: evidence_level, grade_range, name

4. Display results with: Name, Grade Range, Evidence Level, URL
```

### Grade Range Overlap Logic (Examples)

**Given a subtest with grade range K-3, which items overlap?**

| Item Grade Range | Overlaps? | Reason |
|------------------|-----------|--------|
| K-1 | Yes | K-1 is entirely within K-3 |
| K-2 | Yes | K-2 is entirely within K-3 |
| K-3 | Yes | Exact match |
| K-5 | Yes | K-3 falls within K-5 |
| 1-2 | Yes | 1-2 is within K-3 |
| 2-4 | Yes | 2-3 overlap |
| 1-3 | Yes | 1-3 is within K-3 |
| 3-5 | Yes | 3 overlaps |
| 4-6 | No | No overlap |
| K-6 | Yes | K-3 is within K-6 |

**Algorithm for overlap check:**
```
Overlap exists if:
  item_grade_start <= subtest_grade_end AND item_grade_end >= subtest_grade_start
```

---

### Multi-Pillar Handling in Step 5

**Scenario: User selects DIBELS WRF, which measures 3 pillars**

In Step 3, user sees options:
- Alphabetic Principle
- Phonics
- Reading Fluency

User can select 1, 2, or all 3.

**If user selects only Phonics:**
- Query interventions where "Phonics" is in their pillar list
- Results: Only interventions addressing Phonics

**If user selects Phonics AND Reading Fluency:**
- Query interventions where "Phonics" OR "Reading Fluency" is in their pillar list
- Results: Interventions addressing Phonics, Reading Fluency, or both

This gives teachers flexibility to focus on specific aspects of a multi-pillar subtest.

---

## USER JOURNEY EXAMPLES

### Example 1: Teacher Using DIBELS - English

**Scenario:** Ms. Chen administered DIBELS screening. Multiple students scored below benchmark on LNF (Letter Naming Fluency, K-3). She wants to find assessments and interventions.

**User's Path Through the Menu:**

```
Step 1: Screener Selection
→ Ms. Chen clicks: "DIBELS"
   (Stored: screener_id = "DIBELS", program = "English")

Step 2: Subtest Selection
→ Menu shows 8 DIBELS subtests (only DIBELS, not CTOPP-2/THaFoL/IDAPEL)
→ Ms. Chen clicks: "LNF - Letter Naming Fluency (K-3)"
   (Stored: subtest_code = "LNF", grade_range = "K-3")

Step 3: Pillar Display
→ System shows: "This subtest measures: Alphabetic Principle"
→ Definition: "Understanding that letters represent sounds and letter-sound correspondences"
→ Single pillar, auto-selects
   (Stored: pillar = "Alphabetic Principle")

Step 4: Item Type
→ First search: Ms. Chen clicks "Drill-Down Assessment"
   (Stored: item_type = "Assessment")

Step 5: Results - Assessments for Alphabetic Principle (K-3) in English
→ System returns:
   1. CC3 & LeNS (K-3, English, no designation)
   2. Gallistel-Ellis Reading (K-2, English, no designation)
   3. Heggerty Letter Name Sounds (3-8, English, **)
   4. Letter Identification Assessment (K-2, English, no designation)
   5. Really Great Reading DAER (K, English, no designation)
   6. Really Great Reading DAEES (1, English, no designation)
→ Ms. Chen clicks on "Letter Identification Assessment" to learn more

Next Search: Ms. Chen wants interventions
→ Back to Step 4
→ Clicks "Intervention"
   (Stored: item_type = "Intervention")

Step 5: Results - Interventions for Alphabetic Principle (K-3) in English
→ System returns (filtered to K-3 range, Alphabetic Principle pillar):
   1. Heggerty (K-2, English, Tiers 1-3, **)
   2. Wilson Fundations (K-3, English, Tiers 1-2, *)
   3. UFLI Manual (K-2, English, Tiers 1-2, **)
   4. UFLI Manual (K-8, English, Tiers 2-3, **)
   5. Orton-Gillingham (K-12, English, Tiers 1-3, **)
   ... and others
→ Ms. Chen sees evidence-based interventions first (sorted by evidence level)
→ She clicks "Wilson Fundations" to access the URL
```

---

### Example 2: Teacher Using THaFoL - French Immersion

**Scenario:** Mr. Dubois teaches French immersion. He administered THaFoL and students are struggling with letter naming (FNL). He wants assessments to dig deeper.

**User's Path Through the Menu:**

```
Step 1: Screener Selection
→ Mr. Dubois scrolls to French Immersion Screeners
→ Clicks: "THaFoL"
   (Stored: screener_id = "THaFoL", program = "French Immersion")

Step 2: Subtest Selection
→ Menu shows 4 THaFoL subtests (with French names and English translations)
→ Mr. Dubois clicks: "FNL - Facilité à nommer des lettres (K-3)"
   (Stored: subtest_code = "FNL", grade_range = "K-3")

Step 3: Pillar Display
→ System shows: "This subtest measures: Alphabetic Principle"
→ Single pillar, auto-selects
   (Stored: pillar = "Alphabetic Principle")

Step 4: Item Type
→ Mr. Dubois clicks "Drill-Down Assessment"
   (Stored: item_type = "Assessment")

Step 5: Results - Assessments for Alphabetic Principle in French Immersion (K-3)
→ System returns French Immersion assessments only:
   1. Identification du nom et du son des lettres de l'alphabet (M-2, French Immersion, no designation)
→ Mr. Dubois sees only 1 result (fewer assessments available for French Immersion)
→ He clicks on it to access via SharePoint

Next Search: Mr. Dubois wants interventions
→ Back to Step 4
→ Clicks "Intervention"

Step 5: Results - Interventions for Alphabetic Principle in French Immersion (K-3)
→ System returns (filtered to K-3 range, Alphabetic Principle pillar, French Immersion program):
   1. Alec (M-5, French Immersion, Tiers 1-2, no designation)
   2. Abracadabra (1-2, French Immersion, Tiers 1-2, *)
   3. Lexia Core 5 (K-5, French Immersion, Tier 1, *)
   4. Page par Page (M-2, French Immersion, Tiers 1-3, no designation)
   5. Phonémique Version 1 (M-3, French Immersion, Tiers 1-3, no designation)
   6. Ressource CBE (M-2, French Immersion, Tiers 1-3, no designation)
   ... and others
→ Results are sorted by evidence level and grade range
→ Mr. Dubois selects "Lexia Core 5" which covers K-5 and is evidence-based
```

---

### Example 3: Teacher Using CTOPP-2 - Phonemic Awareness Focus

**Scenario:** Ms. Rodriguez administered CTOPP-2 and wants to address phonemic awareness. Both CTOPP-2 subtests (Blending and Elision) measure the same pillar, so she has flexibility.

**User's Path Through the Menu:**

```
Step 1: Screener Selection
→ Ms. Rodriguez clicks: "CTOPP-2"
   (Stored: screener_id = "CTOPP-2", program = "English")

Step 2: Subtest Selection
→ Menu shows 2 CTOPP-2 subtests
→ Ms. Rodriguez clicks: "Blending (K-3)"
   (Stored: subtest_code = "Blending", grade_range = "K-3")

Step 3: Pillar Display
→ System shows: "This subtest measures: Phonemic Awareness"
→ Single pillar, auto-selects
   (Stored: pillar = "Phonemic Awareness")

Step 4: Item Type
→ Ms. Rodriguez clicks "Intervention"

Step 5: Results - Interventions for Phonemic Awareness (K-3) in English
→ System returns:
   1. Heggerty (K-2, Tiers 1-3, **)
   2. Kilpatrick - Equipped for Reading Success (K-2, Tiers 2-3, **)
   3. Lindamood Phoneme Sequencing (K-3, Tier 3, **)
   4. Phonemically Intensive (implied, Tiers vary)
   5. Remediation Plus Systems (K-3, Tiers 1-2, *)
   6. SRA Corrective Reading (K-3, Tiers 2-3, *)
   7. SRA Early Interventions (K-3, Tier 2, *)
   8. SRA Reading Mastery (K-6, Tier 2, *)
   9. Saxon Reading Foundations (K-2, Tiers 1-3, **)
   10. UFLI Manual (K-2, Tiers 1-2, **)
   11. Wilson Fundations (K-3, Tiers 1-2, *)
   12. Orton-Gillingham (K-12, Tiers 1-3, **)
→ Ms. Rodriguez sees research-based options (**) sorted first
→ She selects "Lindamood Phoneme Sequencing" which is intensive (**) but targeted for this pillar
```

---

**End of Documentation**

This version provides clear, plain-language instructions that a coding AI can understand and translate into actual application logic without needing to know specific programming syntax. The focus is on data flow, filtering logic, and user experience rather than implementation details.
