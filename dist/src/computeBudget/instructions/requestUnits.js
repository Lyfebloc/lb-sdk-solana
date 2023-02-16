"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequestUnitsInstruction = exports.requestUnitsInstructionData = void 0;
const buffer_layout_1 = require("@solana/buffer-layout");
const types_1 = require("./types");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("./constants");
exports.requestUnitsInstructionData = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('instruction'),
    (0, buffer_layout_1.u32)('units'),
    (0, buffer_layout_1.u32)('additionalFee'),
]);
/**
 * Create an RequestUnits instruction
 * @param units Units to request
 * @param additionalFee Additional fee to add
 * @param programId ComputeBudget program account
 * @returns Instruction to add to a transaction
 */
function createRequestUnitsInstruction(units, additionalFee, programId = constants_1.COMPUTE_BUDGET_PROGRAM_ID) {
    const data = Buffer.alloc(exports.requestUnitsInstructionData.span);
    exports.requestUnitsInstructionData.encode({
        instruction: types_1.ComputeBudgetInstruction.RequestUnits,
        units,
        additionalFee,
    }, data);
    return new web3_js_1.TransactionInstruction({ keys: [], programId, data });
}
exports.createRequestUnitsInstruction = createRequestUnitsInstruction;
