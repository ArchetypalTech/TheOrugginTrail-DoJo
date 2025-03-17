import { useEffect, useCallback } from "react";
import type { FC } from "react";
import "@styles/notifications.css";
import { useNotificationStore } from "../editor.store";

interface NotificationsProps {
	onDismiss?: () => void;
}

const styles = {
	error: { icon: "❌", class: "notification-error" },
	success: { icon: "✓", class: "notification-success" },
	warning: { icon: "⚠️", class: "notification-warning" },
	info: { icon: "ℹ️", class: "notification-default" },
	loading: { icon: "⌛", class: "notification-loading" },
	publishing: { icon: "📤", class: "notification-loading" },
	default: { icon: "ℹ️", class: "notification-default" },
};

let timer: ReturnType<typeof setTimeout> | null = null;

const Notifications: FC<NotificationsProps> = ({ onDismiss }) => {
	const { type, message, blocking, logs, timeout } = useNotificationStore();

	// Handle dismiss button click
	const handleDismiss = useCallback(() => {
		if (timer) clearTimeout(timer);
		onDismiss?.();
	}, [onDismiss]);

	// Set up auto-dismiss timer if timeout is provided
	useEffect(() => {
		if (timeout && message && logs === undefined) {
			timer = setTimeout(() => {
				handleDismiss();
			}, timeout);
		}

		// Clean up timer on component unmount
		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [timeout, message, handleDismiss, logs]);

	// Get notification style classes based on type
	const getNotificationClass = () =>
		styles[type as keyof typeof styles]?.class || styles.default.class;

	// Get default icon based on type
	const getDefaultIcon = () =>
		styles[type as keyof typeof styles]?.icon || styles.default.icon;

	// Display icon
	const displayIcon = getDefaultIcon();
	const bgColor = getNotificationClass();
	const dismissable = !blocking;

	// Only render if we have a message or if blocking is true
	if (!message && !blocking) return null;

	return (
		<div className={`state-notification-container ${blocking ? "blocking" : ""}`}>
			{blocking && <div className="overlay" />}

			<div
				className={`notification ${bgColor} border px-4 py-3 rounded relative mb-4`}
			>
				<div className="flex items-center">
					{type === "loading" || type === "publishing" ? (
						<div className="animate-spin rounded-full h-2 w-2 border-t-2 border-b-2 mr-3" />
					) : displayIcon ? (
						<span className="mr-3">{displayIcon}</span>
					) : null}

					<span className="block sm:inline">{message}</span>

					{dismissable && (
						<button
							className="absolute top-0 right-0 px-4 py-3"
							onClick={handleDismiss}
							aria-label="Dismiss"
						>
							<span className="text-xl">&times;</span>
						</button>
					)}
				</div>

				{logs !== undefined && logs.length > 0 && (
					<div className="mt-4 log-container">
						{[...logs].reverse().map((log, index) => (
							<div
								key={index}
								className={`logger-item p-3 rounded mb-2 flex-col flex not-first-of-type:opacity-50 ${log.detail.error ? "log-error" : ""}`}
							>
								<div className="font-berkeley text-xs">
									{JSON.stringify(log.detail, null, 2)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Notifications;
