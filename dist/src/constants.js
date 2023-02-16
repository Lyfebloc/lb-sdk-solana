"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIQUIDITY_TOKEN_POOL_DECIMAL = exports.RUST_TYPE_MAXIMA = exports.RustType = exports.TradeDirection = exports.PRECISION_JSBI = exports._100_JSBI = exports.TEN_JSBI = exports.THREE_JSBI = exports.TWO_JSBI = exports.ONE_JSBI = exports.ZERO_JSBI = exports.PRECISION = exports._100 = exports.TEN = exports.THREE = exports.TWO = exports.ONE = exports.ZERO = exports.INCINERATOR = exports.MINIMUM_LIQUIDITY = exports.FEE_OPTIONS = exports.FEE_BPS = exports.AMPLIFICATION_FACTOR_BPS = exports.Rounding = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@project-serum/anchor");
const jsbi_1 = __importDefault(require("jsbi"));
var Rounding;
(function (Rounding) {
    Rounding[Rounding["ROUND_DOWN"] = 0] = "ROUND_DOWN";
    Rounding[Rounding["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
    Rounding[Rounding["ROUND_UP"] = 2] = "ROUND_UP";
})(Rounding = exports.Rounding || (exports.Rounding = {}));
exports.AMPLIFICATION_FACTOR_BPS = 10000;
exports.FEE_BPS = 10000;
exports.FEE_OPTIONS = [1, 5, 30, 50, 100];
exports.MINIMUM_LIQUIDITY = 1000;
exports.INCINERATOR = new web3_js_1.PublicKey('1nc1nerator11111111111111111111111111111111');
// exports for internal consumption
exports.ZERO = new anchor_1.BN(0);
exports.ONE = new anchor_1.BN(1);
exports.TWO = new anchor_1.BN(2);
exports.THREE = new anchor_1.BN(3);
exports.TEN = new anchor_1.BN(10);
exports._100 = new anchor_1.BN(100);
exports.PRECISION = new anchor_1.BN(10).pow(new anchor_1.BN(9));
exports.ZERO_JSBI = jsbi_1.default.BigInt(0);
exports.ONE_JSBI = jsbi_1.default.BigInt(1);
exports.TWO_JSBI = jsbi_1.default.BigInt(2);
exports.THREE_JSBI = jsbi_1.default.BigInt(3);
exports.TEN_JSBI = jsbi_1.default.BigInt(10);
exports._100_JSBI = jsbi_1.default.BigInt(100);
exports.PRECISION_JSBI = jsbi_1.default.exponentiate(jsbi_1.default.BigInt(10), jsbi_1.default.BigInt(9));
var TradeDirection;
(function (TradeDirection) {
    TradeDirection[TradeDirection["ZERO_TO_ONE"] = 0] = "ZERO_TO_ONE";
    TradeDirection[TradeDirection["ONE_TO_ZERO"] = 1] = "ONE_TO_ZERO";
})(TradeDirection = exports.TradeDirection || (exports.TradeDirection = {}));
var RustType;
(function (RustType) {
    RustType["u64"] = "u64";
    RustType["U256"] = "U256";
})(RustType = exports.RustType || (exports.RustType = {}));
exports.RUST_TYPE_MAXIMA = {
    [RustType.u64]: new anchor_1.BN(2).pow(new anchor_1.BN(64)).sub(exports.ONE),
    [RustType.U256]: new anchor_1.BN(2).pow(new anchor_1.BN(256)).sub(exports.ONE),
};
exports.LIQUIDITY_TOKEN_POOL_DECIMAL = 9;
