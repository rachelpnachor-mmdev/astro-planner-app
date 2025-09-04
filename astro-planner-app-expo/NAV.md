## Overview

Defines the navigation system for the Astro Planner mobile app. Navigation is consistent for all users (free + paid). Packages expand or lock content, but tabs and order never change.

---

## Bottom Navigation

### Structure

* 5 static tabs, always visible:

  * 🌙 Horoscope
  * 🔮 Rituals
  * 🍲 Kitchen & Home
  * 🎯 Goals
  * 📖 Reflections

### Behavior

* Tabs show **icon only** by default.
* The **active tab** expands to show icon + label text.
* Order of tabs never changes based on subscription.
* App always opens to 🌙 Horoscope.

---

## Tab Content & Scrolling

### 🌙 Horoscope (default landing)

Sections (scrollable):

1. Today/Week/Month toggle (segmented control)
2. Transit Summary
3. Focus of the Day (Do/Don’t/Opportunities/Warnings)
4. Task List
5. Creative Flow (locked unless Goals Package)
6. Upcoming Events

### 🔮 Rituals

Sections (scrollable):

1. Daily Kit (checklist)
2. Ritual Guide (step-by-step)
3. Weekly Inventory (locked unless Witch Package)
4. Notes/Adaptations

### 🍲 Kitchen & Home

Sections (scrollable):

* **Chores** (Indoor Large, Indoor Small, Outdoor, Laundry, Plants, Projects)
* **Meals** (Lunch, Dinner, Snacks/Tea, Shopping List)
* If user has only one package (Kitchen or Chores), that section is unlocked and the other is locked with Upgrade CTA.

### 🎯 Goals

Sections (scrollable):

1. Daily Goal Tasks
2. Affirmation of the Day
3. Family Routines (e.g., game night, movie night)
4. Witchy Goals (themes like Protection, Healing, Abundance)
5. Career Context

### 📖 Reflections

Sections (scrollable):

1. Prompt 1
2. Prompt 2
3. Lined Journal Space
4. Extra prompts (if packages active, e.g. ritual/goal reflections)

---

## Free vs. Paid Behavior

* Free users: Rituals, Kitchen & Home, and Goals tabs show teaser/lock state with Upgrade CTA.
* Paid users: Unlocked package tabs show full content.
* Mixed Kitchen & Home: one side unlocked, the other side locked with Upgrade CTA.

---

## Hamburger Menu (Top Right)

### Always Accessible

* Profile: edit birth info, notifications, household members, plants, onboarding data.
* Your Package: view active modules, manage subscription.
* Upgrade: view locked modules, pricing, and purchase.

---

## General Rules

* App always launches on 🌙 Horoscope tab.
* Scroll position is preserved when switching between tabs.
* Navigation bar stays fixed at bottom across orientations.

---

## Acceptance Criteria

* [ ] 5 static bottom nav tabs (Horoscope, Rituals, Kitchen & Home, Goals, Reflections).
* [ ] Active tab expands to icon + label, inactive tabs remain icons.
* [ ] Each tab scrolls vertically through defined sections.
* [ ] Free users see teasers/locks for paid content.
* [ ] Paid users see unlocked content per module.
* [ ] Mixed Kitchen & Home shows partial unlock.
* [ ] Hamburger menu shows Profile, Your Package, Upgrade.
* [ ] App launches on Horoscope.
* [ ] Scroll position preserved across tabs.
