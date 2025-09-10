# SEGCONTRPLAN.md

## Segment Control Implementation Plan

This plan breaks down the segment control feature into the smallest testable increments, with a test plan for each step.

---

### Step 1: Create Component Skeleton
- Create `components/SegmentControl/SegmentControl.tsx` and `index.ts`.
- Export a basic functional component with required props.

**Test Plan:**
- Import and render `<SegmentControl options={[{key:'a',label:'A'},{key:'b',label:'B'}]} />` in a screen.
- Verify it renders without errors and logs a warning if options < 2.

---

### Step 2: Render Options & Selection State
- Map options to buttons; implement single-select logic (uncontrolled: `defaultKey`).
- Highlight selected option.

**Test Plan:**
- Tap each segment; verify only one is selected at a time.
- Confirm default selection matches `defaultKey`.

---

### Step 3: Controlled Mode & onChange
- Add controlled mode (`valueKey`, `onChange`).
- Fire callback and analytics event on change.

**Test Plan:**
- Pass `valueKey` and `onChange`; verify parent state updates and analytics fires.
- Confirm selection does not change if parent does not update value.

---

### Step 4: Disabled & Loading States
- Support `disabled` and `loading` per option.
- Show spinner for loading; disable press for disabled.

**Test Plan:**
- Render disabled and loading segments; verify they cannot be selected and spinner appears.

---

### Step 5: Accessibility & Keyboard Navigation
- Add tablist role, tab items, accessible labels.
- Implement Left/Right arrow navigation, Enter/Space select.

**Test Plan:**
- Use screen reader; verify labels and selection are announced.
- Use keyboard; verify navigation and selection.

---

### Step 6: Theming & Sizing
- Apply theme tokens for colors, border, text, thumb.
- Support `size` prop (sm/md/lg), rounded-full container.

**Test Plan:**
- Render all sizes; verify touch targets ≥44x44.
- Confirm colors and layout match spec.

---

### Step 7: Thumb Animation
- Animate thumb pill under selected item (150–200ms).
- Support `reduceMotion` prop to disable animation.

**Test Plan:**
- Tap segments; verify thumb animates smoothly.
- Set `reduceMotion`; confirm thumb jumps instantly.

---

### Step 8: Icons, Badges, Overflow

**Test Plan:**
### Step 8: Overflow
Do NOT implement icon or badge support for segment control. There is no valid business case for these features.
If options overflow, enable horizontal scroll with gradient edge fade.

**Test Plan:**
Verify scroll and fade work with >5 options.

---

### Step 9: RTL & Dynamic Type
- Mirror layout and animation in RTL.
- Support system font scaling.

**Test Plan:**
- Switch device to RTL; verify layout and thumb mirror.
- Increase system font size; confirm text scales.

---

### Step 10: Persistence
- Implement `persistKey` to save/restore selection via AsyncStorage.

**Test Plan:**
- Select a segment; reload app. Verify selection persists.

---

### Step 11: Error Handling & QA
- Warn if `valueKey` not in options; select first.
- Log warning if options < 2.
- Add `testID` to group and items.

**Test Plan:**
- Pass invalid `valueKey`; verify fallback and warning.
- Render with <2 options; confirm warning and no render.
- Use Detox/QA tools to verify testIDs.

---

- Add example usage to Horoscope, Kitchen, Goals screens.

**Test Plan:**
- View stories; verify all states and props.
- Test in app screens; confirm integration and analytics.

---

## Final QA Checklist
- All steps above pass manual and automated tests.
- Accessibility, theming, performance, and error handling validated.
- Ready for code review and production use.
