import { Pool } from './Pool';
import { TradeDirection } from '../constants';
import { AccountMeta } from '@solana/web3.js';
import { Currency, Price, Token } from '@lyfebloc/lb-sdk-core';
export declare class Route<TInput extends Currency, TOutput extends Currency> {
    readonly pairs: Pool[];
    readonly path: Token[];
    readonly input: TInput;
    readonly output: TOutput;
    constructor(pairs: Pool[], input: TInput, output?: TOutput);
    private _midPrice;
    get midPrice(): Price<TInput, TOutput>;
    /**
     * Get the direction of each pool in the route
     */
    get tradeDirections(): TradeDirection[];
    /**
     * Get AccountMetas of pools in the route
     */
    get accountMetas(): AccountMeta[];
}
//# sourceMappingURL=route.d.ts.map
