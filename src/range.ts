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

    return Math.floor(rng(seed) * (max - min) + min);
};