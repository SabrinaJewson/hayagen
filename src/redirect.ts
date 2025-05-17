import { LANGS } from "./translations";

const lang = navigator.language.split("-")[0];

const langs_array: readonly string[] = LANGS;
const chosen_lang = langs_array.includes(lang) ? lang : "en";
location.replace(`${import.meta.env.BASE_URL}/${chosen_lang}`);
