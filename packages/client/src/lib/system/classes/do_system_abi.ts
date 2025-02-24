import type { SysAbi } from "$lib/system/types/sys_abi";

export class DO_SystemAbi implements SysAbi {
    c_name: string;
    s_name: string;
    data: any;
    address: string;

    constructor(partial?: Partial<SysAbi>) {
        this.c_name = partial?.c_name || "";
        this.data = partial?.data || {} as JSON;
        this.address = partial?.address || "0xf00";
        this.s_name = partial?.name || "";
    }
}
