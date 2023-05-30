import rng from './rng';


export default (min: number, max: number, integer = false) => {
    if (!integer) {
        return rng() * (max - min) + min;
    }

    min = Math.ceil(min);
    max = Math.floor(max) + 1;

    return Math.floor(rng() * (max - min) + min);
};