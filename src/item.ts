import { rng } from '@esportsplus/crypto';


export default <T>(items: T[], weights?: number[]): T => {
    if (weights === undefined) {
        return items[ Math.floor(rng() * items.length) ];
    }

    let n = items.length,
        random = 0;

    if (n !== weights.length) {
        throw new Error('Random: each item requires a weight');
    }

    for (let i = 0; i < n; i++) {
        random += weights[i];
    }

    let current = 0;

    random *= rng();

    for (let i = 0; i < n; i++) {
        current += weights[i];

        if (random <= current) {
            return items[i];
        }
    }

    throw new Error('Random: weighted item pick failed');
};