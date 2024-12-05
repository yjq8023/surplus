import request from "@/services/request";

export const createPeriods = (d: any) => {
  return request.post('/periods', d)
}
export const getPeriods = (d: any = {}) => {
  return request.get('/periods', d)
}
export const deletePeriods = (id: string) => {
  return request.delete(`/periods`, { id })
}
export const getPeriodsOptions = (d: any = {}) => {
  return request.get('/periods/options', d)
}
