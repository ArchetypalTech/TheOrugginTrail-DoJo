import { ZORG_CONFIG } from "@lib/config";
import EditorData from "../editor.data";

export const EditorFooter = () => {
	return (
		<header className="flex flex-row justify-between gap-2 mt-4 items-center p-4 invert bg-gray-300">
			<h1 className="text-xl font-bold font-mono textFreak">ZORGTOR</h1>

			<div className="flex grow" />
			<div className="flex gap-2">
				<a
					href={`${ZORG_CONFIG.endpoints.torii.http}/sql`}
					target="_blank"
					rel="noopener noreferrer"
					className="hover:underline text-xs textFreak"
				>
					<button className="btn btn-sm btn-success">Torii SQL</button>
				</a>
			</div>
			<div className="flex gap-2">
				<button
					className="btn btn-sm btn-success"
					onClick={() => {
						EditorData().logPool();
					}}
				>
					Console Log Pool
				</button>
			</div>
		</header>
	);
};
