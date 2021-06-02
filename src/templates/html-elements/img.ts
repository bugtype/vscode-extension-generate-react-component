export const img = `
import React, { HTMLAttributes, ImgHTMLAttributes } from 'react';

// NOTE: loading property in ImgHTMLAttributes
interface ComponentNameProps extends ImgHTMLAttributes<HTMLImageElement> {
  //
  alt: string; // a11y required
}

export const ComponentName = (props: ComponentNameProps) => {
  return <img {...props} />;
};
`;
