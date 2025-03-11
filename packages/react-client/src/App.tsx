import { Link, Route, Switch } from "wouter";
import { ORUG_CONFIG } from "@lib/config";
import "./styles/index.css";
import { Client } from "./client/client";
import { Editor } from "./editor/editor";

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

	return (
		<Switch>
			<Route path="/editor" component={Editor} />
			<Route component={Client} />
		</Switch>
	);
}

export default App;
