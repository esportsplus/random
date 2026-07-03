# Spec: @esportsplus/random — src/ audit fixes (2026-07-03)

## Clarifying Questions

### Open — Blocking
_(none)_

### Open — Optional
- [Q1] Breaking perf optimizations — F-9 (hex), F-10 (alphanumeric), F-11 (sample) change seeded output sequences, so they are public-API breaking. This was an UNATTENDED audit run, so per code-audit's Phase 3.5 gate they are left `Status: BLOCKED` pending approval. Affected: F-9, F-10, F-11. **A:** _(unanswered — items stay BLOCKED)_
- [Q2] F-10 (alphanumeric `%62` batching) trades the current unbiased char mapping for one with ≤2^-25 modulo bias. Even if breaking-API approval is granted, the audit recommends REJECTING the biased variant. Confirm whether any alphanumeric batching is wanted at all. Affected: F-10. **A:** _(unanswered)_

### Answered
_(none)_

## Metadata

- Project: @esportsplus/random
- Scope: src/ (15 source files)
- Date: 2026-07-03
- Commit: 0a6e5ccd85f09f6ea712d88fac6ce644e414bd90
- Source: code-audit run 1 (coverage-anchored convergence — DONE at 100% coverage). Findings authored by the audit Judge; F-ids, priorities, and Recommended-model tags are registry/Judge-owned and pass through verbatim.
- Tools ran (Phase 0.5): madge → 0 circular; pnpm audit → 8 advisories (ALL transitive devDeps, out of src/ scope, not consumer-facing since the published package ships compiled build/ with zero runtime deps); semgrep/eslint/knip/slither/aderyn/gitleaks/osv-scanner/cargo-audit → absent; npm audit → skipped (pnpm repo, no package-lock).
- Build: `pnpm build` (`tsc && tsc-alias`). Test: `pnpm test` (`vitest run`) — 90 tests, 14 files. Type-check: `tsc --noEmit`. Baseline is green.
- Decision memos (unattended run — decided by rubric, not by asking):
  - F-9/F-10/F-11 were tagged `API-impact: breaking` by the Judge → per code-audit's Phase 3.5 unattended rule they are kept `BLOCKED` (never auto-approved). They remain in the spec as backlog; spec-implementation must NOT execute them.
  - Dependency ordering: `src/rng.ts` is the fix root — F-1 (seed-stream) is upstream of the looping consumers, and the three BLOCKED perf items depend on it. Implement rng.ts first, then the other correctness fixes.
  - F-1 merges the seeded-stream defect and the empty-string-seed fallthrough (both live in rng()'s seed branch; one implementer, one cohesive fix). The Judge rejected the "global Map that advances across calls" variant (breaks per-call reproducibility) in favor of a per-call internal generator.

## Convergence Status

- **Status:** DONE
- **Coverage:** 15/15 files (100%)
- **Open findings:** P0=5 · P1=6 · P2=0 (fixed=0, invalid=0)
- **Reason:** full coverage (15/15). Findings, if any, are backlog. (Discovery is complete; open findings are the implementation backlog below — 8 actionable, 3 BLOCKED awaiting approval.)

## Findings

### src/rng.ts

_Dependency root — implement this file first. F-1, F-2, F-3 all edit rng.ts; sequence together (one implementer reads the file once)._

#### F-1: rng() seed-parameter handling — stateless seeded stream + empty-string fallthrough
- File: src/rng.ts:57-61
- Symbol: rng
- Category: correctness
- Priority: P0
- Evidence: TWO defects in rng()'s seeded branch. (A) STATELESS STREAM (rng.ts:57-61): builds `sfc32(...cyrb128(seed))` and calls it ONCE, discarding the generator, so `rng(seed) === rng(seed)` forever. 9 looping consumers (alphanumeric/hex per-char, shuffle/sample/groups per-swap, gaussian u1/u2, exponential) expect a fresh draw per call and instead get one value repeated → repeated chars, degenerate/no-op shuffles, non-normal gaussian; `exponential`/`gaussian` `while (u === 0) { u = rng(seed) }` INFINITE-LOOP HANGS for any seed whose value is 0 (~2^-32); seeded hex/alphanumeric tokens collapse to 16/62 effective values (guessable). EXECUTED repro: `alphanumeric(10,'x')` → `"llllllllll"`. Found by correctness + security + performance + seam (4 independent lenses). (B) EMPTY-SEED (rng.ts:58): `if (seed)` truthiness treats the valid seed `''` as falsy → silently uses the non-deterministic crypto path.
- Recommendation: Fix BOTH in rng()'s seed handling (one implementer, same file): (A) build a seeded generator ONCE per top-level call via an INTERNAL (non-exported) factory and advance it per draw, threading the generator through the looping consumers; preserve per-call determinism (each top-level seeded call = a fresh generator from the seed); do NOT use a global Map that advances across calls (breaks call-level reproducibility); prefer the internal factory over a public `rng.stream` to keep the public API unchanged; document that the seeded path uses non-crypto sfc32 (recoverable — not for security tokens). (B) change `if (seed)` to `if (seed !== undefined)` so any provided string including `''` is deterministic.
- Risk: The library's headline seeded / "provably fair" mode is non-functional for strings, sampling, shuffling, and both distributions; 2 consumers can hang the process (DoS via attacker-supplied seed); seeded tokens are guessable. rng is the hub — 12 consumers.
- Confidence: HIGH (score: 95)
- LOC delta: +31 / -16
- Recommended-model: opus
- Evidence-cmd: node --input-type=module -e "import {alphanumeric} from './build/index.js'; console.log(new Set(alphanumeric(10,'x')).size===1)"

#### F-2: rng() returns [0,1] inclusive (divides by 2^32-1) contradicting README [0,1)
- File: src/rng.ts:52
- Symbol: MAX
- Category: correctness
- Priority: P0
- Evidence: `MAX = 0xFFFFFFFF` (2^32-1) at rng.ts:1; both `(t >>> 0) / MAX` (rng.ts:52) and `crypto.getRandomValues(...)[0] / MAX` (rng.ts:64) divide by 2^32-1, so `rng()` returns exactly 1.0 with p=2^-32. README.md:112 documents `[0, 1)`. At u===1 downstream: hex→CHARS[16] and alphanumeric→CHARS[62] append the literal string `"undefined"`; pick/between→items[n]→undefined; shuffle writes `values[len]` GROWING the array and injecting undefined (silent corruption); `range(1,10,true)`→11. EXECUTED repro: `0xFFFFFFFF/0xFFFFFFFF === 1`. Found by correctness + seam.
- Recommendation: Divide by `0x100000000` (2^32) at rng.ts:52 and rng.ts:64 (drop/repurpose the `MAX` constant) so the range is half-open [0,1), matching README and every caller's `(rng()*n) >>> 0` idiom.
- Risk: Rare (2^-32 per draw) but real and deterministic for affected seeds: undefined elements, `"undefined"` substrings in generated ids, arrays corrupted/grown by shuffle, off-by-one integers. Type signatures silently violated. rng hub — 12 consumers.
- Confidence: HIGH (score: 92)
- LOC delta: +2 / -2
- Recommended-model: sonnet
- Evidence-cmd: node -e "console.log(0xFFFFFFFF/0xFFFFFFFF)"

#### F-3: Unseeded rng() pays one crypto.getRandomValues per call
- File: src/rng.ts:64
- Symbol: rng
- Category: optimize
- Priority: P0
- Evidence: rng.ts:64 calls `crypto.getRandomValues(Uint32Array(1))` per unseeded draw; in char loops (alphanumeric/hex) that is one syscall-class call per char. A pooled read is ~1-2ns vs ~100ns-1µs per `getRandomValues`; filling `Uint32Array(1024)` once amortizes across 1024 draws. Reasoning-only estimate (≥80% unseeded rng cost reduction in loops); no executed benchmark.
- Recommendation: Fill a module-level `Uint32Array(1024)` entropy pool + cursor; refill via one `getRandomValues` when exhausted; return `POOL[cursor++] * 2**-32`. Distribution identical, no API change. spec-implementation must gate on a benchmark (optimize requires ≥10% or revert).
- Risk: Hot path (every unseeded helper loop). 4KB CSPRNG buffer resident (no practical security delta for a non-crypto utility). No API or distribution change.
- Confidence: MEDIUM (score: 75)
- LOC delta: +9 / -1
- Recommended-model: opus
- API-impact: none

### src/range.ts

#### F-4: range(min,max,true) with fractional bounds returns a value outside [min,max]
- File: src/range.ts:13
- Symbol: default
- Category: correctness
- Priority: P0
- Evidence: `range(2.1, 2.9, true)`: the `min > max` guard passes (2.1 ≤ 2.9); then `min = Math.ceil(2.1) = 3`, `max = Math.floor(2.9) + 1 = 3`; `Math.floor(rng*0 + 3) = 3` returned deterministically though 3 > 2.9. Any fractional bounds with no integer between them return a value strictly greater than max. EXECUTED repro returns 3.
- Recommendation: After the ceil/floor transform, throw when `Math.ceil(min) > Math.floor(max)` (mirrors the existing `min > max` error) instead of fabricating an out-of-range result.
- Risk: Callers using fractional bounds receive integers outside the interval they specified — silent contract violation, 100% reproducible for those inputs. 1 consumer (barrel) = public API.
- Confidence: HIGH (score: 90)
- LOC delta: +3 / -0
- Recommended-model: sonnet
- Evidence-cmd: node --input-type=module -e "import {range} from './build/index.js'; console.log(range(2.1,2.9,true))"

### src/groups.ts

#### F-5: groups() produces an empty trailing group even when items >= total
- File: src/groups.ts:12
- Symbol: default
- Category: correctness
- Priority: P0
- Evidence: `size = Math.ceil(n / total)` front-loads groups. `groups([1..9], 4)` → sizes [3,3,3,0] (4th empty despite 9 ≥ 4); `groups(10 items, 6)` → [2,2,2,2,2,0]. Trigger: `ceil(n/total) * (total-1) >= n`. EXECUTED repro confirms [3,3,3,0].
- Recommendation: Distribute the remainder: `base = Math.floor(n/total)`; first `n % total` groups get `base+1`. Guarantees no empty group when n ≥ total and balanced sizes. Compatible with the existing items<total test (tests/groups.ts:48) which correctly expects unavoidable empties.
- Risk: Callers partitioning teams/batches get empty groups and maximally unbalanced splits for common inputs; any consumer indexing one-member-per-group hits undefined. 1 consumer (barrel) = public API.
- Confidence: HIGH (score: 92)
- LOC delta: +5 / -2
- Recommended-model: sonnet
- Evidence-cmd: node --input-type=module -e "import {groups} from './build/index.js'; console.log(groups([1,2,3,4,5,6,7,8,9],4).map(g=>g.length))"

#### F-6: groups() has no test for an empty items array
- File: src/groups.ts:9
- Symbol: default
- Category: test-quality
- Priority: P1
- Evidence: tests/groups.ts covers total<=0, even/uneven division, determinism, and items<total, but never `groups([], 3)` (n=0, size=ceil(0/total)=0, loop pushes `total` empty arrays). A future divide-by-zero or an added empty-guard would ship undetected.
- Recommendation: Add to tests/groups.ts: `groups([], 3)` → length 3, every sub-array `[]`. Companion regression: assert no empty group when items ≥ total (the F-5 case, e.g. `groups(9-items, 4)`).
- Risk: Regressions in the empty-collection path escape the suite.
- Confidence: HIGH (score: 85)
- LOC delta: +8 / -0
- Recommended-model: sonnet

### src/item.ts

#### F-7: item() can select a zero-weight entry via inclusive boundary comparator
- File: src/item.ts:21
- Symbol: default
- Category: correctness
- Priority: P1
- Evidence: `if (random <= current)`. `item(Map[[A,0],[B,1]])` with `random === 0` (rng at the low bound): current = 0 + 0 = 0, `0 <= 0` → returns A, an explicitly weight-0 entry, violating the weighted-pick invariant. Strict `<` is the correct comparator for a left-closed uniform draw. Independent of F-2 (random can still be 0 at the low bound after the [0,1) fix).
- Recommendation: Use strict `<` (`random < current`) so zero-weight items are never selectable and boundary hits resolve to the correct bucket.
- Risk: Rare (~2^-32 per call unseeded, deterministic for affected seeds); consumers relying on weight 0 to disable an entry can still receive it. 1 consumer (barrel) = public API.
- Confidence: MEDIUM (score: 70)
- LOC delta: +1 / -1
- Recommended-model: sonnet

### src/exponential.ts

#### F-8: Misleading Box-Muller comment copy-pasted over an inverse-transform exponential body
- File: src/exponential.ts:4-5
- Symbol: default
- Category: slop
- Priority: P1
- Evidence: exponential.ts:4-5 read `// Box-Muller transform for normal distribution` + wiki link — identical to gaussian.ts:4-6 — but the body is `-Math.log(u) / lambda` (inverse-transform sampling of an EXPONENTIAL distribution, not Box-Muller, and it produces no normal value). Proven copy-paste from gaussian.ts.
- Recommendation: Correct the comment to describe inverse-transform sampling of the exponential distribution (`F^-1(u) = -ln(u)/lambda`) with an accurate reference. Comment-only, zero behavior change.
- Risk: A maintainer (human or LLM) trusting the comment could "fix" exponential.ts to actually implement Box-Muller, silently breaking its exponential-distribution contract.
- Confidence: HIGH (score: 90)
- LOC delta: +0 / -0
- Recommended-model: sonnet

### src/hex.ts

#### F-9: hex() spends one 32-bit draw per 4-bit character
- File: src/hex.ts:15
- Symbol: default
- Category: optimize
- Priority: P1
- Evidence: `result += CHARS[(rng(seed) * 16) >>> 0]` uses a full 32-bit draw per hex char; one u32 yields 8 hex chars with zero bias (16 divides 2^32). `hex(32)` = 32 draws where 4 suffice. Reasoning-only estimate ~8× fewer draws.
- Recommendation: Draw one u32 per 8 chars and extract nibbles (`CHARS[v & 15]; v >>>= 4`), handling the `length % 8` tail. Downstream of F-1.
- Risk: Public seeded token surface; changing draw count changes seeded output.
- Confidence: MEDIUM (score: 72)
- LOC delta: +8 / -3
- Recommended-model: opus
- API-impact: breaking
  - Example: seeded `hex(8,'seed')` returns a different token string (draw-per-8-chars changes the seeded sequence).
  - Benefit: ~8× fewer PRNG draws, unbiased.
  - Migration: pin the prior version or regenerate stored seeded hex; unseeded output unaffected.
  - Status: BLOCKED
  - Awaiting-approval: public-API break — do not implement without user approval

### src/alphanumeric.ts

#### F-10: alphanumeric() spends one 32-bit draw per ~6-bit character
- File: src/alphanumeric.ts:16
- Symbol: default
- Category: optimize
- Priority: P1
- Evidence: `result += CHARS[(rng(seed) * n) >>> 0]` uses a full 32-bit draw to select from 62 symbols per char. One u32 could yield ~5 chars via repeated `% 62`, but that INTRODUCES ≤2^-25 modulo bias the current float-scale mapping does not have. Reasoning-only; net-questionable (trades an unbiased RNG for a biased one for speed).
- Recommendation: Recommend REJECTING the biased `%62` batching — keep the current unbiased mapping or adopt a bias-free batching scheme. If pursued, one u32 per 5 chars with a `length % 5` tail. Downstream of F-1 (the seeded sequence only meaningfully exists after the seed-stream fix).
- Risk: Public seeded token surface; changing draw count changes seeded output. A distribution regression (added bias) for a speed gain a senior would not mass-approve.
- Confidence: MEDIUM (score: 65)
- LOC delta: +9 / -3
- Recommended-model: opus
- API-impact: breaking
  - Example: seeded `alphanumeric(5,'seed')` output changes; method switches to `u32 % 62`.
  - Benefit: ~5× fewer PRNG draws — BUT adds ≤2^-25 modulo bias (a distribution regression).
  - Migration: regenerate stored seeded values; unseeded output unaffected.
  - Status: BLOCKED
  - Awaiting-approval: public-API break — do not implement without user approval

### src/sample.ts

#### F-11: sample() runs a full O(n) Fisher-Yates then discards n-count elements
- File: src/sample.ts:19
- Symbol: default
- Category: optimize
- Priority: P1
- Evidence: `shuffle([...items])` does n-1 rng draws, then `slice(0, count)` discards n-count. A partial Fisher-Yates stops after `count` swaps: `sample(10000, 5)` drops from 9,999 to 5 draws. Reasoning-only, unbiased transform.
- Recommendation: Inline a partial Fisher-Yates over the copy: swap positions 0..count-1 each against a random index in [i, n), then `slice(0, count)`. Downstream of F-1.
- Risk: Public seeded surface; changing draw count changes seeded output. Cleanest (unbiased) of the three breaking perf items.
- Confidence: MEDIUM (score: 72)
- LOC delta: +10 / -1
- Recommended-model: opus
- API-impact: breaking
  - Example: seeded `sample(items,k,'seed')` selection changes; partial Fisher-Yates (k swaps) replaces full shuffle+slice.
  - Benefit: O(k) instead of O(n) swaps when k ≪ n; unbiased.
  - Migration: regenerate stored seeded samples; unseeded output unaffected.
  - Status: BLOCKED
  - Awaiting-approval: public-API break — do not implement without user approval
