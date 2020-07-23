export default interface Client {
  _id: string,
  name: string,
  phone: string,
  email: string,
  date: string,
  location: string,
  totalAmount: string,
  description: string,
  totalPayments: number,
  quantityPayments: number,
  completed: boolean
};