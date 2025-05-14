import type { Translation } from "./definition.ts";
import en from "./en";
import cs from "./cs";

export const LANGS = ["en","cs"] as const;

export type Lang = (typeof LANGS)[number];

export const translations: { [l in Lang]: Translation } = { en, cs };
