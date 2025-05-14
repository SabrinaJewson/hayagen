import { type SetStoreFunction, createStore } from "solid-js/store";
import YAML from "yaml";
import "./App.css";
import {
	For,
	type JSX,
	Match,
	Show,
	Switch,
	createEffect,
	createSignal,
	onMount,
} from "solid-js";
import LANGS from "./langs.tsx";
import { type Lang, translations } from "./translations";
import {
	type EntryType,
	type Label,
	type LabelFields,
	type ListTooltips,
	type Plural,
	type Role,
	type Translation,
	entry_types,
	roles,
} from "./translations/definition";

const i18n: Translation = translations[document.documentElement.lang as Lang];

export default function (): JSX.Element {
	const [label, set_label] = createSignal<string>("");
	const [data, set_data] = createStore<EntryData>(default_entry_data());
	const [form, set_form] = createSignal<HTMLFormElement>();
	const [yaml, set_yaml] = createSignal<string>("");
	createEffect(() => {
		// checkValidity is not reactive, so we need to always read all the data.
		const label_clone = label() || "label";
		const data_clone = read_recursive(data);
		const form_ = form();
		if (form_ === undefined) return;

		// When e.g. pressing buttons makes the form invalid (for example, going from one to two
		// authors), this memo gets updated before the DOM does, so we end up generating invalid
		// YAML. Thus we delay a bit.
		requestAnimationFrame(() => {
			if (!form_?.checkValidity()) {
				set_yaml("");
			} else {
				set_yaml(make_yaml(label_clone, data_clone));
			}
		});
	});
	return (
		<>
			<form ref={(f) => onMount(() => set_form(f))}>
				<p>
					<button
						type="button"
						onclick={() => {
							const new_data = default_entry_data();
							new_data.type = data.type;
							set_data(new_data);
						}}
					>
						{i18n.clear_fields}
					</button>{" "}
					<button
						type="button"
						onclick={async () => await navigator.clipboard.writeText(yaml())}
					>
						{i18n.copy_yaml}
					</button>
				</p>
				<TextInput label={i18n.label_label} data={label()} set={set_label} />
				<Entry data={data} set={set_data} />
			</form>
			<pre>{yaml()}</pre>
		</>
	);
}

function read_recursive<T>(data: T): T {
	if (Array.isArray(data)) {
		return data.map(read_recursive) as T;
	}
	if (data instanceof Object) {
		return Object.fromEntries(
			Object.entries(data).map(([k, v]) => [k, read_recursive(v)]),
		) as T;
	}
	return data;
}

const default_parents: Map<EntryType, EntryType> = new Map([
	["article", "periodical"],
	["chapter", "book"],
	["entry", "reference"],
	["anthos", "anthology"],
	["web", "web"],
	["scene", "video"],
	["artwork", "exhibition"],
	["legislation", "anthology"],
	["post", "post"],
	["video", "video"],
	["audio", "audio"],
]);

type EntryData = {
	type: EntryType;
	title: string;
	author: Person[];
	date: string;
	parent: EntryData | null;
	abstract: string;
	genre: string;
	editor: Person[];
	affiliated: PersonWithRole[];
	call_number: string;
	publisher: Publisher;
	location: string;
	organization: string;
	issue: string;
	volume: string;
	volume_total: string;
	edition: string;
	page_range: string;
	page_total: string;
	time_range: string;
	runtime: string;
	url: Url;
	serial_number: SerialNumber;
	language: string;
	archive: string;
	archive_location: string;
	note: string;
};

function default_entry_data(): EntryData {
	return {
		type: "misc",
		title: "",
		author: [default_person()],
		date: "",
		parent: null,
		abstract: "",
		genre: "",
		editor: [default_person()],
		affiliated: [],
		call_number: "",
		publisher: { name: "", location: "" },
		location: "",
		organization: "",
		issue: "",
		volume: "",
		volume_total: "",
		edition: "",
		page_range: "",
		page_total: "",
		time_range: "",
		runtime: "",
		url: { value: "", date: "" },
		serial_number: {
			serial: "",
			...Object.fromEntries(serial_kinds.map((k) => [k, ""])),
		},
		language: "",
		archive: "",
		archive_location: "",
		note: "",
	};
}

type Person = PersonCombined | PersonFields;
const person_combined: unique symbol = Symbol();
const person_fields: unique symbol = Symbol();
type PersonCombined = { kind: typeof person_combined; combined_name: string };
type PersonFields = {
	kind: typeof person_fields;
	name: string;
	given_name: string;
	prefix: string;
	suffix: string;
	alias: string;
};

function default_person(): Person {
	return {
		kind: person_combined,
		combined_name: "",
	};
}

function toggle_person(p: Person): Person {
	switch (p.kind) {
		case person_fields: {
			const prefix = p.prefix && `${p.prefix} `;
			const given_name = p.given_name && `, ${p.given_name}`;
			const suffix = p.suffix && `, ${p.suffix}`;
			return {
				kind: person_combined,
				combined_name: `${prefix}${p.name}${given_name}${suffix}`,
			};
		}
		case person_combined: {
			return {
				kind: person_fields,
				name: p.combined_name,
				given_name: "",
				prefix: "",
				suffix: "",
				alias: "",
			};
		}
	}
}

type PersonWithRole = {
	role: Role | "";
	names: Person[];
};

type Publisher = {
	name: string;
	location: string;
};

type Url = {
	value: string;
	date: string;
};

const serial_kinds = ["doi", "isbn", "issn", "pmid", "pmcid", "arxiv"];
type SerialKind = (typeof serial_kinds)[number];
type SerialNumber = { serial: string } & {
	[k in SerialKind]: string;
};

function make_yaml(label: string, data: EntryData): string {
	function try_numeric(s: string): number | string {
		if (/^[0-9]+$/.test(s)) {
			return Number.parseInt(s);
		}
		return s;
	}

	function maybe_unwrap<T>(array: T[]): T | T[] {
		if (array.length === 1) {
			return array[0];
		}
		return array;
	}

	function preprocess(data: EntryData): Record<string, unknown> {
		const new_data: Record<string, unknown> = {
			...data,
			parent: data.parent !== null ? preprocess(data.parent) : null,
			author: maybe_unwrap(data.author.map(preprocess_person)),
			editor: maybe_unwrap(data.editor.map(preprocess_person)),
			affiliated: data.affiliated.map(({ role, names }) => ({
				role,
				names: maybe_unwrap(names.map(preprocess_person)),
			})),
			issue: try_numeric(data.issue),
			volume: try_numeric(data.volume),
			edition: try_numeric(data.edition),
			volume_total: try_numeric(data.volume_total),
			page_total: try_numeric(data.page_total),
			page_range: try_numeric(data.page_range),
			serial_number: serial_kinds.some((k) => data.serial_number[k] !== "")
				? data.serial_number
				: data.serial_number.serial,
			publisher:
				data.publisher.name === ""
					? ""
					: data.publisher.location === ""
						? data.publisher.name
						: { ...data.publisher },
			url:
				data.url.value === ""
					? ""
					: data.url.date === ""
						? data.url.value
						: data.url,
		};
		if (new_data.archive === "") {
			// biome-ignore lint/performance/noDelete: no other way to write this code
			delete new_data.archive_location;
			// biome-ignore lint/performance/noDelete: no other way to write this code
			delete new_data.call_number;
		}
		return new_data;
	}
	function preprocess_person(person: Person): unknown {
		if (person.kind === person_combined) {
			return person.combined_name;
		}
		const person2: Record<string, unknown> = { ...person };
		// biome-ignore lint/performance/noDelete: shortest way to write this code
		delete person2.combined_name;
		// biome-ignore lint/performance/noDelete: shortest way to write this code
		delete person2.kind;
		return person2;
	}

	return YAML.stringify({ [label]: preprocess(data) }, (_, v) => {
		if (v === "") return;
		if (v === null) return;
		if (Array.isArray(v) && v.length === 0) return;
		if (!Array.isArray(v) && v instanceof Object) {
			return Object.fromEntries(
				Object.entries(v).map(([k, v]) => [k.replace(/_/g, "-"), v]),
			);
		}
		return v;
	});
}

const DATE_REGEX: string = "-?[0-9]{4}(-[01][0-9](-[0-3][0-9])?)?";
const TIMESTAMP_REGEX: string = "(([0-9]+:)?[0-9]+:)?[0-9]+:[0-9]+(,[0-9]+)?";
const TIMESTAMP_RANGE_REGEX: string = `${TIMESTAMP_REGEX}-${TIMESTAMP_REGEX}`;

function Entry(props: {
	data: EntryData;
	set: SetStoreFunction<EntryData>;
	del?: () => void;
}): JSX.Element {
	return (
		<fieldset>
			<EnumInput
				label={i18n.entry.type_label}
				values={entry_types}
				data={props.data.type}
				set={(t) => props.set("type", t)}
				display={(t) => i18n.entry.types[t]}
			>
				<Show when={props.del !== undefined}>
					<button type="button" title={i18n.delete_tooltip} onclick={props.del}>
						×
					</button>
				</Show>
			</EnumInput>
			<TextInput
				label={i18n.entry.title_label}
				data={props.data.title}
				set={(v) => props.set("title", v)}
			/>
			<ListInput
				label={i18n.entry.author_label}
				data={props.data.author}
				default={default_person()}
				set={child_setter(props.set, "author")}
				EntryInput={PersonInput}
				tooltips={i18n.entry.author_tooltips}
			/>
			<TextInput
				label={i18n.entry.date_label}
				data={props.data.date}
				set={(v) => props.set("date", v)}
				placeholder="2008-01-24"
				pattern={DATE_REGEX}
				title={i18n.format_tooltips.date}
			/>
			<TextInput
				label={i18n.entry.abstract_label}
				data={props.data.abstract}
				set={(v) => props.set("abstract", v)}
			/>
			<TextInput
				label={i18n.entry.genre_label}
				data={props.data.genre}
				set={(v) => props.set("genre", v)}
			/>
			<ListInput
				label={i18n.entry.editor_label}
				data={props.data.editor}
				default={default_person()}
				set={child_setter(props.set, "editor")}
				EntryInput={PersonInput}
				tooltips={i18n.entry.editor_tooltips}
			/>
			<ListInput
				label={i18n.entry.affiliated_label}
				data={props.data.affiliated}
				default={{ role: "", names: [default_person()] }}
				allow_empty
				set={child_setter(props.set, "affiliated")}
				EntryInput={PersonWithRoleInput}
				tooltips={i18n.entry.affiliated_tooltips}
			/>
			<TextInput
				label={{ ...label_fields(i18n.entry.publisher_label), extra: true }}
				data={props.data.publisher.name}
				set={(v) => props.set("publisher", "name", v)}
			/>
			<Show when={props.data.publisher.name !== ""}>
				<div class="indent">
					<TextInput
						label={i18n.entry.publisher_location_label}
						data={props.data.publisher.location}
						set={(v) => props.set("publisher", "location", v)}
					/>
				</div>
			</Show>
			<TextInput
				label={i18n.entry.location_label}
				data={props.data.location}
				set={(v) => props.set("location", v)}
			/>
			<TextInput
				label={i18n.entry.organization_label}
				data={props.data.organization}
				set={(v) => props.set("organization", v)}
			/>
			<TextInput
				label={i18n.entry.issue_label}
				data={props.data.issue}
				set={(v) => props.set("issue", v)}
			/>
			<TextInput
				label={i18n.entry.volume_label}
				data={props.data.volume}
				set={(v) => props.set("volume", v)}
			>
				(
				<input
					type="number"
					min="0"
					placeholder={i18n.entry.total_placeholder}
					value={props.data.volume_total}
					oninput={(e) => props.set("volume_total", e.target.value)}
				/>
				)
			</TextInput>
			<TextInput
				label={i18n.entry.edition_label}
				data={props.data.edition}
				set={(v) => props.set("edition", v)}
			/>
			<TextInput
				label={i18n.entry.page_range_label}
				data={props.data.page_range}
				set={(v) => props.set("page_range", v)}
			>
				(
				<input
					type="number"
					min="0"
					placeholder={i18n.entry.total_placeholder}
					value={props.data.page_total}
					oninput={(e) => props.set("page_total", e.target.value)}
				/>
				)
			</TextInput>
			<TextInput
				label={i18n.entry.time_range_label}
				data={props.data.time_range}
				set={(v) => props.set("time_range", v)}
				pattern={TIMESTAMP_RANGE_REGEX}
				title={i18n.format_tooltips.range}
				placeholder="04:00-07:52"
			/>
			<TextInput
				label={i18n.entry.runtime_label}
				data={props.data.runtime}
				set={(v) => props.set("runtime", v)}
				pattern={TIMESTAMP_REGEX}
				title={i18n.format_tooltips.timestamp}
				placeholder="01:25:03"
			/>
			<TextInput
				label={{ ...label_fields(i18n.entry.url_label), extra: true }}
				data={props.data.url.value}
				set={(v) => props.set("url", "value", v)}
			/>
			<Show when={props.data.url.value !== ""}>
				<div class="indent">
					<TextInput
						label={i18n.entry.accessed_label}
						data={props.data.url.date}
						set={(v) => props.set("url", "date", v)}
						pattern={DATE_REGEX}
						title={i18n.format_tooltips.date}
					/>
				</div>
			</Show>
			<SerialNumberInput
				label={i18n.entry.serial_number_label}
				data={props.data.serial_number}
				set={child_setter(props.set, "serial_number")}
			/>
			<EnumInput
				label={i18n.entry.language_label}
				values={["", ...LANGS.keys()]}
				data={props.data.language}
				set={(v) => props.set("language", v)}
				display={(v) => LANGS.get(v) ?? ""}
			/>
			<TextInput
				label={{ ...label_fields(i18n.entry.archive_label), extra: true }}
				data={props.data.archive}
				set={(v) => props.set("archive", v)}
			/>
			<Show when={props.data.archive !== ""}>
				<div class="indent">
					<TextInput
						label={i18n.entry.archive_location_label}
						data={props.data.archive_location}
						set={(v) => props.set("archive_location", v)}
					/>
					<TextInput
						label={i18n.entry.call_number_label}
						data={props.data.call_number}
						set={(v) => props.set("call_number", v)}
					/>
				</div>
			</Show>
			<TextInput
				label={i18n.entry.note_label}
				data={props.data.note}
				set={(v) => props.set("note", v)}
			/>
			<div class="row">
				<LabelDisplay label={i18n.entry.parent_label} />
				<Show when={props.data.parent === null}>
					<button
						type="button"
						onclick={() => {
							const data = default_entry_data();
							data.type = default_parents.get(props.data.type) ?? "misc";
							props.set("parent", data);
						}}
					>
						{i18n.entry.add_parent}
					</button>
				</Show>
			</div>
			<Show when={props.data.parent !== null}>
				<Entry
					data={props.data.parent!}
					set={child_setter(props.set, "parent") as SetStoreFunction<EntryData>}
					del={() => props.set("parent", null)}
				/>
			</Show>
		</fieldset>
	);
}

function ListInput<T, L extends string | Plural>(props: {
	label: Label<L>;
	data: T[];
	default: T;
	allow_empty?: L extends string ? never : true;
	set: SetStoreFunction<T[]>;
	EntryInput: (props: {
		label?: Label;
		data: T;
		set: SetStoreFunction<T>;
		children?: JSX.Element;
		with_focus: (focus: () => void) => void;
		required: boolean;
	}) => JSX.Element;
	children?: JSX.Element;
	required?: boolean;
	tooltips: ListTooltips;
}): JSX.Element {
	let focusers: (() => void)[] = [];
	const label = () => {
		const label = label_fields(props.label);
		return typeof label.name === "string"
			? label.name
			: label.name(props.data.length);
	};
	return (
		<Switch>
			<Match when={props.data.length === 0}>
				<div class="row">
					<LabelDisplay label={label()} />
					<span class="grow-me" />
					<button
						type="button"
						title={props.tooltips.add}
						onclick={() => {
							props.set(0, props.default);
							focusers[0]?.();
						}}
					>
						+
					</button>
					{props.children}
				</div>
			</Match>
			<Match when={props.data.length === 1 && !props.allow_empty}>
				<props.EntryInput
					label={label()}
					data={props.data[0]}
					set={child_setter(props.set, 0)}
					with_focus={(f) => {
						focusers[0] = f;
					}}
					required={props.required || false}
				>
					<button
						type="button"
						title={props.tooltips.add}
						onclick={() => {
							props.set(1, props.default);
							focusers[1]?.();
						}}
					>
						+
					</button>
					<Show when={props.allow_empty}>
						<button
							type="button"
							title={props.tooltips.remove}
							onclick={() => {
								props.set([]);
								focusers = [];
							}}
						>
							-
						</button>
					</Show>
					{props.children}
				</props.EntryInput>
			</Match>
			<Match when={props.data.length >= 1}>
				<div class="row">
					<LabelDisplay label={label()} />
					<span class="grow-me" />
					{props.children}
				</div>
				<ul>
					<For each={props.data}>
						{(el, i) => (
							<li>
								<props.EntryInput
									data={el}
									set={child_setter(props.set, i())}
									with_focus={(f) => {
										focusers[i()] = f;
									}}
									required
								>
									<button
										type="button"
										title={props.tooltips.add}
										onclick={() => {
											props.set((a) => [
												...a.slice(0, i() + 1),
												props.default,
												...a.slice(i() + 1),
											]);
											focusers[i() + 1]?.();
										}}
									>
										+
									</button>
									<button
										type="button"
										title={props.tooltips.remove}
										onclick={() => {
											props.set((a) => [
												...a.slice(0, i()),
												...a.slice(i() + 1),
											]);
											focusers.pop();
											if (i() === focusers.length) {
												focusers[i() - 1]?.();
											} else {
												focusers[i()]?.();
											}
										}}
									>
										-
									</button>
								</props.EntryInput>
							</li>
						)}
					</For>
				</ul>
			</Match>
		</Switch>
	);
}

function PersonInput(props: {
	label?: Label;
	data: Person;
	set: SetStoreFunction<Person>;
	children?: JSX.Element;
	with_focus?: (focus: () => void) => void;
	required?: boolean;
}): JSX.Element {
	const left_arrow = (
		<svg viewBox="0 0 2 2">
			<title>{i18n.person.collapsed_tooltip}</title>
			<polygon fill="currentColor" points="0,1 2,0 2,2" />
		</svg>
	);
	const down_arrow = (
		<svg viewBox="0 0 2 2">
			<title>{i18n.person.expanded_tooltip}</title>
			<polygon fill="currentColor" points="0,0 2,0 1,2" />
		</svg>
	);

	const toggle = (
		<button type="button" onclick={() => props.set(toggle_person)}>
			{props.data.kind === person_combined ? left_arrow : down_arrow}
		</button>
	);

	return (
		<Switch>
			<Match when={props.data.kind === person_combined}>
				<TextInput
					label={props.label}
					data={(props.data as PersonCombined).combined_name}
					set={(v) => props.set({ combined_name: v })}
					with_focus={props.with_focus}
					required={props.required}
				>
					{toggle}
					{props.children}
				</TextInput>
			</Match>
			<Match when={props.data.kind === person_fields}>
				<PersonFieldsInput
					label={props.label}
					data={props.data as PersonFields}
					set={props.set as SetStoreFunction<PersonFields>}
					with_focus={props.with_focus}
				>
					{toggle}
					{props.children}
				</PersonFieldsInput>
			</Match>
		</Switch>
	);
}

function PersonFieldsInput(props: {
	label?: Label;
	data: PersonFields;
	set: SetStoreFunction<PersonFields>;
	children?: JSX.Element;
	with_focus?: (focus: () => void) => void;
}): JSX.Element {
	return (
		<>
			<Show when={props.label !== undefined}>
				<div class="row">
					<LabelDisplay label={props.label!} />
					<span class="grow-me" />
					{props.children}
				</div>
			</Show>
			<div class={props.label !== undefined ? "indent" : ""}>
				<TextInput
					label={i18n.person.prefix_label}
					data={props.data.prefix}
					set={(v) => props.set("prefix", v)}
				/>
				<TextInput
					label={i18n.person.given_name_label}
					data={props.data.given_name}
					set={(v) => props.set("given_name", v)}
				/>
				<TextInput
					label={i18n.person.name_label}
					data={props.data.name}
					set={(v) => props.set("name", v)}
					with_focus={props.with_focus}
					required
				>
					<Show when={props.label === undefined}>{props.children}</Show>
				</TextInput>
				<TextInput
					label={i18n.person.suffix_label}
					data={props.data.suffix}
					set={(v) => props.set("suffix", v)}
				/>
				<TextInput
					label={i18n.person.alias_label}
					data={props.data.alias}
					set={(v) => props.set("alias", v)}
				/>
			</div>
		</>
	);
}

function PersonWithRoleInput(props: {
	label?: Label;
	data: PersonWithRole;
	set: SetStoreFunction<PersonWithRole>;
	children?: JSX.Element;
}): JSX.Element {
	return (
		<>
			<Show when={props.label !== undefined}>
				<div class="row">
					<LabelDisplay label={props.label!} />
					<span class="grow-me" />
					{props.children}
				</div>
			</Show>
			<div class={props.label !== undefined ? "indent" : ""}>
				<EnumInput
					label={i18n.person_with_role.role_label}
					values={roles}
					data={props.data.role}
					set={(v) => props.set("role", v)}
					display={(r) => (r === "" ? "" : i18n.person_with_role.roles[r])}
					required
				>
					<Show when={props.label === undefined}>{props.children}</Show>
				</EnumInput>
				<ListInput
					label={i18n.person_with_role.names_label}
					data={props.data.names}
					default={default_person()}
					set={child_setter(props.set, "names")}
					EntryInput={PersonInput}
					required
					tooltips={i18n.person_with_role.names_tooltips}
				/>
			</div>
		</>
	);
}

function SerialNumberInput(props: {
	label: Label;
	data: SerialNumber;
	set: SetStoreFunction<SerialNumber>;
	children?: JSX.Element;
}): JSX.Element {
	return (
		<>
			<TextInput
				label={props.label}
				data={props.data.serial}
				set={(v) => props.set("serial", v)}
			>
				{props.children}
			</TextInput>
			<div class="indent">
				<For each={serial_kinds}>
					{(serial_kind) => (
						<TextInput
							label={
								serial_kind === "arxiv" ? "arXiv" : serial_kind.toUpperCase()
							}
							data={props.data[serial_kind]}
							set={(v) => props.set(serial_kind, v)}
							change={(v) => {
								for (const s of SERIAL_STRIP) {
									if (v.startsWith(s)) {
										props.set(serial_kind, v.slice(s.length));
									}
								}
							}}
						/>
					)}
				</For>
			</div>
		</>
	);
}

const SERIAL_STRIP = [
	"https://doi.org/",
	"https://dx.doi.org/",
	"https://arxiv.org/abs/",
];

function TextInput(props: {
	label?: Label;
	data: string;
	set: (s: string) => void;
	change?: (s: string) => void;
	children?: JSX.Element;
	required?: boolean;
	with_focus?: (focus: () => void) => void;
	placeholder?: string;
	pattern?: string;
	title?: string;
}): JSX.Element {
	return (
		<div class="row">
			<MaybeLabel label={props.label}>
				<input
					type="text"
					value={props.data}
					oninput={(e) => props.set(e.target.value)}
					onchange={(e) => props.change?.(e.target.value)}
					required={props.required}
					ref={(e) => props.with_focus?.(() => e.focus())}
					placeholder={props.placeholder}
					pattern={props.pattern}
					title={props.title}
				/>
			</MaybeLabel>
			{props.children}
		</div>
	);
}

function EnumInput<T extends string>(props: {
	label?: Label;
	values: readonly T[];
	data: T;
	set: (s: T) => void;
	display: (s: T) => string;
	children?: JSX.Element;
	required?: boolean;
}): JSX.Element {
	return (
		<div class="row">
			<MaybeLabel label={props.label}>
				<select
					value={props.data}
					oninput={(e) => props.set(e.target.value as T)}
					required={props.required}
				>
					<For each={props.values}>
						{(option) => (
							<option value={option}>{props.display(option)}</option>
						)}
					</For>
				</select>
			</MaybeLabel>
			{props.children}
		</div>
	);
}

function MaybeLabel(props: {
	label?: Label;
	children: JSX.Element;
}): JSX.Element {
	return (
		<Show when={props.label !== undefined} fallback={props.children}>
			{/* biome-ignore lint/a11y/noLabelWithoutControl: ensured by caller */}
			<label>
				<LabelDisplay label={props.label!} />
				{props.children}
			</label>
		</Show>
	);
}

function label_fields<L extends string | Plural>(
	label: Label<L>,
): LabelFields<L> {
	return typeof label === "string" || label instanceof Function
		? { name: label as L }
		: label;
}

function LabelDisplay(props: {
	label: Label;
}): JSX.Element {
	const fields = () => label_fields(props.label);
	const [help_shown, set_help_shown] = createSignal(false);
	return (
		<>
			{fields().name}
			<Show when={fields().description}>
				<span
					class="help"
					onclick={() => set_help_shown(!help_shown())}
					onmouseover={() => set_help_shown(true)}
					onmouseout={() => set_help_shown(false)}
				>
					?
				</span>
				<div class="help-popup">
					<div class={help_shown() ? "shown" : ""}>{fields().description}</div>
				</div>
			</Show>
			<Show when={fields().extra}>
				<span class="extra" title={i18n.extra_tooltip}>
					+
				</span>
			</Show>
		</>
	);
}

function child_setter<O, K extends keyof O>(
	setter: SetStoreFunction<O>,
	field: K,
): SetStoreFunction<O[K]> {
	// @ts-ignore
	return setter.bind(null, field);
}
