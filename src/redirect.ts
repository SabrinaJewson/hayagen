import { LANGS } from "./translations";

const lang = navigator.language.split("-")[0];

const langs_array: readonly string[] = LANGS;
if (langs_array.includes(lang)) {
	location.replace(`${import.meta.env.BASE_URL}/${lang}`);
} else {
	location.replace("/en");
}
