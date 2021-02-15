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
  renderElementExtensions,
  renderLeafExtensions,
  useEditorMethodExtensionsPlugin,
  useOnDOMBeforeInputHandler,
  useOnKeyDownHandler,
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
  const isInlinePlugin = useEditorMethodExtensionsPlugin(
    extensions,
    'isInline'
  );
  const isVoidPlugin = useEditorMethodExtensionsPlugin(extensions, 'isVoid');
  const normalizeNodePlugin = useEditorMethodExtensionsPlugin(
    extensions,
    'normalizeNode'
  );
  const onChangePlugin = useEditorMethodExtensionsPlugin(
    extensions,
    'onChange'
  );
  const addMarkPlugin = useEditorMethodExtensionsPlugin(extensions, 'addMark');
  const applyPlugin = useEditorMethodExtensionsPlugin(extensions, 'apply');
  const deleteBackwardPlugin = useEditorMethodExtensionsPlugin(
    extensions,
    'deleteBackward'
  );
  const deleteForwardPlugin = useEditorMethodExtensionsPlugin(
    extensions,
    'deleteForward'
  );
  const deleteFragmentPlugin = useEditorMethodExtensionsPlugin(
    extensions,
    'deleteFragment'
  );
  const getFragmentPlugin = useEditorMethodExtensionsPlugin(
    extensions,
    'getFragment'
  );
  const insertBreakPlugin = useEditorMethodExtensionsPlugin(
    extensions,
    'insertBreak'
  );
  const insertFragmentPlugin = useEditorMethodExtensionsPlugin(
    extensions,
    'insertFragment'
  );
  const insertNodePlugin = useEditorMethodExtensionsPlugin(
    extensions,
    'insertNode'
  );
  const insertTextPlugin = useEditorMethodExtensionsPlugin(
    extensions,
    'insertText'
  );
  const removeMarkPlugin = useEditorMethodExtensionsPlugin(
    extensions,
    'removeMark'
  );

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
      normalizeNodePlugin,
      onChangePlugin,
      addMarkPlugin,
      applyPlugin,
      deleteBackwardPlugin,
      deleteForwardPlugin,
      deleteFragmentPlugin,
      getFragmentPlugin,
      insertBreakPlugin,
      insertFragmentPlugin,
      insertNodePlugin,
      insertTextPlugin,
      removeMarkPlugin,
      ...plugins
    ) as ReactEditor;
  }, [
    addMarkPlugin,
    applyPlugin,
    deleteBackwardPlugin,
    deleteForwardPlugin,
    deleteFragmentPlugin,
    editorFunctions,
    editorSingleton,
    getFragmentPlugin,
    insertBreakPlugin,
    insertFragmentPlugin,
    insertNodePlugin,
    insertTextPlugin,
    isInlinePlugin,
    isVoidPlugin,
    normalizeNodePlugin,
    onChangePlugin,
    plugins,
    removeMarkPlugin,
  ]);

  const getSlateProps = useCallback((): SlateWithExtensionsProps => {
    return {
      editor,
      onChange,
      value,
    };
  }, [editor, onChange, value]);

  // create the callbacks for the editable
  const onKeyDown = useOnKeyDownHandler(editor, extensions);
  const onDOMBeforeInput = useOnDOMBeforeInputHandler(editor, extensions);

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
  const decorate = useCallback(decorateExtensions(editor, extensions), [
    ...extensions.flatMap(e => e.decorateDeps ?? []),
  ]);

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
