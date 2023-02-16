"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fraction = void 0;
const constants_1 = require("../../constants");
const decimal_js_light_1 = __importDefault(require("decimal.js-light"));
const big_js_1 = __importDefault(require("big.js"));
const utils_1 = require("../../utils");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
// @ts-ignore
const toformat_1 = __importDefault(require("toformat"));
const jsbi_1 = __importDefault(require("jsbi"));
const bn_js_1 = __importDefault(require("bn.js"));
const BigWithFormat = (0, toformat_1.default)(big_js_1.default);
const DecimalWithFormat = (0, toformat_1.default)(decimal_js_light_1.default);
const toSignificantRounding = {
    [constants_1.Rounding.ROUND_DOWN]: decimal_js_light_1.default.ROUND_DOWN,
    [constants_1.Rounding.ROUND_HALF_UP]: decimal_js_light_1.default.ROUND_HALF_UP,
    [constants_1.Rounding.ROUND_UP]: decimal_js_light_1.default.ROUND_UP,
};
const toFixedRounding = {
    [constants_1.Rounding.ROUND_DOWN]: 0,
    [constants_1.Rounding.ROUND_HALF_UP]: 1,
    [constants_1.Rounding.ROUND_UP]: 3,
};
function parseJSBI(bigTntIsh) {
    return jsbi_1.default.BigInt(bigTntIsh.toString());
}
class Fraction {
    constructor(numerator, denominator = constants_1.ONE) {
        if (numerator instanceof jsbi_1.default) {
            this._numerator = numerator;
        }
        else {
            this._numerator = parseJSBI(numerator);
        }
        if (denominator instanceof jsbi_1.default) {
            this._denominator = denominator;
        }
        else {
            this._denominator = parseJSBI(denominator);
        }
    }
    get numerator() {
        return new bn_js_1.default(this._numerator.toString());
    }
    get denominator() {
        return new bn_js_1.default(this._denominator.toString());
    }
    // performs floor division
    get quotient() {
        return new bn_js_1.default(jsbi_1.default.divide(this._numerator, this._denominator).toString());
    }
    // remainder after floor division
    get remainder() {
        return new Fraction(jsbi_1.default.remainder(this._numerator, this._denominator), this._denominator);
    }
    invert() {
        return new Fraction(this._denominator, this._numerator);
    }
    add(other) {
        const otherParsed = other instanceof Fraction ? other : new Fraction((0, utils_1.parseBigintIsh)(other));
        if (jsbi_1.default.equal(this._denominator, otherParsed._denominator)) {
            return new Fraction(jsbi_1.default.add(this._numerator, otherParsed._numerator), this._denominator);
        }
        return new Fraction(jsbi_1.default.add(jsbi_1.default.multiply(this._numerator, otherParsed._denominator), jsbi_1.default.multiply(otherParsed._numerator, this._denominator)), jsbi_1.default.multiply(this._denominator, otherParsed._denominator));
    }
    subtract(other) {
        const otherParsed = other instanceof Fraction ? other : new Fraction((0, utils_1.parseBigintIsh)(other));
        if (jsbi_1.default.equal(this._denominator, otherParsed._denominator)) {
            return new Fraction(jsbi_1.default.subtract(this._numerator, otherParsed._numerator), this._denominator);
        }
        return new Fraction(jsbi_1.default.subtract(jsbi_1.default.multiply(this._numerator, otherParsed._denominator), jsbi_1.default.multiply(otherParsed._numerator, this._denominator)), jsbi_1.default.multiply(this._denominator, otherParsed._denominator));
    }
    lessThan(other) {
        const otherParsed = other instanceof Fraction ? other : new Fraction((0, utils_1.parseBigintIsh)(other));
        return jsbi_1.default.lessThan(jsbi_1.default.multiply(this._numerator, otherParsed._denominator), jsbi_1.default.multiply(otherParsed._numerator, this._denominator));
    }
    equalTo(other) {
        const otherParsed = other instanceof Fraction ? other : new Fraction((0, utils_1.parseBigintIsh)(other));
        return jsbi_1.default.equal(jsbi_1.default.multiply(this._numerator, otherParsed._denominator), jsbi_1.default.multiply(otherParsed._numerator, this._denominator));
    }
    greaterThan(other) {
        const otherParsed = other instanceof Fraction ? other : new Fraction((0, utils_1.parseBigintIsh)(other));
        return jsbi_1.default.greaterThan(jsbi_1.default.multiply(this._numerator, otherParsed._denominator), jsbi_1.default.multiply(otherParsed._numerator, this._denominator));
    }
    multiply(other) {
        const otherParsed = other instanceof Fraction ? other : new Fraction((0, utils_1.parseBigintIsh)(other));
        return new Fraction(jsbi_1.default.multiply(this._numerator, otherParsed._numerator), jsbi_1.default.multiply(this._denominator, otherParsed._denominator));
    }
    divide(other) {
        const otherParsed = other instanceof Fraction ? other : new Fraction((0, utils_1.parseBigintIsh)(other));
        return new Fraction(jsbi_1.default.multiply(this._numerator, otherParsed._denominator), jsbi_1.default.multiply(this._denominator, otherParsed._numerator));
    }
    toSignificant(significantDigits, format = { groupSeparator: '' }, rounding = constants_1.Rounding.ROUND_HALF_UP) {
        (0, tiny_invariant_1.default)(Number.isInteger(significantDigits), `${significantDigits} is not an integer.`);
        (0, tiny_invariant_1.default)(significantDigits > 0, `${significantDigits} is not positive.`);
        decimal_js_light_1.default.set({ precision: significantDigits + 1, rounding: toSignificantRounding[rounding] });
        const quotient = new decimal_js_light_1.default(this._numerator.toString())
            .div(this._denominator.toString())
            .toSignificantDigits(significantDigits);
        return new DecimalWithFormat(quotient).toFormat(quotient.decimalPlaces(), format);
    }
    toFixed(decimalPlaces, format = { groupSeparator: '' }, rounding = constants_1.Rounding.ROUND_HALF_UP) {
        (0, tiny_invariant_1.default)(Number.isInteger(decimalPlaces), `${decimalPlaces} is not an integer.`);
        (0, tiny_invariant_1.default)(decimalPlaces >= 0, `${decimalPlaces} is negative.`);
        big_js_1.default.DP = decimalPlaces;
        big_js_1.default.RM = toFixedRounding[rounding];
        return new BigWithFormat(new big_js_1.default(this._numerator.toString()).div(this._denominator.toString())).toFormat(decimalPlaces, format);
    }
}
exports.Fraction = Fraction;
