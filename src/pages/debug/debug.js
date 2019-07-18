/**
 * @项目：debug
 * @创建人：ifuner
 * @创建人邮箱：zhoupengfei@kaiheikeji.com
 * @创建时间：2019-07-17 10:34:20
 * */

import store from "../../store"
import create from "../../utils/create"
import wxApi from "../../utils/wxApi"

const {$Message} = require("../../dist/base/index")
// const app = getApp()
create(store, {
    data: {
        wxUserInfo: {},
        accountInfo: {},
        customSize: {},
        autoGetUserInfoStatus: true,
        currentUserAgentInfo: {}
    },

    onLoad: function (target) {
        console.log("debug onLoad")
        this.update()
        this.getUserInfo()
        this.getAccountInfoSync()
    },
    onShow() {
    },
    onLogin(target) {
        console.log("debug onLogin")
    },
    getAccountInfoSync() {
        const fnName = "getAccountInfoSync"
        if (wx.canIUse(fnName)) {
            try {
                const accountInfo = wx[fnName]()
                this.setData({
                    accountInfo
                })
                console.log("accountInfo", accountInfo)
            } catch (e) {
                console.log("error", e)
            }
        }
    },
    handleGetUserInfo(target) {
        const {errMsg, userInfo} = target.detail
        if (/ok/g.test(errMsg)) {
            this.setData({
                wxUserInfo: userInfo
            })
        }
    },
    clearStorage(){
        this.wxApi("clearStorage").then(res=>{
            $Message({
                content: "清除成功",
                type: "success"
            })
        }).catch(error=>{
            $Message({
                content: "清除失败",
                type: "error"
            })
        })
    },
    getUserInfo() {
        this.wxApi("getUserInfo", {withCredentials: false, lang: "zh_CN"}).then(res => {
            console.log("getUserInfo", res)
            this.setData({
                autoGetUserInfoStatus: true,
                wxUserInfo: res.userInfo
            })
        }).catch(error => {
            console.log("getUserInfo", error)
            this.setData({
                autoGetUserInfoStatus: false
            })
        })
    },
    debug(isOpen = true) {
        wxApi("setEnableDebug", {enableDebug: isOpen}).then(res => {
            $Message({
                content: res.errMsg,
                type: "success"
            })
        }).catch(error => {
            console.log("error", error)
            $Message({
                content: error.errMsg,
                type: "error"
            })
        })
    },
    openDebug() {
        this.debug()
    },
    closeDebug() {
        this.debug(false)
    }
})
