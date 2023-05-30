import rng from "./rng";


const BASIS_POINTS = 10000;


export default <T>(items: T[], weights?: number[]): T => {
    if (weights === undefined) {
        return items[ Math.floor(rng() * items.length) ];
    }

    if (items.length !== weights.length) {
        throw new Error('Random: each item requires a weight');
    }

    let random = rng() * BASIS_POINTS,
        total = BASIS_POINTS;

    for (let i = 0, n = weights.length; i < n; i++) {
        total -= weights[i];
    }

    if (total !== 0) {
        throw new Error('Random: weights use basis point math, they must add up to 10000 ( 100% )');
    }

    for (let i = 0, n = items.length; i < n; i++) {
        total += weights[i];

        if (random <= total) {
            return items[i];
        }
    }

    throw new Error('Random: weighted item pick failed');
};