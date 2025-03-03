import type { PageData, PageLoad } from "./$houdini";

export const load: PageLoad = async (event) => {
	try {
		const result = (await event.data) as PageData;
		console.log("Page load result:", result);
		return {
			data: result?.data || { models: { edges: [] } },
			gqlAvailable: !result?.error,
		};
	} catch (error) {
		console.log("Page load error:", error);
		return {
			data: { models: { edges: [] } },
			gqlAvailable: false,
		};
	}
};
