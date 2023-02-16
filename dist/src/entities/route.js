"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const currency_1 = require("./currency");
const constants_1 = require("../constants");
const ks_sdk_core_1 = require("@lyfebloc/lb-sdk-core");
class Route {
    constructor(pairs, input, output) {
        this._midPrice = null;
        (0, tiny_invariant_1.default)(pairs.length > 0, 'PAIRS');
        (0, tiny_invariant_1.default)((input instanceof ks_sdk_core_1.Token && pairs[0].involvesToken(input)) || (input === currency_1.SOL && pairs[0].involvesToken(currency_1.WSOL)), 'INPUT');
        (0, tiny_invariant_1.default)(typeof output === 'undefined' ||
            (output instanceof ks_sdk_core_1.Token && pairs[pairs.length - 1].involvesToken(output)) ||
            (output === currency_1.SOL && pairs[pairs.length - 1].involvesToken(currency_1.WSOL)), 'OUTPUT');
        const path = [input instanceof ks_sdk_core_1.Token ? input : currency_1.WSOL];
        for (const [i, pair] of pairs.entries()) {
            const currentInput = path[i];
            (0, tiny_invariant_1.default)(currentInput.equals(pair.token0) || currentInput.equals(pair.token1), 'PATH');
            const output = currentInput.equals(pair.token0) ? pair.token1 : pair.token0;
            path.push(output);
        }
        this.pairs = pairs;
        this.path = path;
        this.input = input;
        this.output = output !== null && output !== void 0 ? output : path[path.length - 1];
    }
    get midPrice() {
        if (this._midPrice !== null)
            return this._midPrice;
        const prices = [];
        for (const [i, pair] of this.pairs.entries()) {
            prices.push(pair.priceOf(this.path[i]));
        }
        const reduced = prices.slice(1).reduce((accumulator, currentValue) => accumulator.multiply(currentValue), prices[0]);
        return (this._midPrice = new ks_sdk_core_1.Price(this.input, this.output, reduced.denominator, reduced.numerator));
    }
    /**
     * Get the direction of each pool in the route
     */
    get tradeDirections() {
        const dirs = [];
        for (let i = 0; i < this.pairs.length; i += 1) {
            if (this.pairs[i].token0.equals(this.path[i])) {
                dirs.push(constants_1.TradeDirection.ZERO_TO_ONE);
            }
            else {
                dirs.push(constants_1.TradeDirection.ONE_TO_ZERO);
            }
        }
        return dirs;
    }
    /**
     * Get AccountMetas of pools in the route
     */
    get accountMetas() {
        return this.pairs.map((p) => ({
            pubkey: p.address,
            isSigner: false,
            isWritable: true,
        }));
    }
}
exports.Route = Route;
