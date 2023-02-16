"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyAmount = void 0;
const currency_1 = require("../currency");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const big_js_1 = __importDefault(require("big.js"));
// @ts-ignore
const toformat_1 = __importDefault(require("toformat"));
const constants_1 = require("../../constants");
const utils_1 = require("../../utils");
const fraction_1 = require("./fraction");
const bn_js_1 = __importDefault(require("bn.js"));
const token_1 = require("../token");
const BigWithFormat = (0, toformat_1.default)(big_js_1.default);
class CurrencyAmount extends fraction_1.Fraction {
    // amount _must_ be raw, i.e. in the native representation
    constructor(currency, amount) {
        const parsedAmount = (0, utils_1.parseBigintIsh)(amount);
        (0, utils_1.validateRustTypeValue)(parsedAmount, constants_1.RustType.u64);
        super(parsedAmount, constants_1.TEN.pow(new bn_js_1.default(currency.decimals)));
        this.currency = currency;
    }
    /**
     * Helper that calls the constructor with the SOL currency
     * @param amount sol amount in lamports
     */
    static sol(amount) {
        return new CurrencyAmount(currency_1.SOL, amount);
    }
    get raw() {
        return this.numerator;
    }
    add(other) {
        (0, tiny_invariant_1.default)((0, token_1.currencyEquals)(this.currency, other.currency), 'TOKEN');
        return new CurrencyAmount(this.currency, this.raw.add(other.raw));
    }
    subtract(other) {
        (0, tiny_invariant_1.default)((0, token_1.currencyEquals)(this.currency, other.currency), 'TOKEN');
        return new CurrencyAmount(this.currency, this.raw.sub(other.raw));
    }
    toSignificant(significantDigits = 6, format, rounding = constants_1.Rounding.ROUND_DOWN) {
        return super.toSignificant(significantDigits, format, rounding);
    }
    toFixed(decimalPlaces = this.currency.decimals, format, rounding = constants_1.Rounding.ROUND_DOWN) {
        (0, tiny_invariant_1.default)(decimalPlaces <= this.currency.decimals, 'DECIMALS');
        return super.toFixed(decimalPlaces, format, rounding);
    }
    toExact(format = { groupSeparator: '' }) {
        big_js_1.default.DP = this.currency.decimals;
        return new BigWithFormat(new big_js_1.default(this.numerator.toString()).div(this.denominator.toString())).toFormat(format);
    }
}
exports.CurrencyAmount = CurrencyAmount;
