# Astro Planner Navigation Implementation Plan (NAVPLAN.md)

This document provides a step-by-step plan for implementing the navigation architecture described in NAVARCH.md for the Astro Planner mobile app.

---

## Step 1: Project Setup (complete/passed)
- Ensure all navigation and Expo dependencies are installed (see package.json).
- Confirm folder structure for components, screens, navigation, and context.
- Remove default Expo Router navigation and set custom navigation as the app entry point.

### Test Plan
- Verify all required dependencies are present in package.json and installed without errors.
- Check that the folder structure matches the suggested architecture.
- Run `expo start` to confirm the project boots successfully.
- Confirm only custom navigation is rendered (no Expo Router tabs).

---


## Step 2: Create Navigation Structure (complete/passed)
- Set up `BottomTabs.tsx` using `@react-navigation/bottom-tabs`.
- Implement a custom tab bar in `components/CustomTabBar.tsx` for 5 static tabs: Horoscope, Rituals, Kitchen & Home, Goals, Reflections.
- Tab bar uses emojis for navigation tabs instead of icons, matching the design vision.
- Tab bar uses flexible widths for elegant spacing; active tab expands to fit label, inactive tabs remain compact.
- "Kitchen & Home" label breaks after the "&" for improved layout.
- Only one emoji per tab; label appears to the right of the emoji for the active tab.
- Set Horoscope as the initial route.

### Test Plan
- Confirm 5 tabs are always visible and in correct order.
- Verify only the active tab shows label text to the right of the emoji; others show emoji only.
- Ensure app launches on Horoscope tab every time.
- Test tab switching and tab bar behavior on different devices/orientations.
- Confirm "Kitchen & Home" label breaks after "&".
- Check for smooth transitions and balanced tab bar layout.

---

## Step 3: Scaffold Tab Screens (Horizontal Paging) (complete/passed)
- For each tab, create a horizontally scrollable (left-right) pager or carousel for sections, not a vertical scroll.
- Each section is a full-width page the user can swipe between.
- Use a horizontal ScrollView, FlatList with paging, or a pager library for best UX.
- Scaffold the following sections for each tab (see NAV.md for details):
  - Horoscope: Today/Week/Month toggle, Transit Summary, Focus of the Day, Task List, Creative Flow (locked), Upcoming Events
  - Rituals: Daily Kit, Ritual Guide, Weekly Inventory (locked), Notes/Adaptations
  - Kitchen & Home: Chores, Meals, Mixed unlock/lock state
  - Goals: Daily Goal Tasks, Affirmation, Family Routines, Witchy Goals, Career Context
  - Reflections: Mood Tracker, Gratitude, Journal Prompt, Dream Log, Self-Care

### Test Plan
- Confirm each tab displays its sections as horizontally scrollable pages.
- Swiping left/right moves between sections; no vertical scroll for sections.
- Each section fills the screen width and is clearly labeled.
- Check for smooth paging and correct order of sections.
- Verify placeholder content for each section matches NAV.md.

---

## Step 4: Modular Section Components (complete/passed)
- Create modular React components for each section under `components/sections/`.
- Each section component accepts a `locked` prop and renders lock/teaser/Upgrade CTA as needed.
- Ensure all sections for Horoscope, Rituals, Kitchen & Home, Goals, and Reflections are scaffolded.


### Test Plan
- Confirm all section components exist in `components/sections/` and render without errors.
- For each tab, verify that every section is rendered using its modular component (not just a placeholder View/Text).
- Each section component must accept the `locked` prop and display:
  - Unlocked: the section's main placeholder content.
  - Locked: lock icon/emoji, teaser text, and Upgrade CTA if applicable.
- Switch between tabs and sections to confirm all modular components are visible and distinct from Step 4's UI polish (page indicators, label previews, etc.).
- Confirm that editing or replacing a section component updates the corresponding section in the app UI.

---



## Step 5: Page Indicators & Label Previews (complete/passed)
- Add page indicators (dots) to the bottom of each tab's horizontal pager.
- Add faded label previews for previous/next section at the left/right edges of the pager on all tab screens.
- Keep tab header fixed at the top, indicators at the bottom, and label previews just above the pager.

### Test Plan
- Confirm page indicators appear at the bottom of all tab screens and update as you swipe.
- Confirm faded label previews for previous/next section appear at the left/right edges of the pager.
- Ensure label previews fade in/out smoothly as sections change.
- Test on different devices/orientations for consistent appearance.

---

## Step 6: Entitlement Logic (complete/passed)
- Implement EntitlementContext for global lock/unlock state.
- All tabs and section components use entitlement logic for free/paid/mixed states.
- Reflections tab is controlled by Horoscope entitlement.

### Test Plan
- Confirm locked/unlocked states for all tabs and sections.
- Verify Upgrade CTA appears for locked sections.
- Test entitlement switching and UI updates.

---

## Step 7: Hamburger Menu (complete/passed)
- Add hamburger menu to header.
- Menu opens modal with Profile, Your Package, and Upgrade options.
- Modal overlays app content and closes on outside tap or swipe down.

### Test Plan
- Confirm hamburger menu appears in header.
- Verify modal opens/closes correctly.
- Check all menu options are present.

---

## Step 8: Accessibility Improvements (complete/passed)
- Accessibility labels and roles added for:
  - Navigation (tab bar, hamburger menu)
  - Containers and screen wrappers
  - Toggles and indicators
  - Section headers
  - All Horoscope section components (TodayToggle, TransitSummary, FocusOfDay, TaskList, CreativeFlow, UpcomingEvents)
- All changes regression tested and confirmed

### Test Plan
- Confirm accessibility labels/roles are present for all major UI elements
- Validate with screen reader and accessibility inspector
- Confirm no unreachable code or regression errors
- All section content is accessible

---

## Step 9: Regression Testing (in progress)
- Run full suite of manual and automated tests to confirm stability
- Validate accessibility and entitlement logic across all tabs and sections

---

## Step 10: Documentation & Polish (pending)
- Update all documentation files to match current app state
- Polish UI, fix minor bugs, and prepare for release
---
