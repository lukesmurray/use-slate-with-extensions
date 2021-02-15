import { Meta, Story } from '@storybook/react/types-6-0';
import React, { useCallback } from 'react';
import { Editable, Slate } from 'slate-react';
import { SlateExtension, useSlateState, useSlateWithExtensions } from '../.';

export default {
  title: 'Examples/LogOperations',
} as Meta;

export const Default: Story = () => {
  // create the slate value and change handlers
  const [value, onChange] = useSlateState();

  // create our extension
  const logOperationsExtension = useLogOperationsExtension();

  // call the hook with the extension
  const { getEditableProps, getSlateProps } = useSlateWithExtensions({
    onChange,
    value,
    extensions: [logOperationsExtension],
  });

  // render slate and editable using the props provided by the hook
  return (
    <Slate {...getSlateProps()}>
      <Editable {...getEditableProps()} />
    </Slate>
  );
};

const useLogOperationsExtension = (): SlateExtension => {
  const onChange = useCallback<NonNullable<SlateExtension['onChange']>>(
    (editor, next) => {
      console.group('operations');
      editor.operations.forEach(op => console.log(op));
      console.groupEnd();
      next(editor);
    },
    []
  );

  return {
    onChange,
    onChangeDeps: [onChange],
  };
};
