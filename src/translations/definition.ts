// Identity function to provide type hints.
export function translation(t: Translation): Translation {
	return t;
}

export type Translation = {
	language_name: string;
	title: (link: (s: string) => string) => string;
	clear_fields: string;
	copy_yaml: string;
	label_label: LabelWithDesc;
	delete_tooltip: string;
	extra_tooltip: string;
	format_tooltips: {
		date: string;
		timestamp: string;
		range: string;
	};
	entry: {
		type_label: Label;
		types: { [type in EntryType]: string };
		title_label: Label;
		author_label: Label<Plural>;
		date_label: Label;
		abstract_label: Label;
		genre_label: Label;
		editor_label: Label<Plural>;
		affiliated_label: Label<Plural>;
		publisher_label: Label;
		publisher_location_label: Label;
		location_label: Label;
		organization_label: Label;
		issue_label: Label;
		volume_label: Label;
		total_placeholder: string;
		edition_label: Label;
		page_range_label: Label;
		time_range_label: Label;
		runtime_label: Label;
		url_label: Label;
		accessed_label: Label;
		serial_number_label: Label;
		language_label: Label;
		archive_label: Label;
		archive_location_label: Label;
		call_number_label: Label;
		note_label: Label;
		parent_label: Label;
		add_parent: string;
	};
	person_with_role: {
		role_label: Label;
		roles: { [role in Role]: string };
		names_label: Label;
	};
	person: {
		name_label: Label;
		given_name_label: Label;
		prefix_label: Label;
		suffix_label: Label;
		alias_label: Label;
		collapsed_tooltip: string;
		expanded_tooltip: string;
	};
};

export type LabelWithDesc = {
	name: string;
	description: string;
};

export const entry_types = [
	"anthology",
	"anthos",
	"article",
	"artwork",
	"audio",
	"blog",
	"book",
	"case",
	"chapter",
	"conference",
	"entry",
	"exhibition",
	"legislation",
	"manuscript",
	"misc",
	"newspaper",
	"original",
	"patent",
	"performance",
	"periodical",
	"post",
	"proceedings",
	"reference",
	"report",
	"repository",
	"scene",
	"thesis",
	"thread",
	"video",
	"web",
] as const;

export type EntryType = (typeof entry_types)[number];

export const roles = [
	"afterword",
	"annotator",
	"cast-member",
	"cinematography",
	"collaborator",
	"commentator",
	"compiler",
	"composer",
	"director",
	"executive-producer",
	"foreword",
	"founder",
	"holder",
	"illustrator",
	"introduction",
	"narrator",
	"organizer",
	"producer",
	"translator",
	"writer",
] as const;

export type Role = (typeof roles)[number];

export type Label<T = string> = T | LabelFields<T>;

export type LabelFields<T = string> = {
	name: T;
	description?: string;
	// Not to be used in translations.
	extra?: boolean;
};

export type Plural = (n: number) => string;
