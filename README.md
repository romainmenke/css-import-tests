# CSS Import tests

`@import` in used as a signal by build tools to bundle CSS.  
It is however critical that this is done in a way that matches native browser behavior.

Without this parallel users of such tools become dependent on the tool itself, and the tool becomes a barrier to entry for new users.

When implementations differ between browsers and tools there is an increased chance that implementations will differ between multiple tools as well.
It also blurs the line between feature and bug.

These tests are intended to surface such differences.

Currently this checks :
- Firefox (a.k.a. native)
- `postcss-import`
- `lightningcss`
- `esbuild`

Current state :

│ (index) │             label             │ native │ postcss-import │ lightningcss │ esbuild │
├─────────┼───────────────────────────────┼────────┼────────────────┼──────────────┼─────────┤
│    0    │      '001/absolute-url'       │  '✅'  │      '✅'      │     '❌'     │  '✅'   │
│    1    │         '001/default'         │  '✅'  │      '✅'      │     '✅'     │  '✅'   │
│    2    │      '001/relative-url'       │  '✅'  │      '✅'      │     '✅'     │  '✅'   │
│    3    │       'at-charset/001'        │  '✅'  │      '✅'      │     '✅'     │  '✅'   │
│    4    │      'at-keyframes/001'       │  '✅'  │      '✅'      │     '✅'     │  '❌'   │
│    5    │        'at-layer/001'         │  '✅'  │      '✅'      │     '❌'     │  '❌'   │
│    6    │        'at-layer/002'         │  '✅'  │      '✅'      │     '✅'     │  '❌'   │
│    7    │        'at-layer/003'         │  '✅'  │      '✅'      │     '❌'     │  '❌'   │
│    8    │        'at-layer/004'         │  '✅'  │      '✅'      │     '✅'     │  '✅'   │
│    9    │        'at-layer/005'         │  '✅'  │      '✅'      │     '✅'     │  '❌'   │
│   10    │        'at-layer/006'         │  '✅'  │      '✅'      │     '✅'     │  '❌'   │
│   11    │  'at-media/001/absolute-url'  │  '✅'  │      '✅'      │     '❌'     │  '✅'   │
│   12    │    'at-media/001/default'     │  '✅'  │      '✅'      │     '✅'     │  '❌'   │
│   13    │        'at-media/002'         │  '✅'  │      '✅'      │     '✅'     │  '❌'   │
│   14    │        'at-media/003'         │  '✅'  │      '✅'      │     '✅'     │  '❌'   │
│   15    │        'at-media/004'         │  '✅'  │      '✅'      │     '✅'     │  '❌'   │
│   16    │        'at-media/005'         │  '✅'  │      '✅'      │     '✅'     │  '❌'   │
│   17    │        'at-media/006'         │  '✅'  │      '✅'      │     '✅'     │  '❌'   │
│   18    │        'at-media/007'         │  '✅'  │      '✅'      │     '✅'     │  '❌'   │
│   19    │       'at-supports/001'       │  '✅'  │      '✅'      │     '✅'     │  '❌'   │
│   20    │       'at-supports/002'       │  '✅'  │      '✅'      │     '✅'     │  '❌'   │
│   21    │       'at-supports/003'       │  '✅'  │      '✅'      │     '✅'     │  '❌'   │
│   22    │         'cycles/001'          │  '✅'  │      '✅'      │     '❌'     │  '❌'   │
│   23    │         'cycles/002'          │  '✅'  │      '✅'      │     '❌'     │  '✅'   │
│   24    │         'cycles/003'          │  '✅'  │      '✅'      │     '❌'     │  '✅'   │
│   25    │         'cycles/004'          │  '✅'  │      '✅'      │     '✅'     │  '✅'   │
│   26    │         'cycles/005'          │  '✅'  │      '✅'      │     '✅'     │  '✅'   │
│   27    │         'cycles/006'          │  '✅'  │      '✅'      │     '✅'     │  '✅'   │
│   28    │         'cycles/007'          │  '✅'  │      '✅'      │     '✅'     │  '❌'   │
│   29    │         'cycles/008'          │  '✅'  │      '✅'      │     '✅'     │  '❌'   │
│   30    │        'data-urls/001'        │  '✅'  │      '✅'      │     '❌'     │  '✅'   │
│   31    │        'data-urls/002'        │  '✅'  │      '✅'      │     '❌'     │  '✅'   │
│   32    │        'data-urls/003'        │  '✅'  │      '✅'      │     '❌'     │  '✅'   │
│   33    │        'data-urls/004'        │  '✅'  │      '✅'      │     '❌'     │  '❌'   │
│   34    │        'data-urls/005'        │  '✅'  │      '✅'      │     '❌'     │  '✅'   │
│   35    │        'data-urls/006'        │  '✅'  │      '✅'      │     '❌'     │  '✅'   │
│   36    │       'duplicates/001'        │  '✅'  │      '✅'      │     '✅'     │  '✅'   │
│   37    │       'duplicates/002'        │  '✅'  │      '✅'      │     '✅'     │  '✅'   │
│   38    │     'relative-paths/001'      │  '✅'  │      '✅'      │     '✅'     │  '✅'   │
│   39    │     'relative-paths/002'      │  '✅'  │      '✅'      │     '✅'     │  '✅'   │
│   40    │ 'url-format/001/absolute-url' │  '✅'  │      '✅'      │     '❌'     │  '✅'   │
│   41    │   'url-format/001/default'    │  '✅'  │      '✅'      │     '✅'     │  '✅'   │
│   42    │ 'url-format/001/relative-url' │  '✅'  │      '✅'      │     '✅'     │  '✅'   │
│   43    │ 'url-format/002/absolute-url' │  '✅'  │      '✅'      │     '❌'     │  '✅'   │
│   44    │   'url-format/002/default'    │  '✅'  │      '✅'      │     '✅'     │  '✅'   │
│   45    │ 'url-format/002/relative-url' │  '✅'  │      '✅'      │     '✅'     │  '✅'   │
│   46    │ 'url-format/003/absolute-url' │  '✅'  │      '✅'      │     '❌'     │  '✅'   │
│   47    │   'url-format/003/default'    │  '✅'  │      '✅'      │     '✅'     │  '✅'   │
│   48    │ 'url-format/003/relative-url' │  '✅'  │      '✅'      │     '✅'     │  '✅'   │
│   49    │      'url-fragments/001'      │  '✅'  │      '✅'      │     '❌'     │  '✅'   │
│   50    │      'url-fragments/002'      │  '✅'  │      '✅'      │     '❌'     │  '✅'   │

## Types of failures

As far as I can tell no one is actually using import conditions and actually checking that the resulting behavior is correct.
If anyone had checked any basic case against a browser they would have been equally shocked as I was.

There are two major issues :
- bundlers want to optimize for file size
- bundlers want to support importing CSS from npm packages

## Contributing

Any test contributions are welcome!

You can open an issue and describe the case you want to test, or you can open a PR with a new test.

I don't care about technical purity, formatting, duplicates, ...  
Anything that increases test coverage is very much appreciated.
