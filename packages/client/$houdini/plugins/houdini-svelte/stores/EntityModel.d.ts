import type { EntityModel$input, EntityModel$result, SubscriptionStore } from '$houdini'

export declare class EntityModelStore extends SubscriptionStore<EntityModel$result | undefined, EntityModel$input> {
	constructor() {
		// @ts-ignore
		super({})
	}
}
