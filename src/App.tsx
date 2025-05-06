import { createStore, SetStoreFunction } from "solid-js/store";
import YAML from "yaml";
import "./App.css";
import {
	createEffect,
	createSignal,
	For,
	JSX,
	Match,
	onMount,
	Show,
	Switch,
} from "solid-js";
import LANGS from "./langs.tsx";

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
						Clear fields
					</button>{" "}
					<button
						type="button"
						onclick={async () => await navigator.clipboard.writeText(yaml())}
					>
						Copy yaml
					</button>
				</p>
				<TextInput
					label={{
						name: "Label",
						description: "how the item will be referenced in Typst",
					}}
					data={label()}
					set={set_label}
				></TextInput>
				<Entry data={data} set={set_data} />
			</form>
			<pre>{yaml()}</pre>
		</>
	);
}

function read_recursive<T>(data: T): T {
	if (Array.isArray(data)) {
		return data.map(read_recursive) as T;
	} else if (data instanceof Object) {
		return Object.fromEntries(
			Object.entries(data).map(([k, v]) => [k, read_recursive(v)]),
		) as T;
	}
	return data;
}

const types = [
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

type Type = (typeof types)[number];

const default_parents: Map<Type, Type> = new Map([
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
	type: Type;
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
	if (p.kind === person_fields) {
		return {
			kind: person_combined,
			combined_name: `${p.prefix && p.prefix + " "}${p.name}${p.given_name && ", " + p.given_name}${p.suffix && ", " + p.suffix}`,
		};
	} else {
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

type PersonWithRole = {
	role: Role | "";
	names: Person[];
};

const roles = [
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

type Role = (typeof roles)[number];

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
			return parseInt(s);
		} else {
			return s;
		}
	}

	function maybe_unwrap<T>(array: T[]): T | T[] {
		if (array.length === 1) {
			return array[0];
		} else {
			return array;
		}
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
		if (new_data["archive"] === "") {
			delete new_data["archive_location"];
			delete new_data["call_number"];
		}
		return new_data;
	}
	function preprocess_person(person: Person): unknown {
		if (person.kind === person_combined) {
			return person.combined_name;
		} else {
			const person2: Record<string, unknown> = { ...person };
			delete person2["kind"];
			return person2;
		}
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
const DATE_TITLE: string = "YYYY-MM-DD, YYYY-MM or YYYY";

const TIMESTAMP_REGEX: string = "(([0-9]+:)?[0-9]+:)?[0-9]+:[0-9]+(,[0-9]+)?";
const TIMESTAMP_TITLE: string = "MM:SS (full format: DD:HH:MM:SS,msms)";

const TIMESTAMP_RANGE_REGEX: string = TIMESTAMP_REGEX + "-" + TIMESTAMP_REGEX;
const TIMESTAMP_RANGE_TITLE: string =
	"MM:SS-MM:SS (full format: DD:HH:MM:SS,msms)";

function Entry(props: {
	data: EntryData;
	set: SetStoreFunction<EntryData>;
	del?: () => void;
}): JSX.Element {
	return (
		<fieldset>
			<EnumInput
				label="Type"
				values={types}
				data={props.data.type}
				set={(t) => props.set("type", t)}
				display={(t) => t.slice(0, 1).toUpperCase() + t.slice(1)}
			>
				<Show when={props.del !== undefined}>
					<button type="button" title="Delete this entry" onclick={props.del}>
						×
					</button>
				</Show>
			</EnumInput>
			<TextInput
				label="Title"
				data={props.data.title}
				set={(v) => props.set("title", v)}
			/>
			<ListInput
				label="Author"
				plural="Authors"
				data={props.data.author}
				default={default_person()}
				set={child_setter(props.set, "author")}
				EntryInput={PersonInput}
			/>
			<TextInput
				label="Date"
				data={props.data.date}
				set={(v) => props.set("date", v)}
				placeholder="2008-01-24"
				pattern={DATE_REGEX}
				title={DATE_TITLE}
			/>
			<TextInput
				label="Abstract"
				data={props.data.abstract}
				set={(v) => props.set("abstract", v)}
			/>
			<TextInput
				label={{
					name: "Genre",
					description: `Type, class, or subtype of the item (e.g. “Doctoral dissertation” for a PhD thesis; “NIH Publication” for an NIH technical report). Do not use for topical descriptions or categories (e.g. “adventure” for an adventure movie).`,
				}}
				data={props.data.genre}
				set={(v) => props.set("genre", v)}
			/>
			<ListInput
				label="Editor"
				plural="Editors"
				data={props.data.editor}
				default={default_person()}
				set={child_setter(props.set, "editor")}
				EntryInput={PersonInput}
			/>
			<ListInput
				label={{
					name: "Affiliated",
					description:
						"persons involved with the item that do not fit author or editor",
				}}
				plural="Affiliated"
				data={props.data.affiliated}
				default={{ role: "", names: [default_person()] }}
				allow_empty
				set={child_setter(props.set, "affiliated")}
				EntryInput={PersonWithRoleInput}
			/>
			<TextInput
				label={{ name: "Publisher", extra: true }}
				data={props.data.publisher.name}
				set={(v) => props.set("publisher", "name", v)}
			/>
			<Show when={props.data.publisher.name !== ""}>
				<div class="indent">
					<TextInput
						label="Publisher location"
						data={props.data.publisher.location}
						set={(v) => props.set("publisher", "location", v)}
					/>
				</div>
			</Show>
			<TextInput
				label={{
					name: "Location",
					description:
						"location at which an entry is physically located or took place. For the location where an item was published, see publisher.",
				}}
				data={props.data.location}
				set={(v) => props.set("location", v)}
			/>
			<TextInput
				label={{
					name: "Organization",
					description: "Organization at/for which the item was produced",
				}}
				data={props.data.organization}
				set={(v) => props.set("organization", v)}
			/>
			<TextInput
				label={{
					name: "Issue",
					description:
						"For an item whose parent has multiple issues, indicates the position in the issue sequence. Also used to indicate the episode number for TV.",
				}}
				data={props.data.issue}
				set={(v) => props.set("issue", v)}
			/>
			<TextInput
				label={{
					name: "Volume",
					description:
						"For an item whose parent has multiple volumes/parts/seasons… of which this item is one",
				}}
				data={props.data.volume}
				set={(v) => props.set("volume", v)}
			>
				(
				<input
					type="number"
					min="0"
					placeholder="total"
					value={props.data.volume_total}
					oninput={(e) => props.set("volume_total", e.target.value)}
				/>
				)
			</TextInput>
			<TextInput
				label="Edition"
				data={props.data.edition}
				set={(v) => props.set("edition", v)}
			/>
			<TextInput
				label="Page range"
				data={props.data.page_range}
				set={(v) => props.set("page_range", v)}
			>
				(
				<input
					type="number"
					min="0"
					placeholder="total"
					value={props.data.page_total}
					oninput={(e) => props.set("page_total", e.target.value)}
				/>
				)
			</TextInput>
			<TextInput
				label="Time range"
				data={props.data.time_range}
				set={(v) => props.set("time_range", v)}
				pattern={TIMESTAMP_RANGE_REGEX}
				title={TIMESTAMP_RANGE_TITLE}
				placeholder="04:00-07:52"
			/>
			<TextInput
				label="Runtime"
				data={props.data.runtime}
				set={(v) => props.set("runtime", v)}
				pattern={TIMESTAMP_REGEX}
				title={TIMESTAMP_TITLE}
				placeholder="01:25:03"
			/>
			<TextInput
				label={{ name: "URL", extra: true }}
				data={props.data.url.value}
				set={(v) => props.set("url", "value", v)}
			/>
			<Show when={props.data.url.value !== ""}>
				<div class="indent">
					<TextInput
						label="Accessed"
						data={props.data.url.date}
						set={(v) => props.set("url", "date", v)}
						pattern={DATE_REGEX}
						title={DATE_TITLE}
					/>
				</div>
			</Show>
			<SerialNumberInput
				label="Serial number"
				data={props.data.serial_number}
				set={child_setter(props.set, "serial_number")}
			/>
			<EnumInput
				label="Language"
				values={["", ...LANGS.keys()]}
				data={props.data.language}
				set={(v) => props.set("language", v)}
				display={(v) => LANGS.get(v) ?? ""}
			/>
			<TextInput
				label={{
					name: "Archive",
					description:
						"name of the institution/collection where the item is kept",
					extra: true,
				}}
				data={props.data.archive}
				set={(v) => props.set("archive", v)}
			/>
			<Show when={props.data.archive !== ""}>
				<div class="indent">
					<TextInput
						label="Archive location"
						data={props.data.archive_location}
						set={(v) => props.set("archive_location", v)}
					/>
					<TextInput
						label={{
							name: "Call number",
							description:
								"The number of the item in a library, institution, or collection.",
						}}
						data={props.data.call_number}
						set={(v) => props.set("call_number", v)}
					/>
				</div>
			</Show>
			<TextInput
				label="Note"
				data={props.data.note}
				set={(v) => props.set("note", v)}
			/>
			<div class="row">
				Parent:
				<Show when={props.data.parent === null}>
					<button
						type="button"
						onclick={() => {
							const data = default_entry_data();
							data.type = default_parents.get(props.data.type) ?? "misc";
							props.set("parent", data);
						}}
					>
						Add parent
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

function ListInput<T>(props: {
	label: Label;
	plural: string;
	data: T[];
	default: T;
	allow_empty?: boolean;
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
}): JSX.Element {
	let focusers: (() => void)[] = [];
	let plural = () =>
		typeof props.label === "string"
			? props.plural
			: { name: props.plural, description: props.label.description };
	return (
		<Switch>
			<Match when={props.data.length === 0}>
				<div class="row">
					<Label label={plural()} />
					<span class="grow-me"></span>
					<button
						type="button"
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
					label={props.label}
					data={props.data[0]}
					set={child_setter(props.set, 0)}
					with_focus={(f) => (focusers[0] = f)}
					required={props.required || false}
				>
					<button
						type="button"
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
					<Label label={plural()} />
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
									with_focus={(f) => (focusers[i()] = f)}
									required
								>
									<button
										type="button"
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
	const toggle = (
		<button type="button" onclick={() => props.set(toggle_person)}>
			{props.data.kind == person_combined ? "⮜" : "⮟"}
		</button>
	);

	return (
		<Switch>
			<Match when={props.data.kind == person_combined}>
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
			<Match when={props.data.kind == person_fields}>
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
					<Label label={props.label!} />
					<span class="grow-me"></span>
					{props.children}
				</div>
			</Show>
			<div class={props.label !== undefined ? "indent" : ""}>
				<TextInput
					label="Name"
					data={props.data.name}
					set={(v) => props.set("name", v)}
					with_focus={props.with_focus}
					required
				>
					<Show when={props.label === undefined}>{props.children}</Show>
				</TextInput>
				<TextInput
					label="Given name"
					data={props.data.given_name}
					set={(v) => props.set("given_name", v)}
				/>
				<TextInput
					label="Prefix"
					data={props.data.prefix}
					set={(v) => props.set("prefix", v)}
				/>
				<TextInput
					label="Suffix"
					data={props.data.suffix}
					set={(v) => props.set("suffix", v)}
				/>
				<TextInput
					label="Alias"
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
					<Label label={props.label!} />
					<span class="grow-me"></span>
					{props.children}
				</div>
			</Show>
			<div class={props.label !== undefined ? "indent" : ""}>
				<EnumInput
					label="Role"
					values={roles}
					data={props.data.role}
					set={(v) => props.set("role", v)}
					display={(r) =>
						r.slice(0, 1).toUpperCase() + r.slice(1).replace(/-/g, " ")
					}
					required
				>
					<Show when={props.label === undefined}>{props.children}</Show>
				</EnumInput>
				<ListInput
					label="Names"
					plural="Names"
					data={props.data.names}
					default={default_person()}
					set={child_setter(props.set, "names")}
					EntryInput={PersonInput}
					required
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
					ref={(e) => props.with_focus && props.with_focus(() => e.focus())}
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
			<label>
				<Label label={props.label!} />
				{props.children}
			</label>
		</Show>
	);
}

type Label = string | LabelFields;
type LabelFields = {
	name: string;
	description?: string;
	extra?: boolean;
};

function Label(props: {
	label: Label;
}): JSX.Element {
	const fields = () =>
		typeof props.label === "string" ? { name: props.label } : props.label;
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
				<span
					class="extra"
					title="There are additional fields associated to this entry"
				>
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
