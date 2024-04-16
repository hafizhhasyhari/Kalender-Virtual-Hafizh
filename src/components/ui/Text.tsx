import { VariantProps, cva } from 'class-variance-authority';
import React from 'react';

const textStyles = cva(['flex'], {
  variants: {
    bold: {
      true: ['font-bold'],
    },
  },
});

type Props = React.ComponentPropsWithoutRef<'span'> &
  VariantProps<typeof textStyles> & {
    children: React.ReactNode;
  };

const Text = ({ children, bold, ...rest }: Props) => {
  return (
    <span className={textStyles({ bold })} {...rest}>
      {children}
    </span>
  );
};

export default Text;
