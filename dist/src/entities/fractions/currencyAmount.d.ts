import { Currency } from '../currency';
import { BigintIsh, Rounding } from '../../constants';
import { Fraction } from './fraction';
import BN from "bn.js";
export declare class CurrencyAmount extends Fraction {
    readonly currency: Currency;
    /**
     * Helper that calls the constructor with the SOL currency
     * @param amount sol amount in lamports
     */
    static sol(amount: BigintIsh): CurrencyAmount;
    protected constructor(currency: Currency, amount: BigintIsh);
    get raw(): BN;
    add(other: CurrencyAmount): CurrencyAmount;
    subtract(other: CurrencyAmount): CurrencyAmount;
    toSignificant(significantDigits?: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
    toExact(format?: object): string;
}
//# sourceMappingURL=currencyAmount.d.ts.map