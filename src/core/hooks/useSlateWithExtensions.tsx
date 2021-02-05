import { useCallback, useMemo } from 'react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { ReactEditor, withReact } from 'slate-react';
import { pipe } from '../../common';
import {
  EditableWithExtensionsProps,
  SlateWithExtensionsProps,
  useSlateWithExtensionsOptions,
  useSlateWithExtensionsResult,
} from '../../core';
import {
  decorateExtensions,
  onDOMBeforeInputExtensions,
  onKeyDownExtensions,
  renderElementExtensions,
  renderLeafExtensions,
  useIsInlineExtensions,
  useIsVoidExtensions,
  useOnChangeExtensions,
} from '../utils';

export const useSlateWithExtensions = (
  options: useSlateWithExtensionsOptions
): useSlateWithExtensionsResult => {
  // get the memoized properties from options
  const onChange = useMemo(() => options.onChange, [options.onChange]);
  const value = useMemo(() => options.value, [options.value]);
  const extensions = useMemo(() => options.extensions ?? [], [
    options.extensions,
  ]);
  const plugins = useMemo(() => options.plugins ?? [withReact, withHistory], [
    options.plugins,
  ]);

  // create the editor
  const editor = useMemo(
    () => pipe(createEditor(), ...plugins) as ReactEditor,
    [plugins]
  );

  // add the high level overrideable behaviors to the editor
  useIsInlineExtensions(editor, extensions, [
    ...extensions.flatMap(e => e.isInlineDeps ?? []),
  ]);

  useIsVoidExtensions(editor, extensions, [
    ...extensions.flatMap(e => e.isVoidDeps ?? []),
  ]);

  useOnChangeExtensions(editor, extensions, [
    ...extensions.flatMap(e => e.onChangeDeps ?? []),
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
  };
};
