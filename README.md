# Package Sorting System

A 30 minute TypeScript implementation of a robotic package sorting system for Thoughtful's automation factory. Classifies packages based on dimensions and weight to determine appropriate handling stacks.

**Live Demo:** https://atyl95.github.io/thoughtfulai-screening/

## Core Function

The main sorting logic is implemented in `app_src/src/utils/packageSorter.ts`:

```typescript
sort(width: number, height: number, length: number, mass: number): PackageType
```

Returns one of three classification types:
- `STANDARD` - Normal packages (not bulky and not heavy)
- `SPECIAL` - Packages requiring special handling (bulky OR heavy)
- `REJECTED` - Packages that cannot be processed (bulky AND heavy)

## Classification Rules

**Bulky Package Criteria:**
- Volume ≥ 1,000,000 cm³ OR
- Any dimension ≥ 150 cm

**Heavy Package Criteria:**
- Mass ≥ 20 kg

## Repository Usage

### Prerequisites
- Node.js 20.19.0+ or 22.12.0+

### Installation
```bash
cd app_src
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Testing with Vitest

Run all tests:
```bash
npm test
```

Watch mode for development:
```bash
npm run test:watch
```

Test coverage report:
```bash
npm run test:coverage
```

## Implementation Details

### Main Functions
- `sort()` - Core classification function
- `sortWithDetails()` - Extended function returning detailed analysis
- `validateInputs()` - Input validation for positive finite values

### Test Coverage
The test suite (`app_src/src/utils/__tests__/packageSorter.test.ts`) includes:
- Input validation (zero, negative, infinite, NaN values)
- Boundary value testing (exact thresholds)
- Edge cases and real-world scenarios
- Comprehensive combination testing
- 313 test cases ensuring robust validation

### Web Interface
Vue.js application with:
- Interactive package input form
- Real-time classification results
- Predefined test cases
- Detailed analysis display
- Responsive design
