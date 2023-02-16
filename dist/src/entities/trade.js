"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tradeComparator = exports.inputOutputComparator = exports.Trade = void 0;
/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */
const route_1 = require("./route");
const constants_1 = require("../constants");
// import { Fraction } from './fractions'
// import { Percent } from './fractions'
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const utils_1 = require("../utils");
const ks_sdk_core_1 = require("@lyfebloc/lb-sdk-core");
/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */
// export function computePriceImpact<TInput extends Currency, TOutput extends Currency>(
//   midPrice: Price<TInput, TOutput>,
//   inputAmount: CurrencyAmount<TInput>,
//   outputAmount: CurrencyAmount<TOutput>,
// ): Percent {
//   const exactQuote = midPrice.quote(inputAmount)
//   // calculate priceImpact := (exactQuote - outputAmount) / exactQuote
//   const priceImpact = exactQuote.subtract(outputAmount).divide(exactQuote)
//   return new Percent(priceImpact.numerator, priceImpact.denominator)
// }
class Trade {
    constructor(route, amount, tradeType) {
        const tokenAmounts = new Array(route.path.length);
        const amounts = new Array(route.path.length);
        const nextInputReserves = new Array(route.pairs.length);
        const nextOutputReserves = new Array(route.pairs.length);
        if (tradeType === ks_sdk_core_1.TradeType.EXACT_INPUT) {
            (0, tiny_invariant_1.default)((0, utils_1.currencyEquals)(amount.currency, route.input), 'INPUT');
            tokenAmounts[0] = amount.wrapped;
            for (let i = 0; i < route.path.length - 1; i++) {
                const pair = route.pairs[i];
                const [outputAmount, nextPair] = pair.getOutputAmount(tokenAmounts[i]);
                tokenAmounts[i + 1] = outputAmount;
                nextInputReserves[i] = nextPair[0];
                nextOutputReserves[i] = nextPair[1];
            }
        }
        else {
            (0, tiny_invariant_1.default)(amount.currency.equals(route.output), 'OUTPUT');
            tokenAmounts[tokenAmounts.length - 1] = amount.wrapped;
            for (let i = route.path.length - 1; i > 0; i--) {
                const pair = route.pairs[i - 1];
                const [inputAmount, nextPair] = pair.getInputAmount(tokenAmounts[i]);
                tokenAmounts[i - 1] = inputAmount;
                nextInputReserves[i - 1] = nextPair[0];
                nextOutputReserves[i - 1] = nextPair[1];
            }
        }
        this.route = route;
        this.tradeType = tradeType;
        this.inputAmount =
            tradeType === ks_sdk_core_1.TradeType.EXACT_INPUT
                ? ks_sdk_core_1.CurrencyAmount.fromFractionalAmount(route.input, amount.numerator, amount.denominator)
                : ks_sdk_core_1.CurrencyAmount.fromFractionalAmount(route.input, tokenAmounts[0].numerator, tokenAmounts[0].denominator);
        this.outputAmount =
            tradeType === ks_sdk_core_1.TradeType.EXACT_OUTPUT
                ? ks_sdk_core_1.CurrencyAmount.fromFractionalAmount(route.output, amount.numerator, amount.denominator)
                : ks_sdk_core_1.CurrencyAmount.fromFractionalAmount(route.output, tokenAmounts[tokenAmounts.length - 1].numerator, tokenAmounts[tokenAmounts.length - 1].denominator);
        this.executionPrice = new ks_sdk_core_1.Price(this.inputAmount.currency, this.outputAmount.currency, this.inputAmount.quotient, this.outputAmount.quotient);
        // this.nextMidPrice = Price.fromReserves(nextInputReserves, nextOutputReserves)
        this.priceImpact = (0, ks_sdk_core_1.computePriceImpact)(route.midPrice, this.inputAmount, this.outputAmount);
    }
    /**
     * Constructs an exact in trade with the given amount in and route
     * @param route route of the exact in trade
     * @param amountIn the amount being passed in
     */
    // public static exactIn(route: Route, amountIn: CurrencyAmount<Currency>): Trade {
    static exactIn(route, amountIn) {
        return new Trade(route, amountIn, ks_sdk_core_1.TradeType.EXACT_INPUT);
    }
    /**
     * Constructs an exact out trade with the given amount out and route
     * @param route route of the exact out trade
     * @param amountOut the amount returned by the trade
     */
    static exactOut(route, amountOut) {
        return new Trade(route, amountOut, ks_sdk_core_1.TradeType.EXACT_OUTPUT);
    }
    /**
     * Get the minimum amount that must be received from this trade for the given slippage tolerance
     * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
     */
    minimumAmountOut(slippageTolerance) {
        (0, tiny_invariant_1.default)(!slippageTolerance.lessThan(constants_1.ZERO_JSBI), 'SLIPPAGE_TOLERANCE');
        if (this.tradeType === ks_sdk_core_1.TradeType.EXACT_OUTPUT) {
            return this.outputAmount;
        }
        else {
            const slippageAdjustedAmountOut = new ks_sdk_core_1.Fraction(constants_1.ONE_JSBI)
                .add(slippageTolerance)
                .invert()
                .multiply(this.outputAmount.quotient).quotient;
            return ks_sdk_core_1.CurrencyAmount.fromRawAmount(this.outputAmount.currency, slippageAdjustedAmountOut);
        }
    }
    /**
     * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
     * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
     */
    maximumAmountIn(slippageTolerance) {
        (0, tiny_invariant_1.default)(!slippageTolerance.lessThan(constants_1.ZERO_JSBI), 'SLIPPAGE_TOLERANCE');
        if (this.tradeType === ks_sdk_core_1.TradeType.EXACT_INPUT) {
            return this.inputAmount;
        }
        else {
            const slippageAdjustedAmountIn = new ks_sdk_core_1.Fraction(constants_1.ONE_JSBI)
                .add(slippageTolerance)
                .multiply(this.inputAmount.quotient).quotient;
            return ks_sdk_core_1.CurrencyAmount.fromRawAmount(this.inputAmount.currency, slippageAdjustedAmountIn);
        }
    }
    /**
     * Given a list of pairs, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
     * amount to an output token, making at most `maxHops` hops.
     * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
     * the amount in among multiple routes.
     * @param pairs the pairs to consider in finding the best trade
     * @param currencyAmountIn exact amount of input currency to spend
     * @param currencyOut the desired currency out
     * @param maxNumResults maximum number of results to return
     * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
     * @param currentPairs used in recursion; the current list of pairs
     * @param originalAmountIn used in recursion; the original value of the currencyAmountIn parameter
     * @param bestTrades used in recursion; the current list of best trades
     */
    static bestTradeExactIn(pairs, originalAmountIn, currencyOut, { maxNumResults = 3, maxHops = 3 } = {},
    // used in recursion.
    currentPairs = [], currencyAmountIn = originalAmountIn, bestTrades = []) {
        (0, tiny_invariant_1.default)(pairs.length > 0, 'PAIRS');
        (0, tiny_invariant_1.default)(maxHops > 0, 'MAX_HOPS');
        (0, tiny_invariant_1.default)(originalAmountIn === currencyAmountIn || currentPairs.length > 0, 'INVALID_RECURSION');
        const amountIn = currencyAmountIn.wrapped;
        const tokenOut = currencyOut.wrapped;
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            (0, tiny_invariant_1.default)(pair.length > 0, 'PAIRS');
            // pair irrelevant
            if (!pair[0].token0.equals(amountIn.currency) && !pair[0].token1.equals(amountIn.currency))
                continue;
            const token0 = pair[0].token0;
            const token1 = pair[0].token1;
            // iterate each pool, find the best rate
            let bestPool;
            let bestAmountOut;
            for (let j = 0; j < pair.length; j++) {
                const pool = pair[j];
                (0, tiny_invariant_1.default)(pool.token0.equals(token0), 'INVALID_PAIR');
                (0, tiny_invariant_1.default)(pool.token1.equals(token1), 'INVALID_PAIR');
                if (pool.reserve0.equalTo(constants_1.ZERO_JSBI) || pool.reserve1.equalTo(constants_1.ZERO_JSBI))
                    continue;
                let amountOut;
                try {
                    ;
                    [amountOut] = pool.getOutputAmount(amountIn);
                }
                catch (error) {
                    // input too low || not enough liquidity in this pair
                    if (error.isInsufficientInputAmountError || error.isInsufficientReservesError) {
                        continue;
                    }
                    throw error;
                }
                if (bestAmountOut === undefined) {
                    bestAmountOut = amountOut;
                    bestPool = pool;
                }
                else {
                    if (amountOut.greaterThan(bestAmountOut)) {
                        bestAmountOut = amountOut;
                        bestPool = pool;
                    }
                }
            }
            // not found any pool has rate
            if (bestAmountOut === undefined || bestPool === undefined) {
                continue;
            }
            // we have arrived at the output token, so this is the final trade of one of the paths
            if (bestAmountOut.currency.equals(tokenOut)) {
                (0, utils_1.sortedInsert)(bestTrades, new Trade(new route_1.Route([...currentPairs, bestPool], originalAmountIn.currency, currencyOut), originalAmountIn, ks_sdk_core_1.TradeType.EXACT_INPUT), maxNumResults, tradeComparator);
            }
            else if (maxHops > 1 && pairs.length > 1) {
                const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length));
                // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops
                Trade.bestTradeExactIn(pairsExcludingThisPair, originalAmountIn, currencyOut, {
                    maxNumResults,
                    maxHops: maxHops - 1,
                }, [...currentPairs, bestPool], bestAmountOut, bestTrades);
            }
        }
        return bestTrades;
    }
    /**
     * similar to the above method but instead targets a fixed output amount
     * given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
     * to an output token amount, making at most `maxHops` hops
     * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
     * the amount in among multiple routes.
     * @param pairs the pairs to consider in finding the best trade
     * @param currencyIn the currency to spend
     * @param currencyAmountOut the exact amount of currency out
     * @param maxNumResults maximum number of results to return
     * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
     * @param currentPairs used in recursion; the current list of pairs
     * @param originalAmountOut used in recursion; the original value of the currencyAmountOut parameter
     * @param bestTrades used in recursion; the current list of best trades
     */
    static bestTradeExactOut(pairs, currencyIn, originalAmountOut, { maxNumResults = 3, maxHops = 3 } = {},
    // used in recursion.
    currentPairs = [], currencyAmountOut = originalAmountOut, bestTrades = []) {
        (0, tiny_invariant_1.default)(pairs.length > 0, 'PAIRS');
        (0, tiny_invariant_1.default)(maxHops > 0, 'MAX_HOPS');
        (0, tiny_invariant_1.default)(originalAmountOut === currencyAmountOut || currentPairs.length > 0, 'INVALID_RECURSION');
        const amountOut = currencyAmountOut.wrapped;
        const tokenIn = currencyIn.wrapped;
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            (0, tiny_invariant_1.default)(pair.length > 0, 'PAIRS');
            // pair irrelevant
            if (!pair[0].token0.equals(amountOut.currency) && !pair[0].token1.equals(amountOut.currency))
                continue;
            const token0 = pair[0].token0;
            const token1 = pair[0].token1;
            // iterate each pool, find the best rate
            let bestPool;
            let bestAmountIn;
            for (let j = 0; j < pair.length; j++) {
                let pool = pair[j];
                (0, tiny_invariant_1.default)(pool.token0.equals(token0), 'INVALID_PAIR');
                (0, tiny_invariant_1.default)(pool.token1.equals(token1), 'INVALID_PAIR');
                if (pool.reserve0.equalTo(constants_1.ZERO_JSBI) || pool.reserve1.equalTo(constants_1.ZERO_JSBI))
                    continue;
                let amountIn;
                try {
                    ;
                    [amountIn] = pool.getInputAmount(amountOut);
                }
                catch (error) {
                    // input too low || not enough liquidity in this pair
                    if (error.isInsufficientInputAmountError || error.isInsufficientReservesError) {
                        continue;
                    }
                    throw error;
                }
                if (bestAmountIn === undefined) {
                    bestAmountIn = amountIn;
                    bestPool = pool;
                }
                else {
                    if (amountIn.lessThan(bestAmountIn)) {
                        bestAmountIn = amountIn;
                        bestPool = pool;
                    }
                }
            }
            // not found any pool has rate
            if (bestAmountIn === undefined || bestPool === undefined) {
                continue;
            }
            // we have arrived at the input token, so this is the first trade of one of the paths
            if (bestAmountIn.currency.equals(tokenIn)) {
                (0, utils_1.sortedInsert)(bestTrades, new Trade(new route_1.Route([bestPool, ...currentPairs], currencyIn, originalAmountOut.currency), originalAmountOut, ks_sdk_core_1.TradeType.EXACT_OUTPUT), maxNumResults, tradeComparator);
            }
            else if (maxHops > 1 && pairs.length > 1) {
                const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length));
                // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops
                Trade.bestTradeExactOut(pairsExcludingThisPair, currencyIn, originalAmountOut, {
                    maxNumResults,
                    maxHops: maxHops - 1,
                }, [bestPool, ...currentPairs], bestAmountIn, bestTrades);
            }
        }
        return bestTrades;
    }
}
exports.Trade = Trade;
// comparator function that allows sorting trades by their output amounts, in decreasing order, and then input amounts
// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first
function inputOutputComparator(a, b) {
    // must have same input and output token for comparison
    (0, tiny_invariant_1.default)((0, utils_1.currencyEquals)(a.inputAmount.currency, b.inputAmount.currency), 'INPUT_CURRENCY');
    (0, tiny_invariant_1.default)((0, utils_1.currencyEquals)(a.outputAmount.currency, b.outputAmount.currency), 'OUTPUT_CURRENCY');
    if (a.outputAmount.equalTo(b.outputAmount)) {
        if (a.inputAmount.equalTo(b.inputAmount)) {
            return 0;
        }
        // trade A requires less input than trade B, so A should come first
        if (a.inputAmount.lessThan(b.inputAmount)) {
            return -1;
        }
        else {
            return 1;
        }
    }
    else {
        // tradeA has less output than trade B, so should come second
        if (a.outputAmount.lessThan(b.outputAmount)) {
            return 1;
        }
        else {
            return -1;
        }
    }
}
exports.inputOutputComparator = inputOutputComparator;
// extension of the input output comparator that also considers other dimensions of the trade in ranking them
function tradeComparator(a, b) {
    const ioComp = inputOutputComparator(a, b);
    if (ioComp !== 0) {
        return ioComp;
    }
    // consider lowest slippage next, since these are less likely to fail
    if (a.priceImpact.lessThan(b.priceImpact)) {
        return -1;
    }
    else if (a.priceImpact.greaterThan(b.priceImpact)) {
        return 1;
    }
    // finally consider the number of hops since each hop costs gas
    return a.route.path.length - b.route.path.length;
}
exports.tradeComparator = tradeComparator;
