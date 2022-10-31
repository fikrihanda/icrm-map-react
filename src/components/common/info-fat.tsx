import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import { FC, useState } from 'react'
import { Checks, ResponseFAT } from '@/types/my'
import theme from '@/tools/theme'

interface InfoFATProps {
  selected: ResponseFAT
  onCari?: (check: Checks) => any
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const InfoFat: FC<InfoFATProps> = ({ selected, onCari = () => {} }) => {
  const [ checks, setChecks ] = useState<Checks>({
    customer: false,
    calcustomer: false
  })
  return (
    <Box
      sx={{
        py: theme.spacing(2),
        px: theme.spacing(5)
      }}
    >
      <div>{selected.nama}</div>
      <FormGroup
        sx={{
          pt: theme.spacing(2)
        }}
      >
        <FormControlLabel
          control={<Checkbox value={checks.customer} onChange={() => setChecks({ ...checks, customer: !checks.customer })} />}
          label="Customer"
        />
        <FormControlLabel
          control={<Checkbox value={checks.calcustomer} onChange={() => setChecks({ ...checks, calcustomer: !checks.calcustomer })} />}
          label="Calon Customer"
        />
        <Button variant="contained" disableElevation onClick={() => onCari(checks)}>
          Cari
        </Button>
      </FormGroup>
    </Box>
  )
}

export default InfoFat
