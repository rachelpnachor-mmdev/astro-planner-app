# Astro Planner App

Astro Planner is a modular, elegant daily planner for iOS/Android built with Expo and React Native.

## Features
- Custom emoji-based tab bar with 5 static tabs: Horoscope, Rituals, Kitchen & Home, Goals, Reflections
- Horizontal paging for tab sections (swipe left/right)
- Page indicators (dots) at the bottom of each pager
- Faded label previews for previous/next section at the edges of each pager
- Modular section components for each tab
- Entitlement logic for free/paid/mixed states (complete)
- Hamburger menu for Profile, Your Package, and Upgrade (complete)
- Accessibility improvements complete: navigation, containers, toggles, indicators, headers, and all Horoscope section components

## Status
- Navigation structure, tab bar, horizontal paging, page indicators, and label previews are complete and tested
- Section scaffolding, entitlement logic, and accessibility improvements are complete
- See `astro-planner-app-expo/NAVPLAN.md` for detailed implementation and test plan

## Getting Started
1. `cd astro-planner-app-expo`
2. `npm install`
3. `npx expo start`

## Documentation
- [NAV.md](astro-planner-app-expo/NAV.md): Navigation requirements
- [NAVARCH.md](astro-planner-app-expo/NAVARCH.md): Navigation architecture
- [NAVPLAN.md](astro-planner-app-expo/NAVPLAN.md): Implementation plan and test plans
