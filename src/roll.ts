import { rng } from '@esportsplus/crypto';


export default (percentage: number) => {
    return rng() <= percentage;
};