import React, { HTMLAttributes, ImgHTMLAttributes } from 'react';

// NOTE: loading property in ImgHTMLAttributes
interface ButtonComponentProps extends HTMLAttributes<HTMLButtonElement> {
  //
  alt: string; // a11y required
}

export const ButtonComponent = (props: ButtonComponentProps) => {
  const { ...other } = props;

  return <button type="button" {...other} />;
};
