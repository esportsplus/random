import { describe, expect, it } from 'vitest';

import roll from '~/roll';


describe('roll', () => {
    describe('validation', () => {
        it('throws when numerator is 0', () => {
            expect(() => roll(0, 6)).toThrow('@esportsplus/random: numerator and denominator must be positive');
        });

        it('throws when numerator is negative', () => {
            expect(() => roll(-1, 6)).toThrow('@esportsplus/random: numerator and denominator must be positive');
        });

        it('throws when denominator is 0', () => {
            expect(() => roll(1, 0)).toThrow('@esportsplus/random: numerator and denominator must be positive');
        });

        it('throws when denominator is negative', () => {
            expect(() => roll(1, -1)).toThrow('@esportsplus/random: numerator and denominator must be positive');
        });
    });

    describe('output', () => {
        it('returns a boolean', () => {
            expect(typeof roll(1, 2)).toBe('boolean');
        });

        it('1/1 always returns true', () => {
            for (let i = 0; i < 100; i++) {
                expect(roll(1, 1)).toBe(true);
            }
        });
    });

    describe('determinism', () => {
        it('same seed produces same result', () => {
            let a = roll(1, 2, 'test-seed'),
                b = roll(1, 2, 'test-seed');

            expect(a).toBe(b);
        });
    });

    describe('distribution', () => {
        it('roll(1, 2) is roughly 50% true over 1000 trials', () => {
            let trueCount = 0;

            for (let i = 0; i < 1000; i++) {
                if (roll(1, 2)) {
                    trueCount++;
                }
            }

            expect(trueCount).toBeGreaterThan(400);
            expect(trueCount).toBeLessThan(600);
        });
    });
});
