import { describe, expect, it } from 'vitest';

import shuffle from '~/shuffle';


describe('shuffle', () => {
    it('returns same empty array', () => {
        let arr: number[] = [],
            result = shuffle(arr);

        expect(result).toBe(arr);
        expect(result).toEqual([]);
    });

    it('returns array with single element', () => {
        let arr = [42],
            result = shuffle(arr);

        expect(result).toEqual([42]);
    });

    it('preserves all elements', () => {
        let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            result = shuffle([...arr], 'preserve-test');

        expect(result.slice().sort((a, b) => a - b)).toEqual(arr);
    });

    it('mutates in place and returns same reference', () => {
        let arr = [1, 2, 3, 4, 5],
            result = shuffle(arr, 'ref-test');

        expect(result).toBe(arr);
    });

    it('is deterministic with same seed', () => {
        let a = shuffle([1, 2, 3, 4, 5], 'seed'),
            b = shuffle([1, 2, 3, 4, 5], 'seed');

        expect(a).toEqual(b);
        expect(a).toEqual([2, 3, 4, 5, 1]);
    });

    it('actually shuffles with many elements', () => {
        let original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            differed = false;

        for (let i = 0; i < 10; i++) {
            let result = shuffle([...original]);
            let same = true;

            for (let j = 0, n = original.length; j < n; j++) {
                if (result[j] !== original[j]) {
                    same = false;
                    break;
                }
            }

            if (!same) {
                differed = true;
                break;
            }
        }

        expect(differed).toBe(true);
    });
});
