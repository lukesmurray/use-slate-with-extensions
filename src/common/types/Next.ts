import { Head } from '.';

export type Next<T extends (...args: any) => any> = (
  ...args: Head<Parameters<T>>
) => ReturnType<T>;
