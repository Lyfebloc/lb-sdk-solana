import { Program, AnchorProvider } from "@project-serum/anchor";
import { LyfeblocFactorySolana } from "../programs/lyfebloc_factory_solana";
import { LyfeblocPoolSolana } from "../programs/lyfebloc_pool_solana";
import { LyfeblocRouterSolana } from "../programs/lyfebloc_router_solana";
/**
 * Contains Lyfebloc program structs to create instructions and fetch accounts from the network.
 */
export declare class Context {
    readonly anchorProvider: AnchorProvider;
    readonly factoryProgram: Program<LyfeblocFactorySolana>;
    readonly poolProgram: Program<LyfeblocPoolSolana>;
    readonly routerProgram: Program<LyfeblocRouterSolana>;
    /**
     * Create a Context from anchorProvider and program addresses.
     * @param anchorProvider The anchorProvider
     * @param factoryAddress The address of LyfeblocFactory program.
     * @param poolAddress The address of LyfeblocPool program.
     * @param routerAddress The address of LyfeblocRouter program.
     */
    constructor(anchorProvider: AnchorProvider, factoryAddress: string, poolAddress: string, routerAddress: string);
}
//# sourceMappingURL=context.d.ts.map
