import { describe, expect, it } from 'vitest';

import item from '~/item';


describe('item', () => {
    describe('empty map throws', () => {
        it('throws when map has no entries', () => {
            expect(() => item(new Map())).toThrow('@esportsplus/random: map cannot be empty');
        });
    });

    describe('single item map', () => {
        it('always returns the only item', () => {
            let map = new Map([['only', 1]]);

            for (let i = 0; i < 50; i++) {
                expect(item(map)).toBe('only');
            }
        });
    });

    describe('weighted selection with seed', () => {
        it('same seed produces same result', () => {
            let map = new Map([['a', 1], ['b', 2], ['c', 3]]),
                a = item(map, 'deterministic'),
                b = item(map, 'deterministic'),
                c = item(map, 'deterministic');

            expect(a).toBe(b);
            expect(b).toBe(c);
        });
    });

    describe('multiple items', () => {
        it('result is always one of the map keys', () => {
            let keys = ['x', 'y', 'z'],
                map = new Map([['x', 1], ['y', 1], ['z', 1]]);

            for (let i = 0; i < 100; i++) {
                expect(keys).toContain(item(map));
            }
        });
    });

    describe('zero weight item', () => {
        it('item with weight 0 is almost never selected', () => {
            let map = new Map([['zero', 0], ['heavy', 100]]),
                zeroCount = 0;

            for (let i = 0; i < 1000; i++) {
                if (item(map) === 'zero') {
                    zeroCount++;
                }
            }

            expect(zeroCount).toBeLessThan(20);
        });
    });

    describe('equal weights', () => {
        it('all items are roughly equally likely', () => {
            let counts: Record<string, number> = { a: 0, b: 0, c: 0 },
                map = new Map([['a', 1], ['b', 1], ['c', 1]]),
                n = 3000;

            for (let i = 0; i < n; i++) {
                let result = item(map);

                counts[result]++;
            }

            for (let key of Object.keys(counts)) {
                expect(counts[key] / n).toBeGreaterThan(0.15);
            }
        });
    });
});
