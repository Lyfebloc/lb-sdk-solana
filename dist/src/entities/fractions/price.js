"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Price = void 0;
const token_1 = require("../token");
const tokenAmount_1 = require("./tokenAmount");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const constants_1 = require("../../constants");
const fraction_1 = require("./fraction");
const currencyAmount_1 = require("./currencyAmount");
const bn_js_1 = __importDefault(require("bn.js"));
class Price extends fraction_1.Fraction {
    // denominator and numerator _must_ be raw, i.e. in the native representation
    constructor(baseCurrency, quoteCurrency, denominator, numerator) {
        super(numerator, denominator);
        this.baseCurrency = baseCurrency;
        this.quoteCurrency = quoteCurrency;
        this.scalar = new fraction_1.Fraction(constants_1.TEN.pow(new bn_js_1.default(baseCurrency.decimals)), constants_1.TEN.pow(new bn_js_1.default(quoteCurrency.decimals)));
    }
    static fromRoute(route) {
        const prices = [];
        for (const [i, pair] of route.pairs.entries()) {
            prices.push(pair.priceOf(route.path[i]));
        }
        return prices.slice(1).reduce((accumulator, currentValue) => accumulator.multiply(currentValue), prices[0]);
    }
    static fromReserves(inputReserves, outputReserves) {
        (0, tiny_invariant_1.default)(inputReserves.length === outputReserves.length, 'RESERVE');
        const prices = [];
        for (const [i, inputReserve] of inputReserves.entries()) {
            prices.push(new Price(inputReserve.currency, outputReserves[i].currency, inputReserve.raw, outputReserves[i].raw));
        }
        return prices.slice(1).reduce((accumulator, currentValue) => accumulator.multiply(currentValue), prices[0]);
    }
    get raw() {
        return new fraction_1.Fraction(this.numerator, this.denominator);
    }
    get adjusted() {
        return super.multiply(this.scalar);
    }
    invert() {
        return new Price(this.quoteCurrency, this.baseCurrency, this.numerator, this.denominator);
    }
    multiply(other) {
        (0, tiny_invariant_1.default)((0, token_1.currencyEquals)(this.quoteCurrency, other.baseCurrency), 'TOKEN');
        const fraction = super.multiply(other);
        return new Price(this.baseCurrency, other.quoteCurrency, fraction.denominator, fraction.numerator);
    }
    // performs floor division on overflow
    quote(currencyAmount) {
        (0, tiny_invariant_1.default)((0, token_1.currencyEquals)(currencyAmount.currency, this.baseCurrency), 'TOKEN');
        if (this.quoteCurrency instanceof token_1.Token) {
            return new tokenAmount_1.TokenAmount(this.quoteCurrency, super.multiply(currencyAmount.raw).quotient);
        }
        return currencyAmount_1.CurrencyAmount.sol(super.multiply(currencyAmount.raw).quotient);
    }
    toSignificant(significantDigits = 6, format, rounding) {
        return this.adjusted.toSignificant(significantDigits, format, rounding);
    }
    toFixed(decimalPlaces = 4, format, rounding) {
        return this.adjusted.toFixed(decimalPlaces, format, rounding);
    }
}
exports.Price = Price;
