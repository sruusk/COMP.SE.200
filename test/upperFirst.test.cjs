require('jest-chain')

describe('upperFirst', () => {
  let upperFirst

  beforeAll(async () => {
    ({ default: upperFirst } = await import('../src/upperFirst.js'))
  })

  test('converts the first character to uppercase', () => {
    expect(upperFirst('matti')).toBe('Matti')
    expect(upperFirst('MATTI')).toBe('MATTI')
  })

  test('throws strings with whitespace and numbers at start', () => {
    expect(upperFirst(' hello')).toThrow()
    expect(upperFirst('1hello')).toThrow()
    expect(upperFirst('😒emoji')).toThrow()
  })

  test('throws empty, null, and undefined inputs', () => {
    expect(upperFirst('')).toThrow()
    expect(upperFirst(null)).toThrow()
    expect(upperFirst(undefined)).toThrow()
  })

  test('handles strings with Unicode characters', () => {
    expect(upperFirst('öäåüúûâ')).toBe('Öäåüúûâ')
  })
})

