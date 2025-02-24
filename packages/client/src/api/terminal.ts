export function sendCommand(command: string): Promise<string> {
	return new Promise(async (resolve, reject) => {
		try {
			// we have a string here so we probably want to split and process
			// further pre throwing it at the contracts wall
			// but for now we do this in the src/lib/index.ts where we make the calls

			// console.log('TA-DISPATCH');
			// console.log('TA-Input:', command);

			const formData = new FormData();
			formData.append('entry', command);
			
			console.log("TA-calling");
			
			// right now this forwards to lib/index.ts
			// via api/routes/+server
			const response = await fetch("/api", {
				method: "POST",
				body: formData,
			});

			/**
			 * right now we dont do anything as the data goes
			 * cli --> katana --> event --> torii --> gql --> cli
			 * so here we are just using a JSON RPC call
			 */
			resolve('');
		} catch( error ) {
			reject(error);
		}
	});
}
