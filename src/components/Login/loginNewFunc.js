import wxApi from "../../utils/wxApi"
import request from "../../utils/request"
import $router from "../../utils/router"
import store from "../../store"

const utils = require("../../utils/util")
module.exports = {
    getWxCode() {
        return new Promise((resolve, reject) => {
            wxApi("login").then(res => {
                if (res.errMsg.indexOf("ok") !== -1) {
                    store.data.loginWxCodeNum = res.code
                    resolve(res.code)
                } else {
                    utils.message({
                        content: "wx.login 返回结果出错",
                        type: "none"
                    })
                    reject(null)
                }
            }).catch(() => {
                utils.message({
                    content: "wx.login 调用方法出错",
                    type: "none"
                })
                reject(null)
            })
        })
    },
    getUserByWxCode(code) {
        return new Promise((resolve, reject) => {
            request.post("WX_CODE_LOGIN", {data: {code}}).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    wxGetUserInfoApi() {
        return new Promise((resolve, reject) => {
            wxApi("getUserInfo", {withCredentials: "true"}).then(res => {
                if (res.errMsg.indexOf("ok") !== -1) {
                    resolve(res)
                } else {
                    reject(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
    loginSuccess(token) {
        /**
         * 1. 登录成功需要做的事情
         * 2. 可能需要拉取自己的用户信息，个人资料啥的
         * */
        if (token && utils.isString(token)) {
            // wxApi("showTabBar")
            request.setToken(token)
            store.data.needLogin = false
            store.update()
            return store.setJavaToken(token)
        } else {
            utils.message({
                content: "token 不能为空",
                type: "error"
            })
        }
    },
    wxLoginByWxUserInfo(data = {}) {
        const {code, rawData, signature, encryptedData, iv} = data
        return new Promise((resolve, reject) => {
            request.post("WX_LOGIN_BY_WXAPI", {
                data: {
                    code,
                    rawData,
                    signature,
                    encryptedData,
                    iv
                }
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    toPhonePage(query = {}, type = "navigateTo") {
        $router[type]("PHONE_LOGIN_PAGES", query)
    },
}
