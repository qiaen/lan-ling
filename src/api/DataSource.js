import Http from '@utils/Http'
// 获取数据源列表
export const getList = (params) => Http.setPromise(`POST`, `/datasource/list`, params)
// 检测数据源连接是否可用
export const checkConnection = (params) => Http.setPromise(`POST`, `/datasource/checkConnection`, params)
// 创建和更新数据源
export const save = (params) => Http.setPromise(`POST`, `/datasource/save`, params)
// 删除数据源
export const deleteById = (id) => Http.setPromise(`DELETE`, `/datasource/delete/${id}`)
// 获取数据源详情
export const detailsById = (id) => Http.setPromise(`DELETE`, `/datasource/getDatasource/${id}`)
