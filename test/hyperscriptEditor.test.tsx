/** @jsx jsx */
import { act, renderHook } from '@testing-library/react-hooks';
import { Editor } from 'slate';
import { useSlateWithExtensions } from '../dist';
import { jsx } from './jsx';

const input = (
  <editor>
    <element>
      hello
      <cursor />
    </element>
  </editor>
) as Editor;

const output = (
  <editor>
    <element>
      hello world
      <cursor />
    </element>
  </editor>
) as Editor;

it('should work', () => {
  const { result } = renderHook(() => {
    return useSlateWithExtensions({
      editor: input,
    });
  });

  act(() => {
    result.current.editor.insertText(' world');
  });

  expect(input.children).toEqual(output.children);
  expect(input.selection).toEqual(output.selection);
});
