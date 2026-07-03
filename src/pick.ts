import { generator } from './rng';


export default <T>(items: T[], count: number, seed?: string): T[] => {
    if (items.length === 0) {
        throw new Error('@esportsplus/random: items cannot be empty');
    }

    if (count <= 0) {
        throw new Error('@esportsplus/random: count must be positive');
    }

    let draw = generator(seed),
        n = items.length,
        result: T[] = [];

    for (let i = 0; i < count; i++) {
        result.push(items[(draw() * n) >>> 0]);
    }

    return result;
};
