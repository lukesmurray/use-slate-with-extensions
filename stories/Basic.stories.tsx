import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { Editable, Slate } from 'slate-react';
import { useSlateState, useSlateWithExtensions } from '../.';

export default {
  title: 'Examples/Basic',
} as Meta;

export const Default: Story = () => {
  const [value, onChange] = useSlateState();

  const { getEditableProps, getSlateProps } = useSlateWithExtensions({
    onChange,
    value,
  });

  return (
    <Slate {...getSlateProps()}>
      <Editable {...getEditableProps()} />
    </Slate>
  );
};
