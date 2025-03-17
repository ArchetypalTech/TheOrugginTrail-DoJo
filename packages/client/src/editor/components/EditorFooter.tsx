import { ZORG_CONFIG } from "@lib/config";
import EditorData from "../editor.data";
import { APP_EDITOR_DATA } from "@/data/app.data";

export const EditorFooter = () => {
	return (
		<footer className="gap-2 mt-4 mb-1 flex items-center p-4 not-dark:invert not-dark:bg-gray-300 w-full justify-center rounded-2xl">
			<div className="lg:container flex flex-row justify-between w-full gap-2 items-center">
				<h1 className="text-xl font-bold font-berkeley textFreak mx-2">
					{APP_EDITOR_DATA.title}
				</h1>

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
						Console Log DataPool
					</button>
				</div>
			</div>
		</footer>
	);
};
