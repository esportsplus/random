import { rng } from './rng';


export default (numerator: number, denominator: number, seed?: string) => {
    if (numerator <= 0 || denominator <= 0) {
        throw new Error('@esportsplus/random: numerator and denominator must be positive');
    }

    return rng(seed) <= (numerator / denominator);
};