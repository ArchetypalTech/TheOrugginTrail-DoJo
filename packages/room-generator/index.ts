import { CairoConverter } from './src/converter';
import type { Config } from './src/types';
import { yellow } from 'ansicolor'

const main = async () => {
    const startTime = Date.now();
    console.log(yellow('🚻 Room-generator'));
    const args = Bun.argv.slice(2); // Remove 'bun' and script name from args

    if (args.length !== 2) {
        console.error('Usage: <input.json> <output.cairo>');
        process.exit(1);
    }

    const [inputFile, outputFile] = args;

    try {
        // Read and parse the JSON file
        const jsonContent = await Bun.file(inputFile).text();
        const config = JSON.parse(jsonContent) as Config;

        // Convert to Cairo code
        const converter = new CairoConverter();
        const cairoCode = converter.convert(config);

        // Write the output
        await Bun.write(outputFile, cairoCode);
        console.log(`Successfully converted "${inputFile}" to "${outputFile}" (${Date.now() - startTime}ms)`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('An unknown error occurred:', error);
        }
        process.exit(1);
    }
};

main();