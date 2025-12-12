require('jest-chain')

describe('defaultTo', () => {
  let defaultTo

  beforeAll(async () => {
    ({ default: defaultTo } = await import('../src/defaultTo.js'))
  })

  test('returns the provided value when it is not nullish', () => {
    expect(defaultTo(3, 10)).toBe(3)
    expect(defaultTo('value', 'fallback')).toBe('value')
  })

  test('uses the default for nullish and NaN inputs', () => {
    expect(defaultTo(null, 'fallback')).toBe('fallback')
    expect(defaultTo(undefined, 42)).toBe(42)
    expect(defaultTo(NaN, 'default-number')).toBe('default-number')
  })

  test('returns provided values for other types', () => {
    const obj = { a: 1 }
    const arr = [1, 2, 3]

    expect(defaultTo(0, 5)).toBe(0)
    expect(defaultTo(false, true)).toBe(false)
    expect(defaultTo('', 'default')).toBe('')
    expect(defaultTo(obj, 'fallback')).toBe(obj)
    expect(defaultTo(arr, [])).toBe(arr)
  })

  test('return provided values when default is nullish', () => {
    expect(defaultTo('value', undefined)).toBe('value')
    expect(defaultTo(123, undefined)).toBe(123)
    expect(defaultTo('value', null)).toBe('value')
    expect(defaultTo(123, NaN)).toBe(123)
  })
})
