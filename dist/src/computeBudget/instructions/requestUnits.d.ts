import { ComputeBudgetInstruction } from "./types";
import { TransactionInstruction } from "@solana/web3.js";
export interface RequestUnitsInstructionData {
    instruction: ComputeBudgetInstruction.RequestUnits;
    units: number;
    additionalFee: number;
}
export declare const requestUnitsInstructionData: import("@solana/buffer-layout").Structure<RequestUnitsInstructionData>;
/**
 * Create an RequestUnits instruction
 * @param units Units to request
 * @param additionalFee Additional fee to add
 * @param programId ComputeBudget program account
 * @returns Instruction to add to a transaction
 */
export declare function createRequestUnitsInstruction(units: number, additionalFee: number, programId?: import("@solana/web3.js").PublicKey): TransactionInstruction;
//# sourceMappingURL=requestUnits.d.ts.map