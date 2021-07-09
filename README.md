# Use Slate With Extensions

![npm](https://img.shields.io/npm/v/use-slate-with-extensions)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/use-slate-with-extensions)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

[Live Demo](https://use-slate-with-extensions.netlify.app/)

`useSlateWithExtensions` is a simple, powerful, _and_ tiny (**&lt; 2KB**) hook which helps you build self contained and composable extensions for [Slate](https://github.com/ianstormtaylor/slate).
The extensions built with this hook are easy to share, consume, and understand.
[Jump to the examples if you want to see how easy it is to create rich extension based applications with this hook](#examples)
or continue reading to get a brief exploration of how this hook works and the motivation for its design.

## Installation

```sh
# for npm
npm install use-slate-with-extensions

# for yarn
yarn add use-slate-with-extensions
```

This hook also depends on the slate editor packages.

```sh
# for npm
npm install slate slate-history slate-react

# for yarn
yarn add slate slate-history slate-react
```

## Usage

`useSlateWithExtensions` is a hook which converts an array of `SlateExtension`'s into props which can be passed to a `Slate` and `Editable` component. The hook can be convenient even if you don't use extensions.
For example, if you pass nothing to the hook, you can use the props returned by `useSlateWithExtensions` to render an _uncontrolled component_.
The hook will by default apply `withReact` and `withHistory` internally, and create an initial empty editor state.
You can also optionally pass some initial state to render.
All you need to do to use the hook is provide the props from `getSlateProps` and `getEditableProps` to your `<Slate/` and `<Editable/` components.

```tsx
import { useSlateWithExtensions } from 'use-slate-with-extensions';

const { getEditableProps, getSlateProps } = useSlateWithExtensions({
  // optional initial state
  initialState: [{ children: [{ text: '' }] }],
});

// render your Slate and Editable as an uncontrolled component
return (
  <Slate {...getSlateProps()}>
    <Editable {...getEditableProps()} />
  </Slate>
);
```

The next simplest example is to use `useSlateWithExtensions` as a _controlled component_.
All you need to do is provide a `value` and `onChange` callback similar to any other controlled components.
In this case I'm using a helpful hook `useSlateState` provided by this package to create my `value` and `onChange` callbacks.

```tsx
import {
  useSlateWithExtensions,
  useSlateState,
} from 'use-slate-with-extensions';

// create the slate value and change handlers
const [value, onChange] = useSlateState();
// you could also pass initial state to the useSlateState hook
// const [value, onChange] = useSlateState([{ children: [{ text: '' }] }]);

// use the useSlateWithExtensions hook
const { getEditableProps, getSlateProps } = useSlateWithExtensions({
  onChange,
  value,
});

// render your Slate and Editable as a controlled component
return (
  <Slate {...getSlateProps()}>
    <Editable {...getEditableProps()} />
  </Slate>
);
```

It's really that easy to get started. But `useSlateWithExtensions` is much more interesting when you add extensions.

### Defining our first extension

Extensions are simply javascript objects which conform to the [`SlateExtension` interface](./src/core/types/SlateExtension.ts).
The interface merges the `Slate` and `Editable` props and provides methods such as `isVoid`, `onChange`, and `onPaste`.

We'll start by writing a simple extension which logs all of the editor operations on change.

```tsx
// use a custom react hook to create the extension so that you can use
// react hooks inside the extension
const useLogOperationsExtension = (): SlateExtension => {
  // define the onChange function using useCallback
  const onChange = useCallback(editor => {
    // log the editor operations
    console.group('operations');
    editor.operations.forEach(op => console.log(op));
    console.groupEnd();
  }, []);

  // return the SlateExtension
  return {
    onChange,
    onChangeDeps: [onChange],
  };
};
```

### Using our first extension

We can use extensions by passing them to the `extensions` property on the `useSlateWithExtensions` hook.

```tsx
import {
  useSlateWithExtensions,
  useSlateState,
} from 'use-slate-with-extensions';

// create the slate value and change handlers
const [value, onChange] = useSlateState();

// get an instance of the log operations extension
const logOperationsExtension = useLogOperationsExtension();

// call the useSlateWithExtensions hook
const { getEditableProps, getSlateProps } = useSlateWithExtensions({
  onChange, // pass the change handler
  value, // pass the current editor value
  extensions: [logOperationsExtension], // pass the extensions
});

// render slate and editable with logging on change!
return (
  <Slate {...getSlateProps()}>
    <Editable {...getEditableProps()} />
  </Slate>
);
```

That's really all you need to do to implement and use an extension!

The last two lines are the magic of `useSlateWithExtensions`.
Under the hood `useSlateWithExtensions` creates props for `Slate` and `Editable` which do the hard work of dispatching to the methods on your extensions.
All you have to do to hook up the props to `<Slate/>` and `<Editable/>`.
This is a pretty powerful model and allows you to fully separate the high level rendering decisions from the low extension logic.
Check out the Mention and Highlight examples below to see some of this power for yourself.

**TLDR**

To use `useSlateWithExtensions` you just need to

1. Define your extensions.
2. Pass your extensions to `useSlateWithExtensions`.
3. Pass `getSlateProps()` and `getEditableProps()` to `Slate` and `Editable` respectively.

## Why

The built in Slate Plugins are amazing but they can only modify methods defined on the `Editor` interface such as `isInline`, `isVoid`, and `onChange`.
The Next-gen [Slate-Plugins](https://github.com/udecode/slate-plugins) ~~are incredibly useful but they only allow the user to modify methods defined on the `Editable` interface such as `decorate`, `renderLeaf`, and `renderElement`~~

> The Next-gen [Slate-Plugins] took inspiration from this library in their v1 release! If you're trying to decide between the two, think of this hook as a small and relatively unopinionated solution which helps you write your own code in a clean and structured way. Think of Next-gen slate plugins as a less flexible, more opinionated and larger implementation that provides a ton of functionality out of the box. If the Next-gen plugins work for your use case or provide functionality that you want to use such as lists then go with those, it will save you a ton of time! If you just want a framework to write custom extensions in a clean and composable way then stick with `useSlateWithExtensions`.

Unfortunately many of the common use cases for using Slate involve plugging into the methods defined on both the `Editor` and the `Editable` interfaces.
For instance [the mention example](https://github.com/ianstormtaylor/slate/blob/master/site/examples/mentions.tsx) from the docs uses a Slate Plugin `withPlugins` to override `isInline` and `isVoid` on the `Editor` interface. This plugin is nice and encapsulated!

However the mention example uses global functions to handle the `Editable` props `onKeyDown`, `onChange`, and `renderElement`. If we want to add more custom behavior to the mention example we would have to modify the global `onKeyDown`, `onChange` and `renderElement` implementations.
This violates the [open-closed principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle) and results in a deeply coupled and monolithic mess.

Now we could try to compromise and use built in plugins when we want to extend the `Editor` API and use next gen plugins to extend the `Editable` API.
But then our logic is split up across multiple functions and we need to use complex workarounds in order to share common state.

`useSlateWithExtensions` gives users the ability to write `SlateExtension`s which access apis from both the `Editor` and `Editable` interfaces.
Because the entire `Slate` api is exposed in a single interface these extensions can provide self contained modules for implementing custom behavior in Slate.
The `useSlateWithExtensions` hook lets users easily combine various extensions together to create rich text editing experiences.
I've outlined several examples of using these extensions below, highlighting how these new extensions encapsulate behavior, lead to a nicely decoupled design, and are easily composable.

My hope is that this hook and the corresponding extensions can be used by the community to create a richer ecosystem of encapsulated Slate behaviors which can be easily adopted by developers.

## Examples

### Basic

In the basic example there are no extensions activated.
_useSlateWithExtensions_ provides nice defaults such as automatically including `withReact` and `withHistory`.
You only need to manage the `value` and `onChange` handlers, similar to any controlled component.

The key point here is that you can still handle rendering slate however you would like to.
For instance you could render a toolbar or provide your own custom styling.
_UseSlateWithExtensions_ uses getter props to _get out of your way_ and let you handle the rendering of the `Slate` context provider and the `Editable` content-editable interface.

```tsx
import { Editable, Slate } from 'slate-react';
import { useSlateState, useSlateWithExtensions } from 'useSlateWithExtensions';

const Basic = () => {
  // create an empty slate state and a change handler
  // you can provide your own, this hook just makes the examples shorter
  const [value, onChange] = useSlateState();

  // using the extensions api but without any extensions
  const { getEditableProps, getSlateProps } = useSlateWithExtensions({
    onChange,
    value,
  });

  return (
    // get the editor, value, and onChange handlers for Slate
    <Slate {...getSlateProps()}>
      {/* get renderElement, renderLeaf ... handlers for Editable */}
      <Editable {...getEditableProps()} />
    </Slate>
  );
};
```

### Mentions

In this example we are using the `useMentionExtension` and `MentionSelect` from [the mentions example](./stories/Mentions.stories.tsx).
There is a bunch of code in the mention example but we don't need to care about any of it.
Someone else can write the mentions code and we can just use it!
We simply create the extension, pass the extension to _useSlateWithExtensions_, and then render our `Slate` and `Editable` as always.
Because the extension is able to encapsulate all of it's own behavior we don't need to override any `Editor` or `Editable` apis. Decoupling is super nice!

If you look closely you may see that there is one aspect of the mention extension which is leaking through our decoupled abstractions.
We are rendering a `<MentionSelect/>` underneath our `<Editable/>`.
The `MentionSelect` is used to render a dropdown of mentions for the user to select from.
`useSlateWithExtensions` does not handle rendering so if you want to render components you need to specify them yourself.
The mention extension can still manage all of the logic for rendering the `MentionSelect` by using [prop getters](https://kentcdodds.com/blog/how-to-give-rendering-control-to-users-with-prop-getters) to pass props to the `MentionSelect`.

This pattern is _very composable_.
We can think about high level rendering in our Rich Text Editor component, and we can think about low level rendering and behavior in our extensions.

```tsx
import { Editable, Slate } from 'slate-react';
import { useSlateState, useSlateWithExtensions } from 'useSlateWithExtensions';

const Mentions = () => {
  const [value, onChange] = useSlateState();

  // create the mention extension
  const { getMentionSelectProps, ...MentionExtension } = useMentionExtension();

  // create the slate editor with the extension
  const { getSlateProps, getEditableProps } = useSlateWithExtensions({
    value,
    onChange,
    extensions: [MentionExtension], // pass the extension to the hook
  });

  return (
    <Slate {...getSlateProps()}>
      <Editable {...getEditableProps()} />
      {/* render a drop down which has access to the mention extension through it's props */}
      <MentionSelect {...getMentionSelectProps()} />
    </Slate>
  );
};
```

### Highlights

In this example we are using `useHighlightExtension` and `SearchBar` from [the highlights example](./stories/Highlights.stories.tsx).
This example is similar to mentions.
All of the low level logic for highlights is contained in the highlight extension.
The only thing we need to do is render a search bar and we're done!

```tsx
import { Editable, Slate } from 'slate-react';
import { useSlateState, useSlateWithExtensions } from 'useSlateWithExtensions';

const Highlights = () => {
  const [value, onChange] = useSlateState(initialValue);

  // define the extension
  const { getSearchBarProps, ...highlightExtension } = useHighlightExtension(
    'search' // initial search value
  );

  // create slate with the extension
  const { getEditableProps, getSlateProps } = useSlateWithExtensions({
    onChange,
    value,
    extensions: [highlightExtension],
  });

  // render the extension and the search bar
  return (
    <Slate {...getSlateProps()}>
      <SearchBar {...getSearchBarProps()} />
      <br />
      <Editable {...getEditableProps()} />
    </Slate>
  );
};
```

### Mentions and Highlights

`useSlateWithExtensions` is really nice when you want to put extensions together.
We've already seen highlights and mentions, but what happens when we want to combine them?
With `useSlateWithExtensions` the combination is trivial.
We create the extensions we want to use, pass the extensions to `useSlateWithExtensions`, and render any necessary visual components.
`SlateExtension`s are composable, encapsulated, and decoupled.

```tsx
import { Editable, Slate } from 'slate-react';
import { useSlateState, useSlateWithExtensions } from 'useSlateWithExtensions';

const MentionsAndHighlights = () => {
  const [value, onChange] = useSlateState(initialValue);

  // define the extensions
  const { getSearchBarProps, ...highlightExtension } = useHighlightExtension(
    'search'
  );
  const { getMentionSelectProps, ...mentionExtension } = useMentionExtension();

  // create slate with the extensions
  const { getEditableProps, getSlateProps } = useSlateWithExtensions({
    onChange,
    value,
    extensions: [highlightExtension, mentionExtension],
  });

  // render the search bar and the mention select
  return (
    <Slate {...getSlateProps()}>
      <SearchBar {...getSearchBarProps()} />
      <br />
      <Editable {...getEditableProps()} />
      <MentionSelect {...getMentionSelectProps()} />
    </Slate>
  );
};
```

## Documentation

The documentation is in the doc comments of the source code.
I've added links to all the important functions below.

### SlateExtension Functions

- Editable API
  - [isInline](./src/types/IsInline.ts)
  - [isVoid](./src/types/IsVoid.ts)
  - [onChange](./src/types/OnChange.ts)
- Editor API
  - [renderElement](./src/types/RenderElement.ts)
  - [renderLeaf](./src/types/RenderLeaf.ts)
  - [onKeyDown](./src/types/OnKeyDown.ts)
  - [decorate](./src/types/Decorate.ts)
  - [onDOMBeforeInput](./src/types/OnDOMBeforeInput.ts)

### useSlateWithExtensionsOptions

- [useSlateWithExtensionsOptions](./src/types/useSlateWithExtensionsOptions.tsx)

### SlateExtension Interface

- [SlateExtension](./src/core/types/SlateExtension.ts)

## Using existing slate plugins with SlateExtensions

**withHistory** now works with `useSlateWithExtensions`. I've left the code below to explain how a plugin might not work with `useSlateWithExtensions`.
Read on to figure out how to make your own plugins work with _useSlateWithExtensions_.

Most of the time you should be able to pass your existing plugins to _useSlateWithExtensions_ without any modification.
However under certain circumstances you may need to modify your plugin in order for it to work with _useSlateWithExtensions_

Internally Slate expects the `Editor` object be stable across renders.
The official Slate documentation recommends creating stable editor with a `useMemo` hook that has an empty dependencies array.

```tsx
const editor = useMemo(() => withHistory(withReact(createEditor())), []);
```

Unfortunately if you create the editor like this it is impossible to use plugins which have dependencies. The dependencies would have to go into the dependencies array of `useMemo` and the `Editor` object would no longer be stable across renders.

_useSlateWithExtensions_ implements two changes which allow plugins to have dependencies while still ensuring that the `Editor` object is stable across renders.

### Changes with Default Slate Plugins

1. Before the list of plugins passed to the _useSlateWithExtensions_ options are applied all of the official functions on the `Editor` object are reset to their original state. The list of reset functions is included here for reference.
   ```tsx
   // editor functions which are reset
   isInline: (element: Element) => boolean;
   isVoid: (element: Element) => boolean;
   normalizeNode: (entry: NodeEntry) => void;
   onChange: () => void;
   addMark: (key: string, value: any) => void;
   apply: (operation: Operation) => void;
   deleteBackward: (unit: 'character' | 'word' | 'line' | 'block') => void;
   deleteForward: (unit: 'character' | 'word' | 'line' | 'block') => void;
   deleteFragment: () => void;
   getFragment: () => Descendant[];
   insertBreak: () => void;
   insertFragment: (fragment: Node[]) => void;
   insertNode: (node: Node) => void;
   insertText: (text: string) => void;
   removeMark: (key: string) => void;
   ```
2. The plugins are reapplied to the `editor` object whenever `pluginDependencies` changes or a dependency of any `editor` function changes (i.e. an extensions `onChangeDeps`).

In plain english these changes mean that _plugin functions may be invoked multiple times on the same editor object_ and _all built in editor functions are reset on each invocation of the plugin_.

These changes can cause some bugs with existing plugins.
In the next section I examine the official `withHistory` plugin, show you how it breaks, and explain how you can easily fix it to work with _useSlateWithExtensions_.

**Modifying the withHistory plugin to work with useSlateWithExtensions**

The default `withHistory` plugin does not work with _useSlateWithExtensions_.
In order to figure out how to fix `withHistory` let's first use some pseudo code to understand how `withHistory` works.

```tsx
//  with history works like any other plugin
// it takes the editor as input and returns a modified editor as output
const withHistory = (editor: Editor): Editor => {
  // the history plugin needs a place to store the editor history
  // because the editor is a singleton the history plugin just creates
  // a history property on the editor
  editor.history = {};
  // the history plugin adds two new functions to the editor for
  // undoing and redoing changes
  editor.undo = () => {}; // omitted
  editor.redo = () => {}; // omitted
  // the history plugin overrides the editor's builtin apply function
  // to record a history of applied changes
  const { apply } = editor;
  editor.apply = () => {
    apply();
  }; // omitted
  return editor;
};
```

In _useSlateWithExtensions_ the `withHistory` plugin may be called multiple times on the same editor.
If we look at the pseudo code for `withHistory`, every time `withHistory` is called the plugin sets the `history` property on the editor to an empty object.
Normally this is ok, but _useSlateWithExtensions_ may call `withHistory` more than once with the same `Editor` object.
On those subsequent calls any existing history stored in the `history` property will be overwritten by `editor.history = {}`.

If we owned this plugin we could solve this problem easily.
We could simply check to see if `history` has already been set ono the passed in `Editor` object and. If the `history` property is set then we don't override it.

```tsx
// prevent overwriting previously stored history
if (editor.history === undefined) {
  editor.history = {};
}
```

The rest of the plugin works without any modification because of the first change.

> 1. Before the list of plugins passed to the _useSlateWithExtensions_ options are applied all of the official functions on the `Editor` object are reset to their original state.

Normally if you call a plugin multiple times you would have to use `useEffect` to clean up your modifications to the editor.

```tsx
// what you would normally have to do to override a built in editor function
useEffect(() => {
  // get the current editor apply function
  const { apply } = editor;
  // insert our plugin in the apply function
  editor.apply = () => {
    apply();
  };
  // clean up by setting the apply function to it's original value
  return () => {
    editor.apply = apply;
  };
});
```

However because the `apply` function is guaranteed to be reset for you whenever the plugin is called you can skip the clean up and write a pure plugin.

```tsx
// get the current editor apply function
const { apply } = editor;
// insert our plugin in the apply function
editor.apply = () => {
  apply();
};
```

The `undo` and `redo` functions created by the `withHistory` plugin will not be reset for you.
But they are pure and can be overwritten safely.

Now we've proposed a fix which works if we can modify the `withHistory` source code but what if we can't modify the source code?

First let's pseudo code a naive solution which looks like the previous code but doesn't quite work.
We'll create a new hook `withHistoryStableNaive` which wraps the official `withHistory` plugin and tries to prevent overwriting previously stored history.

```tsx
const withHistoryStableNaive = (editor: Editor): Editor => {
  if (editor.history) {
    return editor;
  } else {
    return withHistory(editor);
  }
};
```

We first check to see if thee editor has a `history` property. If the editor has a `history` property then we assume that `withHistory` has already been called on the passed in `Editor` object. Otherwise we add history functionality to the editor by calling `withHistory`.

This will not work! Let's remember our first change.

> 1. Before the list of plugins passed to the _useSlateWithExtensions_ options are applied all of the official functions on the `Editor` object are reset to their original state.

The problem is `withHistory` overrides `editor.apply` which is an official editor function.
The second time `withHistoryStableNaive` is called the `editor.apply` function has been reset to it's original state and we lose the `editor.apply` override.

What we really want to do is keep a reference to any existing `history` property on the passed in `Editor` object.
Then apply the `withHistory` plugin to the editor.
Then set the `history` property to the previously stored history.

```tsx
const withHistoryStable = (editor: Editor): Editor => {
  if (editor.history) {
    // get the reference to editor.history
    const { history } = editor;
    // apply the plugin (overwriting editor.history)
    editor = withHistory(editor);
    // restore editor.history
    editor.history = history;
  } else {
    editor = withHistory(editor);
  }
  return editor;
};
```

This plugin actually works and is less than 15 lines of code with comments.
`useSlateWithExtensions` previously exposed this plugin as a helper method.
Now you can add `withHistory` as a `prePlugin`.

Hopefully you can see that it isn't very hard to modify plugins to work with `useSlateWithExtensions` as long as you are careful, methodical, and aware of the two changes `useSlateWithExtensions` makes.

## Road map

- [ ] Implement hooks for the following methods in extensions
  - [x] Editor functions
    - [x] high level overrideable behaviors
      - [x] isInline: (element: Element) => boolean;
      - [x] isVoid: (element: Element) => boolean;
      - [x] normalizeNode: (entry: NodeEntry) => void;
      - [x] onChange: () => void;
    - [x] low level overrideable behaviors
      - [x] addMark: (key: string, value: any) => void;
      - [x] apply: (operation: Operation) => void;
      - [x] deleteBackward: (unit: 'character' | 'word' | 'line' | 'block') => void;
      - [x] deleteForward: (unit: 'character' | 'word' | 'line' | 'block') => void;
      - [x] deleteFragment: () => void;
      - [x] getFragment: () => Descendant[];
      - [x] insertBreak: () => void;
      - [x] insertFragment: (fragment: Node[]) => void;
      - [x] insertNode: (node: Node) => void;
      - [x] insertText: (text: string) => void;
      - [x] removeMark: (key: string) => void;
  - [x] Editable functions
    - [x] decorate?: (entry: NodeEntry) => Range[];
    - [x] onDOMBeforeInput?: (event: Event) => void;
    - [x] onKeyDown?: (event: Event) => boolean | undefined;
    - [x] renderElement?: (props: RenderElementProps) => JSX.Element;
    - [x] renderLeaf?: (props: RenderLeafProps) => JSX.Element;
  - [x] implement a slate with extensions hook which returns `Slate` and `Editable`. The user can then render their own components within the `Slate` provider. The hook can be used to implement the `SlateWithExtensions` component.
  - [x] add pipeline for `withPlugins` such as `withReact` and `withHistory`
- [ ] Translate remaining functions into middleware implementations
  - [ ] decorate?: (entry: NodeEntry) => Range[];
  - [ ] renderElement?: (props: RenderElementProps) => JSX.Element;
  - [ ] renderLeaf?: (props: RenderLeafProps) => JSX.Element;

## Contributing

This project is created using `tsdx`.
See the [tsdx-readme](./tsdx-readme.md) for instructions about running storybook, tests, examples, etc...

## Publishing

To cut a release

1. run `yarn release`
2. run `git push --follow-tags origin master && yarn publish`.

To dry run a release run `yarn release --dry-run`
