import { type Plural, translation } from "./definition";

export default translation({
	language_name: "Slovenčina",
	title: (link) => `Generátor ${link("Hayagriva")}`,
	clear_fields: "Vymazať polia",
	copy_yaml: "Kopírovať yaml",
	label_label: {
		name: "Označenie",
		description: "ako bude položka odkazovaná v Typst",
	},
	delete_tooltip: "Odstrániť túto položku",
	extra_tooltip: "K tejto položke sú priradené dodatočné polia",
	format_tooltips: {
		date: "YYYY-MM-DD, YYYY-MM alebo YYYY",
		timestamp: "MM:SS (úplný formát: DD:HH:MM:SS,msms)",
		range: "MM:SS-MM:SS (úplný formát: DD:HH:MM:SS,msms)",
	},
	entry: {
		type_label: "Typ",
		types: {
			anthology: "Antológia",
			anthos: "Príspevok v antológii",
			article: "Článok",
			artwork: "Umelecké dielo",
			audio: "Audio",
			blog: "Blog",
			book: "Kniha",
			case: "Prípad",
			chapter: "Kapitola",
			conference: "Konferencia",
			entry: "Záznam",
			exhibition: "Výstava",
			legislation: "Legislatíva",
			manuscript: "Rukopis",
			misc: "Rôzne",
			newspaper: "Noviny",
			original: "Originál",
			patent: "Patent",
			performance: "Predstavenie",
			periodical: "Periodikum",
			post: "Príspevok",
			proceedings: "Zborník",
			reference: "Referencia",
			report: "Správa",
			repository: "Repozitár",
			scene: "Scéna",
			thesis: "Práca",
			thread: "Vlákno",
			video: "Video",
			web: "Web",
		},
		title_label: "Názov",
		author_label: plural("Autor", "Autori"),
		author_tooltips: {
			add: "Pridať autora",
			remove: "Odstrániť autora",
		},
		date_label: "Dátum",
		abstract_label: "Abstrakt",
		genre_label: {
			name: "Žáner",
			description:
				"Typ, trieda alebo podtyp položky (napr. 'Dizertačná práca' pre PhD prácu). Nepoužívajte pre tematické popisy alebo kategórie (napr. 'dobrodružstvo' pre dobrodružný film).",
		},
		editor_label: plural("Editor", "Editori"),
		editor_tooltips: {
			add: "Pridať editora",
			remove: "Odstrániť editora",
		},
		affiliated_label: {
			name: plural("Pridružený", "Pridružení"),
			description:
				"osoby zapojené do položky, ktoré nezapadajú do kategórie autor alebo editor",
		},
		affiliated_tooltips: {
			add: "Pridať pridruženého",
			remove: "Odstrániť pridruženého",
		},
		publisher_label: "Vydavateľ",
		publisher_location_label: "Miesto vydania",
		location_label: {
			name: "Miesto",
			description:
				"miesto, kde sa položka fyzicky nachádza alebo sa uskutočnila. Pre miesto, kde bola položka vydaná, pozri vydavateľ.",
		},
		organization_label: {
			name: "Organizácia",
			description: "Organizácia, pre ktorú/v ktorej bola položka vytvorená",
		},
		issue_label: {
			name: "Číslo",
			description:
				"Pre položku, ktorej nadradená má viacero čísel, označuje pozíciu v poradí čísel. Používa sa aj na označenie čísla epizódy pre TV.",
		},
		volume_label: {
			name: "Zväzok",
			description:
				"Pre položku, ktorej nadradená má viacero zväzkov/častí/sérií… z ktorých je táto položka jednou",
		},
		total_placeholder: "celkom",
		edition_label: "Vydanie",
		page_range_label: "Rozsah strán",
		time_range_label: "Časový rozsah",
		runtime_label: "Dĺžka",
		url_label: "URL",
		accessed_label: "Pristúpené",
		serial_number_label: "Sériové číslo",
		language_label: "Jazyk",
		archive_label: {
			name: "Archív",
			description: "názov inštitúcie/zbierky, kde je položka uložená",
		},
		archive_location_label: "Miesto archívu",
		call_number_label: {
			name: "Signatúra",
			description:
				"Číslo položky v knižnici, inštitúcii alebo zbierke.",
		},
		note_label: "Poznámka",
		parent_label: "Nadradená",
		add_parent: "Pridať nadradenú",
	},
	person_with_role: {
		role_label: "Úloha",
		roles: {
			afterword: "Doslov",
			annotator: "Anotátor",
			"cast-member": "Člen obsadenia",
			cinematography: "Kamera",
			collaborator: "Spolupracovník",
			commentator: "Komentátor",
			compiler: "Zostavovateľ",
			composer: "Skladateľ",
			director: "Režisér",
			"executive-producer": "Výkonný producent",
			foreword: "Predhovor",
			founder: "Zakladateľ",
			holder: "Držiteľ",
			illustrator: "Ilustrátor",
			introduction: "Úvod",
			narrator: "Rozprávač",
			organizer: "Organizátor",
			producer: "Producent",
			translator: "Prekladateľ",
			writer: "Spisovateľ",
		},
		names_label: "Mená",
		names_tooltips: {
			add: "Pridať meno",
			remove: "Odstrániť meno",
		},
	},
	person: {
		name_label: "Meno",
		given_name_label: "Krstné meno",
		prefix_label: "Predpona",
		suffix_label: "Prípona",
		alias_label: "Alias",
		collapsed_tooltip: "Zbalené polia mien",
		expanded_tooltip: "Rozbalené polia mien",
	},
});

function plural(singular: string, plural: string): Plural {
	return (n) => (n === 1 ? singular : plural);
}