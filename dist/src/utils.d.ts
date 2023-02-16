/// <reference types="bn.js" />
import { BN, AnchorProvider } from '@project-serum/anchor';
import { ConfirmOptions, Connection, PublicKey, Transaction } from '@solana/web3.js';
import { BigintIsh, RustType } from './constants';
import { Context } from './context';
import { Router } from './router';
import { Currency } from '@lyfebloc/lb-sdk-core';
import JSBI from 'jsbi';
export declare function validateRustTypeValue(value: BN, rustType: RustType): void;
export declare function sqrt(y: BN): BN;
/**
 * Get the address of the account holding information of the given token pair
 * @param context The Lyfebloc context
 * @param tokenAMintAddress The mint address of the first token in the pair
 * @param tokenBMintAddress The mint address of the second token in the pair
 * @returns The account address
 */
export declare function getTokenPairAddress(context: Context, tokenAMintAddress: PublicKey, tokenBMintAddress: PublicKey): Promise<PublicKey>;
/**
 * Get the next pool state address of the given token pair
 * @param context The Lyfebloc context
 * @param tokenAMintAddress The mint address of the first token in the pair
 * @param tokenBMintAddress The mint address of the second token in the pair
 * @param isAmplifiedPool Is the next pool amplified?
 * @returns The pool state address
 */
export declare function getNextPoolStateAddress(context: Context, tokenAMintAddress: PublicKey, tokenBMintAddress: PublicKey, isAmplifiedPool: boolean): Promise<PublicKey>;
/**
 * Get account address of the unamplified pool of the given token pair.
 * @param context The Lyfebloc context
 * @param tokenAMintAddress The mint address of the first token in the pair
 * @param tokenBMintAddress The mint address of the second token in the pair
 */
export declare function getUnamplifiedPoolAddress(context: Context, tokenAMintAddress: PublicKey, tokenBMintAddress: PublicKey): Promise<PublicKey>;
/**
 * Get account address of the amplified pool of the given token pair.
 * @param context The Lyfebloc context
 * @param tokenAMintAddress The mint address of the first token in the pair
 * @param tokenBMintAddress The mint address of the second token in the pair
 * @param index The index of the amplified pool in the pool list
 */
export declare function getAmplifiedPoolAddress(context: Context, tokenAMintAddress: PublicKey, tokenBMintAddress: PublicKey, index: number): Promise<PublicKey>;
export declare function getPoolAddressByTokenPairNonce(context: Context, tokenAMintAddress: PublicKey, tokenBMintAddress: PublicKey, tokenPairNonce: BN): Promise<PublicKey>;
/**
 * Return true if the pool is an amplified pool based on its amplification factor in basis points.
 * @param amplificationFactorInBps The amplification factor in basis points.
 */
export declare function isAmplifiedPool(amplificationFactorInBps: number): boolean;
/**
 * Create and initialize a new associated token account
 *
 * @param anchorProvider                 The anchorProvider
 * @param mint                     Mint for the account
 * @param owner                    Owner of the new account
 * @param confirmOptions           Options for confirming the transaction
 * @param programId                SPL Token program account
 * @param associatedTokenProgramId SPL Associated Token program account
 *
 * @return Address of the new associated token account
 */
export declare function createUserAssociatedTokenAccount(anchorProvider: AnchorProvider, mint: PublicKey, owner: PublicKey, confirmOptions?: ConfirmOptions, programId?: PublicKey, associatedTokenProgramId?: PublicKey): Promise<PublicKey>;
/**
 * Send and confirm a transaction signed by the anchorProvider
 * @param anchorProvider The anchorProvider to sign the transaction
 * @param transaction The transaction to be sent
 */
export declare function sendAndConfirmTransaction(anchorProvider: AnchorProvider, transaction: Transaction): Promise<string>;
/**
 * Approve tokens
 * @param router The Router object
 * @param mint The mint address of the token
 * @param owner The owner of the token account
 * @param amount The amount to be approved
 */
export declare function approveTokenForRouter(router: Router, mint: PublicKey, owner: PublicKey, amount: BN): Promise<void>;
export declare function parseBigintIsh(bigintIsh: BigintIsh): BN;
export declare function sortedInsert<T>(items: T[], add: T, maxSize: number, comparator: (a: T, b: T) => number): T | null;
/**
 * Check whether the account is TokenAccount which has been initialized
 * @param connection current connection to node
 * @param address the PubKey of account
 */
export declare function isInitializedTokenAccount(connection: Connection, address: PublicKey): Promise<boolean>;
/**
 * Sort the token pair by their addresses
 * @param tokenA the first token to compare
 * @param tokenB the second token to compare
 * @returns The sorted token pair
 */
export declare function sortedTokens(tokenA: PublicKey, tokenB: PublicKey): [PublicKey, PublicKey];
/**
 * Compares two currencies for equality
 */
export declare function currencyEquals(currencyA: Currency, currencyB: Currency): boolean;
export declare const BNtoJSBI: (value: BN) => JSBI;
//# sourceMappingURL=utils.d.ts.map
