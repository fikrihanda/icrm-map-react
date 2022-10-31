import FatBlack from '@/assets/images/icon-map/fat-black.png'
import FatGreen from '@/assets/images/icon-map/fat-green.png'
import FatRed from '@/assets/images/icon-map/fat-red.png'
import FatYellow from '@/assets/images/icon-map/fat-yellow.png'


export default function getIconFat(warna = '') {
  let re = ''
  switch (warna) {
    case '1':
      re = FatBlack
      break
    case '2':
      re = FatRed
      break
    case '3':
      re = FatYellow
      break
    case '4':
      re = FatGreen
      break
    default:
      re = FatBlack
      break
  }
  return re
}
