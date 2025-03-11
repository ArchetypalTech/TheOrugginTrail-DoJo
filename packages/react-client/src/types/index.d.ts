import type { AriaAttributes, DOMAttributes } from "react";

declare module "react" {
	interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
		fetchpriority?: "high" | "low" | "auto";
	}
}

declare interface Window {
	__UNHEAD__: Unhead<T>;
}
