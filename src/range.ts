import { rng } from './rng';


export default (min: number, max: number, integer = false, seed?: string) => {
    if (min > max) {
        throw new Error('@esportsplus/random: min cannot be greater than max');
    }

    if (!integer) {
        return rng(seed) * (max - min) + min;
    }

    min = Math.ceil(min);
    max = Math.floor(max) + 1;

    if (min >= max) {
        throw new Error('@esportsplus/random: no integer exists between min and max');
    }

    return Math.floor(rng(seed) * (max - min) + min);
};