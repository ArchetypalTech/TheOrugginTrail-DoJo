import artifact from '$houdini/artifacts/Event'
import { SubscriptionStore } from '../runtime/stores/subscription'

export class EventStore extends SubscriptionStore {
	constructor() {
		super({
			artifact,
		})
	}
}
