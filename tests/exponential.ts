import { describe, expect, it } from 'vitest';

import exponential from '~/exponential';


describe('exponential', () => {
    describe('lambda <= 0 throws', () => {
        it('throws when lambda is zero', () => {
            expect(() => exponential(0)).toThrow('@esportsplus/random: lambda must be positive');
        });

        it('throws when lambda is negative', () => {
            expect(() => exponential(-1)).toThrow('@esportsplus/random: lambda must be positive');
        });
    });

    describe('returns positive number', () => {
        it('output is always > 0', () => {
            for (let i = 0; i < 100; i++) {
                expect(exponential(1)).toBeGreaterThan(0);
            }
        });
    });

    describe('deterministic with seed', () => {
        it('same seed produces same output', () => {
            let a = exponential(1, 'fixed'),
                b = exponential(1, 'fixed'),
                c = exponential(1, 'fixed');

            expect(a).toBe(b);
            expect(b).toBe(c);
        });
    });

    describe('statistical validation', () => {
        it('sample mean approximates 1/lambda', () => {
            let lambda = 1,
                n = 10000,
                sum = 0;

            for (let i = 0; i < n; i++) {
                sum += exponential(lambda);
            }

            let sampleMean = sum / n;

            expect(sampleMean).toBeGreaterThan(0.9);
            expect(sampleMean).toBeLessThan(1.1);
        });
    });
});
