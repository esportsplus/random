import shuffle from './shuffle';


export default <T>(items: T[], total: number, seed?: string): T[][] => {
    if (total <= 0) {
        throw new Error('@esportsplus/random: total must be positive');
    }

    let copy = shuffle([...items], seed),
        groups: T[][] = [],
        n = copy.length,
        size = Math.ceil(n / total);

    for (let i = 0; i < total; i++) {
        groups.push(copy.slice(i * size, (i + 1) * size));
    }

    return groups;
};
