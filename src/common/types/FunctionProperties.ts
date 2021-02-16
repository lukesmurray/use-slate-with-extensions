import { FunctionPropertyNames } from './FunctionPropertyNames';

/**
 * Get the properties from an interface which are functions
 */
export type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;
