require('jest-chain')

describe('capitalize (ESM module)', () => {
    let capitalize

    beforeAll(async () => {
        const module = await import('../src/capitalize.js')
        capitalize = module.default
    })

    // --- Core Functionality Tests (Documented Examples) ---

    test('converts an all-uppercase word to capitalized format (documented example)', () => {
        expect(capitalize('FRED'))
            .toBe('Fred')
    })
    
    test('converts an all-lowercase word to capitalized format', () => {
        expect(capitalize('barney'))
            .toBe('Barney')
    })

    test('converts a mixed-case word to capitalized format', () => {
        expect(capitalize('fReD'))
            .toBe('Fred')
    })

    test('handles strings with spaces and multiple words', () => {
        // The function operates only on the first character of the entire string.
        expect(capitalize('hello world'))
            .toBe('Hello world')
        expect(capitalize(' HELLO WORLD'))
            .toBe(' hello world')
    })

    // --- Edge Case and Negative Tests (Focus on the toString dependency) ---

    test('returns an empty string when given an empty string', () => {
        expect(capitalize(''))
            .toBe('')
    })

    test('returns an empty string when given null input', () => {
        expect(capitalize(null))
            .toBe('')
    })

    test('returns an empty string when given undefined input', () => {
        expect(capitalize(undefined))
            .toBe('')
    })

    test('handles a string starting with a number', () => {
        expect(capitalize('123abc'))
            .toBe('123abc')
    })

    test('handles non-string input that coerces to a string', () => {
        expect(capitalize(123))
            .toBe('123')
        
        expect(capitalize(true))
            .toBe('True')
    })
})