import { useCallback, useState } from 'react';
import { Descendant } from 'slate';
import { useSlateWithExtensionsOptions } from '..';

/**
 * Simple hook to manage slate state using react.
 * @param initialState the initial slate state
 */
export const useSlateState = (
  initialState?: Descendant[]
): [Descendant[], (value: Descendant[]) => void] => {
  const defaultInitialState: Descendant[] = [{ children: [{ text: '' }] }];
  const [value, setValue] = useState(initialState ?? defaultInitialState);
  const onChange = useCallback<useSlateWithExtensionsOptions['onChange']>(
    newValue => {
      setValue(newValue);
    },
    []
  );
  return [value, onChange];
};
