# LRSD Literacy Interventions & Assessments Data Structure
## Complete Guide for Menu-Driven Navigation Application

**Document Version:** 2.0  
**Last Updated:** January 28, 2026  
**Audience:** Development Team, Coding AI  

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
4. **Item Type** - Whether they need an Assessment (drill-down) or Intervention
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
| **Total Screener Subtests** | 18 |
| **Literacy Pillars** | 7 |
| **Programs Supported** | English (36 items), French Immersion (16 items) |
| **Intervention Tiers** | 3 (Tier 1, 2, 3) |
| **Evidence Levels** | 3 (* = Evidence-Based, ** = Research-Based, or No Designation) |

---

## NAVIGATION FLOW ARCHITECTURE

### User Journey (Step-by-Step)

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: SELECT SCREENER                                      │
│ User chooses which literacy screener they administered        │
│ Options: DIBELS | CTOPP-2 | THaFoL | IDAPEL                 │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: SELECT SUBTEST (Dependent on Screener)              │
│ Options dynamically populate based on selected screener      │
│ Example: DIBELS → [LNF, PSF, NWF-CLS, NWF-WRC, WRF, ORF-ACC,│
│                     ORF-WC, Maze]                            │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: DISPLAY SUBTEST DETAILS                              │
│ Show: Grade Range | Literacy Pillar(s) Measured              │
│ Example: "LNF measures Alphabetic Principle (K-3)"           │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: SELECT LITERACY PILLAR(S)                            │
│ If subtest measures multiple pillars, user can choose which  │
│ to focus on. If single pillar, auto-select it.               │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: CHOOSE ITEM TYPE                                     │
│ Toggle or Radio Button: Assessment (Drill Down) OR           │
│ Intervention (Instruction)                                   │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: DISPLAY FILTERED RESULTS                             │
│ Show all drill-down assessments/interventions that match:    │
│ • Screener → Subtest → Pillar(s) → Item Type                │
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

### ENGLISH SCREENERS

#### DIBELS (Dynamic Indicators of Basic Early Literacy Skills)

**Metadata:**
- Grade Range: K-6
- Language: English
- Publisher: University of Oregon
- Type: Universal Screening Tool (Tier 1)

**Subtests Table (Menu Navigation Categories):**

| Subtest Code | Subtest Name | Grade Range | Literacy Pillars | Notes |
|--------------|-------------|-------------|-------------------|-------|
| LNF | Letter Naming Fluency | K-3 | Alphabetic Principle | Measures automaticity of letter naming |
| PSF | Phonemic Segmentation Fluency | K-2 | Phonemic Awareness | Measures ability to segment phonemes |
| NWF-CLS | Nonsense Word Fluency: Correct Letter Sounds | K-2 | Alphabetic Principle, Phonemic Awareness, Phonics | Measures letter-sound knowledge in isolation |
| NWF-WRC | Nonsense Word Fluency: Words Read Correctly | 1-3 | Alphabetic Principle, Phonics, Reading Fluency | Measures ability to blend sounds into words |
| WRF | Word Reading Fluency | 1-6 | Alphabetic Principle, Phonics, Reading Fluency | Measures automaticity of real word reading |
| ORF-ACC | Oral Reading Fluency: Accuracy | 1-6 | Phonics, Reading Fluency | Measures accuracy percentage in connected text |
| ORF-WC | Oral Reading Fluency: Words Correct | 1-6 | Phonics, Reading Fluency | Measures total words read correctly per minute |
| Maze | Maze | 2-6 | Reading Fluency, Reading Comprehension | Measures reading comprehension via word choice task |

**Implementation Notes:**
- DIBELS subtests are the first-level menu navigation
- When user selects "DIBELS: LNF", system extracts "Alphabetic Principle" pillar
- User then chooses Assessment or Intervention
- System filters drill-down assessments and interventions by pillar and grade range
- DIBELS subtests themselves are NOT in the Assessments Database

---

#### CTOPP-2 (Comprehensive Test of Phonological Processing, Second Edition)

**Metadata:**
- Grade Range: K-3
- Language: English
- Publisher: Pro-Ed
- Type: Standardized Diagnostic Assessment (Tier 2/3)

**Subtests Table (Menu Navigation Categories):**

| Subtest Code | Subtest Name | Grade Range | Literacy Pillars | Notes |
|--------------|-------------|-------------|-------------------|-------|
| Blending | Blending | K-3 | Phonemic Awareness | Oral task: blend individual sounds into words |
| Elision | Elision | K-3 | Phonemic Awareness | Oral task: delete phonemes from words |

**Implementation Notes:**
- CTOPP-2 subtests are diagnostic-level menu navigation
- Both subtests measure Phonemic Awareness pillar
- When selected, system filters to Phonemic Awareness assessments and interventions
- CTOPP-2 subtests themselves are NOT in the Assessments Database

---

### FRENCH IMMERSION SCREENERS

#### THaFoL (Test d'Habileté de Lecture) - French

**Metadata:**
- Grade Range: K-3
- Language: French Immersion
- Type: Universal Screening Tool (Tier 1)
- Origin: Quebec-adapted assessment

**Subtests Table (Menu Navigation Categories):**

| Subtest Code | Subtest Name (French) | Subtest Name (English Translation) | Grade Range | Literacy Pillars | Notes |
|--------------|----------------------|-----------------------------------|-------------|-------------------|-------|
| FNL | Facilité à nommer des lettres | Letter Naming Fluency | K-3 | Alphabetic Principle | Automaticity of letter naming in French |
| FNM | Facilité à lire des non-mots | Nonsense Word Reading Fluency | K-3 | Phonics | Measures decoding ability with French phonics patterns |
| FLM | Facilité à lire des mots | Word Reading Fluency | K-3 | Phonics, Reading Fluency | Automaticity of real word reading in French |
| FRO | Facilité en lecture orale | Oral Reading Fluency | K-3 | Reading Fluency | Connected text reading fluency in French |

**Implementation Notes:**
- THaFoL is the primary French immersion screening tool
- Subtests serve as menu navigation categories
- System filters to French Immersion program only when THaFoL selected
- THaFoL subtests themselves are NOT in the Assessments Database

---

#### IDAPEL (Instruments de Dépistage de l'Alphabétisation Précoce en Lecture) - French

**Metadata:**
- Grade Range: K-3
- Language: French Immersion
- Type: Diagnostic Assessment Tool (Tier 2)
- Origin: Quebec-based diagnostic framework

**Subtests Table (Menu Navigation Categories):**

| Subtest Code | Subtest Name (French) | Subtest Name (English Translation) | Grade Range | Literacy Pillars | Notes |
|--------------|----------------------|-----------------------------------|-------------|-------------------|-------|
| FRO | Facilité en lecture orale | Oral Reading Fluency | K-3 | Reading Fluency | Connected text fluency assessment |

**Implementation Notes:**
- IDAPEL is a comprehensive French literacy diagnostic battery
- Currently represented by one key subtest in this app (can be expanded)
- Used for more detailed diagnostic assessment than screening
- IDAPEL subtests themselves are NOT in the Assessments Database

---

## INTERVENTIONS DATABASE

### Complete Interventions Listing

Each intervention is listed **ONCE** per unique `NAME + GRADE_RANGE` combination. All tiers and pillars are included in that single entry.

| ID | Intervention Name | Grade Range | Program | Tiers | Literacy Pillars | Evidence Level | URL |
|-----|-------------------|-------------|---------|-------|------------------|----------------|-----|
| INT-001 | Abracadabra | 1-2 | French Immersion | 1, 2 | Alphabetic Principle, Phonemic Awareness, Phonics, Reading Fluency, Reading Comprehension | * | https://literacy.concordia.ca/resources/abra/teacher/fr/index.php |
| INT-002 | Alec | M-5 | French Immersion | 1, 2 | Alphabetic Principle, Phonics | (no designation) | https://alec-edu.com/ |
| INT-003 | Amira Learning | K-8 | English | 2, 3 | Phonics, Reading Fluency | * | https://amiralearning.com/amira-reading |
| INT-004 | Barton Reading and Spelling | 3-12 | English | 2, 3 | Phonemic Awareness, Phonics, Vocabulary, Orthography | ** | https://bartonreading.com/ |
| INT-005 | Handwriting Without Tears | K-2 | English | 1, 2 | Orthography | (no designation) | (local resource) |
| INT-006 | Heggerty | K-2 | English | 1, 2, 3 | Alphabetic Principle, Phonemic Awareness | ** | https://heggerty.org/ |
| INT-007 | Kilpatrick -- Equipped for Reading Success | K-2 | English | 2, 3 | Phonemic Awareness | ** | (local resource) |
| INT-008 | Lexia Core 5 | K-5 | French Immersion | 1 | Alphabetic Principle, Phonemic Awareness, Phonics, Reading Fluency, Vocabulary, Reading Comprehension, Orthography | * | https://www.lexialearning.com/core5 |
| INT-009 | Lexia Power Up | 6-12 | English | 2, 3 | Phonics, Reading Fluency, Vocabulary, Reading Comprehension, Orthography | * | https://www.lexialearning.com/powerup |
| INT-010 | Lindamood Bell's Seeing Stars | 2-12 | English | 2, 3 | Orthography | (no designation) | https://lindamoodbell.com/program/seeing-stars-program |
| INT-011 | Lindamood Phoneme Sequencing | K-3 | English | 3 | Phonemic Awareness | ** | https://lindamoodbell.com/program/lindamood-phoneme-sequencing-program |
| INT-012 | Orton-Gillingham | K-12 | English | 1, 2, 3 | Alphabetic Principle, Phonemic Awareness, Reading Fluency, Reading Comprehension, Orthography | ** | https://www.ortonacademy.org/ |
| INT-013 | Page par Page | M-2 | French Immersion | 1, 2, 3 | Alphabetic Principle, Phonics, Reading Fluency, Reading Comprehension | (no designation) | (local resource) |
| INT-014 | Phonémique -- Version 1 | M-3 | French Immersion | 1, 2, 3 | Phonemic Awareness | (no designation) | (local resource) |
| INT-015 | Phonémique -- Version 2 | M-3 | French Immersion | 1, 2, 3 | Phonemic Awareness | (no designation) | (local resource) |
| INT-016 | Programme d'intervention en lecture et en orthographe (PILO) | M-3 | French Immersion | 2, 3 | Alphabetic Principle, Phonics, Orthography | (no designation) | (SharePoint) |
| INT-017 | Remediation Plus Systems | K-3 | English | 1, 2 | Phonemic Awareness, Phonics, Reading Fluency, Reading Comprehension, Orthography | * | http://www.remediationplus.com/products/the-remediation-plus-system/ |
| INT-018 | Remediation Plus Systems | 4-8 | English | 2 | Reading Fluency, Reading Comprehension, Vocabulary | * | http://www.remediationplus.com/products/the-remediation-plus-system/ |
| INT-019 | Ressource CBE | M-2 | French Immersion | 1, 2, 3 | Alphabetic Principle, Phonics | (no designation) | https://lrsdcdn.sharepoint.com/sites/TeachingLearning/curriculum/Literacy/Early%20Literacy/Forms/AllItems.aspx?csf=1&web=1&e=mIBlD4&CID=8ec8404f%2D3d7b%2D471d%2Da489%2D43660cc2ad46&FolderCTID=0x012000F20499129962D74E9046ECDF35332B03&id=%2Fsites%2FTeachingLearning%2Fcurriculum%2FLiteracy%2FEarly%20Literacy%2FLitt%C3%A9ratie%20structur%C3%A9e%2FLa%20phon%C3%A9tique%2FLe%C3%A7ons%20du%20CBE%20pour%20la%20Maternelle%20%C3%A0%20la%206e%20ann%C3%A9e |
| INT-020 | Ressource CBE | M-4 | French Immersion | 2 | Alphabetic Principle | (no designation) |(https://lrsdcdn.sharepoint.com/sites/TeachingLearning/curriculum/Literacy/Early%20Literacy/Forms/AllItems.aspx?csf=1&web=1&e=mIBlD4&CID=8ec8404f%2D3d7b%2D471d%2Da489%2D43660cc2ad46&FolderCTID=0x012000F20499129962D74E9046ECDF35332B03&id=%2Fsites%2FTeachingLearning%2Fcurriculum%2FLiteracy%2FEarly%20Literacy%2FLitt%C3%A9ratie%20structur%C3%A9e%2FLa%20phon%C3%A9tique%2FLe%C3%A7ons%20du%20CBE%20pour%20la%20Maternelle%20%C3%A0%20la%206e%20ann%C3%A9e |
| INT-021 | REWARDS | 4-12 | English | 2, 3 | Reading Fluency, Vocabulary, Orthography | ** | https://www.voyagersopris.com/products/reading/rewards/overview |
| INT-022 | Saxon Reading Foundations | K-2 | English | 1, 2, 3 | Phonemic Awareness, Reading Fluency, Orthography | ** | https://www.heinemann.com/saxon-reading-foundations/ |
| INT-023 | Son au graphe | 3-12 | French Immersion | 1, 2, 3 | Alphabetic Principle, Phonics | (no designation) | (local resource) |
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
| INT-035 | Words Their Way | K-12 | English | 1, 2, 3 | Orthography | (no designation) | (local resource) |
| INT-036 | WordGen Elementary | 4-5 | English | 1 | Vocabulary | ** | https://www.serpinstitute.org/wordgen-elementary |
| INT-037 | WordGen Weekly | 6-8 | English | 1 | Vocabulary | ** | https://www.serpinstitute.org/wordgen-weekly |

### Key Intervention Tagging Principles

**Unique Item Definition:**
- An intervention is UNIQUE based on `NAME + GRADE_RANGE`
- Example: "Remediation Plus Systems (K-3)" and "Remediation Plus Systems (4-8)" are TWO separate items
- Example: "UFLI Manual (K-2)" and "UFLI Manual (K-8)" are TWO separate items

**Multiple Tiers in Single Entry:**
- "Wilson Fundations (K-3)" appears in Tiers 1 AND 2 → Listed once with `Tiers: [1, 2]`
- NOT listed separately for Tier 1 and again for Tier 2

**Multiple Pillars in Single Entry:**
- "Wilson Fundations (K-3)" addresses 7 pillars → Listed once with all 7 pillars
- NOT listed separately for each pillar

**Tier Definitions:**
- **Tier 1:** Universal/Foundational interventions (all students, preventative)
- **Tier 2:** Supplemental interventions (targeted for students showing risk factors)
- **Tier 3:** Intensive interventions (for students with significant deficits)

---

## ASSESSMENTS DATABASE

### Complete Drill-Down Assessments Listing

These are **diagnostic assessment tools** used for detailed, targeted assessment AFTER screener results indicate a need. They are NOT screener subtests.

Each drill-down assessment is listed **ONCE** per unique `NAME + GRADE_RANGE` combination and measures ONE literacy pillar.

ID | Assessment Name | Grade Range | Program | Tier | Literacy Pillar | Evidence Level | URL
ASSESS-001 | CC3 & LeNS | K-3 | English | 2 | Alphabetic Principle | (no designation) | CC3 and LeNs
ASSESS-002 | CORE Phonics Survey | K-12 | English | 2 | Phonics | (no designation) | CORE Phonics Survey
ASSESS-003 | French CORE Phonics Assessment | K-12 | French Immersion | 2 | Phonics | (no designation) | French CORE Phonics Assessment
ASSESS-004 | Gallistel-Ellis (Reading) | K-2 | English | 2 | Alphabetic Principle | (no designation) | Gallistel-Ellis
ASSESS-005 | Heggerty -- Letter Name Sounds | 3-8 | English | 2 | Alphabetic Principle | ** | Heggerty -- Letter Name Sounds
ASSESS-006 | Identification du nom et du son des lettres de l'alphabet | M-2 | French Immersion | 2 | Alphabetic Principle | (no designation) | Identification du nom et du son des lettres de l'alphabet
ASSESS-007 | Letter Identification Assessment | K-2 | English | 2 | Alphabetic Principle | (no designation) | Letter Identification Assessment
ASSESS-008 | Quick Phonics Screener | K-12 | English | 2 | Phonics | (no designation) | Quick Phonics Screener
ASSESS-009 | Really Great Reading -- DAER | K | English | 2 | Alphabetic Principle | (no designation) | (local resource)
ASSESS-010 | Really Great Reading -- DAEES | 1 | English | 2 | Alphabetic Principle | (no designation) | (local resource)
ASSESS-011 | Lindamood Phoneme Sequencing (Assessment) | K-3 | English | 3 | Phonemic Awareness | ** | https://lindamoodbell.com/program/lindamood-phoneme-sequencing-program
ASSESS-012 | Lindamood Bell's Seeing Stars (Assessment) | 2-12 | English | 3 | Orthography | (no designation) | https://lindamoodbell.com/program/seeing-stars-program
ASSESS-013 | Barton Reading and Spelling (Assessment) | 3-12 | English | 3 | Orthography | ** | https://bartonreading.com/
ASSESS-014 | Kilpatrick -- Phonemic Awareness Battery | K-2 | English | 3 | Phonemic Awareness | ** | (local resource)
ASSESS-015 | SRA Reading Inventory | K-6 | English | 2 | Reading Fluency | * | (Nelson)



### Assessment Classification

**Assessment Type:**
- **Diagnostic:** Detailed, targeted assessment tools used for deeper investigation of specific literacy components after screener results indicate a need

**What is NOT in this table:**
- **Screener subtests** (DIBELS: LNF, CTOPP-2: Blending, THaFoL: FNL, IDAPEL: FRO)
  - These are menu navigation categories, not drill-down assessments
  - They live in the Screeners & Subtests section as filter triggers

**Note on Tiers:**
- Drill-down assessments do NOT have tier designations
- Assessments are DIAGNOSTIC tools, not intervention delivery methods
- Interventions are tiered (Tier 1, 2, 3); assessments support all tiers by informing decisions

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
- THaFoL: FNL (Facilité à nommer des lettres)

**Related Drill-Down Assessments:**
- CC3 & LeNS
- Letter Identification Assessment
- Gallistel-Ellis (Reading)
- Heggerty -- Letter Name Sounds
- Really Great Reading -- DAER/DAEES

**Related Interventions:**
- Heggerty (K-2)
- Wilson Fundations (K-3)
- UFLI Manual (K-2, K-8)

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
- DIBELS: ORF-ACC (Oral Reading Fluency -- Accuracy)
- DIBELS: ORF-WC (Oral Reading Fluency -- Words Correct)
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
- Abracadabra (1-2, French)

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

---

## IMPLEMENTATION GUIDE FOR DEVELOPERS

### Technology Stack Recommendations

**Frontend:**
- React or Vue.js for interactive dropdown/selection UI
- Responsive design for tablet and desktop use
- Accessibility-first (WCAG 2.1 AA compliance)

**Backend:**
- Node.js/Express or Python/Flask for API
- Database: PostgreSQL or MongoDB for flexible schema

**Data Storage:**
- Relational database with normalized structure (see schema section)
- Caching layer for fast filter queries

**Deployment:**
- LRSD SharePoint integration (embed via web part)
- Alternatively: standalone web app hosted on Netlify/GitHub Pages
- Offline support consideration (IndexedDB for local caching)

---

### UI/UX Design Specifications

#### Screen 1: Screener Selection
```
┌─────────────────────────────────────┐
│  LITERACY SCREENER SELECTOR         │
├─────────────────────────────────────┤
│                                     │
│  Select a Screener:                │
│                                     │
│  [ ] English Screeners              │
│      ☑ DIBELS                       │
│      ☑ CTOPP-2                      │
│                                     │
│  [ ] French Immersion Screeners     │
│      ☑ THaFoL                       │
│      ☑ IDAPEL                       │
│                                     │
│  [Continue →]                       │
└─────────────────────────────────────┘
```

#### Screen 2: Subtest Selection (Dynamic)
```
┌──────────────────────────────────────┐
│  STEP 2: Select Subtest              │
│  (Screener: DIBELS selected)         │
├──────────────────────────────────────┤
│                                      │
│  Which subtest did you administer?   │
│                                      │
│  • LNF - Letter Naming Fluency       │
│  • PSF - Phonemic Segmentation       │
│  • NWF-CLS - Nonsense Word FL...     │
│  • NWF-WRC - Nonsense Word FL...     │
│  • WRF - Word Reading Fluency        │
│  • ORF-ACC - Oral Reading FL...      │
│  • ORF-WC - Oral Reading FL...       │
│  • Maze - Maze                       │
│                                      │
│  [← Back]  [Continue →]              │
└──────────────────────────────────────┘
```

#### Screen 3: Pillar Display & Selection
```
┌──────────────────────────────────────┐
│  STEP 3: Literacy Pillar(s)          │
│  (DIBELS LNF selected, K-3 grade)    │
├──────────────────────────────────────┤
│                                      │
│  This subtest measures:              │
│  ☑ Alphabetic Principle              │
│                                      │
│  (Auto-selected - single pillar)     │
│                                      │
│  ℹ Alphabetic Principle:             │
│  Understanding that letters          │
│  represent sounds and letter-sound   │
│  correspondences.                    │
│                                      │
│  [← Back]  [Continue →]              │
└──────────────────────────────────────┘
```

#### Screen 4: Item Type Selection
```
┌──────────────────────────────────────┐
│  STEP 4: What do you need?           │
│  (DIBELS LNF → Alphabetic Principle) │
├──────────────────────────────────────┤
│                                      │
│  Choose an option:                   │
│                                      │
│  ○ Assessment (Drill Down)           │
│    → Detailed diagnostic testing     │
│                                      │
│  ○ Intervention (Instruction)        │
│    → Teaching strategy or program    │
│                                      │
│  [← Back]  [View Results →]          │
└──────────────────────────────────────┘
```

#### Screen 5: Filtered Results
```
┌──────────────────────────────────────┐
│  RESULTS: Assessments for            │
│  Alphabetic Principle (K-3)          │
├──────────────────────────────────────┤
│  5 Drill-Down Assessments found      │
│                                      │
│  1. CC3 & LeNS (K-3)                 │
│     Diagnostic                       │
│     (SharePoint - local)             │
│                                      │
│  2. Letter ID Assessment (K-2)       │
│     Diagnostic                       │
│     (SharePoint - local)             │
│                                      │
│  3. Gallistel-Ellis (K-2)            │
│     Diagnostic                       │
│     (SharePoint - local)             │
│                                      │
│  [← New Search]                      │
└──────────────────────────────────────┘
```

---

## DATA STRUCTURE & SCHEMA

### JSON Database Schema

```json
{
  "screeners": [
    {
      "screener_id": "DIBELS",
      "screener_name": "DIBELS",
      "full_name": "Dynamic Indicators of Basic Early Literacy Skills",
      "language": "English",
      "grade_range": { "start": "K", "end": "6" },
      "publisher": "University of Oregon",
      "type": "Universal Screening",
      "subtests": [
        {
          "subtest_code": "LNF",
          "subtest_name": "Letter Naming Fluency",
          "grade_range": { "start": "K", "end": "3" },
          "literacy_pillars": ["Alphabetic Principle"],
          "description": "Measures automaticity of letter naming"
        },
        {
          "subtest_code": "PSF",
          "subtest_name": "Phonemic Segmentation Fluency",
          "grade_range": { "start": "K", "end": "2" },
          "literacy_pillars": ["Phonemic Awareness"],
          "description": "Measures ability to segment phonemes"
        }
        // ... more subtests
      ]
    },
    // ... more screeners
  ],
  "interventions": [
    {
      "item_id": "INT-001",
      "item_type": "Intervention",
      "name": "Abracadabra",
      "grade_range": { "start": "1", "end": "2" },
      "program": "French Immersion",
      "tiers": [1, 2],
      "literacy_pillars": [
        "Alphabetic Principle",
        "Phonemic Awareness",
        "Phonics",
        "Reading Fluency",
        "Reading Comprehension"
      ],
      "evidence_level": "*",
      "url": "https://literacy.concordia.ca/resources/abra/teacher/fr/index.php"
    },
    // ... more interventions
  ],
  "assessments": [
    {
      "item_id": "ASSESS-001",
      "item_type": "Assessment",
      "name": "CC3 & LeNS",
      "grade_range": { "start": "K", "end": "3" },
      "program": "English",
      "literacy_pillar": "Alphabetic Principle",
      "evidence_level": "(no designation)",
      "assessment_type": "Diagnostic",
      "url": "(SharePoint)"
    },
    // ... more drill-down assessments ONLY (NOT screener subtests)
  ],
  "literacy_pillars": [
    {
      "id": 1,
      "name": "Alphabetic Principle",
      "definition": "Understanding that letters represent sounds and letter-sound correspondences",
      "description": "..."
    },
    // ... more pillars
  ]
}
```

### Relational Database Schema (SQL Alternative)

```sql
-- Screeners Table
CREATE TABLE screeners (
  screener_id VARCHAR(20) PRIMARY KEY,
  screener_name VARCHAR(100) NOT NULL,
  full_name VARCHAR(255),
  language VARCHAR(50), -- 'English', 'French Immersion'
  grade_range_start VARCHAR(2),
  grade_range_end VARCHAR(2),
  publisher VARCHAR(100),
  type VARCHAR(100), -- 'Universal Screening', 'Diagnostic'
  created_at TIMESTAMP
);

-- Subtests Table (SCREENER SUBTESTS - Menu Navigation Categories)
CREATE TABLE subtests (
  subtest_id INT PRIMARY KEY AUTO_INCREMENT,
  screener_id VARCHAR(20) NOT NULL,
  subtest_code VARCHAR(20) NOT NULL,
  subtest_name VARCHAR(255) NOT NULL,
  grade_range_start VARCHAR(2),
  grade_range_end VARCHAR(2),
  description TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (screener_id) REFERENCES screeners(screener_id)
);

-- Subtest-Pillar Mapping (What pillars each screener subtest measures)
CREATE TABLE subtest_pillars (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subtest_id INT NOT NULL,
  pillar_id INT NOT NULL,
  FOREIGN KEY (subtest_id) REFERENCES subtests(subtest_id),
  FOREIGN KEY (pillar_id) REFERENCES literacy_pillars(pillar_id)
);

-- Literacy Pillars Table
CREATE TABLE literacy_pillars (
  pillar_id INT PRIMARY KEY AUTO_INCREMENT,
  pillar_name VARCHAR(100) NOT NULL UNIQUE,
  definition TEXT,
  description TEXT
);

-- Interventions Table
CREATE TABLE interventions (
  item_id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  grade_range_start VARCHAR(2),
  grade_range_end VARCHAR(2),
  program VARCHAR(50), -- 'English', 'French Immersion'
  evidence_level VARCHAR(20), -- '*', '**', '(no designation)'
  url TEXT,
  created_at TIMESTAMP,
  UNIQUE (name, grade_range_start, grade_range_end)
);

-- Intervention-Tier Mapping
CREATE TABLE intervention_tiers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_id VARCHAR(20) NOT NULL,
  tier INT NOT NULL,
  FOREIGN KEY (item_id) REFERENCES interventions(item_id)
);

-- Intervention-Pillar Mapping
CREATE TABLE intervention_pillars (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_id VARCHAR(20) NOT NULL,
  pillar_id INT NOT NULL,
  FOREIGN KEY (item_id) REFERENCES interventions(item_id),
  FOREIGN KEY (pillar_id) REFERENCES literacy_pillars(pillar_id)
);

-- Drill-Down Assessments Table (NOT screener subtests)
CREATE TABLE assessments (
  item_id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  grade_range_start VARCHAR(2),
  grade_range_end VARCHAR(2),
  program VARCHAR(50), -- 'English', 'French Immersion'
  pillar_id INT NOT NULL,
  evidence_level VARCHAR(20),
  assessment_type VARCHAR(50), -- 'Diagnostic'
  url TEXT,
  created_at TIMESTAMP,
  UNIQUE (name, grade_range_start, grade_range_end),
  FOREIGN KEY (pillar_id) REFERENCES literacy_pillars(pillar_id)
);
```

---

## FILTER LOGIC & QUERY SPECIFICATIONS

### Core Filter Logic

**Filter Precedence:** Screener → Subtest → Pillar(s) → Item Type

**Query Logic:**

```
Step 1: User selects SCREENER
→ Load available SUBTESTS for that screener from subtests table

Step 2: User selects SUBTEST
→ Extract LITERACY_PILLARS for that subtest from subtest_pillars table
→ If single pillar: auto-select
→ If multiple pillars: display for user selection

Step 3: User selects LITERACY_PILLAR(S)
→ Store selected pillars in filter object

Step 4: User selects ITEM_TYPE (Assessment or Intervention)
→ Query database for items matching:
   - Item type (Assessment OR Intervention)
   - Program (English OR French Immersion, based on screener language)
   - Grade range (items overlapping with subtest grade range)
   - Literacy pillar(s) (items containing ANY selected pillar)

Step 5: Display RESULTS
→ Sort by:
   1. Evidence level (*, **, then no designation)
   2. Grade range (ascending)
   3. Name (alphabetical)
→ Include: Name, Grade Range, Program, Evidence Level, Assessment Type, URL
```

### SQL Query Examples

#### Query 1: Get Drill-Down Assessments for DIBELS-LNF (Alphabetic Principle)

```sql
SELECT 
  a.item_id,
  a.name,
  CONCAT(a.grade_range_start, '-', a.grade_range_end) as grade_range,
  a.program,
  a.evidence_level,
  a.assessment_type,
  a.url
FROM assessments a
WHERE 
  a.program = 'English' -- DIBELS is English
  AND a.pillar_id = 1 -- Alphabetic Principle pillar_id = 1
  AND a.grade_range_start <= '3' -- Overlaps with DIBELS LNF K-3 range
  AND a.grade_range_end >= 'K'
ORDER BY 
  CASE a.evidence_level 
    WHEN '*' THEN 1 
    WHEN '**' THEN 2 
    ELSE 3 
  END,
  a.grade_range_start ASC,
  a.name ASC;
```

#### Query 2: Get Interventions for DIBELS-NWF-CLS (Multiple Pillars)

```sql
SELECT 
  i.item_id,
  i.name,
  CONCAT(i.grade_range_start, '-', i.grade_range_end) as grade_range,
  i.program,
  STRING_AGG(lp.pillar_name, ', ') as pillars,
  STRING_AGG(DISTINCT it.tier, ',') as tiers,
  i.evidence_level,
  i.url
FROM interventions i
LEFT JOIN intervention_pillars ip ON i.item_id = ip.item_id
LEFT JOIN literacy_pillars lp ON ip.pillar_id = lp.pillar_id
LEFT JOIN intervention_tiers it ON i.item_id = it.item_id
WHERE 
  i.program = 'English'
  AND ip.pillar_id IN (1, 2, 3) -- Alphabetic Principle, Phonemic Awareness, Phonics
  AND (i.grade_range_start <= '2' AND i.grade_range_end >= 'K')
GROUP BY i.item_id
ORDER BY 
  CASE i.evidence_level 
    WHEN '*' THEN 1 
    WHEN '**' THEN 2 
    ELSE 3 
  END,
  i.grade_range_start ASC,
  i.name ASC;
```

#### Query 3: Get all Subtests for DIBELS Screener

```sql
SELECT 
  s.subtest_code,
  s.subtest_name,
  CONCAT(s.grade_range_start, '-', s.grade_range_end) as grade_range,
  STRING_AGG(lp.pillar_name, ', ') as literacy_pillars,
  s.description
FROM subtests s
LEFT JOIN subtest_pillars sp ON s.subtest_id = sp.subtest_id
LEFT JOIN literacy_pillars lp ON sp.pillar_id = lp.pillar_id
WHERE s.screener_id = 'DIBELS'
GROUP BY s.subtest_id
ORDER BY s.subtest_code ASC;
```

### API Endpoint Specifications

#### Endpoint 1: Get All Screeners
```
GET /api/screeners

Response:
[
  {
    "screener_id": "DIBELS",
    "screener_name": "DIBELS",
    "full_name": "Dynamic Indicators of Basic Early Literacy Skills",
    "language": "English",
    "grade_range": "K-6"
  },
  // ... more screeners
]
```

#### Endpoint 2: Get Subtests for Screener
```
GET /api/screeners/{screener_id}/subtests

Response:
[
  {
    "subtest_code": "LNF",
    "subtest_name": "Letter Naming Fluency",
    "grade_range": "K-3",
    "literacy_pillars": ["Alphabetic Principle"],
    "description": "Measures automaticity of letter naming"
  },
  // ... more subtests
]
```

#### Endpoint 3: Get Filtered Items
```
GET /api/results?
  screener_id=DIBELS&
  subtest_code=LNF&
  item_type=assessment&
  pillars=Alphabetic%20Principle

Response:
{
  "query": {
    "screener": "DIBELS",
    "subtest": "LNF",
    "item_type": "assessment",
    "pillars": ["Alphabetic Principle"],
    "program": "English",
    "grade_range": "K-3"
  },
  "results": [
    {
      "item_id": "ASSESS-001",
      "name": "CC3 & LeNS",
      "grade_range": "K-3",
      "program": "English",
      "evidence_level": "(no designation)",
      "assessment_type": "Diagnostic",
      "url": "(SharePoint)"
    },
    // ... more results
  ],
  "count": 5
}
```

---

## USER JOURNEY EXAMPLES

### Example 1: Teacher Using DIBELS

**Scenario:** Ms. Chen administered DIBELS screening at the beginning of the year. Several students scored below benchmark on the LNF (Letter Naming Fluency) subtest. She wants to:
1. Confirm what pillar this measures
2. Find drill-down assessments to assess deeper
3. Find interventions to address the deficit

**User Journey:**

```
Step 1: Select Screener
→ User clicks: "DIBELS"

Step 2: Select Subtest
→ User clicks: "LNF - Letter Naming Fluency (K-3)"

Step 3: View Pillar
→ System shows: "This subtest measures ALPHABETIC PRINCIPLE"
→ Description: "Understanding that letters represent sounds..."
→ Auto-selects pillar (single pillar only)

Step 4: Choose Item Type
→ User clicks: "Assessment" (first search)
→ System queries drill-down assessments for Alphabetic Principle (K-3)
→ System shows 5 drill-down assessments: CC3 & LeNS, Letter ID, etc.
→ Ms. Chen clicks on "CC3 & LeNS" to learn more

Step 5: Second Search - Interventions
→ User goes back, clicks "New Search"
→ Repeats steps 1-3
→ Step 4: User clicks "Intervention"
→ System shows 12 interventions for Alphabetic Principle (K-3)
→ Results include: Wilson Fundations, Heggerty, UFLI Manual, etc.
→ Ms. Chen picks "Wilson Fundations" (evidence-based, K-3)
```

---

### Example 2: Teacher Using French Immersion Screeners

**Scenario:** Mr. Dubois works in a French immersion classroom. He administered THaFoL and wants to find assessments for the "FNL" (letter naming) subtest.

**User Journey:**

```
Step 1: Select Screener
→ User clicks: "THaFoL" (under French Immersion Screeners)

Step 2: Select Subtest
→ Dropdown automatically shows French subtest names
→ User clicks: "FNL - Facilité à nommer des lettres (K-3)"
→ Translation shown: "Letter Naming Fluency"

Step 3: View Pillar
→ System shows: "This subtest measures ALPHABETIC PRINCIPLE"
→ Auto-selects pillar

Step 4: Choose Item Type
→ User clicks: "Assessment"
→ System shows 4 drill-down assessments (French Immersion only):
  • Identification du nom et du son des lettres (M-2) [Diagnostic]
  • Gallistel-Ellis (K-2) [Diagnostic] (if language-neutral)
  
→ User can also search for Interventions
→ System filters to FRENCH IMMERSION ONLY
→ Results include: Ressource CBE, Son au graphe, etc.
```

---

### Example 3: Teacher Looking for Multi-Pillar Intervention

**Scenario:** A special education coordinator wants to find interventions for phonemic awareness (CTOPP-2: Blending subtest shows deficit).

**User Journey:**

```
Step 1: Select Screener
→ User clicks: "CTOPP-2"

Step 2: Select Subtest
→ User clicks: "Blending (K-3)"

Step 3: View Pillar
→ System shows: "This subtest measures PHONEMIC AWARENESS"
→ Auto-selects pillar

Step 4: Choose Item Type
→ User clicks: "Intervention"
→ System shows interventions matching Phonemic Awareness (K-3)
→ Results include: Heggerty, Lindamood Phoneme Sequencing, 
                   Remediation Plus, Saxon Reading, etc.
→ All listed with evidence levels and tier information
```

---

## TECHNICAL IMPLEMENTATION CHECKLIST

- [ ] Database created and normalized per schema
- [ ] Screeners table populated with all entries
- [ ] **Subtests table populated** (NOT in assessments)
- [ ] Subtest-Pillar mapping table populated
- [ ] **Drill-down assessments table populated** (NOT screener subtests)
- [ ] Interventions and intervention_tiers table populated
- [ ] Intervention-pillar mapping table populated
- [ ] Literacy pillars table populated
- [ ] API endpoints developed and tested
- [ ] Filter logic implemented and validated
- [ ] Grade range overlap calculation implemented
- [ ] Frontend UI built per design specifications
- [ ] Responsive design tested on tablet/mobile
- [ ] Accessibility testing (WCAG 2.1 AA)
- [ ] Error handling for edge cases (no results found, etc.)
- [ ] Performance testing (response time <500ms)
- [ ] User testing with sample educators
- [ ] Documentation created for end users
- [ ] Deployment and integration with LRSD systems

---

## NOTES FOR FUTURE ENHANCEMENTS

1. **Additional Filters:**
   - Evidence level filter (* vs ** vs no designation)
   - Tier filter for interventions (Tier 1 vs 2 vs 3)
   - Multiple language support interface

2. **Expanded Data:**
   - More French immersion drill-down assessments
   - Integration with LRSD-specific local resources
   - Cost information for commercial products
   - Implementation timelines and professional development needs

3. **Advanced Features:**
   - Bookmarking/saving favorite resources
   - Comparing multiple interventions side-by-side
   - Linking student assessment data to intervention recommendations
   - Progress monitoring integration
   - Professional development resources for each intervention

4. **Accessibility:**
   - Screen reader optimization
   - Keyboard navigation throughout
   - High contrast mode option
   - Printable result cards

5. **Integration:**
   - LRSD SharePoint integration
   - SIS (Student Information System) connection for grade/program filtering
   - Email sharing of results
   - PDF export of filtered results

---

**End of Document**

Version 2.0 | LRSD | January 2026
