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
exports.Router = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@project-serum/anchor");
const spl_token_1 = require("@solana/spl-token");
const entities_1 = require("./entities");
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const ks_sdk_core_1 = require("@lyfebloc/lb-sdk-core");
/**
 * Represents the Lyfebloc Router, and has methods for creating liquidity txs.
 */
class Router {
    /**
     * @param context The Lyfebloc context
     */
    constructor(context) {
        const [routerState] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('LyfeblocRouterState')], context.routerProgram.programId);
        this._context = context;
        this._routerStateAddress = routerState;
    }
    get context() {
        return this._context;
    }
    /**
     * Get the address of the storage account of this router
     */
    get routerStateAddress() {
        return this._routerStateAddress;
    }
    /**
     * Get the address to delegate fund to.
     * @returns The delegating address
     */
    getDelegatingAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            const [routerAuthority] = yield web3_js_1.PublicKey.findProgramAddress([Buffer.from('LyfeblocRouter')], this._context.routerProgram.programId);
            return routerAuthority;
        });
    }
    /**
     * Get the Wrapped SOL TokenAccount whose owner is the Lyfebloc Router program
     */
    getWSOLUnwrapper() {
        return __awaiter(this, void 0, void 0, function* () {
            const [routerBalanceWsol] = yield web3_js_1.PublicKey.findProgramAddress([Buffer.from('WSOLUnwrapper')], this._context.routerProgram.programId);
            return routerBalanceWsol;
        });
    }
    /**
     * Construct an AddLiquidity transaction or AddLiquiditySOL transaction if prefer native token.
     * @param poolStateAddress The account address of the Lyfebloc pool to add liquidity to
     * @param liquidityProvider The public key of liquidity anchorProvider
     * @param tokenAMintAddress The mint address of one of the two tokens of the pool
     * @param tokenAAmount The liquidity amount of the first token
     * @param tokenBAmount The liquidity amount of the second token
     * @param tokenAAmountMin The minimum liquidity amount should be added of the first token
     * @param tokenBAmountMin The minimum liquidity amount should be added of the second token
     * @param preferNativeToken If one of the two token is WSOL, use liquidity anchorProvider's native SOL instead
     * @returns The built transaction
     * The transaction contains the following instruction(s):
     *   1. `AddLiquidity` or `AddLiquiditySOL` instruction of the Lyfebloc Router program
     */
    addLiquidity(poolStateAddress, liquidityProvider, tokenAMintAddress, tokenAAmount, tokenBAmount, tokenAAmountMin, tokenBAmountMin, preferNativeToken = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const poolState = yield this._context.poolProgram.account.pool.fetch(poolStateAddress);
            if (!(tokenAMintAddress.equals(poolState.token0Mint) || tokenAMintAddress.equals(poolState.token1Mint))) {
                throw `the given pool does not contain token ${tokenAMintAddress.toBase58()}`;
            }
            if (preferNativeToken) {
                if (!(poolState.token0Mint.equals(new web3_js_1.PublicKey(entities_1.WSOL.address)) ||
                    poolState.token1Mint.equals(new web3_js_1.PublicKey(entities_1.WSOL.address)))) {
                    throw `the given pool does not contain Wrapped SOL token, please set preferNativeToken to false`;
                }
            }
            const [poolAuthority] = yield web3_js_1.PublicKey.findProgramAddress([poolStateAddress.toBuffer()], this._context.poolProgram.programId);
            const factoryState = yield this._context.factoryProgram.account.factory.fetch(poolState.factoryAddress);
            const factoryBalanceFeeTo = yield (0, spl_token_1.getAssociatedTokenAddress)(poolState.poolMint, factoryState.feeTo);
            const liquidityProviderLiquidityToken = yield (0, spl_token_1.getAssociatedTokenAddress)(poolState.poolMint, liquidityProvider);
            const delegatingAddress = yield this.getDelegatingAddress();
            let ix;
            if (preferNativeToken) {
                const token = poolState.token0Mint.equals(new web3_js_1.PublicKey(entities_1.WSOL.address))
                    ? poolState.token1Mint
                    : poolState.token0Mint;
                const tokenAmount = tokenAMintAddress.equals(token) ? tokenAAmount : tokenBAmount;
                const solAmount = tokenAMintAddress.equals(token) ? tokenBAmount : tokenAAmount;
                const tokenAmountMin = tokenAMintAddress.equals(token) ? tokenAAmountMin : tokenBAmountMin;
                const solAmountMin = tokenAMintAddress.equals(token) ? tokenBAmountMin : tokenAAmountMin;
                const liquidityProviderToken = yield (0, spl_token_1.getAssociatedTokenAddress)(token, liquidityProvider);
                ix = this._context.routerProgram.instruction.addLiquiditySol(tokenAmount, solAmount, tokenAmountMin, solAmountMin, {
                    accounts: {
                        router: this._routerStateAddress,
                        user: liquidityProvider,
                        routerAuthority: delegatingAddress,
                        userBalanceToken: liquidityProviderToken,
                        poolProgram: this._context.poolProgram.programId,
                        systemProgram: web3_js_1.SystemProgram.programId,
                        poolState: poolStateAddress,
                        poolAuthority,
                        poolBalanceToken0: poolState.token0Account,
                        poolBalanceToken1: poolState.token1Account,
                        poolMintLiquidity: poolState.poolMint,
                        poolBalanceLockedLiquidity: poolState.poolBalanceLockedLiquidity,
                        userBalanceLiquidity: liquidityProviderLiquidityToken,
                        factoryState: poolState.factoryAddress,
                        factoryBalanceFeeTo,
                        systemTokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    },
                });
            }
            else {
                const token0Amount = tokenAMintAddress.equals(poolState.token0Mint) ? tokenAAmount : tokenBAmount;
                const token1Amount = tokenAMintAddress.equals(poolState.token0Mint) ? tokenBAmount : tokenAAmount;
                const token0AmountMin = tokenAMintAddress.equals(poolState.token0Mint) ? tokenAAmountMin : tokenBAmountMin;
                const token1AmountMin = tokenAMintAddress.equals(poolState.token0Mint) ? tokenBAmountMin : tokenAAmountMin;
                const liquidityProviderToken0 = yield (0, spl_token_1.getAssociatedTokenAddress)(poolState.token0Mint, liquidityProvider);
                const liquidityProviderToken1 = yield (0, spl_token_1.getAssociatedTokenAddress)(poolState.token1Mint, liquidityProvider);
                ix = this._context.routerProgram.instruction.addLiquidity(token0Amount, token1Amount, token0AmountMin, token1AmountMin, {
                    accounts: {
                        user: liquidityProvider,
                        router: this._routerStateAddress,
                        poolAuthority,
                        poolState: poolStateAddress,
                        poolBalanceToken0: poolState.token0Account,
                        poolBalanceToken1: poolState.token1Account,
                        poolMintLiquidity: poolState.poolMint,
                        poolBalanceLockedLiquidity: poolState.poolBalanceLockedLiquidity,
                        userBalanceLiquidity: liquidityProviderLiquidityToken,
                        routerAuthority: delegatingAddress,
                        userBalanceToken0: liquidityProviderToken0,
                        userBalanceToken1: liquidityProviderToken1,
                        factoryState: poolState.factoryAddress,
                        factoryBalanceFeeTo,
                        poolProgram: this._context.poolProgram.programId,
                        systemTokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    },
                });
            }
            const [poolMintLiquidity] = yield web3_js_1.PublicKey.findProgramAddress([poolStateAddress.toBuffer(), Buffer.from('LyfeblocPoolLiquidityToken')], this._context.factoryProgram.programId);
            // The instructions need to be wrapped in one tx.
            let ixs;
            // Account doesn't exist when it's lamports === 0 && owner == Sys::ID
            // We need to create if it's not exist, before adding the addLiquidity tx
            if (!(yield (0, utils_1.isInitializedTokenAccount)(this._context.anchorProvider.connection, liquidityProviderLiquidityToken))) {
                ixs = [
                    (0, spl_token_1.createAssociatedTokenAccountInstruction)(liquidityProvider, liquidityProviderLiquidityToken, liquidityProvider, poolMintLiquidity),
                    ix,
                ];
            }
            else {
                ixs = [ix];
            }
            return new web3_js_1.Transaction().add(...ixs);
        });
    }
    /**
     * Construct a transaction that create a new pool then add liquidity to it.
     * @param liquidityProvider The public key of liquidity anchorProvider
     * @param tokenAMintAddress The mint address of the first token of the being created pool
     * @param tokenBMintAddress The mint address of the second token of the being created pool
     * @param amplificationFactorInBps The amplification factor of the being created pool, in basis points
     * @param feeInBps The trading fee of the being created pool, in basis points
     * @param tokenAAmount The liquidity amount of the first token
     * @param tokenBAmount The liquidity amount of the second token
     * @param tokenAAmountMin The minimum liquidity amount should be added of the first token
     * @param tokenBAmountMin The minimum liquidity amount should be added of the second token
     * @param preferNativeToken If one of the two token is WSOL, use liquidity provider's native SOL instead
     * @returns The built transaction
     * The transaction contains the following instruction(s):
     *   1. `CreatePool` instruction of the Lyfebloc Factory program
     *   2. `Create` instruction of the AssociatedToken program,
     *       to create an associated token account of liquidity pool token for the user
     *   3. `AddLiquidity` instruction of the Lyfebloc Pool program
     */
    addLiquidityNewPool(liquidityProvider, tokenAMintAddress, tokenBMintAddress, amplificationFactorInBps, feeInBps, tokenAAmount, tokenBAmount, tokenAAmountMin, tokenBAmountMin, preferNativeToken = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (preferNativeToken) {
                if (!(tokenAMintAddress.equals(entities_1.WSOL.mint) || tokenBMintAddress.equals(entities_1.WSOL.mint))) {
                    throw `the given pool does not contain Wrapped SOL token, please set preferNativeToken to false`;
                }
            }
            const routerState = yield this._context.routerProgram.account.router.fetch(this._routerStateAddress);
            const factoryState = yield this._context.factoryProgram.account.factory.fetch(routerState.factoryAddress);
            const [token0MintAddress, token1MintAddress] = (0, utils_1.sortedTokens)(tokenAMintAddress, tokenBMintAddress);
            const poolStateAddress = yield (0, utils_1.getNextPoolStateAddress)(this._context, tokenAMintAddress, tokenBMintAddress, (0, utils_1.isAmplifiedPool)(amplificationFactorInBps));
            const [poolAuthority] = yield web3_js_1.PublicKey.findProgramAddress([poolStateAddress.toBuffer()], this._context.poolProgram.programId);
            const [poolBalanceToken0] = yield web3_js_1.PublicKey.findProgramAddress([poolStateAddress.toBuffer(), Buffer.from('LyfeblocPoolBalanceToken0')], this._context.factoryProgram.programId);
            const [poolBalanceToken1] = yield web3_js_1.PublicKey.findProgramAddress([poolStateAddress.toBuffer(), Buffer.from('LyfeblocPoolBalanceToken1')], this._context.factoryProgram.programId);
            const [poolMintLiquidity] = yield web3_js_1.PublicKey.findProgramAddress([poolStateAddress.toBuffer(), Buffer.from('LyfeblocPoolLiquidityToken')], this._context.factoryProgram.programId);
            const [poolBalanceLiquidity] = yield web3_js_1.PublicKey.findProgramAddress([poolStateAddress.toBuffer(), Buffer.from('LyfeblocPoolLiquidityBalance')], this._context.factoryProgram.programId);
            const [poolBalanceLockedLiquidity] = yield web3_js_1.PublicKey.findProgramAddress([poolStateAddress.toBuffer(), Buffer.from('LyfeblocPoolLockedLiquidity')], this._context.factoryProgram.programId);
            const liquidityProviderLiquidityToken = yield (0, spl_token_1.getAssociatedTokenAddress)(poolMintLiquidity, liquidityProvider);
            const factoryBalanceFeeTo = yield (0, spl_token_1.getAssociatedTokenAddress)(poolMintLiquidity, factoryState.feeTo);
            const delegatingAddress = yield this.getDelegatingAddress();
            const createAtaIx = [];
            if (!factoryState.feeTo.equals(liquidityProvider)) {
                createAtaIx.push((0, spl_token_1.createAssociatedTokenAccountInstruction)(liquidityProvider, liquidityProviderLiquidityToken, liquidityProvider, poolMintLiquidity));
            }
            let addLiquidityIx;
            if (preferNativeToken) {
                const token = tokenAMintAddress.equals(entities_1.WSOL.mint) ? tokenBMintAddress : tokenAMintAddress;
                const tokenAmount = tokenAMintAddress.equals(token) ? tokenAAmount : tokenBAmount;
                const solAmount = tokenAMintAddress.equals(token) ? tokenBAmount : tokenAAmount;
                const tokenAmountMin = tokenAMintAddress.equals(token) ? tokenAAmountMin : tokenBAmountMin;
                const solAmountMin = tokenAMintAddress.equals(token) ? tokenBAmountMin : tokenAAmountMin;
                const liquidityProviderToken = yield (0, spl_token_1.getAssociatedTokenAddress)(token, liquidityProvider);
                addLiquidityIx = this._context.routerProgram.instruction.addLiquiditySol(tokenAmount, solAmount, tokenAmountMin, solAmountMin, {
                    accounts: {
                        router: this._routerStateAddress,
                        user: liquidityProvider,
                        routerAuthority: delegatingAddress,
                        userBalanceToken: liquidityProviderToken,
                        poolProgram: this._context.poolProgram.programId,
                        systemProgram: web3_js_1.SystemProgram.programId,
                        poolState: poolStateAddress,
                        poolAuthority,
                        poolBalanceToken0,
                        poolBalanceToken1,
                        poolMintLiquidity,
                        poolBalanceLockedLiquidity,
                        userBalanceLiquidity: liquidityProviderLiquidityToken,
                        factoryState: routerState.factoryAddress,
                        factoryBalanceFeeTo,
                        systemTokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    },
                });
            }
            else {
                const token0Amount = tokenAMintAddress.equals(token0MintAddress) ? tokenAAmount : tokenBAmount;
                const token1Amount = tokenAMintAddress.equals(token0MintAddress) ? tokenBAmount : tokenAAmount;
                const token0AmountMin = tokenAMintAddress.equals(token0MintAddress) ? tokenAAmountMin : tokenBAmountMin;
                const token1AmountMin = tokenAMintAddress.equals(token0MintAddress) ? tokenBAmountMin : tokenAAmountMin;
                const liquidityProviderToken0 = yield (0, spl_token_1.getAssociatedTokenAddress)(token0MintAddress, liquidityProvider);
                const liquidityProviderToken1 = yield (0, spl_token_1.getAssociatedTokenAddress)(token1MintAddress, liquidityProvider);
                addLiquidityIx = this._context.routerProgram.instruction.addLiquidity(token0Amount, token1Amount, token0AmountMin, token1AmountMin, {
                    accounts: {
                        user: liquidityProvider,
                        router: this._routerStateAddress,
                        poolAuthority,
                        poolState: poolStateAddress,
                        poolBalanceToken0,
                        poolBalanceToken1,
                        poolMintLiquidity,
                        poolBalanceLockedLiquidity,
                        routerAuthority: delegatingAddress,
                        userBalanceLiquidity: liquidityProviderLiquidityToken,
                        userBalanceToken0: liquidityProviderToken0,
                        userBalanceToken1: liquidityProviderToken1,
                        factoryState: routerState.factoryAddress,
                        factoryBalanceFeeTo,
                        poolProgram: this._context.poolProgram.programId,
                        systemTokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    },
                });
            }
            const ixs = [
                this._context.factoryProgram.instruction.createPool(new anchor_1.BN(amplificationFactorInBps), new anchor_1.BN(feeInBps), {
                    accounts: {
                        payer: liquidityProvider,
                        factoryState: routerState.factoryAddress,
                        tokenPair: yield (0, utils_1.getTokenPairAddress)(this._context, tokenAMintAddress, tokenBMintAddress),
                        poolState: poolStateAddress,
                        poolAuthority,
                        token0Mint: token0MintAddress,
                        token1Mint: token1MintAddress,
                        poolBalanceToken0,
                        poolBalanceToken1,
                        incinerator: constants_1.INCINERATOR,
                        poolMint: poolMintLiquidity,
                        poolBalanceLiquidity,
                        poolBalanceLockedLiquidity,
                        factoryBalanceFeeTo,
                        factoryFeeTo: factoryState.feeTo,
                        poolProgram: this._context.poolProgram.programId,
                        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                        associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
                        systemProgram: web3_js_1.SystemProgram.programId,
                        rent: web3_js_1.SYSVAR_RENT_PUBKEY,
                    },
                }),
                ...createAtaIx,
                ...[addLiquidityIx],
            ];
            return new web3_js_1.Transaction().add(...ixs);
        });
    }
    /**
     * Construct a RemoveLiquidity transaction or RemoveLiquiditySOL transaction if prepfer native token.
     * The transaction contains the following instruction(s):
     *   1. `RemoveLiquidity` or `RemoveLiquiditySOL` of the Lyfebloc Router program
     * @param poolStateAddress The account address of the Lyfebloc pool to add liquidity to
     * @param liquidityProvider The public key of liquidity anchorProvider
     * @param tokenAMintAddress The mint address of one of the two tokens of the pool
     * @param liquidity The liquidity amount to be removed
     * @param amountAMin The minimum amount that liquidity anchorProvider should get back of the first token
     * @param amountBMin The minimum amount that liquidity anchorProvider should get back of the second token
     * @param preferNativeToken If one of the two token is WSOL, use liquidity anchorProvider's native SOL instead
     * @returns The built transaction
     * The transaction contains the following instruction(s):
     *   1. `RemoveLiquidity` or `RemoveLiquiditySOL` instruction of the Lyfebloc Router program
     */
    removeLiquidity(poolStateAddress, liquidityProvider, tokenAMintAddress, liquidity, amountAMin, amountBMin, preferNativeToken = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const poolState = yield this._context.poolProgram.account.pool.fetch(poolStateAddress);
            if (!(tokenAMintAddress.equals(poolState.token0Mint) || tokenAMintAddress.equals(poolState.token1Mint))) {
                throw `the given pool does not contain token ${tokenAMintAddress.toBase58()}`;
            }
            if (preferNativeToken) {
                if (!(poolState.token0Mint.equals(entities_1.WSOL.mint) || poolState.token1Mint.equals(entities_1.WSOL.mint))) {
                    throw `the given pool does not contain Wrapped SOL token, please set preferNativeToken to false`;
                }
            }
            const [poolAuthority] = yield web3_js_1.PublicKey.findProgramAddress([poolStateAddress.toBuffer()], this._context.poolProgram.programId);
            const factoryState = yield this._context.factoryProgram.account.factory.fetch(poolState.factoryAddress);
            const factoryBalanceFeeTo = yield (0, spl_token_1.getAssociatedTokenAddress)(poolState.poolMint, factoryState.feeTo);
            const liquidityProviderLiquidityToken = yield (0, spl_token_1.getAssociatedTokenAddress)(poolState.poolMint, liquidityProvider);
            const delegatingAddress = yield this.getDelegatingAddress();
            let ix;
            if (preferNativeToken) {
                const token = poolState.token0Mint.equals(entities_1.WSOL.mint) ? poolState.token1Mint : poolState.token0Mint;
                const tokenAmountMin = tokenAMintAddress.equals(token) ? amountAMin : amountBMin;
                const solAmountMin = tokenAMintAddress.equals(token) ? amountBMin : amountAMin;
                const liquidityProviderToken = yield (0, spl_token_1.getAssociatedTokenAddress)(token, liquidityProvider);
                const [routerBalanceWsol] = yield web3_js_1.PublicKey.findProgramAddress([Buffer.from('WSOLUnwrapper')], this._context.routerProgram.programId);
                ix = this._context.routerProgram.instruction.removeLiquiditySol(liquidity, tokenAmountMin, solAmountMin, {
                    accounts: {
                        router: this._routerStateAddress,
                        user: liquidityProvider,
                        routerAuthority: delegatingAddress,
                        userBalanceLiquidity: liquidityProviderLiquidityToken,
                        routerBalanceWsol,
                        wrappedSol: entities_1.WSOL.mint,
                        poolProgram: this._context.poolProgram.programId,
                        systemProgram: web3_js_1.SystemProgram.programId,
                        rent: web3_js_1.SYSVAR_RENT_PUBKEY,
                        poolState: poolStateAddress,
                        poolAuthority,
                        poolBalanceToken0: poolState.token0Account,
                        poolBalanceToken1: poolState.token1Account,
                        poolMintLiquidity: poolState.poolMint,
                        poolBalanceLiquidity: poolState.poolBalanceLiquidity,
                        userBalanceToken: liquidityProviderToken,
                        factoryState: poolState.factoryAddress,
                        factoryBalanceFeeTo,
                        systemTokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    },
                });
            }
            else {
                const amount0Min = tokenAMintAddress.equals(poolState.token0Mint) ? amountAMin : amountBMin;
                const amount1Min = tokenAMintAddress.equals(poolState.token0Mint) ? amountBMin : amountAMin;
                const liquidityProviderToken0 = yield (0, spl_token_1.getAssociatedTokenAddress)(poolState.token0Mint, liquidityProvider);
                const liquidityProviderToken1 = yield (0, spl_token_1.getAssociatedTokenAddress)(poolState.token1Mint, liquidityProvider);
                ix = this._context.routerProgram.instruction.removeLiquidity(liquidity, amount0Min, amount1Min, {
                    accounts: {
                        user: liquidityProvider,
                        router: this._routerStateAddress,
                        routerAuthority: delegatingAddress,
                        userBalanceLiquidity: liquidityProviderLiquidityToken,
                        poolProgram: this._context.poolProgram.programId,
                        poolState: poolStateAddress,
                        poolAuthority,
                        poolBalanceToken0: poolState.token0Account,
                        poolBalanceToken1: poolState.token1Account,
                        poolMintLiquidity: poolState.poolMint,
                        poolBalanceLiquidity: poolState.poolBalanceLiquidity,
                        userBalanceToken0: liquidityProviderToken0,
                        userBalanceToken1: liquidityProviderToken1,
                        factoryState: poolState.factoryAddress,
                        factoryBalanceFeeTo,
                        systemTokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    },
                });
            }
            return new web3_js_1.Transaction().add(ix);
        });
    }
    /**
     * Produces the on-chain transaction for a given trade.
     * @param trader the address of the trader
     * @param trade to produce call parameters for
     * @param options options for the call parameters
     */
    swap(trader, trade, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const solIn = trade.inputAmount.currency.isNative;
            const solOut = trade.outputAmount.currency.isNative;
            // the router does not support both sol in and out
            (0, tiny_invariant_1.default)(!(solIn && solOut), 'SOL_IN_OUT');
            const amountIn = trade.maximumAmountIn(options.allowedSlippage).quotientBN;
            const amountOut = trade.minimumAmountOut(options.allowedSlippage).quotientBN;
            switch (trade.tradeType) {
                case ks_sdk_core_1.TradeType.EXACT_INPUT:
                    if (solIn) {
                        // SwapExactSOLForTokens
                        return yield this.swapExactSOLForTokens(trader, trade.route, amountIn, amountOut);
                    }
                    else {
                        // SwapExactTokensForSOL if solOut, otherwise SwapExactTokensForTokens
                        return yield this.swapExactTokensForTokensOrSOL(trader, trade.route, amountIn, amountOut, !solOut);
                    }
                case ks_sdk_core_1.TradeType.EXACT_OUTPUT:
                    if (solIn) {
                        // SwapSOLForExactTokens
                        return yield this.swapSOLForExactTokens(trader, trade.route, amountOut, amountIn);
                    }
                    else {
                        // SwapTokensForExactSOL if solOut, otherwise SwapTokensForExactTokens
                        return yield this.swapTokensForExactTokensOrSOL(trader, trade.route, amountOut, amountIn, !solOut);
                    }
            }
        });
    }
    swapExactTokensForTokensOrSOL(trader, route, amountIn, minAmountOut, forToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const preIxs = [
                this._context.routerProgram.instruction.prepareForSwapExactTokensForTokens(amountIn, minAmountOut, Buffer.from(route.tradeDirections), {
                    accounts: {
                        user: trader,
                        router: this._routerStateAddress,
                        routerAuthority: yield this.getDelegatingAddress(),
                        poolProgram: this._context.poolProgram.programId,
                        userBalanceTokenIn: yield (0, spl_token_1.getAssociatedTokenAddress)(route.path[0].mint, trader),
                        firstPoolBalanceTokenIn: route.pairs[0].token0.equals(route.path[0])
                            ? route.pairs[0].token0Account
                            : route.pairs[0].token1Account,
                        systemTokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    },
                    remainingAccounts: route.accountMetas,
                }),
            ];
            const swapIxs = yield this.makeSwapInstructions(trader, route, forToken);
            return new web3_js_1.Transaction().add(...preIxs, ...swapIxs);
        });
    }
    swapExactSOLForTokens(trader, route, amountIn, minAmountOut) {
        return __awaiter(this, void 0, void 0, function* () {
            const preIxs = [
                this._context.routerProgram.instruction.prepareForSwapExactSolForTokens(amountIn, minAmountOut, Buffer.from(route.tradeDirections), {
                    accounts: {
                        user: trader,
                        router: this._routerStateAddress,
                        poolProgram: this._context.poolProgram.programId,
                        firstPoolBalanceWsol: route.pairs[0].token0.equals(entities_1.WSOL)
                            ? route.pairs[0].token0Account
                            : route.pairs[0].token1Account,
                        systemTokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                        systemProgram: web3_js_1.SystemProgram.programId,
                    },
                    remainingAccounts: route.accountMetas,
                }),
            ];
            const swapIxs = yield this.makeSwapInstructions(trader, route, true);
            return new web3_js_1.Transaction().add(...preIxs, ...swapIxs);
        });
    }
    swapTokensForExactTokensOrSOL(trader, route, amountOut, maxAmountIn, forToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const preIxs = [
                this._context.routerProgram.instruction.prepareForSwapTokensForExactTokens(amountOut, maxAmountIn, Buffer.from(route.tradeDirections), {
                    accounts: {
                        user: trader,
                        router: this._routerStateAddress,
                        routerAuthority: yield this.getDelegatingAddress(),
                        poolProgram: this._context.poolProgram.programId,
                        userBalanceTokenIn: yield (0, spl_token_1.getAssociatedTokenAddress)(route.path[0].mint, trader),
                        firstPoolBalanceTokenIn: route.pairs[0].token0.equals(route.path[0])
                            ? route.pairs[0].token0Account
                            : route.pairs[0].token1Account,
                        systemTokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    },
                    remainingAccounts: route.accountMetas,
                }),
            ];
            const swapIxs = yield this.makeSwapInstructions(trader, route, forToken);
            return new web3_js_1.Transaction().add(...preIxs, ...swapIxs);
        });
    }
    swapSOLForExactTokens(trader, route, amountOut, maxAmountIn) {
        return __awaiter(this, void 0, void 0, function* () {
            const preIxs = [
                this._context.routerProgram.instruction.prepareForSwapSolForExactTokens(amountOut, maxAmountIn, Buffer.from(route.tradeDirections), {
                    accounts: {
                        user: trader,
                        router: this._routerStateAddress,
                        poolProgram: this._context.poolProgram.programId,
                        firstPoolBalanceWsol: route.pairs[0].token0.equals(entities_1.WSOL)
                            ? route.pairs[0].token0Account
                            : route.pairs[0].token1Account,
                        systemTokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                        systemProgram: web3_js_1.SystemProgram.programId,
                    },
                    remainingAccounts: route.accountMetas,
                }),
            ];
            const swapIxs = yield this.makeSwapInstructions(trader, route, true);
            return new web3_js_1.Transaction().add(...preIxs, ...swapIxs);
        });
    }
    makeSwapInstructions(trader, route, forToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tradeDirections = route.tradeDirections;
            const traderTokenAccountOut = yield (0, spl_token_1.getAssociatedTokenAddress)(route.path[route.path.length - 1].mint, trader);
            const swapIxs = [];
            for (let i = 0; i < route.pairs.length - 1; i += 1) {
                const to = route.pairs[i + 1].token0.equals(route.path[i + 1])
                    ? route.pairs[i + 1].token0Account
                    : route.pairs[i + 1].token1Account;
                swapIxs.push(this._context.poolProgram.instruction.swap2(tradeDirections[i], {
                    accounts: {
                        poolState: route.pairs[i].address,
                        poolAuthority: route.pairs[i].authority,
                        userBalanceTo: to,
                        poolBalanceToken0: route.pairs[i].token0Account,
                        poolBalanceToken1: route.pairs[i].token1Account,
                        systemTokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    },
                }));
            }
            if (forToken) {
                const tokenOutAtaInitialized = yield (0, utils_1.isInitializedTokenAccount)(this._context.anchorProvider.connection, traderTokenAccountOut);
                if (!tokenOutAtaInitialized) {
                    swapIxs.push((0, spl_token_1.createAssociatedTokenAccountInstruction)(trader, traderTokenAccountOut, trader, route.path[route.path.length - 1].mint));
                }
                swapIxs.push(this._context.poolProgram.instruction.swap2(tradeDirections[route.pairs.length - 1], {
                    accounts: {
                        poolState: route.pairs[route.pairs.length - 1].address,
                        poolAuthority: route.pairs[route.pairs.length - 1].authority,
                        userBalanceTo: traderTokenAccountOut,
                        poolBalanceToken0: route.pairs[route.pairs.length - 1].token0Account,
                        poolBalanceToken1: route.pairs[route.pairs.length - 1].token1Account,
                        systemTokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    },
                }));
            }
            else {
                swapIxs.push(this._context.routerProgram.instruction.swapToSol({
                    accounts: {
                        user: trader,
                        router: this._routerStateAddress,
                        routerAuthority: yield this.getDelegatingAddress(),
                        routerBalanceWsol: yield this.getWSOLUnwrapper(),
                        poolProgram: this._context.poolProgram.programId,
                        wrappedSol: entities_1.WSOL.mint,
                        systemProgram: web3_js_1.SystemProgram.programId,
                        rent: web3_js_1.SYSVAR_RENT_PUBKEY,
                        poolState: route.pairs[route.pairs.length - 1].address,
                        poolAuthority: route.pairs[route.pairs.length - 1].authority,
                        poolBalanceToken0: route.pairs[route.pairs.length - 1].token0Account,
                        poolBalanceToken1: route.pairs[route.pairs.length - 1].token1Account,
                        systemTokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    },
                }));
            }
            return swapIxs;
        });
    }
}
exports.Router = Router;
/** The compute budget needed for the AddLiquidityNewPool transaction to be successfully executed */
Router.ADD_LIQUIDITY_NEW_POOL_COMPUTE_BUDGET = 500000;
