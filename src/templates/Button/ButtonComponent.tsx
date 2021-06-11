import React, { HTMLAttributes } from 'react';

interface ButtonComponentProps extends HTMLAttributes<HTMLButtonElement> {
  //
  title: string;
}

export const ButtonComponent = (props: ButtonComponentProps) => {
  const { title, ...others } = props;

  return (
    <button type="button" {...others}>
      {title}
    </button>
  );
};
