export declare type LyfeblocPoolSolana = {
    "version": "0.1.0";
    "name": "lyfebloc_pool_solana";
    "instructions": [
        {
            "name": "initialize";
            "accounts": [
                {
                    "name": "poolState";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "token0";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "token1";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "poolBalanceLiquidity";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolBalanceLockedLiquidity";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolMint";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "factoryAddress";
                    "type": "publicKey";
                },
                {
                    "name": "curveInput";
                    "type": {
                        "defined": "CurveInput";
                    };
                },
                {
                    "name": "tokenPairNonce";
                    "type": "u64";
                },
                {
                    "name": "feeBps";
                    "type": "u16";
                }
            ];
        },
        {
            "name": "mint";
            "accounts": [
                {
                    "name": "poolState";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolAuthority";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "poolBalanceToken0";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolBalanceToken1";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolMintLiquidity";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolBalanceLockedLiquidity";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "userBalanceDestination";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "factoryState";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "factoryBalanceFeeTo";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemTokenProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [];
        },
        {
            "name": "burn";
            "accounts": [
                {
                    "name": "poolState";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolAuthority";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "poolBalanceToken0";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolBalanceToken1";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolMintLiquidity";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolBalanceLiquidity";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "userBalanceToken0";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "userBalanceToken1";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "factoryState";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "factoryBalanceFeeTo";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemTokenProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [];
        },
        {
            "name": "swap";
            "accounts": [
                {
                    "name": "poolState";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolAuthority";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "userBalanceTo";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolBalanceToken0";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolBalanceToken1";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemTokenProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amount0Out";
                    "type": "u128";
                },
                {
                    "name": "amount1Out";
                    "type": "u128";
                }
            ];
        },
        {
            "name": "swap2";
            "accounts": [
                {
                    "name": "poolState";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolAuthority";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "userBalanceTo";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolBalanceToken0";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolBalanceToken1";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemTokenProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "tradeDirection";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "calculateAmountOut";
            "accounts": [
                {
                    "name": "poolState";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u128";
                },
                {
                    "name": "tradeDirection";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "setCalculatedAmountOut";
            "accounts": [
                {
                    "name": "poolState";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountOut";
                    "type": "u128";
                }
            ];
        },
        {
            "name": "calculateAmountIn";
            "accounts": [
                {
                    "name": "poolState";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountOut";
                    "type": "u128";
                },
                {
                    "name": "tradeDirection";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "skim";
            "accounts": [
                {
                    "name": "poolState";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "poolAuthority";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "poolBalanceToken0";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolBalanceToken1";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "userBalanceToken0";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "userBalanceToken1";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemTokenProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [];
        },
        {
            "name": "sync";
            "accounts": [
                {
                    "name": "poolState";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "poolAuthority";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "poolBalanceToken0";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolBalanceToken1";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolMintLiquidity";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "factoryState";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "factoryBalanceFeeTo";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemTokenProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [];
        }
    ];
    "accounts": [
        {
            "name": "factory";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "numPools";
                        "type": "u64";
                    },
                    {
                        "name": "feeTo";
                        "type": "publicKey";
                    },
                    {
                        "name": "feeBps";
                        "type": "u64";
                    },
                    {
                        "name": "feeToSetter";
                        "type": "publicKey";
                    },
                    {
                        "name": "numFeeOptions";
                        "type": "u16";
                    },
                    {
                        "name": "feeOptions";
                        "type": {
                            "array": [
                                "u16",
                                16
                            ];
                        };
                    }
                ];
            };
        },
        {
            "name": "pool";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "tokenPairNonce";
                        "type": "u64";
                    },
                    {
                        "name": "factoryAddress";
                        "type": "publicKey";
                    },
                    {
                        "name": "bumpSeed";
                        "type": "u8";
                    },
                    {
                        "name": "tokenProgramId";
                        "type": "publicKey";
                    },
                    {
                        "name": "curve";
                        "type": {
                            "defined": "CurveInput";
                        };
                    },
                    {
                        "name": "token0Mint";
                        "type": "publicKey";
                    },
                    {
                        "name": "token1Mint";
                        "type": "publicKey";
                    },
                    {
                        "name": "token0Account";
                        "type": "publicKey";
                    },
                    {
                        "name": "token1Account";
                        "type": "publicKey";
                    },
                    {
                        "name": "poolMint";
                        "type": "publicKey";
                    },
                    {
                        "name": "poolBalanceLiquidity";
                        "type": "publicKey";
                    },
                    {
                        "name": "poolBalanceLockedLiquidity";
                        "type": "publicKey";
                    },
                    {
                        "name": "balance";
                        "type": {
                            "defined": "Balance";
                        };
                    },
                    {
                        "name": "virtualBalance";
                        "type": {
                            "defined": "VirtualBalance";
                        };
                    },
                    {
                        "name": "kLast";
                        "type": {
                            "array": [
                                "u64",
                                4
                            ];
                        };
                    },
                    {
                        "name": "feeInPrecision";
                        "type": "u128";
                    },
                    {
                        "name": "returnValue";
                        "type": {
                            "defined": "ReturnValue";
                        };
                    }
                ];
            };
        }
    ];
    "types": [
        {
            "name": "CurveInput";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "curveType";
                        "type": "u8";
                    },
                    {
                        "name": "curveParameters";
                        "type": "u64";
                    }
                ];
            };
        },
        {
            "name": "MintLiquidityReturnValue";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "liquidity";
                        "type": "u128";
                    }
                ];
            };
        },
        {
            "name": "BurnLiquidityReturnValue";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "amount0";
                        "type": "u128";
                    },
                    {
                        "name": "amount1";
                        "type": "u128";
                    }
                ];
            };
        },
        {
            "name": "CalculateAmountOutReturnValue";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "amountOut";
                        "type": "u128";
                    }
                ];
            };
        },
        {
            "name": "CalculateAmountInReturnValue";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "amountIn";
                        "type": "u128";
                    }
                ];
            };
        },
        {
            "name": "ReturnValue";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "kind";
                        "type": "u8";
                    },
                    {
                        "name": "value";
                        "type": {
                            "array": [
                                "u8",
                                32
                            ];
                        };
                    }
                ];
            };
        },
        {
            "name": "VirtualBalance";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "vReserve0";
                        "type": "u128";
                    },
                    {
                        "name": "vReserve1";
                        "type": "u128";
                    }
                ];
            };
        },
        {
            "name": "Balance";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "reserve0";
                        "type": "u128";
                    },
                    {
                        "name": "reserve1";
                        "type": "u128";
                    }
                ];
            };
        },
        {
            "name": "CurveType";
            "type": {
                "kind": "enum";
                "variants": [
                    {
                        "name": "Dmm";
                    }
                ];
            };
        },
        {
            "name": "TradeDirection";
            "type": {
                "kind": "enum";
                "variants": [
                    {
                        "name": "ZeroToOne";
                    },
                    {
                        "name": "OneToZero";
                    }
                ];
            };
        },
        {
            "name": "ReturnValueEnum";
            "type": {
                "kind": "enum";
                "variants": [
                    {
                        "name": "Uninitialized";
                    },
                    {
                        "name": "MintLiquidity";
                        "fields": [
                            {
                                "defined": "MintLiquidityReturnValue";
                            }
                        ];
                    },
                    {
                        "name": "BurnLiquidity";
                        "fields": [
                            {
                                "defined": "BurnLiquidityReturnValue";
                            }
                        ];
                    },
                    {
                        "name": "CalculateAmountOut";
                        "fields": [
                            {
                                "defined": "CalculateAmountOutReturnValue";
                            }
                        ];
                    },
                    {
                        "name": "CalculateAmountIn";
                        "fields": [
                            {
                                "defined": "CalculateAmountInReturnValue";
                            }
                        ];
                    }
                ];
            };
        }
    ];
    "errors": [
        {
            "code": 6000;
            "name": "AlreadyInUse";
            "msg": "Swap account already in use";
        },
        {
            "code": 6001;
            "name": "InvalidProgramAddress";
            "msg": "Invalid program address generated from bump seed and key";
        },
        {
            "code": 6002;
            "name": "InvalidOwner";
            "msg": "Input account owner is not the program address";
        },
        {
            "code": 6003;
            "name": "InvalidOutputOwner";
            "msg": "Output pool account owner cannot be the program address";
        },
        {
            "code": 6004;
            "name": "ExpectedMint";
            "msg": "Deserialized account is not an SPL Token mint";
        },
        {
            "code": 6005;
            "name": "ExpectedAccount";
            "msg": "Deserialized account is not an SPL Token account";
        },
        {
            "code": 6006;
            "name": "EmptySupply";
            "msg": "Input token account empty";
        },
        {
            "code": 6007;
            "name": "InvalidSupply";
            "msg": "Pool token mint has a non-zero supply";
        },
        {
            "code": 6008;
            "name": "InvalidDelegate";
            "msg": "Token account has a delegate";
        },
        {
            "code": 6009;
            "name": "InvalidInput";
            "msg": "InvalidInput";
        },
        {
            "code": 6010;
            "name": "IncorrectSwapAccount";
            "msg": "Address of the provided swap token account is incorrect";
        },
        {
            "code": 6011;
            "name": "IncorrectPoolMint";
            "msg": "Address of the provided pool token mint is incorrect";
        },
        {
            "code": 6012;
            "name": "InvalidOutput";
            "msg": "InvalidOutput";
        },
        {
            "code": 6013;
            "name": "CalculationFailure";
            "msg": "General calculation failure due to overflow or underflow";
        },
        {
            "code": 6014;
            "name": "InvalidInstruction";
            "msg": "Invalid instruction";
        },
        {
            "code": 6015;
            "name": "RepeatedMint";
            "msg": "Swap input token accounts have the same mint";
        },
        {
            "code": 6016;
            "name": "ExceededSlippage";
            "msg": "Swap instruction exceeds desired slippage limit";
        },
        {
            "code": 6017;
            "name": "InvalidCloseAuthority";
            "msg": "Token account has a close authority";
        },
        {
            "code": 6018;
            "name": "InvalidFreezeAuthority";
            "msg": "Pool token mint has a freeze authority";
        },
        {
            "code": 6019;
            "name": "IncorrectFeeAccount";
            "msg": "Pool fee token account incorrect";
        },
        {
            "code": 6020;
            "name": "ZeroTradingTokens";
            "msg": "Given pool token amount results in zero trading tokens";
        },
        {
            "code": 6021;
            "name": "FeeCalculationFailure";
            "msg": "Fee calculation failed due to overflow, underflow, or unexpected 0";
        },
        {
            "code": 6022;
            "name": "ConversionFailure";
            "msg": "Conversion to u64 failed with an overflow or underflow";
        },
        {
            "code": 6023;
            "name": "InvalidFee";
            "msg": "The provided fee does not match the program owner's constraints";
        },
        {
            "code": 6024;
            "name": "IncorrectTokenProgramId";
            "msg": "The provided token program does not match the token program expected by the swap";
        },
        {
            "code": 6025;
            "name": "UnsupportedCurveType";
            "msg": "The provided curve type is not supported by the program owner";
        },
        {
            "code": 6026;
            "name": "InvalidCurve";
            "msg": "The provided curve parameters are invalid";
        },
        {
            "code": 6027;
            "name": "UnsupportedCurveOperation";
            "msg": "The operation cannot be performed on the given curve";
        },
        {
            "code": 6028;
            "name": "InvalidMint";
            "msg": "Invalid mint in pool balance liquidity account";
        },
        {
            "code": 6029;
            "name": "InvalidAuthority";
            "msg": "Invalid authority in token account";
        },
        {
            "code": 6030;
            "name": "AdditionOverflow";
            "msg": "SafeMath: addition overflow";
        },
        {
            "code": 6031;
            "name": "SubtractionOverflow";
            "msg": "SafeMath: subtraction overflow";
        },
        {
            "code": 6032;
            "name": "MultiplicationOverflow";
            "msg": "SafeMath: multiplication overflow";
        },
        {
            "code": 6033;
            "name": "DivisionOverflow";
            "msg": "SafeMath: division overflow";
        },
        {
            "code": 6034;
            "name": "InsufficientOutputAmount";
            "msg": "Lyfebloc: INSUFFICIENT_OUTPUT_AMOUNT";
        },
        {
            "code": 6035;
            "name": "InsufficientLiquidity";
            "msg": "Lyfebloc: INSUFFICIENT_LIQUIDITY";
        },
        {
            "code": 6036;
            "name": "InvalidTo";
            "msg": "Lyfebloc: INVALID_TO";
        },
        {
            "code": 6037;
            "name": "InsufficientInputAmount";
            "msg": "Lyfebloc: INSUFFICIENT_INPUT_AMOUNT";
        },
        {
            "code": 6038;
            "name": "K";
            "msg": "Lyfebloc: K";
        },
        {
            "code": 6039;
            "name": "Overflow";
            "msg": "Lyfebloc: OVERFLOW";
        },
        {
            "code": 6040;
            "name": "UnsyncReserves";
            "msg": "Lyfebloc: UNSYNC_RESERVES";
        },
        {
            "code": 6041;
            "name": "InsufficientLiquidityMinted";
            "msg": "Lyfebloc: INSUFFICIENT_LIQUIDITY_MINTED";
        },
        {
            "code": 6042;
            "name": "InsufficientLiquidityBurned";
            "msg": "Lyfebloc: INSUFFICIENT_LIQUIDITY_BURNED";
        },
        {
            "code": 6043;
            "name": "InvalidTradeDirection";
            "msg": "Lyfebloc: Invalid trade direction";
        },
        {
            "code": 6044;
            "name": "InvalidFeeConfiguration";
            "msg": "Lyfebloc: Invalid government fee configuration";
        },
        {
            "code": 6045;
            "name": "Forbidden";
            "msg": "Lyfebloc: Forbidden";
        },
        {
            "code": 6046;
            "name": "IdenticalAddresses";
            "msg": "Token A must be not equal to Token B";
        },
        {
            "code": 6047;
            "name": "ZeroAddress";
            "msg": "Token A and Token B must not be zero";
        }
    ];
};
export declare const IDL: LyfeblocPoolSolana;
//# sourceMappingURL=lyfebloc_pool_solana.d.ts.map
