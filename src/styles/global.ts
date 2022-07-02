import { createGlobalStyle, css } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Fira Code';
    font-style: normal;
    font-weight: 300;
    font-display: swap;
    src: local(''),
        url('/fonts/FiraCode-Light.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
  }
  @font-face {
    font-family: 'Fira Code';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local(''),
        url('/fonts/FiraCode-Regular.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
        url('/fonts/FiraCode-Regular.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
  }
  @font-face {
    font-family: 'Fira Code';
    font-weight: 500;
    font-style: normal;
    font-display: swap;
    src: local(''),
        url('/fonts/FiraCode-Medium.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
  }
  @font-face {
    font-family: 'Fira Code';
    font-weight: 700;
    font-style: normal;
    font-display: swap;
    src: local(''),
        url('/fonts/FiraCode-Bold.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
  }


  ${({ theme }) => css`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-family: ${theme.font.family};
    }

    html {
      font-size: 62.5%;
    }

    body {
      font-family: ${theme.font.family};
      font-size: ${theme.font.sizes.medium};
    }
  `}
`

export default GlobalStyles
