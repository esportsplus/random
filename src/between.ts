import { generator } from './rng';


export default <T>(items: T[], seed?: string): [T, T] => {
    let n = items.length;

    if (n < 2) {
        throw new Error('@esportsplus/random: need at least 2 items');
    }

    let draw = generator(seed),
        first = (draw() * n) >>> 0,
        second = (draw() * (n - 1)) >>> 0;

    if (second >= first) {
        second++;
    }

    return [items[first], items[second]];
};
