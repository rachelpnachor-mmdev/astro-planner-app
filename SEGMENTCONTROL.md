# SEGMENTCONTROL.md

## Overview
A reusable, single-select segmented control for switching views (e.g., Today / This Week / This Month) across Lunaria. Designed for iOS/Android, theme-aware, accessible, and lightweight. Web compatibility is a future goal.

## Use Cases
- Horoscope: Today / Week / Month
- Rituals: Today / Week
- Kitchen: Today / Week
- Goals: Today / Week / Month
- Reflections: Today / Week / Month
- Apothecary Forecast: This Week / Next Week / Month

## Requirements
### Interaction & Behavior
- Single-select (radio behavior)
- Tap selection, optional swipe/drag thumb
- States: default, focused, selected, disabled, loading (per-item)
- Animation: 150–200ms thumb slide + color fade
- Optional persistence via `persistKey` (AsyncStorage)

### Accessibility
- `accessibilityRole="tablist"`, items as `tab`
- Announced label: “View range, selected: Today.”
- Keyboard nav: Left/Right, Enter/Space
- Dynamic type, RTL support

### Theming & Layout
- Sizes: sm / md / lg (≥44×44 touch targets)
- Rounded-full container, 1px border, elevated pill thumb
- Colors from theme tokens
- Content: label (required), optional icon (start), optional badge (end)
- Overflow: horizontal scroll with gradient edge fade

### Data & Options
- Static or dynamic options
- Option shape: `{ key, label, iconName?, badgeCount?, disabled?, testID?, loading? }`
- Controlled & uncontrolled modes

### Analytics & QA
- Fires `analytics.track('SegmentSelected', { groupId, key, screen })` on change
- `testID` on group and items; deterministic animation delay toggle (`reduceMotion`)

### Performance
- Avoid unnecessary re-renders
- Memoization and optional Reanimated support

### Mobile vs Web
- Mobile required; web styles generic for future

## Public API (TypeScript)
```ts
// ...see project brief for full types...
type SegmentOption = {
  key: string;
  label: string;
  // iconName and badgeCount are NOT implemented; no valid business case.
  disabled?: boolean;
  testID?: string;
  loading?: boolean;
};

type SegmentControlProps = {
  options: SegmentOption[];
  defaultKey?: string;
  valueKey?: string;
  onChange?: (key: string) => void;
  size?: 'sm' | 'md' | 'lg';
  groupId?: string;
  persistKey?: string;
  reduceMotion?: boolean;
  style?: ViewStyle;
  variant?: 'filled' | 'outline' | 'ghost';
  testID?: string;
  accessibleLabel?: string;
};
```

## Design Tokens
```
--seg.bg:            surface-2
--seg.border:        border-1
--seg.thumb.bg:      brand-600
--seg.thumb.shadow:  shadow-sm
--seg.text:          text-700
--seg.text.active:   white
--seg.text.disabled: text-300
--seg.badge.bg:      brand-50
--seg.badge.text:    brand-700
--seg.focus.ring:    brand-300
```

## Visual Spec
- Container: horizontal pill, padding 4–6 px, border radius = height/2
- Item: equal flex, center content, 8–12 px gap icon/label
- Thumb: absolute rounded pill under selected item, 2–4 px inset, shadow-sm
- Badges: 14–16 px micro-pill, top-right inside item, hidden if 0

## States
- Default text: 80%
- Selected text: 100% on thumb bg
- Disabled text: 40%; no press
- Loading: 12px spinner instead of icon/badge

## Error Handling
- If `valueKey` not in `options`, select `options[0]` and warn in dev
- If `options.length < 2`, render nothing and log warning

## Usage Examples
```tsx
<SegmentControl
  groupId="horoscope-range"
  accessibleLabel="View range"
  options={[
  { key:'today', label:'Today' },
  { key:'week', label:'This Week' },
  { key:'month', label:'This Month' },
  ]}
  defaultKey="today"
  onChange={(k)=> analytics.track('RangeChanged',{screen:'Horoscope',k})}
/>

<SegmentControl
  groupId="kitchen-range"
  options={[
  { key:'today', label:'Today' },
  { key:'week', label:'This Week' },
  ]}
  size="lg"
  persistKey="seg:kitchen:range"
/>

<SegmentControl
  groupId="goals-range"
  options={[
  { key:'today', label:'Today' },
  { key:'week', label:'Week' },
  { key:'month', label:'Month', disabled:true },
  ]}
  valueKey={range}
  onChange={setRange}
/>
```

## BDD (Gherkin)
```
Feature: Segment control switching

  Scenario: Select a segment
    Given the segment control is rendered with Today, This Week, This Month
    When I tap "This Week"
    Then "This Week" becomes selected
    And an analytics event is fired with key "week"

  Scenario: Keyboard navigation
    Given focus is on the segment control
    When I press Right Arrow
    Then selection moves to the next segment

  Scenario: Persistence
    Given a persistKey is provided
    When I select "This Month"
    And I reopen the screen
    Then "This Month" is selected

  Scenario: Disabled option
    Given "This Month" is disabled
    When I tap it
    Then selection does not change

  Scenario: RTL layout
    Given the device is in RTL
    Then the thumb animation and order are mirrored
```

## Implementation Notes
- Create `components/SegmentControl/SegmentControl.tsx` + `index.ts`
- Use RN `Animated` (or Reanimated if available flag is set) for thumb translateX
- Measure item widths via `onLayout`; compute thumb width/position
- Add `useSegmentPersistence(persistKey)` hook (wraps AsyncStorage)
- Add `useReducedMotion()` (returns `prefers-reduced-motion` style flag)
- Export storybook examples (3 stories) + detox tests with `testID`s
- Document in `SEGMENTCONTROL.md` with API table, props, examples, and a11y notes
