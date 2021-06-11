
import React, { HTMLAttributes, ImgHTMLAttributes } from 'react';

// NOTE: loading property in ImgHTMLAttributes
interface ImgComponentProps extends ImgHTMLAttributes<HTMLImageElement> {
  //
  alt: string; // a11y required
  // eslint-disable-next-line react/require-default-props
  'data-src'?: string; // loading
}

export const ImgComponent = (props: ImgComponentProps) => {
  const { alt, ...other } = props;

  return <img alt={alt} {...other} />;
};

