import { describe, expect, it } from 'vitest';

import pick from '~/pick';


describe('pick', () => {
    describe('validation', () => {
        it('throws when items array is empty', () => {
            expect(() => pick([], 1)).toThrow('@esportsplus/random: items cannot be empty');
        });

        it('throws when count is 0', () => {
            expect(() => pick([1], 0)).toThrow('@esportsplus/random: count must be positive');
        });

        it('throws when count is negative', () => {
            expect(() => pick([1], -1)).toThrow('@esportsplus/random: count must be positive');
        });
    });

    describe('output', () => {
        it('returns correct count of items', () => {
            let result = pick([1, 2, 3], 5);

            expect(result).toHaveLength(5);
        });

        it('all returned items exist in source array', () => {
            let items = ['a', 'b', 'c', 'd'],
                result = pick(items, 20);

            for (let i = 0, n = result.length; i < n; i++) {
                expect(items).toContain(result[i]);
            }
        });

        it('allows duplicates when count exceeds items length', () => {
            let items = [1, 2],
                result = pick(items, 100);

            expect(result).toHaveLength(100);

            for (let i = 0, n = result.length; i < n; i++) {
                expect(items).toContain(result[i]);
            }
        });
    });

    describe('determinism', () => {
        it('same seed produces same result', () => {
            let a = pick([1, 2, 3, 4, 5], 3, 'test-seed'),
                b = pick([1, 2, 3, 4, 5], 3, 'test-seed');

            expect(a).toEqual(b);
        });
    });
});
