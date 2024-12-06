import request, { baseUrl } from "@/services/request";
import { isNull } from "@/utils";

export const createOrder = (d: any) => {
  return request.post('/orders', d)
}
export const getOrders = (d: any = {}) => {
  return request.get('/orders', d)
}
export const exportOrders = (params: any = {}) => {

  let o: any = {}
  Object.keys(params).forEach((key) => {
    if (!isNull(params[key])) {
      o[key] = params[key]
    }
  })

  const queryStr = new URLSearchParams(o).toString();

  window.open(baseUrl + '/orders/export?' + queryStr)
}
