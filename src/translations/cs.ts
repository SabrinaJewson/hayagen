import { type Plural, translation } from "./definition";

export default translation({
	language_name: "Čeština",
	title: (link) => `${link("Hayagriva")} generátor`,
	clear_fields: "Vymazat pole",
	copy_yaml: "Zkopírovat yaml",
	label_label: {
		name: "Odkazovací štítek",
		description: "Jak bude na záznam odkazováno v Typst",
	},
	delete_tooltip: "Vymazat záznam",
	extra_tooltip: "Existují dodatečné pole, které se vážou k tomuto záznamu",
	format_tooltips: {
		date: "RRRR-MM-DD, RRRR-MM or RRRR (R-Rok, M-Měsíc, D-Den",
		timestamp: "MM:SS (Plný formát: DD:HH:MM:SS,msms)",
		range: "MM:SS-MM:SS (Plný formát: DD:HH:MM:SS,msms)",
	},
	entry: {
		type_label: "Druh",
		types: {
			anthology: "Antologie",
			anthos: "Příspěvek v antologii",
			article: "Článek",
			artwork: "Umění",
			audio: "Audio",
			blog: "Blog",
			book: "Kniha",
			case: "Případ",
			chapter: "Kapitola",
			conference: "Konference",
			entry: "Záznam",
			exhibition: "Výstava",
			legislation: "Legislativa",
			manuscript: "Rukopis",
			misc: "Různé",
			newspaper: "Noviny",
			original: "Původní médium",
			patent: "Patent",
			performance: "Představení",
			periodical: "Periodikum",
			post: "Příspěvek",
			proceedings: "Sborník",
			reference: "Referenční dílo",
			report: "Technická zpráva",
			repository: "Repozitář",
			scene: "Scéna",
			thesis: "Závěrečná práce/Disertace",
			thread: "Vlákno",
			video: "Video",
			web: "Webový obsah",
		},
		title_label: "Název",
		author_label: plural("Autor", "Autoři"),
		author_tooltips: {
			add: "Přidat autora",
			remove: "Odebrat autora",
		},
		date_label: "Datum",
		abstract_label: "Abstrakt",
		genre_label: {
			name: "Žánr",
			description:
				"Typ, třída, nebo jiné člěnění (např. 'Disertační práce' pro doktorskou práci. Nepoužívat např. pro žánr 'Dobrodružství' jako u filmu).",
		},
		editor_label: plural("Recenzent/Editor", "Recenzenti/Editoři"),
		editor_tooltips: {
			add: "Přídat recenzenta/editora",
			remove: "Odebrat recenzenta/editora",
		},
		affiliated_label: {
			name: plural("Spolupracovník", "Spolupracovníci"),
			description:
				"Osoby spojené se záznamem, které nejsou autory ani editory.",
		},
		affiliated_tooltips: {
			add: "Přídat spolupracovníka",
			remove: "Odebrat spolupracovníka",
		},
		publisher_label: "Vydavatel",
		publisher_location_label: "Místo vydání",
		location_label: {
			name: "Místo",
			description:
				"Místo, kde se záznam fyzicky nachází nebo kde došlo k jeho uskutečnění. Informaci o místě vydání položky naleznete u údajů o vydavateli.",
		},
		organization_label: {
			name: "Organizace",
			description: "Organizace ve které, nebo pro kterou byl záznam vytvořen.",
		},
		issue_label: {
			name: "Vydání",
			description:
				"U záznamu náležejícího k více vydáním určuje jeho pozici v rámci posloupnosti vydání. Lze jej také použít k označení čísla epizody u televizního pořadu.",
		},
		volume_label: {
			name: "Svazek",
			description:
				"Určuje, že je záznam součástí vícesvazkového, vícedílného nebo vícesezónního nadřazeného celku.",
		},
		total_placeholder: "Celkem",
		edition_label: "Edice",
		page_range_label: "Rozsah stran",
		time_range_label: "Časový rozsah",
		runtime_label: "Délka",
		url_label: "URL odkaz",
		accessed_label: "Viděno/Citováno dne",
		serial_number_label: "Sériové číslo",
		language_label: "Jazyk",
		archive_label: {
			name: "Archív",
			description: "Jméno instituce/sbírky, kde je záznam uchováván."
		},
		archive_location_label: "Místo archívu",
		call_number_label: {
			name: "Signatura",
			description:
				"Označení pod kterým je záznam uložen v knihovně, instituci, nebo sbírce."
		},
		note_label: "Poznámka",
		parent_label: "Nadřazený záznam",
		add_parent: "Přidat nadřazený záznam",
	},
	person_with_role: {
		role_label: "Role",
		roles: {
			afterword: "Autor doslovu",
			annotator: "Autor poznámek",
			"cast-member": "Člen obsazení",
			cinematography: "Kameraman",
			collaborator: "Spolupracovník",
			commentator: "Komentátor",
			compiler: "Sestavovatel",
			composer: "Skladatel",
			director: "Režisér",
			"executive-producer": "Výkonný producent",
			foreword: "Autor předmluvy",
			founder: "Zakladatel",
			holder: "Držitel práv",
			illustrator: "Ilustrátor",
			introduction: "Autor úvodu",
			narrator: "Vypravěč",
			organizer: "Organizátor",
			producer: "Produkční",
			translator: "Překladatel",
			writer: "Autor scénáře/textu",
		},
		names_label: "Jména",
		names_tooltips: {
			add: "Přidat jméno",
			remove: "Odebrat jméno",
		},
	},
	person: {
		name_label: "Příjmení",
		given_name_label: "Jméno",
		prefix_label: "Před jménem",
		suffix_label: "Za jménem",
		alias_label: "Přezdívka",
		collapsed_tooltip: "Collapsed name fields",
		expanded_tooltip: "Expanded name fields",
	},
});

function plural(singular: string, plural: string): Plural {
	return (n) => (n === 1 ? singular : plural);
}
