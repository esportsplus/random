import { describe, expect, it } from 'vitest';

import groups from '~/groups';


describe('groups', () => {
    it('throws when total is 0 or negative', () => {
        expect(() => groups([1, 2, 3], 0)).toThrow('@esportsplus/random: total must be positive');
        expect(() => groups([1, 2, 3], -1)).toThrow('@esportsplus/random: total must be positive');
    });

    it('divides evenly', () => {
        let result = groups([1, 2, 3, 4, 5, 6], 3, 'seed');

        expect(result).toHaveLength(3);

        for (let i = 0, n = result.length; i < n; i++) {
            expect(result[i]).toHaveLength(2);
        }
    });

    it('handles uneven division with all items present', () => {
        let result = groups([1, 2, 3, 4, 5, 6, 7], 3, 'seed');

        expect(result).toHaveLength(3);

        let flat = result.flat().sort((a, b) => a - b);

        expect(flat).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('preserves all items across groups', () => {
        let input = [1, 2, 3, 4, 5, 6];
        let result = groups(input, 3, 'seed');
        let flat = result.flat().sort((a, b) => a - b);

        expect(flat).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('is deterministic with same seed', () => {
        let a = groups([1, 2, 3, 4, 5, 6], 3, 'seed'),
            b = groups([1, 2, 3, 4, 5, 6], 3, 'seed');

        expect(a).toEqual(b);
        expect(a).toEqual([[5, 4], [2, 6], [3, 1]]);
    });

    it('returns empty groups for an empty items array', () => {
        let result = groups([], 3);

        expect(result).toHaveLength(3);

        for (let i = 0, n = result.length; i < n; i++) {
            expect(result[i]).toEqual([]);
        }
    });

    it('never produces an empty group when items >= total', () => {
        let result = groups([1, 2, 3, 4, 5, 6, 7, 8, 9], 4, 'seed');

        expect(result).toHaveLength(4);

        let flat = result.flat().sort((a, b) => a - b);

        expect(flat).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (let i = 0, n = result.length; i < n; i++) {
            expect(result[i].length).toBeGreaterThan(0);
        }
    });

    it('produces empty groups when more groups than items', () => {
        let result = groups([1, 2], 5, 'seed');

        expect(result).toHaveLength(5);

        let flat = result.flat().sort((a, b) => a - b);

        expect(flat).toEqual([1, 2]);

        let emptyCount = 0;

        for (let i = 0, n = result.length; i < n; i++) {
            if (result[i].length === 0) {
                emptyCount++;
            }
        }

        expect(emptyCount).toBeGreaterThan(0);
    });
});
