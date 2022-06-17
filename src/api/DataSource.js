import Http from '@utils/Http'
// 获取数据源列表
export const getList = (params) => Http.ask(`POST`, `/datasource/list`, params)
// 检测数据源连接是否可用
export const checkConnection = (params) => Http.ask(`POST`, `/datasource/checkConnection`, params)
// 创建和更新数据源
export const save = (params) => Http.ask(`POST`, `/datasource/save`, params)
// 删除数据源
export const deleteById = (id) => Http.ask(`DELETE`, `/datasource/delete/${id}`)
// 获取数据源详情
export const detailsById = (id) => Http.ask(`DELETE`, `/datasource/getDatasource/${id}`)
