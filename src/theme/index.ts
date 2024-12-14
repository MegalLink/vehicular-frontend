import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// Función para generar paleta de colores
function generateColorPalette(baseColor: string) {
  const lighten = (color: string, percent: number) => {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1)
  }

  const darken = (color: string, percent: number) => {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) - amt
    const G = (num >> 8 & 0x00FF) - amt
    const B = (num & 0x0000FF) - amt
    return '#' + (
      0x1000000 +
      (R > 0 ? (R > 255 ? 255 : R) : 0) * 0x10000 +
      (G > 0 ? (G > 255 ? 255 : G) : 0) * 0x100 +
      (B > 0 ? (B > 255 ? 255 : B) : 0)
    ).toString(16).slice(1)
  }

  return {
    50: lighten(baseColor, 90),
    100: lighten(baseColor, 70),
    200: lighten(baseColor, 50),
    300: lighten(baseColor, 30),
    400: lighten(baseColor, 15),
    500: baseColor,
    600: darken(baseColor, 15),
    700: darken(baseColor, 30),
    800: darken(baseColor, 45),
    900: darken(baseColor, 60),
  }
}

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const colors = {
  primary: generateColorPalette('#1A73E8'),
  secondary: generateColorPalette('#757575'),
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
  },
  accent: generateColorPalette('#FF5252'),
  border: '#E0E0E0',
  status: {
    error: '#E53935',
    warning: '#FB8C00',
    success: '#43A047',
  },
}

const semanticTokens = {
  colors: {
    'bg.primary': {
      default: 'background.primary',
      _dark: 'gray.800',
    },
    'bg.secondary': {
      default: 'background.secondary',
      _dark: 'gray.700',
    },
    'text.primary': {
      default: 'text.primary',
      _dark: 'whiteAlpha.900',
    },
    'text.secondary': {
      default: 'text.secondary',
      _dark: 'whiteAlpha.700',
    },
  },
}

const fonts = {
  heading: 'Inter, system-ui, sans-serif',
  body: 'Inter, system-ui, sans-serif',
}

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'lg',
    },
    variants: {
      solid: (props: { colorScheme: string }) => ({
        bg: `${props.colorScheme}.500`,
        color: 'white',
        _hover: {
          bg: `${props.colorScheme}.600`,
        },
        _active: {
          bg: `${props.colorScheme}.700`,
        },
      }),
      outline: (props: { colorScheme: string }) => ({
        border: '2px solid',
        borderColor: `${props.colorScheme}.500`,
        color: `${props.colorScheme}.500`,
        _hover: {
          bg: `${props.colorScheme}.50`,
        },
        _active: {
          bg: `${props.colorScheme}.100`,
        },
      }),
      secondary: {
        bg: 'secondary.500',
        color: 'white',
        _hover: {
          bg: 'secondary.600',
        },
        _active: {
          bg: 'secondary.700',
        },
      },
    },
    defaultProps: {
      colorScheme: 'primary',
    },
  },
  Input: {
    variants: {
      filled: {
        field: {
          borderRadius: 'lg',
          bg: 'background.secondary',
          borderColor: 'border',
          _hover: {
            bg: 'background.secondary',
            borderColor: 'primary.300',
          },
          _focus: {
            bg: 'background.primary',
            borderColor: 'primary.500',
          },
        },
      },
    },
    defaultProps: {
      variant: 'filled',
    },
  },
  Text: {
    baseStyle: {
      color: 'text.primary',
    },
    variants: {
      secondary: {
        color: 'text.secondary',
      },
    },
  },
}

const theme = extendTheme({
  config,
  colors,
  semanticTokens,
  fonts,
  components,
  styles: {
    global: {
      body: {
        bg: 'bg.primary',
        color: 'text.primary',
      },
    },
  },
})

export default theme
