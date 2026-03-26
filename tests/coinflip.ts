import { describe, expect, it } from 'vitest';

import coinflip from '~/coinflip';


describe('coinflip', () => {
    describe('output', () => {
        it('returns a boolean', () => {
            expect(typeof coinflip()).toBe('boolean');
        });
    });

    describe('determinism', () => {
        it('same seed produces same result', () => {
            let a = coinflip('test-seed'),
                b = coinflip('test-seed');

            expect(a).toBe(b);
        });
    });

    describe('distribution', () => {
        it('roughly 50% true over 1000 trials', () => {
            let trueCount = 0;

            for (let i = 0; i < 1000; i++) {
                if (coinflip()) {
                    trueCount++;
                }
            }

            expect(trueCount).toBeGreaterThan(350);
            expect(trueCount).toBeLessThan(650);
        });
    });
});
