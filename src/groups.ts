import shuffle from './shuffle';


export default <T>(items: T[], total: number, seed?: string): T[][] => {
    if (total <= 0) {
        throw new Error('@esportsplus/random: total must be positive');
    }

    let copy = shuffle([...items], seed),
        groups: T[][] = [],
        n = copy.length,
        base = Math.floor(n / total),
        remainder = n % total,
        start = 0;

    for (let i = 0; i < total; i++) {
        let size = base + (i < remainder ? 1 : 0);

        groups.push(copy.slice(start, start + size));
        start += size;
    }

    return groups;
};
