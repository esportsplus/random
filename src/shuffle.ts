import { rng } from './rng';


// Fisher-Yates shuffle
// - https://wikipedia.org/wiki/Fisher-Yates_shuffle
export default <T>(values: T[], seed?: string): T[] => {
    if (values.length === 0) {
        return values;
    }

    let n = values.length,
        random: number,
        value: T;

    while (--n > 0) {
        random = (rng(seed) * (n + 1)) >>> 0;
        value = values[random];

        values[random] = values[n];
        values[n] = value;
    }

    return values;
};