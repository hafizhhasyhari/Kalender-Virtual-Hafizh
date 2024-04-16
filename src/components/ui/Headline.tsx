import { cva } from 'class-variance-authority';
import React, { ElementType } from 'react';

const headlineStyles = cva([''], {
  variants: {
    h1: {
      true: ['text-4xl font-semibold'],
    },
    h2: {
      true: ['text-3xl font-semibold'],
    },
    h3: {
      true: ['text-2xl font-semibold'],
    },
    h4: {
      true: ['text-xl font-semibold'],
    },
    h5: {
      true: ['text-lg font-semibold'],
    },
    h6: {
      true: ['text-md'],
    },
    bold: {
      true: ['font-bold'],
    },
  },
});

interface Props {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  bold?: boolean;
  className?: string;
}

const Headline = ({
  level,
  children,
  bold,
  className = '',
  ...props
}: Props) => {
  const HeadingTag = `h${level}` as ElementType;
  return (
    <HeadingTag
      className={headlineStyles({ [`h${level}`]: true }) + ' ' + className}
      {...props}
    >
      {children}
    </HeadingTag>
  );
};

export default Headline;
