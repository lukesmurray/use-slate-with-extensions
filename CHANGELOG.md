# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.5.1](https://github.com/lukesmurray/use-slate-with-extensions/compare/v0.5.0...v0.5.1) (2021-09-30)


### Features

* **renderplaceholder:** add `renderPlaceholder` prop to extensions ([9366237](https://github.com/lukesmurray/use-slate-with-extensions/commit/93662378626f89889f6c92f46130ed9668e51ddb)), closes [#10](https://github.com/lukesmurray/use-slate-with-extensions/issues/10)


### Bug Fixes

* **testing:** add node 12 target ([0074607](https://github.com/lukesmurray/use-slate-with-extensions/commit/0074607175ebff534566b49a5fff0969771ac199))
* **testing:** replace react dom with testing-library/react ([c42f746](https://github.com/lukesmurray/use-slate-with-extensions/commit/c42f746e5d86f1bf8c291585985cd5bd0970631a))
* **workflows:** remove node 12 target ([3c428fa](https://github.com/lukesmurray/use-slate-with-extensions/commit/3c428fa67256070d7bc9b143d619ca9b7d60030b))

## [0.5.0](https://github.com/lukesmurray/use-slate-with-extensions/compare/v0.4.0...v0.5.0) (2021-04-16)


### ⚠ BREAKING CHANGES

* **withhistory:** remove withHistoryStable

* **withhistory:** remove withHistory implementation and other deprecated code ([4f6187f](https://github.com/lukesmurray/use-slate-with-extensions/commit/4f6187f00bbfc33b09c58302883a34dc6655cfe6))

## [0.4.0](https://github.com/lukesmurray/use-slate-with-extensions/compare/v0.3.3...v0.4.0) (2021-04-16)


### ⚠ BREAKING CHANGES

* **deps:** there are now two ways to apply withPlugins. as prePlugins and postPlugins.
prePlugins are applied once to the editor before any extensions are applied and change the editor
for it's entire lifecycle. Think of withReact and withHistory. postPlugins are applied after
extensions are applied and may be modified during the editor lifecycle. For example a custom
decorate method could be used as a postPlugin. postPlugins accept dependencies and can update while
prePlugins never accept dependencies and never update.

### Features

* **deps:** upgrade dependencies ([7093ad0](https://github.com/lukesmurray/use-slate-with-extensions/commit/7093ad00224c9dbfd817fef980126f48fd58730d)), closes [#2](https://github.com/lukesmurray/use-slate-with-extensions/issues/2)
* **editable:** add various editable events to the extensions api ([4e9aacf](https://github.com/lukesmurray/use-slate-with-extensions/commit/4e9aacfa3362ef5d2f39f7cf2537d005fe6f363f))

### [0.3.3](https://github.com/lukesmurray/use-slate-with-extensions/compare/v0.3.2...v0.3.3) (2021-02-16)


### Bug Fixes

* **filenames:** fix filename case sensitivity ([3e136c4](https://github.com/lukesmurray/use-slate-with-extensions/commit/3e136c4e229c0e776bc462cddf5172db375c6215))

### [0.3.2](https://github.com/lukesmurray/use-slate-with-extensions/compare/v0.3.1...v0.3.2) (2021-02-16)

### [0.3.1](https://github.com/lukesmurray/use-slate-with-extensions/compare/v0.3.0...v0.3.1) (2021-02-15)

## [0.3.0](https://github.com/lukesmurray/use-slate-with-extensions/compare/v0.2.4...v0.3.0) (2021-02-15)


### ⚠ BREAKING CHANGES

* **middleware:** All methods which were run one at a time such as insertBreak and onChange now
require the user to call next to run the next method. Editor is no longer the first argument for
isInline and isVoid

### Features

* **insertbreak:** add insert break to the editor methods that can be overridden ([c4c9393](https://github.com/lukesmurray/use-slate-with-extensions/commit/c4c939321845ed5199181aa8c735e6e1b80157f4))
* **inserttext:** implement insert text method on the editor ([7a81d5b](https://github.com/lukesmurray/use-slate-with-extensions/commit/7a81d5b744b5bc4f43771954228e6b24c796be6b))
* **middleware:** reimplement most editor and slate methods as middleware ([d7b0d94](https://github.com/lukesmurray/use-slate-with-extensions/commit/d7b0d946fc27a6c0e8c23a7121a2430d179f3809))

### [0.2.4](https://github.com/lukesmurray/use-slate-with-extensions/compare/v0.2.3...v0.2.4) (2021-02-13)

### [0.2.3](https://github.com/lukesmurray/use-slate-with-extensions/compare/v0.2.2...v0.2.3) (2021-02-08)


### Bug Fixes

* **useslatewithextensions:** remove circular dependency ([46c0e3f](https://github.com/lukesmurray/use-slate-with-extensions/commit/46c0e3ff526fed4bf7081ee48c36be0a8ebb7a2b))

### [0.2.2](https://github.com/lukesmurray/use-slate-with-extensions/compare/v0.2.1...v0.2.2) (2021-02-08)


### Bug Fixes

* **examples:** upgrade node-forge to non-vulnerable version ([29b0363](https://github.com/lukesmurray/use-slate-with-extensions/commit/29b0363b3e6580bf29a318056ecf854a97a1b05d))

### [0.2.1](https://github.com/lukesmurray/use-slate-with-extensions/compare/v0.2.0...v0.2.1) (2021-02-07)


### Features

* **plugins:** remove useEffect from useSlateWithExtensions and add pluginDeps ([adce7c6](https://github.com/lukesmurray/use-slate-with-extensions/commit/adce7c6dd518d5fc6cd7ffb2500d51ac270deaea))

## [0.2.0](https://github.com/lukesmurray/use-slate-with-extensions/compare/v0.1.5...v0.2.0) (2021-02-05)


### ⚠ BREAKING CHANGES

* **ondombeforeinput:** Change semantics of onDOMBeforeInput so that the event can be handled by an
extension. Strongle type the event type of onDOMBeforeInput as an InputEvent.

### Features

* **ondombeforeinput:** make ondombeforeinput preventable and make the event an input event ([d535ce3](https://github.com/lukesmurray/use-slate-with-extensions/commit/d535ce3d532378923040fe0de8384be099ad139a))


### Bug Fixes

* **renderelement:** allow renderElement to return void ([137f666](https://github.com/lukesmurray/use-slate-with-extensions/commit/137f666d43f4dcba4a0b4cd92807d39656451e33))

### [0.1.5](https://github.com/lukesmurray/use-slate-with-extensions/compare/v0.1.4...v0.1.5) (2021-02-04)

### [0.1.4](https://github.com/lukesmurray/use-slate-with-extensions/compare/v0.1.3...v0.1.4) (2021-02-04)

### [0.1.3](https://github.com/lukesmurray/use-slate-with-extensions/compare/v0.1.2...v0.1.3) (2021-02-04)

### [0.1.2](https://github.com/lukesmurray/use-slate-with-extensions/compare/v0.1.1...v0.1.2) (2021-02-04)
