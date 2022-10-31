import Box from '@mui/material/Box'
import { GoogleMap, InfoWindowF, Marker, MarkerClusterer } from '@react-google-maps/api'
import clone from 'lodash/clone'
import isEmpty from 'lodash/isEmpty'
import { useSnackbar } from 'notistack'
import { useRef, useState } from 'react'
import getIconCustomer from '@/helpers/get-icon-customer'
import InfoFat from '@/components/common/info-fat'
import CommonPencarian, { CommonPencarianRef, PencarianCari } from '@/components/common/pencarian'
import changeResponse from '@/helpers/change-response'
import getIconFat from '@/helpers/get-icon-fat'
import axios from '@/tools/axios'
import { Checks, ResponseCustomer, ResponseFAT } from '@/types/my'

const axiosPost = (data: any) => {
  return function (url: string) {
    return axios.$post(url, data).then((res) => {
      if (!res.success) {
        throw new Error('Ada kesalahan dari server')
      }
      return res.data
    })
  }
}

const CommonMap = () => {
  const { enqueueSnackbar } = useSnackbar()

  const pencarianRef = useRef<CommonPencarianRef | null>(null)
  const [ markers, setMarkers ] = useState<ResponseFAT[]>([])
  const [ markersCustomer, setMarkersCustomer ] = useState<ResponseCustomer[]>([])
  const [ markersCalCustomer, setMarkersCalCustomer ] = useState<ResponseCustomer[]>([])
  const [ gMap, setGMap ] = useState<google.maps.Map | null | undefined>(null)
  const [ allMarkersGoogle, setAllMarkersGoogle ] = useState<Record<string, google.maps.Marker>>({} as Record<string, google.maps.Marker>)
  const [ selectedFat, setSelectedFat ] = useState<ResponseFAT | null>(null)
  const [ selectedCustomer, setSelectedCustomer ] = useState<ResponseCustomer | null>(null)

  const googleOnLoad = (mapInstance: google.maps.Map) => {
    setGMap(mapInstance)
    mapInstance.setCenter({ lat: -1.641192, lng: 118.71796 })
  }
  const markerLoad = (marker: google.maps.Marker, name: string) => {
    setAllMarkersGoogle((prevState) => {
      return { ...prevState, [name]: marker }
    })
  }
  const markerClick = (fat: ResponseFAT) => {
    if (!isEmpty(selectedFat)) {
      setSelectedFat(null)
    }
    setSelectedFat(fat)
  }
  const setBound = (myPlaces: (ResponseFAT | ResponseCustomer)[]) => {
    const bounds = new google.maps.LatLngBounds()
    myPlaces.forEach((m) => {
      if (!isEmpty(m.lat) && !isEmpty(m.lng)) {
        bounds.extend(new google.maps.LatLng(parseFloat(m.lat), parseFloat(m.lng)))
      }
    })
    if (gMap) {
      gMap.fitBounds(bounds)
    }
  }
  const markerCustomerPush = (markCus: ResponseCustomer[]) => {
    if (markers && markers.length) {
      const cloneMark = clone<ResponseCustomer[]>(markersCustomer)
      cloneMark.push(...markCus)
      setMarkersCustomer(markers)
    }
  }
  const markerCalCustomerPush = (markCus: ResponseCustomer[]) => {
    if (markers && markers.length) {
      const cloneMark = clone<ResponseCustomer[]>(markersCalCustomer)
      cloneMark.push(...markCus)
      setMarkersCalCustomer(markers)
    }
  }
  const onCari = async (val: PencarianCari) => {
    try {
      const res = await axiosPost({
        kabupaten: val.kota?.nama ?? '',
        kecamatan: val.kecamatan?.nama ?? '',
        kelurahan: val.kelurahan?.nama ?? '',
        provinsi: val.provinsi?.nama ?? ''
      })('/splitter/monitoring/splitter/without-olt')
      if (res.Data1 !== '0') {
        const changeRes = changeResponse<ResponseFAT>(res.Data2, [ 'nama', 'lat', 'lng', 'warna' ])
        if (changeRes.length) {
          setMarkers(changeRes)
          setBound(changeRes)
        }
      } else {
        enqueueSnackbar(`Splitter: ${res.Data2}`, { variant: 'error' })
      }
    } catch (err: any) {
      enqueueSnackbar(`Splitter: ${err.message || err.messages || ''}`, { variant: 'error' })
    }
  }
  const pencarianCustomer = async () => {
    try {
      const res = await axiosPost({
        kabupaten: pencarianRef.current?.cari.kota?.nama ?? '',
        kecamatan: pencarianRef.current?.cari.kecamatan?.nama ?? '',
        kelurahan: pencarianRef.current?.cari.kelurahan?.nama ?? '',
        provinsi: pencarianRef.current?.cari.provinsi?.nama ?? '',
        idFat: selectedFat?.nama
      })('/splitter/monitoring/pelanggan/with-fat')
      if (res.Data1 !== '0') {
        const changeRes = changeResponse<ResponseCustomer>(res.Data2, [ 'nama', 'lat', 'lng' ])
        if (changeRes.length) {
          markerCustomerPush(changeRes)
          setBound(changeRes)
        }
      } else {
        enqueueSnackbar(`Customer: ${res.Data2}`, { variant: 'error' })
      }
    } catch (err: any) {
      enqueueSnackbar(`Customer: ${err.message || err.messages || ''}`, { variant: 'error' })
    }
  }
  const pencarianCalCustomer = async () => {
    try {
      const res = await axiosPost({
        kabupaten: pencarianRef.current?.cari.kota?.nama ?? '',
        kecamatan: pencarianRef.current?.cari.kecamatan?.nama ?? '',
        kelurahan: pencarianRef.current?.cari.kelurahan?.nama ?? '',
        provinsi: pencarianRef.current?.cari.provinsi?.nama ?? '',
        idFat: selectedFat?.nama
      })('/splitter/monitoring/calon-pelanggan/with-fat')
      if (res.Data1 !== '0') {
        const changeRes = changeResponse<ResponseCustomer>(res.Data2, [ 'nama', 'lat', 'lng' ])
        if (changeRes.length) {
          markerCalCustomerPush(changeRes)
          setBound(changeRes)
        }
      } else {
        enqueueSnackbar(`Calon Customer: ${res.Data2}`, { variant: 'error' })
      }
    } catch (err: any) {
      enqueueSnackbar(`Calon Customer: ${err.message || err.messages || ''}`, { variant: 'error' })
    }
  }
  const onCariCustomer = async (checks: Checks) => {
    if (checks.customer) {
      await pencarianCustomer()
    }
    if (checks.calcustomer) {
      await pencarianCalCustomer()
    }
  }
  return (
    <Box sx={{
      position: 'relative'
    }}>
      <CommonPencarian ref={pencarianRef} onCari={onCari}  />
      <Box sx={{
        width: '100%',
        height: '100vh'
      }}>
        <GoogleMap
          onLoad={googleOnLoad}
          mapContainerStyle={{
            width: '100%',
            height: '100%'
          }}
          zoom={5.75}
          options={{

            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false
          }}
        >
          {
            markers.length && markers.map((m, i) => (
              <Marker
                position={{ lat: parseFloat(m.lat), lng: parseFloat(m.lng) }}
                icon={getIconFat(m.warna)}
                onLoad={marker => markerLoad(marker, m.nama)}
                onClick={() => markerClick(m)}
                clickable
                key={`marker-${i}`}
              />
            ))
          }
          {
            markersCustomer.length && (
              <MarkerClusterer>
                {
                  clusterer => (
                    <>
                      {
                        markersCustomer.map((m, i) => (
                          <Marker
                            position={{ lat: parseFloat(m.lat), lng: parseFloat(m.lng) }}
                            icon={getIconCustomer('pelanggan')}
                            onLoad={marker => markerLoad(marker, m.nama)}
                            onClick={() => setSelectedCustomer(m)}
                            clickable
                            key={`marker-customer-${i}`}
                            clusterer={clusterer}
                          >
                            {
                              selectedCustomer && (selectedCustomer.nama === m.nama) && (
                                <InfoWindowF onCloseClick={() => setSelectedCustomer(null)}>
                                  <div>{m.nama}</div>
                                </InfoWindowF>
                              )
                            }
                          </Marker>
                        ))
                      }
                    </>
                  )
                }
              </MarkerClusterer>
            )
          }
          {
            markersCalCustomer.length && (
              <MarkerClusterer>
                {
                  clusterer => (
                    <>
                      {
                        markersCalCustomer.map((m, i) => (
                          <Marker
                            position={{ lat: parseFloat(m.lat), lng: parseFloat(m.lng) }}
                            icon={getIconCustomer('calon-pelanggan')}
                            onLoad={marker => markerLoad(marker, m.nama)}
                            onClick={() => setSelectedCustomer(m)}
                            clickable
                            key={`marker-cal-customer-${i}`}
                            clusterer={clusterer}
                          >
                            {
                              selectedCustomer && (selectedCustomer.nama === m.nama) && (
                                <InfoWindowF onCloseClick={() => setSelectedCustomer(null)}>
                                  <div>{m.nama}</div>
                                </InfoWindowF>
                              )
                            }
                          </Marker>
                        ))
                      }
                    </>
                  )
                }
              </MarkerClusterer>
            )
          }
          {
            !isEmpty(selectedFat) &&
            (
              <InfoWindowF anchor={allMarkersGoogle[selectedFat?.nama]} onCloseClick={() => setSelectedFat(null)}>
                <InfoFat selected={selectedFat} onCari={onCariCustomer} />
              </InfoWindowF>
            )
          }
        </GoogleMap>
      </Box>
    </Box>
  )
}

export default CommonMap
