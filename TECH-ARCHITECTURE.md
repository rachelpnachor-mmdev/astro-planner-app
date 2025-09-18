# 🌙 Lunaria Technical Architecture

## Overview
Lunaria is a React Native mobile application built with Expo that provides personalized astrology-based daily planning and guidance. The app combines astrological chart calculation, AI-powered personality adaptation, and witchy/spiritual practices to create a comprehensive life planning companion.

---

## Core Technology Stack

### Frontend
- **React Native 0.81.1** with **Expo SDK 54.0**
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **React Native SVG** for birth chart visualizations
- **Luxon** for date/time handling with timezone support

### State Management
- **React Context** for entitlements and global state
- **AsyncStorage** for chart data caching
- **SecureStore** for sensitive user data (birth profiles, authentication)
- **Local-first architecture** with optional cloud sync

### Astrology Engine
- **Multiple Provider System**: API-based (FreeAstrologyAPI) + Local fallback
- **Swiss Ephemeris accuracy** via external providers
- **Canonical data normalization** for consistent chart rendering

### AI & Personality System
- **Archetype-based personality adaptation** (Rising × Moon sign combinations)
- **Sharded memory architecture** for persistent AI conversations
- **Provider abstraction** supporting mock/remote LLM backends
- **Vector retrieval** for contextual memory access

---

## Architecture Patterns

### 1. Provider Pattern
The app uses a consistent provider pattern across multiple domains:

```typescript
// Astrology providers (engine/registry.ts)
export const registry: Record<ProviderKey, { compute: any }> = {
  western: apiProvider,     // FreeAstrologyAPI
  vedic: localProvider,     // Local fallback
  sidereal: localProvider,
  hellenistic: localProvider,
};

// AI/LLM providers (lib/ai/assistant/providers/)
export interface LlmProvider {
  complete(messages: ChatMessage[]): Promise<string>;
}
```

### 2. Canonical Data Normalization
All astrological data is normalized to a canonical format regardless of source:

```typescript
export interface EclipticCanonical {
  lonDeg: number;            // 0..360
  degInSign?: number;        // 0..30
  signIndexAries0?: number;  // 0..11
}
```

### 3. Entitlement-Driven Feature Gating
```typescript
export type EntitlementState = {
  horoscope: boolean;
  rituals: boolean;
  kitchenHome: { chores: boolean; meals: boolean; mixedUnlock: boolean; };
  goals: boolean;
  reflections: boolean;
};
```

### 4. Sharded Memory Architecture
AI conversations and user history are stored in topic-based shards for efficient retrieval and token management.

---

## Data Flow

### Birth Chart Generation
1. **User Input**: Birth date/time/location via onboarding forms
2. **Profile Storage**: Encrypted storage in SecureStore
3. **Provider Selection**: Based on methodology setting (western→API, others→local)
4. **API Request**: FreeAstrologyAPI with Swiss Ephemeris accuracy
5. **Normalization**: Convert response to canonical format
6. **Caching**: Store in AsyncStorage for offline access
7. **Visualization**: SVG-based birth chart wheel and table

### AI Personality Adaptation
1. **Chart Analysis**: Extract Rising/Moon/Mars/Venus placements
2. **Archetype Assignment**: Map to one of 16 personality archetypes
3. **Tone Calibration**: Adjust assertiveness, warmth, playfulness parameters
4. **Memory Integration**: Load relevant conversation history shards
5. **Response Generation**: Contextualized AI responses matching archetype

---

## Key Components

### Astrology System
- **`lib/astro/types.ts`**: Core types and interfaces
- **`lib/astro/useBirthChart.ts`**: React hook for chart computation
- **`components/astro/BirthChartWheel.tsx`**: SVG-based chart visualization
- **`engine/apiProvider.ts`**: FreeAstrologyAPI integration
- **`engine/registry.ts`**: Provider registry and fallback logic

### AI & Personality
- **`lib/ai/archetype/`**: 16 personality archetypes based on astrological placements
- **`lib/ai/assistant/`**: LLM provider abstraction and chat runtime
- **`lib/ai/memory/`**: Sharded memory system for conversation persistence
- **`AIPERSONALITY.md`**: Framework documentation
- **`AIARCHETYPE.md`**: Archetype definitions and tone guidelines

### Navigation & UI
- **`app/`**: File-based routing with Expo Router
- **`navigation/BottomTabs.tsx`**: Main tab navigation
- **`components/`**: Reusable UI components
- **`context/EntitlementContext.tsx`**: Feature gating system

### Storage & State
- **`lib/userStore.ts`**: User data and birth chart persistence
- **`lib/types/profile.ts`**: User profile type definitions
- **AsyncStorage**: Chart caching and app data
- **SecureStore**: Sensitive data encryption

---

## External Integrations

### FreeAstrologyAPI
- **Purpose**: High-accuracy birth chart calculations using Swiss Ephemeris
- **Endpoint**: `https://json.freeastrologyapi.com/western/planets`
- **Authentication**: x-api-key header
- **Data Flow**: Birth details → API → Normalized chart data
- **Fallback**: Local provider for non-western methodologies

### Future OpenAI Integration
- **Architecture**: Remote provider in `lib/ai/assistant/providers/remote.ts`
- **Environment**: `EXPO_PUBLIC_AI_API_URL` for backend endpoint
- **Purpose**: Enhanced AI personality and conversation capabilities

---

## Mobile App Architecture

### Expo Configuration
```json
{
  "expo": {
    "name": "astro-planner-app-expo",
    "platforms": ["ios", "android", "web"],
    "newArchEnabled": true,
    "plugins": ["expo-router", "expo-splash-screen", "expo-secure-store"]
  }
}
```

### Navigation Structure
```
app/
├── (main)/          # Main authenticated app
├── (tabs)/          # Tab-based navigation
├── profile/         # User profile and birth chart setup
├── settings/        # App configuration
├── dev/            # Development tools and AI probes
└── _layout.tsx     # Root layout with starfield background
```

### Performance Optimizations
- **Local-first data**: Charts cached for offline access
- **SVG rendering**: Efficient birth chart visualization
- **Memory management**: Sharded conversation history
- **Provider fallbacks**: Graceful degradation when APIs fail

---

## Security & Privacy

### Data Protection
- **SecureStore**: Encrypted storage for birth profiles and sensitive data
- **Local-first**: User data never leaves device in MVP phase
- **Environment variables**: API keys and endpoints in .env
- **Migration safety**: Structured migration from AsyncStorage to SecureStore

### Privacy Model
- **Phase 1 (MVP)**: Complete local storage, no cloud dependencies
- **Phase 2**: Optional cloud sync for premium users
- **Phase 3**: Encrypted cloud storage with local caching

---

## Development Tools

### AI Assistant Probes
Development menu integration for testing AI systems:
- **Seed + Prep**: Initialize AI memory with test data
- **Export Memory**: Debug conversation history
- **Clear Memory**: Reset AI state
- **Chat Dry-run**: Test conversation flow
- **Provider Check**: Verify LLM backend connectivity

### TypeScript Integration
- **Strict typing**: All major interfaces strongly typed
- **Expo Router types**: Generated route typing for navigation
- **Provider interfaces**: Consistent contracts across astrology/AI providers

---

## Scalability Considerations

### Modular Architecture
- **Provider pattern**: Easy to add new astrology/AI backends
- **Feature gating**: Entitlement system supports premium tiers
- **Sharded memory**: Scales with user conversation history

### Performance
- **Canonical normalization**: Consistent data format regardless of source
- **SVG optimization**: Efficient chart rendering at any size
- **Memory bounds**: Token limits via weekly summaries and shard pruning

### Monetization Ready
- **Entitlement system**: Ready for premium features
- **Cloud migration path**: Local → Cloud storage transition planned
- **Provider abstraction**: Easy to integrate premium astrological backends

---

## Future Architecture Expansions

### Cloud Integration
- **Firebase/Supabase**: User accounts and data sync
- **Vector databases**: Enhanced AI memory retrieval
- **Push notifications**: Daily insights and reminders

### Enhanced AI
- **Multi-modal inputs**: Voice, image, and text interactions
- **Ritual recommendations**: Context-aware spiritual practices
- **Long-term memory**: Cross-device conversation continuity

### Platform Extensions
- **Widget support**: Home screen daily insights
- **Watch integration**: Quick astrology updates
- **Desktop companion**: Cross-platform experience

---

## Implementation Status

Based on git status and recent commits:
- ✅ Birth chart wheel and table visualization complete
- ✅ User profile and birth data collection
- ✅ Provider registry with API/local fallbacks
- ✅ AI personality archetype system
- ✅ Sharded memory architecture
- ⚠️ Some business logic refinements needed
- 🔄 Integration testing for freestrologyapi
- 📋 OpenAI integration planned

The architecture successfully balances astrological accuracy, AI personalization, and mobile performance while maintaining a clear path for future enhancements and monetization.