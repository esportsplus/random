import { describe, expect, it } from 'vitest';

import sample from '~/sample';


describe('sample', () => {
    it('throws when items is empty', () => {
        expect(() => sample([], 1)).toThrow('@esportsplus/random: items cannot be empty');
    });

    it('throws when count is 0 or negative', () => {
        expect(() => sample([1], 0)).toThrow('@esportsplus/random: count must be positive');
        expect(() => sample([1], -1)).toThrow('@esportsplus/random: count must be positive');
    });

    it('throws when count exceeds items length', () => {
        expect(() => sample([1, 2], 3)).toThrow('@esportsplus/random: count cannot exceed items length');
    });

    it('returns correct count', () => {
        let result = sample([1, 2, 3, 4, 5], 3, 'seed');

        expect(result).toHaveLength(3);
    });

    it('returns no duplicates', () => {
        let result = sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5, 'no-dup'),
            unique = new Set(result);

        expect(unique.size).toBe(result.length);
    });

    it('returns only items from source', () => {
        let input = [10, 20, 30, 40, 50],
            result = sample(input, 3, 'source-check');

        for (let i = 0, n = result.length; i < n; i++) {
            expect(input).toContain(result[i]);
        }
    });

    it('is deterministic with same seed', () => {
        let a = sample([1, 2, 3, 4, 5], 3, 'seed'),
            b = sample([1, 2, 3, 4, 5], 3, 'seed');

        expect(a).toEqual(b);
        expect(a).toEqual([2, 3, 4]);
    });

    it('returns all items when count equals length', () => {
        let input = [1, 2, 3, 4, 5],
            result = sample(input, 5, 'seed');

        expect(result).toHaveLength(5);
        expect(result.slice().sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
    });
});
