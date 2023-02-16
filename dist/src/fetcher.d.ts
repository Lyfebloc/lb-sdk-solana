import { AnchorProvider } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { Pool } from '../src';
import { Context } from './context';
import { Token } from '@lyfebloc/lb-sdk-core';
export declare abstract class Fetcher {
    /**
     * Cannot be constructed.
     */
    private constructor();
    /**
     * @param address address of the token
     * @param anchorProvider anchorProvider which contains the network and wallet context
     * @param symbol Optional symbol name of the token
     * @param name Optional name of the token
     */
    static fetchTokenData(address: PublicKey, anchorProvider: AnchorProvider, symbol?: string, name?: string): Promise<Token>;
    /**
     * Fetch all pair addresses which belongs to our Factory
     * @param tokenA tokenA Pubkey
     * @param tokenB tokenB Pubkey
     * @param context current context
     */
    static fetchPoolAddresses(tokenA: PublicKey, tokenB: PublicKey, context: Context): Promise<PublicKey[]>;
    /**
     * Fetches information about pairs and constructs pairs array from the given two tokens.
     * @param tokenA first token
     * @param tokenB second token
     * @param context the current context
     */
    static fetchPoolData(tokenA: Token, tokenB: Token, context: Context): Promise<Pool[]>;
}
//# sourceMappingURL=fetcher.d.ts.map
