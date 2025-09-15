# PROJECT-PLAN.md

## Overview
This document provides a detailed project plan for Astro Planner, including requirements, architecture, dependencies, daily goals, and a realistic timeframe for each phase. Use this as your daily reference to stay on track and measure progress.

---

## Dependencies & Setup
- Secure API keys/contracts: Astrology API, Geocoding/Timezone, (later) OpenAI/LLM, Print partner
- Set up accounts: Apple/Google/email auth, cloud storage
- Choose tech stack: React Native/Flutter (mobile), backend (Python/Node/other)
- Install dev tools: IDE, version control, mobile/web emulators, PDF tools
- Establish repo structure: modular folders for each phase/module
- Set up analytics and feedback pipeline (stub to start)

---

## Phase Breakdown & Daily Goals

### Phase 1: MVP (Core, Page 1, Accounts, PDF, Accessibility, Analytics, API stubs)
**Timeframe:** 4–6 weeks (20–30 days)

- Week 1: Project setup, repo, dev tools, basic UI skeleton, PDF export stub
- Week 2: Account creation (email/Apple/Google), local storage, cloud sync
- Week 3: Horoscope, Focus, Tasks UI, accessibility (complete), analytics events, feedback form, AI archetype assignment and Daily Core capsule integration
- Week 4: API stubs, feature flags, printer-friendly PDF, mobile testing, bugfixes
- Week 5–6: Polish, test, documentation, user feedback

**Daily Goals Example:**
- Set up repo and folder structure
- Implement sign-in screen
- Build Today/Week/Month navigation
- Add PDF export button
- Add analytics event for app open
- Test accessibility (font size, contrast, labels, roles) (complete)
- Implement sharded memory for AI assistant
- Add archetype assignment logic to Profile form
- Integrate AI-generated Daily Core capsule and tone adaptation in Horoscope section
- Implement basic AI assistant responses (archetype-based, daily capsule)

---

### Phase 2: Witch Package
**Timeframe:** 3–4 weeks (15–20 days)

- Week 1: Witch-type helper UI (AI-powered, personalized onboarding and ritual guidance), multi-select styles
- Week 2: Ritual Kit/Guide logic (integrates with AI memory for ritual tracking), daily/weekly inventory, notifications
- Week 3: Cross-module hooks (Meals, Goals), paywall, analytics, API integration (Astrology, CMS), AI context-aware suggestions
- Week 4: Polish, test, documentation

**Daily Goals Example:**
- Build conversational helper UI
- Implement ritual kit JSON contract
- Add notification for ritual window
- Gate Page 2 with entitlement check

---

### Phase 3: Meal Planner
**Timeframe:** 3–4 weeks (15–20 days)

- Week 1: Meal Profile UI, plan generator (AI-personalized suggestions), shopping list
- Week 2: Daily meal view, context-aware meals (AI uses archetype/memory), pantry tracking
- Week 3: Cross-module hooks (Kitchen Witch context via AI), notifications, analytics, API integration (recipes), AI context-aware prompts
- Week 4: Polish, test, documentation

**Daily Goals Example:**
- Add meal profile form
- Generate weekly meal plan
- Implement shopping list export
- Show herb correspondences if Witch Package active

---

### Phase 4: Chore Planner
**Timeframe:** 3–4 weeks (15–20 days)

- Week 1: Household Profile UI, support system, pet chores
- Week 2: Chore assignment logic, daily/weekly/monthly views
- Week 3: Cross-module hooks, notifications, analytics, API notes
- Week 4: Polish, test, documentation

**Daily Goals Example:**
- Add household member assignment
- Implement daily chore plan
- Add notification for weekly rollup
- Gate Page 3 left with entitlement check

---

### Phase 5: Goals Package
**Timeframe:** 2–3 weeks (10–15 days)

- Week 1: Goal Profile, Career Profile, capacity scaling
- Week 2: Daily tasks/affirmations, cross-module hooks, notifications
- Week 3: Analytics, polish, test, documentation

**Daily Goals Example:**
- Add goal entry/edit UI
- Implement daily task generator
- Show affirmation based on ritual day
- Gate Goals section with entitlement check

---

### Phase 6: Premium Print Service
**Timeframe:** 2–3 weeks (10–15 days)

- Week 1: Print setup wizard, customization, license agreement
- Week 2: Print job integration, analytics, API notes
- Week 3: Polish, test, documentation

**Daily Goals Example:**
- Build print setup form
- Integrate with print partner API
- Store license acceptance with order
- Add analytics for print order

---

### LLM/OpenAI Integration (Conversational flows)
**Timeframe:** 2–3 weeks (can overlap with other phases)

- Week 1: Set up OpenAI/LLM API, prompt orchestration service
- Week 2: Integrate chat helpers in Witch/Goals modules
- Week 3: Test, privacy review, documentation

**Daily Goals Example:**
- Register for OpenAI API key
- Build prompt/response manager
- Add chat UI to onboarding
- Test LLM-powered suggestions

---

## Daily Goals Schedule (5-Day Work Week, with Time Boxes)

Below is a day-by-day breakdown for each phase, scheduled Monday–Friday, with estimated time boxes for each daily goal. Adjust as needed for your pace or if you complete tasks early/late.

### Phase 1: MVP (6 weeks, 30 workdays)

**Week 1**
- Mon: Set up repo, folder structure, and install dev tools (4h) - complete
- Tue: Initialize mobile/web project, basic navigation (4h) - complete
- Wed: Create Today/Week/Month UI skeleton (4h) - complete
- Thu: Add placeholder for PDF export (3h) - complete
- Fri: Set up version control, push initial commit (2h) - complete

**Week 2**
- Mon: Research and select PDF library/tools (4h) - complete
- Tue: Implement sign-in screen (email) (4h) - complete
- Wed: Add Apple/Google sign-in stubs (3h) - complete
- Thu: Set up local encrypted storage (4h) - complete
    - Add support for sharded memory for AI assistant - complete
- Fri: Set up cloud sync (stub) (3h) - complete

**Week 3**
- Mon: Build Profile (birth data) form (4h) - complete
    - Implement archetype assignment logic for AI assistant - complete
- Tue: Add settings page (3h)
- Wed: Build Horoscope section UI (4h)
    - Integrate AI-generated Daily Core capsule and tone adaptation
- Thu: Build Focus section UI (3h)
- Fri: Build Tasks section UI (3h)

**Week 4**
- Mon: Add accessibility features (font size, contrast) (3h)
- Tue: Add analytics event for app open (2h)
- Wed: Add feedback form (3h)
- Thu: Add API stubs (Astrology, Geocoding) (3h)
- Fri: Implement feature flags for modules (2h)
    - Implement basic AI assistant responses (archetype-based, daily capsule)

**Week 5**
- Mon: Build printer-friendly PDF export (4h)
- Tue: Test PDF output on device (3h)
- Wed: Add dynamic type and tap target checks (3h)
- Thu: Bugfixes and polish (4h)
- Fri: Finalize documentation and README (3h)

**Week 6**
- Mon: User feedback, polish, and prepare for next phase (4h)
- Tue–Fri: Buffer for overflow, review, or early start on next phase (2–4h/day as needed)

### Phase 2: Witch Package (4 weeks, 20 workdays)

**Week 1**
- Mon: Build conversational witch-type helper UI (4h)
- Tue: Implement natal chart context input (3h)
- Wed: Add multi-select witch styles (3h)
- Thu: Build onboarding flow for witch styles/goals (4h)
- Fri: Add ritual window notification logic (3h)

**Week 2**
- Mon: Implement Ritual Kit JSON contract (3h)
- Tue: Build Ritual Guide generator (4h)
- Wed: Build Weekly Inventory Checklist (3h)
- Thu: Add toggle for literature explanations (2h)
- Fri: Add weekly inventory reminder notification (2h)

**Week 3**
- Mon: Integrate cross-module hooks (Meals, Goals) (3h)
- Tue: Add paywall and entitlement checks for Page 2 (3h)
- Wed: Add analytics events (helper, ritual, inventory) (2h)
- Thu: Integrate Astrology API for electional timing (3h)
- Fri: Polish and bugfixes (4h)

**Week 4**
- Mon: Test onboarding and notifications (3h)
- Tue: Finalize documentation (2h)
- Wed: User feedback and review (3h)
- Thu: Polish (3h)
- Fri: Prepare for next phase (2h)

### Phase 3: Meal Planner (4 weeks, 20 workdays)

**Week 1**
- Mon: Build Meal Profile form (restrictions, allergens, etc.) (4h)
- Tue: Add meal type and difficulty selection (3h)
- Wed: Build weekly meal plan generator (4h)
- Thu: Build shopping list generator (3h)
- Fri: Add pantry tracking logic (3h)

**Week 2**
- Mon: Build daily meal view (tea, breakfast, etc.) (4h)
- Tue: Add context-aware meal logic (astro calendar) (3h)
- Wed: Integrate Kitchen Witch context if Witch Package active (3h)
- Thu: Add notification for "Prep tonight for tomorrow’s lunch" (2h)
- Fri: Add shopping list ready notification (2h)

**Week 3**
- Mon: Add cross-module hooks (Goals) (3h)
- Tue: Add paywall and entitlement checks for Page 3 right (3h)
- Wed: Add analytics events (meal plan, pantry, print) (2h)
- Thu: Integrate recipe API (stub) (3h)
- Fri: Polish and bugfixes (4h)

**Week 4**
- Mon: Test meal plan and notifications (3h)
- Tue: Finalize documentation (2h)
- Wed: User feedback and review (3h)
- Thu: Polish (3h)
- Fri: Prepare for next phase (2h)

### Phase 4: Chore Planner (4 weeks, 20 workdays)

**Week 1**
- Mon: Build Household Profile form (rooms, stories, etc.) (4h)
- Tue: Add support system (members, roles) (3h)
- Wed: Add pet chores (3h)
- Thu: Build chore assignment logic (4h)
- Fri: Build daily/weekly/monthly views (4h)

**Week 2**
- Mon: Add Energy of Day and laundry focus logic (3h)
- Tue: Add chores to avoid and shopping check (3h)
- Wed: Add manual reassignment UI (3h)
- Thu: Add notification for weekly rollup (2h)
- Fri: Add per-member reminders (2h)

**Week 3**
- Mon: Add cross-module hooks (Witch, Goals) (3h)
- Tue: Add paywall and entitlement checks for Page 3 left (3h)
- Wed: Add analytics events (chore plan, assignment sheet) (2h)
- Thu: Integrate calendar sync export (stub) (3h)
- Fri: Polish and bugfixes (4h)

**Week 4**
- Mon: Test chore plan and notifications (3h)
- Tue: Finalize documentation (2h)
- Wed: User feedback and review (3h)
- Thu: Polish (3h)
- Fri: Prepare for next phase (2h)

### Phase 5: Goals Package (3 weeks, 15 workdays)

**Week 1**
- Mon: Build Goal Profile form (goals, frequency) (4h)
- Tue: Build Career Profile form (3h)
- Wed: Implement capacity scaling logic (3h)
- Thu: Build daily task generator (4h)
- Fri: Build affirmation generator (3h)

**Week 2**
- Mon: Add cross-module hooks (Witch, Meals, Chores) (3h)
- Tue: Add paywall and entitlement checks for Goals section (3h)
- Wed: Add analytics events (goal, affirmation) (2h)
- Thu: Add notification logic for gentle nudges (2h)
- Fri: Polish and bugfixes (3h)

**Week 3**
- Mon: Test goals and notifications (3h)
- Tue: Finalize documentation (2h)
- Wed: User feedback and review (3h)
- Thu: Polish (3h)
- Fri: Prepare for next phase (2h)

### Phase 6: Premium Print Service (3 weeks, 15 workdays)

**Week 1**
- Mon: Build print setup wizard (date range, modules) (4h)
- Tue: Add cover, binding, size, theme selection (3h)
- Wed: Add week start selection (2h)
- Thu: Add license agreement display and acceptance (2h)
- Fri: Integrate entitlement checks (2h)

**Week 2**
- Mon: Integrate print job API (stub) (3h)
- Tue: Add analytics events (print setup, order) (2h)
- Wed: Add shipping/tracking logic (2h)
- Thu: Add asset pipeline for covers (3h)
- Fri: Polish and bugfixes (3h)

**Week 3**
- Mon: Test print setup and order flow (3h)
- Tue: Finalize documentation (2h)
- Wed: User feedback and review (3h)
- Thu: Polish (3h)
- Fri: Project review and wrap-up (2h)

### LLM/OpenAI Integration (3 weeks, 15 workdays, can overlap)

- Mon: Register for OpenAI API key (2h)
- Tue: Set up LLM integration service (3h)
- Wed: Build prompt/response manager (3h)
- Thu: Add chat UI to onboarding (3h)
- Fri: Integrate LLM helpers in Witch module (3h)
- Mon: Integrate LLM helpers in Goals module (3h)
- Tue: Add privacy and prompt orchestration logic (3h)
- Wed: Test LLM-powered flows (3h)
- Thu: Add analytics for LLM usage (2h)
- Fri: Polish and bugfixes (3h)
- Mon: Finalize documentation (2h)
- Tue: User feedback and review (3h)
- Wed: Polish (3h)
- Thu: Project review (2h)
- Fri: Prepare for future LLM enhancements (2h)

---

## Ongoing
- Review and update documentation after each phase
- Regularly test accessibility and analytics
- Collect and act on user feedback
- Keep dependencies and API keys secure and up to date

---

*Reference this plan each day to set your focus and track progress. Adjust as needed based on learning speed, blockers, or feedback.*
