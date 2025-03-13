import { Route, Switch } from "wouter";
import "./styles/index.css";
import { Client } from "./client/client";
import { Editor } from "./editor/editor";

const App = () => {
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
