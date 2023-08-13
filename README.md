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
- `@csstools/postcss-bundle` (abbr. `p-bundle`)
- `postcss-import` (abbr. `p-import`)
- `lightningcss`
- `esbuild`

## How to run

### Full test suite

⚠️ This is most likely broken.

- `npm ci`
- `npm run install:with-firefox`
- `npm run test`

### Individual test

- `npm ci`
- `npm run serve <name of a test>`

Sub string matches are fine,  
`npm run serve at-layer` will serve the first test that contains `at-layer`.

## Current state

| Test | chrome | firefox | p-bundle | p-import | lightningcss | esbuild |
| ---- | ------ | ------- | ------ | ------ | ------------ | ------- |
| [001-core-features/001/absolute-url](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/001/absolute-url) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [001-core-features/001/default](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/001/default) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/001/relative-url](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/001/relative-url) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/at-charset/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/at-charset/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/at-keyframes/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/at-keyframes/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/before-other-styles/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/before-other-styles/001) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [001-core-features/before-other-styles/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/before-other-styles/002) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [001-core-features/cycles/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/cycles/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/cycles/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/cycles/002) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [001-core-features/cycles/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/cycles/003) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [001-core-features/cycles/004](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/cycles/004) | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/cycles/005](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/cycles/005) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/cycles/006](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/cycles/006) | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/duplicates/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/duplicates/001) | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/duplicates/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/duplicates/002) | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [001-core-features/empty/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/empty/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/namespace/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/namespace/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/namespace/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/namespace/002) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [001-core-features/relative-paths/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/relative-paths/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/relative-paths/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/relative-paths/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/subresource/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/subresource/001) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| [001-core-features/subresource/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/subresource/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/subresource/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/subresource/003) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/subresource/004](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/subresource/004) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| [001-core-features/subresource/005](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/subresource/005) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| [001-core-features/subresource/006](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/subresource/006) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/subresource/007](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/subresource/007) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/url-format/001/absolute-url](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-format/001/absolute-url) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [001-core-features/url-format/001/default](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-format/001/default) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/url-format/001/relative-url](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-format/001/relative-url) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/url-format/002/absolute-url](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-format/002/absolute-url) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [001-core-features/url-format/002/default](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-format/002/default) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/url-format/002/relative-url](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-format/002/relative-url) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [001-core-features/url-fragments/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-fragments/001) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| [001-core-features/url-fragments/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-fragments/002) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| [001-core-features/url-fragments/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/001-core-features/url-fragments/003) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| [002-sub-features/001-data-urls/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/001-data-urls/001) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [002-sub-features/001-data-urls/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/001-data-urls/002) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| [002-sub-features/001-data-urls/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/001-data-urls/003) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| [002-sub-features/001-data-urls/004](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/001-data-urls/004) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| [002-sub-features/001-data-urls/005](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/001-data-urls/005) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| [002-sub-features/001-data-urls/006](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/001-data-urls/006) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [002-sub-features/002-at-media/001/absolute-url](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/001/absolute-url) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [002-sub-features/002-at-media/001/default](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/001/default) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [002-sub-features/002-at-media/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [002-sub-features/002-at-media/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/003) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [002-sub-features/002-at-media/004](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/004) | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/005](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/005) | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/006](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/006) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [002-sub-features/002-at-media/007](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/007) | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/008](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/008) | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/002-at-media/009](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/009) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [002-sub-features/002-at-media/010](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/010) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [002-sub-features/002-at-media/011](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/011) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [002-sub-features/002-at-media/012](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/012) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| [002-sub-features/002-at-media/013](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/013) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [002-sub-features/002-at-media/014](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/014) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| [002-sub-features/002-at-media/at-keyframes/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/at-keyframes/001) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [002-sub-features/002-at-media/cycles/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/002-at-media/cycles/001) | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/001) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [002-sub-features/003-at-layer/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [002-sub-features/003-at-layer/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/003) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [002-sub-features/003-at-layer/004](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/004) | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/005](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/005) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [002-sub-features/003-at-layer/006](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/006) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [002-sub-features/003-at-layer/007](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/007) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [002-sub-features/003-at-layer/008](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/008) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| [002-sub-features/003-at-layer/009](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/009) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| [002-sub-features/003-at-layer/010](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/010) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| [002-sub-features/003-at-layer/011](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/011) | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| [002-sub-features/003-at-layer/012](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/012) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [002-sub-features/003-at-layer/at-keyframes/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/at-keyframes/001) | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/003-at-layer/at-keyframes/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/at-keyframes/002) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| [002-sub-features/003-at-layer/cycles/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/cycles/001) | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| [002-sub-features/003-at-layer/url-fragments/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/003-at-layer/url-fragments/001) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| [002-sub-features/004-at-supports/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/004-at-supports/001) | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/004-at-supports/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/004-at-supports/002) | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/004-at-supports/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/004-at-supports/003) | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/004-at-supports/004](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/004-at-supports/004) | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [002-sub-features/004-at-supports/005](https://github.com/romainmenke/css-import-tests/tree/main/tests/002-sub-features/004-at-supports/005) | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| [003-should-fail/001-core-features/before-other-styles/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/003-should-fail/001-core-features/before-other-styles/001) | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| [003-should-fail/001-core-features/before-other-styles/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/003-should-fail/001-core-features/before-other-styles/002) | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| [003-should-fail/002-sub-features/002-at-media/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/003-should-fail/002-sub-features/002-at-media/001) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| [003-should-fail/002-sub-features/002-at-media/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/003-should-fail/002-sub-features/002-at-media/002) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| [003-should-fail/002-sub-features/002-at-media/003](https://github.com/romainmenke/css-import-tests/tree/main/tests/003-should-fail/002-sub-features/002-at-media/003) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| [003-should-fail/002-sub-features/002-at-media/004](https://github.com/romainmenke/css-import-tests/tree/main/tests/003-should-fail/002-sub-features/002-at-media/004) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| [004-unimplementable/001-namespace/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/004-unimplementable/001-namespace/001) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| [004-unimplementable/002-url-queries/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/004-unimplementable/002-url-queries/001) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| [999-irrelevant/url-format/001/absolute-url](https://github.com/romainmenke/css-import-tests/tree/main/tests/999-irrelevant/url-format/001/absolute-url) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| [999-irrelevant/url-format/001/default](https://github.com/romainmenke/css-import-tests/tree/main/tests/999-irrelevant/url-format/001/default) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [999-irrelevant/url-format/001/relative-url](https://github.com/romainmenke/css-import-tests/tree/main/tests/999-irrelevant/url-format/001/relative-url) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [999-irrelevant/url-format/002](https://github.com/romainmenke/css-import-tests/tree/main/tests/999-irrelevant/url-format/002) | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| [999-irrelevant/url-fragments/001](https://github.com/romainmenke/css-import-tests/tree/main/tests/999-irrelevant/url-fragments/001) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

## Contributing

Any test contributions are welcome!

You can open an issue and describe the case you want to test, or you can open a PR with a new test.

I don't care about technical purity, formatting, duplicates, ...  
Anything that increases test coverage is very much appreciated.
