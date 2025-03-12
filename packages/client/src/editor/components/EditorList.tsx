import { cn } from "@/lib/utils/utils";
import type { Action, ZorgObject } from "../lib/schemas";
import type { T_Room } from "../lib/types";

export const EditorList = <T extends Room | ZorgObject | Action>({
	list,
	selectionFn,
	selectedIndex,
	addObjectFn,
	emptyText,
}: {
	list: T[];
	selectionFn: (idx: number) => void;
	selectedIndex: number;
	addObjectFn: () => void;
	emptyText?: string;
}) => {
	return (
		<div className="flex flex-col gap-2">
			{list.map((r, idx) => {
				const id =
					(r as T_Room).roomId || (r as ZorgObject).objID || (r as Action).actionID;
				const name =
					(r as T_Room).shortTxt ||
					(r as ZorgObject).name ||
					`${(r as Action).type} ${(r as Action).actionID}`;
				const isSelected = idx === selectedIndex;
				return (
					<button
						key={id}
						className={cn("btn", isSelected && "btn-active")}
						onClick={() => selectionFn(idx)}
					>
						{name}
					</button>
				);
			})}
			<button className="btn btn-primary" onClick={() => addObjectFn()}>
				{emptyText || "Create New"}
			</button>
		</div>
	);
};
