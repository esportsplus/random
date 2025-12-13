# @esportsplus/random

Cryptographically secure random utilities with optional seeded/provably fair mode.

All functions accept an optional `seed` parameter (number or string) as the last argument for reproducible results.

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

### `uuid(seed?)`
Generate UUID v4.

```ts
uuid();  // "550e8400-e29b-41d4-a716-446655440000"
```

---

## Provably Fair / Seeded Mode

---

### rng

Cryptographically secure random number generator with optional seeded/provably fair mode.

```ts
rng(): number                  // Crypto RNG (0-1)
rng(seed: string): number      // Seeded RNG (deterministic)
```

```ts
import { rng } from '@esportsplus/crypto';

// Cryptographic random
let random = rng();  // 0.7234...

// Seeded/provably fair (same seed = same result)
let seeded = rng('server-seed:client-seed:nonce');  // Deterministic
```

#### Provably Fair Item Drop Example

```ts
import { hash, rng } from '@esportsplus/crypto';

// 1. Server generates secret seed (hidden until round ends)
let serverSeed = rng.seed();
let serverSeedHash = await hash(serverSeed);  // Reveal this to client before roll

// 2. Client provides their seed
let clientSeed = 'my-lucky-seed-123';

// 3. Combine seeds with nonce for deterministic result
let nonce = 0;  // Increment per roll
let combinedSeed = `${serverSeed}:${clientSeed}:${nonce}`;

// 4. Generate roll and determine drop
let items = [
    { name: 'Common Sword', weight: 0.70 },
    { name: 'Rare Armor', weight: 0.25 },
    { name: 'Legendary Helm', weight: 0.05 }
];

let roll = rng(combinedSeed);  // 0.0 - 1.0
let cumulative = 0;
let drop = items[0];

for (let i = 0, n = items.length; i < n; i++) {
    cumulative += items[i].weight;
    if (roll < cumulative) {
        drop = items[i];
        break;
    }
}

// 5. After round: reveal serverSeed so client can verify
//    Client checks: hash(serverSeed) === serverSeedHash
//    Client recalculates: rng(`${serverSeed}:${clientSeed}:${nonce}`) === roll
```

---

### rng.seed

Generate a cryptographically secure 32-byte hex seed.

```ts
rng.seed(): string
```

**Returns:** 64-character hex string

```ts
import { rng } from '@esportsplus/crypto';

let serverSeed = rng.seed();  // 'a1b2c3d4...' (64 chars)
let clientSeed = rng.seed();

// Combine for provably fair result
let result = rng(`${serverSeed}:${clientSeed}:0`);
```

#### Provably Fair System - Complete Flow

**Database Schema (per user):**
```ts
interface UserSeeds {
    id: string;
    serverSeed: string;       // Current secret (never exposed until rotation)
    serverSeedHash: string;   // SHA-256 of serverSeed (shown to user)
    clientSeed: string;       // User-provided or auto-generated
    nonce: number;            // Roll counter, increments each roll
}
```

**1. Initial Setup (User Registration/First Visit)**
```ts
import { hash, rng } from '@esportsplus/crypto';

// Server generates seeds
let serverSeed = rng.seed();
let serverSeedHash = await hash(serverSeed);
let clientSeed = rng.seed();  // Or user provides custom value

// Store in database
await db.user.create({
    id: odx(),
    serverSeed,               // Hidden from user
    serverSeedHash,           // Visible to user
    clientSeed,               // Visible to user
    nonce: 0
});

// Send to client (NEVER send serverSeed)
return { serverSeedHash, clientSeed, nonce: 0 };
```

**2. Rolling (Each Game Action)**
```ts
// Server-side roll
async function roll(userId: string) {
    let user = await db.user.get(userId);
    let { serverSeed, clientSeed, nonce } = user;

    // Generate deterministic result
    let combinedSeed = `${serverSeed}:${clientSeed}:${nonce}`;
    let result = rng(combinedSeed);

    // Increment nonce for next roll
    await db.user.update(userId, { nonce: nonce + 1 });

    // Return result (NOT the serverSeed)
    return {
        result,
        nonce,              // So user can verify later
        clientSeed,         // Confirm which seed was used
        serverSeedHash      // Confirm commitment
    };
}
```

**3. User Changes Client Seed (Anytime)**
```ts
async function updateClientSeed(userId: string, newClientSeed: string) {
    // User can change client seed freely
    // Does NOT reveal server seed
    // Does NOT reset nonce (same server seed epoch)
    await db.user.update(userId, { clientSeed: newClientSeed });
}
```

**4. Seed Rotation (User-Initiated)**
```ts
async function rotateServerSeed(userId: string) {
    let user = await db.user.get(userId);

    // Generate new server seed
    let newServerSeed = rng.seed();
    let newServerSeedHash = await hash(newServerSeed);

    // Update database
    await db.user.update(userId, {
        serverSeed: newServerSeed,
        serverSeedHash: newServerSeedHash,
        nonce: 0  // Reset nonce for new seed epoch
    });

    // NOW reveal the old serverSeed for verification
    return {
        previousServerSeed: user.serverSeed,    // User can now verify all past rolls
        previousServerSeedHash: user.serverSeedHash,
        previousNonce: user.nonce,              // Total rolls under old seed
        newServerSeedHash,                      // New commitment
        nonce: 0
    };
}
```

**5. Client-Side Verification (After Rotation)**
```ts
import { hash, rng } from '@esportsplus/crypto';

async function verifyRolls(
    previousServerSeed: string,
    previousServerSeedHash: string,
    clientSeed: string,
    rolls: { nonce: number; result: number }[]
) {
    // Step 1: Verify server didn't change the seed
    let computedHash = await hash(previousServerSeed);
    if (computedHash !== previousServerSeedHash) {
        throw new Error('Server seed does not match committed hash!');
    }

    // Step 2: Verify each roll result
    for (let i = 0, n = rolls.length; i < n; i++) {
        let { nonce, result } = rolls[i];
        let combinedSeed = `${previousServerSeed}:${clientSeed}:${nonce}`;
        let expectedResult = rng(combinedSeed);

        if (expectedResult !== result) {
            throw new Error(`Roll ${nonce} was manipulated!`);
        }
    }

    return true;  // All rolls verified
}
```

**Security Properties:**
| Property | Guarantee |
|----------|-----------|
| Server can't predict | Client seed unknown when server commits |
| Server can't manipulate | Hash commitment locks server seed |
| Client can't predict | Server seed hidden until rotation |
| Deterministic | Same seeds + nonce = same result always |
| Verifiable | User can audit all rolls after rotation |

**Timeline Example:**
```
Day 1: User signs up
       → serverSeed=ABC, hash(ABC)=XYZ shown, clientSeed=123, nonce=0

Day 1: User rolls 50 times
       → nonce increments 0→49, serverSeed stays ABC (hidden)

Day 3: User changes clientSeed to "lucky-charm"
       → nonce continues at 50, serverSeed stays ABC (hidden)

Day 5: User rolls 100 more times
       → nonce increments 50→149

Day 7: User clicks "Rotate Seed"
       → ABC revealed, user verifies all 150 rolls
       → New serverSeed=DEF, hash(DEF)=UVW shown, nonce=0
```
