# ARCHITECTURE-BIGPICTURE.md

## 1. Vision & Overall Goals

Astro Planner is a modular, cross-platform (iOS/Android/web) planner app and print service that supports:

- **Witch Package**: Ritual Kit, Guide, Inventory, multi-style blending, onboarding, notifications, cross-module hooks, paywall, analytics
- **Meal Planner**: Meal Profile, weekly/daily plans, shopping list, context-aware meals, cross-module hooks, notifications, analytics
- **Chore Planner**: Household Profile, support system, chore assignment, daily/weekly/monthly views, cross-module hooks, notifications, analytics
- **Goals Package**: Goal & Career Profile, capacity scaling, daily tasks/affirmations, cross-module hooks, notifications, analytics
- **Premium Print**: Subscription-aware compile, print job setup, license, customization, analytics, API integration

## 3. Integrations (updated)
- **Astrology API**: Transits, electional timing, context for all modules
- **Geocoding/Timezone API**: Birth place/time
- **Content CMS**: Optional for literature blurbs, recipes
- **Recipe/Nutrition API**: For meal planner (optional)
- **Print-on-Demand Partner**: For Premium Print
- **Cloud Sync**: User data, settings, planner cache
- **Analytics**: Event tracking, feedback
- **OpenAI/LLM**: Conversational flows, prompt-based helpers, dynamic content and ritual/goal/meal/chore generation

## 4. UI Requirements
- Responsive, accessible mobile-first design (iOS/Android/web)
- Dynamic type, high contrast, voice-over, large tap targets
- Modular navigation: Today, This Week, This Month, Settings, Print
- Feature flags and entitlement checks for module gating
- In-app feedback, onboarding, and notifications
- PDF export: US Letter, grayscale, system fonts, two-column, minimal
- Print setup wizard (Premium Print)

## 5. Common Use Cases
- Daily planning with astrology context
- Unlocking and onboarding new modules
- Blending features (e.g., Witch + Meals, Goals + Chores)
- Editing and tracking goals, chores, meals, rituals
- Exporting/printing planner content
- Managing account, settings, and data privacy

## 6. Scalable Architecture Patterns (updated)

### Front End
- **Framework**: React Native (mobile), React (web), or Flutter for unified codebase
- **State Management**: Redux/MobX/Context API for modular state slices (core, witch, meals, chores, goals, print)
- **Feature Flags**: Centralized config for module gating
- **Reusable Components**: Section renderers, onboarding flows, notification banners, PDF/print preview, feedback forms
- **Accessibility**: Shared utilities for type, contrast, ARIA/voice-over
- **Offline Support**: Local cache for planner data, sync on reconnect
- **Conversational UI**: Chat-style interfaces for onboarding, helpers, and dynamic suggestions powered by LLM prompts

### Back End
- **API Gateway**: GraphQL or REST, modular endpoints per feature
- **User Service**: Auth, profile, settings, entitlement
- **Planner Engine**: Core logic for generating daily/weekly/monthly plans, context blending, PDF/print rendering
- **Module Services**: Witch, Meals, Chores, Goals—each as a microservice or modular backend component
- **Notification Service**: Schedules, reminders, quiet hours
- **Analytics Service**: Event ingestion, reporting
- **Integration Layer**: Adapters for Astrology, Geocoding, Recipe, Print APIs
- **Content CMS**: Optional, for dynamic literature/recipes
- **LLM Service**: Secure integration with OpenAI or compatible LLM provider for prompt/response, content generation, and context-aware suggestions
- **Prompt Orchestration**: Backend logic to compose, send, and manage prompts and responses for all modules

### Data & Persistence
- **User Data**: Encrypted local store + cloud sync (profile, settings, planner cache)
- **Planner Data**: JSON contracts per module, versioned for migration
- **Print Jobs**: Order records, license acceptance, shipping/tracking
- **Analytics**: Event logs, feedback

## 7. Reusable Components & Services (updated)
- **Front End**:
  - Planner section renderer (configurable for any module)
  - Onboarding wizard (stepper, validation)
  - Notification/Reminder manager
  - PDF/Print preview and export
  - Feedback form
  - Settings/account/profile manager
  - Conversational chat component (LLM-powered)
- **Back End**:
  - User/auth service
  - Planner engine (input: user profile + modules; output: daily/weekly/monthly plan JSON)
  - Module logic (rituals, meals, chores, goals)
  - Notification scheduler
  - Analytics/event logger
  - Print job orchestrator
  - Integration adapters (API, CMS, print)
  - LLM integration service (OpenAI or compatible)
  - Prompt/response manager for module-specific flows

## 8. Incremental Delivery & Scalability
- Each phase is a self-contained module, but all share core services and UI patterns
- Feature flags and entitlement checks allow safe rollout and testing
- Data contracts are versioned and extensible
- UI and backend are designed for plug-and-play modules
- Analytics and feedback are unified for all modules
- Print and export logic is centralized, with module-aware rendering

## 9. Security & Privacy
- Encrypted local storage for all sensitive data
- Cloud sync with end-to-end encryption
- Personal-use license enforcement for print
- Minimal data sharing with third parties; opt-in analytics

## 10. Future-Proofing (updated)
- Modular codebase and data contracts allow for new modules/features
- API adapters make it easy to swap or add integrations
- Print/export logic supports new formats and partners
- UI and backend patterns support scaling to more users and features
- LLM integration is modular, allowing for future provider changes or on-premise models

---

*OpenAI/LLM integration enables conversational helpers, dynamic content, and context-aware suggestions throughout the planner, supporting onboarding, ritual/goal/meal/chore generation, and user engagement.*

*This document provides a unified, scalable architecture for the Astro Planner project, supporting phased delivery and future growth while ensuring maintainability, accessibility, and a seamless user experience.*
