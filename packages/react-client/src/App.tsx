import { ORUG_CONFIG } from "./lib/config";

console.log(import.meta.env);

function App() {
	// useHead({
	// 	title: APP_SEO.title,
	// 	meta: Object.entries(APP_SEO).map(([key, value]) => {
	// 		if (key.startsWith("og")) {
	// 			return {
	// 				property: `og:${key.replace("og", "")}`,
	// 				content: value,
	// 			};
	// 		}
	// 		return {
	// 			name: key,
	// 			content: value,
	// 		};
	// 	}),
	// });

	console.log(ORUG_CONFIG);

	return <>hello</>;
}

export default App;
