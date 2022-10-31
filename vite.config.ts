import { fileURLToPath, URL } from 'url'
import { defineConfig  } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ react() ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'axios': [ 'axios' ],
          'lodash/isEmpty': [ 'lodash/isEmpty' ],
          'lodash/clone': [ 'lodash/clone' ],
          '@mui/material/Box': [ '@mui/material/Box' ],
          '@mui/material/Button': [ '@mui/material/Button' ],
          '@mui/material/Checkbox': [ '@mui/material/Checkbox' ],
          '@mui/material/Grid': [ '@mui/material/Grid' ],
          '@mui/material/Paper': [ '@mui/material/Paper' ],
          '@mui/material/Autocomplete': [ '@mui/material/Autocomplete' ],
          '@mui/material/CircularProgress': [ '@mui/material/CircularProgress' ],
          '@mui/material/TextField': [ '@mui/material/TextField' ],
          '@mui/icons-material/Close': [ '@mui/icons-material/Close' ],
          '@mui/icons-material/Search': [ '@mui/icons-material/Search' ],
          '@mui/icons-material/ViewHeadline': [ '@mui/icons-material/ViewHeadline' ]
        }
      }
    }
  },
  base: '/icrm-map/'

})
