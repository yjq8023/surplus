import { isNull } from "@/utils";

export const baseUrl = '/api'

const request = {
  get(url: string, params: any = {}) {
    let o: any = {}
    Object.keys(params).forEach((key) => {
      if (!isNull(params[key])) {
        o[key] = params[key]
      }
    })

    const queryStr = new URLSearchParams(o).toString();

    return fetch(baseUrl + url + '?' + queryStr, {
      headers: {
        contentType: 'application/json'
      },
    }).then(async (res) => {
      const data = await res.json();
      if (data.code === 0) {
        return data.body
      }
      return Promise.reject(data)
    })
  },
  post(url: string, data: any = {}) {
    return fetch(baseUrl + url, {
      method: 'POST',
      headers: {
        contentType: 'application/json'
      },
      body: JSON.stringify(data)
    }).then(async (res) => {
      const data = await res.json();
      if (data.code === 0) {
        return data.body
      }
      return Promise.reject(data)
    })
  },
  delete(url: string, params: any = {}) {
    return fetch(baseUrl + url, {
      method: 'DELETE',
      headers: {
        contentType: 'application/json'
      },
      body: JSON.stringify(params)
    })
  }
}

export default request
