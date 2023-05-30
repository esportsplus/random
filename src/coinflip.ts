import rng from './rng';


export default () => {
    return rng() < 0.5;
};