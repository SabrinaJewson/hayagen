import cs from "./cs";
import de from "./de";
import type { Translation } from "./definition.ts";
import en from "./en";
import fr from "./fr";
import sk from "./sk";

export const LANGS = ["en", "cs", "sk", "fr", "de"] as const;

export type Lang = (typeof LANGS)[number];

export const translations: { [l in Lang]: Translation } = {
	en,
	cs,
	sk,
	fr,
	de,
};
