import { generator } from './rng';


// Box-Muller transform for normal distribution
// - https://en.wikipedia.org/wiki/Box-Muller_transform
export default (mean: number, stddev: number, seed?: string) => {
    if (stddev < 0) {
        throw new Error('@esportsplus/random: stddev cannot be negative');
    }

    let draw = generator(seed),
        u1 = draw(),
        u2 = draw();

    // Avoid log(0)
    while (u1 === 0) {
        u1 = draw();
    }

    let z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    return mean + stddev * z;
};
