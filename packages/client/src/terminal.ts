import { processCommand } from "../nakama";
import { createPlayer } from "../nakama";

export function sendCommand(command: string): Promise<string> {
	return new Promise(async (resolve, reject) => {
		await processCommand(command, resolve); // promise is resolved in socket.onnotification
	});
}

export function sendCreatePlayer(name: string, roomID: number): Promise<string> {
	return new Promise(async (resolve, reject) => {
		await createPlayer(name, roomID, resolve); // promise is resolved in socket.onnotification
	});
}

