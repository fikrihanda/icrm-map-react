import { createTheme } from '@mui/material'

const theme = createTheme({
  spacing: (factor: number) => `${0.25 * factor}rem`
})

export default theme
