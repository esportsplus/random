import { describe, expect, it } from 'vitest';

import alphanumeric from '~/alphanumeric';


describe('alphanumeric', () => {
    describe('validation', () => {
        it('throws when length is 0', () => {
            expect(() => alphanumeric(0)).toThrow('@esportsplus/random: length must be positive');
        });

        it('throws when length is negative', () => {
            expect(() => alphanumeric(-1)).toThrow('@esportsplus/random: length must be positive');
        });
    });

    describe('output', () => {
        it('returns string of correct length', () => {
            expect(alphanumeric(10)).toHaveLength(10);
        });

        it('contains only alphanumeric characters', () => {
            let result = alphanumeric(200);

            expect(result).toMatch(/^[0-9A-Za-z]+$/);
        });

        it('handles length of 1', () => {
            expect(alphanumeric(1)).toHaveLength(1);
        });

        it('handles length of 100', () => {
            expect(alphanumeric(100)).toHaveLength(100);
        });
    });

    describe('determinism', () => {
        it('same seed produces same string', () => {
            let a = alphanumeric(20, 'test-seed'),
                b = alphanumeric(20, 'test-seed');

            expect(a).toBe(b);
        });
    });
});
