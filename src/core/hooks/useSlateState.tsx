import { useCallback, useState } from 'react';
import { Descendant } from 'slate';
import { UseSlateWithExtensionsOptions } from '../../core';
import { defaultInitialState } from '../data';

/**
 * Simple hook to manage slate state using react.
 * @param initialState the initial slate state
 */
export const useSlateState = (
  initialState?: Descendant[]
): [Descendant[], (value: Descendant[]) => void] => {
  const [value, setValue] = useState(initialState ?? defaultInitialState);
  const onChange = useCallback<
    NonNullable<UseSlateWithExtensionsOptions['onChange']>
  >(newValue => {
    setValue(newValue);
  }, []);
  return [value, onChange];
};
