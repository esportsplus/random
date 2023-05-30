let max = Math.pow(2, 32),
    rng: () => number;


if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    rng = () => window.crypto.getRandomValues(new Uint32Array(1))[0] / max;
}
else if (typeof process !== 'undefined' && process.versions != null && process.versions.node != null) {
    rng = () => require('crypto').randomBytes(4).readUInt32BE(0) / max;
}
else {
    throw new Error('Random: no suitable random number generator found');
}


const coinflip = () => {
    return rng() < 0.5;
};

const float = rng;

const floats = (n: number): number[] => {
    let values: number[] = [];

    for (let i = 0; i < n; i++) {
        values.push(rng());
    }

    return shuffle(values);
};

const integer = () => {
    return Math.floor(rng());
};

const integers = (n: number) => {
    let values: number[] = [];

    for (let i = 0; i < n; i++) {
        values.push( Math.floor(rng()) );
    }

    return shuffle(values);
};

const item = <T>(items: T[], weights?: number[]): T => {
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

const range = (min: number, max: number, integer = false) => {
    if (!integer) {
        return rng() * (max - min) + min;
    }

    min = Math.ceil(min);
    max = Math.floor(max) + 1;

    return Math.floor(rng() * (max - min) + min);
};

const roll = (percentage: number) => {
    return rng() <= percentage;
};

// Fisher-Yates shuffle
// - https://wikipedia.org/wiki/Fisher-Yates_shuffle
const shuffle = (values: any[]) => {
    let n = values.length,
        random: number,
        value;

    while (--n > 0) {
        random = Math.floor(rng() * (n + 1));
        value = values[random];

        values[random] = values[n];
        values[n] = value;
    }

    return values;
};


export default { coinflip, float, floats, integer, integers, item, range, roll, shuffle };
export { coinflip, float, floats, integer, integers, item, range, roll, shuffle };