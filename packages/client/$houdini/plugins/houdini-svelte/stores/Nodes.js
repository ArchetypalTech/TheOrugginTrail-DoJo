import { QueryStore } from '../runtime/stores/query'
import artifact from '$houdini/artifacts/Nodes'
import { initClient } from '$houdini/plugins/houdini-svelte/runtime/client'

export class NodesStore extends QueryStore {
	constructor() {
		super({
			artifact,
			storeName: "NodesStore",
			variables: false,
		})
	}
}

export async function load_Nodes(params) {
	await initClient()

	const store = new NodesStore()

	await store.fetch(params)

	return {
		Nodes: store,
	}
}
