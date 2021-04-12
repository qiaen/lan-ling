import Http from '@utils/Http'

// 登录
export const login = (params) => Http.setPromise(`POST`, `/api/login`, params)
// 登录
export const logout = (params) => Http.setPromise(`POST`, `/api/logout`, params)