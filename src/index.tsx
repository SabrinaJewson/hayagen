import { render } from "solid-js/web";
import App from "./App";

const root = document.getElementById("root");
if (root) {
	render(() => <App />, root);
}

const lang_select = document.getElementById("lang-select") as HTMLSelectElement;
lang_select.addEventListener("change", () => {
	location.href = `${import.meta.env.BASE_URL}/${lang_select.value}`;
});
