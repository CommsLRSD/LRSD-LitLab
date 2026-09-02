# Tier ONE: Universal Classroom

I am building an interactive literacy intervention flowchart. The visual design, layout, colours, and general functionality already exist. Focus on recreating the decision-making process and content exactly as described below.

Preserve all wording exactly as written. Do not change terminology or alter instructional language.

## Step 1: Principles of Explicit and Systematic Instruction

Display the following as checklist items:

- [ ] Are the lesson goals clearly stated?
- [ ] Is the content presented in digestible, understandable, and logically sequenced steps, as guided by the LRSD Scope and Sequence?
- [ ] Is immediate corrective feedback being provided?
- [ ] Is guided supported practice sufficient to lead the fluent application?
- [ ] Are the activities used to accomplish specific goals?
- [ ] Is there a plan for reteaching when necessary?
- [ ] Is progress being tracked?
- [ ] Does Instruction incorporate the [simple view of reading](https://www.readingrockets.org/topics/about-reading/articles/simple-view-reading)?

After reviewing the checklist, proceed to Step 2.

## Step 2: Literacy Screener

Administer literacy screener.

(DIBELS, CTOPP-2, THaFol, IDAPEL)

The user must select one of the following outcomes.

### Option A: Instruction Effective

(Subtest result Blue or Green)

### Option B: Instruction Ineffective

(Subtest result Yellow or Red)

Display the following note:

> If you chose the Successful or Unsuccessful mistakenly, simply chose the correct option and continue.

---

## Route A: Instruction Effective

### Step 3: Success!

- Continue and monitor with general curriculum

This route ends here.

---

## Route B: Instruction Ineffective

Present a second decision point.

### Option B1

Instruction unsuccessful for 20% or more of students.

### Option B2

Instruction unsuccessful for fewer than 20% of students.

### Route B1 Outcome

Go to

## Tier 2: Small Group Interventions

This route continues into the Tier Two flowchart.

### Route B2 Outcome

## Step 3: Reteach General Curriculum

Consider areas of weakness discovered via Literacy Screener. Use the Interventions Menu below to find resources.

This route remains within Tier One and ends here.

---

# Flow Logic

```text
Step 1
Principles of Explicit and Systematic Instruction
↓
Step 2
Literacy Screener
↓
Instruction Effective?
├─ Yes
│  ↓
│  Step 3: Success!
│  Continue and monitor with general curriculum
│  END
│
└─ No
   ↓
   Instruction unsuccessful for 20% or more of students?
   ├─ Yes
   │  ↓
   │  Tier 2: Small Group Interventions
   │
   └─ No
      ↓
      Step 3: Reteach General Curriculum
      Consider areas of weakness discovered via Literacy Screener.
      Use the Interventions Menu below to find resources.
      END
```

Whenever a user changes a previous decision, remove all content associated with the previous pathway and display only the content associated with the newly selected pathway.

Only one pathway should be visible at any given time.
