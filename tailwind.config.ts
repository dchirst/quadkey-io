import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				'primary-muted': 'oklch(var(--primary-muted) / 0.8)'
			}
		}
	},

	plugins: [daisyui]
} as Config;
