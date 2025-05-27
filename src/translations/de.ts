import { type Plural, translation } from "./definition";

export default translation({
	language_name: "Deutsch",
	title: (link) => `${link("Hayagriva")} Generator`,
	clear_fields: "Textfelder leeren",
	copy_yaml: "YAML kopieren",
	label_label: {
		name: "Label",
		description:
			"Der Name über welchen der Eintrag in Typst referenziert wird.",
	},
	delete_tooltip: "Diesen Eintrag löschen.",
	extra_tooltip: "Es sind zusätzlche Textfelder mit diesem Eintrag verbunden.",
	format_tooltips: {
		date: "JJJJ-MM-TT, JJJJ-MM or JJJJ",
		timestamp: "MM:SS (vollständiges Format: TT:HH:MM:SS,msms)",
		range: "MM:SS-MM:SS (vollständiges Format: TT:HH:MM:SS,msms)",
	},
	entry: {
		type_label: "Art",
		types: {
			anthology: "Sammelband",
			anthos: "Anthos",
			article: "Artikel",
			artwork: "Kunstwerk",
			audio: "Audio",
			blog: "Blogeintrag",
			book: "Buch",
			case: "Gerichtsfall",
			chapter: "Kapitel",
			conference: "Konferenz",
			entry: "Eintrag",
			exhibition: "Ausstellung",
			legislation: "Gesetz",
			manuscript: "Manuskript",
			misc: "Verschiedenes",
			newspaper: "Zeitung",
			original: "Original",
			patent: "Patent",
			performance: "Aufführung",
			periodical: "Zeitschrift",
			post: "Beitrag",
			proceedings: "Tagungsband",
			reference: "Handbuch",
			report: "Bericht",
			repository: "Quelltext Repositorium",
			scene: "Szene",
			thesis: "Abschlussarbeit",

			// There are possible translations like "Gesprächsfaden" or "Diskussionsfaden", but they feel overly forced.
			// I just assume that most people that would use this type know what the English term means.
			thread: "Thread",

			video: "Video",
			web: "Internet",
		},
		title_label: "Titel",
		author_label: plural("Autor:in", "Autor:innen"),
		author_tooltips: {
			add: "Autor:in hinzufügen",
			remove: "Autor:in entfernen",
		},
		date_label: "Datum",
		abstract_label: "Zusammenfassung",
		genre_label: {
			name: "Genre",
			description:
				"Typ, Kategorie, oder Unterkategorie des Eintrags (z.B. „Dissertation“ für Doktorarbeiten; „WHO Publikation“ für technische Berichte der WHO). Benutzt dieses Feld nicht für oberflächliche Beschreibungen oder Kategorien (z.B. „Abenteuer“ für Abenteuer-Filme).",
		},
		editor_label: plural("Herausgeber:in", "Herausgeber:innen"),
		editor_tooltips: {
			add: "Herausgeber:in hinzufügen",
			remove: "Herausgeber:in entfernen",
		},
		affiliated_label: {
			name: plural("Assoziiert", "Assoziierte"),
			description:
				"Personen welche mit dem Eintrag assoziiert sind, aber nicht Autor:in oder Editor:in sind.",
		},
		affiliated_tooltips: {
			add: "Assoziierten hinzufügen",
			remove: "Assoziierten entfernen",
		},
		publisher_label: "Verlag",
		publisher_location_label: "Veröffentlichungsort",
		location_label: {
			name: "Ort",
			description:
				"Ort an dem der Eintrag sich physisch befindet oder sich abgespielt hat. Für den Ort an dem der Eintrag veröffenlicht wurde, siehe „Veröffentlichunsort“.",
		},
		organization_label: {
			name: "Organisation",
			description:
				"Organisation bei/für welche(r) der Eintrag produziert wurde.",
		},
		issue_label: {
			name: "Ausgabe",
			description:
				"Bezeichnet die genaue Ausgabennummer für Einträge bei welchen der Elterneintrag mehrere Ausgaben beinhaltet. Wird auch genutzt um die Episodennummer bei Fernsehsendungen anzugeben.",
		},
		volume_label: {
			name: "Band",
			description:
				"Für Einträge dessen Elterneintrag aus mehreren Bänden/Teilen/Staffeln besteht.",
		},
		total_placeholder: "gesamt",
		edition_label: "Edition",
		page_range_label: "Seiten",
		time_range_label: "Zeitspanne",
		runtime_label: "Laufzeit",
		url_label: "URL",
		accessed_label: "Zugegriffen",
		serial_number_label: "Seriennummer",
		language_label: "Sprache",
		archive_label: {
			name: "Archiv",
			description:
				"Name des/der Instituts/Sammlung in der sich der Eintrag befindet.",
		},
		archive_location_label: "Archivort",
		call_number_label: {
			name: "Standortnummer",

			// Taken straight from Duden:
			// https://www.duden.de/rechtschreibung/Standortnummer
			description:
				"Kombination aus Buchstaben und Zahlen, unter der ein Eintrag in einer Bibliothek/Institution/Sammlung geführt wird und anhand deren man es findet.",
		},
		note_label: "Anmerkung",
		parent_label: "Elterneintrag",
		add_parent: "Elterneintrag hinzufügen",
	},
	person_with_role: {
		role_label: "Rolle",
		roles: {
			afterword: "Nachwort Autor:in",

			// Both 'annotator' and 'commentator' are usually translated as the same word: "Kommentator:in".
			// Problem with that is that 'annotator's usually write comments while 'commentator's normally give non-written comments.
			annotator:
				"Kommentator:in (z.B. in Dichtung und wissenschaftlichen Ausgaben)",
			commentator: "Kommentator:in (z.B. in Presse und Rundfunk)",

			// Many online translations recommend "Schauspieler", but that leans more into 'actor' as in cinema and theatre.
			// It would be inappropriate for music or audio books.
			// The current word choice is more vague but can be applied to more industries.
			"cast-member": "Besetzung",

			cinematography: "Kamera",
			collaborator: "Mitarbeiter:in",
			compiler: "Sammler:in",
			composer: "Komponist:in",
			director: "Regisseur:in",

			// According to German Wikipedia:
			// https://de.wikipedia.org/w/index.php?title=Executive_Producer&oldid=249431993
			"executive-producer": "Geschäftsführende(r) Produzent:in",

			foreword: "Vorwort Autor:in",
			founder: "Gründer:in",
			holder: "Besitzer:in",
			illustrator: "Illustrator:in",
			introduction: "Einleitung Autor:in",
			narrator: "Erzähler:in",
			organizer: "Organisator:in",
			producer: "Produzent:in",
			translator: "Übersetzer:in",
			writer: "Schriftsteller:in",
		},
		names_label: "Namen",
		names_tooltips: {
			add: "Namen hinzufügen",
			remove: "Namen entfernen",
		},
	},
	person: {
		name_label: "Nachname",
		given_name_label: "Vorname",
		prefix_label: "Prefix",
		suffix_label: "Suffix",
		alias_label: "Alias",
		collapsed_tooltip: "Zugeklappte Namen-Textfelder",
		expanded_tooltip: "Ausgeklappte Namen-Textfelder",
	},
});

function plural(singular: string, plural: string): Plural {
	return (n) => (n === 1 ? singular : plural);
}
