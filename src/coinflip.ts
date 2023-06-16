import { rng } from '@esportsplus/crypto';


export default () => {
    return rng() < 0.5;
};