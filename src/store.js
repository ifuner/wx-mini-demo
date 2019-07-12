import index from "./utils/storeData/index.js"
import wxApi from "./utils/wxApi"

export default {
    data: {
        index: index.data,
        loginStorageKey: "baojiClubJavaToken",
        currentUserAgentInfo: {},
        loginInfo: "",
        mpLoginStatus: -1,
        reTryLoginTimes: 0,
        enterMiniParams:{},
        loginStart: false, // 是否重新登录过
    },
    globalData: ["loginInfo"],

    getAgentInfo(newGet = false) {
        console.time("getAgentInfo")
        return new Promise((resolve, reject) => {
            // 获取 设备信息 网络情况 电池信息
            if (!newGet && Object.keys(this.data.currentUserAgentInfo).length) {
                console.log("getAgentInfo返回缓存值");
                resolve({success: true, data: this.data.currentUserAgentInfo})
            }
            Promise.all([wxApi("getSystemInfo"), wxApi("getNetworkType"), wxApi("getBatteryInfo")]).then(res => {
                let tempData = {}
                res.forEach(res => {
                    res.errMsg && delete res.errMsg
                    tempData = Object.assign(tempData, res)
                })
                this.data.currentUserAgentInfo = tempData
                console.timeEnd("getAgentInfo")
                resolve({success: true, data: tempData})
            }).catch(error => {
                resolve({success: false, data: error})
            })
        })
    },
    setJavaToken(data) {
        return new Promise((resolve, reject) => {
            wxApi("setStorage", {key: this.data.loginStorageKey, data: data}).then(res => {
                this.data.loginInfo = res
                resolve(data)
            }).catch(error => {
                console.log("存储失败");
                reject(error)
            })
        })
    },
    removeJavaToken() {
        return new Promise((resolve, reject) => {
            wxApi("removeStorage", {key: this.data.loginStorageKey}).then(res => {
                this.data.loginInfo = ""
                resolve()
            }).catch(error => {
                console.log("存储失败");
                reject(error)
            })
        })
    },
    getStorageJavaToken() {
        let ret = null
        try {
            var value = wx.getStorageSync(this.data.loginStorageKey)
            if (value) {
                console.log("value", value);
                this.data.loginInfo = value
            } else {
                this.data.loginInfo = ""
            }
        } catch (e) {
            this.data.loginInfo = ""
            console.log("缓存获取失败", e);
        }
        ret = this.data.loginInfo
        return ret
    },
    loginAccountByUniond(data) {
        return new Promise((resolve) => {
            this.setJavaToken(data).then(res => {
                console.log("数据放在了本地");
                resolve({success: true, data: res})
            }).catch(error => {
                console.log("存储失败");
                resolve({success: false, data: error})
            })
        })
    },
    //默认 false，为 true 会无脑更新所有实例
    //updateAll: true
}
