import rng from './rng';


export default (percentage: number) => {
    return rng() <= percentage;
};