interface HelpContent {
	description: string;
	usage?: string;
	examples?: string[];
}

export const HELP_TEXTS: Record<string, HelpContent> = {
	go: {
		description:
			"Move through the world in a specific direction\n can also just use direction",
		usage: "go <direction>",
		examples: [
			"go north",
			"go south",
			"go east",
			"go west",
			"go up",
			"go down",
			"north",
			"south",
			"n",
			"...",
		],
	},
	look: {
		description: "Examine your surroundings or specific objects",
		usage: "look [around]\nlook at <object>",
		examples: ["look", "look around", "look at tree"],
	},
	take: {
		usage: "take <object>",
		description: "Take an object from the ground",
		examples: ["take paper", "take the airplane", "take the key"],
	},
	inventory: {
		description: "View your inventory",
		usage: "inventory",
		examples: ["inventory"],
	},
	drop: {
		usage: "drop <object>",
		description: "Drop an object on the ground",
		examples: ["drop paper", "drop the airplane", "drop the key"],
	},
};
