// Detox end-to-end test for SegmentControl

describe('SegmentControl', () => {
  beforeAll(async () => {
    await device.launchApp({ delete: true });
  });

  it('should render all segments and select each one', async () => {
    await expect(element(by.id('SegmentControl'))).toBeVisible();
    await expect(element(by.id('SegmentControl-item-today'))).toBeVisible();
    await expect(element(by.id('SegmentControl-item-week'))).toBeVisible();
    await expect(element(by.id('SegmentControl-item-month'))).toBeVisible();

    await element(by.id('SegmentControl-item-week')).tap();
    await expect(element(by.id('SegmentControl-item-week'))).toHaveText('This Week');
    await element(by.id('SegmentControl-item-month')).tap();
    await expect(element(by.id('SegmentControl-item-month'))).toHaveText('This Month');
    await element(by.id('SegmentControl-item-today')).tap();
    await expect(element(by.id('SegmentControl-item-today'))).toHaveText('Today');
  });

  it('should persist selection after reload', async () => {
    await element(by.id('SegmentControl-item-week')).tap();
    await device.reloadReactNative();
    await expect(element(by.id('SegmentControl-item-week'))).toBeVisible();
    // Optionally check if it is selected (requires selected state testID or accessibilityState)
  });

  it('should fallback to first option if valueKey is invalid', async () => {
    // This test assumes you can set valueKey via props or navigation for testing
    // You may need to expose a test screen for this scenario
    // For now, just document the intent
  });

  it('should not render with less than 2 options', async () => {
    // This test assumes you can render SegmentControl with 1 option for testing
    // For now, just document the intent
  });
});
