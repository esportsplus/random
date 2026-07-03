import { generator } from './rng';


// Inverse-transform sampling of the exponential distribution: F^-1(u) = -ln(u) / lambda
// - https://en.wikipedia.org/wiki/Inverse_transform_sampling
export default (lambda: number, seed?: string) => {
    if (lambda <= 0) {
        throw new Error('@esportsplus/random: lambda must be positive');
    }

    let draw = generator(seed),
        u = draw();

    // Avoid log(0)
    while (u === 0) {
        u = draw();
    }

    return -Math.log(u) / lambda;
};
