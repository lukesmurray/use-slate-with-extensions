# Structuring an Extension

A good way to build your extensions is in a single folder.
The extension is returned by a hook `useExtensionName`.
The hook can be defined at the top level of the folder.
Within the folder you can organize utility methods used by your extension with the following structure.

- Transforms
  - Used to modify the contents of the document
- Queries
  - Used to query the document semantically.
- Elements
  - Functions used to render leaves and elements
- Components
  - Auxiliary components rendered outside the editor such as toolbars.
- Decorators
  - Decorator functions
- Normalizers
  - Decorator functions
