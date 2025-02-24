/**
 * Interface for a Starknet/Dojo contract abi
 * We use these to create actual starknet Contract objects
 *
 */

import type { Contract } from "starknet";

export interface SysAbi {
    /**
     * short form name. This follows what the build sctipts
     * do, this might be foolish...
     */
    s_name: string;
    /**
     * The name of the parsed system
     */
    c_name: string;
    /**
     * The actual JSON object.
     */
    data: any;
    /**
     * The address of the contract
     */
    address: string;
}

export interface RpcAbi {
    sys_abi: SysAbi;
    dojo_contract: Contract;
}
