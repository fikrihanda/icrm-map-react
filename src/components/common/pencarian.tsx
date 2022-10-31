import Close from '@mui/icons-material/Close'
import Search from '@mui/icons-material/Search'
import ViewHeadline from '@mui/icons-material/ViewHeadline'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { forwardRef, SyntheticEvent, useEffect, useImperativeHandle, useState } from 'react'
import { useUpdateEffect } from 'react-use'
import useSWR from 'swr'
import theme from '@/tools/theme'
import axios from '@/tools/axios'
import PencarianAutocomplete, { OptionsAutocomplete } from '@/components/pencarian/autocomplete'

export interface PencarianCari {
  provinsi?: OptionsAutocomplete | null,
  kota?: OptionsAutocomplete | null,
  kelurahan?: OptionsAutocomplete | null,
  kecamatan?: OptionsAutocomplete | null
}
interface PencarianOptions {
  provinsi: OptionsAutocomplete[],
  kota: OptionsAutocomplete[],
  kelurahan: OptionsAutocomplete[],
  kecamatan: OptionsAutocomplete[]
}
interface PencarianLoading {
  provinsi: boolean,
  kota: boolean,
  kelurahan: boolean,
  kecamatan: boolean
}
export interface CommonPencarianRef {
  cari: PencarianCari
}

// eslint-disable-next-line @typescript-eslint/ban-types,@typescript-eslint/no-empty-interface
interface CommonPencarianProps  {
  onCari?: (val: PencarianCari) => any
}

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

const CommonPencarian = forwardRef<CommonPencarianRef, CommonPencarianProps>((props, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const { onCari = (() => {}) } = props
  const [ open, setOpen ] = useState<boolean>(false)
  const [ cari, setCari ] = useState<PencarianCari>({
    provinsi: null,
    kota: null,
    kelurahan: null,
    kecamatan: null
  })
  const [ options, setOptions ] = useState<PencarianOptions>({
    provinsi: [],
    kota: [],
    kelurahan: [],
    kecamatan: []
  })
  const [ loading, setLoading ] = useState<PencarianLoading>({
    provinsi: true,
    kota: false,
    kelurahan: false,
    kecamatan: false
  })

  const { data: listProvinsi } = useSWR('/geo/provinsi/combo/box/v1', axiosPost({}))

  const toggleOpen = () => setOpen(!open)
  const setLoadingProvinsi = () => setLoading({
    ...loading,
    provinsi: !listProvinsi
  })
  const setProvinsiOpts = () => setOptions({
    ...options,
    provinsi: loading.provinsi ? [] : listProvinsi.map((lp: any) => {
      return {
        ...lp,
        label: lp.nama
      }
    })
  })
  const getKota = async () => {
    setLoading({
      ...loading,
      kota: true
    })
    setOptions({
      ...options,
      kota: []
    })
    setCari({
      ...cari,
      kota: null
    })
    try {
      if (cari.provinsi) {
        const res = await axiosPost({
          idProvinsi: cari.provinsi.id
        })('/geo/kota/lihat')
        setOptions({
          ...options,
          kota: res.map((lp: any) => {
            return {
              ...lp,
              label: lp.nama
            }
          })
        })
      } else {
        setOptions({
          ...options,
          kota: []
        })
      }
    } catch (err) {
      setOptions({
        ...options,
        kota: []
      })
    }
    setLoading({
      ...loading,
      kota: false
    })
  }
  const getKecamatan = async () => {
    setLoading({
      ...loading,
      kecamatan: true
    })
    setOptions({
      ...options,
      kecamatan: []
    })
    setCari({
      ...cari,
      kecamatan: null
    })
    try {
      if (cari.provinsi && cari.kota) {
        const res = await axiosPost({
          idProvinsi: cari.provinsi.id,
          idKota: cari.kota.id
        })('/geo/kecamatan/lihat')
        setOptions({
          ...options,
          kecamatan: res.map((lp: any) => {
            return {
              ...lp,
              label: lp.nama
            }
          })
        })
      } else {
        setOptions({
          ...options,
          kecamatan: []
        })
      }
    } catch (err) {
      setOptions({
        ...options,
        kecamatan: []
      })
    }
    setLoading({
      ...loading,
      kecamatan: false
    })
  }
  const getKelurahan = async () => {
    setLoading({
      ...loading,
      kelurahan: true
    })
    setOptions({
      ...options,
      kelurahan: []
    })
    setCari({
      ...cari,
      kelurahan: null
    })
    try {
      if (cari.provinsi && cari.kota && cari.kecamatan) {
        const res = await axiosPost({
          idProvinsi: cari.provinsi.id,
          idKota: cari.kota.id,
          idKecamatan: cari.kecamatan.id
        })('/geo/kelurahan/lihat')
        setOptions({
          ...options,
          kelurahan: res.map((lp: any) => {
            return {
              ...lp,
              label: lp.nama
            }
          })
        })
      } else {
        setOptions({
          ...options,
          kelurahan: []
        })
      }
    } catch (err) {
      setOptions({
        ...options,
        kelurahan: []
      })
    }
    setLoading({
      ...loading,
      kelurahan: false
    })
  }
  const setProvinsi = async (e: SyntheticEvent, val: any) => {
    setCari({
      provinsi: val as (OptionsAutocomplete | null),
      kota: null,
      kelurahan: null,
      kecamatan: null
    })
  }
  const setKota = (e: SyntheticEvent, val: any) => {
    setCari({
      ...cari,
      kota: val as (OptionsAutocomplete | null),
      kelurahan: null,
      kecamatan: null
    })
  }
  const setKecamatan = (e: SyntheticEvent, val: any) => {
    setCari({
      ...cari,
      kecamatan: val as (OptionsAutocomplete | null),
      kelurahan: null
    })
  }
  const setKelurahan = (e: SyntheticEvent, val: any) => {
    setCari({
      ...cari,
      kelurahan: val as (OptionsAutocomplete | null)
    })
  }

  useEffect(() => {
    setLoadingProvinsi()
  }, [ listProvinsi ])
  useUpdateEffect(() => {
    setProvinsiOpts()
  }, [ loading.provinsi ])
  useUpdateEffect(() => {
    getKota()
  }, [ cari.provinsi ])
  useUpdateEffect(() => {
    getKecamatan()
  }, [ cari.provinsi, cari.kota ])
  useUpdateEffect(() => {
    getKelurahan()
  }, [ cari.provinsi, cari.kota, cari.kecamatan ])

  useImperativeHandle(ref, () => ({
    cari
  }))
  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 100,
        top: theme.spacing(4),
        left: theme.spacing(4)
      }}
    >
      {
        !open ?
          <Button variant="contained" color="primary" onClick={toggleOpen}>
            <ViewHeadline />
          </Button> :
          <Paper
            elevation={2}
            sx={{
              p: theme.spacing(4),
              width: `calc(100vw - ${theme.spacing(8)})`
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <PencarianAutocomplete
                  value={cari.provinsi}
                  options={options.provinsi}
                  label="Provinsi"
                  loading={loading.provinsi}
                  onChange={setProvinsi}
                />
              </Grid>
              <Grid item xs={6}>
                <PencarianAutocomplete
                  value={cari.kota}
                  options={options.kota}
                  label="Kota / Kabupaten"
                  loading={loading.kota}
                  onChange={setKota}
                  disabled={!cari.provinsi}
                />
              </Grid>
              <Grid item xs={5}>
                <PencarianAutocomplete
                  value={cari.kecamatan}
                  options={options.kecamatan}
                  label="Kecamatan"
                  loading={loading.kecamatan}
                  onChange={setKecamatan}
                  disabled={!cari.provinsi && !cari.kota}
                />
              </Grid>
              <Grid item xs={5}>
                <PencarianAutocomplete
                  value={cari.kelurahan}
                  options={options.kelurahan}
                  label="Kelurahan"
                  loading={loading.kelurahan}
                  onChange={setKelurahan}
                  disabled={!cari.provinsi && !cari.kota && !cari.kecamatan}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  sx={{
                    minHeight: '40px',
                    alignItems: 'center',
                    lineHeight: 1.5,
                    mr: theme.spacing(4)
                  }}
                  onClick={() => onCari(cari)}
                >
                  <Search />
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    minHeight: '40px',
                    alignItems: 'center',
                    lineHeight: 1.5
                  }}
                  onClick={toggleOpen}
                >
                  <Close />
                </Button>
              </Grid>
            </Grid>
          </Paper>
      }
    </Box>
  )
})
CommonPencarian.displayName = 'CommonPencarian'

export default CommonPencarian
