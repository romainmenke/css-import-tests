# CSS Import tests

`@import` in used as a signal by build tools to bundle CSS.  
It is however important in my opinion that this is done in ways that match native browser behavior.

Without this parallel users of such tools become dependent on the tool itself, and the tool becomes a barrier to entry for new users.

When implementations differ between browsers and tools there is an increased chance that implementations will differ between multiple tools as well.
This also blurs the line between feature and bug.

These tests are intended to surface such differences.

Currently this checks :
- Firefox (a.k.a. native)
- `@csstools/postcss-bundle` (in progress tool)
- `postcss-import`
- `lightningcss`
- `esbuild`

Current state :

| Test | native | @csstools/postcss-bundle | postcss-import | lightningcss | esbuild |
| ---- | ------ | ------------------------ | -------------- | ------------ | ------- |
| 001/absolute-url | ✅ | ✅ | ✅ | ❌ | ✅ |
| 001/default | ✅ | ✅ | ✅ | ✅ | ✅ |
| 001/relative-url | ✅ | ✅ | ✅ | ✅ | ✅ |
| at-charset/001 | ✅ | ✅ | ✅ | ✅ | ✅ |
| at-keyframes/001 | ✅ | ✅ | ✅ | ✅ | ✅ |
| at-layer/001 | ✅ | ✅ | ✅ | ❌ | ✅ |
| at-layer/002 | ✅ | ✅ | ✅ | ✅ | ✅ |
| at-layer/003 | ✅ | ✅ | ✅ | ❌ | ❌ |
| at-layer/004 | ✅ | ✅ | ❌ | ✅ | ✅ |
| at-layer/005 | ✅ | ✅ | ✅ | ✅ | ✅ |
| at-layer/006 | ✅ | ✅ | ✅ | ✅ | ✅ |
| at-layer/007 | ✅ | ✅ | ✅ | ❌ | ✅ |
| at-layer/008 | ✅ | ✅ | ❌ | ❌ | ✅ |
| at-layer/009 | ✅ | ✅ | ✅ | ✅ | ❌ |
| at-media/001/absolute-url | ✅ | ✅ | ✅ | ❌ | ✅ |
| at-media/001/default | ✅ | ✅ | ✅ | ✅ | ✅ |
| at-media/002 | ✅ | ✅ | ✅ | ✅ | ✅ |
| at-media/003 | ✅ | ✅ | ✅ | ✅ | ✅ |
| at-media/004 | ✅ | ✅ | ✅ | ✅ | ✅ |
| at-media/005 | ✅ | ✅ | ✅ | ✅ | ✅ |
| at-media/006 | ✅ | ✅ | ✅ | ✅ | ✅ |
| at-media/007 | ✅ | ✅ | ✅ | ✅ | ✅ |
| at-media/008 | ✅ | ✅ | ✅ | ✅ | ✅ |
| at-media/009 | ✅ | ✅ | ✅ | ❌ | ✅ |
| at-media/010 | ✅ | ❌ | ❌ | ❌ | ✅ |
| at-media/011 | ✅ | ❌ | ❌ | ❌ | ✅ |
| at-media/012 | ✅ | ❌ | ❌ | ❌ | ✅ |
| at-media/013 | ✅ | ❌ | ❌ | ❌ | ✅ |
| at-media/014 | ✅ | ✅ | ✅ | ❌ | ✅ |
| at-media/015 | ✅ | ✅ | ✅ | ❌ | ❌ |
| at-supports/001 | ✅ | ✅ | ✅ | ✅ | ✅ |
| at-supports/002 | ✅ | ✅ | ✅ | ✅ | ✅ |
| at-supports/003 | ✅ | ✅ | ✅ | ✅ | ✅ |
| at-supports/004 | ✅ | ✅ | ✅ | ✅ | ✅ |
| at-supports/005 | ✅ | ✅ | ✅ | ✅ | ✅ |
| cycles/001 | ✅ | ✅ | ✅ | ✅ | ✅ |
| cycles/002 | ✅ | ✅ | ✅ | ❌ | ✅ |
| cycles/003 | ✅ | ✅ | ✅ | ❌ | ✅ |
| cycles/004 | ✅ | ✅ | ❌ | ✅ | ✅ |
| cycles/005 | ✅ | ✅ | ✅ | ✅ | ✅ |
| cycles/006 | ✅ | ✅ | ❌ | ✅ | ✅ |
| cycles/007 | ✅ | ✅ | ✅ | ✅ | ✅ |
| cycles/008 | ✅ | ✅ | ❌ | ❌ | ✅ |
| data-urls/001 | ✅ | ✅ | ✅ | ❌ | ✅ |
| data-urls/002 | ✅ | ✅ | ✅ | ❌ | ✅ |
| data-urls/003 | ✅ | ✅ | ✅ | ❌ | ✅ |
| data-urls/004 | ✅ | ✅ | ✅ | ❌ | ❌ |
| data-urls/005 | ✅ | ✅ | ✅ | ❌ | ✅ |
| data-urls/006 | ✅ | ✅ | ✅ | ❌ | ✅ |
| duplicates/001 | ✅ | ✅ | ❌ | ✅ | ✅ |
| duplicates/002 | ✅ | ✅ | ❌ | ✅ | ✅ |
| empty/001 | ✅ | ✅ | ✅ | ✅ | ✅ |
| relative-paths/001 | ✅ | ✅ | ✅ | ✅ | ✅ |
| relative-paths/002 | ✅ | ✅ | ✅ | ✅ | ✅ |
| subresource/001 | ✅ | ✅ | ❌ | ❌ | ❌ |
| subresource/002 | ✅ | ✅ | ✅ | ✅ | ✅ |
| subresource/003 | ✅ | ✅ | ✅ | ✅ | ✅ |
| subresource/004 | ✅ | ✅ | ❌ | ❌ | ❌ |
| subresource/005 | ✅ | ✅ | ❌ | ❌ | ❌ |
| subresource/006 | ✅ | ✅ | ✅ | ✅ | ✅ |
| subresource/007 | ✅ | ✅ | ✅ | ✅ | ✅ |
| url-format/001/absolute-url | ✅ | ✅ | ✅ | ❌ | ✅ |
| url-format/001/default | ✅ | ✅ | ✅ | ✅ | ✅ |
| url-format/001/relative-url | ✅ | ✅ | ✅ | ✅ | ✅ |
| url-format/002/absolute-url | ✅ | ✅ | ✅ | ❌ | ✅ |
| url-format/002/default | ✅ | ✅ | ✅ | ✅ | ✅ |
| url-format/002/relative-url | ✅ | ✅ | ✅ | ✅ | ✅ |
| url-format/003/absolute-url | ✅ | ✅ | ✅ | ❌ | ✅ |
| url-format/003/default | ✅ | ✅ | ✅ | ✅ | ✅ |
| url-format/003/relative-url | ✅ | ✅ | ✅ | ✅ | ✅ |
| url-fragments/001 | ✅ | ✅ | ✅ | ❌ | ✅ |
| url-fragments/002 | ✅ | ✅ | ✅ | ❌ | ✅ |

## Types of failures

As far as I can tell no one is actually using import conditions and actually checking that the resulting behavior is correct.
If anyone had checked any basic case against a browser they would have files issues in upstream projects.

causes of interop issues :
- bundlers want to optimize for file size
- bundlers want to support importing CSS from npm packages
- cascade layers were added to CSS

## Contributing

Any test contributions are welcome!

You can open an issue and describe the case you want to test, or you can open a PR with a new test.

I don't care about technical purity, formatting, duplicates, ...  
Anything that increases test coverage is very much appreciated.
