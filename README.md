# CSS Import tests

`@import` in used as a signal by build tools to bundle CSS.  
It is however important in my opinion that this is done in ways that match native browser behavior.

Without this parallel users of such tools become dependent on the tool itself, and the tool becomes a barrier to entry for new users.

When implementations differ between browsers and tools there is an increased chance that implementations will differ between multiple tools as well.
This also blurs the line between feature and bug.

These tests are intended to surface such differences.

Currently this checks :
- `chrome`
- `firefox`
- `esbuild`
- `lightningcss`
- `@csstools/postcss-bundler` (abbr. `p-bundler`)
- `postcss-import` (abbr. `p-import`)

### Configs

#### `esbuild`

No config needed to make it compliant.

```js
const esBundle = await esbuild.build({
	entryPoints: ['style.css'],
	bundle: true,
	logLevel: 'silent',
	write: false,
	external: ['*.png'] /* for sub-resource tests */,
})
```

#### `lightningcss`

Some config is needed to make it run without fatal errors.

```js
let { code } = lightningcss({
	filename: 'style.css',
	errorRecovery: true, /* The CSS language is intended to be forgiving */
});
```

#### `@csstools/postcss-bundler`

No config needed to make it compliant.  

```js
postcssBundler()
```

#### `postcss-import`

Some config is needed to make it compliant.

```js
postcssImport({
	skipDuplicates: false /* skipping duplicates is not how CSS works */,
})
```

## How to run

### Full test suite

- `npm ci`
- `npm run install:with-firefox`
- `npm run test`

### Individual test

- `npm ci`
- `npm run serve <name of a test>`

Sub string matches are fine,  
`npm run serve at-layer` will serve the first test that contains `at-layer`.

## Current state

| Test | chrome | firefox | webkit | esbuild | lightningcss | bun | p-bundler | p-import |
| ---- | ------ | ------- | ------ | ------- | ------------ | --- | --------- | -------- |
| [001-core-features/001/absolute-url](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/001/absolute-url) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| [001-core-features/001/default](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/001/default) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/001/foldername-that-is-a-domain](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/001/foldername-that-is-a-domain) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/001/relative-url](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/001/relative-url) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/at-charset/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/at-charset/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/at-keyframes/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/at-keyframes/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/before-other-styles/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/before-other-styles/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/before-other-styles/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/before-other-styles/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/case-sensitivity/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/case-sensitivity/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| [001-core-features/case-sensitivity/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/case-sensitivity/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| [001-core-features/case-sensitivity/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/case-sensitivity/003) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/cycles/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/cycles/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/cycles/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/cycles/002) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [001-core-features/cycles/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/cycles/003) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [001-core-features/cycles/004](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/cycles/004) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/cycles/005](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/cycles/005) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/cycles/006](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/cycles/006) | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/duplicates/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/duplicates/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/duplicates/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/duplicates/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/empty/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/empty/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/escape-sequences/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/escape-sequences/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/escape-sequences/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/escape-sequences/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/escape-sequences/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/escape-sequences/003) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| [001-core-features/forwards-compat/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/forwards-compat/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/forwards-compat/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/forwards-compat/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/forwards-compat/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/forwards-compat/003) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/forwards-compat/004](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/forwards-compat/004) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| [001-core-features/forwards-compat/005](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/forwards-compat/005) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [001-core-features/forwards-compat/006](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/forwards-compat/006) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [001-core-features/forwards-compat/007](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/forwards-compat/007) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/forwards-compat/008](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/forwards-compat/008) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/namespace/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/namespace/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/namespace/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/namespace/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/relative-paths/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/relative-paths/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/relative-paths/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/relative-paths/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/subresource/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/subresource/001) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [001-core-features/subresource/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/subresource/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/subresource/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/subresource/003) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/subresource/004](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/subresource/004) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [001-core-features/subresource/005](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/subresource/005) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [001-core-features/subresource/006](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/subresource/006) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/subresource/007](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/subresource/007) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/subresource/008](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/subresource/008) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [001-core-features/subresource/009](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/subresource/009) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [001-core-features/subresource/010](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/subresource/010) | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/subresource/011](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/subresource/011) | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/url-format/001/absolute-url](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-format/001/absolute-url) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| [001-core-features/url-format/001/default](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-format/001/default) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/url-format/001/relative-url](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-format/001/relative-url) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/url-format/002/absolute-url](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-format/002/absolute-url) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| [001-core-features/url-format/002/default](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-format/002/default) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/url-format/002/relative-url](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-format/002/relative-url) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/url-fragments/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-fragments/001) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| [001-core-features/url-fragments/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-fragments/002) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| [001-core-features/url-fragments/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-fragments/003) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| [001-core-features/url-fragments/004](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-fragments/004) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [001-core-features/url-fragments/005](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-fragments/005) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/001-data-urls/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/001-data-urls/001) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/001-data-urls/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/001-data-urls/002) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/001-data-urls/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/001-data-urls/003) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/001-data-urls/004](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/001-data-urls/004) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/001-data-urls/005](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/001-data-urls/005) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/001-data-urls/006](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/001-data-urls/006) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/001/absolute-url](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/001/absolute-url) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/001/default](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/001/default) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/003) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/004](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/004) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/005](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/005) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/006](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/006) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/007](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/007) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/008](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/008) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/009](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/009) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/010](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/010) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/011](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/011) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/012](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/012) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/013](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/013) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/014](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/014) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/015](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/015) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/016](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/016) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/017](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/017) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/018](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/018) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/at-keyframes/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/at-keyframes/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/cycles/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/cycles/001) | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/001) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/003) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/004](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/004) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/005](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/005) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/006](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/006) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/007](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/007) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [002-sub-features/003-at-layer/008](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/008) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/009](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/009) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/010](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/010) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/011](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/011) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/012](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/012) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/013](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/013) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/014](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/014) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/003-at-layer/015](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/015) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| [002-sub-features/003-at-layer/at-keyframes/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/at-keyframes/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/at-keyframes/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/at-keyframes/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/case-sensitivity/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/case-sensitivity/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/case-sensitivity/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/case-sensitivity/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [002-sub-features/003-at-layer/case-sensitivity/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/case-sensitivity/003) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/cycles/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/cycles/001) | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/mixed-importables/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/mixed-importables/001) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/003-at-layer/url-fragments/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/url-fragments/001) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/004-at-supports/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/004-at-supports/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/004-at-supports/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/004-at-supports/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/004-at-supports/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/004-at-supports/003) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/004-at-supports/004](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/004-at-supports/004) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/004-at-supports/005](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/004-at-supports/005) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/004-at-supports/006](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/004-at-supports/006) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [002-sub-features/004-at-supports/007](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/004-at-supports/007) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/004-at-supports/008](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/004-at-supports/008) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/004-at-supports/009](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/004-at-supports/009) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/004-at-supports/010](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/004-at-supports/010) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/004-at-supports/011](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/004-at-supports/011) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/004-at-supports/012](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/004-at-supports/012) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/004-at-supports/case-sensitivity/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/004-at-supports/case-sensitivity/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/005-at-scope/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/005-at-scope/001) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/005-at-scope/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/005-at-scope/002) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/005-at-scope/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/005-at-scope/003) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/005-at-scope/004](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/005-at-scope/004) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/005-at-scope/005](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/005-at-scope/005) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/005-at-scope/006](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/005-at-scope/006) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| [002-sub-features/005-at-scope/007](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/005-at-scope/007) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/005-at-scope/008](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/005-at-scope/008) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/005-at-scope/009](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/005-at-scope/009) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/005-at-scope/010](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/005-at-scope/010) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/005-at-scope/011](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/005-at-scope/011) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/005-at-scope/012](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/005-at-scope/012) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/005-at-scope/case-sensitivity/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/005-at-scope/case-sensitivity/001) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/005-at-scope/scoping/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/005-at-scope/scoping/001) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/005-at-scope/scoping/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/005-at-scope/scoping/002) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [002-sub-features/005-at-scope/scoping/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/005-at-scope/scoping/003) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| [003-should-fail/001-core-features/before-other-styles/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/003-should-fail/001-core-features/before-other-styles/001) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| [003-should-fail/001-core-features/before-other-styles/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/003-should-fail/001-core-features/before-other-styles/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| [003-should-fail/001-core-features/case-sensitivity/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/003-should-fail/001-core-features/case-sensitivity/001) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| [004-unimplementable/001-namespace/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/004-unimplementable/001-namespace/001) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| [004-unimplementable/002-url-queries/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/004-unimplementable/002-url-queries/001) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| [004-unimplementable/003-mixed-importables/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/004-unimplementable/003-mixed-importables/001) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| [004-unimplementable/004-subresource/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/004-unimplementable/004-subresource/001) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| [004-unimplementable/004-subresource/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/004-unimplementable/004-subresource/002) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| [005-implementation-specific/leading-slash-is-import-root/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/005-implementation-specific/leading-slash-is-import-root/001) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| [005-implementation-specific/leading-slash-is-import-root/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/005-implementation-specific/leading-slash-is-import-root/002) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| [999-irrelevant/url-format/001/absolute-url](https://github.com/romainmenke/css-import-tests/tree/main/tests/999-irrelevant/url-format/001/absolute-url) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| [999-irrelevant/url-format/001/default](https://github.com/romainmenke/css-import-tests/tree/main/tests/999-irrelevant/url-format/001/default) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [999-irrelevant/url-format/001/relative-url](https://github.com/romainmenke/css-import-tests/tree/main/tests/999-irrelevant/url-format/001/relative-url) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [999-irrelevant/url-format/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/999-irrelevant/url-format/002) | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| [999-irrelevant/url-fragments/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/999-irrelevant/url-fragments/001) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Total | 120 / 136 | 115 / 136 | 120 / 136 | 110 / 136 | 76 / 136 | 12 / 136 | 135 / 136 | 102 / 136 |

## Contributing

Any test contributions are welcome!

You can open an issue and describe the case you want to test, or you can open a PR with a new test.

I don't care about technical purity, formatting, duplicates, ...  
Anything that increases test coverage is very much appreciated.
