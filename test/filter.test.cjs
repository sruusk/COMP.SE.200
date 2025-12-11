require ('jest-chain')

describe('filter (ESM module)', () => {
    let filter

    beforeAll(async () => {
    // Dynamically import the ESM module
    ({ default: filter } = await import('../src/filter.js'))
    })

    // --- Core Functionality Tests ---

    test('filters an array of objects based on a property (documented example)', () => {
    const users = [
      { 'user': 'barney', 'active': true },
      { 'user': 'fred',   'active': false },
      { 'user': 'pebbles', 'active': true }
    ]
    const predicate = ({ active }) => active

    const result = filter(users, predicate)
    
    // Expect only the active users
    expect(result)
      .toEqual([
        { 'user': 'barney', 'active': true },
        { 'user': 'pebbles', 'active': true }
      ])
    })

    test('filters an array of numbers using a simple condition', () => {
    const numbers = [1, 5, 10, 2, 7, 12]
    const predicate = (n) => n > 6

    const result = filter(numbers, predicate)
    
    expect(result)
      .toEqual([10, 7, 12])
    })

    test('returns an empty array if no elements match the predicate', () => {
    const numbers = [1, 2, 3]
    const predicate = (n) => n > 100 // Impossible condition

    const result = filter(numbers, predicate)
    
    // The contract specifies returning a new array
    expect(result)
      .toEqual([])
    })

    // --- Argument and Side-Effect Tests ---

    test('passes value, index, and array to the predicate', () => {
    const array = ['a', 'b', 'c']
    const predicate = jest.fn((value, index, arr) => value === 'b')

    filter(array, predicate)

    // Check the calls made to the predicate function
    expect(predicate).toHaveBeenCalledTimes(3)

    // Check arguments of the first call
    expect(predicate.mock.calls[0][0]).toBe('a')     // value
    expect(predicate.mock.calls[0][1]).toBe(0)     // index
    expect(predicate.mock.calls[0][2]).toEqual(array) // array

    // Check arguments of the second call
    expect(predicate.mock.calls[1][0]).toBe('b')     // value
    expect(predicate.mock.calls[1][1]).toBe(1)     // index
    })

    test('does not mutate the original array', () => {
    const original = [1, 2, 3]
    const predicate = (n) => n > 1

    filter(original, predicate)

    // The original array must remain unchanged
    expect(original)
      .toEqual([1, 2, 3])
    })

    // --- Edge Case and Negative Tests ---

    test('returns an empty array when given an empty input array', () => {
    const result = filter([], (n) => n > 1)
    
    expect(result)
      .toEqual([])
    })

    test('returns an empty array for null or undefined input', () => {
    const predicate = () => true
    
    // Expect it to handle null/undefined gracefully by returning an empty array
    expect(filter(null, predicate)).toEqual([])
    expect(filter(undefined, predicate)).toEqual([])
    })

    test('throws TypeError if predicate is missing or not a function', () => {
    // Missing predicate
    expect(() => filter([1, 2])).toThrow(TypeError)

    // Non-function predicate
    expect(() => filter([1, 2], 'not a function')).toThrow(TypeError)
    })
})