# SEGCONTRARCH.md

## Segment Control Architecture Plan

### Purpose
A modular, reusable, single-select segmented control for switching views (e.g., Today / Week / Month) across Lunaria. Designed for performance, accessibility, theming, and easy integration in React Native (iOS/Android). Web compatibility is a future goal.

---

## 1. Component Structure
- **SegmentControl.tsx**: Main component, receives props and renders segments.
- **SegmentOption**: Type for each segment (key, label, icon, badge, etc.).
- **Thumb**: Animated pill indicating selected segment.
- **Badge**: Micro-pill for counts.
- **Icon**: Optional, uses vector icon library.
- **Accessibility**: Tablist role, keyboard nav, dynamic type, RTL support.
- **Persistence**: Optional hook for saving selection to AsyncStorage.
- **Reduced Motion**: Optional hook for disabling animations.

---

## 2. Data Flow
1. **Props**: Options, controlled/uncontrolled value, callbacks, theming, analytics, etc.
2. **State**: Selected key (controlled/uncontrolled), focus, loading, reduced motion.
3. **Events**: onChange fires analytics and updates selection.
4. **Persistence**: If `persistKey` is set, selection is saved/restored via AsyncStorage.

---

## 3. Rendering Logic
- **Layout**: Horizontal pill container, flex items, thumb animates under selected.
- **Overflow**: Horizontal scroll with gradient edge fade if options overflow.
- **Sizing**: sm/md/lg, touch targets ≥44×44.
- **Theming**: Colors, border, shadow, text from theme tokens.
- **States**: Default, selected, disabled, loading, focused.
- **Error Handling**: Invalid valueKey, too few options, logs warnings.

---

## 4. Accessibility & Internationalization
- Tablist role, items as tab.
- Keyboard navigation: Left/Right, Enter/Space.
- Dynamic type: respects system font scaling.
- RTL: mirrors layout and thumb animation.
- Accessible labels and testIDs for QA.

---

## 5. Performance
- Memoization to avoid unnecessary re-renders.
- Only re-render changed item and thumb.
- Optional Reanimated support for thumb animation.

---

## 6. Integration
 Detox tests for QA. Storybook will NOT be used.

- Web compatibility: generic styles, no web-specific code yet.
- Multi-select or nested segment controls (future extension).
- Custom thumb shapes, advanced animation, theme variants.

---

## References
- See `SEGMENTCONTROL.md` for API, usage, and design tokens.
- React Native docs: Accessibility, Animated, AsyncStorage.
- Lucide/react-native-vector-icons for icons.
