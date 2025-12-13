import { rng } from './rng';


export default (seed?: string) => {
    return rng(seed) < 0.5;
};