// Define notification state types
import { z } from "zod";

export type NotificationType =
	| "error"
	| "success"
	| "loading"
	| "publishing"
	| "none";

export interface NotificationState {
	type: NotificationType;
	message: string;
	blocking: boolean;
	logs?: CustomEvent[];
	timeout?: number | null;
}

// Define a Zod schema for notification state
export const NotificationStateSchema = z.object({
	type: z.enum(["error", "success", "loading", "publishing", "none"]),
	message: z.string(),
	blocking: z.boolean(),
	logs: z.array(z.any()).optional(),
	timeout: z.number().nullable().optional(),
});

// Create default notification state
export const initialNotificationState: NotificationState = {
	type: "none",
	message: "",
	blocking: false,
};

// Notification helper functions
export function createErrorNotification(
	message: string,
	blocking = false,
): NotificationState {
	return {
		type: "error",
		message,
		blocking,
	};
}

export function createSuccessNotification(
	message: string,
	timeout = 3000,
): NotificationState {
	return {
		type: "success",
		message,
		blocking: false,
		timeout,
	};
}

export function createLoadingNotification(message: string): NotificationState {
	return {
		type: "loading",
		message,
		blocking: true,
	};
}

export function createPublishingNotification(
	message: string = "Publishing to contract...",
): NotificationState {
	return {
		type: "publishing",
		message,
		blocking: true,
		logs: [],
	};
}

export function clearNotification(): NotificationState {
	return { ...initialNotificationState };
}

// Helper to add a log to a publishing notification
export function addLogToPublishingNotification(
	notificationState: NotificationState,
	log: CustomEvent,
): NotificationState {
	if (notificationState.type !== "publishing" || !notificationState.logs) {
		return notificationState;
	}

	return {
		...notificationState,
		logs: [...notificationState.logs, log],
	};
}
