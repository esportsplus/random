import rng from './rng';


export default <T>(items: T[], weights?: number[]): T => {
    let random = rng();

    if (weights === undefined) {
        return items[ Math.floor(random * items.length) ];
    }

    if (items.length !== weights.length) {
        throw new Error('Random: each option requires a chance number');
    }

    let sum = 0;

    for (let i = 0, n = weights.length; i < n; i++) {
        sum += weights[i];
    }

    if (sum < .9) {
        throw new Error('Random: chance numbers need to exceed a total value of .9');
    }

    let total = 0;

    for (let i = 0, n = items.length; i < n; i++) {
        total += weights[i];

        if (random <= total) {
            return items[i];
        }
    }

    throw new Error('Random: weighted option pick failed');
};