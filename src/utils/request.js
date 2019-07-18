/**
 * ifuner 制作 @18658226071@163.com
 */

"use strict"
import config from "../config"
import util from "./util"
import apiData from "./apiData/index"
import store from "../store"
import wxApi from "./wxApi"

const ALL_SUPPROTS = ["OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE", "TRACE", "CONNECT"]
const delBlank = function (stringData) {
    return stringData.replace(/\s/g, "")
}
const cancleToken = function (isOpen = false) {
    getApp().globalData.cancleRequest = isOpen
}

const getCurrentPage = () => {
    const current = getCurrentPages()[getCurrentPages().length - 1]
    let params = "/" + current.route
    let options = current.options
    if (Object.keys(options).length > 0) {
        for (let i in options) {
            params += `${params.indexOf("?") > 0 ? "&" : "?"}${i}=${options[i]}`
        }
    }
    return params
}
// 设置token
const setToken = (token = null) => {
    store.data.loginInfo = token
}
// 401 重新尝试登录
const reGetLogin = () => new Promise((resolve, reject) => {
    store.data.reTryLoginTimes++
    if (store.data.reTryLoginTimes > 5) {
        store.data.reTryLoginTimes = 0
        console.log("重试超过次数")
        reject(null)
    }
    Promise.all([wxApi("login"), wxApi("getUserInfo")]).then(res => {
        cancleToken(false)
        const [loginData, wxUserInfoData] = res
        store.loginAccountByUniond(loginData.code).then(res => {
            if (res.success) {
                console.log("wxUserInfoData", wxUserInfoData);
                setToken(res.data)
                resolve(res.data)
            } else {
                reject(null)
            }
        })
    }).catch(()=>{
        reject(null)
    })
})
const getErrorStatusCodeMsg = function (statusCode) {
    let ret = {code: 400, msg: "未知错误"}
    switch (statusCode) {
        case 400:
            ret.msg = "请求错误"
            break
        case 403:
            ret.msg = "权限不足拒绝访问"
            break
        case 404:
            ret.msg = "接口找不到了"
            break
        case 500:
            ret.msg = "服务器内部错误"
            break
        case 408:
            ret.msg = "请求超时"
            break
        case 501:
            ret.msg = "服务未实现"
            break
        case 502:
            ret.msg = "网关错误"
            break
        case 503:
            ret.msg = "服务不可用"
            break
        case 504:
            ret.msg = "网关超时"
            break
        case 505:
            ret.msg = "HTTP版本不受支持"
            break
        default:
            ret.msg = "未知错误"
    }
    ret.code = statusCode
    return ret
}
const handleResponse = function (apiName, requestMethod, apiHost, args) {
    const tempQueryData = [apiName, requestMethod, apiHost, args]
    apiHost = apiHost || config.apiHost
    const method = requestMethod && requestMethod.toUpperCase() || ""
    if (!method || !ALL_SUPPROTS.some(item => item === method)) {
        console.error(`method 不能为空并且 method 要在${JSON.stringify(ALL_SUPPROTS)}支持范围内`)
        return false
    }
    /**
     * api 的两种类型
     * string
     * Object {key:apiName,p1:p1Data,p2:p2Data}
     */
    let currentApiConstName = ""
    let currentRequestUrl = ""
    const apiObj = util.isObj(apiName)
    const apiString = util.isString(apiName)
    if (apiObj || apiString) {
        currentApiConstName = delBlank(apiObj ? apiName.key : apiString ? apiName : apiName)
    } else {
        console.error(`apiName 不能为空并且 apiName要在apiData/index.js 文件中定义哟~`)
        return false
    }
    if (currentApiConstName && apiData.hasOwnProperty(currentApiConstName)) {
        currentRequestUrl = apiData[currentApiConstName]
        if (apiObj) {
            //     进行替换工作
            currentRequestUrl = currentRequestUrl.replace(/[$]p[1-3][$]/g, (value) => {
                return apiName[value.replace(/[$]/g, "")] || ""
            })
        }
    } else {
        console.error(`currentApiConstName 未在定义文件中找到，请在/apiData/index.js 中先定义再使用`)
        return false
    }

    const errorHandele = (resData, resolve, reject) => {
        let ret = {code: 400, msg: "未知错误"}
        console.log("resData", resData)
        const {statusCode, data = {}, errMsg = ""} = resData
        // 处理异常出错
        if (errMsg.indexOf("fail") > 0) {
            ret.msg = errMsg
            reject(ret)
            return false
        }

        if (statusCode !== 200) {
            if (statusCode === 401) {
                cancleToken(true)
                store.data.mpLoginStatus = 1
                /**
                 * 1. 会尝试重新登录获取token 并继续请求
                 * 2. 重试失败，包括login getUserfInfo 以及接口授权需要授权的话就默认失败走方案B 刷新
                 * */
                reGetLogin().then(res => {
                    console.log("自动login 尝试中")
                    handleResponse(...tempQueryData)
                }).catch(error => {
                    store.removeJavaToken(null).then(res => {
                        cancleToken(false)
                        wx.reLaunch({
                            url: getCurrentPage()
                        })
                    }).catch(error => {
                        console.log("res", res)
                    })
                })
            } else {
                reject(Object.assign(ret, getErrorStatusCodeMsg(statusCode)))
            }
        } else {
            ret.code = util.isUndefined(data.code) ? statusCode : data.code
            resolve(Object.assign(ret, {data: util.isNumber(data.code) ? data.data : data}, data.msg && {msg: data.msg}))
        }
    }
    const app = getApp().globalData
    return new Promise((resolve, reject) => {
        const currentToken = store.data.loginInfo
        console.log("currentToken", currentToken)
        if (!app.cancleRequest) {
            const requestTask = wx.request(Object.assign({}, {...args}, {method},
                {url: `${apiHost}${currentRequestUrl}`},
                {
                    header: Object.assign({}, currentToken && {auth: currentToken}, args.header || {})
                },
                {
                    complete(res) {
                        errorHandele(res, resolve, reject)
                    }
                }
            ))
            app.cancleRequest && requestTask.abort()
        } else {
            console.error("无法继续发出请求，请调用cancleRequest(false) 关闭")
        }
    })
}
export default {
    get: function (apiName, args = {}) {
        return handleResponse(apiName, "get", "", args)
    },
    post: function (apiName, args = {}) {
        return handleResponse(apiName, "post", "", args)
    },
    put: function (apiName, args = {}) {
        return handleResponse(apiName, "put", "", args)
    },
    delete: function (apiName, args = {}) {
        return handleResponse(apiName, "delete", "", args)
    },
    python: {
        get: function (apiName, args = {}) {
            return handleResponse(apiName, "get", config.apiPythonHost, args)
        },
        post: function (apiName, args = {}) {
            return handleResponse(apiName, "post", config.apiPythonHost, args)
        },
        put: function (apiName, args = {}) {
            return handleResponse(apiName, "put", config.apiPythonHost, args)
        },
        delete: function (apiName, args = {}) {
            return handleResponse(apiName, "delete", config.apiPythonHost, args)
        }
    },
    setToken,
    // 取消当前所有的请求
    cancleRequest: cancleToken
}
