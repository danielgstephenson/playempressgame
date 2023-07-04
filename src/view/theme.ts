// 1. import `extendTheme` function
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false
}

const styles = {
  global: {
    '#root': {
      display: 'flex',
      flexDirection: 'column',
      height: '99dvh'
    }
  }
}

// 3. extend the theme
const theme = extendTheme({ config, styles })

export default theme
