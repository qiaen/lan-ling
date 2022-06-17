import Http from '@utils/Http'

// 获取用户信息
export const getUserInfo = (params) => Http.ask(`GET`, `/api/getUserInfo`, params)
// 通过类型获取可用数据源列表
export const getAvailableDataSource = (params) => Http.ask(`GET`, `/datasource/listAvailable`, params)
// 通过数据源表
export const getTablesBySourceId = (params) => Http.ask(`POST`, `/datasource/getTables`, params)
// 获取所有枚举接口
export const getAllEnum = (params) => Http.ask(`GET`, `/api/getAllEnum`, params)
// 获取源数据主题枚举
export const metadataSuperList = (params) => Http.ask(`POST`, `/api/hive-metadata/theme/superList`, params)