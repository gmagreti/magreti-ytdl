import styled, { css, DefaultTheme, keyframes } from 'styled-components'
import { ButtonProps, BoxValueProps } from '.'

const ANIMATION_MS = 800

const ripple = keyframes`
  0% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    transform: scale(8);
  }

  100% {
    opacity: 0;
  }
`

const WrapperModifier = {
  primary: (theme: DefaultTheme) => css`
    background-color: ${theme.colors.accent_100};
    color: ${theme.colors.primary_100};

    &:hover {
      background-color: ${theme.colors.accent_150};
    }
  `,

  secondary: (theme: DefaultTheme) => css`
    background-color: ${theme.colors.primary_400};
    color: ${theme.colors.secondary_400};

    &:hover {
      background-color: ${theme.colors.primary_450};
    }
  `,

  minimal: (theme: DefaultTheme) => css`
    background-color: transparent;
    color: ${theme.colors.secondary_400};
    border-color: ${theme.colors.secondary_400};

    &:hover {
      border-color: ${theme.colors.secondary_450};
    }
  `
}

export const Wrapper = styled.button<ButtonProps>`
  ${({ theme, buttonType }) => css`
    display: inline-block;
    position: relative;
    overflow: hidden;
    font-size: ${theme.font.sizes.small};
    font-weight: ${theme.font.normal};
    line-height: 18px;
    cursor: pointer;
    border-radius: ${theme.border.radius};
    border: 1px solid transparent;
    padding: 1rem 1.4rem;
    text-align: center;
    transition: all 0.2s cubic-bezier(0.06, 0.67, 0.37, 0.99);

    ${!!buttonType && WrapperModifier[buttonType](theme)};
  `}
`
export const RippleEffect = styled.span<BoxValueProps>`
  ${({ circleSize, x, y }) => css`
    position: absolute;
    position: absolute;
    top: ${y}px;
    left: ${x}px;
    height: ${circleSize}px;
    width: ${circleSize}px;
    background: currentColor;
    border-radius: 50%;
    opacity: 0.7;
    animation-name: ${ripple};
    animation-duration: ${ANIMATION_MS * 2}ms;
    animation-iteration-count: 1;
    animation-timing-function: ease;
    pointer-events: none;
  `}
`
