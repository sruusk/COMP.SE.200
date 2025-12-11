require ('jest-chain')

describe('toString (ESM module)', () => {
    let toString
    let isSymbol

    beforeAll(async () => {
        
        const module = await import('../src/toString.js')
        toString = module.default
        const isSymbolModule = await import('../src/isSymbol.js') 
        isSymbol = isSymbolModule.default
    })

    // --- Core Functionality Tests ---

    test('returns the value unchanged if it is already a string', () => {
        const input = 'hello world'
        expect(toString(input))
            .toBe(input)
            .toBe('hello world')
    })

    // --- Edge Case Tests: Explicit Requirements ---

    test('returns an empty string for null values (documented example)', () => {
        expect(toString(null))
            .toBe('')
    })

    test('returns an empty string for undefined values', () => {
        expect(toString(undefined))
            .toBe('')
    })

    test('preserves the sign of -0 (documented example)', () => {
        expect(toString(-0))
            .toBe('-0')
    })

    test('converts positive zero (0) to a standard "0"', () => {
        // Note: The constant 1 / 0 is INFINITY
        expect(toString(0))
            .toBe('0')
    })

    test('returns an empty string when called with no arguments (implicit undefined)', () => {
        // Calling toString() results in 'value' being undefined
        expect(toString()).toBe('')
    })

    // --- Array Handling Tests ---

    test('converts an array of numbers to a comma-separated string (documented example)', () => {
        const array = [1, 2, 3]
        expect(toString(array))
            .toBe('1,2,3')
    })

    test('handles arrays with null and undefined elements', () => {
        // The implementation specifically handles null/undefined in the array map
        const array = [4, null, undefined, 5]
        expect(toString(array))
            .toBe('4,,,5') // This verifies the recursive toString logic: (other == null ? other : toString(other))
    })

    test('handles arrays of mixed types', () => {
        const array = [true, 'b', 3, null]
        expect(toString(array))
            .toBe('true,b,3,')
    })

    test('handles nested arrays (testing recursion)', () => {
        const array = [1, [2, 3], 4]
        // The output will be: '1,2,3,4'
        expect(toString(array))
            .toBe('1,2,3,4')
    })

    // --- Symbol Handling Tests ---

    test('converts a Symbol to its string representation', () => {
        // This test relies on the internal 'isSymbol' function returning true.
        const symbolValue = Symbol('test')
        // We expect the internal check to pass and call value.toString()
        // The result of Symbol('test').toString() is "Symbol(test)"
        expect(toString(symbolValue))
            .toBe('Symbol(test)')
    })

    test('handles a Symbol created with no description', () => {
        const symbolValue = Symbol()
        expect(toString(symbolValue))
            .toBe('Symbol()')
    })

    // --- Standard Number/Boolean/Object Tests ---

    test('converts standard numbers to strings', () => {
        expect(toString(12345))
            .toBe('12345')
    })

    test('converts boolean values to strings', () => {
        expect(toString(true)).toBe('true')
        expect(toString(false)).toBe('false')
    })

    test('converts NaN to "NaN"', () => {
        expect(toString(NaN))
            .toBe('NaN')
    })

    test('converts Infinity to "Infinity"', () => {
        expect(toString(Infinity))
            .toBe('Infinity')
    })

    test('converts a plain object to "[object Object]"', () => {
        expect(toString({a: 1, b: 2}))
            .toBe('[object Object]')
    })
})