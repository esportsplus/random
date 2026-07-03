const POOL_SIZE = 1024;

const POOL = new Uint32Array(POOL_SIZE);

const SEED_BUFFER = new Uint8Array(32);


let cursor = POOL_SIZE;


function cyrb128(str: string): [number, number, number, number] {
    let h1 = 1779033703,
        h2 = 3144134277,
        h3 = 1013904242,
        h4 = 2773480762;

    for (let i = 0, n = str.length; i < n; i++) {
        let k = str.charCodeAt(i);

        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }

    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);

    h1 ^= (h2 ^ h3 ^ h4);
    h2 ^= h1;
    h3 ^= h1;
    h4 ^= h1;

    return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

function sfc32(a: number, b: number, c: number, d: number): () => number {
    return () => {
        a >>>= 0;
        b >>>= 0;
        c >>>= 0;
        d >>>= 0;

        let t = (a + b) | 0;

        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        d = d + 1 | 0;
        t = t + d | 0;
        c = c + t | 0;

        return (t >>> 0) / 0x100000000;
    };
}

function poolDraw(): number {
    if (cursor >= POOL_SIZE) {
        crypto.getRandomValues(POOL);
        cursor = 0;
    }

    return POOL[cursor++] / 0x100000000;
}

function generator(seed?: string): () => number {
    if (seed !== undefined) {
        let [a, b, c, d] = cyrb128(seed);

        return sfc32(a, b, c, d);
    }

    return poolDraw;
}

function rng(seed?: string): number {
    return generator(seed)();
}

rng.seed = () => {
    let bytes = crypto.getRandomValues(SEED_BUFFER),
        hex = '';

    for (let i = 0, n = bytes.length; i < n; i++) {
        hex += bytes[i].toString(16).padStart(2, '0');
    }

    return hex;
};


export { generator, rng };
