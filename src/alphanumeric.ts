import { generator } from './rng';


const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';


export default (length: number, seed?: string) => {
    if (length <= 0) {
        throw new Error('@esportsplus/random: length must be positive');
    }

    let draw = generator(seed),
        n = CHARS.length,
        result = '';

    for (let i = 0; i < length; i++) {
        result += CHARS[(draw() * n) >>> 0];
    }

    return result;
};
