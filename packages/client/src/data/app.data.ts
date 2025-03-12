const APP_DATA = {
	title: "ZORG",
	editor_title: "ZORGTOR",
	displayName: "ZORG",
	description: "",
	keywords: [],
	image: "",
	url: "",
};

export const APP_SEO = {
	title: APP_DATA.displayName,
	description: APP_DATA.description,
	ogDescription: APP_DATA.description,
	ogTitle: APP_DATA.displayName,
	ogImage: APP_DATA.image,
	ogType: "website",
	ogUrl: APP_DATA.url,
	ogSiteName: APP_DATA.displayName,
	ogLocale: "en_US",
	twitterCard: "summary_large_image",
	keywords: APP_DATA.keywords.join(),
} as const;

export const APP_ICON =
	"data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y='.9em' font-size='90' transform='translate(10, 0)'>✨</text><text y='.1em' font-size='90' transform='translate(10, 35) scale(0.5,0.5)'>🥄</text></svg>";
