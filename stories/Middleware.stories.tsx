import { Meta, Story } from '@storybook/react/types-6-0';
import React, { useMemo } from 'react';
import { Editable, Slate } from 'slate-react';
import { SlateExtension, useSlateWithExtensions } from '../dist';

export default {
  title: 'Examples/Middleware',
} as Meta;

export const OnChange: Story = () => {
  const ext1 = useOnChangeExt('ext1');
  const ext2 = useOnChangeExt('ext2');
  const ext3 = useOnChangeExt('ext3');

  const extensions = useMemo(() => {
    return [ext1, ext2, ext3];
  }, [ext1, ext2, ext3]);

  const { getEditableProps, getSlateProps } = useSlateWithExtensions({
    extensions,
  });

  return (
    <Slate {...getSlateProps()}>
      <Editable {...getEditableProps()} />
    </Slate>
  );
};

export const OnKeyDown: Story = () => {
  const ext1 = useOnKeyDownExt('ext1');
  const ext2 = useOnKeyDownExt('ext2');
  const ext3 = useOnKeyDownExt('ext3');

  const extensions = useMemo(() => {
    return [ext1, ext2, ext3];
  }, [ext1, ext2, ext3]);

  const { getEditableProps, getSlateProps } = useSlateWithExtensions({
    extensions,
  });

  return (
    <Slate {...getSlateProps()}>
      <Editable {...getEditableProps()} />
    </Slate>
  );
};

export const IsInline: Story = () => {
  const ext1 = useIsInlineExt('ext1');
  const ext2 = useIsInlineExt('ext2');
  const ext3 = useIsInlineExt('ext3');

  const extensions = useMemo(() => {
    return [ext1, ext2, ext3];
  }, [ext1, ext2, ext3]);

  const { getEditableProps, getSlateProps } = useSlateWithExtensions({
    extensions,
  });

  return (
    <Slate {...getSlateProps()}>
      <Editable {...getEditableProps()} />
    </Slate>
  );
};

export const IsVoid: Story = () => {
  const ext1 = useIsVoidExt('ext1');
  const ext2 = useIsVoidExt('ext2');
  const ext3 = useIsVoidExt('ext3');

  const extensions = useMemo(() => {
    return [ext1, ext2, ext3];
  }, [ext1, ext2, ext3]);

  const { getEditableProps, getSlateProps } = useSlateWithExtensions({
    extensions,
  });

  return (
    <Slate {...getSlateProps()}>
      <Editable {...getEditableProps()} />
    </Slate>
  );
};

export const InsertBreak: Story = () => {
  const ext1 = useInsertBreakExt('ext1');
  const ext2 = useInsertBreakExt('ext2');
  const ext3 = useInsertBreakExt('ext3');

  const extensions = useMemo(() => {
    return [ext1, ext2, ext3];
  }, [ext1, ext2, ext3]);

  const { getEditableProps, getSlateProps } = useSlateWithExtensions({
    extensions,
  });

  return (
    <Slate {...getSlateProps()}>
      <Editable {...getEditableProps()} />
    </Slate>
  );
};

export const InsertText: Story = () => {
  const ext1 = useInsertTextExt('ext1');
  const ext2 = useInsertTextExt('ext2');
  const ext3 = useInsertTextExt('ext3');

  const extensions = useMemo(() => {
    return [ext1, ext2, ext3];
  }, [ext1, ext2, ext3]);

  const { getEditableProps, getSlateProps } = useSlateWithExtensions({
    extensions,
  });

  return (
    <Slate {...getSlateProps()}>
      <Editable {...getEditableProps()} />
    </Slate>
  );
};

const useOnChangeExt = (name: string): SlateExtension => {
  return {
    onChange: (e, n) => {
      console.log(name);
      n?.(e);
    },
  };
};

const useOnKeyDownExt = (name: string): SlateExtension => {
  return {
    onKeyDown: (ev, ed, n) => {
      console.log(name);
      n?.(ev, ed);
    },
  };
};

const useIsInlineExt = (name: string): SlateExtension => {
  return {
    isInline: (el, ed, n) => {
      console.log(name);
      return n(el, ed);
    },
  };
};

const useIsVoidExt = (name: string): SlateExtension => {
  return {
    isVoid: (el, ed, n) => {
      console.log(name);
      return n(el, ed);
    },
  };
};

const useInsertBreakExt = (name: string): SlateExtension => {
  return {
    insertBreak: (e, n) => {
      console.log(name);
      return n(e);
    },
  };
};

const useInsertTextExt = (name: string): SlateExtension => {
  return {
    insertText: (t, e, n) => {
      console.log(name);
      return n(t, e);
    },
  };
};
