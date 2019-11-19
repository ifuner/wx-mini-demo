/**
 * ifuner 制作 757148586@qq.com
 *  0 登录成功 1 正在登录 2 登录失败
 */

"use strict"
import store from "../../store"
import loginFn from "./loginNewFunc"
// import wxApi from "../../utils/wxApi"

const utils = require("../../utils/util")
const loginFunc = require("./loginNewFunc")
const loginSuccess = (token, resolve, reject) => {
    if (token && utils.isString(token)) {
        loginFunc.loginSuccess(token)
        resolve && resolve()
    } else {
        utils.message({
            content: "token 不能为空",
            type: "error"
        })
        reject && reject()
    }
}
export default function () {
    const loginToken = store.getStorageJavaToken()

    if (loginToken && utils.isString(loginToken)) {
        return new Promise((resolve) => {
            loginFunc.loginSuccess(loginToken)
            resolve({msg: "缓存token登录", data: loginToken, code: 0})
        })
    } else {
        // wxApi("hideTabBar")
        return new Promise((resolve, reject) => {
            loginFunc.getWxCode().then(code => {
                loginFunc.getUserByWxCode(code).then(getUserApiRes => {
                    loginSuccess(getUserApiRes.data,
                        () => resolve({msg: "用户通过code 登录成功", data: getUserApiRes.data, code: 0}),
                        () => reject({msg: "getWxCode token 为空了", data: getUserApiRes, code: -1})
                    )
                }).catch(error => {
                    console.log("code 不是老用户", error)
                    Promise.all([loginFn.getWxCode(), loginFunc.wxGetUserInfoApi()]).then(userData => {
                        const [codeData, userInfo] = userData
                        loginFunc.wxLoginByWxUserInfo({code: codeData, ...userInfo}).then(res => {
                            console.log("res.normal", res)
                            loginSuccess(res.data,
                                () => resolve({msg: "用户通过wx.getUserInfo 登录成功", data: res.data, code: 0}),
                                () => reject({msg: "loginFunc.wxLoginByWxUserInfo token 为空了", data: res.data, code: -1})
                            )
                            //    如果时老用户就登录
                        }).catch(userError => {
                            if (userError.code === 202) {
                                reject({msg: "用户通过wx.getUserInfo接口不是老用户", data: userError, code: -2})
                                // loginFunc.toPhonePage({
                                //     type: "bind",
                                //     wxAuth: 1,
                                //     backUrl: encodeURIComponent(utils.getCurrentPage())
                                // }, "redirectTo")
                            } else {
                                utils.message({
                                    content: `授权${userError.code}`,
                                    type: "error"
                                })
                                reject({msg: "用户通过wx.getUserInfo 调用接口出错", data: userError, code: -1})
                            }
                            console.log("userError", userError)
                        })
                    }).catch(() => {
                        reject({msg: "获取微信code 或者userinfo 出错", code: -1})
                    })
                })
            }).catch(error => {
                console.log("code 错误", error)
                reject({msg: "获取微信code 出错", data: error, code: -1})
            })
        })
    }
}
