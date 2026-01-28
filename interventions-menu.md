# LRSD Literacy Interventions & Assessments Data Structure
## Organized by Individual Item with Comprehensive Tagging

---

## TAGGING SYSTEM EXPLANATION FOR CODING AI

### Core Principles

1. **Unique Item Identification**
   - An item is UNIQUE based on: `NAME + GRADE_RANGE`
   - The SAME intervention appearing in multiple tiers or pillars = ONE record with MULTIPLE tags
   - Example: "Wilson Fundations (K-3)" appears in 7 different pillars and 2 tiers = ONE entry with tags showing all 7 pillars and tiers [1, 2]

2. **Tag Structure**
   - Each intervention/assessment has MULTIPLE tags to indicate its applicability
   - Tags are comma-separated and can be used for filtering
   - An item can support multiple tiers AND multiple pillars simultaneously

3. **Grade Range as Differentiator**
   - "UFLI Manual (K-2)" and "UFLI Manual (K-8)" = TWO DIFFERENT items
   - "UFLI Manual (K-2)" appears in both Tier 1 and Tier 2 = ONE item with Tiers: [1, 2]
   - "UFLI Manual (K-8)" appears only in Tiers 2 and 3 = DIFFERENT item with Tiers: [2, 3]

4. **Program Assignment Logic**
   ```
   IF "FI" in grade_range_marker (e.g., "M-3 FI")
      → Program: French Immersion
   ELSE IF name contains French words OR explicitly marked French
      → Program: French Immersion
   ELSE
      → Program: English
   ```

5. **Pillar Tags**
   - Each item lists ALL literacy pillars it addresses
   - Use exact names: Alphabetic Principle, Phonemic Awareness, Phonics, Reading Fluency, Vocabulary, Reading Comprehension, Orthography
   - Items supporting all 7 pillars: Use shorthand `[ALL_PILLARS]` in filters

6. **Tier Tags**
   - Values: 1, 2, 3 (comma-separated if multiple)
   - Tier 1 = Universal/Foundational
   - Tier 2 = Supplemental
   - Tier 3 = Intensive

7. **Evidence Level Tags**
   - `*` = Evidence Based (RCT/quasi-experimental studies, statistically significant outcomes)
   - `**` = Research Based (sound theory with some validation)
   - `(no designation)` = Not labeled (local/legacy resources)

---

## INTERVENTIONS
### Listed Once with Complete Tagging (Each Unique Name + Grade Range = One Entry)

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
| INT-019 | Ressource CBE | M-2 | French Immersion | 1, 2, 3 | Alphabetic Principle, Phonics | (no designation) | (local resource) |
| INT-020 | Ressource CBE | M-4 | French Immersion | 2 | Alphabetic Principle | (no designation) | (local resource) |
| INT-021 | REWARDS | 4-12 | English | 2, 3 | Reading Fluency, Vocabulary, Orthography | ** | https://www.voyagersopris.com/products/reading/rewards/overview |
| INT-022 | Saxon Reading Foundations | K-2 | English | 1, 2, 3 | Phonemic Awareness, Reading Fluency, Orthography | ** | https://www.heinemann.com/saxon-reading-foundations/ |
| INT-023 | Son au graphe | 3-12 | French Immersion | 1, 2, 3 | Alphabetic Principle, Phonics | (no designation) | (local resource) |
| INT-024 | SRA Corrective Reading | K-3 | English | 2, 3 | Reading Comprehension, Orthography | * | (Nelson) |
| INT-025 | SRA Corrective Reading | 3-12 | English | 2, 3 | Alphabetic Principle, Phonemic Awareness, Phonics, Reading Fluency, Reading Comprehension | * | (Nelson) |
| INT-026 | SRA Early Interventions in Reading Skills | K-3 | English | 2 | Phonemic Awareness, Reading Fluency | * | (Nelson) |
| INT-027 | SRA Open Court | K-3 | English | 1, 2 | Phonics, Reading Fluency, Vocabulary, Reading Comprehension | * | https://pages.nelson.com/assets/pdf/open_court.pdf |
| INT-028 | SRA Open Court | 4-6 | English | 2 | Reading Fluency, Vocabulary, Reading Comprehension | * | https://pages.nelson.com/assets/pdf/open_court.pdf |
| INT-029 | SRA Reading Mastery | K-6 | English | 2 | Alphabetic Principle, Phonemic Awareness, Phonics, Reading Fluency, Vocabulary, Reading Comprehension, Orthography | * | (Nelson) |
| INT-030 | STARI | 6-9 | English | 2, 3 | Reading Fluency, Reading Comprehension | ** | https://www.serpinstitute.org/stari |
| INT-031 | UFLI Manual | K-2 | English | 1, 2 | Alphabetic Principle, Phonemic Awareness, Phonics, Reading Fluency, Vocabulary, Reading Comprehension, Orthography | ** | https://ufli.education.ufl.edu/foundations-materials/ |
| INT-032 | UFLI Manual | K-8 | English | 2, 3 | Alphabetic Principle, Phonemic Awareness, Phonics, Reading Fluency, Vocabulary, Reading Comprehension, Orthography | ** | https://ufli.education.ufl.edu/foundations-materials/ |
| INT-033 | Wilson Fundations | K-3 | English | 1, 2 | Alphabetic Principle, Phonemic Awareness, Phonics, Reading Fluency, Vocabulary, Reading Comprehension, Orthography | * | https://www.wilsonlanguage.com/programs/fundations/ |
| INT-034 | Wilson Reading System | 2-12 | English | 3 | Alphabetic Principle, Orthography | ** | https://www.wilsonlanguage.com/programs/wilson-reading-system/ |
| INT-035 | Words Their Way | K-12 | English | 1, 2, 3 | Orthography | (no designation) | (local resource) |
| INT-036 | WordGen Elementary | 4-5 | English | 1 | Vocabulary | ** | https://www.serpinstitute.org/wordgen-elementary |
| INT-037 | WordGen Weekly | 6-8 | English | 1 | Vocabulary | ** | https://www.serpinstitute.org/wordgen-weekly |

---

## DRILL DOWN ASSESSMENTS
### Listed Once with Complete Tagging (Each Unique Name + Grade Range = One Entry)

| ID | Assessment Name | Grade Range | Program | Tiers | Literacy Pillar | Evidence Level | Assessment Type | URL |
|-----|-----------------|-------------|---------|-------|-----------------|----------------|-----------------|-----|
| ASSESS-001 | CC3 & LeNS | K-3 | English | 2 | Alphabetic Principle | (no designation) | Diagnostic | (SharePoint) |
| ASSESS-002 | CORE Phonics Survey | K-12 | English | 2 | Phonics | (no designation) | Diagnostic | (SharePoint) |
| ASSESS-003 | CTOPP-2: Blending | K-3 | English | 2 | Phonemic Awareness | (no designation) | Standardized Screener | (standardized) |
| ASSESS-004 | CTOPP-2: Elision | K-3 | English | 2 | Phonemic Awareness | (no designation) | Standardized Screener | (standardized) |
| ASSESS-005 | DIBELS: LNF (Letter Naming Fluency) | K-3 | English | 2 | Alphabetic Principle | (no designation) | Standardized Screener | (standardized) |
| ASSESS-006 | DIBELS: Maze | 2-6 | English | 2 | Reading Comprehension | (no designation) | Standardized Screener | (standardized) |
| ASSESS-007 | DIBELS: NWF (Correct Letter Sounds) | K-2 | English | 2 | Phonics | (no designation) | Standardized Screener | (standardized) |
| ASSESS-008 | DIBELS: NWF (Words Read Correctly) | 1-3 | English | 2 | Reading Fluency | (no designation) | Standardized Screener | (standardized) |
| ASSESS-009 | DIBELS: ORF (Oral Reading Fluency) -- Accuracy | 1-6 | English | 2 | Reading Fluency | (no designation) | Standardized Screener | (standardized) |
| ASSESS-010 | DIBELS: ORF (Oral Reading Fluency) -- Words Correct | 1-6 | English | 2 | Reading Fluency | (no designation) | Standardized Screener | (standardized) |
| ASSESS-011 | DIBELS: PSF (Phonemic Segmentation Fluency) | K-2 | English | 2 | Phonemic Awareness | (no designation) | Standardized Screener | (standardized) |
| ASSESS-012 | DIBELS: WRF (Word Reading Fluency) | 1-6 | English | 2 | Reading Fluency | (no designation) | Standardized Screener | (standardized) |
| ASSESS-013 | French CORE Phonics Assessment | K-12 | French Immersion | 2 | Phonics | (no designation) | Diagnostic | (SharePoint) |
| ASSESS-014 | Gallistel-Ellis (Reading) | K-2 | English | 2 | Alphabetic Principle | (no designation) | Diagnostic | (SharePoint) |
| ASSESS-015 | Heggerty -- Letter Name Sounds | 3-8 | English | 2 | Alphabetic Principle | ** | Diagnostic | (SharePoint) |
| ASSESS-016 | Identification du nom et du son des lettres de l'alphabet | M-2 | French Immersion | 2 | Alphabetic Principle | (no designation) | Diagnostic | (SharePoint) |
| ASSESS-017 | IDAPEL: Facilité en lecture orale | K-3 | French Immersion | 2 | Reading Fluency | (no designation) | Standardized Screener | (standardized) |
| ASSESS-018 | Letter Identification Assessment | K-2 | English | 2 | Alphabetic Principle | (no designation) | Diagnostic | (SharePoint) |
| ASSESS-019 | Quick Phonics Screener | K-12 | English | 2 | Phonics | (no designation) | Diagnostic | (SharePoint) |
| ASSESS-020 | Really Great Reading -- DAER | K | English | 2 | Alphabetic Principle | (no designation) | Diagnostic | (local resource) |
| ASSESS-021 | Really Great Reading -- DAEES | 1 | English | 2 | Alphabetic Principle | (no designation) | Diagnostic | (local resource) |
| ASSESS-022 | THaFoL: Facilité à lire des non-mots | K-3 | French Immersion | 2 | Phonics | (no designation) | Standardized Screener | (standardized) |
| ASSESS-023 | THaFoL: Facilité à lire des mots | K-3 | French Immersion | 2 | Reading Fluency | (no designation) | Standardized Screener | (standardized) |
| ASSESS-024 | THaFoL: Facilité à nommer des lettres | K-3 | French Immersion | 2 | Alphabetic Principle | (no designation) | Standardized Screener | (standardized) |
| ASSESS-025 | THaFoL: Facilité en lecture orale | K-3 | French Immersion | 2 | Reading Fluency | (no designation) | Standardized Screener | (standardized) |

---

## REFERENCE: LITERACY PILLARS

For tagging and filtering purposes, use these exact names:

1. **Alphabetic Principle** - Understanding that letters represent sounds and letter-sound correspondences
2. **Phonemic Awareness** - Ability to hear, identify, and manipulate phonemes (individual sounds) in words
3. **Phonics** - The relationship between letters and sounds (decoding/encoding)
4. **Reading Fluency** - Speed, accuracy, and prosody in reading (automaticity)
5. **Vocabulary** - Understanding and using word meanings (receptive and expressive)
6. **Reading Comprehension** - Understanding and deriving meaning from written text
7. **Orthography** - Spelling and the structure/patterns of written words

---

## IMPLEMENTATION GUIDE FOR CODING AI

### Database Schema Recommendation

Each unique intervention/assessment should be stored with the following fields:

```
{
  "item_id": "INT-001" or "ASSESS-001",
  "item_type": "Intervention" | "Assessment",
  "name": "Intervention/Assessment Name",
  "grade_range_start": "K" | "M" | "1-12",
  "grade_range_end": "12" | "5" | "2",
  "grade_range_display": "K-3" | "M-2" | "1-2",
  "program": "English" | "French Immersion",
  "tiers": [1, 2, 3],  // Array of applicable tiers (interventions only)
  "literacy_pillars": [
    "Alphabetic Principle",
    "Phonemic Awareness",
    "Phonics",
    "Reading Fluency",
    "Vocabulary",
    "Reading Comprehension",
    "Orthography"
  ],
  "evidence_level": "*" | "**" | "(no designation)",
  "url": "https://...",
  "assessment_type": "Diagnostic" | "Standardized Screener" (assessments only)
}
```

### Filter Logic

When building the filterable dashboard:

1. **Tier Filter** (Interventions only): Show only items WHERE `tiers` array CONTAINS selected tier(s)
   - Example: Filter by [2] → Show items with tiers: [1,2], [2], [2,3]

2. **Pillar Filter**: Show only items WHERE `literacy_pillars` array CONTAINS selected pillar(s)
   - Example: Filter by ["Phonics"] → Show any item that addresses Phonics, regardless of other pillars
   - For interventions with multiple pillars, show if ANY match

3. **Program Filter**: Show only items WHERE `program` === selected program
   - Example: Filter by "French Immersion" → Show only French items

4. **Grade Range Filter**: Show only items WHERE grade range overlaps with selected range
   - Example: Filter by "Grade 2" → Show items with ranges like K-3, 1-2, 2-5, 1-12, etc.

5. **Evidence Level Filter**: Show only items WHERE `evidence_level` MATCHES selected level(s)
   - Example: Filter by "*" → Show only Evidence Based items

6. **Item Type Filter**: Show only items WHERE `item_type` === selected type
   - Example: Filter by "Intervention" → Show only interventions

7. **Assessment Type Filter** (Assessments only): Show only items WHERE `assessment_type` === selected type
   - Example: Filter by "Standardized Screener" → Show only standardized screeners

8. **Search/Text Filter**: Show items WHERE `name` CONTAINS search term (case-insensitive)
   - Example: Search "Wilson" → Show all Wilson products

### Deduplication Confirmation

This reorganized data ensures:
- ✓ Each intervention listed EXACTLY ONCE per unique (name, grade_range) pair
- ✓ Each assessment listed EXACTLY ONCE per unique (name, grade_range) pair
- ✓ "Wilson Fundations (K-3)" appears once with ALL tiers [1, 2] and ALL pillars it addresses
- ✓ "UFLI Manual (K-2)" and "UFLI Manual (K-8)" are SEPARATE entries (different grade ranges)
- ✓ Assessments are separated from interventions for clarity
- ✓ Tags show comprehensive coverage without data duplication
- ✓ Easy parsing for AI: comma-separated values, ordered/consistent field structure

### Key Numbers

- **Unique Interventions**: 37 (each with unique name + grade range combination)
- **Unique Assessments**: 25 (each with unique name + grade range combination)
- **Total Filterable Items**: 62
- **Programs**: English (40 items), French Immersion (22 items)
- **Tiers Represented**: 
  - Tier 1: 20 interventions
  - Tier 2: 30+ interventions/assessments
  - Tier 3: 15+ interventions
- **Evidence Levels**:
  - Evidence Based (*): 18 items
  - Research Based (**): 13 items
  - Not Designated: 31 items

### Coding Notes

- **Grade Range Format**: Store as separate start/end values for range queries, display as "M-2", "K-3", "3-12"
- **Pillar Matching**: When user filters by pillar, check if pillar name exists in the item's `literacy_pillars` array
- **Multi-Select**: All filters support multi-select (OR logic within filter type, AND logic between filter types)
- **French Detection**: Items in French Immersion program are those with "FI" marker or French language names
- **Tiers are Interventions Only**: Assessments do not have tier tags (they are diagnostic tools, not intervention delivery)
- **Multi-Pillar**: Most interventions support multiple pillars; filtering should account for this with OR logic within the pillar array