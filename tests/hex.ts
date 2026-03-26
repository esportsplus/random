import { describe, expect, it } from 'vitest';

import hex from '~/hex';


describe('hex', () => {
    describe('validation', () => {
        it('throws when length is 0', () => {
            expect(() => hex(0)).toThrow('@esportsplus/random: length must be positive');
        });

        it('throws when length is negative', () => {
            expect(() => hex(-1)).toThrow('@esportsplus/random: length must be positive');
        });
    });

    describe('output', () => {
        it('returns string of correct length', () => {
            expect(hex(10)).toHaveLength(10);
        });

        it('contains only lowercase hex characters', () => {
            let result = hex(200);

            expect(result).toMatch(/^[0-9a-f]+$/);
        });

        it('handles length of 1', () => {
            expect(hex(1)).toHaveLength(1);
        });

        it('handles length of 64', () => {
            expect(hex(64)).toHaveLength(64);
        });
    });

    describe('determinism', () => {
        it('same seed produces same string', () => {
            let a = hex(32, 'test-seed'),
                b = hex(32, 'test-seed');

            expect(a).toBe(b);
        });
    });
});
