import { describe, expect, it } from 'vitest';

import range from '~/range';


describe('range', () => {
    it('throws when min is greater than max', () => {
        expect(() => range(5, 3)).toThrow('@esportsplus/random: min cannot be greater than max');
    });

    it('returns float in [min, max] by default', () => {
        for (let i = 0; i < 100; i++) {
            let result = range(1, 10);

            expect(result).toBeGreaterThanOrEqual(1);
            expect(result).toBeLessThanOrEqual(10);
        }
    });

    it('returns integer in integer mode', () => {
        for (let i = 0; i < 100; i++) {
            let result = range(1, 10, true);

            expect(Number.isInteger(result)).toBe(true);
            expect(result).toBeGreaterThanOrEqual(1);
            expect(result).toBeLessThanOrEqual(10);
        }
    });

    it('returns min when min equals max in float mode', () => {
        let result = range(5, 5, false, 'seed');

        expect(result).toBe(5);
    });

    it('returns min when min equals max in integer mode', () => {
        let result = range(5, 5, true, 'seed');

        expect(result).toBe(5);
    });

    it('is deterministic with same seed', () => {
        let a = range(1, 10, false, 'seed'),
            b = range(1, 10, false, 'seed');

        expect(a).toBe(b);
        expect(a).toBeCloseTo(2.2514521240376526);

        let c = range(1, 10, true, 'seed'),
            d = range(1, 10, true, 'seed');

        expect(c).toBe(d);
        expect(c).toBe(2);
    });

    it('handles fractional min/max in integer mode', () => {
        // range(1.5, 2.5, true) → ceil(1.5)=2, floor(2.5)+1=3, so only 2 is possible
        for (let i = 0; i < 50; i++) {
            expect(range(1.5, 2.5, true)).toBe(2);
        }
    });

    it('returns 0 or 1 for range(0, 1, true)', () => {
        let seen = new Set<number>();

        for (let i = 0; i < 100; i++) {
            let result = range(0, 1, true);

            expect(result === 0 || result === 1).toBe(true);
            seen.add(result);
        }

        expect(seen.size).toBe(2);
    });
});
