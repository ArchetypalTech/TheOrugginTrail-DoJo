import { Route, Switch } from "wouter";
import "./styles/index.css";
import { Client } from "./client/client";
import { Editor } from "./editor/editor";
import { useHead } from "@unhead/react";
import { APP_SEO } from "./data/app.data";

const App = () => {
	useHead({
		title: APP_SEO.title,
		meta: Object.entries(APP_SEO).map(([key, value]) => {
			if (key.startsWith("og")) {
				return {
					property: `og:${key.replace("og", "")}`,
					content: value,
				};
			}
			return {
				name: key,
				content: value,
			};
		}),
	});

	return (
		<>
			<Switch>
				<Route path="/editor" component={Editor} />
				<Route component={Client} />
			</Switch>
		</>
	);
};

export default App;
