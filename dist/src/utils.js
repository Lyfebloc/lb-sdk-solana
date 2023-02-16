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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BNtoJSBI = exports.currencyEquals = exports.sortedTokens = exports.isInitializedTokenAccount = exports.sortedInsert = exports.parseBigintIsh = exports.approveTokenForRouter = exports.sendAndConfirmTransaction = exports.createUserAssociatedTokenAccount = exports.isAmplifiedPool = exports.getPoolAddressByTokenPairNonce = exports.getAmplifiedPoolAddress = exports.getUnamplifiedPoolAddress = exports.getNextPoolStateAddress = exports.getTokenPairAddress = exports.sqrt = exports.validateRustTypeValue = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("./constants");
const spl_token_1 = require("@solana/spl-token");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const ks_sdk_core_1 = require("@lyfebloc/lb-sdk-core");
const jsbi_1 = __importDefault(require("jsbi"));
function validateRustTypeValue(value, rustType) {
    (0, tiny_invariant_1.default)(value.gte(constants_1.ZERO), `${value} is not a ${rustType}.`);
    (0, tiny_invariant_1.default)(value.lte(constants_1.RUST_TYPE_MAXIMA[rustType]), `${value} is not a ${rustType}.`);
}
exports.validateRustTypeValue = validateRustTypeValue;
// mock the on-chain sqrt function
function sqrt(y) {
    validateRustTypeValue(y, constants_1.RustType.U256);
    let z = constants_1.ZERO;
    let x;
    if (y.gt(constants_1.THREE)) {
        z = y;
        x = y.div(constants_1.TWO).add(constants_1.ONE);
        while (x.lt(z)) {
            z = x;
            x = y.div(x).add(x).div(constants_1.TWO);
        }
    }
    else if (!y.eq(constants_1.ZERO)) {
        z = constants_1.ONE;
    }
    return z;
}
exports.sqrt = sqrt;
/**
 * Get the address of the account holding information of the given token pair
 * @param context The Lyfebloc context
 * @param tokenAMintAddress The mint address of the first token in the pair
 * @param tokenBMintAddress The mint address of the second token in the pair
 * @returns The account address
 */
function getTokenPairAddress(context, tokenAMintAddress, tokenBMintAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const [token0MintAddress, token1MintAddress] = sortedTokens(tokenAMintAddress, tokenBMintAddress);
        const [tokenPairAddress] = yield web3_js_1.PublicKey.findProgramAddress([Buffer.from('LyfeblocTokenPair'), token0MintAddress.toBuffer(), token1MintAddress.toBuffer()], context.factoryProgram.programId);
        return tokenPairAddress;
    });
}
exports.getTokenPairAddress = getTokenPairAddress;
/**
 * Get the next pool state address of the given token pair
 * @param context The Lyfebloc context
 * @param tokenAMintAddress The mint address of the first token in the pair
 * @param tokenBMintAddress The mint address of the second token in the pair
 * @param isAmplifiedPool Is the next pool amplified?
 * @returns The pool state address
 */
function getNextPoolStateAddress(context, tokenAMintAddress, tokenBMintAddress, isAmplifiedPool) {
    return __awaiter(this, void 0, void 0, function* () {
        let tokenPairNonce;
        if (!isAmplifiedPool) {
            tokenPairNonce = new anchor_1.BN(0);
        }
        else {
            try {
                // the next pool is not the first amplified pool of the token pair
                const tokenPair = yield context.factoryProgram.account.tokenPair.fetch(yield getTokenPairAddress(context, tokenAMintAddress, tokenBMintAddress));
                tokenPairNonce = tokenPair.numAmplifiedPools.add(new anchor_1.BN(1));
            }
            catch (e) {
                // the next pool is the first amplified pool of the token pair
                tokenPairNonce = new anchor_1.BN(1);
            }
        }
        return yield getPoolAddressByTokenPairNonce(context, tokenAMintAddress, tokenBMintAddress, tokenPairNonce);
    });
}
exports.getNextPoolStateAddress = getNextPoolStateAddress;
/**
 * Get account address of the unamplified pool of the given token pair.
 * @param context The Lyfebloc context
 * @param tokenAMintAddress The mint address of the first token in the pair
 * @param tokenBMintAddress The mint address of the second token in the pair
 */
function getUnamplifiedPoolAddress(context, tokenAMintAddress, tokenBMintAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield getPoolAddressByTokenPairNonce(context, tokenAMintAddress, tokenBMintAddress, new anchor_1.BN(0));
    });
}
exports.getUnamplifiedPoolAddress = getUnamplifiedPoolAddress;
/**
 * Get account address of the amplified pool of the given token pair.
 * @param context The Lyfebloc context
 * @param tokenAMintAddress The mint address of the first token in the pair
 * @param tokenBMintAddress The mint address of the second token in the pair
 * @param index The index of the amplified pool in the pool list
 */
function getAmplifiedPoolAddress(context, tokenAMintAddress, tokenBMintAddress, index) {
    return __awaiter(this, void 0, void 0, function* () {
        if (index < 1) {
            throw 'index of amplified pool starts from 1';
        }
        return yield getPoolAddressByTokenPairNonce(context, tokenAMintAddress, tokenBMintAddress, new anchor_1.BN(index));
    });
}
exports.getAmplifiedPoolAddress = getAmplifiedPoolAddress;
function getPoolAddressByTokenPairNonce(context, tokenAMintAddress, tokenBMintAddress, tokenPairNonce) {
    return __awaiter(this, void 0, void 0, function* () {
        const [token0MintAddress, token1MintAddress] = sortedTokens(tokenAMintAddress, tokenBMintAddress);
        const [poolStateAddress] = yield web3_js_1.PublicKey.findProgramAddress([
            Buffer.from('LyfeblocPool'),
            token0MintAddress.toBuffer(),
            token1MintAddress.toBuffer(),
            tokenPairNonce.toArrayLike(Buffer, 'le', 8),
        ], context.factoryProgram.programId);
        return poolStateAddress;
    });
}
exports.getPoolAddressByTokenPairNonce = getPoolAddressByTokenPairNonce;
/**
 * Return true if the pool is an amplified pool based on its amplification factor in basis points.
 * @param amplificationFactorInBps The amplification factor in basis points.
 */
function isAmplifiedPool(amplificationFactorInBps) {
    if (amplificationFactorInBps < constants_1.AMPLIFICATION_FACTOR_BPS) {
        throw `amplification factor in basis points must be larger than basis points = ${constants_1.AMPLIFICATION_FACTOR_BPS}`;
    }
    return amplificationFactorInBps != constants_1.AMPLIFICATION_FACTOR_BPS;
}
exports.isAmplifiedPool = isAmplifiedPool;
/**
 * Create and initialize a new associated token account
 *
 * @param anchorProvider                 The anchorProvider
 * @param mint                     Mint for the account
 * @param owner                    Owner of the new account
 * @param confirmOptions           Options for confirming the transaction
 * @param programId                SPL Token program account
 * @param associatedTokenProgramId SPL Associated Token program account
 *
 * @return Address of the new associated token account
 */
function createUserAssociatedTokenAccount(anchorProvider, mint, owner, confirmOptions, programId = spl_token_1.TOKEN_PROGRAM_ID, associatedTokenProgramId = spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID) {
    return __awaiter(this, void 0, void 0, function* () {
        const associatedToken = yield (0, spl_token_1.getAssociatedTokenAddress)(mint, owner, false, programId, associatedTokenProgramId);
        const latestBlockHash = yield anchorProvider.connection.getLatestBlockhash();
        let transaction = new web3_js_1.Transaction(Object.assign({ feePayer: anchorProvider.wallet.publicKey }, latestBlockHash)).add((0, spl_token_1.createAssociatedTokenAccountInstruction)(anchorProvider.wallet.publicKey, associatedToken, owner, mint, programId, associatedTokenProgramId));
        transaction = yield anchorProvider.wallet.signTransaction(transaction);
        const signature = yield anchorProvider.connection.sendRawTransaction(transaction.serialize(), confirmOptions);
        yield anchorProvider.connection.confirmTransaction(Object.assign({ signature }, latestBlockHash), confirmOptions === null || confirmOptions === void 0 ? void 0 : confirmOptions.commitment);
        return associatedToken;
    });
}
exports.createUserAssociatedTokenAccount = createUserAssociatedTokenAccount;
/**
 * Send and confirm a transaction signed by the anchorProvider
 * @param anchorProvider The anchorProvider to sign the transaction
 * @param transaction The transaction to be sent
 */
function sendAndConfirmTransaction(anchorProvider, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const latestBlockHash = yield anchorProvider.connection.getLatestBlockhash();
        transaction.feePayer = anchorProvider.wallet.publicKey;
        transaction.recentBlockhash = latestBlockHash.blockhash;
        transaction.lastValidBlockHeight = latestBlockHash.lastValidBlockHeight;
        transaction = yield anchorProvider.wallet.signTransaction(transaction);
        try {
            const txSign = yield anchorProvider.connection.sendRawTransaction(transaction.serialize());
            yield anchorProvider.connection.confirmTransaction(Object.assign({ signature: txSign }, latestBlockHash));
            return txSign;
        }
        catch (e) {
            // console.log(e);
            throw e;
        }
    });
}
exports.sendAndConfirmTransaction = sendAndConfirmTransaction;
/**
 * Approve tokens
 * @param router The Router object
 * @param mint The mint address of the token
 * @param owner The owner of the token account
 * @param amount The amount to be approved
 */
function approveTokenForRouter(router, mint, owner, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const approveKncTx = new web3_js_1.Transaction().add((0, spl_token_1.createApproveInstruction)(yield (0, spl_token_1.getAssociatedTokenAddress)(mint, owner), yield router.getDelegatingAddress(), owner, BigInt(amount.toString())));
        yield sendAndConfirmTransaction(router.context.anchorProvider, approveKncTx);
    });
}
exports.approveTokenForRouter = approveTokenForRouter;
function parseBigintIsh(bigintIsh) {
    if (typeof bigintIsh === 'bigint')
        return new anchor_1.BN(bigintIsh.toString());
    return new anchor_1.BN(bigintIsh);
}
exports.parseBigintIsh = parseBigintIsh;
// given an array of items sorted by `comparator`, insert an item into its sort index and constrain the size to
// `maxSize` by removing the last item
function sortedInsert(items, add, maxSize, comparator) {
    (0, tiny_invariant_1.default)(maxSize > 0, 'MAX_SIZE_ZERO');
    // this is an invariant because the interface cannot return multiple removed items if items.length exceeds maxSize
    (0, tiny_invariant_1.default)(items.length <= maxSize, 'ITEMS_SIZE');
    // short circuit first item add
    if (items.length === 0) {
        items.push(add);
        return null;
    }
    else {
        const isFull = items.length === maxSize;
        // short circuit if full and the additional item does not come before the last item
        if (isFull && comparator(items[items.length - 1], add) <= 0) {
            return add;
        }
        let lo = 0, hi = items.length;
        while (lo < hi) {
            const mid = (lo + hi) >>> 1;
            if (comparator(items[mid], add) <= 0) {
                lo = mid + 1;
            }
            else {
                hi = mid;
            }
        }
        items.splice(lo, 0, add);
        return isFull ? items.pop() : null;
    }
}
exports.sortedInsert = sortedInsert;
/**
 * Check whether the account is TokenAccount which has been initialized
 * @param connection current connection to node
 * @param address the PubKey of account
 */
function isInitializedTokenAccount(connection, address) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, spl_token_1.getAccount)(connection, address, null, spl_token_1.TOKEN_PROGRAM_ID);
        }
        catch (error) {
            if (error instanceof spl_token_1.TokenAccountNotFoundError || error instanceof spl_token_1.TokenInvalidAccountOwnerError) {
                return false;
            }
        }
        return true;
    });
}
exports.isInitializedTokenAccount = isInitializedTokenAccount;
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
    if (currencyA instanceof ks_sdk_core_1.Token && currencyB instanceof ks_sdk_core_1.Token) {
        return currencyA.equals(currencyB);
    }
    if (currencyA instanceof ks_sdk_core_1.Token || currencyB instanceof ks_sdk_core_1.Token) {
        return false;
    }
    return currencyA === currencyB;
}
exports.currencyEquals = currencyEquals;
const BNtoJSBI = (value) => {
    return jsbi_1.default.BigInt(value);
};
exports.BNtoJSBI = BNtoJSBI;
// todo: add this to natively in CurrencyAmount
