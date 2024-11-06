import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';


export default defineConfig({
	plugins: [
		react(),
		eslint({
			emitWarning: true,
			emitError: true,
			fix: true,
			cache: false,
			include: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'],
			exclude: ['node_modules', 'dist'],
		}),
	],
});
