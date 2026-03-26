import { describe, expect, it } from 'vitest';

import gaussian from '~/gaussian';


describe('gaussian', () => {
    describe('negative stddev throws', () => {
        it('throws when stddev is negative', () => {
            expect(() => gaussian(0, -1)).toThrow('@esportsplus/random: stddev cannot be negative');
        });
    });

    describe('zero stddev', () => {
        it('always returns mean exactly', () => {
            expect(gaussian(5, 0, 'seed-a')).toBe(5);
            expect(gaussian(100, 0, 'seed-b')).toBe(100);
            expect(gaussian(-3, 0, 'seed-c')).toBe(-3);
        });
    });

    describe('deterministic with seed', () => {
        it('same seed produces same output', () => {
            let a = gaussian(10, 5, 'fixed'),
                b = gaussian(10, 5, 'fixed'),
                c = gaussian(10, 5, 'fixed');

            expect(a).toBe(b);
            expect(b).toBe(c);
        });
    });

    describe('returns a number', () => {
        it('output is of type number', () => {
            expect(typeof gaussian(0, 1)).toBe('number');
            expect(typeof gaussian(50, 10, 'seed')).toBe('number');
        });
    });

    describe('statistical validation', () => {
        it('sample mean and stddev approximate parameters', () => {
            let mean = 100,
                n = 10000,
                stddev = 10,
                values: number[] = [];

            for (let i = 0; i < n; i++) {
                values.push(gaussian(mean, stddev));
            }

            let sum = 0;

            for (let i = 0; i < n; i++) {
                sum += values[i];
            }

            let sampleMean = sum / n,
                sumSq = 0;

            for (let i = 0; i < n; i++) {
                let diff = values[i] - sampleMean;

                sumSq += diff * diff;
            }

            let sampleStddev = Math.sqrt(sumSq / (n - 1));

            expect(sampleMean).toBeGreaterThan(mean - 2);
            expect(sampleMean).toBeLessThan(mean + 2);
            expect(sampleStddev).toBeGreaterThan(stddev - 3);
            expect(sampleStddev).toBeLessThan(stddev + 3);
        });
    });
});
