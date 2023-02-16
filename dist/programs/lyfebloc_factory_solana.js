"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDL = void 0;
exports.IDL = {
    "version": "0.1.0",
    "name": "lyfebloc_factory_solana",
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
                    "name": "feeToSetter",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "factoryState",
                    "isMut": true,
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
                    "name": "feeTo",
                    "type": "publicKey"
                },
                {
                    "name": "feeBps",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "createPool",
            "accounts": [
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "factoryState",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenPair",
                    "isMut": true,
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
                    "name": "token0Mint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "token1Mint",
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
                    "name": "incinerator",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "poolMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolBalanceLiquidity",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "poolBalanceLockedLiquidity",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "factoryBalanceFeeTo",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "factoryFeeTo",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "poolProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "associatedTokenProgram",
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
                }
            ],
            "args": [
                {
                    "name": "amplificationFactor",
                    "type": "u64"
                },
                {
                    "name": "feeBps",
                    "type": "u16"
                }
            ]
        },
        {
            "name": "setFeeConfiguration",
            "accounts": [
                {
                    "name": "feeToSetter",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "factoryState",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "feeBps",
                    "type": "u64"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "factory",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "numPools",
                        "type": "u64"
                    },
                    {
                        "name": "feeTo",
                        "type": "publicKey"
                    },
                    {
                        "name": "feeBps",
                        "type": "u64"
                    },
                    {
                        "name": "feeToSetter",
                        "type": "publicKey"
                    },
                    {
                        "name": "numFeeOptions",
                        "type": "u16"
                    },
                    {
                        "name": "feeOptions",
                        "type": {
                            "array": [
                                "u16",
                                16
                            ]
                        }
                    }
                ]
            }
        },
        {
            "name": "tokenPair",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "numAmplifiedPools",
                        "type": "u64"
                    }
                ]
            }
        }
    ],
    "events": [
        {
            "name": "PoolCreated",
            "fields": [
                {
                    "name": "token0",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "token1",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "pool",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "ampBps",
                    "type": "u64",
                    "index": false
                },
                {
                    "name": "feeBps",
                    "type": "u16",
                    "index": false
                },
                {
                    "name": "totalPool",
                    "type": "u64",
                    "index": false
                }
            ]
        },
        {
            "name": "SetFeeConfigurationEvent",
            "fields": [
                {
                    "name": "feeTo",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "feeBps",
                    "type": "u64",
                    "index": false
                }
            ]
        },
        {
            "name": "SetFeeToSetterEvent",
            "fields": [
                {
                    "name": "feeToSetter",
                    "type": "publicKey",
                    "index": false
                }
            ]
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "InvalidOwner",
            "msg": "The account must be owned by this program"
        },
        {
            "code": 6001,
            "name": "AllPoolsSpaceExceeded",
            "msg": "The capacity of the account containing all pools is exceeded"
        },
        {
            "code": 6002,
            "name": "IdenticalAddresses",
            "msg": "Token A must be not equal to Token B"
        },
        {
            "code": 6003,
            "name": "ZeroAddress",
            "msg": "Token A and Token B must not be zero"
        },
        {
            "code": 6004,
            "name": "InvalidAmplificationFactor",
            "msg": "Amplification factor must >=10000"
        },
        {
            "code": 6005,
            "name": "InvalidTokensPairIndex",
            "msg": "Tokens pair index 0 is specified for unamplified pools, and tokens pair index >0 is specified for amplified pools."
        },
        {
            "code": 6006,
            "name": "UnamplifiedPoolExists",
            "msg": "The unamplified pool with the tokens pair already exists"
        },
        {
            "code": 6007,
            "name": "InvalidFee",
            "msg": "LyfeblocFactory: Invalid fee"
        }
    ]
};
