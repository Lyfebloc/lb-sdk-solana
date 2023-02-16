import { BigintIsh } from '../constants';
import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';
import { Context } from '../context';
import { Price, Token, TokenAmount } from '@lyfebloc/lb-sdk-core';
export declare class Pool {
    /** The address that acts as a signer which can only be signed by the Lyfebloc Pool program */
    readonly authority: PublicKey;
    readonly liquidityToken: Token;
    /** The TokenAccount address of token0 */
    readonly token0Account: PublicKey;
    /** The TokenAccount address of token1 */
    readonly token1Account: PublicKey;
    private readonly tokenAmounts;
    private readonly virtualTokenAmounts;
    readonly fee: BN;
    readonly address: PublicKey;
    readonly amp: BN;
    constructor(context: Context, address: PublicKey, tokenAmountA: TokenAmount, tokenAmountB: TokenAmount, virtualTokenAmountA: TokenAmount, virtualTokenAmountB: TokenAmount, fee: BN, amp: BN);
    /**
     * Returns true if the token is either token0 or token1
     * @param token to check
     */
    involvesToken(token: Token): boolean;
    /**
     * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
     */
    get token0Price(): Price<Token, Token>;
    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */
    get token1Price(): Price<Token, Token>;
    /**
     * Return the price of the given token in terms of the other token in the pair.
     * @param token token to return price of
     */
    priceOf(token: Token): Price<Token, Token>;
    priceOfReal(token: Token): Price<Token, Token>;
    get token0(): Token;
    get token1(): Token;
    get reserve0(): TokenAmount;
    get reserve1(): TokenAmount;
    get virtualReserve0(): TokenAmount;
    get virtualReserve1(): TokenAmount;
    reserveOf(token: Token): TokenAmount;
    virtualReserveOf(token: Token): TokenAmount;
    getOutputAmount(inputAmount: TokenAmount): [TokenAmount, TokenAmount[]];
    getInputAmount(outputAmount: TokenAmount): [TokenAmount, TokenAmount[]];
    getLiquidityMinted(totalSupply: TokenAmount, tokenAmountA: TokenAmount, tokenAmountB: TokenAmount): TokenAmount;
    getLiquidityValue(token: Token, totalSupply: TokenAmount, liquidity: TokenAmount, feeBps?: BN, kLast?: BigintIsh): TokenAmount;
}
//# sourceMappingURL=Pool.d.ts.map
