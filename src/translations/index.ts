import type { Translation } from "./definition.ts";
import en from "./en";
import cs from "./cs";
import sk from "./sk";
import fr from "./fr";

export const LANGS = ["en", "cs", "sk", "fr"] as const;

export type Lang = (typeof LANGS)[number];

export const translations: { [l in Lang]: Translation } = { en, cs, sk, fr };
