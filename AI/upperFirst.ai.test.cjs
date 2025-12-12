require('jest-chain')

describe('AI upperFirst', () => {
  let upperFirst

  beforeAll(async () => {
    ({ default: upperFirst } = await import('../src/upperFirst.js'))
  })

  test('returns the string with uppercase first letter when starting lowercase', () => {
    expect(upperFirst('tuni'))
      .toBe('Tuni')
  })

  test('returns the exact string when already uppercase', () => {
    expect(upperFirst('Tuni'))
      .toBe('Tuni')
  })

  test('keeps newline and unicode chars while uppercasing first letter', () => {
    expect(upperFirst('\näiti'))
      .toBe('\nÄiti')
  })

  test('throws when first character is not a letter', () => {
    expect(() => upperFirst('1tuni'))
      .toThrow()
  })

  test('throws when input is not a string', () => {
    expect(() => upperFirst(10))
      .toThrow()
  })
})
