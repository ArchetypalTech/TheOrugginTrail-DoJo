// @ts-nocheck
import type { PageLoad, PageData } from './$houdini';

export const load = async (event: Parameters<PageLoad>[0]) => {
    try {
        const result = await event.data as PageData;
        console.log("Page load result:", result);
        return {
            data: result?.data || { models: { edges: [] } },
            gqlAvailable: !result?.error
        };
    } catch (error) {
        console.log("Page load error:", error);
        return {
            data: { models: { edges: [] } },
            gqlAvailable: false
        };
    }
}; 