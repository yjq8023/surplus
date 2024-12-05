import request from "@/services/request";

export const createOrder = (d: any) => {
  return request.post('/orders', d)
}
export const getOrders = (d: any = {}) => {
  return request.get('/orders', d)
}
