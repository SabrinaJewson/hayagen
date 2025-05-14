# Hayagen form UI

Hayagriva has quite intuitive field names already,
but I like to fill out forms so I remember what fields there are.
This is a simple web app that does exactly that.

## Development

- `pnpm dev`: Runs the dev server
- `pnpm fmt`: Formats the codebase

## Adding a new translation

+ Copy `translations/en.ts` into `translations/$lang.ts`,
	where `$lang` is your chosen language,
	and edit it to your liking.
+ Edit `translations/index.ts` in the following ways:
	+ Add `import $lang from "./$lang";` to the import section.
	+ Add your language to the `LANGS` array.
	+ Add your language to the `translations` constant.
