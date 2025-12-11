require('jest-chain')

describe('toNumber (ESM module)', () => {
  let toNumber
  let isSymbol
  let isObject

  beforeAll(async () => {
    const module = await import('../src/toNumber.js')
    toNumber = module.default
    const isSymbolModule = await import('../src/isSymbol.js') 
    isSymbol = isSymbolModule.default
    const isObjectModule = await import('../src/isObject.js')
    isObject = isObjectModule.default
  })

  // --- Core Number/String Tests (Documented Examples) ---

  test('returns the value unchanged if it is already a floating point number', () => {
    expect(toNumber(3.2))
      .toBe(3.2)
  })

  test('returns the value unchanged if it is an integer', () => {
    expect(toNumber(100))
      .toBe(100)
  })

  test('returns the value unchanged for minimum value (documented example)', () => {
    expect(toNumber(Number.MIN_VALUE))
      .toBe(5e-324)
  })

  test('returns the value unchanged for Infinity (documented example)', () => {
    expect(toNumber(Infinity))
      .toBe(Infinity)
  })

  test('converts a simple decimal string to a number (documented example)', () => {
    expect(toNumber('3.2'))
      .toBe(3.2)
  })

  test('converts an integer string to a number', () => {
    expect(toNumber('12345'))
      .toBe(12345)
  })

  // --- String Edge Cases (reTrim, reIsBinary, reIsOctal, reIsBadHex) ---

  test('trims leading and trailing whitespace from strings', () => {
    expect(toNumber('  42.5  '))
      .toBe(42.5)
  })

  test('handles positive signed strings', () => {
    expect(toNumber('+10'))
      .toBe(10)
  })

  test('handles negative signed strings', () => {
    expect(toNumber('-10'))
      .toBe(-10)
  })

  test('converts binary strings (0b prefix) using base 2', () => {
    // 0b1011 = 11 decimal
    expect(toNumber('0b1011'))
      .toBe(11)
  })

  test('converts octal strings (0o prefix) using base 8', () => {
    // 0o12 = 10 decimal
    expect(toNumber('0o12'))
      .toBe(10)
  })

  test('returns NaN for bad signed hexadecimal strings (reIsBadHex)', () => {
    // Lodash/toNumber often returns NaN for signed hex to prevent parsing issues
    expect(toNumber('-0x1A'))
      .toBeNaN()
    expect(toNumber('+0x1A'))
      .toBeNaN()
  })

  test('converts standard hexadecimal strings correctly', () => {
    expect(toNumber('0x1A')) // 26 decimal
      .toBe(26)
  })

  // --- Special Input Types ---

  test('returns NaN if value is a Symbol', () => {
    const symbolValue = Symbol('test')
    expect(toNumber(symbolValue))
      .toBeNaN()
  })

  test('converts null to 0', () => {
    // `typeof value !== 'string'` is true for null, then `+value` coerces null to 0.
    expect(toNumber(null))
      .toBe(0)
  })

  test('converts undefined to NaN', () => {
    // `typeof value !== 'string'` is true for undefined, then `+value` coerces undefined to NaN.
    expect(toNumber(undefined))
      .toBeNaN()
  })

  test('returns NaN when no value is provided', () => {
    expect(toNumber())
      .toBeNaN()
  })

  test('converts boolean true to 1', () => {
    expect(toNumber(true))
      .toBe(1)
  })

  test('converts boolean false to 0', () => {
    expect(toNumber(false))
      .toBe(0)
  })

  // --- Object Coercion Cases (valueOf/toString) ---

  test('converts object via valueOf if it returns a primitive', () => {
    const obj = { valueOf: () => 10, toString: () => '20' }
    // It should use valueOf() which returns the number 10.
    expect(toNumber(obj))
      .toBe(10)
  })

  test('converts object via toString if valueOf returns a non-primitive', () => {
    const obj = { valueOf: () => ({}), toString: () => '30' }
    // valueOf returns object, so it falls back to toString() -> '30'.
    expect(toNumber(obj))
      .toBe(30)
  })

  test('converts object via toString if valueOf is missing', () => {
    const obj = { toString: () => '50' }
    // valueOf is not a function, so it falls back to toString() -> '50'.
    expect(toNumber(obj))
      .toBe(50)
  })

  test('coerces an object with valueOf explicitly set to non-function', () => {
    const obj = { valueOf: null, toString: () => '40' };
    expect(toNumber(obj)).toBe(40);
});

  test('returns NaN for objects with custom valueOf that returns NaN', () => {
    const obj = { valueOf: () => NaN }
    expect(toNumber(obj))
      .toBeNaN()
  })

  test('correctly converts object via valueOf if it returns zero (0)', () => {
    const obj = { valueOf: () => 0 };
    expect(toNumber(obj)).toBe(0);
  })
})