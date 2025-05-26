import { type Plural, translation } from "./definition";

export default translation({
	language_name: "Français",
	title: (link) => `${link("Hayagriva")} générateur`,
	clear_fields: "Effacer les champs",
	copy_yaml: "Copier le yaml",
	label_label: {
		name: "Étiquette",
		description: "comment l'élément sera référencé dans Typst",
	},
	delete_tooltip: "Supprimer cette entrée",
	extra_tooltip: "Il y a des champs supplémentaires associés à cette entrée",
	format_tooltips: {
		date: "AAAA-MM-JJ, AAAA-MM ou AAAA",
		timestamp: "MM:SS (format complet: JJ:HH:MM:SS,msms)",
		range: "MM:SS-MM:SS (format complet: JJ:HH:MM:SS,msms)",
	},
	entry: {
		type_label: "Type",
		types: {
			anthology: "Anthologie",
			anthos: "Anthos",
			article: "Article",
			artwork: "Œuvre d'art",
			audio: "Audio",
			blog: "Blog",
			book: "Livre",
			case: "Cas",
			chapter: "Chapitre",
			conference: "Conférence",
			entry: "Entrée",
			exhibition: "Exposition",
			legislation: "Législation",
			manuscript: "Manuscrit",
			misc: "Divers",
			newspaper: "Journal",
			original: "Original",
			patent: "Brevet",
			performance: "Performance",
			periodical: "Périodique",
			post: "Publication",
			proceedings: "Actes",
			reference: "Référence",
			report: "Rapport",
			repository: "Répertoire",
			scene: "Scène",
			thesis: "Thèse",
			thread: "Fil de discussion",
			video: "Vidéo",
			web: "Web",
		},
		title_label: "Titre",
		author_label: plural("Auteur", "Auteurs"),
		author_tooltips: {
			add: "Ajouter un auteur",
			remove: "Supprimer l'auteur",
		},
		date_label: "Date",
		abstract_label: "Résumé",
		genre_label: {
			name: "Genre",
			description:
				"Type, classe ou sous-type de l'élément (par ex. «Doctoral dissertation» pour une thèse de doctorat ; «NIH Publication» pour un rapport technique du NIH). Ne pas utiliser pour des descriptions ou des catégories thématiques (par ex. «aventure» pour un film d'aventure).",
		},
		editor_label: plural("Rédacteur", "Rédacteurs"),
		editor_tooltips: {
			add: "Ajouter un rédacteur",
			remove: "Supprimer le rédacteur",
		},
		affiliated_label: {
			name: plural("Affilié", "Affiliés"),
			description:
				"personnes impliquées dans l'élément qui ne correspondent pas à auteur ou éditeur",
		},
		affiliated_tooltips: {
			add: "Ajouter un affilié",
			remove: "Supprimer l'affilié",
		},
		publisher_label: "Éditeur",
		publisher_location_label: "Lieu de publication",
		location_label: {
			name: "Lieu",
			description:
				"lieu où une entrée est physiquement située ou a eu lieu. Pour le lieu où un élément a été publié, voir éditeur.",
		},
		organization_label: {
			name: "Organisation",
			description: "Organisation pour/à laquelle l'élément a été produit",
		},
		issue_label: {
			name: "Numéro",
			description:
				"Pour un élément dont le parent a plusieurs numéros, indique la position dans la séquence des numéros. Également utilisé pour indiquer le numéro d'épisode pour la télévision.",
		},
		volume_label: {
			name: "Volume",
			description:
				"Pour un élément dont le parent a plusieurs volumes/parties/saisons… dont cet élément fait partie",
		},
		total_placeholder: "total",
		edition_label: "Édition",
		page_range_label: "Plage de pages",
		time_range_label: "Plage horaire",
		runtime_label: "Durée",
		url_label: "URL",
		accessed_label: "Consulté le",
		serial_number_label: "Numéro de série",
		language_label: "Langue",
		archive_label: {
			name: "Archive",
			description: "nom de l'institution/collection où l'article est conservé",
		},
		archive_location_label: "Emplacement de l'archive",
		call_number_label: {
			name: "Cote",
			description:
				"Le numéro de l'article dans une bibliothèque, une institution ou une collection.",
		},
		note_label: "Note",
		parent_label: "Parent",
		add_parent: "Ajouter un parent",
	},
	person_with_role: {
		role_label: "Rôle",
		roles: {
			afterword: "Postface",
			annotator: "Annotateur",
			"cast-member": "Membre de la distribution",
			cinematography: "Cinématographie",
			collaborator: "Collaborateur",
			commentator: "Commentateur",
			compiler: "Compilateur",
			composer: "Compositeur",
			director: "Réalisateur",
			"executive-producer": "Producteur exécutif",
			foreword: "Avant-propos",
			founder: "Fondateur",
			holder: "Détenteur",
			illustrator: "Illustrateur",
			introduction: "Introduction",
			narrator: "Narrateur",
			organizer: "Organisateur",
			producer: "Producteur",
			translator: "Traducteur",
			writer: "Auteur",
		},
		names_label: "Noms",
		names_tooltips: {
			add: "Ajouter un nom",
			remove: "Supprimer le nom",
		},
	},
	person: {
		name_label: "Nom",
		given_name_label: "Prénom",
		prefix_label: "Préfixe",
		suffix_label: "Suffixe",
		alias_label: "Alias",
		collapsed_tooltip: "Champs de nom réduits",
		expanded_tooltip: "Champs de nom étendus",
	},
});

function plural(singular: string, plural: string): Plural {
	return (n) => (n === 1 ? singular : plural);
}
