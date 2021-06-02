export const div = `
import React, { ButtonHTMLAttributes, HTMLAttributes } from 'react';

interface ComponentNameProps extends HTMLAttributes<HTMLDivElement> {
  //
}

export const ComponentName = (props: ComponentNameProps) => {
  const { children } = props;

  return <div {...props}>{children}</div>;
};
`;
