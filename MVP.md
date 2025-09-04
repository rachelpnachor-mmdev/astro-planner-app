# 📖 README – MVP (Free Tier)

## Overview

The MVP delivers a **single in-app daily view** (equivalent to “Page 1 in print”) plus a **1-page PDF export**.

* **Included**: onboarding to collect **birth data**, daily **transit summary**, **upcoming events**, **focus of the day**, and **task list**.
* **Excluded in MVP**: Creative Flow (requires goals), Pages 2–4 (rituals, chores/kitchen, reflection), premium print service, and paid modules.

---

## User Flow

1. User opens app → prompted for **birth date & time** (with “unknown time” option) and **birth place**.
2. Profile is saved locally.
3. App generates **Today** (transit summary, events, focus, tasks).
4. User can switch between **Today / This Week / This Month**.
5. User can **export Today** as a 1-page PDF.

---

## User Stories (BDD)

### Onboarding

**Scenario: prompt for birth data**
**Given** I am a new user,
**And** I open the app for the first time,
**When** the app loads,
**Then** I should be asked to enter my **birth date** and **birth time**.

**Scenario: unknown birth time**
**Given** I don’t know my exact birth time,
**When** I toggle “I don’t know,”
**Then** the app should default to a **solar chart** (12:00 PM local) with a note about reduced precision.

**Scenario: location lookup**
**Given** I start typing my birth city,
**When** I select a suggestion,
**Then** the app stores latitude/longitude and timezone for chart calculation.

**Scenario: save profile data**
**Given** I have entered my birth date, time, and place,
**When** I tap “Save,”
**Then** my profile should be stored locally,
**And** the app should use this profile to generate my daily view.

### Daily View (Page 1 in-app)

**Scenario: see personalized day**
**Given** my profile is saved,
**When** I open the app on a given day,
**Then** I should see:

* Transit summary (bullets)
* Upcoming events (Morning / AM window / All day / Background)
* Focus of the day (Do’s, Don’ts, Opportunities, Warnings)
* Task list (3–5 practical actions)
  **And** the header shows Date (L), Moon emoji + phase (C), Day planet (R).
  **And** the footer shows *✦ As above, so below ✦* in gray italic.

**Scenario: graceful missing data**
**Given** some fields are empty,
**When** the daily view renders,
**Then** missing sections are **skipped gracefully** without layout errors.

### Switch Views

**Scenario: switch to weekly view**
**Given** I am on the daily view,
**When** I tap “This Week,”
**Then** I should see a **weekly transit summary** and **weekly upcoming events**.

**Scenario: switch to monthly view**
**Given** I am on the daily view,
**When** I tap “This Month,”
**Then** I should see a **monthly transit summary** and **monthly upcoming events**.

### PDF Export

**Scenario: export the daily page**
**Given** I am viewing today’s page,
**When** I tap **Export PDF**,
**Then** I get a **1-page PDF** with the same sections and header/footer styling as in-app.

---

## Requirements

### Functional

* Onboarding form: birth date, time (with “unknown” toggle), place (autocomplete).
* Save minimal profile locally.
* Generate **Daily JSON** (via stubbed astro logic).
* Render in-app **Daily View** with Page 1 sections (no Creative Flow).
* Switch between **Today / This Week / This Month** for transit summary + upcoming events.
* Export a **1-page PDF** of Today.

### Non-Functional

* PDF: Letter 8.5×11, ~0.5" margins, printer-friendly.
* Fonts: **DejaVuSans** (regular/bold/italic) + **Symbola** (moon emoji).
* Accessibility: ≥12pt body text in PDF, scalable text in app.
* Handle missing data gracefully.

---

## Data Contracts

### Profile (local)

```json
{
  "profile": {
    "birth_date": "YYYY-MM-DD",
    "birth_time": "HH:MM",
    "birth_time_unknown": true,
    "birth_place": "City, Country",
    "birth_lat": 0.0,
    "birth_lng": 0.0,
    "birth_tz": "Region/City"
  }
}
```

### Daily JSON (MVP Page 1 only)

```json
{
  "date": "YYYY-MM-DD (Weekday)",
  "moon_phase_sign": "Waxing/Waning/New/Full in <Sign>",
  "day_planet": "Planet (Weekday)",
  "horoscope": {
    "transit_summary": ["…"],
    "upcoming_events": [
      {"when": "Morning", "text": "…"},
      {"when": "AM window", "text": "…"},
      {"when": "All day", "text": "…"},
      {"when": "Background", "text": "…"
    ],
    "focus_of_day": {
      "dos": ["…"],
      "donts": ["…"],
      "opportunities": ["…"],
      "warnings": ["…"]
    },
    "task_list": ["…"]
  }
}
```

---

## Acceptance Criteria

* [ ] New users are asked for birth date & time on first open.
* [ ] Users can toggle “unknown time” → defaults to solar chart.
* [ ] Users can select a birth city from lookup.
* [ ] Users can save profile data locally.
* [ ] Daily view displays Page 1 sections.
* [ ] User can switch between **Today / This Week / This Month**.
* [ ] Export creates a 1-page PDF of Today.
* [ ] Missing data does not break layout.

---

## Out of Scope (MVP)

* Creative Flow (requires goals).
* Ritual kit, Chores/Kitchen, Reflection.
* Paid subscriptions, premium print service.
* Calendar integration and notifications.

---

## Mobile App Scope
- Target platforms: iOS and Android.
- Offline-first daily cache for all planner data.
- Printer-friendly 1-page export remains available (free).

## Accounts & Persistence
- Sign-in: email, Apple, Google.
- Local encrypted store for Profile (birth data), settings, and Today/Week/Month cache.
- Cloud sync for all persistent data.

## Analytics & Feedback (Baseline)
- Events: App Open, Sign Up, Onboarding Completed, Daily View Shown, PDF Export Tapped, Feedback Submitted.
- Simple in-app feedback form for user suggestions/bugs.

## Accessibility Baseline
- Minimum font size: 12pt/16sp.
- Dynamic type support.
- Tap targets ≥44pt.
- High contrast mode.
- Voice-over labels for all Page-1 elements.

## API Integration Stubs
- Astrology API (transits): stubbed in MVP, real keys wired later.
- Geocoding/Timezone (birth place): stubbed in MVP.

## Feature Flags
- Module gates (witch/meals/chores/goals) set to OFF in MVP.
