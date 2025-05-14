import { defineConfig } from "@rsbuild/core";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { pluginSolid } from "@rsbuild/plugin-solid";
import { LANGS, type Lang, translations } from "./src/translations";

export default defineConfig({
	source: {
		entry: {
			// TODO: lang redirect
			...Object.fromEntries(LANGS.map((lang) => [lang, "./src/index.tsx"])),
		},
	},
	plugins: [
		pluginBabel({
			include: /\.(?:jsx|tsx)$/,
		}),
		pluginSolid(),
	],
	html: {
		template: "./src/index.html",
		title: ({ entryName }) => translations[entryName as Lang].title((s) => s),
		meta: {
			"color-scheme": "light dark",
		},
		templateParameters: (value, { entryName }) => {
			return {
				...value,
				i18n: translations[entryName as Lang],
				lang: entryName,
			};
		},
	},
	server: {
		base: "/hayagen",
	},
});
