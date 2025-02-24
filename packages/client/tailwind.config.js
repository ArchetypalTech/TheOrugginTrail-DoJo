/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}',
		'./src/**/*.svelte'
	],
	theme: {
		extend: {}
	},
	plugins: [],
	corePlugins: {
		preflight: true,
	}
};
