import { rng } from '@esportsplus/crypto';


// Fisher-Yates shuffle
// - https://wikipedia.org/wiki/Fisher-Yates_shuffle
export default (values: any[]) => {
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