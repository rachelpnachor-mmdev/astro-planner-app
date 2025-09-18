# Test Suite Documentation

## Overview

This test suite provides comprehensive coverage for the Lunaria astrology app, including unit tests, integration tests, and type validation tests.

## Test Structure

```
__tests__/
├── lib/
│   └── astro/
│       ├── engine.test.ts          # Astrological calculation engine tests
│       └── useBirthChart.test.ts   # Birth chart hook tests
├── components/
│   └── astro/
│       └── BirthChartWheel.test.tsx # Chart visualization component tests
├── utils/
│   ├── theme.test.ts               # Theme system validation tests
│   └── types.test.ts               # TypeScript type system tests
└── README.md                       # This documentation
```

## Test Categories

### 1. Unit Tests
- **Engine Tests** (`lib/astro/engine.test.ts`): Test astrological calculation accuracy
- **Hook Tests** (`lib/astro/useBirthChart.test.ts`): Test React hooks behavior
- **Theme Tests** (`utils/theme.test.ts`): Test color system consistency
- **Type Tests** (`utils/types.test.ts`): Test TypeScript type definitions

### 2. Integration Tests
- **Component Tests** (`components/astro/BirthChartWheel.test.tsx`): Test UI component integration

### 3. System Tests
- Type compatibility between different parts of the app
- Theme consistency across components
- Astrological calculation accuracy

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (Development)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### CI/CD Mode
```bash
npm run test:ci
```

## Test Coverage Goals

### Critical Components (100% Coverage Required)
- Astrological calculation engine
- Birth chart computation
- Type system validation
- Core hooks and utilities

### UI Components (80% Coverage Goal)
- Birth chart visualization
- Theme system
- Navigation components

### Integration Points (90% Coverage Goal)
- Data flow between components
- State management
- Provider integration

## Mocking Strategy

### External Dependencies
- **react-native-svg**: Mocked with simple View components
- **expo-router**: Mocked with Jest functions
- **AsyncStorage**: Mocked with memory-based implementation
- **expo-secure-store**: Mocked with Jest functions

### Internal Dependencies
- **Provider registry**: Mocked for hook testing
- **Complex calculations**: Partial mocking to test specific scenarios

## Writing New Tests

### Test File Naming
- Unit tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `*.integration.test.tsx`
- End-to-end tests: `*.e2e.test.tsx`

### Test Structure
```typescript
describe('Component/Feature Name', () => {
  describe('Specific functionality', () => {
    beforeEach(() => {
      // Setup before each test
    });

    it('should do something specific', () => {
      // Test implementation
    });
  });
});
```

### Best Practices

1. **Descriptive Test Names**: Use "should..." format
2. **Arrange, Act, Assert**: Structure tests clearly
3. **Mock External Dependencies**: Keep tests isolated
4. **Test Edge Cases**: Include error conditions and boundary values
5. **Async Testing**: Use proper async/await patterns

## Test Data

### Mock Birth Chart Data
```typescript
const mockChart: BirthChart = {
  system: 'western_tropical',
  houses: { system: 'placidus', cusps: [...] },
  points: [{ point: 'Sun', ecliptic: {...} }],
  computedAt: Date.now(),
};
```

### Mock Profile Data
```typescript
const mockProfile: BirthProfile = {
  birthDate: '1990-12-25',
  birthTime: '12:00',
  timezone: 'America/New_York',
  lat: 40.7128,
  lon: -74.0060,
};
```

## Debugging Tests

### Common Issues
1. **SVG Rendering**: Ensure react-native-svg is properly mocked
2. **Async Operations**: Use waitFor() for async state changes
3. **Navigation**: Mock expo-router correctly
4. **Storage**: Use memory-based mocks for persistence

### Debug Commands
```bash
# Run specific test file
npm test -- engine.test.ts

# Run tests with verbose output
npm test -- --verbose

# Run tests in debug mode
npm test -- --runInBand --detectOpenHandles
```

## Continuous Integration

### GitHub Actions Configuration
The test suite is designed to work with standard CI/CD pipelines:

```yaml
- name: Run Tests
  run: npm run test:ci

- name: Upload Coverage
  uses: codecov/codecov-action@v1
```

### Pre-commit Hooks
Recommended to run tests before commits:

```bash
# Add to package.json scripts
"pre-commit": "npm run test:ci && npm run lint"
```

## Test Maintenance

### Regular Tasks
1. Update test data when API changes
2. Add tests for new features
3. Refactor tests when components change
4. Monitor coverage reports

### Performance Considerations
- Keep test runtime under 30 seconds for full suite
- Use shallow rendering where possible
- Mock heavy operations (SVG rendering, complex calculations)
- Parallelize test execution

## Coverage Reporting

Coverage reports are generated in:
- Text format (console output)
- HTML format (`coverage/lcov-report/index.html`)
- LCOV format (`coverage/lcov.info`)

### Viewing Coverage
```bash
# Generate and open coverage report
npm run test:coverage
open coverage/lcov-report/index.html
```