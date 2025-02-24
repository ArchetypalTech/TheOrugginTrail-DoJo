import { describe, it, expect } from 'vitest';
import * as path from 'path';

import { locateFiles, parseAbis, getAddresses, setShortName, getSysContractObjects } from '$lib/contract_abis'
import { RpcProvider, type Contract } from 'starknet';
import { DO_SystemAbi, setFilePath } from '$lib';


describe('Create a set of Contract Objects from src files', () => {
  it('we create an array of Contract objects', () => {
    const KATANA_ENDPOINT = 'http://localhost:5050';
    const katanaProvider: RpcProvider = new RpcProvider({ nodeUrl: KATANA_ENDPOINT });
    const dp = '../tests/assets/';
    const regex = /^systems_.*\.json$/;
    return getSysContractObjects(dp, katanaProvider).then(result => {
      expect(result).toHaveLength(4);
    });
  });
});

describe("Find and process JSON Abi's and manifest files", () => {
  it("we can find the src abi files", () => {
    const fp = path.resolve(__dirname, '../manifest');
    const regex = /^systems_.*\.json$/;
    return locateFiles(fp, regex).then(result => {
      expect(result).toHaveLength(4);
    });
  });

  it("we can create a filename of form system_foo", () => {
    const fp = path.resolve(__dirname, '../manifest');
    const regex = /^systems_.*\.json$/;
    const expected = 'systems_outputter.json';
    return locateFiles(fp, regex).then(result => {
      expect(result.some(r => r.includes(expected))).toBe(true)
    });
  });

  it("we return some SystemAbi objects", () => {
    const f_paths = ['../tests/assets/systems_actions.json', '../tests/assets/systems_outputter.json'];
    return parseAbis(f_paths).then(result => {
      expect(result).toBeTruthy();
      expect(Array.isArray(result)).toBe(true);
      expect(result[1].c_name).toEqual("systems_outputter");
      expect(result.length).toEqual(2);
    });
  });

  it("we return valid intermediate address objects", () => {
    const f_paths = ['../tests/assets/manifest.json'];
    return getAddresses(f_paths[0]).then(result => {
      expect(result.length).toBeGreaterThan(0);
      const expected: ContractAddress = {
        address: "0x48a75af79de26bd265c05d82043ba29b30cbf5e15963bd9ebfc641b1cecc824",
        name: "the_oruggin_trail::systems::meatpuppet::meatpuppet"
      };
      expect(result).toContainEqual(expected);
    });
  });
  
  it("we correctly process namespaces to short names", async () => {
    const f_paths = ['../tests/assets/manifest.json'];
    return getAddresses(f_paths[0]).then( result => {
        const actual = setShortName(result, "systems");
        const expected: ContractAddress =  {
          address: '0x48a75af79de26bd265c05d82043ba29b30cbf5e15963bd9ebfc641b1cecc824',
          name: 'the_oruggin_trail::systems::meatpuppet::meatpuppet',
          s_name: 'systems_meatpuppet'
        };
        expect(actual).toContainEqual(expected);
    });
  });
});
