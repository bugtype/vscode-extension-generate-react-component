import React, { HTMLAttributes, useRef, useState } from 'react';
import styled from 'styled-components';

const colors = {
  white: '#fff',
  black: '#000',
  disabled: '#ececec',
  // etc
};

const shadowElevation = {
  type1: '1px solid rgba(0, 0, 0, 0.23);',
  type2: '1px solid rgba(0, 0, 0, 0.7);',
};

interface ButtonComponentProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'text' | 'outlined' | 'contained';
  disabled?: boolean;
}

interface RippleProps {
  id: string;
  x: number;
  y: number;
}

export const ButtonComponent = ({
  children,
  variant = 'text',
  disabled = false,
  onClick,
  ...others
}: ButtonComponentProps) => {
  const [ripples, setRipple] = useState<RippleProps[]>([]);
  const countRef = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const pos = buttonRef.current?.getBoundingClientRect();
    if (!pos) {
      throw new Error('Check button component');
    }
    const x = e.clientX - pos.left;
    const y = e.clientY - pos.top;

    const ripple: RippleProps = { id: countRef.current.toString(), x, y };
    countRef.current += 1;

    setRipple((list) =>
      list.length > 5 ? [...list.slice(3), ripple] : [...list, ripple]
    );
    onClick && onClick(e);
  };

  // Disabled

  return (
    <ButtonContainer
      ref={buttonRef}
      type="button"
      onClick={handleOnClick}
      variant={variant}
      disabled={disabled}
      {...others}
    >
      {children}
      <span>
        {ripples.map((r) => (
          <Ripple key={r.id} {...r} />
        ))}
      </span>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.button.attrs((props) => ({
  type: 'button',
}))<ButtonComponentProps>`
  outline: 0;
  overflow: hidden;
  display: inline-block;
  position: relative;

  padding: 16px;
  background: ${colors.white};
  border-radius: 4px;
  border: none;

  &:hover {
    background: #ececec;
  }

  &:focus {
    border: ${shadowElevation.type1};
  }

  /** variant */
  ${({ variant }) =>
    variant === 'contained' &&
    `
    color: ${colors.white};
    background: #5959f3;
    border-radius: 4px;

    &:hover {
      background: #3a3afa;
    }
  `}

  ${({ variant }) =>
    variant === 'outlined' &&
    `
    color: #5959f3;
    background: transport;
    border-radius: 4px;
    border: ${shadowElevation.type2};
    
  `}

  ${({ disabled }) =>
    disabled &&
    `
    color: #8d8d8d;
    background: ${colors.disabled};
    border: 0px;

    &:hover {
      background: ${colors.disabled};
    }

    &:focus {
      background: ${colors.disabled};
    }
  `}
`;

const Ripple = styled.span<RippleProps>`
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  background: #5959f3;
  width: 1rem;
  height: 1rem;
  position: absolute;
  border-radius: 50%;
  transform: translateX(-100%) translateY(-100%);
  /* mix-blend-mode: screen; */
  animation: ripple 1250ms ease-out forwards, fade 1500ms ease-out forwards;

  @keyframes ripple {
    0% {
      transform: translate(-100%, -100%);
    }
    80% {
      transform: translate(-100%, -100%) scale(50);
    }
    100% {
      transform: translate(-100%, -100%) scale(50);
      opacity: 0;
    }
  }

  @keyframes fade {
    0% {
      opacity: 0.8;
    }
    100% {
      opacity: 0;
      display: none;
    }
  }
`;
