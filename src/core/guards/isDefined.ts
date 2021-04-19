/**
 * A simple type guard which checks to see if a value is defined.
 * @param v the value to type-guard for defined.
 */
export function isDefined<T>(v?: T): v is NonNullable<T> {
  return v !== undefined && v !== null;
}
