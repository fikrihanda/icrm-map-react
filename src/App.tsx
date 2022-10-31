import { useJsApiLoader } from '@react-google-maps/api'
import { SnackbarProvider } from 'notistack'
import CommonMap from '@/components/common/map'

function App() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_M_API
  })

  if (!isLoaded) return (
    <></>
  )
  if (loadError) return (
    <div>Map cannot be loaded right now</div>
  )
  return (
    <SnackbarProvider maxSnack={5}>
      <CommonMap />
    </SnackbarProvider>
  )
}

export default App
