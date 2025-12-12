require('jest-chain')

describe('ceil', () => {
  let ceil

  beforeAll(async () => {
    ({ default: ceil } = await import('../src/ceil.js'))
  })

  test('rounds up to the nearest integer by default', () => {
    expect(ceil(4.006)).toBe(5)
    expect(ceil(-4.006)).toBe(-4)
  })

  test('rounds up with positive precision', () => {
    expect(ceil(6.004, 2)).toBe(6.01)
    expect(ceil(1.204, 2)).toBe(1.21)
  })

  test('rounds up with negative precision', () => {
    expect(ceil(6040, -2)).toBe(6100)
    expect(ceil(-6040, -2)).toBe(-6000)
  })

  test('rounds up with extra negative precision', () => {
    expect(ceil(6040, -10)).toBe(10000000000)
  })

  test('handles zero and already rounded numbers', () => {
    expect(ceil(10)).toBe(10)
    expect(ceil(10, 2)).toBe(10)
    expect(ceil(0)).toBe(0)
  })

  test('handles NaN and undefined values', () => {
    expect(ceil(NaN)).toBeNaN()
    expect(ceil(undefined)).toBeNaN()
  })
})
