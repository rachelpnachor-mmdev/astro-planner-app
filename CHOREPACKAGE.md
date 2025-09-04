# CHOREPACKAGE.md

## Overview

This phase adds the **Chore Planner** module and unlocks **Page 3 (left column: Chores)** in the app and PDF. It becomes a comprehensive **household management system**, designed to capture **all details of home upkeep and mental load**.

* **Included**:
  * Detailed Household Profile (rooms, stories, flooring, windows, coverings, decorating, repairs, pest control, own/rent).
  * Support system input (partner, children, division of chores).
  * Assign chores directly to specific household members (not auto-balanced).
  * Expanded chore categories: indoor_large, indoor_small, outdoor_large, outdoor_small, lawn, house_plants, pets.
  * Daily chore plan aligned to astro cycles.
  * Daily context: Energy of the Day, chores to avoid, laundry focus, shopping check.
  * In-app views (Today, This Week, This Month) + PDF export with printable assignment sheet.
* **Excluded in this phase**: Physical Health module, premium print service, payments (stub unlock).

---

## User Flow

1. User unlocks **Chore Planner** (stubbed).
2. Completes **Household Profile**, which prompts for:
   * General: own/rent, number of stories, stair details (flooring, railing).
   * Each room: type (bedroom, kitchen, master suite, walk-in closet, living area), flooring, number of windows, coverings, furniture.
   * Outdoor: yard, patio, balcony, pool, fencing, driveway, garage.
   * Lawn care needs (mowing, edging, irrigation).
   * House plants (count/types).
   * Pets (species, tasks like feeding, litter, walks, grooming, vet visits).
   * Maintenance: decorating projects, repairs needed, pest control (service vs self).
   * Support system: list household members, roles, and what chores each is responsible for.
3. App generates **Weekly Chore Plan**, aligning each member’s **assigned chores** with astro cycles.
4. Daily plan shows Energy of the Day, chores by category, laundry focus, avoid list, shopping check.
5. User can mark chores complete, skip, or reassign to another member (manual only).
6. PDF export includes **Page 1 + Page 2 (if unlocked) + Page 3 (Chores left + Meals right)** and an **assignment sheet**.

---

## User Stories (BDD)

### Household Profile

**Scenario: capture household details**
**Given** I unlocked Chore Planner,
**When** I complete Household Profile,
**Then** I should be asked for details about each space (rooms, floors, windows, coverings, furniture, projects, repairs).

**Scenario: record upkeep context**
**Given** I’m completing my Household Profile,
**When** I’m asked about upkeep,
**Then** I should specify own/rent, pest control approach, decorating or repair projects.

**Scenario: pets**
**Given** I have pets,
**When** I set up my Household Profile,
**Then** I should add each pet and its chores (feeding, litter, walks, grooming, vet),
**And** be able to assign them to household members.

**Scenario: support system assignments**
**Given** I live with others,
**When** I complete my profile,
**Then** I should list household members and assign which chores each person is responsible for,
**And** assignments should persist unless I manually edit them.

### Weekly Planning

**Scenario: generate weekly plan**
**Given** my Household Profile and assignments are saved,
**When** I generate a weekly plan,
**Then** chores should be scheduled based on astro cycles,
**But** responsibility should remain fixed to the assigned member.

### Daily View – Page 3 (left column)

**Scenario: see daily chores**
**Given** I open Today,
**Then** I should see:
* Energy of the Day (astro explanation)
* To-Do: indoor_large, indoor_small, outdoor_large, outdoor_small, lawn, house_plants, pets
* Laundry focus
* Chores to avoid
* Shopping check
* Which household member is responsible for each item

**Scenario: reassign manually**
**Given** I view Today’s chores,
**When** I reassign one,
**Then** the app should update responsibility to the new member.

### Views

**Scenario: weekly view**
**Given** I tap “This Week,”
**Then** I see chores by day with household member assignments.

**Scenario: monthly view**
**Given** I tap “This Month,”
**Then** I see chore themes aligned to astro cycles,
**And** assignments shown per member.

### PDF Export

**Scenario: export with chores & assignments**
**Given** Chore Planner is unlocked,
**When** I export Today,
**Then** the PDF includes Page 3 left column with chores, energy notes, laundry focus, shopping check,
**And** an **assignment sheet** showing which chores belong to which household members.

---

## Requirements

### Functional

* Household Profile: detailed prompts (rooms, stories, windows, repairs, pest control, own/rent).
* Support system: add members, assign chores directly (fixed responsibility).
* Pets: add pets, define chores, assign to members.
* Chore categories: indoor_large, indoor_small, outdoor_large, outdoor_small, lawn, house_plants, pets.
* Weekly plan: align assigned chores with astro cycles (timing, not responsibility).
* Daily plan: Energy of Day, to-do (with assignments), laundry, avoid, shopping check.
* Reassign chores manually.
* Views: Today / This Week / This Month.
* PDF export: Page 3 left column + assignment sheet.

### Non-Functional

* Chore descriptions ≤12 words.
* Printer-friendly PDF layout; consistent fonts.
* Graceful handling when a category is empty (e.g., no pets).

---

## Data Contracts

### Support System

```json
{
  "support_system": {
    "members": [
      {
        "name": "Rachel",
        "role": "primary",
        "assigned_chores": ["indoor_large", "laundry"]
      },
      {
        "name": "Chris",
        "role": "partner",
        "assigned_chores": ["outdoor_large", "lawn", "repairs"]
      },
      {
        "name": "Stan",
        "role": "child",
        "assigned_chores": ["pets"]
      }
    ]
  }
}
```

### Daily Chores JSON

```json
{
  "chores": {
    "energy_of_day": "Capricorn Moon favors structure and visible progress.",
    "to_do": {
      "indoor_large": {"task": "Vacuum upstairs carpets", "assigned_to": "Rachel"},
      "indoor_small": {"task": "Wipe bathroom sink", "assigned_to": "Rachel"},
      "outdoor_large": {"task": "Power wash patio", "assigned_to": "Chris"},
      "outdoor_small": {"task": "Sweep porch", "assigned_to": "Chris"},
      "lawn": {"task": "Mow front yard", "assigned_to": "Chris"},
      "house_plants": {"task": "Water succulents", "assigned_to": "Rachel"},
      "pets": {"task": "Walk Bella", "assigned_to": "Stan"}
    },
    "laundry_focus": "Bedding & towels",
    "avoid": ["Painting projects", "Heavy lifting"],
    "shopping_check": "Check dish soap and trash bags"
  }
}
```

---

## Acceptance Criteria

* [ ] Users can input detailed Household Profile (rooms, repairs, pest control, etc.).
* [ ] Users can add pets + assign their chores.
* [ ] Users can add household members + assign chores directly.
* [ ] Weekly plans align chores with astro cycles (timing), but respect fixed assignments.
* [ ] Daily chores show all required fields and who is responsible.
* [ ] Users can manually reassign chores.
* [ ] PDF export includes Page 3 left + assignment sheet.
* [ ] Missing categories handled gracefully.

---

## Out of Scope (Phase 4)

* Physical Health module.
* Premium print service.
* Payments.

---

## Fixed Assignments & Notifications
- Chore assignments are fixed (not auto-balanced).
- Per-member reminders (respect quiet hours).
- Weekly rollup notification.

## Cross-Module Integration
- Witch: schedule water/air/fire/earth chores by element day.
- Goals: surface "declutter 10 min" on light-workload days.

## Monetization
- Entitlement check gates Page 3 (left) and printable assignment sheet.

## Analytics
- Chore Plan Generated.
- Chore Completed/Skipped/Reassigned.
- Assignment Sheet Printed.

## API Notes
- Optional calendar sync export (ICS) planned for later; not required now.
