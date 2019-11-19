/**
 * ifuner 制作 757148586@qq.com
 */


"use strict"
import config from "../config"
import util from "./util"
import apiData from "./apiData/index"
import store from "../store"
import wxApi from "./wxApi"

const loginFn = require("../components/Login/loginNewFunc")
const MOCK = require("./apiData/MOCK")
const ALL_SUPPROTS = ["OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE", "TRACE", "CONNECT"]
const delBlank = function (stringData) {
    return stringData.replace(/\s/g, "")
}
const cancleToken = function (isOpen = false) {
    getApp().globalData.cancleRequest = isOpen
}

// 设置token
const setToken = (token = null) => {
    store.data.loginInfo = token
}
// 401 重新尝试登录
const reGetLogin = () => new Promise((resolve, reject) => {
    const loginToken = store.getStorageJavaToken()
    if (loginToken) {
        resolve(loginToken)
        return false
    }

    store.data.reTryLoginTimes++
    if (store.data.reTryLoginTimes > 5) {
        store.data.reTryLoginTimes = 0
        reject({code: 500, msg: "超次数重试"})
        return false
    }

    loginFn.getWxCode().then(code => {
        loginFn.getUserByWxCode(code).then(codeRes => {
            if (codeRes.data) {
                loginFn.loginSuccess(codeRes.data)
                store.data.reTryLoginTimes = 0
                console.log("loginFn.getWxCode 被调用了")
                resolve(codeRes.data)
            } else {
                reject(null)
            }
        }).catch(() => {
            Promise.all([loginFn.getWxCode(), loginFn.wxGetUserInfoApi()]).then(userData => {
                const [codeData, userInfo] = userData
                loginFn.wxLoginByWxUserInfo({code: codeData, ...userInfo}).then(res => {
                    if (res.data) {
                        loginFn.loginSuccess(res.data)
                        store.data.reTryLoginTimes = 0
                        resolve(res.data)
                    } else {
                        reject(null)
                    }
                }).catch(error => {
                    reject(null)
                })
            })
            reject(null)
        })
    }).catch(() => {
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
let timmer = null
const handleResponse = function (apiName, requestMethod, apiHost, args) {
    return new Promise((resolve, reject) => {
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

        const requestFn = () => {
            const app = getApp().globalData
            const currentToken = store.data.loginInfo
            if (!app.cancleRequest) {
                // mock 数据
                if (config.mock && config.env === "local" && MOCK.hasOwnProperty(apiName)) {
                    let MOCK_DATA = MOCK[apiName]
                    MOCK_DATA = Object.assign(MOCK_DATA, {mockTips: "当前是mock数据，请注意~"})
                    let nowTime = +new Date()
                    timmer = setTimeout(() => {
                        console.group("MOCK请求")
                        console.log("请求时参数", apiName, requestMethod, apiHost, args)
                        app.cancleRequest && clearTimeout(timmer)
                        console.log("消耗时间", `${(+new Date() - nowTime)}ms`)
                        if (MOCK_DATA.code === 200) {
                            console.log("正常状态数据", MOCK_DATA)
                            resolve(MOCK_DATA)
                        } else {
                            console.log("异常返回", MOCK_DATA)
                            reject(MOCK_DATA)
                        }
                        console.groupEnd("MOCK请求")
                    }, [100, 150, 200, 300, 350, 450, 500][parseInt(Math.random() * 6)])
                    return false
                }

                let nowTime = +new Date()
                const requestTask = wx.request(Object.assign({}, {...args}, {method},
                    {url: `${apiHost}${currentRequestUrl}`},
                    {
                        header: Object.assign({}, currentToken && {loginToken: currentToken}, args.header || {})
                    },
                    {
                        complete(res) {
                            console.group("真实请求发出")
                            console.info("请求时参数", apiName, requestMethod, apiHost + currentRequestUrl, args)
                            console.info("消耗时间", `${(+new Date() - nowTime)}ms`)
                            console.info("返回数据（未包装）", res)
                            console.groupEnd("真实请求发出")
                            errorHandele(res, resolve, reject)
                        }
                    }
                ))
                app.cancleRequest && requestTask.abort()

            } else {
                console.error("无法继续发出请求，请调用cancleRequest(false) 关闭")
            }
        }

        const errorHandele = (resData, resolve, reject) => {
            let ret = {code: 400, msg: "未知错误"}
            const {statusCode, data = {}, errMsg = ""} = resData
            // 数据上报
            const uploadErr = (data = {}) => {
                let tempData = JSON.parse(JSON.stringify(data))
                tempData.msg = /[\u4E00-\u9FA5\uF900-\uFA2D]$/g.test(data.msg) ? data.msg : data.msg.replace(/(\s|\r|\n|\t|\f|\b|\W)/g, "")
                wx.reportAnalytics("api_error", {
                    api_name: apiName,
                    request_method: requestMethod,
                    api_host: apiHost,
                    args: JSON.stringify(args),
                    error_data: JSON.stringify(tempData),
                })
                // 你也可以接口钉钉机器人，有错误就通知，access_token我先暂清楚了
                config.dingding && wxApi("request", {
                    url: "https://oapi.dingtalk.com/robot/send?access_token=xxx",
                    method: "POST",
                    data: {
                        msgtype: "markdown",
                        markdown: {
                            title: "接口使用异常预警",
                            text: `
                \n # 接口使用异常预警 \n
                \n #### 接口地址：[${requestMethod}] \n
                \n > ###### [${ apiHost + currentRequestUrl}](${apiHost + currentRequestUrl}) \n
                \n #### 用户认证token：${store.data.mineInfo.username ? `[${store.data.mineInfo.username}]` : ""}\n
                \n > ###### ${store.data.loginInfo || "匿名用户操作接口"} \n
                \n #### 请求传参：\n
                \n > ###### ${JSON.stringify(args)} \n
                \n #### 响应数据: \n
                \n > ###### ${JSON.stringify(tempData)} \n
                \n ###### ${util.formatTime()} &nbsp;&nbsp;&nbsp;&nbsp;${config.env}-${config.version}\n
                `,
                            isAtAll: true
                        }
                    },
                })
            }
            // 处理异常出错
            if (errMsg.indexOf("fail") > 0) {
                ret.msg = errMsg
                uploadErr(ret)
                reject(ret)
                return false
            }

            if (statusCode === 401 || (data && data.code === 401)) {
                /**
                 * 1. 会尝试重新登录获取token 并继续请求
                 * 2. 重试失败，包括login getUserfInfo 以及接口授权需要授权的话就默认失败走方案B 刷新
                 * */
                console.log("登录凭证失效,正在重新登录...")
                cancleToken(true)
                const retryFn = () => {
                    reGetLogin().then(() => {
                        // util.message({
                        //     content: "自动登录成功",
                        //     type: "success"
                        // })

                        // 重试登成功后的操作...
                    }).catch(error => {
                        console.log("error", error)
                        if (error && error.code && error.code === 500) {
                            store.removeJavaToken(null)
                            setToken(null)
                            util.message({
                                content: error.msg,
                                type: "error"
                            })
                        } else {
                            wx.reLaunch({
                                url: util.getCurrentPage()
                            })
                        }
                    })
                }
                store.removeJavaToken(null).then(() => {
                    cancleToken(false)
                    retryFn()
                }).catch(() => retryFn())
                return false
            }

            if (statusCode !== 200 || (data && data.code !== 200)) {
                if (data && data.code !== undefined) {
                    ret = data
                } else {
                    ret = Object.assign({}, {code: data.code || statusCode}, getErrorStatusCodeMsg(statusCode))
                    util.message({
                        content: ret.msg || `${data.code} ${ret.msg}`,
                        type: "error"
                    })
                }
                uploadErr(ret)
                console.log("ret", ret)
                reject(ret)
            } else {
                resolve(data)
            }
        }
        return requestFn()
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
