import { Head } from '.';

export function compose<T extends (...args: any) => any>(...middleware: T[]) {
  if (middleware.length === 0) {
    throw new Error('must pass at least one middleware to compose');
  }
  // skipped type checking code here
  return function<A extends Head<Parameters<T>>, R extends ReturnType<T>>(
    ...middlewareArgs: A
  ): R {
    // last called middleware #
    let index = -1;

    // dispatch(i) returns a curried function which accepts the middleware args
    // and calls the ith middleware
    const dispatch = (i: number) => (...middlewareArgs: A): R => {
      if (i <= index) {
        throw new Error('next() called multiple times');
      }
      index = i;
      let fn = middleware[i];
      if (i >= middleware.length) {
        throw new Error(
          'next() called on last middleware. No next middleware to run.'
        );
      }
      try {
        return fn(
          ...middlewareArgs,
          i < middleware.length - 1 ? dispatch.call(null, i + 1) : undefined
        );
      } catch (err) {
        throw err;
      }
    };

    return dispatch(0)(...middlewareArgs);
  };
}
