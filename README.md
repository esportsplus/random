# @esportsplus/random

Cryptographically secure random utilities with optional seeded/provably fair mode.

All functions accept an optional `seed` string as the last argument for reproducible results.

---

## Functions

### `alphanumeric(length, seed?)`
Generate random alphanumeric string.

```ts
alphanumeric(8);           // "Kj3mX9pL"
alphanumeric(8, 'seed');   // Reproducible result
```

---

### `between(items, seed?)`
Pick 2 unique items from array. Useful for matchmaking/pairings.

```ts
between(['a', 'b', 'c', 'd']);  // ['b', 'd']
```

---

### `coinflip(seed?)`
50/50 true/false.

```ts
coinflip();        // true or false
coinflip('seed');  // Reproducible result
```

---

### `exponential(lambda, seed?)`
Exponential distribution. Useful for time-between-events simulation.

```ts
exponential(1.5);  // 0.234...
```

---

### `gaussian(mean, stddev, seed?)`
Normal/Gaussian distribution. Useful for realistic simulations.

```ts
gaussian(100, 15);  // ~100 with stddev 15
```

---

### `groups(items, total, seed?)`
Randomly split array into N groups.

```ts
groups([1, 2, 3, 4, 5, 6], 2);  // [[3, 1, 5], [6, 2, 4]]
```

---

### `hex(length, seed?)`
Generate random hex string.

```ts
hex(16);  // "a3f2b1c9e4d8f0a2"
```

---

### `item(map, seed?)`
Weighted random selection from Map.

```ts
let rewards = new Map([
    ['common', 70],
    ['rare', 25],
    ['legendary', 5]
]);

item(rewards);  // 'common' (70% chance)
```

---

### `pick(items, count, seed?)`
Pick N items with replacement (duplicates allowed).

```ts
pick([1, 2, 3, 4, 5], 3);  // [2, 2, 5] (same item can repeat)
```

---

### `range(min, max, integer?, seed?)`
Random number in range. Set `integer=true` for whole numbers.

```ts
range(0, 100);              // 42.7381...
range(1, 10, true);         // 7
range(1, 10, true, 'seed'); // Reproducible integer
```

---

### `rng(seed?)`
Core random number generator. Returns a number in `[0, 1)`. Without a seed, uses `crypto.getRandomValues`. With a seed, uses a deterministic PRNG (cyrb128 + sfc32).

```ts
rng();            // 0.7234... (crypto random)
rng('my-seed');   // Deterministic result
```

`rng.seed()` generates a cryptographically secure 64-character hex string.

```ts
rng.seed();  // 'a1b2c3d4e5f6...' (64 chars)
```

---

### `roll(numerator, denominator, seed?)`
Roll "N in D" chance.

```ts
roll(1, 100);   // 1% chance (1 in 100)
roll(25, 100);  // 25% chance
roll(1, 6);     // ~16.7% chance (1 in 6)
```

---

### `sample(items, count, seed?)`
Pick N unique items (no duplicates).

```ts
sample([1, 2, 3, 4, 5], 3);  // [4, 1, 5] (each item appears once max)
```

---

### `shuffle(values, seed?)`
Fisher-Yates shuffle. Mutates original array.

```ts
shuffle([1, 2, 3, 4, 5]);  // [3, 1, 5, 2, 4]
```

---

## Seeded Mode

All functions accept an optional `seed` string as the last argument. Same seed = same result, enabling reproducible and provably fair outcomes.

```ts
range(1, 100, true, 'my-seed');  // Always the same integer
shuffle([1, 2, 3, 4, 5], 'my-seed');  // Always the same order
```

---

## Testing

```bash
pnpm test
```

90 tests across 14 files covering all 13 modules — determinism, error paths, edge cases, and statistical validation.
