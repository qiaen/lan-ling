import Http from '@utils/Http'
// 获取作业列表
export const getList = (params) => Http.setPromise(`GET`, `/api/jobList`, params)
// 更改作业状态 启用、停用
export const changeStatus = (params) => Http.setPromise(`POST`, `/job/changeStatus`, params)
// 创建和更新作业
export const save = (params) => Http.setPromise(`POST`, `/job/save`, params)
// 删除作业
export const deleteById = (id) => Http.setPromise(`DELETE`, `/job/delete/${id}`)
// 检查hive表是否可用
export const checkHiveTable = (params) => Http.setPromise(`POST`, `/hive/checkHiveTable`, params)
// 根据id获取作业详情
export const detailsById = (params) => Http.setPromise(`GET`, `/api/getJobById`, params)
// 获取字断映射数据源表
export const getDataTables = (params) => Http.setPromise(`POST`, `/datasource/getColumns`, params)
// 获取字断映射hive表
export const getHiveTables = (params) => Http.setPromise(`POST`, `/hive/getHiveColumns`, params)
// 一键建表
export const createHiveTable = (params) => Http.setPromise(`POST`, `/hive/createTable`, params)
// 获取表名
export const getHiveTableName = (params) => Http.setPromise(`POST`, `/hive/getHiveTableName`, params)
// 生成运维任务
export const runSchedule = (params) => Http.setPromise(`POST`, `/schedule/genTask`, params)