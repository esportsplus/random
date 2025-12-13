import { rng } from './rng';


export default <T>(map: Map<T, number>, seed?: string): T => {
    if (map.size === 0) {
        throw new Error('@esportsplus/random: map cannot be empty');
    }

    let current = 0,
        total = 0;

    for (let weight of map.values()) {
        total += weight;
    }

    let random = rng(seed) * total;

    for (let [item, weight] of map) {
        current += weight;

        if (random <= current) {
            return item;
        }
    }

    throw new Error('@esportsplus/random: weighted item pick failed');
};