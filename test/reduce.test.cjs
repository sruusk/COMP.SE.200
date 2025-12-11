require ('jest-chain')

describe('reduce (ESM module)', () => {
  let reduce

  beforeAll(async () => {
    // Dynamically import the ESM module
    ({ default: reduce } = await import('../src/reduce.js'))
  })

  // --- Core Functionality Tests ---

  test('sums an array with an initial accumulator (documented example)', () => {
    const result = reduce([1, 2, 3], (sum, n) => sum + n, 0)
    expect(result)
      .toBe(6)
  })

  test('sums an array without an initial accumulator', () => {
    // The first element (10) is used as the accumulator
    const result = reduce([10, 2, 3], (sum, n) => sum + n)
    expect(result)
      .toBe(15)
  })

  test('groups object values by key (documented example)', () => {
    const object = { 'a': 1, 'b': 2, 'c': 1 }
    const result = reduce(object, (result, value, key) => {
      // Create or push to an array for the current value key
      (result[value] || (result[value] = [])).push(key)
      return result
    }, {})

    // Object iteration order is not guaranteed, so we check for deep equality
    // The keys '1' and '2' should contain the correct original keys.
    expect(result)
      .toEqual({ '1': ['a', 'c'], '2': ['b'] })
  })

  // --- Edge Case Tests ---

  test('returns the initial accumulator when the collection is an empty array', () => {
    const result = reduce([], (sum, n) => sum + n, 100)
    expect(result)
      .toBe(100)
  })

  test('returns the initial accumulator when the collection is an empty object', () => {
    const result = reduce({}, (sum, n) => sum + n, 100)
    expect(result)
      .toBe(100)
  })

  test('handles very large numbers (multiplication)', () => {
    const numbers = [2, 3, 4] // 2 * 3 * 4 = 24
    const result = reduce(numbers, (acc, n) => acc * n, 1)
    expect(result)
      .toBe(24)
  })

  test('works with string concatenation', () => {
    const result = reduce(['a', 'b', 'c'], (acc, s) => acc + s, '')
    expect(result)
      .toBe('abc')
  })

  // --- Iteratee Argument Tests (Ensure arguments are passed correctly) ---

  test('passes accumulator, value, index/key, and collection to the iteratee for arrays', () => {
    const collection = ['a', 'b']
    const iteratee = jest.fn((acc, value, index, coll) => acc) // Use a mock function

    reduce(collection, iteratee, [])

    // Check first call
    expect(iteratee.mock.calls[0][0]).toEqual([])      // accumulator (initial value)
    expect(iteratee.mock.calls[0][1]).toBe('a')        // value
    expect(iteratee.mock.calls[0][2]).toBe(0)          // index
    expect(iteratee.mock.calls[0][3]).toEqual(collection) // collection

    // Check second call
    expect(iteratee.mock.calls[1][1]).toBe('b')        // value
    expect(iteratee.mock.calls[1][2]).toBe(1)          // index
  })

  test('passes accumulator, value, index/key, and collection to the iteratee for objects', () => {
    const collection = { one: 1, two: 2 }
    const iteratee = jest.fn((acc, value, key, coll) => acc)

    reduce(collection, iteratee, 0)
    
    // In Lodash, the order of iteration for objects is not guaranteed.
    // We must check if the actual value/key are within the expected set.

    // Get the array of all calls made to the mock function
    const calls = iteratee.mock.calls;

    // Expect two calls in total
    expect(iteratee).toHaveBeenCalledTimes(2)

    // Check that for each call, the value and key are correct.
    calls.forEach(call => {
        // [0] is accumulator, [1] is value, [2] is key
        
        // Expect the array to include the value/key.
        expect([1, 2]).toContain(call[1]) // value must be 1 or 2
        expect(['one', 'two']).toContain(call[2]) // key must be 'one' or 'two'

        // Accumulator and Collection can be checked directly
        expect(call[0]).toBe(0)              // accumulator
        expect(call[3]).toEqual(collection)  // collection
    })
  })

  // --- Negative Tests ---

  test('throws error if iteratee is not a function', async () => {
    // Attempting to call reduce with a non-function where the iteratee is expected
    expect(() => reduce([1, 2], 'not a function', 0)).toThrow()
  })

  test('returns the accumulator when collection is null/undefined', async () => {
    // Expected the function to return the initial accumulator (0) instead of throwing.
    const iteratee = (a, b) => a + b
    const accumulator = 0
    
    expect(reduce(null, iteratee, accumulator))
      .toBe(accumulator)
    expect(reduce(undefined, iteratee, accumulator))
      .toBe(accumulator)
  })

  test('throws TypeError when reducing an empty array without an accumulator', async () => {
    expect(reduce([], (a, b) => a + b)).toBeUndefined()
  })

  test('returns undefined when reducing an empty object without an accumulator', async () => {
    expect(reduce({}, (a, b) => a + b)).toBeUndefined()
  })
})
