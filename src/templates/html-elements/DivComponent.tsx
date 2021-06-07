
import React, { ButtonHTMLAttributes, HTMLAttributes } from 'react';

type DivComponentProps = HTMLAttributes<HTMLDivElement>

export const DivComponent = (props: DivComponentProps) => {
  const { children } = props;

  return <div {...props}>{children}</div>;
};

