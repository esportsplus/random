// F-3 throughput benchmark: unseeded entropy pool vs per-call getRandomValues.
// Dev tooling — not shipped. Run: node scripts/bench-rng.mjs
import { generator } from '../build/rng.js';


const DRAWS = 2_000_000;

const RUNS = 5;


function baselineDraw() {
    return crypto.getRandomValues(BUFFER)[0] / 0x100000000;
}

function bench(fn) {
    let times = [];

    for (let r = 0; r < RUNS; r++) {
        let start = process.hrtime.bigint(),
            sum = 0;

        for (let i = 0; i < DRAWS; i++) {
            sum += fn();
        }

        times.push(Number(process.hrtime.bigint() - start) / 1e6);

        if (sum < 0) {
            throw new Error('unreachable');
        }
    }

    return times.sort((a, b) => a - b)[times.length >> 1];
}


const BUFFER = new Uint32Array(1);

const pooledDraw = generator();


// Warm up both paths (JIT).
bench(baselineDraw);
bench(pooledDraw);

let baseline = bench(baselineDraw),
    pooled = bench(pooledDraw);

let baselineOps = DRAWS / (baseline / 1000),
    improvement = ((baseline - pooled) / baseline) * 100,
    pooledOps = DRAWS / (pooled / 1000);

console.log(`draws/run: ${DRAWS.toLocaleString()}, runs: ${RUNS} (median)`);
console.log(`baseline (per-call getRandomValues): ${baseline.toFixed(1)} ms  |  ${(baselineOps / 1e6).toFixed(1)} M ops/s`);
console.log(`pooled   (Uint32Array(1024) pool)  : ${pooled.toFixed(1)} ms  |  ${(pooledOps / 1e6).toFixed(1)} M ops/s`);
console.log(`improvement: ${improvement.toFixed(1)}% faster (${(baseline / pooled).toFixed(1)}x)`);
