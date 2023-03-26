let max = Math.pow(2, 32);


function browser() {
    return window.crypto.getRandomValues(new Uint32Array(1))[0] / max;
}

function node() {
    return require('crypto').randomBytes(4).readUInt32BE(0) / max;
}


const float = (): number => {
    if (globalThis?.crypto) {
        return browser();
    }

    return node();
};

// Fisher-Yates shuffle
// - https://wikipedia.org/wiki/Fisher-Yates_shuffle
const floats = (n: number): number[] => {
    let i: number,
        values: number[] = [];

    while(--n > -1) {
        i = Math.floor(Math.random() * (n + 1));

        values[i] = values[n];
        values[n] = float();
    }

    return values;
};


export default { float, floats };
export { float, floats };