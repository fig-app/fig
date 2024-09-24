import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 1042,
		strictPort: true,
		fs: {
			strict: false
		}
	}
});
