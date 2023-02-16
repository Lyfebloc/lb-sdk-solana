# Creating a AnchorProvider instance

```typescript
import { AnchorProvider } from '@project-serum/anchor'

const anchorProvider = AnchorProvider.env()
```

# Creating a Router instance

```typescript
const router = new Router(
  new Context(
    anchorProvider,
    'LyfeblocFactory111111111111111111111111111',
    'LyfeblocPooL111111111111111111111111111111',
    'LyfeblocRouter1111111111111111111111111111',
  ),
  new PublicKey(process.env.ROUTER_STATE_ADDRESS!),
)
```

# Examples

- Put addresses into `examples/.env` file
  - Required: `ANCHOR_PROVIDER_URL`, `ANCHOR_WALLET`, `LYFEBLOC_POOL_PROGRAM`, `LYFEBLOC_FACTORY_PROGRAM`, `LYFEBLOC_ROUTER_PROGRAM`, `FACTORY_STATE_ADDRESS`, `ROUTER_STATE_ADDRESS`
  - E.g

```
ANCHOR_PROVIDER_URL=https://api.testnet.solana.com
ANCHOR_WALLET=/Users/username/.config/solana/id.json
LYFEBLOC_POOL_PROGRAM=675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8
LYFEBLOC_FACTORY_PROGRAM=5quBtoiQqxF9Jv6KYKctB59NT3gtJD2Y65kdnB1Uev3h
LYFEBLOC_ROUTER_PROGRAM=routeUGWgWzqBWFcrCfv8tritsqukccJPu3q5GPP3xS
FACTORY_STATE_ADDRESS=HWoZFnLkKeGHrHwu9sySFts3oTVfDfQ9TnwXEqpSGU5D
ROUTER_STATE_ADDRESS=ASBnocaA9kg8QgyZZ23o7C9scVrxPaWZVLP1PEwhyqBw
COMMITMENT_LEVEL=confirmed
SOL_MINT=So11111111111111111111111111111111111111112
RAY_MINT=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R
```

- To ensure token accounts have been created, run `spl-token accounts`

- Run `yarn run ts-node examples/{THE_EXAMPLE_TO_RUN_FILENAME}.ts`

## Add Liquidity New Pool

- Call Router's method `addLiquidityNewPool` to construct a ready-to-send transaction

```typescript
const tx = await router.addLiquidityNewPool(
  anchorProvider.wallet.publicKey,
  RAY,
  SOL,
  20000,
  1,
  rayAmount,
  solAmount,
  new BN(0),
  new BN(0),
)
```

- Because AddLiquidityNewPool needs more than 400_000 compute units, we should request more compute unit
  - Use method `createRequestUnitsInstruction` to construct a request CU instruction
  - Put request CU instruction to the current transaction's instruction list

```typescript
tx.instructions = [createRequestUnitsInstruction(Router.ADD_LIQUIDITY_NEW_POOL_COMPUTE_BUDGET, 0), ...tx.instructions]
```

## Add Liquidity

- Call Router's method `addLiquidity` to construct a ready-to-send transaction

```typescript
const tx = await router.addLiquidity(
  poolStateAddress,
  anchorProvider.wallet.publicKey,
  RAY,
  rayAmount,
  solAmount,
  new BN(0),
  new BN(0),
)
```

## Remove Liquidity

- Call Router's method `removeLiquidity` to construct a ready-to-send transaction

```typescript
const tx = await router.removeLiquidity(
  poolStateAddress,
  anchorProvider.wallet.publicKey,
  RAY,
  liquidityAmount,
  new BN(0),
  new BN(0),
)
```

## Swap

- Call Router's method `swap` to construct a ready-to-send transaction

```typescript
const tx = await router.swap(anchorProvider.wallet.publicKey, trade, {
  allowedSlippage: new Percent('1', '100'),
})
```

## Send transaction

- Use method `sendAndConfirmTransaction` to sign transaction (using Wallet) then send to nodes and wait for confirmation

```typescript
const txHash = await sendAndConfirmTransaction(anchorProvider, tx)
```

- A transaction hash will be returned if the transaction's successful
