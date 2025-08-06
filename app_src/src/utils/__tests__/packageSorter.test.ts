import { describe, it, expect } from 'vitest'
import { sort, sortWithDetails, type PackageType } from '../packageSorter'

describe('Package Sorting Logic', () => {
  describe('Input Validation', () => {
    it('should reject zero dimensions', () => {
      expect(() => sort(0, 10, 10, 5)).toThrow('Package dimensions and mass must be positive values greater than 0')
      expect(() => sort(10, 0, 10, 5)).toThrow('Package dimensions and mass must be positive values greater than 0')
      expect(() => sort(10, 10, 0, 5)).toThrow('Package dimensions and mass must be positive values greater than 0')
    })

    it('should reject negative dimensions', () => {
      expect(() => sort(-1, 10, 10, 5)).toThrow('Package dimensions and mass must be positive values greater than 0')
      expect(() => sort(10, -5, 10, 5)).toThrow('Package dimensions and mass must be positive values greater than 0')
      expect(() => sort(10, 10, -10, 5)).toThrow('Package dimensions and mass must be positive values greater than 0')
    })

    it('should reject zero or negative mass', () => {
      expect(() => sort(10, 10, 10, 0)).toThrow('Package dimensions and mass must be positive values greater than 0')
      expect(() => sort(10, 10, 10, -5)).toThrow('Package dimensions and mass must be positive values greater than 0')
    })

    it('should reject infinite values', () => {
      expect(() => sort(Infinity, 10, 10, 5)).toThrow('Package dimensions and mass must be finite numbers')
      expect(() => sort(10, 10, 10, Infinity)).toThrow('Package dimensions and mass must be finite numbers')
    })

    it('should reject NaN values', () => {
      expect(() => sort(NaN, 10, 10, 5)).toThrow('Package dimensions and mass must be finite numbers')
      expect(() => sort(10, 10, 10, NaN)).toThrow('Package dimensions and mass must be finite numbers')
    })

    it('should accept very small positive values', () => {
      expect(() => sort(0.001, 0.001, 0.001, 0.001)).not.toThrow()
      const result = sort(0.1, 0.1, 0.1, 0.1)
      expect(result).toBe('STANDARD')
    })
  })

  describe('Basic Classification', () => {
    it('should classify standard packages correctly', () => {
      const result = sort(10, 10, 10, 5)
      expect(result).toBe('STANDARD')
    })

    it('should classify bulky packages by volume', () => {
      const result = sort(100, 100, 100, 15) // Volume = 1,000,000 cm³
      expect(result).toBe('SPECIAL')
    })

    it('should classify bulky packages by dimension', () => {
      const result = sort(150, 10, 10, 15) // One dimension = 150 cm
      expect(result).toBe('SPECIAL')
    })

    it('should classify heavy packages', () => {
      const result = sort(50, 50, 50, 20) // Mass = 20 kg
      expect(result).toBe('SPECIAL')
    })

    it('should reject packages that are both bulky and heavy', () => {
      const result = sort(150, 100, 100, 25) // Bulky by dimension and heavy
      expect(result).toBe('REJECTED')
    })
  })

  describe('Edge Cases', () => {
    it('should handle exactly 1,000,000 cm³ volume (bulky threshold)', () => {
      const result = sort(100, 100, 100, 15) // Exactly 1,000,000 cm³
      expect(result).toBe('SPECIAL')
    })

    it('should handle exactly 150 cm dimension (bulky threshold)', () => {
      const result = sort(150, 10, 10, 15) // Exactly 150 cm width
      expect(result).toBe('SPECIAL')
    })

    it('should handle exactly 20 kg mass (heavy threshold)', () => {
      const result = sort(50, 50, 50, 20) // Exactly 20 kg
      expect(result).toBe('SPECIAL')
    })

    it('should handle values just below thresholds', () => {
      const result = sort(99.9, 99.9, 99.9, 19.9) // Just below all thresholds
      expect(result).toBe('STANDARD')
    })

    it('should handle very small packages', () => {
      const result = sort(0.1, 0.1, 0.1, 0.1)
      expect(result).toBe('STANDARD')
    })

    it('should handle very large packages', () => {
      const result = sort(1000, 1000, 1000, 1000)
      expect(result).toBe('REJECTED')
    })
  })

  describe('Complex Scenarios', () => {
    it('should handle package that is bulky by both volume and dimension', () => {
      const result = sort(200, 100, 100, 15) // Volume > 1M and dimension > 150
      expect(result).toBe('SPECIAL')
    })

    it('should prioritize REJECTED when both bulky and heavy', () => {
      const result = sort(200, 200, 200, 50)
      expect(result).toBe('REJECTED')
    })

    it('should handle multiple dimensions above threshold', () => {
      const result = sort(200, 200, 10, 15) // Two dimensions above 150
      expect(result).toBe('SPECIAL')
    })
  })

  describe('Detailed Results', () => {
    it('should provide detailed analysis for standard packages', () => {
      const result = sortWithDetails(50, 50, 50, 10)
      
      expect(result).toEqual({
        width: 50,
        height: 50,
        length: 50,
        mass: 10,
        volume: 125000,
        type: 'STANDARD',
        isBulky: false,
        isHeavy: false,
        reason: 'Package meets standard criteria'
      })
    })

    it('should provide detailed analysis for bulky packages (volume)', () => {
      const result = sortWithDetails(100, 100, 100, 15)
      
      expect(result.type).toBe('SPECIAL')
      expect(result.isBulky).toBe(true)
      expect(result.isHeavy).toBe(false)
      expect(result.volume).toBe(1000000)
      expect(result.reason).toContain('volume')
    })

    it('should provide detailed analysis for bulky packages (dimension)', () => {
      const result = sortWithDetails(150, 10, 10, 15)
      
      expect(result.type).toBe('SPECIAL')
      expect(result.isBulky).toBe(true)
      expect(result.isHeavy).toBe(false)
      expect(result.reason).toContain('dimension')
    })

    it('should provide detailed analysis for heavy packages', () => {
      const result = sortWithDetails(50, 50, 50, 25)
      
      expect(result.type).toBe('SPECIAL')
      expect(result.isBulky).toBe(false)
      expect(result.isHeavy).toBe(true)
      expect(result.reason).toContain('heavy')
    })

    it('should provide detailed analysis for rejected packages', () => {
      const result = sortWithDetails(200, 100, 100, 30)
      
      expect(result.type).toBe('REJECTED')
      expect(result.isBulky).toBe(true)
      expect(result.isHeavy).toBe(true)
      expect(result.reason).toContain('both bulky and heavy')
    })
  })

  describe('Input Validation', () => {
    it('should handle decimal values correctly', () => {
      const result = sort(149.9, 10.5, 10.1, 19.9)
      expect(result).toBe('STANDARD')
    })

    it('should handle very precise decimal values', () => {
      const result = sort(150.1, 10, 10, 15)
      expect(result).toBe('SPECIAL')
    })


  })

  describe('Comprehensive Combination Testing', () => {
    // Test matrix: [dimension scenarios] × [mass scenarios]
    const dimensionScenarios = [
      { name: 'tiny', dims: [1, 1, 1], bulky: false },
      { name: 'small standard', dims: [10, 10, 10], bulky: false },
      { name: 'large standard', dims: [149, 50, 50], bulky: false },
      { name: 'just under volume threshold', dims: [99, 99, 99], bulky: false }, // ~970k volume
      { name: 'exactly volume threshold', dims: [100, 100, 100], bulky: true }, // 1M volume
      { name: 'over volume threshold', dims: [101, 100, 100], bulky: true },
      { name: 'exactly dimension threshold (width)', dims: [150, 10, 10], bulky: true },
      { name: 'exactly dimension threshold (height)', dims: [10, 150, 10], bulky: true },
      { name: 'exactly dimension threshold (length)', dims: [10, 10, 150], bulky: true },
      { name: 'over dimension threshold', dims: [200, 50, 50], bulky: true },
      { name: 'multiple large dimensions', dims: [200, 200, 50], bulky: true },
      { name: 'huge package', dims: [500, 500, 500], bulky: true }
    ]

    const massScenarios = [
      { name: 'very light', mass: 0.1, heavy: false },
      { name: 'light', mass: 5, heavy: false },
      { name: 'just under threshold', mass: 19.9, heavy: false },
      { name: 'exactly threshold', mass: 20, heavy: true },
      { name: 'over threshold', mass: 25, heavy: true },
      { name: 'very heavy', mass: 100, heavy: true }
    ]

    dimensionScenarios.forEach(dimScenario => {
      massScenarios.forEach(massScenario => {
        const expectedType = (() => {
          if (dimScenario.bulky && massScenario.heavy) return 'REJECTED'
          if (dimScenario.bulky || massScenario.heavy) return 'SPECIAL'
          return 'STANDARD'
        })()

        it(`${dimScenario.name} + ${massScenario.name} → ${expectedType}`, () => {
          const [width, height, length] = dimScenario.dims
          const result = sort(width, height, length, massScenario.mass)
          expect(result).toBe(expectedType)
        })
      })
    })
  })

  describe('Boundary Value Testing', () => {
    // Test values exactly at, just below, and just above thresholds
    const boundaryTests = [
      // Volume threshold (1,000,000 cm³)
      { desc: 'volume just below threshold', dims: [99.99, 99.99, 99.99], mass: 10, expected: 'STANDARD' },
      { desc: 'volume exactly at threshold', dims: [100, 100, 100], mass: 10, expected: 'SPECIAL' },
      { desc: 'volume just above threshold', dims: [100.01, 100, 100], mass: 10, expected: 'SPECIAL' },
      
      // Dimension threshold (150 cm)
      { desc: 'dimension just below threshold', dims: [149.99, 10, 10], mass: 10, expected: 'STANDARD' },
      { desc: 'dimension exactly at threshold', dims: [150, 10, 10], mass: 10, expected: 'SPECIAL' },
      { desc: 'dimension just above threshold', dims: [150.01, 10, 10], mass: 10, expected: 'SPECIAL' },
      
      // Mass threshold (20 kg)
      { desc: 'mass just below threshold', dims: [50, 50, 50], mass: 19.99, expected: 'STANDARD' },
      { desc: 'mass exactly at threshold', dims: [50, 50, 50], mass: 20, expected: 'SPECIAL' },
      { desc: 'mass just above threshold', dims: [50, 50, 50], mass: 20.01, expected: 'SPECIAL' },
      
      // Combined thresholds
      { desc: 'both bulky and heavy at thresholds', dims: [150, 10, 10], mass: 20, expected: 'REJECTED' },
      { desc: 'volume bulky + heavy', dims: [100, 100, 100], mass: 25, expected: 'REJECTED' }
    ]

    boundaryTests.forEach(({ desc, dims, mass, expected }) => {
      it(`should handle ${desc}`, () => {
        const [width, height, length] = dims
        const result = sort(width, height, length, mass)
        expect(result).toBe(expected)
      })
    })
  })

  describe('Extreme Value Testing', () => {
    it('should handle very large valid values', () => {
      expect(() => sort(1000000, 1000000, 1000000, 1000000)).not.toThrow()
      const result = sort(1000000, 1000000, 1000000, 1000000)
      expect(result).toBe('REJECTED')
    })

    it('should handle very small valid values', () => {
      const result = sort(0.001, 0.001, 0.001, 0.001)
      expect(result).toBe('STANDARD')
    })

    it('should handle decimal precision', () => {
      const result = sort(149.999999, 50.123456, 50.654321, 19.999999)
      expect(result).toBe('STANDARD')
    })
  })

  describe('Real-world Test Cases', () => {
    const testCases = [
      { name: 'Small box', input: [30, 20, 10, 2], expected: 'STANDARD' as PackageType },
      { name: 'Large TV box', input: [180, 100, 20, 15], expected: 'SPECIAL' as PackageType },
      { name: 'Heavy machinery part', input: [80, 60, 40, 25], expected: 'SPECIAL' as PackageType },
      { name: 'Industrial equipment', input: [200, 150, 100, 50], expected: 'REJECTED' as PackageType },
      { name: 'Furniture', input: [120, 80, 60, 18], expected: 'STANDARD' as PackageType },
      { name: 'Appliance', input: [90, 90, 90, 22], expected: 'SPECIAL' as PackageType },
      { name: 'Envelope', input: [0.1, 20, 30, 0.05], expected: 'STANDARD' as PackageType },
      { name: 'Long pipe', input: [200, 5, 5, 10], expected: 'SPECIAL' as PackageType },
      { name: 'Dense metal block', input: [10, 10, 10, 50], expected: 'SPECIAL' as PackageType }
    ]

    testCases.forEach(({ name, input, expected }) => {
      it(`should correctly classify ${name}`, () => {
        const [width, height, length, mass] = input
        const result = sort(width, height, length, mass)
        expect(result).toBe(expected)
      })
    })
  })

  describe('sortWithDetails validation', () => {
    it('should also validate inputs in detailed function', () => {
      expect(() => sortWithDetails(0, 10, 10, 5)).toThrow('Package dimensions and mass must be positive values greater than 0')
      expect(() => sortWithDetails(10, 10, 10, -1)).toThrow('Package dimensions and mass must be positive values greater than 0')
    })

    it('should provide detailed analysis with validation', () => {
      const result = sortWithDetails(50, 50, 50, 10)
      expect(result.type).toBe('STANDARD')
      expect(result.isBulky).toBe(false)
      expect(result.isHeavy).toBe(false)
    })
  })
})