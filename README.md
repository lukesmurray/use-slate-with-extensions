# Use Slate With Extensions

![npm](https://img.shields.io/npm/v/use-slate-with-extensions)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/use-slate-with-extensions)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

<!-- [Live Demo](https://use-slate-with-extensions.netlify.app/) -->

`useSlateWithExtensions` is a simple, powerful, and tiny (1.31 KB) hook which enables developers to create encapsulated and composable extensions which can access every part of the Slate API.

## Usage

The simplest example of `useSlateWithExtensions` is without any extensions at all.
All you need to do is provide a `value` and `onChange` callback similar to any other controlled component.

```tsx
import {
  useSlateWithExtensions,
  useSlateState,
} from 'use-slate-with-extensions';

// create the slate value and change handlers
const [value, onChange] = useSlateState();

// use the hook
const { getEditableProps, getSlateProps } = useSlateWithExtensions({
  onChange,
  value,
});

// render your Slate and Editable
return (
  <Slate {...getSlateProps()}>
    <Editable {...getEditableProps()} />
  </Slate>
);
```

It's really that easy to get started. But `useSlateWithExtensions` is much more interesting when you add extensions.

### Defining our first extension

Extensions are simply javascript objects which conform to the [`SlateExtension` interface](./src/types/SlateExtension.ts).
The interface is very similar to the `Slate` api and includes methods from `Editor` like `onChange` and `isVoid` and methods from `Editable` like `renderElement` and `decorate`.

Here is a simple extension which logs all of the editor operations on change.
We define an `onChange` handler and provide `onChangeDeps`.
If we want to override more functions then we can simply add handlers in our extension and return them.

```tsx
const useLogOperationsExtension = (): SlateExtension => {
  const onChange = useCallback(editor => {
    console.group('operations');
    editor.operations.forEach(op => console.log(op));
    console.groupEnd();
  }, []);

  return {
    onChange,
    onChangeDeps: [onChange],
  };
};
```

### Using our first extension

We can consume our extension by passing them to the `extensions` property on our `useSlateWithExtensions` hook.

```tsx
import {
  useSlateWithExtensions,
  useSlateState,
} from 'use-slate-with-extensions';

// create the slate value and change handlers
const [value, onChange] = useSlateState();

// create our extension
const logOperationsExtension = useLogOperationsExtension();

// call the useSlateWithExtensions hook
const { getEditableProps, getSlateProps } = useSlateWithExtensions({
  onChange, // pass our change handler
  value, // pass the current editor value
  extensions: [logOperationsExtension], // pass our extensions
});

// render slate and editable using the props provided by the hook
return (
  <Slate {...getSlateProps()}>
    <Editable {...getEditableProps()} />
  </Slate>
);
```

...And we've written our first extension!

The last two lines are the magic of `useSlateWithExtensions`.
Under the hood `useSlateWithExtensions` creates handlers for the `Slate` and `Editable` props.
These handlers do the hard work of calling the methods on all of your extensions.
`useSlateWithExtensions` could return `Slate` and `Editable` components for you to render.
However, returning props gives the user much more flexibility and power.
Check out the Mention and Highlight examples below to see some of this power for yourself.

**TLDR**

In order to use `useSlateWithExtensions` you just need to

1. Define your extensions
2. Pass your extensions to `useSlateWithExtensions`
3. Pass `getSlateProps()` and `getEditableProps()` to `Slate` and `Editable` respectively.

## Why

The built in Slate Plugins are amazing but they can only modify methods defined on the `Editor` interface such as `isInline`, `isVoid`, and `onChange`.
The Next-gen [Slate-Plugins](https://github.com/udecode/slate-plugins) are incredibly useful but they only allow the user to modify methods defined on the `Editable` interface such as `decorate`, `renderLeaf`, and `renderElement`.

<details><summary>*</summary>Next Gen slate plugins recently added partial support for isInline and isVoid by using string matching on the element type field and letting the user supply string arrays of inline types and void types. This is a step in the right direction but is less powerful than having direct access to all of the Editor apis.</details>

Unfortunately many of the common use cases for using Slate involve plugging into the methods defined on both the `Editor` and the `Editable` interfaces.
For instance [the mention example](https://github.com/ianstormtaylor/slate/blob/master/site/examples/mentions.tsx) from the docs uses a built in Slate Plugin to override `isInline` and `isVoid` on the `Editor` interface but has global functions to handle the `Editable` props `onKeyDown`, `onChange`, and `renderElement`.
If we want to add more custom behavior to the mention example we would probably have to modify these `OnKeyDown`, `OnChange` and `renderElement` implementations.
The result is a deeply coupled and monolithic mess.

_UseSlateWithExtensions_ gives users the ability to write `SlateExtension`s which access apis from both the `Editor` and `Editable` interfaces.
Because the entire `Slate` api is exposed in a single interface these extensions can provide self contained modules for implementing custom behavior in Slate.
The `useSlateWithExtensions` hook lets users easily combine various extensions together to create rich text editing experiences.
I've outlined several examples of using these extensions below, highlighting how these new extensions encapsulate behavior, lead to a nicely decoupled design, and are easily composable.

My hope is that this hook and the corresponding extensions can be used by the community to create a richer ecosystem of encapsulated Slate behaviors which can be easily adopted by developers.

## Examples

### Basic

In the basic example there are no extensions activated.
_UseSlateWithExtensions_ provides nice defaults such as automatically including `withReact` and `withHistory`.
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

The documentation is a work in progress but all of the logic and semantics is documented in doc comments on the interfaces.

**SlateExtension Functions**

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

**useSlateWithExtensionsOptions**

- [useSlateWithExtensionsOptions](./src/types/useSlateWithExtensionsOptions.tsx)

**SlateExtension Interface**

- [SlateExtension](./src/types/SlateExtension.ts)

## Road map

- [ ] Implement hooks for the following methods in extensions
  - [ ] Editor functions
    - [ ] high level overrideable behaviors
      - [x] isInline: (element: Element) => boolean;
      - [x] isVoid: (element: Element) => boolean;
      - [ ] normalizeNode: (entry: NodeEntry) => void;
      - [x] onChange: () => void;
    - [ ] low level overrideable behaviors
      - [ ] addMark: (key: string, value: any) => void;
      - [ ] apply: (operation: Operation) => void;
      - [ ] deleteBackward: (unit: 'character' | 'word' | 'line' | 'block') => void;
      - [ ] deleteForward: (unit: 'character' | 'word' | 'line' | 'block') => void;
      - [ ] deleteFragment: () => void;
      - [ ] getFragment: () => Descendant[];
      - [ ] insertBreak: () => void;
      - [ ] insertFragment: (fragment: Node[]) => void;
      - [ ] insertNode: (node: Node) => void;
      - [ ] insertText: (text: string) => void;
      - [ ] removeMark: (key: string) => void;
  - [x] Editable functions
    - [x] decorate?: (entry: NodeEntry) => Range[];
    - [x] onDOMBeforeInput?: (event: Event) => void;
    - [x] onKeyDown?: (event: Event) => boolean | undefined;
    - [x] renderElement?: (props: RenderElementProps) => JSX.Element;
    - [x] renderLeaf?: (props: RenderLeafProps) => JSX.Element;
  - [x] implement a slate with extensions hook which returns `Slate` and `Editable`. The user can then render their own components within the `Slate` provider. The hook can be used to implement the `SlateWithExtensions` component.
  - [x] add pipeline for `withPlugins` such as `withReact` and `withHistory`
