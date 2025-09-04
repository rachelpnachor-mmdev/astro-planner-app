# MEALPLAN.md

## Overview

This phase adds the **Meal Planner** module and unlocks **Page 3 (right column: Kitchen / Meals)** in the app and PDF.

* **Included**:
  * Meal Profile setup (restrictions, allergens, dislikes, cuisines, budget, servings, meal types, difficulty).
  * Weekly meal plan + aggregated shopping list.
  * Daily plan (tea, breakfast, lunch, dinner, snack prep) with prep steps & cooking instructions.
  * Context-aware:
    * **Astro calendar** for all users (meals aligned to energy of day/week).
    * **Manifestations/Releases/Castings** for Witch Package users (meals reinforce ritual context).
  * If user also has **Witch Package**, Kitchen Witch layer is **auto-enabled** (no toggle).
  * Ability to adjust plan difficulty or meal selection → prompt to accept regenerated plan (reuse ingredients).
  * Shopping list printable/exportable separately.
  * Page 3 integrated in app and PDF export.
* **Excluded in this phase**: Chore Planner (Page 3 left), Physical Health, Premium Print Service, payments (stubbed unlock).

---

## User Flow

1. User unlocks **Meal Planner** (stubbed).
2. Completes **Meal Profile**:
   * Dietary restrictions, allergens, dislikes, cuisines.
   * Weekly budget, household servings.
   * Meal types to plan for (e.g., Breakfast only, or Breakfast + Dinner).
   * Preferred difficulty (one-pot, moderate, from-scratch).
   * Pantry basics.
   * Week start (Sunday/Monday or lunar week).
3. App generates **Weekly Meal Plan + Shopping List**.
4. User can print/export the shopping list.
5. Each day: app shows **only selected meals** with steps + timing cues.
6. User can adjust difficulty or meal type selection at any time → app prompts to accept a new plan.
7. If Witch Package is active, Kitchen Witch context auto-enables (ingredient correspondences shown inline, meals aligned with manifestations/releases).
8. PDF export includes **Page 1 + Page 2 (if unlocked) + Page 3 (Meals)**.

---

## User Stories (BDD)

### Meal Profile

**Scenario: select meals to plan**
**Given** I am in Meal Profile,
**When** I select which meals I want planned (e.g., Breakfast only),
**Then** only those meals should generate daily.

**Scenario: set meal difficulty**
**Given** I am in Meal Profile,
**When** I choose a difficulty (one-pot, moderate, from-scratch),
**Then** the plan should align to that difficulty.

**Scenario: adjust profile mid-week**
**Given** I already have a weekly plan,
**When** I change meal difficulty or meal types,
**Then** the app should prompt me to accept a **new plan** using existing ingredients.

### Weekly Planning

**Scenario: generate weekly plan & list**
**Given** my Meal Profile is saved,
**When** I tap “Generate Week,”
**Then** I should see a 7-day plan and a grouped shopping list.

**Scenario: print shopping list**
**Given** a shopping list is generated,
**When** I tap “Print List,”
**Then** I should receive a printable/exportable shopping list (PDF or printer format).

**Scenario: pantry tracking**
**Given** I mark ingredients as “in pantry,”
**Then** they should be removed from the shopping list and budget totals updated.

### Daily View – Page 3 (Meals)

**Scenario: see selected meals**
**Given** I planned only breakfast and dinner,
**When** I open Today,
**Then** I should see only breakfast + dinner with steps and cooking instructions.

**Scenario: context alignment**
**Given** I am a Meal Planner user,
**When** my daily meals generate,
**Then** they should align to the **astro calendar** (e.g., grounding meals on heavy Saturn days).

**Scenario: witch context alignment**
**Given** I am a Witch Package + Meal Planner user,
**When** my daily meals generate,
**Then** ingredients and suggestions should reinforce my **manifestations, releases, or castings** (e.g., rosemary for clarity in a manifestation ritual).

### PDF Export

**Scenario: export with meals**
**Given** I am exporting today’s plan,
**When** Meal Planner is unlocked,
**Then** the PDF includes Page 3 (right column: Meals) with today’s selections, steps, and context notes.

---

## Requirements

### Functional

* Meal Profile: restrictions, allergens, dislikes, cuisines, budget, servings, pantry, **meal types**, **difficulty**, **week start**.
* Weekly Plan generator → 7-day meals + aggregated shopping list.
* Daily Kitchen view → only selected meals with prep & cook steps.
* Profile adjustments regenerate plan with confirmation.
* Shopping list printable/exportable.
* Pantry tracking.
* Kitchen Witch context auto-enabled if Witch Package present.
* Context alignment: astro for all users, ritual context for witches.
* PDF export → Page 3 right.

### Non-Functional

* Keep instructions concise (≤5 steps per recipe).
* Printer-friendly PDF layout; consistent fonts (DejaVuSans + Symbola).
* Graceful handling of missing data (e.g., only tea planned).

---

## Data Contracts

### Meal Profile

```json
{
  "meal_profile": {
    "dietary_restrictions": ["vegetarian", "gluten_free"],
    "allergens": ["peanuts"],
    "dislikes": ["cilantro"],
    "preferred_cuisines": ["mediterranean", "mexican"],
    "weekly_budget": 120,
    "servings": 4,
    "meals_planned": ["breakfast", "dinner"],
    "difficulty": "one_pot",          // "one_pot" | "moderate" | "from_scratch"
    "week_start": "monday",           // "sunday" | "monday" | "lunar"
    "pantry": ["olive oil", "rice", "salt", "pepper"],
    "kitchen_witch_enabled": true     // auto-true if Witch Package active
  }
}
```

### Daily Kitchen JSON

```json
{
  "kitchen": {
    "tea_of_day": "Peppermint + rosemary",
    "breakfast": {
      "name": "Greek yogurt, berries, granola",
      "steps": [
        "Spoon yogurt into bowl.",
        "Top with berries and granola."
      ]
    },
    "dinner": {
      "name": "Sheet-pan tofu, potatoes, green beans",
      "steps": [
        "Preheat oven to 425°F.",
        "Toss ingredients on sheet with oil + seasoning.",
        "Roast 25 min, serve warm."
      ]
    },
    "astro_context": "Grounding meals today (Moon in Capricorn).",
    "witch_context": "Rosemary included for clarity in manifestation work."
  }
}
```

### Shopping List JSON

```json
{
  "shopping_list": {
    "produce": ["lemons", "green beans"],
    "pantry": ["quinoa"],
    "protein": ["tofu"],
    "dairy": ["greek yogurt"],
    "estimated_total": 68.50,
    "printable": true
  }
}
```

---

## Acceptance Criteria

* [ ] Users can select meals (breakfast, lunch, dinner, snack, tea).
* [ ] Users can select meal difficulty.
* [ ] Users can adjust profile mid-week → regenerate plan with prompt.
* [ ] Weekly meal plan & shopping list generate.
* [ ] Shopping list can be printed/exported.
* [ ] Pantry items excluded update totals.
* [ ] Daily view shows only chosen meals with concise steps.
* [ ] Astro calendar context included for all users.
* [ ] Ritual/manifestation context included if Witch Package also active.
* [ ] PDF export includes Page 3 (Meals).
* [ ] Missing data handled gracefully.

---

## Out of Scope (Phase 3)

* Chore Planner (Page 3 left).
* Physical Health module.
* Premium print service.
* Payment integration.

---

## Cross-Module Integration
- Auto-enable Kitchen Witch if Witch Package active; show herb correspondences.
- If Goals active: propose meal-prep tasks as daily goals when bandwidth allows.

## Notifications
- "Prep tonight for tomorrow’s lunch" reminder.
- "Shopping list ready" on week start day.

## Monetization
- Entitlement check gates Page 3 (right) and shopping-list print.

## Analytics
- Meal Plan Generated.
- Meal Replaced.
- Pantry Item Toggled.
- Shopping List Printed.

## API Notes
- Recipe source (internal/partner).
- Optional nutrition tags (no calorie tracking).
