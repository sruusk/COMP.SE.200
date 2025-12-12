require('jest-chain')

describe('upperFirst (Phase 1 Plan)', () => {
  let upperFirst

  beforeAll(async () => {
    ({ default: upperFirst } = await import('../src/upperFirst.js'))
  })

  test('converts the first character to uppercase', () => {
    expect(upperFirst('matti')).toBe('Matti')
    expect(upperFirst('MATTI')).toBe('MATTI')
  })

  test('throws strings with whitespace and numbers at start', () => {
    expect(upperFirst(' hello')).toBe(' hello')
    expect(upperFirst('1hello')).toBe('1hello')
  })

  test('throws empty, null, and undefined inputs', () => {
    expect(upperFirst('')).toBe('')
    expect(upperFirst(null)).toBe('')
    expect(upperFirst(undefined)).toBe('')
  })

  test('handles strings with Unicode characters', () => {
    expect(upperFirst('öäåüúûâ')).toBe('Öäåüúûâ')
    expect(upperFirst('😒emoji')).toBe('😒emoji')
  })
})

