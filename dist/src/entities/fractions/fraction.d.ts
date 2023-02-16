import { BigintIsh, Rounding } from "../../constants";
import JSBI from "jsbi";
import BN from "bn.js";
export declare class Fraction {
    private readonly _numerator;
    private readonly _denominator;
    get numerator(): BN;
    get denominator(): BN;
    constructor(numerator: BigintIsh | JSBI, denominator?: BigintIsh | JSBI);
    get quotient(): BN;
    get remainder(): Fraction;
    invert(): Fraction;
    add(other: Fraction | BigintIsh): Fraction;
    subtract(other: Fraction | BigintIsh): Fraction;
    lessThan(other: Fraction | BigintIsh): boolean;
    equalTo(other: Fraction | BigintIsh): boolean;
    greaterThan(other: Fraction | BigintIsh): boolean;
    multiply(other: Fraction | BigintIsh): Fraction;
    divide(other: Fraction | BigintIsh): Fraction;
    toSignificant(significantDigits: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces: number, format?: object, rounding?: Rounding): string;
}
//# sourceMappingURL=fraction.d.ts.map