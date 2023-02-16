/// <reference types="bn.js" />
import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import JSBI from 'jsbi';
export declare type BigintIsh = BN | bigint | string;
export declare enum Rounding {
    ROUND_DOWN = 0,
    ROUND_HALF_UP = 1,
    ROUND_UP = 2
}
export declare const AMPLIFICATION_FACTOR_BPS: number;
export declare const FEE_BPS: number;
export declare const FEE_OPTIONS: number[];
export declare const MINIMUM_LIQUIDITY: number;
export declare const INCINERATOR: PublicKey;
export declare const ZERO: BN;
export declare const ONE: BN;
export declare const TWO: BN;
export declare const THREE: BN;
export declare const TEN: BN;
export declare const _100: BN;
export declare const PRECISION: BN;
export declare const ZERO_JSBI: JSBI;
export declare const ONE_JSBI: JSBI;
export declare const TWO_JSBI: JSBI;
export declare const THREE_JSBI: JSBI;
export declare const TEN_JSBI: JSBI;
export declare const _100_JSBI: JSBI;
export declare const PRECISION_JSBI: JSBI;
export declare enum TradeDirection {
    ZERO_TO_ONE = 0,
    ONE_TO_ZERO = 1
}
export declare enum RustType {
    u64 = "u64",
    U256 = "U256"
}
export declare const RUST_TYPE_MAXIMA: {
    u64: BN;
    U256: BN;
};
export declare const LIQUIDITY_TOKEN_POOL_DECIMAL = 9;
//# sourceMappingURL=constants.d.ts.map