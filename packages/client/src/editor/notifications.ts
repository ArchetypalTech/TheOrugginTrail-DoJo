// Define notification state types
export type NotificationType =
	| "error"
	| "success"
	| "loading"
	| "publishing"
	| "warning"
	| "info"
	| "none";

export interface NotificationState {
	type: NotificationType;
	message: string;
	blocking: boolean;
	logs?: CustomEvent[];
	timeout?: number | null;
}

// Create default notification state
export const initialNotificationState: NotificationState = {
	type: "none",
	message: "",
	blocking: false,
};
