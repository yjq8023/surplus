import request from "@/services/request";

export const createClient = (d: any) => {
  return request.post('/client', d)
}
export const getClient = (d: any = {}) => {
  return request.get('/client', d)
}
export const deleteClient = (id: string) => {
  return request.delete(`/client`, { id })
}
export const getClientOptions = (d: any = {}) => {
  return request.get('/client/options', d)
}
