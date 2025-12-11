require('jest-chain')

describe('add (ESM module)', () => {
  let add

  beforeAll(async () => {
    // Dynamically import the ESM module
    ({ default: add } = await import('../src/add.js'))
  })

  test('adds two numbers', () => {
    const result = add(6, 4)
    expect(result)
      .toBe(10)
  })

  test('add a negative number', () => {
    const result = add(-6, 4)
    expect(result)
      .toBe(-2)
  })

  test('add a float number', () => {
    const result = add(6.5, 4.5)
    expect(result)
      .toBe(11)
  })

  test('add two negative numbers', () => {
    const result = add(-6, -4)
    expect(result)
      .toBe(-10)
  })

  test('add two strings', () => {
    const result = add('6', '4')
    expect(result)
      .toBe('64')
  })

  test('uses default when one argument is undefined', () => {
    expect(add(undefined, 5)).toBe(5)
    expect(add(7, undefined)).toBe(7)
  })

  test('uses default when both arguments are undefined', () => {
    expect(add(undefined, undefined)).toBe(0)
  })

  test('NaN when math cannot be performed', () => {
    expect(add(NaN, 2)).toBeNaN()
    expect(add(2, NaN)).toBeNaN()
  })
})
