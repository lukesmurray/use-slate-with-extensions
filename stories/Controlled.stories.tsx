import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { Editable, Slate } from 'slate-react';
import { useSlateState, useSlateWithExtensions } from '../dist';

export default {
  title: 'Examples/Controlled',
} as Meta;

export const Default: Story = () => {
  const [value, onChange] = useSlateState([
    { children: [{ text: 'This is a controlled slate object' }] },
  ]);

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
