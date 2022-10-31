export interface ResponseFAT {
  nama: string;
  lat: string;
  lng: string;
  warna: string;
}
export type ResponseCustomer = Omit<ResponseFAT, 'warna'>
export interface Checks {
  customer: boolean
  calcustomer: boolean
}
