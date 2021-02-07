import { Meta, Story } from '@storybook/react/types-6-0';
import React, { useCallback, useState } from 'react';
import { Descendant, Range, Text } from 'slate';
import { Editable, Slate } from 'slate-react';
import { SlateExtension, useSlateState, useSlateWithExtensions } from '../.';

export default {
  title: 'Examples/Highlights',
} as Meta;

export const Default: Story = () => {
  const [value, onChange] = useSlateState(initialValue);

  // define the extension
  const { getSearchBarProps, ...highlightExtension } = useHighlightExtension(
    'search'
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

export const useHighlightExtension = (
  initialSearch?: string
): SlateExtension & {
  getSearchBarProps: () => SearchBarProps;
} => {
  // state for the search text
  const [search, setSearch] = useState<string | undefined>(initialSearch);

  // decorate function for highlighting search text
  const decorate = useCallback<NonNullable<SlateExtension['decorate']>>(
    ([node, path]) => {
      const ranges: Range[] = [];

      if (search && Text.isText(node)) {
        const { text } = node;
        const parts = text.split(search);
        let offset = 0;

        parts.forEach((part, i) => {
          if (i !== 0) {
            ranges.push({
              anchor: { path, offset: offset - search.length },
              focus: { path, offset },
              highlight: true,
            });
          }

          offset = offset + part.length + search.length;
        });
      }

      return ranges;
    },
    [search]
  );

  // render leaf for rendering search text
  const renderLeaf = useCallback<NonNullable<SlateExtension['renderLeaf']>>(
    ({ leaf, children }) => {
      if (leaf.highlight) {
        return <span style={{ backgroundColor: '#ffeeba' }}>{children}</span>;
      }
    },
    []
  );

  // create the search bar props
  const getSearchBarProps = useCallback<() => SearchBarProps>(
    () => ({
      onSearchChange: setSearch,
      search: search ?? '',
    }),
    [search]
  );

  return {
    decorate,
    decorateDeps: [decorate],
    renderLeaf,
    renderLeafDeps: [renderLeaf],
    getSearchBarProps,
  };
};

interface SearchBarProps {
  search: string;
  onSearchChange: (search: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  search,
  onSearchChange,
}) => {
  return (
    <label>
      Search Text{'  '}
      <input
        type="text"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
      />
    </label>
  );
};

const initialValue: Descendant[] = [
  {
    children: [
      {
        text:
          'This is editable text that you can search. As you search, it looks for matching strings of text, and adds ',
      },
      { text: 'decorations' },
      { text: ' to them in realtime.' },
    ],
  },
  {
    children: [
      { text: 'Try it out for yourself by typing in the search box above!' },
    ],
  },
];
