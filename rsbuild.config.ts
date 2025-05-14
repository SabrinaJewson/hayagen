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
			const lang = entryName as Lang;
			return {
				...value,
				i18n: translations[lang],
				lang,
				lang_options: LANGS.map((other_lang) => {
					const selected = other_lang === lang ? " selected" : "";
					const name = translations[other_lang].language_name;
					return `<option value="${other_lang}"${selected}>${name}</option>`;
				}).join(),
			};
		},
	},
	server: {
		base,
	},
});
