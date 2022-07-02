export default {
  grid: {
    container: '130rem',
    gutter: '3.2rem'
  },
  border: {
    radius: '0.8rem'
  },
  font: {
    family:
      "Fira Code, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    light: 300,
    normal: 400,
    bold: 600,
    sizes: {
      small: '1.4rem',
      medium: '1.6rem',
      large: '1.8rem',
      xlarge: '3.2rem',
      huge: '6.2rem'
    }
  },
  colors: {
    primary_100: '#01080E',
    primary_200: '#011627',
    primary_300: '#011627',
    primary_400: '#1C2B3A',
    primary_450: '#263B50',
    secondary_100: '#607B96',
    secondary_200: '#3C9D93',
    secondary_300: '#4D5BCE',
    secondary_400: '#FFFFFF',
    secondary_450: 'rgba(255, 255, 255, 0.7)',
    accent_100: '#FEA55F',
    accent_150: '#FFAC6B',
    accent_200: '#43D9AD',
    accent_300: '#E99287',
    accent_400: '#C98BDF',
    lines: '#1E2D3D',
    gradients_100: '#4D5BCE',
    gradients_200: '#43D9AD'
  },
  spacings: {
    xxsmall: '0.8rem',
    xsmall: '1.6rem',
    small: '2.4rem',
    medium: '3.2rem',
    large: '4.0rem',
    xlarge: '4.8rem',
    xxlarge: '5.6rem'
  },
  layers: {
    base: 10,
    menu: 20,
    overlay: 30,
    modal: 40,
    alwaysOnTop: 50
  },
  transition: {
    default: '0.3s ease-in-out',
    fast: '0.1s ease-in-out'
  }
} as const
