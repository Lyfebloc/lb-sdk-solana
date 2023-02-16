"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenAmount = void 0;
const currencyAmount_1 = require("./currencyAmount");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
class TokenAmount extends currencyAmount_1.CurrencyAmount {
    // amount _must_ be raw, i.e. in the native representation
    constructor(token, amount) {
        super(token, amount);
        this.token = token;
    }
    add(other) {
        (0, tiny_invariant_1.default)(this.token.equals(other.token), 'TOKEN');
        return new TokenAmount(this.token, this.raw.add(other.raw));
    }
    subtract(other) {
        (0, tiny_invariant_1.default)(this.token.equals(other.token), 'TOKEN');
        return new TokenAmount(this.token, this.raw.sub(other.raw));
    }
}
exports.TokenAmount = TokenAmount;
