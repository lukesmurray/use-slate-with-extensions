import { Editor, NodeEntry, Range } from 'slate';
import { Decorate, SlateExtension } from '../types';

export const decorateExtensions = (
  editor: Editor,
  extensions: SlateExtension[]
) => (entry: NodeEntry) => {
  let ranges: Range[] = [];

  const addRanges = (newRanges: ReturnType<Decorate>) => {
    if (newRanges?.length) {
      ranges = [...ranges, ...newRanges];
    }
  };

  extensions.forEach(({ decorate }) => {
    decorate && addRanges(decorate(entry, editor));
  });

  return ranges;
};
