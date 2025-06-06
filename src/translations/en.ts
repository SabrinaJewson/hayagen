import { type Plural, translation } from "./definition";

export default translation({
	language_name: "English",
	title: (link) => `${link("Hayagriva")} generator`,
	clear_fields: "Clear fields",
	copy_yaml: "Copy yaml",
	label_label: {
		name: "Label",
		description: "how the item will be referenced in Typst",
	},
	delete_tooltip: "Delete this entry",
	extra_tooltip: "There are additional fields associated to this entry",
	format_tooltips: {
		date: "YYYY-MM-DD, YYYY-MM or YYYY",
		timestamp: "MM:SS (full format: DD:HH:MM:SS,msms)",
		range: "MM:SS-MM:SS (full format: DD:HH:MM:SS,msms)",
	},
	entry: {
		type_label: "Type",
		types: {
			anthology: "Anthology",
			anthos: "Anthos",
			article: "Article",
			artwork: "Artwork",
			audio: "Audio",
			blog: "Blog",
			book: "Book",
			case: "Case",
			chapter: "Chapter",
			conference: "Conference",
			entry: "Entry",
			exhibition: "Exhibition",
			legislation: "Legislation",
			manuscript: "Manuscript",
			misc: "Misc",
			newspaper: "Newspaper",
			original: "Original",
			patent: "Patent",
			performance: "Performance",
			periodical: "Periodical",
			post: "Post",
			proceedings: "Proceedings",
			reference: "Reference",
			report: "Report",
			repository: "Repository",
			scene: "Scene",
			thesis: "Thesis",
			thread: "Thread",
			video: "Video",
			web: "Web",
		},
		title_label: "Title",
		author_label: plural("Author", "Authors"),
		author_tooltips: {
			add: "Add author",
			remove: "Remove author",
		},
		date_label: "Date",
		abstract_label: "Abstract",
		genre_label: {
			name: "Genre",
			description:
				"Type, class, or subtype of the item (e.g. “Doctoral dissertation” for a PhD thesis; “NIH Publication” for an NIH technical report). Do not use for topical descriptions or categories (e.g. “adventure” for an adventure movie).",
		},
		editor_label: plural("Editor", "Editors"),
		editor_tooltips: {
			add: "Add editor",
			remove: "Remove editor",
		},
		affiliated_label: {
			name: plural("Affiliated", "Affiliated"),
			description:
				"persons involved with the item that do not fit author or editor",
		},
		affiliated_tooltips: {
			add: "Add affiliated",
			remove: "Remove affiliated",
		},
		publisher_label: "Publisher",
		publisher_location_label: "Publisher location",
		location_label: {
			name: "Location",
			description:
				"location at which an entry is physically located or took place. For the location where an item was published, see publisher.",
		},
		organization_label: {
			name: "Organization",
			description: "Organization at/for which the item was produced",
		},
		issue_label: {
			name: "Issue",
			description:
				"For an item whose parent has multiple issues, indicates the position in the issue sequence. Also used to indicate the episode number for TV.",
		},
		volume_label: {
			name: "Volume",
			description:
				"For an item whose parent has multiple volumes/parts/seasons… of which this item is one",
		},
		total_placeholder: "total",
		edition_label: "Edition",
		page_range_label: "Page range",
		time_range_label: "Time range",
		runtime_label: "Runtime",
		url_label: "URL",
		accessed_label: "Accessed",
		serial_number_label: "Serial number",
		language_label: "Language",
		archive_label: {
			name: "Archive",
			description: "name of the institution/collection where the item is kept",
		},
		archive_location_label: "Archive location",
		call_number_label: {
			name: "Call number",
			description:
				"The number of the item in a library, institution, or collection.",
		},
		note_label: "Note",
		parent_label: "Parent",
		add_parent: "Add parent",
	},
	person_with_role: {
		role_label: "Role",
		roles: {
			afterword: "Afterword",
			annotator: "Annotator",
			"cast-member": "Cast member",
			cinematography: "Cinematography",
			collaborator: "Collaborator",
			commentator: "Commentator",
			compiler: "Compiler",
			composer: "Composer",
			director: "Director",
			"executive-producer": "Executive producer",
			foreword: "Foreword",
			founder: "Founder",
			holder: "Holder",
			illustrator: "Illustrator",
			introduction: "Introduction",
			narrator: "Narrator",
			organizer: "Organizer",
			producer: "Producer",
			translator: "Translator",
			writer: "Writer",
		},
		names_label: "Names",
		names_tooltips: {
			add: "Add name",
			remove: "Remove name",
		},
	},
	person: {
		name_label: "Name",
		given_name_label: "Given name",
		prefix_label: "Prefix",
		suffix_label: "Suffix",
		alias_label: "Alias",
		collapsed_tooltip: "Collapsed name fields",
		expanded_tooltip: "Expanded name fields",
	},
});

function plural(singular: string, plural: string): Plural {
	return (n) => (n === 1 ? singular : plural);
}
