import rng from './rng';
import shuffle from './shuffle';


export default (n: number) => {
    let values: number[] = [];

    for (let i = 0; i < n; i++) {
        values.push( Math.floor(rng()) );
    }

    return shuffle(values);
};