import { createHyperscript } from 'slate-hyperscript';

// This allows tests to include Slate Nodes written in JSX without TypeScript complaining.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  namespace jsx.JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export const jsx = createHyperscript({
  elements: {},
  creators: {},
});
