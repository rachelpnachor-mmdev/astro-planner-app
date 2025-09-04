# Astro Planner Navigation Architecture (NAVARCH.md)

This document describes the navigation architecture for the Astro Planner mobile app.

---

## Overview
This document describes the technical architecture for implementing the navigation system defined in NAV.md for the Astro Planner mobile app (Expo/React Native). It covers navigation structure, tab logic, state management, and extensibility for free/paid user flows.

---

## Navigation Structure

- **Bottom Tab Navigator**: Use `@react-navigation/bottom-tabs` for the 5 static tabs.
- **Custom Tab Bar**: Implement a custom tab bar component (`CustomTabBar.tsx`) for full control over emoji/label layout, flexible tab widths, and elegant label transitions.
- **Stack Navigator**: Each tab can have its own stack for future extensibility (e.g., detail screens, modals).
- **Hamburger Menu**: Top-right button in the header on all tabs, opens a modal at the top of the screen with Profile, Your Package, and Upgrade options. Modal is visually elegant, closes via X button. Menu items are placeholders; navigation is pending.

---

## Tab Bar Implementation

- **Tabs**: Horoscope, Rituals, Kitchen & Home, Goals, Reflections (always visible, order fixed).
- **Emojis**: Use emoji for each tab. Only the active tab shows label text to the right of the emoji; others show emoji only.
- **Flexible Tab Widths**: Active tab expands to fit label, inactive tabs remain compact. "Kitchen & Home" label breaks after "&" for improved layout.
- **Custom Tab Bar**: Implemented in `components/CustomTabBar.tsx`.
- **Initial Route**: App always launches on Horoscope tab.

---


## Tab Content & Scroll

- Each tab is a horizontally scrollable screen with sections as described in NAV.md.
- Use a segmented control for Today/Week/Month toggle in Horoscope.
- Use `ScrollView` for horizontal paging; preserve scroll position per tab (see below).
- At the bottom of each pager, show page indicators (dots) that update as the user swipes.
- Just above the pager, show faded label previews for the previous and next section at the left and right edges, updating as the user swipes.

---

## State Management


- **User Entitlements**: Store user package/subscription state in a global context (e.g., React Context or Zustand).
- **Tab Lock/Unlock**: Render lock/teaser/Upgrade CTA for locked sections based on entitlement state.
- **Mixed Unlocks**: For Kitchen & Home, check entitlement for each section and render accordingly.
- **Reflections Special Case**: All Reflections sections are locked/unlocked by the Horoscope entitlement (not a separate package).
- **Scroll Position**: Use per-tab state to preserve scroll position when switching tabs (e.g., store scroll offset in context or local state).

---

## Hamburger Menu

- Place a menu icon in the top-right of the header (visible on all tabs).
- On press, open a modal at the top of the screen with:
  - Profile (edit info, notifications, etc.)
  - Your Package (active modules, manage subscription)
  - Upgrade (locked modules, pricing)
- Modal closes via X button. Menu items are placeholders; navigation is not yet implemented.
- Use React Navigation's modal or drawer pattern for implementation.

---

## Free vs. Paid Logic

- On each tab, check entitlement before rendering locked content.
- Free users see teasers/locks and Upgrade CTA.
- Paid users see full content for unlocked modules.
- Mixed Kitchen & Home: unlock logic per section.
- Reflections: all sections are controlled by the Horoscope entitlement.

---

## Extensibility & Maintainability

- Keep tab screens modular (one file/component per tab).
- Use section components for each scrollable section (easy to lock/unlock or rearrange).
- Centralize entitlement logic in a context/provider.
- Use TypeScript for type safety.

---

## Acceptance Criteria (Technical)

- [ ] 5 static bottom tabs, custom tab bar for emoji/label logic and flexible widths.
- [ ] App launches on Horoscope tab.
- [ ] Hamburger menu accessible from all tabs.
- [ ] Scroll position preserved per tab.
- [x] Entitlement logic for free/paid/mixed states (all tabs, including Reflections, implemented and tested).
- [ ] Modular, maintainable code structure.

---

## File/Folder Structure (Suggested)

```
/astro-planner-app-expo
  /components
    CustomTabBar.tsx
    HamburgerMenu.tsx
    /sections
      Horoscope/
      Rituals/
      KitchenHome/
      Goals/
      Reflections/
  /screens
    HoroscopeScreen.tsx
    RitualsScreen.tsx
    KitchenHomeScreen.tsx
    GoalsScreen.tsx
    ReflectionsScreen.tsx
  /navigation
    BottomTabs.tsx
    RootStack.tsx
  /context
    EntitlementContext.tsx
```

---

## Accessibility
Accessibility improvements are complete for:
- Navigation (tab bar, hamburger menu)
- Containers and screen wrappers
- Toggles and indicators
- Section headers
- All Horoscope section components

All navigation and section content is accessible and regression tested.

---

## Implementation Notes
- Use only local assets and system fonts.
- No dynamic tab order or visibility.
- All navigation logic must be consistent for free and paid users.
