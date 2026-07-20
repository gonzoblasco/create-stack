import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["src/**/*.{test,spec}.ts"],
		exclude: [
			"src/stacks/*/template/**/*.{test,spec}.ts",
			"node_modules",
			"dist",
		],
	},
});
