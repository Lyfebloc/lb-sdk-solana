import { PublicKey } from '@solana/web3.js';
import { Currency } from "./currency";
/**
 * Represents an SPL token with a unique address and some metadata.
 */
export declare class Token extends Currency {
    readonly mint: PublicKey;
    constructor(mint: PublicKey | string, decimals: number, symbol?: string, name?: string);
    /**
     * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
     * @param other other token to compare
     */
    equals(other: Token): boolean;
    /**
     * Returns true if the address of this token sorts before the address of the other token
     * @param other other token to compare
     * @throws if the tokens have the same address
     * @throws if the tokens are on different chains
     */
    sortsBefore(other: Token): boolean;
}
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
export declare const WSOL: Token;
//# sourceMappingURL=token.d.ts.map