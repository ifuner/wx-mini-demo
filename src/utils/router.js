/**
 * ifuner 制作 757148586@qq.com
 */

"use strict"
const ALL_ROUTER = {
    "INDEX_PAGES": "pages/index/index",  // 首页
    "DEBUG_PAGES": "packagesA/pages/debug/debug",  // 调试页面
    "USER_MSG_PAGES": "pages/UserMsg/UserMsg", // 用户信息
    "ADD_BAOJI_PAGES": "pages/AddBaoji/AddBaoji",  // 添加暴鸡
    "CREATE_CLUB_PAGES": "pages/CreateClub/CreateClub", // 创建或者编辑俱乐部
    "EDIT_BAOJI_PAGES": "pages/EditBaoji/EditBaoji", // 编辑俱乐部已有的暴鸡
    "OTHER_CLUB_PAGES": "pages/OtherClub/OtherClub", // 其他人的俱乐部
    "PHONE_LOGIN_PAGES": "pages/PhoneLogin/PhoneLogin",  // 手机号登录
    "WALLET_PAGES": "pages/wallet/wallet", // 钱包功能
    "MY_PAGES": "pages/my/my", // 我的，个人中心
    "WEBVIEW_PAGES": "pages/Webview/Webview", // 我的，个人中心
}
const ALL_TYPE = ["navigateTo", "redirectTo", "reLaunch", "switchTab"]
const util = require("./util")
import wxApi from "./wxApi"

const getPageString = (routerName, queryData) => {
    if (routerName && ALL_ROUTER.hasOwnProperty(routerName)) {
        const querySting = util.objToParams(queryData)
        return `/${ALL_ROUTER[routerName]}${querySting ? `?${querySting}` : ""}`
    } else {
        console.error("pages 未定义,请在js中先定义")
    }
}
const routeTo = function (routerName, type, queryData = {}) {
    let ret = {success: false, msg: ""}
    return new Promise((resolve, reject) => {
        if (routerName && ALL_ROUTER.hasOwnProperty(routerName)) {
            if (type && ALL_TYPE.some(item => item === type)) {
                const querySting = util.objToParams(queryData)
                wxApi(type, {
                    url: `/${ALL_ROUTER[routerName]}${querySting ? `?${querySting}` : ""}`
                }).then(res => {
                    ret.success = true
                    ret.msg = res
                    resolve(ret)
                }).catch(err => {
                    ret.msg = err
                    reject(ret)
                })
            } else {
                ret.msg = `type不在范围值内 ${ALL_TYPE.toString()}`
                console.error(ret.msg)
                reject(ret)
            }
        } else {
            ret.msg = "routerName 不能为空"
            console.error(ret.msg)
            reject(ret)
        }
    })
}

export default {
    routes: ALL_ROUTER,
    getPageString(routerKey, query = {}) {
        return getPageString(routerKey, query)
    },
    navigateTo(routerName, data = {}) {
        return routeTo(routerName, "navigateTo", data)
    },
    redirectTo(routerName, data = {}) {
        return routeTo(routerName, "redirectTo", data)
    },
    reLaunch(routerName, data = {}) {
        return routeTo(routerName, "reLaunch", data)
    },
    switchTab(routerName, data = {}) {
        return routeTo(routerName, "switchTab", data)
    },
    target({name, query, type}) {
        return routeTo(name, type, query)
    }
}
