import Terminal from "./terminal/Terminal";

export const Client = () => {
	return (
		<div id="client-root" className="flex relative w-screen h-screen">
			<Terminal />
		</div>
	);
};
