# Tier THREE: Personalized Intervention

I am building an interactive literacy intervention flowchart. The visual design, layout, colours, and general functionality already exist. Focus on recreating the decision-making process and content exactly as described below.

Preserve all wording exactly as written. Do not change terminology or alter instructional language.

## Entry Information

There is no checklist at the beginning of Tier Three.

The user should be presented with the entry information below and then acknowledge that they have reviewed it before proceeding.

### Entry:

- Below benchmark DIBELS composite scores.
- Minimum of two 8-week periods of Tier 2 interventions.
- Minimal progress in Tier 2 interventions, as measured by DIBELS benchmark and UFLI progress monitoring.
- Reading related diagnosis (e.g. specific learning disability in reading, i.e., dyslexia) OR on list for potential diagnosis.

### Group Information:

- 1-3 students per group.
- Intervention provided by a teacher trained in structured literacy and administrators of direct instruction.
- Students work towards individualized goals (up to 3) created by the intervention teacher and recorded in the Student-Specific Plan.
- Students receive specialized instruction based on their specific goals.
- 25 minute sessions, 4-5 times/week minimum.
- Students with attendance impacting their ability to receive 4-5 lessons/week may be discontinued and placed back in Tier 2 intervention at the administrator's discretion.

### Progress Monitoring:

- Interventions are implemented for a minimum of 8 weeks.
- Progress monitoring completed weekly.
- Divisional universal progress monitoring completed at 8-week mark.

### Collaboration:

- Parents notified via letter that student will be receiving Tier 3 interventions.
- Team members share progress monitoring results at school-based meetings.
- Team members consult and collaborate with the School Psychologist, Speech-Language Pathologist, and Occupational Therapist.

After reviewing this information, the user proceeds into the Tier Three intervention process.

## Step 1: Drill Down Assessment

Use the menu below to find and administer a drill down assessment that aligns with the needs of your students, as determined by the literacy screener.

## Step 2: 8-week Intervention

Use the menu below to find an appropriate intervention, and administer for an 8-week period. Monitor student response to intervention weekly.

## Step 3: Progress Monitoring

After the 8-week period, administer the regularly scheduled progress monitoring literacy screener (DIBELS, CTOPP-2, THaFol, IDAPEL).

After Progress Monitoring, the user must choose one of the following outcomes.

### Option A: Instruction Effective

(Subtest result Blue or Green)

### Option B: Instruction Ineffective

(Subtest result Yellow or Red)

---

## Route A: Instruction Effective

### Step 4: Success!

Consider fading supports to Tier 1 and monitor.

This route ends here.

---

## Route B: Instruction Ineffective

### Step 4: Meet with Clinicians

Meet with the appropriate clinicians to discuss next steps.

This route ends here.

---

# Flow Logic

```text
Entry Information
↓
Confirm information reviewed
↓
Step 1
Drill Down Assessment
↓
Step 2
8-week Intervention
↓
Step 3
Progress Monitoring
↓
Instruction Effective?
├─ Yes
│
│  Step 4: Success!
│  Consider fading supports to Tier 1 and monitor.
│  END
│
└─ No

   Step 4: Meet with Clinicians
   Meet with the appropriate clinicians to discuss next steps.
   END
```

Only two routes exist in Tier Three.

If a user changes a previous decision, remove all content associated with the previously selected pathway and display only the currently selected pathway.

Only one pathway should be visible at any given time.
