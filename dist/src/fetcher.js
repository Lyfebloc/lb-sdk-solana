"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fetcher = void 0;
const anchor_1 = require("@project-serum/anchor");
const src_1 = require("../src");
const spl_token_1 = require("@solana/spl-token");
const utils_1 = require("./utils");
const ks_sdk_core_1 = require("@lyfebloc/lb-sdk-core");
class Fetcher {
    /**
     * Cannot be constructed.
     */
    constructor() { }
    /**
     * @param address address of the token
     * @param anchorProvider anchorProvider which contains the network and wallet context
     * @param symbol Optional symbol name of the token
     * @param name Optional name of the token
     */
    static fetchTokenData(address, anchorProvider, symbol, name) {
        return __awaiter(this, void 0, void 0, function* () {
            // get Token Mint info from node.
            const mint = yield (0, spl_token_1.getMint)(anchorProvider.connection, address);
            return new ks_sdk_core_1.Token(ks_sdk_core_1.ChainId.SOLANA, address.toBase58(), mint.decimals, symbol, name);
        });
    }
    /**
     * Fetch all pair addresses which belongs to our Factory
     * @param tokenA tokenA Pubkey
     * @param tokenB tokenB Pubkey
     * @param context current context
     */
    static fetchPoolAddresses(tokenA, tokenB, context) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // We don't need to sort the tokens since we already do this
            // in function getTokenPairAddress and function getPoolAddressByTokenPairNonce
            const currentTokenPairAddress = yield (0, utils_1.getTokenPairAddress)(context, tokenA, tokenB);
            const tokenPairState = yield context.factoryProgram.account.tokenPair.fetch(currentTokenPairAddress);
            const pairAddresses = [];
            // Check whether the 0'th pool is exist, if existed then add to result.
            const unamplifiedPool = yield (0, utils_1.getPoolAddressByTokenPairNonce)(context, tokenA, tokenB, new anchor_1.BN(0));
            // The owner of the pool should equal to pool program id.
            if ((_b = (_a = (yield context.anchorProvider.connection.getAccountInfo(unamplifiedPool))) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.equals(context.poolProgram.programId))
                pairAddresses.push(unamplifiedPool);
            // add amplified pools to the result.
            for (let i = 1; new anchor_1.BN(i).lte(tokenPairState.numAmplifiedPools); i++) {
                const currentPool = yield (0, utils_1.getPoolAddressByTokenPairNonce)(context, tokenA, tokenB, new anchor_1.BN(i));
                pairAddresses.push(currentPool);
            }
            return pairAddresses;
        });
    }
    /**
     * Fetches information about pairs and constructs pairs array from the given two tokens.
     * @param tokenA first token
     * @param tokenB second token
     * @param context the current context
     */
    static fetchPoolData(tokenA, tokenB, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const addresses = yield Fetcher.fetchPoolAddresses(tokenA.mint, tokenB.mint, context);
            return Promise.all(addresses.map((address) => __awaiter(this, void 0, void 0, function* () {
                let poolState = yield context.poolProgram.account.pool.fetch(address);
                const reserve0 = poolState.balance.reserve0;
                const reserve1 = poolState.balance.reserve1;
                const vReserve0 = poolState.virtualBalance.vReserve0;
                const vReserve1 = poolState.virtualBalance.vReserve1;
                const feeInPrecision = poolState.feeInPrecision;
                const ampBps = poolState.curve.curveParameters;
                const balances = tokenA.sortsBefore(tokenB)
                    ? [reserve0, reserve1, vReserve0, vReserve1]
                    : [reserve1, reserve0, vReserve1, vReserve0];
                return new src_1.Pool(context, address, ks_sdk_core_1.TokenAmount.fromRawAmount(tokenA, balances[0]), ks_sdk_core_1.TokenAmount.fromRawAmount(tokenB, balances[1]), ks_sdk_core_1.TokenAmount.fromRawAmount(tokenA, balances[2]), ks_sdk_core_1.TokenAmount.fromRawAmount(tokenB, balances[3]), (0, src_1.parseBigintIsh)(feeInPrecision), ampBps);
            })));
        });
    }
}
exports.Fetcher = Fetcher;
