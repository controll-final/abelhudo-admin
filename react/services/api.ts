import axios from 'axios'

const baseUrl = 'https://hccontroll03.app.br'
const clientId = 'controll-admin-2TJHMU'
const secret =
  'Z0SEF58HBO8TBMJYIAH2JIMJ1WFW8VGQ6RRQRZHGAOM3EU27F64SHQFFTR7YSZ44XOYEOFZG6QQ6IM1ZTAE5ZUHNXT55GB8J32IRERZPJR01DXCXID5U1OZXVKD0C9A1'

export const getToken = async () => {
  const basicAuth = Buffer.from(`${clientId}:${secret}`).toString('base64')
  const response = await axios.request({
    url: `${baseUrl}/oauth/token`,
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      Accept: 'application/json, text/plain, */*',
      Authorization: `Basic ${basicAuth}`,
    },
    data: 'grant_type=client_credentials&scope=ADMIN',
  })

  return response.data
}

export const getAllProducts = async (
  token: string,
  search?: string,
  page = 0
) => {
  const parameters = search
    ? `name=%25${search}%25&page=${page}`
    : `page=${page}`

  const response = await axios.request({
    url: `${baseUrl}/v1/products?${parameters}&size=40&sort=quantitySold,desc&active=true`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export const getAllSuggestions = async (token: string, productId: number) => {
  const response = await axios.request({
    url: `${baseUrl}/v1/products/${productId}/combinations`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export const putCombination = async (
  token: string,
  productId: number,
  combinedProductId: number
) => {
  const response = await axios.request({
    url: `${baseUrl}/v1/products/${productId}/combinations/${combinedProductId}/active`,
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  return response
}

export const deleteCombination = async (
  token: string,
  productId: number,
  combinedProductId: number
) => {
  const response = await axios.request({
    url: `${baseUrl}/v1/products/${productId}/combinations/${combinedProductId}/active`,
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  return response
}