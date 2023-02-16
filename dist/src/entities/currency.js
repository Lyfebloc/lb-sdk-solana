"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSOL = exports.SOL = void 0;
const ks_sdk_core_1 = require("@lyfebloc/lb-sdk-core");
exports.SOL = new ks_sdk_core_1.NativeCurrency(ks_sdk_core_1.ChainId.SOLANA, 9, 'SOL', 'SOL');
exports.WSOL = exports.SOL.wrapped;
