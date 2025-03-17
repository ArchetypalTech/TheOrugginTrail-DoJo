import { cn, normalizeAddress } from "@/lib/utils/utils";
import type { T_Action, T_Object, T_Room } from "../lib/types";

export const EditorList = <T extends T_Room | T_Object | T_Action>({
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
				if (r === undefined) return;
				const id =
					(r as T_Room).roomId || (r as T_Object).inst || (r as T_Action).actionId;
				const name =
					(r as T_Room).shortTxt ||
					(r as T_Object).name ||
					`${(r as T_Action).actionType} ${normalizeAddress((r as T_Action).actionId)}`;
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
