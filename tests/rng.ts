import { describe, expect, it } from 'vitest';
import { rng } from '~/rng';


describe('rng', () => {
    describe('determinism', () => {
        it('same seed always returns same value', () => {
            let a = rng('test-seed'),
                b = rng('test-seed'),
                c = rng('test-seed');

            expect(a).toBe(b);
            expect(b).toBe(c);
        });
    });

    describe('different seeds produce different values', () => {
        it('distinct seeds yield distinct outputs', () => {
            let a = rng('seed-a'),
                b = rng('seed-b');

            expect(a).not.toBe(b);
        });
    });

    describe('output range', () => {
        it('seeded output is in [0, 1)', () => {
            let seeds = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta'];

            for (let i = 0, n = seeds.length; i < n; i++) {
                let value = rng(seeds[i]);

                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThan(1);
            }
        });
    });

    describe('unseeded path', () => {
        it('returns a number in [0, 1)', () => {
            for (let i = 0; i < 100; i++) {
                let value = rng();

                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThan(1);
            }
        });
    });

    describe('rng.seed', () => {
        it('returns a 64-character hex string', () => {
            let seed = rng.seed();

            expect(seed).toHaveLength(64);
            expect(seed).toMatch(/^[0-9a-f]{64}$/);
        });

        it('two calls produce different seeds', () => {
            let a = rng.seed(),
                b = rng.seed();

            expect(a).not.toBe(b);
        });
    });
});
