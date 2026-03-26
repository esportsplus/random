import { describe, expect, it } from 'vitest';

import between from '~/between';


describe('between', () => {
    it('throws with less than 2 items', () => {
        expect(() => between([])).toThrow('@esportsplus/random: need at least 2 items');
        expect(() => between([1])).toThrow('@esportsplus/random: need at least 2 items');
    });

    it('returns both items when exactly 2', () => {
        let result = between([1, 2], 'seed');

        expect(result).toHaveLength(2);
        expect(result.slice().sort((a, b) => a - b)).toEqual([1, 2]);
    });

    it('returns two different items', () => {
        let items = [10, 20, 30, 40, 50],
            result = between(items, 'seed');

        expect(result[0]).not.toBe(result[1]);
    });

    it('is deterministic with same seed', () => {
        let a = between([10, 20, 30, 40, 50], 'seed'),
            b = between([10, 20, 30, 40, 50], 'seed');

        expect(a).toEqual(b);
        expect(a).toEqual([10, 20]);
    });

    it('returns items from the input array', () => {
        let items = [10, 20, 30, 40, 50],
            result = between(items, 'check');

        expect(items).toContain(result[0]);
        expect(items).toContain(result[1]);
    });
});
