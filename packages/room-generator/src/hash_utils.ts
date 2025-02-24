import { pedersen } from '@starkware-industries/starkware-crypto-utils';

export function strToFelt252Array(str: string): bigint[] {
    // Convert string to array of character codes (matching Cairo's ByteArray behavior)
    return Array.from(str).map(char => BigInt(char.charCodeAt(0)));
}

export function strHash(str: string): bigint {
    const felts = strToFelt252Array(str);
    let hash = BigInt(0);
    
    // Apply Pedersen hash iteratively over the felts
    for (const felt of felts) {
        hash = pedersen([hash, felt]);
    }
    
    // Return as BigInt to preserve full precision
    return hash;
}

// Helper function to convert to string while preserving full precision
export function hashToString(hash: bigint): string {
    return hash.toString();
}

export function objHash(obj: { name: string; description: string }): bigint {
    // Hash name and description separately, then combine
    const nameHash = strHash(obj.name);
    const descHash = strHash(obj.description);
    
    return pedersen([nameHash, descHash]);
}

export function actionHash(action: { 
    name: string; 
    description: string;
    affectsAction?: string;
}): bigint {
    const baseHash = objHash({ name: action.name, description: action.description });
    if (!action.affectsAction) {
        return baseHash;
    }
    
    const affectsHash = strHash(action.affectsAction);
    return pedersen([baseHash, affectsHash]);
} 