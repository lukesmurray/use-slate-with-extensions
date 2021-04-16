import { useCallback, useMemo, useState } from 'react';
import { createEditor, Editor } from 'slate';
import { withHistory } from 'slate-history';
import { ReactEditor, withReact } from 'slate-react';
import { defaultInitialState, FunctionProperties, pipe } from '../../common';
import {
  EditableWithExtensionsProps,
  SlateWithExtensionsProps,
  UseSlateWithExtensionsOptions,
  UseSlateWithExtensionsResult,
} from '../types';
import {
  decorateExtensions,
  renderElementExtensions,
  renderLeafExtensions,
  useEditableEventExtensionsPlugin,
  useEditorMethodExtensionsPlugin,
} from '../utils';

export const useSlateWithExtensions = (
  options?: UseSlateWithExtensionsOptions
): UseSlateWithExtensionsResult => {
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

  const prePlugins = useMemo(
    () => options?.prePlugins ?? [withReact, withHistory], // default plugins
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const postPlugins = useMemo(
    () => options?.postPlugins ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...(options?.postPluginDeps ?? [])]
  );

  // create the editor as a singleton
  // see https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
  const [editorSingleton] = useState(
    () =>
      pipe(
        options?.editor ?? (createEditor() as any),
        ...prePlugins
      ) as ReactEditor
  );

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
      insertData: editorSingleton.insertData,
      setFragmentData: editorSingleton.setFragmentData,
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
  const insertDataPlugin = useEditorMethodExtensionsPlugin(
    extensions,
    'insertData'
  );
  const setFragmentDataPlugin = useEditorMethodExtensionsPlugin(
    extensions,
    'setFragmentData'
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
      insertDataPlugin,
      setFragmentDataPlugin,
      ...postPlugins
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
    insertDataPlugin,
    insertFragmentPlugin,
    insertNodePlugin,
    insertTextPlugin,
    isInlinePlugin,
    isVoidPlugin,
    normalizeNodePlugin,
    onChangePlugin,
    postPlugins,
    removeMarkPlugin,
    setFragmentDataPlugin,
  ]);

  const getSlateProps = useCallback((): SlateWithExtensionsProps => {
    return {
      editor,
      onChange,
      value,
    };
  }, [editor, onChange, value]);

  // create the callbacks for the editable
  const onKeyDown = useEditableEventExtensionsPlugin(
    editor,
    extensions,
    'onKeyDown'
  );
  const onDOMBeforeInput = useEditableEventExtensionsPlugin(
    editor,
    extensions,
    'onDOMBeforeInput'
  );
  const onBlur = useEditableEventExtensionsPlugin(editor, extensions, 'onBlur');
  const onClick = useEditableEventExtensionsPlugin(
    editor,
    extensions,
    'onClick'
  );
  const onCompositionEnd = useEditableEventExtensionsPlugin(
    editor,
    extensions,
    'onCompositionEnd'
  );
  const onCompositionUpdate = useEditableEventExtensionsPlugin(
    editor,
    extensions,
    'onCompositionUpdate'
  );
  const onCompositionStart = useEditableEventExtensionsPlugin(
    editor,
    extensions,
    'onCompositionStart'
  );
  const onCopy = useEditableEventExtensionsPlugin(editor, extensions, 'onCopy');
  const onCut = useEditableEventExtensionsPlugin(editor, extensions, 'onCut');
  const onDragOver = useEditableEventExtensionsPlugin(
    editor,
    extensions,
    'onDragOver'
  );
  const onDragStart = useEditableEventExtensionsPlugin(
    editor,
    extensions,
    'onDragStart'
  );
  const onDrop = useEditableEventExtensionsPlugin(editor, extensions, 'onDrop');
  const onFocus = useEditableEventExtensionsPlugin(
    editor,
    extensions,
    'onFocus'
  );
  const onPaste = useEditableEventExtensionsPlugin(
    editor,
    extensions,
    'onPaste'
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderElement = useCallback(renderElementExtensions(extensions), [
    ...extensions.flatMap(e => e.renderElementDeps ?? []),
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderLeaf = useCallback(renderLeafExtensions(extensions), [
    ...extensions.flatMap(e => e.renderLeafDeps ?? []),
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
      onBlur,
      onClick,
      onCompositionEnd,
      onCompositionStart,
      onCompositionUpdate,
      onCopy,
      onCut,
      onPaste,
      onDragOver,
      onDragStart,
      onDrop,
      onFocus,
    };
  }, [
    decorate,
    onBlur,
    onClick,
    onCompositionEnd,
    onCompositionStart,
    onCompositionUpdate,
    onCopy,
    onCut,
    onDOMBeforeInput,
    onDragOver,
    onDragStart,
    onDrop,
    onFocus,
    onKeyDown,
    onPaste,
    renderElement,
    renderLeaf,
  ]);

  return {
    getEditableProps,
    getSlateProps,
    editor,
  };
};
