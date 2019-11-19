/**
 * @项目：debug
 * @创建人：ifuner
 * @创建人邮箱：zhoupengfei@kaiheikeji.com
 * @创建时间：2019-07-17 10:34:20
 * */

import store from "../../../store"
import create from "../../../utils/create"
import wxApi from "../../../utils/wxApi"

const config = require("../../../config")
console.log("config", config)

// const app = getApp()
create(store, {
    data: {
        localUrl: config.apiHost,
        bgColor: "transparent",
        wxUserInfo: {},
        accountInfo: {},
        customSize: {},
        storageInfo: {},
        storageData: {},
        autoGetUserInfoStatus: true,
        queryData: "",
        pagesData: "",
        current: "navigateTo",
        wxCode: "",
        wxSignData: {},
        targetType: [
            "switchTab",
            "reLaunch",
            "redirectTo",
            "navigateTo",
        ],
        phoneData: {},
        currentEnv: config.env,
        targetEnv: config.allEnv,
        ALL_ROUTES: {},
        currentUserAgentInfo: {}
    },
    onLoad: function (target) {
        console.log("debug onLoad")
        this.update()
        this.getWxCode().then(res => {
            this.getUserInfo()
        })
        this.getStorageInfo()
        this.getAccountInfoSync()
        this.setData({
            ALL_ROUTES: this.$router.routes
        })
    },
    onShow() {
    },

    getStorageInfo() {
        this.wxApi("getStorageInfo").then(res => {
            console.log("res", res)
            this.setData({
                storageInfo: res
            })
            const tempArr = res.keys.map(item => {
                return wxApi("getStorage", {key: item})
            })
            Promise.all(tempArr).then(storageData => {
                console.log("storageData", storageData)
                let tempdata = storageData.map(sitem => {
                    if (sitem.errMsg.indexOf("ok") !== -1) {
                        return sitem.data
                    }
                })
                this.setData({
                    storageData: JSON.stringify(tempdata)
                })
            })

        })
    },
    handleChange(target) {
        console.log("target", target)
        this.setData({
            current: target.detail.key
        })
    },
    handleChangeEnv(target) {
        const currentEnv = target.detail.key
        this.setData({
            currentEnv
        })
        let storageData = {
            lastEditTime: +new Date(),
            version: config.version,
            currentEnv
        }
        if (currentEnv === "local" && /^http:\/\/192+/.test(this.data.localUrl)) {
            storageData.ipAddress = this.data.localUrl
        }

        this.wxApi("setStorage", {
            key: "envSettings",
            data: storageData
        }).then(res => {
            wx.reportAnalytics("change_env", {
                data: JSON.stringify(storageData),
                user_msg: JSON.stringify(this.data.wxUserInfo || {})
            })
            this.$Message({
                content: `${storageData.ipAddress ? "本地请求host已设置" : ""} 请杀掉微信进程重新进入该小程序~`,
                type: "none"
            })
        })
    },
    targetPages(target) {
        const {queryData, current} = this.data
        const pagesString = target.currentTarget.dataset.value
        this.wxApi(current, {url: `/${pagesString}${queryData ? `?${queryData}` : ""}`})
    },
    handleTarget() {
        const {queryData, pagesData, current} = this.data
        if (pagesData.indexOf("pages") !== -1) {
            this.wxApi(current, {url: `/${pagesData}${queryData ? `?${queryData}` : ""}`})
        } else {
            this.$Message({
                content: "pagesData 不合法",
                type: "error"
            })
        }
    },
    handleGetPhoneInfo(target) {
        console.log("target", target.detail)
        if (target.detail.errMsg.indexOf("ok") !== -1) {
            this.setData({
                phoneData: JSON.stringify(target.detail)
            })
        }
    },
    copyPhoneData() {
        let {phoneData} = this.data
        phoneData && this.wxApi("setClipboardData", {
            data: phoneData,
        }).then(() => {
            this.$Message({
                content: "复制成功",
                type: "success"
            })
        })
    },
    setLocalUrlData(target) {
        this.setData({
            localUrl: target.detail.value
        })
    },
    setPagesData(target) {
        this.setData({
            pagesData: target.detail.value
        })
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
    copyStorageData() {
        let {storageData} = this.data
        storageData && this.wxApi("setClipboardData", {
            data: storageData,
        }).then(() => {
            this.$Message({
                content: "复制成功",
                type: "success"
            })
        })
    },
    copyText() {
        let {wxSignData, wxCode} = this.data
        Object.keys(wxSignData).length && wxCode && this.wxApi("setClipboardData", {
            data: JSON.stringify({
                code: wxCode,
                ...wxSignData
            }),
        }).then(() => {
            this.$Message({
                content: "复制成功",
                type: "success"
            })
        })
    },
    handleGetUserInfo(target) {
        const {errMsg, userInfo} = target.detail
        if (/ok/g.test(errMsg)) {
            this.getWxCode()
            this.setData({
                wxUserInfo: userInfo,
                autoGetUserInfoStatus: true,
                wxSignData: {
                    rawData: target.detail.rawData,
                    signature: target.detail.signature,
                    iv: target.detail.iv,
                    encryptedData: target.detail.encryptedData,
                },
            })
            wx.reportAnalytics("open_debug", {
                user_msg: JSON.stringify(userInfo)
            })
        }
    },

    clearStorage() {
        this.wxApi("clearStorage").then(res => {
            this.$Message({
                content: "清除成功",
                type: "success"
            })
        }).catch(error => {
            this.$Message({
                content: "清除失败",
                type: "error"
            })
        })
    },
    clearToken() {
        this.store.removeJavaToken().then(res => {
            this.$http.setToken("")
            this.update()
            this.$Message({
                content: "token 和 header token 已清空",
                type: "none"
            })
        })
    },
    copyUserAgent(){
        const currentUserAgentInfo = this.data.currentUserAgentInfo
        currentUserAgentInfo && this.wxApi("setClipboardData", {
            data: JSON.stringify(currentUserAgentInfo),
        }).then(() => {
            this.$Message({
                content: "复制成功",
                type: "success"
            })
        })
    },
    successMessage() {
        this.$Message({
            content: "加载成功",
            type: "success"
        })
    },
    errorMessage() {
        this.$Message({
            content: "加载失败",
            type: "error"
        })
    },
    loadingMessage() {
        this.$Message({
            content: "加载中...",
            type: "loading"
        })
    },
    notIconMessage() {
        this.$Message({
            content: "hello world",
            type: "none"
        })
    },
    getWxCode() {
        return new Promise((resolve) => {
            this.wxApi("login").then(res => {
                console.log("wxCode", res)
                this.setData({
                    wxCode: res.code
                })
                resolve()
            }).catch(err => {
                this.$Message({
                    content: err,
                    type: "error"
                })
            })
        })
    },
    getUserInfo() {
        return new Promise((resolve) => {
            this.wxApi("getUserInfo", {withCredentials: true, lang: "zh_CN"}).then(res => {
                console.log("res", res)
                if (res.errMsg.indexOf("ok") !== -1) {
                    this.setData({
                        wxSignData: {
                            rawData: res.rawData,
                            signature: res.signature,
                            iv: res.iv,
                            encryptedData: res.encryptedData,
                        },
                        autoGetUserInfoStatus: true,
                        wxUserInfo: res.userInfo
                    })
                    wx.reportAnalytics("open_debug", {
                        user_msg: JSON.stringify(res.userInfo)
                    })
                    resolve(res.userInfo)
                } else {
                    resolve(null)
                }

            }).catch(error => {
                console.log("getUserInfo", error)
                resolve(null)
                this.setData({
                    autoGetUserInfoStatus: false
                })
            })
        })
    },
    debug(isOpen = true) {
        wxApi("setEnableDebug", {enableDebug: isOpen}).then(res => {
            this.$Message({
                content: res.errMsg,
                type: "success"
            })
        }).catch(error => {
            console.log("error", error)
            this.$Message({
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
