import artifact from '$houdini/artifacts/EntityModel'
import { SubscriptionStore } from '../runtime/stores/subscription'

export class EntityModelStore extends SubscriptionStore {
	constructor() {
		super({
			artifact,
		})
	}
}
