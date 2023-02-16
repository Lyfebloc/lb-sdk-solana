"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDL = void 0;
exports.IDL = {
    "version": "0.1.0",
    "name": "lyfebloc_router_solana",
    "instructions": [
        {
            "name": "initialize",
            "accounts": [
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "router",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "routerAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "factoryState",
                    "type": "publicKey"
                }
            ]
        },
        {
            "name": "addLiquidity",
            "accounts": [
                {
                    "name": "user",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "router",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "poolAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "poolState",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolBalanceToken0",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolBalanceToken1",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolMintLiquidity",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolBalanceLockedLiquidity",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userBalanceLiquidity",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "routerAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "userBalanceToken0",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userBalanceToken1",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "factoryState",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "factoryBalanceFeeTo",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemTokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount0Desired",
                    "type": "u128"
                },
                {
                    "name": "amount1Desired",
                    "type": "u128"
                },
                {
                    "name": "amount0Min",
                    "type": "u128"
                },
                {
                    "name": "amount1Min",
                    "type": "u128"
                }
            ]
        },
        {
            "name": "addLiquiditySol",
            "accounts": [
                {
                    "name": "router",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "routerAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "userBalanceToken",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "poolState",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "poolBalanceToken0",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolBalanceToken1",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolMintLiquidity",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolBalanceLockedLiquidity",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userBalanceLiquidity",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "factoryState",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "factoryBalanceFeeTo",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemTokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amountTokenDesired",
                    "type": "u128"
                },
                {
                    "name": "amountSolDesired",
                    "type": "u128"
                },
                {
                    "name": "amountTokenMin",
                    "type": "u128"
                },
                {
                    "name": "amountSolMin",
                    "type": "u128"
                }
            ]
        },
        {
            "name": "prepareForSwapExactTokensForTokens",
            "accounts": [
                {
                    "name": "user",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "router",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "routerAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "poolProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "userBalanceTokenIn",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "firstPoolBalanceTokenIn",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemTokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amountIn",
                    "type": "u128"
                },
                {
                    "name": "amountOutMin",
                    "type": "u128"
                },
                {
                    "name": "tradeDirections",
                    "type": "bytes"
                }
            ]
        },
        {
            "name": "prepareForSwapExactSolForTokens",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "router",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "poolProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "firstPoolBalanceWsol",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemTokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amountIn",
                    "type": "u128"
                },
                {
                    "name": "amountOutMin",
                    "type": "u128"
                },
                {
                    "name": "tradeDirections",
                    "type": "bytes"
                }
            ]
        },
        {
            "name": "prepareForSwapSolForExactTokens",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "router",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "poolProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "firstPoolBalanceWsol",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemTokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amountOut",
                    "type": "u128"
                },
                {
                    "name": "amountInMax",
                    "type": "u128"
                },
                {
                    "name": "tradeDirections",
                    "type": "bytes"
                }
            ]
        },
        {
            "name": "prepareForSwapTokensForExactTokens",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "router",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "routerAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "poolProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "userBalanceTokenIn",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "firstPoolBalanceTokenIn",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemTokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amountOut",
                    "type": "u128"
                },
                {
                    "name": "amountInMax",
                    "type": "u128"
                },
                {
                    "name": "tradeDirections",
                    "type": "bytes"
                }
            ]
        },
        {
            "name": "swapToSol",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "router",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "routerAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "routerBalanceWsol",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "wrappedSol",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "poolState",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "poolBalanceToken0",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolBalanceToken1",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemTokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "removeLiquidity",
            "accounts": [
                {
                    "name": "user",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "router",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "routerAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "userBalanceLiquidity",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "poolState",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "poolBalanceToken0",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolBalanceToken1",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolMintLiquidity",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolBalanceLiquidity",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userBalanceToken0",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userBalanceToken1",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "factoryState",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "factoryBalanceFeeTo",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemTokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "liquidity",
                    "type": "u128"
                },
                {
                    "name": "amount0Min",
                    "type": "u128"
                },
                {
                    "name": "amount1Min",
                    "type": "u128"
                }
            ]
        },
        {
            "name": "removeLiquiditySol",
            "accounts": [
                {
                    "name": "router",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "routerAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userBalanceLiquidity",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "routerBalanceWsol",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "wrappedSol",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "poolProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "poolState",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "poolBalanceToken0",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolBalanceToken1",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolMintLiquidity",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolBalanceLiquidity",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userBalanceToken",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "factoryState",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "factoryBalanceFeeTo",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemTokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "liquidity",
                    "type": "u128"
                },
                {
                    "name": "amountTokenMin",
                    "type": "u128"
                },
                {
                    "name": "amountSolMin",
                    "type": "u128"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "router",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "factoryAddress",
                        "type": "publicKey"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "InvalidProgramAddress",
            "msg": "The program address is invalid "
        },
        {
            "code": 6001,
            "name": "InvalidAuthority",
            "msg": "The authority must be correctly generated"
        },
        {
            "code": 6002,
            "name": "InvalidOwner",
            "msg": "The account must be owned by this program"
        },
        {
            "code": 6003,
            "name": "AllPoolsSpaceExceeded",
            "msg": "The capacity of the account containing all pools is exceeded"
        },
        {
            "code": 6004,
            "name": "IdenticalAddresses",
            "msg": "Token A must be not equal to Token B"
        },
        {
            "code": 6005,
            "name": "ZeroAddress",
            "msg": "Token A and Token B must not be zero"
        },
        {
            "code": 6006,
            "name": "InvalidAmplificationFactor",
            "msg": "Amplification factor must >=10000"
        },
        {
            "code": 6007,
            "name": "InvalidTokensPairIndex",
            "msg": "Tokens pair index 0 is specified for unamplified pools, and tokens pair index >0 is specified for amplified pools."
        },
        {
            "code": 6008,
            "name": "UnamplifiedPoolExists",
            "msg": "The unamplified pool with the tokens pair already exists"
        },
        {
            "code": 6009,
            "name": "InsufficientAAmount",
            "msg": "LyfeblocRouter: INSUFFICIENT_A_AMOUNT"
        },
        {
            "code": 6010,
            "name": "InsufficientBAmount",
            "msg": "LyfeblocRouter: INSUFFICIENT_B_AMOUNT"
        },
        {
            "code": 6011,
            "name": "InvalidAmountA",
            "msg": "LyfeblocRouter: Amount A should not be less than desired in case amount_B_optimal > amount_B_desired"
        },
        {
            "code": 6012,
            "name": "InvalidSourceTokenMint",
            "msg": "LyfeblocRouter: Source token's mint does not match"
        },
        {
            "code": 6013,
            "name": "InvalidTradeDirection",
            "msg": "LyfeblocRouter: Invalid trade direction"
        },
        {
            "code": 6014,
            "name": "InvalidPoolLength",
            "msg": "LyfeblocRouter: Invalid pool length"
        },
        {
            "code": 6015,
            "name": "InvalidPoolAccount",
            "msg": "LyfeblocRouter: Invalid pool account"
        },
        {
            "code": 6016,
            "name": "InvalidPath",
            "msg": "LyfeblocRouter: Invalid path"
        },
        {
            "code": 6017,
            "name": "InsufficientOutputAmount",
            "msg": "LyfeblocRouter: insufficient output amount"
        },
        {
            "code": 6018,
            "name": "ExcessiveInputAmount",
            "msg": "LyfeblocRouter: excessive input amount"
        },
        {
            "code": 6019,
            "name": "InvalidReturnValue",
            "msg": "LyfeblocRouter: invalid return value"
        },
        {
            "code": 6020,
            "name": "InvalidMint",
            "msg": "LyfeblocRouter: Invalid mint"
        }
    ]
};
