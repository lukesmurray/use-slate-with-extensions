import { Meta, Story } from '@storybook/react/types-6-0';
import React, { useEffect, useState } from 'react';
import { Descendant } from 'slate';
import { Editable, Slate } from 'slate-react';
import { useSlateState, useSlateWithExtensions } from '../dist';
import { SearchBar, useHighlightExtension } from './Highlights.stories';
import { MentionSelect, useMentionExtension } from './Mentions.stories';

export default {
  title: 'Examples/PluginDeps',
} as Meta;

export const Default: Story = () => {
  const [value, onChange] = useSlateState();
  const pluginsDeps = useContrivedPluginDeps(value, 0.2);

  const { getEditableProps, getSlateProps } = useSlateWithExtensions({
    onChange,
    value,
    pluginsDeps,
  });

  return (
    <Slate {...getSlateProps()}>
      <Editable
        {...getEditableProps()}
        placeholder={
          'This editor updates randomly changes pluginDeps on some changes'
        }
      />
    </Slate>
  );
};

export const WithMentionsAndHighlights: Story = () => {
  const [value, onChange] = useSlateState(initialValue);

  const pluginsDeps = useContrivedPluginDeps(value, 0.2);

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
    pluginsDeps,
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

/**
 * Contrived hook which updates the editor on some percentage of changes
 * @param value the current value of the editor
 * @param changePercent a value between 0 and 1 representing the percentage of changes that lead to plugin dep updates
 */
const useContrivedPluginDeps = (value: Descendant[], changePercent: number) => {
  // contrived example to update plugin dependencies
  const [pluginsDeps, setPluginsDeps] = useState([1]);

  useEffect(() => {
    if (Math.random() < 0.2) {
      setPluginsDeps(v => [v[0] + 1]);
      console.log('plugins deps changed', pluginsDeps);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return pluginsDeps;
};

const initialValue: Descendant[] = [
  {
    children: [
      {
        text:
          'This example show you how you might implement a simple @-mentions feature along with a search highlight feature',
      },
    ],
  },
  {
    children: [
      { text: 'Try mentioning characters, like ' },
      {
        type: 'mention',
        character: 'R2-D2',
        children: [{ text: '' }],
      },
      { text: ' or ' },
      {
        type: 'mention',
        character: 'Mace Windu',
        children: [{ text: '' }],
      },
      { text: '!' },
    ],
  },
  {
    children: [{ text: 'Try searching by typing in the search box above!' }],
  },
];
