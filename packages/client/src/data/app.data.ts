const APP_DATA = {
	title: "ZORG",
	icon:
		"data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y='.9em' font-size='90' transform='translate(110, 5) scale(-.975,.975)'>🚪</text><text y='.1em' font-size='90' transform='translate(45, 30) scale(0.5,0.5)'>✨</text></svg>",
	description: "",
	keywords: [],
	image: "",
	url: "",
};

const APP_EDITOR_DATA = {
	title: "ZORGTOR",
	icon: () =>
		`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y='.9em' font-size='90' transform='translate(110, 5) scale(-.975,.975)'>${APP_RANDOM_ICON()}</text><text y='.1em' font-size='90' transform='translate(45, 30) scale(0.5,0.5)'>✨</text></svg>`,
	description: "",
	keywords: [],
	image: "",
	url: "",
};

export const APP_SEO = {
	title: APP_DATA.title,
	description: APP_DATA.description,
	ogDescription: APP_DATA.description,
	ogTitle: APP_DATA.title,
	ogImage: APP_DATA.image,
	ogType: "website",
	ogUrl: APP_DATA.url,
	ogSiteName: APP_DATA.title,
	ogLocale: "en_US",
	twitterCard: "summary_large_image",
	keywords: APP_DATA.keywords.join(),
	icon: APP_DATA.icon,
} as const;

export const APP_EDITOR_SEO = {
	title: APP_EDITOR_DATA.title,
	description: APP_EDITOR_DATA.description,
	ogDescription: APP_EDITOR_DATA.description,
	ogTitle: APP_EDITOR_DATA.title,
	ogImage: APP_EDITOR_DATA.image,
	ogType: "website",
	ogUrl: APP_EDITOR_DATA.url,
	ogSiteName: APP_EDITOR_DATA.title,
	ogLocale: "en_US",
	twitterCard: "summary_large_image",
	keywords: APP_EDITOR_DATA.keywords.join(),
	icon: APP_EDITOR_DATA.icon,
} as const;

const RND_ICONS = ["🐦‍🔥", "🥾", "🚪", "🗝️", "📦", "🥄"];
const APP_RANDOM_ICON = () =>
	RND_ICONS[Math.floor(Math.random() * RND_ICONS.length)];
