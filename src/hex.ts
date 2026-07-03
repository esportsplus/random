import { generator } from './rng';


const CHARS = '0123456789abcdef';


export default (length: number, seed?: string) => {
    if (length <= 0) {
        throw new Error('@esportsplus/random: length must be positive');
    }

    let draw = generator(seed),
        result = '';

    for (let i = 0; i < length; i++) {
        result += CHARS[(draw() * 16) >>> 0];
    }

    return result;
};
