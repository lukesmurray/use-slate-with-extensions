import { useCallback, useMemo, useState } from 'react';
import { createEditor, Editor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import { defaultInitialState, FunctionProperties, pipe } from '../../common';
import { withHistoryStable } from '../plugins';
import {
  EditableWithExtensionsProps,
  SlateWithExtensionsProps,
  useSlateWithExtensionsOptions,
  useSlateWithExtensionsResult,
} from '../types';
import {
  decorateExtensions,
  onDOMBeforeInputExtensions,
  onKeyDownExtensions,
  renderElementExtensions,
  renderLeafExtensions,
  useInsertBreakExtensionsPlugin,
  useInsertTextExtensionsPlugin,
  useIsInlineExtensionsPlugin,
  useIsVoidExtensionsPlugin,
  useOnChangeExtensionsPlugin,
} from '../utils';

export const useSlateWithExtensions = (
  options?: useSlateWithExtensionsOptions
): useSlateWithExtensionsResult => {
  const [uncontrolledValue, setUncontrolledValue] = useState(
    options?.initialState ?? defaultInitialState
  );
  // get the memoized properties from options
  const onChange = useMemo(() => options?.onChange ?? setUncontrolledValue, [
    options?.onChange,
  ]);
  const value = useMemo(() => options?.value ?? uncontrolledValue, [
    options?.value,
    uncontrolledValue,
  ]);
  const extensions = useMemo(() => options?.extensions ?? [], [
    options?.extensions,
  ]);
  const plugins = useMemo(
    () => options?.plugins ?? [withReact, withHistoryStable], // default plugins
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...(options?.pluginsDeps ?? [])]
  );

  // create the editor as a singleton
  // see https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
  const [editorSingleton] = useState(() => options?.editor ?? createEditor());

  // memoize the original functions from the editor
  const editorFunctions: FunctionProperties<Editor> = useMemo(() => {
    return {
      isInline: editorSingleton.isInline,
      isVoid: editorSingleton.isVoid,
      normalizeNode: editorSingleton.normalizeNode,
      onChange: editorSingleton.onChange,
      addMark: editorSingleton.addMark,
      apply: editorSingleton.apply,
      deleteBackward: editorSingleton.deleteBackward,
      deleteForward: editorSingleton.deleteForward,
      deleteFragment: editorSingleton.deleteFragment,
      getFragment: editorSingleton.getFragment,
      insertBreak: editorSingleton.insertBreak,
      insertFragment: editorSingleton.insertFragment,
      insertNode: editorSingleton.insertNode,
      insertText: editorSingleton.insertText,
      removeMark: editorSingleton.removeMark,
    };
  }, [editorSingleton]);

  // create plugins for the extension editor methods
  const isInlinePlugin = useIsInlineExtensionsPlugin(extensions, [
    ...extensions.flatMap(e => e.isInlineDeps ?? []),
  ]);
  const isVoidPlugin = useIsVoidExtensionsPlugin(extensions, [
    ...extensions.flatMap(e => e.isVoidDeps ?? []),
  ]);
  const onChangePlugin = useOnChangeExtensionsPlugin(extensions, [
    ...extensions.flatMap(e => e.onChangeDeps ?? []),
  ]);

  const insertBreakPlugin = useInsertBreakExtensionsPlugin(extensions, [
    ...extensions.flatMap(e => e.insertBreakDeps ?? []),
  ]);

  const insertTextPlugin = useInsertTextExtensionsPlugin(extensions, [
    ...extensions.flatMap(e => e.insertTextDeps ?? []),
  ]);

  // apply the plugins to the editor
  const editor = useMemo(() => {
    // before applying plugins reset the editor functions
    for (let [key, value] of Object.entries(editorFunctions)) {
      (editorSingleton as any)[key] = value;
    }
    return pipe(
      editorSingleton,
      isInlinePlugin,
      isVoidPlugin,
      onChangePlugin,
      insertBreakPlugin,
      insertTextPlugin,
      ...plugins
    ) as ReactEditor;
  }, [
    editorFunctions,
    editorSingleton,
    insertBreakPlugin,
    insertTextPlugin,
    isInlinePlugin,
    isVoidPlugin,
    onChangePlugin,
    plugins,
  ]);

  const getSlateProps = useCallback((): SlateWithExtensionsProps => {
    return {
      editor,
      onChange,
      value,
    };
  }, [editor, onChange, value]);

  // create the callbacks for the editable

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderElement = useCallback(renderElementExtensions(extensions), [
    ...extensions.flatMap(e => e.renderElementDeps ?? []),
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderLeaf = useCallback(renderLeafExtensions(extensions), [
    ...extensions.flatMap(e => e.renderLeafDeps ?? []),
    // see https://github.com/ianstormtaylor/slate/pull/3437
    // render leaf cannot be memoized unless the decorate deps are passed to it
    ...extensions.flatMap(e => e.decorateDeps ?? []),
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onKeyDown = useCallback(onKeyDownExtensions(editor, extensions), [
    ...extensions.flatMap(e => e.onKeyDownDeps ?? []),
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const decorate = useCallback(decorateExtensions(editor, extensions), [
    ...extensions.flatMap(e => e.decorateDeps ?? []),
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onDOMBeforeInput = useCallback(
    onDOMBeforeInputExtensions(editor, extensions),
    [...extensions.flatMap(e => e.onDOMBeforeInputDeps ?? [])]
  );

  const getEditableProps = useCallback((): EditableWithExtensionsProps => {
    return {
      renderElement,
      renderLeaf,
      onKeyDown,
      decorate,
      onDOMBeforeInput,
    };
  }, [decorate, onDOMBeforeInput, onKeyDown, renderElement, renderLeaf]);

  return {
    getEditableProps,
    getSlateProps,
    editor,
  };
};
