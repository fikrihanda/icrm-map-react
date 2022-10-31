import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import { AutocompleteProps } from '@mui/material/Autocomplete/Autocomplete'
import { FC } from 'react'

export interface OptionsAutocomplete {
  label?: string | null;
  id?: string | null;
  nama?: string | null;
}
// eslint-disable-next-line @typescript-eslint/ban-types
interface PencarianAutocompleteProps extends Omit<AutocompleteProps<OptionsAutocomplete, boolean, boolean, boolean>, 'renderInput' | 'isOptionEqualToValue'> {
  label: string;
  loading?: boolean;

}
const PencarianAutocomplete: FC<PencarianAutocompleteProps> = (props) => {
  const {
    label = 'Label',
    loading = false,
    ...params
  } = props
  return (
    <Autocomplete
      {...params}
      renderInput={params => (
        <TextField
          {...params}
          size="small"
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
      isOptionEqualToValue={(option, value) => option.id === value.id}
    />
  )
}

export default PencarianAutocomplete
