import {
	writable,
	derived,
	get,
	type Writable,
	type Readable,
} from "svelte/store";
import type { z } from "zod";
import type { ValidationError } from "./schemas";
import { validateWithSchema } from "./schemas";

/**
 * A generic store type with schema validation
 */
export class GenericStore<T, SchemaType = T> {
	private store: Writable<T>;
	private schema: z.ZodSchema<SchemaType>;

	constructor(initialState: T, schema: z.ZodSchema<SchemaType>) {
		this.store = writable<T>(initialState);
		this.schema = schema;
	}

	// Get the raw store for svelte reactivity
	public get writable(): Writable<T> {
		return this.store;
	}

	// Subscribe to store changes
	public subscribe(callback: (value: T) => void) {
		return this.store.subscribe(callback);
	}

	// Get the current value
	public get(): T {
		return get(this.store);
	}

	// Set a new value
	public set(value: T): ValidationError[] {
		const errors = validateWithSchema(this.schema, value);
		this.store.set(value);
		return errors;
	}

	// Update the store
	public update(updater: (state: T) => T): ValidationError[] {
		const newState = updater(this.get());
		return this.set(newState);
	}

	// Validate the current state
	public validate(): ValidationError[] {
		return validateWithSchema(this.schema, this.get());
	}

	// Create a derived store
	public derive<U>(deriveFn: (state: T) => U): Readable<U> {
		return derived(this.store, deriveFn);
	}
}

/**
 * Factory function to create a generic store with an initial state and schema
 */
export function createGenericStore<T, SchemaType = T>(
	initialState: T,
	schema: z.ZodSchema<SchemaType>,
): GenericStore<T, SchemaType> {
	return new GenericStore<T, SchemaType>(initialState, schema);
}
