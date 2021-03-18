import Http from '@utils/Http'
// 获取运维列表
export const getList = (params) => Http.setPromise(`POST`, `/api/getUsers`, params)
// 更改运维状态
export const changeStatus = (params) => Http.setPromise(`POST`, `/schedule/changeStatus`, params)
// 删除运维
export const del = (params) => Http.setPromise(`POST`, `/schedule/delete`, params)
// 取消运维
export const cancel = (id) => Http.setPromise(`GET`, `/schedule/cancel/${id}`)
// 查看日志
export const getLog = (params) => Http.setPromise(`POST`, `/schedule/log`, params)
// 刷新日志
export const f5Log = (params) => Http.setPromise(`POST`, `/schedule/refreshLog`, params)
// 重跑
export const rerun = (params) => Http.setPromise(`POST`, `/schedule/rerun`, params)