let max = Math.pow(2, 32),
    rng: () => number;


if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    rng = () => window.crypto.getRandomValues(new Uint32Array(1))[0] / max;
}
else if (typeof process !== 'undefined' && process.versions != null && process.versions.node != null) {
    rng = () => require('crypto').randomBytes(4).readUInt32BE(0) / max;
}
else {
    throw new Error('Random: no suitable random number generator found');
}


export default rng;