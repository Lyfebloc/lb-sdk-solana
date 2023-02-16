"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSOL = exports.currencyEquals = exports.sortedTokens = exports.Token = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const currency_1 = require("./currency");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
/**
 * Represents an SPL token with a unique address and some metadata.
 */
class Token extends currency_1.Currency {
    constructor(mint, decimals, symbol, name) {
        super(decimals, symbol, name);
        if (mint instanceof web3_js_1.PublicKey) {
            this.mint = mint;
        }
        else {
            this.mint = new web3_js_1.PublicKey(mint);
        }
    }
    /**
     * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
     * @param other other token to compare
     */
    equals(other) {
        // short circuit on reference equality
        if (this === other) {
            return true;
        }
        return this.mint.equals(other.mint);
    }
    /**
     * Returns true if the address of this token sorts before the address of the other token
     * @param other other token to compare
     * @throws if the tokens have the same address
     * @throws if the tokens are on different chains
     */
    sortsBefore(other) {
        (0, tiny_invariant_1.default)(this.mint !== other.mint, 'ADDRESSES');
        return new anchor_1.BN(this.mint.toBytes()).lt(new anchor_1.BN(other.mint.toBytes()));
    }
}
exports.Token = Token;
/**
 * Sort the token pair by their addresses
 * @param tokenA the first token to compare
 * @param tokenB the second token to compare
 * @returns The sorted token pair
 */
function sortedTokens(tokenA, tokenB) {
    const shouldSwapAddress = new anchor_1.BN(tokenA.toBytes()).gt(new anchor_1.BN(tokenB.toBytes()));
    if (shouldSwapAddress) {
        return [tokenB, tokenA];
    }
    else {
        return [tokenA, tokenB];
    }
}
exports.sortedTokens = sortedTokens;
/**
 * Compares two currencies for equality
 */
function currencyEquals(currencyA, currencyB) {
    if (currencyA instanceof Token && currencyB instanceof Token) {
        return currencyA.equals(currencyB);
    }
    if (currencyA instanceof Token || currencyB instanceof Token) {
        return false;
    }
    return currencyA === currencyB;
}
exports.currencyEquals = currencyEquals;
exports.WSOL = new Token('So11111111111111111111111111111111111111112', 9, 'WSOL', 'Wrapped SOL');
