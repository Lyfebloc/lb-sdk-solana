/// <reference types="bn.js" />
import { Context } from './context';
import { PublicKey, Transaction } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import { Trade } from './entities';
import { Currency, Percent, TradeType } from '@lyfebloc/lb-sdk-core';
/**
 * Options for producing the arguments to send call to the router.
 */
export interface TradeOptions {
    /**
     * How much the execution price is allowed to move unfavorably from the trade execution price.
     */
    allowedSlippage: Percent;
}
/**
 * Represents the Lyfebloc Router, and has methods for creating liquidity txs.
 */
export declare class Router {
    /** The compute budget needed for the AddLiquidityNewPool transaction to be successfully executed */
    static readonly ADD_LIQUIDITY_NEW_POOL_COMPUTE_BUDGET: number;
    /**
     * @param context The Lyfebloc context
     */
    constructor(context: Context);
    protected _context: Context;
    get context(): Context;
    protected _routerStateAddress: PublicKey;
    /**
     * Get the address of the storage account of this router
     */
    get routerStateAddress(): PublicKey;
    /**
     * Get the address to delegate fund to.
     * @returns The delegating address
     */
    getDelegatingAddress(): Promise<PublicKey>;
    /**
     * Get the Wrapped SOL TokenAccount whose owner is the Lyfebloc Router program
     */
    getWSOLUnwrapper(): Promise<PublicKey>;
    /**
     * Construct an AddLiquidity transaction or AddLiquiditySOL transaction if prefer native token.
     * @param poolStateAddress The account address of the Lyfebloc pool to add liquidity to
     * @param liquidityProvider The public key of liquidity anchorProvider
     * @param tokenAMintAddress The mint address of one of the two tokens of the pool
     * @param tokenAAmount The liquidity amount of the first token
     * @param tokenBAmount The liquidity amount of the second token
     * @param tokenAAmountMin The minimum liquidity amount should be added of the first token
     * @param tokenBAmountMin The minimum liquidity amount should be added of the second token
     * @param preferNativeToken If one of the two token is WSOL, use liquidity anchorProvider's native SOL instead
     * @returns The built transaction
     * The transaction contains the following instruction(s):
     *   1. `AddLiquidity` or `AddLiquiditySOL` instruction of the Lyfebloc Router program
     */
    addLiquidity(poolStateAddress: PublicKey, liquidityProvider: PublicKey, tokenAMintAddress: PublicKey, tokenAAmount: BN, tokenBAmount: BN, tokenAAmountMin: BN, tokenBAmountMin: BN, preferNativeToken?: boolean): Promise<Transaction>;
    /**
     * Construct a transaction that create a new pool then add liquidity to it.
     * @param liquidityProvider The public key of liquidity anchorProvider
     * @param tokenAMintAddress The mint address of the first token of the being created pool
     * @param tokenBMintAddress The mint address of the second token of the being created pool
     * @param amplificationFactorInBps The amplification factor of the being created pool, in basis points
     * @param feeInBps The trading fee of the being created pool, in basis points
     * @param tokenAAmount The liquidity amount of the first token
     * @param tokenBAmount The liquidity amount of the second token
     * @param tokenAAmountMin The minimum liquidity amount should be added of the first token
     * @param tokenBAmountMin The minimum liquidity amount should be added of the second token
     * @param preferNativeToken If one of the two token is WSOL, use liquidity provider's native SOL instead
     * @returns The built transaction
     * The transaction contains the following instruction(s):
     *   1. `CreatePool` instruction of the Lyfebloc Factory program
     *   2. `Create` instruction of the AssociatedToken program,
     *       to create an associated token account of liquidity pool token for the user
     *   3. `AddLiquidity` instruction of the Lyfebloc Pool program
     */
    addLiquidityNewPool(liquidityProvider: PublicKey, tokenAMintAddress: PublicKey, tokenBMintAddress: PublicKey, amplificationFactorInBps: number, feeInBps: number, tokenAAmount: BN, tokenBAmount: BN, tokenAAmountMin: BN, tokenBAmountMin: BN, preferNativeToken?: boolean): Promise<Transaction>;
    /**
     * Construct a RemoveLiquidity transaction or RemoveLiquiditySOL transaction if prepfer native token.
     * The transaction contains the following instruction(s):
     *   1. `RemoveLiquidity` or `RemoveLiquiditySOL` of the Lyfebloc Router program
     * @param poolStateAddress The account address of the Lyfebloc pool to add liquidity to
     * @param liquidityProvider The public key of liquidity anchorProvider
     * @param tokenAMintAddress The mint address of one of the two tokens of the pool
     * @param liquidity The liquidity amount to be removed
     * @param amountAMin The minimum amount that liquidity anchorProvider should get back of the first token
     * @param amountBMin The minimum amount that liquidity anchorProvider should get back of the second token
     * @param preferNativeToken If one of the two token is WSOL, use liquidity anchorProvider's native SOL instead
     * @returns The built transaction
     * The transaction contains the following instruction(s):
     *   1. `RemoveLiquidity` or `RemoveLiquiditySOL` instruction of the Lyfebloc Router program
     */
    removeLiquidity(poolStateAddress: PublicKey, liquidityProvider: PublicKey, tokenAMintAddress: PublicKey, liquidity: BN, amountAMin: BN, amountBMin: BN, preferNativeToken?: boolean): Promise<Transaction>;
    /**
     * Produces the on-chain transaction for a given trade.
     * @param trader the address of the trader
     * @param trade to produce call parameters for
     * @param options options for the call parameters
     */
    swap(trader: PublicKey, trade: Trade<Currency, Currency, TradeType>, options: TradeOptions): Promise<Transaction>;
    private swapExactTokensForTokensOrSOL;
    private swapExactSOLForTokens;
    private swapTokensForExactTokensOrSOL;
    private swapSOLForExactTokens;
    private makeSwapInstructions;
}
//# sourceMappingURL=router.d.ts.map
