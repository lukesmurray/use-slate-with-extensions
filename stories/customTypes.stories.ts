import 'slate';

// custom types for the highlighting example
declare module 'slate' {
  export interface CustomTypes {
    Range: { highlight?: boolean };
    Text: { highlight?: boolean };
  }
}

// custom types for the mention example
declare module 'slate' {
  export interface CustomTypes {
    Element: { type?: 'mention'; character?: string };
  }
}

export {};
