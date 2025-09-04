# WITCHPACKAGE.md

## Overview

This phase adds the **Witch Package** module. It unlocks **Page 2 (Ritual Kit)** in both the in-app view and the PDF export.

* **Included**:
  * Interactive witch-type helper (conversation + natal chart context).
  * Multi-select **witch styles** (user can blend types).
  * User onboarding flow for witch style(s) + magical goals.
  * Daily Ritual Kit **and** step-by-step Ritual Guide.
  * Weekly ritual inventory checklist, with optional explanatory literature for each item.
  * User ability to edit/complete goals so daily context stays current.
  * Weekly start-day preference (calendar-based or lunar cycle).
* **Excluded in this phase**: Meal Planner, Chore Planner, Physical Health, Premium Print Service.

---

## User Flow

1. Existing user unlocks **Witch Package** (stubbed purchase in this phase).
2. App offers **witch-type helper** (guided Q&A + natal chart inputs).
3. User selects **one or more witch styles**.
4. User enters **magical goals**.
5. Each day:
   * App generates **Ritual Kit** (items, correspondences) contextualized by witch styles + goals.
   * App generates **Ritual Guide** (step-by-step instructions).
6. Each week:
   * App generates **Weekly Inventory Checklist**, starting on user’s chosen day.
   * Checklist can include or hide **explanatory literature** (toggle by experience level).
7. User can edit or mark goals as complete → daily context updates.
8. Export to PDF includes **Page 1 (Horoscope)** + **Page 2 (Ritual Kit + Guide)**.

---

## User Stories (BDD)

### Witch Type Helper

**Scenario: discover witch styles**
**Given** I have unlocked the Witch Package,
**When** I start setup,
**Then** the app should offer a **witch-type helper** that asks questions about my practice,
**And** uses my natal chart as context,
**And** lets me **select multiple witch styles** (e.g., Lunar + Kitchen).

**Scenario: blended context**
**Given** I have selected multiple witch styles,
**When** my Ritual Kit and Ritual Guide are generated,
**Then** the content should blend correspondences and practices from all selected styles.

### Witch Profile

**Scenario: set magical goals**
**Given** I have saved my witch styles,
**When** I enter my magical goals,
**Then** those goals should be saved,
**And** applied to my daily Ritual Kit and Guide.

**Scenario: edit or complete goals**
**Given** I have existing magical goals,
**When** I edit or mark a goal as complete,
**Then** the app should update my daily Ritual Kit context accordingly.

### Daily Ritual Kit & Guide

**Scenario: see ritual kit and guide**
**Given** my witch styles and goals are saved,
**When** I view today’s plan,
**Then** I should see a **Ritual Kit** (items with correspondences),
**And** a **Ritual Guide** (step-by-step instructions using those items).

**Scenario: toggle literature details**
**Given** I am viewing my Ritual Kit,
**When** I toggle “Show Explanations,”
**Then** I should see descriptions of each item’s purpose,
**And** when toggled off, I should see only the item list.

### Weekly Inventory

**Scenario: weekly checklist with start-day preference**
**Given** I have unlocked the Witch Package,
**When** I choose my weekly start day (calendar Sunday/Monday or lunar cycle),
**Then** the Weekly Inventory Checklist should generate accordingly.

**Scenario: include item literature**
**Given** I am viewing my Weekly Inventory,
**When** I toggle “Show Explanations,”
**Then** I should see literature about each item’s purpose,
**And** when toggled off, I should see only the supply list.

### PDF Export

**Scenario: export with ritual kit and guide**
**Given** I am viewing today’s plan,
**When** I export as PDF,
**Then** the file should contain:
* Page 1: Horoscope + Focus
* Page 2: Ritual Kit + Ritual Guide (multi-style blended).

---

## Requirements

### Functional

* Witch-type helper (guided Q&A + natal chart context).
* Multi-select witch styles.
* Add **witch profile** to user data (styles + goals, editable/completable).
* Generate **Ritual Kit JSON** and **Ritual Guide JSON** each day (style- and goal-aware).
* Generate **Weekly Inventory JSON** with start-day preference.
* Toggle for including explanatory literature in Kit/Inventory.
* Extend PDF export to add Page 2 (Kit + Guide).

### Non-Functional

* PDF still Letter 8.5×11, margins ~0.5".
* Fonts: DejaVuSans + Symbola.
* Graceful handling of missing ritual data.

---

## Data Contracts

### Witch Profile

```json
{
  "witch_profile": {
    "witch_styles": ["lunar", "kitchen"],
    "goals": [
      {"text": "protection", "status": "active"},
      {"text": "clarity", "status": "completed"}
    ],
    "weekly_start": "lunar"
  }
}
```

### Ritual Kit JSON

```json
{
  "rituals": {
    "checklist": {
      "candle": "Gold or white",
      "oil": "Peace & Protection",
      "crystal": "Smoky quartz",
      "herb_incense": "Rosemary",
      "extras": ["Singing bowl"]
    },
    "literature": {
      "candle": "Represents focus and illumination.",
      "oil": "Used for grounding and protection."
    },
    "context_styles": ["lunar", "kitchen"]
  }
}
```

### Ritual Guide JSON

```json
{
  "ritual_guide": {
    "steps": [
      "Light the gold or white candle to call clarity.",
      "Anoint crystal with Peace & Protection oil.",
      "Burn rosemary incense while focusing on intent.",
      "Use singing bowl to seal the ritual."
    ],
    "context_styles": ["lunar", "kitchen"]
  }
}
```

### Weekly Inventory JSON

```json
{
  "weekly_inventory": {
    "start_day": "lunar",
    "items": {
      "candles": ["white", "gold"],
      "oils": ["Peace & Protection"],
      "crystals": ["smoky quartz"],
      "herbs_incense": ["rosemary"],
      "extras": ["singing bowl", "matches"]
    },
    "literature": {
      "smoky quartz": "Grounds energy and absorbs negativity."
    },
    "context_styles": ["lunar", "kitchen"]
  }
}
```

---

## Acceptance Criteria

* [ ] Users can use a helper to determine witch styles.
* [ ] Users can **multi-select witch styles**, not just one.
* [ ] Ritual Kit + Guide incorporate blended context from all selected styles.
* [ ] Users can set, edit, or complete magical goals.
* [ ] Users can toggle literature explanations on/off in both daily and weekly views.
* [ ] Weekly Inventory honors user’s chosen start day.
* [ ] Exported PDF includes Page 1 (Horoscope) + Page 2 (Kit + Guide, multi-style blended).
* [ ] Missing ritual elements are skipped gracefully.

---

## Out of Scope (Phase 2)

* Meal Planner, Chore Planner, Physical Health.
* Paid infrastructure (stub unlock toggle only).
* Premium print service.

---

## Notifications
- Ritual window reminders (start/stop).
- Weekly inventory reminder.
- All notifications respect user quiet hours.

## Cross-Module Integration Hooks
- If Meal Planner present: show kitchen correspondences automatically, share herb inventory.
- If Goals present: surface ritual-aligned micro-task/affirmation.

## Monetization
- Paywall states and purchase/restore flows (stub acceptable).
- Entitlement checks gate Page 2 and literature toggles.

## Analytics
- Witch Type Helper Started/Completed.
- Goal Added/Edited/Completed.
- Ritual Kit Viewed.
- Ritual Performed.
- Inventory Checked.

## API Notes
- Astrology API for electional timing windows.
- Optional content CMS for literature blurbs.
