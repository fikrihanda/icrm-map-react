import ClusterPelanggan from '@/assets/images/icon-map/pelanggan.png'
import ClusterCalon from '@/assets/images/icon-map/calon-pelanggan.png'

export default function getIconCustomer(type: 'pelanggan' | 'calon-pelanggan' = 'pelanggan') {
  if (type === 'pelanggan') {
    return ClusterPelanggan
  }
  if (type === 'calon-pelanggan') {
    return ClusterCalon
  }
  return ClusterPelanggan
}
