# CSS Import tests

`@import` in used as a signal by build tools to bundle CSS.  
It is however critical that this is done in a way that matches native browser behavior.

Without this parallel users of such tools become dependent on the tool itself, and the tool becomes a barrier to entry for new users.

When implementations differ between browsers and tools there is an increased chance that implementations will differ between multiple tools as well.
It also blurs the line between feature and bug.

These tests are intended to surface such differences.

Currently this checks :
- Chrome (a.k.a. native)
- `postcss-import`
- `lightningcss`
- `esbuild`

Current state :

19 / 25 test(s) failed in at least one bundler.
0 / 25 test(s) failed in postcss-import.

## Types of failures

As far as I can tell no one is actually using import conditions and actually checking that the resulting behavior is correct.
If anyone had checked any basic case against a browser they would have been equally shocked as I was.

There are two major issues :
- bundlers want to optimize for file size
- bundlers want to support importing CSS from npm packages
