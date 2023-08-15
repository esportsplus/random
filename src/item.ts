import { rng } from '@esportsplus/crypto';


let cache = new WeakMap();


export default <T>(items: T[], weights?: number[]): T => {
    if (weights === undefined) {
        return items[ Math.floor(rng() * items.length) ];
    }

    if (items.length !== weights.length) {
        throw new Error('Random: each item requires a weight');
    }

    let total = cache.get(weights) || 0;

    if (!total) {
        for (let i = 0, n = weights.length; i < n; i++) {
            total += weights[i];
        }

        cache.set(weights, total);
    }

    let current = 0,
        random = rng() * total;

    for (let i = 0, n = items.length; i < n; i++) {
        current += weights[i];

        if (random <= current) {
            return items[i];
        }
    }

    throw new Error('Random: weighted item pick failed');
};