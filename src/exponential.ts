import { rng } from './rng';


// Box-Muller transform for normal distribution
// - https://en.wikipedia.org/wiki/Box-Muller_transform
export default (lambda: number, seed?: string) => {
    if (lambda <= 0) {
        throw new Error('@esportsplus/random: lambda must be positive');
    }

    let u = rng(seed);

    // Avoid log(0)
    while (u === 0) {
        u = rng(seed);
    }

    return -Math.log(u) / lambda;
};
