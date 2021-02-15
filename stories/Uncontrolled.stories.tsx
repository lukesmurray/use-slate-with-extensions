import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { Editable, Slate } from 'slate-react';
import { useSlateWithExtensions } from '../dist';

export default {
  title: 'Examples/Uncontrolled',
} as Meta;

export const Default: Story = () => {
  const { getEditableProps, getSlateProps } = useSlateWithExtensions({
    initialState: [
      { children: [{ text: 'This is an uncontrolled slate object' }] },
    ],
  });

  return (
    <Slate {...getSlateProps()}>
      <Editable {...getEditableProps()} />
    </Slate>
  );
};
