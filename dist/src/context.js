"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const anchor_1 = require("@project-serum/anchor");
const lyfebloc_factory_solana_1 = require("../programs/lyfebloc_factory_solana");
const lyfebloc_pool_solana_1 = require("../programs/lyfebloc_pool_solana");
const lyfebloc_router_solana_1 = require("../programs/lyfebloc_router_solana");
/**
 * Contains Lyfebloc program structs to create instructions and fetch accounts from the network.
 */
class Context {
    /**
     * Create a Context from anchorProvider and program addresses.
     * @param anchorProvider The anchorProvider
     * @param factoryAddress The address of LyfeblocFactory program.
     * @param poolAddress The address of LyfeblocPool program.
     * @param routerAddress The address of LyfeblocRouter program.
     */
    constructor(anchorProvider, factoryAddress, poolAddress, routerAddress) {
        this.anchorProvider = anchorProvider;
        this.factoryProgram = new anchor_1.Program(lyfebloc_factory_solana_1.IDL, factoryAddress, anchorProvider);
        this.poolProgram = new anchor_1.Program(lyfebloc_pool_solana_1.IDL, poolAddress, anchorProvider);
        this.routerProgram = new anchor_1.Program(lyfebloc_router_solana_1.IDL, routerAddress, anchorProvider);
    }
}
exports.Context = Context;
