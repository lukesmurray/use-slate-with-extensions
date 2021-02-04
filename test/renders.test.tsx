import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Editable, Slate } from 'slate-react';
import { useSlateState, useSlateWithExtensions } from '../dist';

describe('useSlateWithExtensions', () => {
  it('renders without crashing', () => {
    const BasicExample = () => {
      // polyfill the window getSelection method
      (window as any).getSelection = () => {
        return {
          removeAllRanges: () => {},
        };
      };
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
    const div = document.createElement('div');
    ReactDOM.render(<BasicExample />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
