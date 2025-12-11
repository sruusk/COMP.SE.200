require('jest-chain')

describe('isEmpty (ESM module)', () => {
    let isEmpty

    beforeAll(async () => {
        const module = await import('../src/isEmpty.js')
        isEmpty = module.default
    })

    // --- Core Primitive and Nullish Tests (The earliest exit paths) ---

    test('returns true for null values (documented example)', () => {
        expect(isEmpty(null))
            .toBe(true)
    })

    test('returns true for undefined values', () => {
        expect(isEmpty(undefined))
            .toBe(true)
    })

    // --- Array-like Value Tests (Checking length == 0) ---

    test('returns true for an empty array', () => {
        expect(isEmpty([]))
            .toBe(true)
    })

    test('returns false for a non-empty array (documented example)', () => {
        expect(isEmpty([1, 2, 3]))
            .toBe(false)
    })

    test('returns true for an empty string', () => {
        expect(isEmpty(''))
            .toBe(true)
    })

    test('returns false for a non-empty string (documented example)', () => {
        expect(isEmpty('abc'))
            .toBe(false)
    })

    test('returns true for an empty arguments object', () => {
        function getArgs() {
            return arguments;
        }
        expect(isEmpty(getArgs()))
            .toBe(true)
    })

    test('returns false for a non-empty arguments object', () => {
        function getArgs(a, b) {
            return arguments;
        }
        expect(isEmpty(getArgs(1, 2)))
            .toBe(false)
    })

    // --- Map and Set Tests (Checking size == 0) ---

    test('returns true for an empty Map', () => {
        expect(isEmpty(new Map()))
            .toBe(true)
    })

    test('returns false for a non-empty Map', () => {
        expect(isEmpty(new Map([['a', 1]])))
            .toBe(false)
    })

    test('returns true for an empty Set', () => {
        expect(isEmpty(new Set()))
            .toBe(true)
    })

    test('returns false for a non-empty Set', () => {
        expect(isEmpty(new Set([1])))
            .toBe(false)
    })

    // --- Plain Object Tests (Checking for own enumerable properties) ---

    test('returns true for a plain object with no properties', () => {
        expect(isEmpty({}))
            .toBe(true)
    })

    test('returns false for a plain object with enumerable properties (documented example)', () => {
        expect(isEmpty({ 'a': 1 }))
            .toBe(false)
    })

    test('returns true for an object inheriting properties (ignores non-own properties)', () => {
        // Test case where it iterates but hits: if (hasOwnProperty.call(value, key)) { return false }
        function Parent() { this.parentProp = 1 }
        function Child() {}
        Child.prototype = new Parent()
        
        // An instance of Child has no OWN enumerable properties
        expect(isEmpty(new Child())) 
            .toBe(true)
    })

    test('returns false for an object with inherited AND own properties', () => {
        // Ensures own property detection is correct
        function Parent() {}
        function Child() { this.ownProp = 1 }
        Child.prototype = new Parent()
        
        expect(isEmpty(new Child()))
            .toBe(false)
    })

    // --- Primitive Value Tests (Should fall through to Object.keys() / isPrototype check) ---

    test('returns true for a boolean primitive (documented example)', () => {
        // Falls through, hits isPrototype check, then final loop (should return true)
        expect(isEmpty(true))
            .toBe(true)
    })

    test('returns true for a number primitive (documented example)', () => {
        // Falls through, hits isPrototype check, then final loop (should return true)
        expect(isEmpty(1))
            .toBe(true)
    })

    // --- Edge Case: Prototypes ---

    test('returns true for an empty prototype object', () => {
        expect(isEmpty(Array.prototype))
            .toBe(true)
    })

    test('returns false for a prototype object with enumerable properties', () => {
        const obj = {};
        obj.testProp = 1;
        expect(isEmpty(obj))
            .toBe(false)
    })

    test('returns false for a prototype object with own enumerable properties', () => {
        function MyClass() {}
        MyClass.prototype.testProp = 1
        
        expect(isEmpty(MyClass.prototype))
            .toBe(false)
    })
})