import rng from './rng';
import shuffle from './shuffle';


export default (n: number): number[] => {
    let values: number[] = [];

    for (let i = 0; i < n; i++) {
        values.push(rng());
    }

    return shuffle(values);
};