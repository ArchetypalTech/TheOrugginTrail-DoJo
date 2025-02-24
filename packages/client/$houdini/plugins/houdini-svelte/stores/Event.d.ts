import type { Event$input, Event$result, SubscriptionStore } from '$houdini'

export declare class EventStore extends SubscriptionStore<Event$result | undefined, Event$input> {
	constructor() {
		// @ts-ignore
		super({})
	}
}
