import React, { HTMLAttributes, useRef, useState } from 'react';
import styled from 'styled-components';

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
  background-color: ${(props) => (props.disabled ? '#ececec' : 'white')};
  border-radius: 4px;
  border: none;

  &:hover {
    background-color: #ececec;
  }

  &:focus {
    border: 1px solid rgba(0, 0, 0, 0.7);
  }

  /** variant */
  ${({ variant }) =>
    variant === 'contained' &&
    `
    color: white;
    background: #5959f3;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.23);

    &:hover {
      background-color: #3a3afa;
    }
  `}

  ${({ variant }) =>
    variant === 'outlined' &&
    `
    color: #5959f3;
    background: transport;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.23);
  `}
`;

const Ripple = styled.span<RippleProps>`
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  background-color: #5959f3;
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
