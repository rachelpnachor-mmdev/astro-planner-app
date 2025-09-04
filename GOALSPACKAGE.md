# GOALSPACKAGE.md

## Overview

The **Goals Package** adds an additional section on **Page 1** (beneath Horoscope/Focus/Tasks) in the app and PDF. It allows users to capture personal and health goals, combine them with a **Career Profile**, and generate realistic daily tasks and affirmations aligned to astro cycles.

* Collects **goals** (e.g., “go to the gym twice a week,” “read 20 minutes daily”).
* Collects **career commitments** (role, hours, commute, workload).
* Generates **approachable daily tasks** that respect the user’s capacity.
* Aligns tasks and affirmations to **astro cycles**.
* Integrates into **Today / This Week / This Month** views and PDF export.

---

## User Flow

1. User unlocks **Goals Package**.
2. Completes **Goal Profile**: enter freeform goals, assign frequency (daily, weekly, custom).
3. Completes **Career Profile**:
   * Job role and field.
   * Average work hours per day/week.
   * Work mode (remote, hybrid, on-site).
   * Commute type and duration.
   * Peak busy days/times.
   * Recurring commitments.
4. Daily generator produces:
   * Up to 3 realistic tasks (from goals, scaled to workload).
   * Daily affirmation linked to goals.
   * Astro context note for energy of the day.
5. User marks tasks complete; progress tracked in weekly/monthly views.
6. Export to PDF includes Horoscope, Focus, Tasks, and Goals section.

---

## User Stories (BDD)

### Goal Profile

**Scenario: capture goals**
**Given** I unlocked the Goals Package,
**When** I enter a goal like “stretch every morning,”
**Then** the app should save it with frequency and status.

**Scenario: edit or complete goals**
**Given** I have goals saved,
**When** I edit or mark one as completed,
**Then** the app should update future tasks accordingly.

### Career Profile

**Scenario: capture commitments**
**Given** I unlocked the Goals Package,
**When** I complete Career Profile,
**Then** I should specify my role, work hours, commute, busy times, and commitments.

**Scenario: align with workload**
**Given** my Career Profile indicates 12-hour shifts,
**When** daily tasks are generated,
**Then** I should only see small approachable tasks on long days,
**And** larger tasks reserved for lighter days.

### Daily Tasks & Affirmations

**Scenario: generate aligned tasks**
**Given** I have active goals and a Career Profile,
**When** I open Today,
**Then** I should see up to 3 tasks aligned with astro cycles and workload.

**Scenario: affirmations**
**Given** I have active goals,
**When** I open Today,
**Then** I should see 1–2 affirmations reinforcing those goals.

### Views

**Scenario: weekly view**
**Given** I tap “This Week,”
**Then** I should see my goals and tasks distributed across the week,
**And** balanced with my workload.

**Scenario: monthly view**
**Given** I tap “This Month,”
**Then** I should see a summary of goals, planned tasks, and completions.

### PDF Export

**Scenario: export with goals**
**Given** I am exporting Today,
**When** the Goals Package is active,
**Then** the PDF should include Horoscope, Focus, Tasks, and a Goals section with tasks, affirmations, and astro context.

---

## Requirements

### Functional

* Goal Profile: add, edit, complete goals with frequency.
* Career Profile: role, hours, commute, busy days, commitments.
* Task generator: produce up to 3 daily tasks, scaled to workload and aligned with astro cycles.
* Affirmations: 1–2 per day tied to goals.
* Views: Today / This Week / This Month.
* Mark daily tasks complete.
* PDF export: add Goals section under Page 1.

### Non-Functional

* Keep tasks short (≤12 words).
* Affirmations concise (1–2 sentences).
* Handle empty goals gracefully (still show astro context).

---

## Data Contracts

### Goal Profile

```json
{
  "goal_profile": {
    "goals": [
      {"text": "Go to the gym twice a week", "frequency": "weekly", "status": "active"},
      {"text": "Read 20 minutes", "frequency": "daily", "status": "completed"}
    ]
  }
}
```

### Career Profile

```json
{
  "career_profile": {
    "role": "Software Engineer",
    "hours_per_week": 45,
    "work_mode": "hybrid",         // "remote" | "hybrid" | "on_site"
    "commute": {"type": "train", "minutes": 30},
    "busy_days": ["monday", "tuesday"],
    "commitments": ["Sprint planning", "Code reviews"]
  }
}
```

### Daily Goals JSON

```json
{
  "goals": {
    "tasks": ["Stretch 5 min", "Read 10 pages"],
    "affirmations": ["I balance effort with rest.", "I create steady progress."],
    "astro_context": "Moon in Virgo favors small, consistent habits."
  }
}
```

---

## Career Profile & Capacity Scaling
- Career Profile required for all users.
- Capacity scaling rules: ≤3 tasks/day; ≤1 on heavy-work days.

## Notifications
- Gentle nudge windows based on workload and astro energy.

## Cross-Module Integration
- Witch: generate goal-aligned affirmations on ritual days.
- Meals/Chores: convert some goal items into tiny tasks when bandwidth allows (e.g., "prep oats 5 min", "wipe sink 1 min").

## Monetization
- Entitlement check gates Page-1 Goals section.

## Analytics
- Goal Added/Completed.
- Daily Goal Task Completed.
- Affirmation Shown.
