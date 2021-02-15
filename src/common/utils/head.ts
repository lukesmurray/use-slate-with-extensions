/**
 * Get all elements from a tuple type except the last
 */
export type Head<T extends any[]> = T extends [...(infer Head), any]
  ? Head
  : any[];
