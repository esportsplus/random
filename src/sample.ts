import shuffle from './shuffle';


export default <T>(items: T[], count: number, seed?: string): T[] => {
    let n = items.length;

    if (n === 0) {
        throw new Error('@esportsplus/random: items cannot be empty');
    }

    if (count <= 0) {
        throw new Error('@esportsplus/random: count must be positive');
    }

    if (count > n) {
        throw new Error('@esportsplus/random: count cannot exceed items length');
    }

    return shuffle([...items], seed).slice(0, count);
};
