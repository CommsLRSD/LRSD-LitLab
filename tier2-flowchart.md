# Tier TWO: Small Group Intervention

I am building an interactive literacy intervention flowchart. The visual design, layout, colours, and general functionality already exist. Focus on recreating the decision-making process and content exactly as described below.

Preserve all wording exactly as written. Do not change terminology or alter instructional language.

## Step 1: Entry

### Informed by data

- Informed by data (See progress monitoring tools).

### Rule out that challenges are not the result of:

- [ ] Vision impairments
- [ ] Hearing impairments
- [ ] Poor attendance
- [ ] MLL
- [ ] Other diagnosis

### Group Information:

- Led by classroom teachers.
- Approx. 3-5 students per group.
- Students receive intensive, explicit, and systematic instruction in small groups based on specific skill-based literacy goals (not necessarily grade), based on the five pillars of reading instruction as identified by classroom teachers, student services, and administrators.
- Interventions are implemented for a suggested period of 20-40 minutes, three to five times per week for an 8 week period.

### Progress Monitoring:

- Weekly progress monitoring (ex. UFLI, DIBELS Progress Monitoring Assessments).

### Collaboration:

- Team members share progress monitoring results at school based meetings.

After reviewing the entry information, proceed to Step 2.

## Step 2: Drill Down Assessment

Use the menu below to find and administer a drill down assessment that aligns with the needs of your students, as determined by the literacy screener.

## Step 3: 8-week Intervention

Use the menu below to find an appropriate intervention, monitor student response with progress monitoring tools (as required), and administer for an 8-week period.

## Step 4: Progress Monitoring

After the 8-week period, administer the regularly scheduled progress monitoring literacy screener (DIBELS, CTOPP-2, THaFol, IDAPEL).

After Progress Monitoring, the user must choose one of the following outcomes.

### Option A: Instruction Effective

(Subtest result Blue or Green)

### Option B: Instruction Ineffective

(Subtest result Yellow or Red)

---

## Route A: Instruction Effective After First Intervention Cycle

### Step 5: Success!

Consider fading supports to Tier 1 and monitor.

This route ends here.

---

## Route B: Instruction Ineffective After First Intervention Cycle

Proceed to:

## Step 5: Drill Down Assessment

Use the menu again to find and administer a drill down assessment that aligns with the needs of your students, as determined by the latest literacy screener.

## Step 6: 8-week Intervention

Alter or continue Tier 2 interventions and regularly monitor student response to intervention with progress monitoring tools (as required).

## Step 7: Progress Monitoring

After the 8-week period, administer the regularly scheduled progress monitoring literacy screener (DIBELS, CTOPP-2, THaFol, IDAPEL).

After Progress Monitoring, the user must choose one of the following outcomes.

### Option A: Instruction Effective

(Subtest result Blue or Green)

### Option B: Instruction Ineffective

(Subtest result Yellow or Red)

---

## Route B1: Instruction Effective After Second Intervention Cycle

### Step 8: Success!

Consider fading supports to Tier 1 and monitor.

This route ends here.

---

## Route B2: Instruction Ineffective After Second Intervention Cycle

### Step 8: Move to Tier 3

If student does not make expected progress in Tier 2 following two 8-week intervention cycles, they move into Tier 3. Fewer than 10% of students should need to be in Tier 3.

Proceed to:

## Tier 3: Personalized Interventions

This route continues into the Tier Three flowchart.

---

# Flow Logic

```text
Step 1
Entry
↓
Step 2
Drill Down Assessment
↓
Step 3
8-week Intervention
↓
Step 4
Progress Monitoring
↓
Instruction Effective?
├─ Yes
│  ↓
│  Step 5: Success!
│  Consider fading supports to Tier 1 and monitor.
│  END
│
└─ No
   ↓
   Step 5: Drill Down Assessment
   ↓
   Step 6: 8-week Intervention
   ↓
   Step 7: Progress Monitoring
   ↓
   Instruction Effective?
   ├─ Yes
   │  ↓
   │  Step 8: Success!
   │  Consider fading supports to Tier 1 and monitor.
   │  END
   │
   └─ No
      ↓
      Step 8: Move to Tier 3
      ↓
      Tier 3: Personalized Interventions
```

Whenever a user changes a previous decision, remove all content associated with the previous pathway and display only the content associated with the newly selected pathway.

Only one pathway should be visible at any given time.
