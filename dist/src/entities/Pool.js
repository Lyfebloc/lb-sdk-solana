"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = void 0;
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const errors_1 = require("../errors");
const bn_js_1 = __importDefault(require("bn.js"));
const web3_js_1 = require("@solana/web3.js");
const ks_sdk_core_1 = require("@lyfebloc/lb-sdk-core");
class Pool {
    constructor(context, address, tokenAmountA, tokenAmountB, virtualTokenAmountA, virtualTokenAmountB, fee, amp) {
        this.address = address;
        const tokenAmounts = tokenAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
            ? [tokenAmountA, tokenAmountB]
            : [tokenAmountB, tokenAmountA];
        const virtualTokenAmounts = tokenAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
            ? [virtualTokenAmountA, virtualTokenAmountB]
            : [virtualTokenAmountB, virtualTokenAmountA];
        const [poolAuthority] = web3_js_1.PublicKey.findProgramAddressSync([this.address.toBuffer()], context.poolProgram.programId);
        this.authority = poolAuthority;
        const [liquidityTokenAddress] = web3_js_1.PublicKey.findProgramAddressSync([this.address.toBuffer(), Buffer.from('LyfeblocPoolLiquidityToken')], context.factoryProgram.programId);
        const [poolToken0Account] = web3_js_1.PublicKey.findProgramAddressSync([this.address.toBuffer(), Buffer.from('LyfeblocPoolBalanceToken0')], context.factoryProgram.programId);
        this.token0Account = poolToken0Account;
        const [poolToken1Account] = web3_js_1.PublicKey.findProgramAddressSync([this.address.toBuffer(), Buffer.from('LyfeblocPoolBalanceToken1')], context.factoryProgram.programId);
        this.token1Account = poolToken1Account;
        this.liquidityToken = new ks_sdk_core_1.Token(ks_sdk_core_1.ChainId.SOLANA, liquidityTokenAddress.toBase58(), constants_1.LIQUIDITY_TOKEN_POOL_DECIMAL, 'DMM-LP', 'DMM LP');
        this.tokenAmounts = tokenAmounts;
        this.virtualTokenAmounts = virtualTokenAmounts;
        this.fee = fee;
        this.amp = amp;
    }
    /**
     * Returns true if the token is either token0 or token1
     * @param token to check
     */
    involvesToken(token) {
        return token.equals(this.token0) || token.equals(this.token1);
    }
    /**
     * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
     */
    get token0Price() {
        return new ks_sdk_core_1.Price({ baseAmount: this.virtualTokenAmounts[0], quoteAmount: this.virtualTokenAmounts[1] });
    }
    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */
    get token1Price() {
        return new ks_sdk_core_1.Price({ baseAmount: this.virtualTokenAmounts[1], quoteAmount: this.virtualTokenAmounts[0] });
    }
    /**
     * Return the price of the given token in terms of the other token in the pair.
     * @param token token to return price of
     */
    priceOf(token) {
        (0, tiny_invariant_1.default)(this.involvesToken(token), 'TOKEN');
        return token.equals(this.token0) ? this.token0Price : this.token1Price;
    }
    priceOfReal(token) {
        (0, tiny_invariant_1.default)(this.involvesToken(token), 'TOKEN');
        return token.equals(this.token0)
            ? new ks_sdk_core_1.Price({ baseAmount: this.virtualTokenAmounts[0], quoteAmount: this.virtualTokenAmounts[1] })
            : new ks_sdk_core_1.Price({ baseAmount: this.virtualTokenAmounts[1], quoteAmount: this.virtualTokenAmounts[0] });
    }
    get token0() {
        return this.tokenAmounts[0].currency;
    }
    get token1() {
        return this.tokenAmounts[1].currency;
    }
    get reserve0() {
        return this.tokenAmounts[0];
    }
    get reserve1() {
        return this.tokenAmounts[1];
    }
    get virtualReserve0() {
        return this.virtualTokenAmounts[0];
    }
    get virtualReserve1() {
        return this.virtualTokenAmounts[1];
    }
    reserveOf(token) {
        (0, tiny_invariant_1.default)(this.involvesToken(token), 'TOKEN');
        return token.equals(this.token0) ? this.reserve0 : this.reserve1;
    }
    virtualReserveOf(token) {
        (0, tiny_invariant_1.default)(this.involvesToken(token), 'TOKEN');
        return token.equals(this.token0) ? this.virtualReserve0 : this.virtualReserve1;
    }
    getOutputAmount(inputAmount) {
        (0, tiny_invariant_1.default)(this.involvesToken(inputAmount.currency), 'TOKEN');
        if (this.reserve0.equalTo(0) || this.reserve1.equalTo(0)) {
            throw new errors_1.InsufficientReservesError();
        }
        const outputToken = inputAmount.currency.equals(this.token0) ? this.token1 : this.token0;
        const inputReserve = this.virtualReserveOf(inputAmount.currency);
        const outputReserve = this.virtualReserveOf(outputToken);
        const inputAmountWithFee = inputAmount.quotientBN.mul(constants_1.PRECISION.sub(this.fee)).div(constants_1.PRECISION);
        const numerator = inputAmountWithFee.mul(outputReserve.quotientBN);
        const denominator = inputReserve.quotientBN.add(inputAmountWithFee);
        const outputAmount = ks_sdk_core_1.TokenAmount.fromRawAmount(outputToken, numerator.div(denominator));
        if (outputAmount.quotientBN.gte(this.reserveOf(outputToken).quotientBN)) {
            throw new errors_1.InsufficientReservesError();
        }
        if (outputAmount.quotientBN.eq(constants_1.ZERO)) {
            throw new errors_1.InsufficientInputAmountError();
        }
        return [outputAmount, [inputReserve.add(inputAmount), outputReserve.subtract(outputAmount)]];
    }
    getInputAmount(outputAmount) {
        (0, tiny_invariant_1.default)(this.involvesToken(outputAmount.currency), 'TOKEN');
        if (this.reserve0.quotientBN.eq(constants_1.ZERO) ||
            this.reserve1.quotientBN.eq(constants_1.ZERO) ||
            outputAmount.quotientBN.gte(this.reserveOf(outputAmount.currency).quotientBN)) {
            throw new errors_1.InsufficientReservesError();
        }
        const inputToken = outputAmount.currency.equals(this.token0) ? this.token1 : this.token0;
        const outputReserve = this.virtualReserveOf(outputAmount.currency);
        const inputReserve = this.virtualReserveOf(inputToken);
        ///
        let numerator = inputReserve.quotientBN.mul(outputAmount.quotientBN);
        let denominator = outputReserve.quotientBN.sub(outputAmount.quotientBN);
        const inputAmountWithFee = numerator.div(denominator).add(constants_1.ONE);
        numerator = inputAmountWithFee.mul(constants_1.PRECISION);
        denominator = constants_1.PRECISION.sub(this.fee);
        const inputAmount = ks_sdk_core_1.TokenAmount.fromRawAmount(inputToken, numerator.add(denominator).sub(constants_1.ONE).div(denominator));
        return [inputAmount, [inputReserve.add(inputAmount), outputReserve.subtract(outputAmount)]];
    }
    getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB) {
        (0, tiny_invariant_1.default)(totalSupply.currency.equals(this.liquidityToken), 'LIQUIDITY');
        const tokenAmounts = tokenAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
            ? [tokenAmountA, tokenAmountB]
            : [tokenAmountB, tokenAmountA];
        (0, tiny_invariant_1.default)(tokenAmounts[0].currency.equals(this.token0) && tokenAmounts[1].currency.equals(this.token1), 'TOKEN');
        let liquidity;
        if (totalSupply.quotientBN.eq(constants_1.ZERO)) {
            liquidity = (0, utils_1.sqrt)(tokenAmounts[0].quotientBN.mul(tokenAmounts[1].quotientBN)).sub(new bn_js_1.default(constants_1.MINIMUM_LIQUIDITY));
        }
        else {
            const amount0 = tokenAmounts[0].quotientBN.mul(totalSupply.quotientBN).div(this.reserve0.quotientBN);
            const amount1 = tokenAmounts[1].quotientBN.mul(totalSupply.quotientBN).div(this.reserve1.quotientBN);
            liquidity = amount0.lte(amount1) ? amount0 : amount1;
        }
        if (!liquidity.gt(constants_1.ZERO)) {
            throw new errors_1.InsufficientInputAmountError();
        }
        return ks_sdk_core_1.TokenAmount.fromRawAmount(this.liquidityToken, liquidity);
    }
    getLiquidityValue(token, totalSupply, liquidity, feeBps = constants_1.ZERO, kLast) {
        (0, tiny_invariant_1.default)(this.involvesToken(token), 'TOKEN');
        (0, tiny_invariant_1.default)(totalSupply.currency.equals(this.liquidityToken), 'TOTAL_SUPPLY');
        (0, tiny_invariant_1.default)(liquidity.currency.equals(this.liquidityToken), 'LIQUIDITY');
        (0, tiny_invariant_1.default)(liquidity.quotientBN.lte(totalSupply.quotientBN), 'LIQUIDITY');
        let totalSupplyAdjusted;
        if (feeBps.eq(constants_1.ZERO)) {
            totalSupplyAdjusted = totalSupply;
        }
        else {
            (0, tiny_invariant_1.default)(!!kLast, 'K_LAST');
            const kLastParsed = (0, utils_1.parseBigintIsh)(kLast);
            if (!kLastParsed.eq(constants_1.ZERO)) {
                const rootK = (0, utils_1.sqrt)(this.virtualReserve0.quotientBN.mul(this.virtualReserve1.quotientBN));
                const rootKLast = (0, utils_1.sqrt)(kLastParsed);
                if (rootK.gt(rootKLast)) {
                    const numerator = totalSupply.quotientBN.mul(rootK.sub(rootKLast)).mul(feeBps);
                    const denominator = rootK.add(rootKLast).mul(new bn_js_1.default(5000));
                    const feeLiquidity = numerator.div(denominator);
                    totalSupplyAdjusted = totalSupply.add(ks_sdk_core_1.TokenAmount.fromRawAmount(this.liquidityToken, feeLiquidity));
                }
                else {
                    totalSupplyAdjusted = totalSupply;
                }
            }
            else {
                totalSupplyAdjusted = totalSupply;
            }
        }
        return ks_sdk_core_1.TokenAmount.fromRawAmount(token, liquidity.quotientBN.mul(this.reserveOf(token).quotientBN).div(totalSupplyAdjusted.quotientBN));
    }
}
exports.Pool = Pool;
