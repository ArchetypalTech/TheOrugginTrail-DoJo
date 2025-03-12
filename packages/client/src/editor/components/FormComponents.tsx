import { cn } from "@/lib/utils";
import { TagInput as Tags } from "./TagInput";

export const Header = ({
	title,
	children,
}: { title: string; children?: React.ReactNode }) => {
	return (
		<div className="flex justify-between flex-row gap-2">
			<h2>{title}</h2>
			<div className="grow" />
			{children}
		</div>
	);
};

export const DeleteButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button className="btn btn-danger btn-sm" onClick={onClick}>
			❌
		</button>
	);
};

export const PublishButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button className="btn btn-sm" onClick={onClick}>
			🕊️
		</button>
	);
};

export const Input = ({
	id,
	value,
	onChange,
	className,
	disabled,
	readOnly,
}: {
	id: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
	disabled?: boolean;
	readOnly?: boolean;
}) => {
	return (
		<div className="form-group">
			<label htmlFor={id} className="block text-sm font-medium text-gray-700">
				{id}
			</label>
			<input
				id={id}
				value={value}
				onChange={onChange}
				className={cn(
					"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
					className,
				)}
				disabled={disabled}
				readOnly={readOnly}
			/>
		</div>
	);
};

export const TagInput = ({
	id,
	value,
	onChange,
	className,
	description,
}: {
	id: string;
	value: string;
	onChange: (tags: string[]) => void;
	className?: string;
	description?: string;
}) => {
	return (
		<div className="form-group">
			<label htmlFor={id} className="block text-sm font-medium text-gray-700">
				{id}
			</label>
			<p className="mt-1 text-xs text-gray-500">{description}</p>
			<Tags value={value.split(",")} onChange={onChange} className={className} />
		</div>
	);
};

export const Textarea = ({
	id,
	value,
	onChange,
	rows,
	className,
	children,
}: {
	id: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	rows: number;
	className?: string;
	children?: React.ReactNode;
}) => {
	return (
		<div className="form-group">
			<label htmlFor={id} className="block text-sm font-medium text-gray-700">
				{id}
			</label>
			<textarea
				id={id}
				value={value}
				onChange={onChange}
				rows={rows}
				className={cn(
					"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
					className,
				)}
			/>
			{children}
		</div>
	);
};

export const Select = ({
	id,
	value,
	onChange,
	options,
	className,
}: {
	id: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	options: Array<{ value: string; label: string }>;
	className?: string;
}) => {
	return (
		<div className="form-group">
			<label htmlFor={id} className="block text-sm font-medium text-gray-700">
				{id}
			</label>
			<select
				id={id}
				value={value}
				onChange={onChange}
				className={cn(
					"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
					className,
				)}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};

export const Toggle = ({
	id,
	checked,
	onChange,
	className,
}: {
	id: string;
	checked: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
}) => {
	return (
		<div className="form-group flex items-center">
			<input
				type="checkbox"
				id={id}
				checked={checked}
				onChange={onChange}
				className={cn(
					"h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
					className,
				)}
			/>
			<label htmlFor={id} className="ml-2 block text-sm text-gray-700">
				{id}
			</label>
		</div>
	);
};

export const TextDef = ({
	id,
	owner,
}: {
	id: string;
	owner: string;
}) => {
	return (
		<div className="text-xs flex flex-col hover:text-black/40 text-black/0">
			<div className="text-nowrap">id: {id}</div>
			<div className="text-nowrap">owner: {owner}</div>
		</div>
	);
};

export const ItemId = ({ id }: { id: string }) => {
	return (
		<div className="form-group">
			<label className="block text-sm font-medium text-gray-700">Room ID</label>
			<p className="mt-1 text-xs text-gray-500">
				This ID is generated automatically and should not be changed.
			</p>
			<input
				type="text"
				id={id}
				value={id}
				className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
				disabled
			/>
		</div>
	);
};
