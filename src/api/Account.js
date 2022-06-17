import Http from '@utils/Http'

// 登录
export const login = (params) => Http.ask(`POST`, `/api/login`, params)
// 登录
export const logout = (params) => Http.ask(`POST`, `/api/logout`, params)