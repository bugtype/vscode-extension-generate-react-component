export const img = `
import React, { HTMLAttributes, ImgHTMLAttributes } from 'react';

// NOTE: loading property in ImgHTMLAttributes
interface ComponentNameProps extends ImgHTMLAttributes<HTMLImageElement> {
  //
  alt: string; // a11y required
  'data-src'?: string; // loading
}

export const ComponentName = (props: ComponentNameProps) => {
  const { alt, ...other } = props;

  return <img alt={alt} {...other} />;
};
`;
