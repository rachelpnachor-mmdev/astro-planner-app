# Astro Planner App (Expo)

This is the Expo/React Native implementation of the Astro Planner app.

## Features
- Custom emoji-based tab bar (5 static tabs)
- Horizontal paging for tab sections (swipe left/right)
- Page indicators (dots) at the bottom of each pager
- Faded label previews for previous/next section at the edges of each pager
- Modular section components for each tab
- Entitlement logic for free/paid/mixed states (complete: Horoscope, Rituals, Kitchen & Home, Goals, Reflections)
- Hamburger menu implemented: appears in header, opens modal at top with Profile, Your Package, and Upgrade options (placeholders; navigation not yet wired up)
- Accessibility improvements complete: navigation, containers, toggles, indicators, headers, and all Horoscope section components

## Status
- Navigation, tab bar, horizontal paging, page indicators, and label previews are complete and tested
- Modular section components scaffolded and integrated
- Entitlement logic (Step 6) complete: all tabs use EntitlementContext for lock/unlock logic. Reflections is controlled by the Horoscope entitlement.
- Accessibility improvements (Step 8) complete and regression tested
- See `NAVPLAN.md` for step-by-step plan and test cases. Hamburger menu modal and options are implemented as described.

## Getting Started
1. `npm install`
2. `npx expo start`

## Documentation
- [NAV.md](NAV.md): Navigation requirements
- [NAVARCH.md](NAVARCH.md): Navigation architecture
- [NAVPLAN.md](NAVPLAN.md): Implementation plan and test plans
- Entitlement logic: see `context/EntitlementContext.tsx` (in progress)
