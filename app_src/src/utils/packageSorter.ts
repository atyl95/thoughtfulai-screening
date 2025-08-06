/**
 * Package Sorting Logic
 * 
 * Rules:
 * - BULKY: volume >= 1,000,000 cm³ OR any dimension >= 150 cm
 * - HEAVY: mass >= 20 kg
 * - STANDARD: not bulky and not heavy
 * - SPECIAL: bulky OR heavy (but not both)
 * - REJECTED: bulky AND heavy
 */

export type PackageType = 'STANDARD' | 'SPECIAL' | 'REJECTED'

/**
 * Main sorting function that determines package category
 */
export function sort(width: number, height: number, length: number, mass: number): PackageType {
  validateInputs(width, height, length, mass)
  
  const bulky = isBulky(width, height, length)
  const heavy = isHeavy(mass)

  if (bulky && heavy) {
    return 'REJECTED'
  } else if (bulky || heavy) {
    return 'SPECIAL'
  } else {
    return 'STANDARD'
  }
}

export interface PackageInput {
  width: number
  height: number
  length: number
  mass: number
}

export interface PackageResult extends PackageInput {
  type: PackageType
  volume: number
  isBulky: boolean
  isHeavy: boolean
  reason: string
}

/**
 * Determines if a package is bulky based on volume or dimensions
 */
function isBulky(width: number, height: number, length: number): boolean {
  const volume = width * height * length
  const hasLargeDimension = width >= 150 || height >= 150 || length >= 150
  return volume >= 1_000_000 || hasLargeDimension
}

/**
 * Determines if a package is heavy based on mass
 */
function isHeavy(mass: number): boolean {
  return mass >= 20
}

/**
 * Validates package inputs - no impossible dimensions allowed
 */
function validateInputs(width: number, height: number, length: number, mass: number): void {
  if (width <= 0 || height <= 0 || length <= 0 || mass <= 0) {
    throw new Error('Package dimensions and mass must be positive values greater than 0')
  }
  
  if (!isFinite(width) || !isFinite(height) || !isFinite(length) || !isFinite(mass)) {
    throw new Error('Package dimensions and mass must be finite numbers')
  }
}

/**
 * Enhanced sorting function that returns detailed information
 */
export function sortWithDetails(width: number, height: number, length: number, mass: number): PackageResult {
  validateInputs(width, height, length, mass)
  
  const volume = width * height * length
  const bulky = isBulky(width, height, length)
  const heavy = isHeavy(mass)
  const type = sort(width, height, length, mass)

  let reason = ''
  if (type === 'REJECTED') {
    reason = 'Package is both bulky and heavy'
  } else if (type === 'SPECIAL') {
    if (bulky && !heavy) {
      const volumeExceeded = volume >= 1_000_000
      const dimensionExceeded = width >= 150 || height >= 150 || length >= 150
      if (volumeExceeded && dimensionExceeded) {
        reason = 'Package is bulky (volume ≥ 1M cm³ and dimension ≥ 150 cm)'
      } else if (volumeExceeded) {
        reason = 'Package is bulky (volume ≥ 1,000,000 cm³)'
      } else {
        reason = 'Package is bulky (dimension ≥ 150 cm)'
      }
    } else if (heavy && !bulky) {
      reason = 'Package is heavy (mass ≥ 20 kg)'
    }
  } else {
    reason = 'Package meets standard criteria'
  }

  return {
    width,
    height,
    length,
    mass,
    volume,
    type,
    isBulky: bulky,
    isHeavy: heavy,
    reason
  }
}

/**
 * Predefined test cases for demonstration
 */
export const testCases: Array<PackageInput & { name: string }> = [
  {
    name: 'Small Standard Package',
    width: 10,
    height: 10,
    length: 10,
    mass: 5
  },
  {
    name: 'Large Volume (Bulky)',
    width: 100,
    height: 100,
    length: 100,
    mass: 15
  },
  {
    name: 'Long Dimension (Bulky)',
    width: 200,
    height: 10,
    length: 10,
    mass: 10
  },
  {
    name: 'Heavy Package',
    width: 50,
    height: 50,
    length: 50,
    mass: 25
  },
  {
    name: 'Rejected Package',
    width: 200,
    height: 100,
    length: 100,
    mass: 30
  },
  {
    name: 'Edge Case: Exactly 150cm',
    width: 150,
    height: 10,
    length: 10,
    mass: 10
  },
  {
    name: 'Edge Case: Exactly 20kg',
    width: 50,
    height: 50,
    length: 50,
    mass: 20
  }
]