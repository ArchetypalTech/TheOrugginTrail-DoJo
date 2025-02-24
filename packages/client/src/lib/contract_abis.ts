import { json, Contract, RpcProvider, num } from 'starknet'
import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';
import { setFilePath } from '../lib';
import { DO_SystemAbi, type SysAbi } from '$lib/system';
import { type RpcAbi } from '$lib/system';
import { readFile } from 'fs/promises';


///// CONTRACT ABI PROC /////

/**
 * Finds and then returns a set of strings representing files
 * under a directory that match the passed in regex
 *
 * This function kinda of hangs of the output of the build
 * script `scripts/cp_abis.sh
 *
 * @param {string} doc - The root path for the search.
 * @param {RegExp} pattern - The regex.
 * @returns {string[]} The found file path strings.
 *
 */
async function locateFiles(dir: string, pattern: RegExp): Promise<string[]> {
    // console.log("fp", dir)
    return fs.readdirSync(dir)
        .filter((file) => {
            return fs.statSync(path.join(dir, file)).isFile() && pattern.test(file);
        })
        .map((file) => path.join(dir, file)); // Return full path
}

/**
 * Generates a set of SystemAbi's
 * 
 * These are intended to be consumed and end up as Providers
 *  
 * @param {string}f_paths
 * @returns {SysAbi[]} 
 */
async function parseAbis(f_paths: string[]): Promise<SysAbi[]> {
    return f_paths.map(p => {
        // Use path.parse to extract the file name without extension
        const name = path.parse(p).name;
        const c_name = name;

        // Read and parse the JSON file
        const manifest = setFilePath(p);
        // console.log("parse", manifest());
        const fileContent = json.parse(
            fs.readFileSync(manifest()).toString('ascii')
        );
        // Create and return a new SystemAbi object
        return new DO_SystemAbi({ c_name: name, data: fileContent });
    });

}

///// MANIFEST PROC /////
// intermediate store objects for parsing the manifest to
// addresses
interface ContractAddress {
    address: string;
    name: string;
    s_name: string;
}

// intermediate store objects for parsing the manifest to
// addresses
interface ContractList {
    contracts: ContractAddress[];
}

/**
 * Reads in a `manifest.json` as produced from the sozo tool
 * in theory also understands the format enough to produce a
 * Contract{} interface but not a guarantee. Does however give
 * back a JSON object from the manifest
 * 
 * @param m_path: string, the path to the `manifest.json` produced by sozo 
 * @returns Promise<ContractList>
 */
async function readAddressPath(m_path: string): Promise<ContractList> {
    const manifest_path = setFilePath(m_path);
    try {
        const _raw = await readFile(manifest_path(), 'utf8');
        return JSON.parse(_raw) as ContractList;
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`Invalid JSON in file ${m_path}: ${error.message}`);
        }
        console.error("E:", error);
        throw error;
    }
}

/**
 * Given a valid manifest and valid path to said manifest will read the file
 * and return a list of `ContractAddress`'s that can then be used to populate
 * the higher `SysAbi` interface 
 * 
 * @param m_path: string, the path to a `manifest.json` as produced by sozo 
 * @returns  Promise<ContractAddress>
 */
async function getAddresses(m_path: string): Promise<ContractAddress[]> {
    const resolved_dir = setFilePath(m_path)();
    // const resolved_manifest_path = path.join(resolved_dir, 'manifest.json');
    const c_list: ContractList = await readAddressPath(resolved_dir);
    try {
        const c: ContractAddress[] = c_list.contracts.map(ct => (
            {
                address: ct.address,
                name: ct.name,
            }
        ));
        return c;
    } catch (error) {
        console.error('Error reading or parsing file:', error);
    }
}

function setShortName(c_address: ContractAddress[], type_desc: string): ContractAddress[] {
    // console.log('===========');
    let ca = c_address.map( ct =>  {
        const splits = ct.name.split("::");
        const idx = splits.indexOf(type_desc);
        const sname = `${splits[idx]}_${splits[splits.length - 1]}`; 
        const ca: ContractAddress = {address: ct.address, name: ct.name, s_name: sname};
        return ca;
    } );
    // console.log(ca);
    // console.log('<<<<<<<<<<<');
    return ca;
}

///// API /////

 /**
  * Processes manifest and contact ABI's to a set of objects 
  * we can use to setup RPC calls.
  * The source files should be copied over by the build scripts or
  * manually to $ROOT/src/manifest
  * 
  * @param f_paths string; the path to the manifest files both ABI and manifest 
  * @param provider 
  * @param address 
  * @returns `Promise<SysAbi[]>` 
  */
async function getSysContractObjects(dir_path: string, provider: RpcProvider): Promise<RpcAbi[]> {
    // get the file list
    const rgx =  /^systems_.*\.json$/;

    const _man_d = setFilePath(dir_path);
    const f_paths = await locateFiles(_man_d(), rgx);

    // read the abi files into intermediate objects (no address)
    const abi_intermediates: DO_SystemAbi[] = await parseAbis(f_paths); 
    
    // read the manifest file and get addresses
    const m_path = path.join(dir_path, 'manifest.json')
    const addresses = await getAddresses(m_path);

    const abi_objs = await setShortName(addresses, 'systems');

    return abi_intermediates.map( (i_abi: DO_SystemAbi, idx: number) => {
        //grab a matching intermediate object
        const i_index = abi_objs.findIndex(obj => obj.s_name === i_abi.c_name);
        const i_obj = abi_objs[i_index];
        const abi_data = i_abi.data;
        const address = i_obj.address;
        i_abi.address = address;
        i_abi.c_name = i_obj.name;
        i_abi.s_name = i_obj.s_name;
        const stk_contract: Contract = new Contract(abi_data.abi, address, provider);
        return {sys_abi: i_abi, dojo_contract: stk_contract};
    } );
}

// Conditional export for testing purposes
if (process.env.NODE_ENV === 'test') {
    module.exports = {  getSysContractObjects, locateFiles, parseAbis, getAddresses, setShortName } ;
} else {
    module.exports = { getSysContractObjects };
}
