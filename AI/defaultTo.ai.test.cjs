require('jest-chain')

describe('AI defaultTo', () => {
  let defaultTo

  beforeAll(async () => {
    ({ default: defaultTo } = await import('../src/defaultTo.js'))
  })

  describe('returns the default value when value is NaN, null or undefined', () => {
    const fallback = 'default-result'

    test.each([
      ['NaN', NaN],
      ['undefined', undefined],
      ['null', null]
    ])('value is %s', (_, input) => {
      expect(defaultTo(input, fallback))
        .toBe(fallback)
    })
  })

  describe('returns the provided value for any other input type', () => {
    const fallback = Symbol('unused-default')

    test.each([
      ['number', 42],
      ['string', 'tuni'],
      ['array', [1, 2, 3]],
      ['object', { campus: 'Tampere' }],
      ['boolean', false]
    ])('%s input is preserved', (_, input) => {
      expect(defaultTo(input, fallback))
        .toBe(input)
    })
  })
})
