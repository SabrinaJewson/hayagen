import { defineConfig } from "@rsbuild/core";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { pluginSolid } from "@rsbuild/plugin-solid";
import { LANGS, type Lang, translations } from "./src/translations";

const base = "/hayagen";

export default defineConfig({
	source: {
		entry: {
			index: "./src/redirect.ts",
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
		template: ({ entryName }) =>
			entryName === "index" ? "./src/redirect.html" : "./src/index.html",
		title: ({ entryName }) =>
			entryName === "index"
				? "Redirecting…"
				: translations[entryName as Lang].title((s) => s),
		meta: {
			"color-scheme": "light dark",
		},
		templateParameters: (value, { entryName }) => {
			if (entryName === "index") {
				return {
					...value,
					langs: LANGS.map(
						(lang) => `<li><a href="${base}/${lang}">${lang}</a></li>`,
					).join(),
				};
			}
			return {
				...value,
				i18n: translations[entryName as Lang],
				lang: entryName,
			};
		},
	},
	server: {
		base,
	},
});
