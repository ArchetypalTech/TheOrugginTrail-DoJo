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
