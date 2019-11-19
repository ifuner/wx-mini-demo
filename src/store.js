import index from "./utils/storeData/index.js"
import userMsg from "./utils/storeData/userMsg.js"
import club from "./utils/storeData/club.js"
// import addBaoji from "./utils/storeData/addBaoji.js"
import wxApi from "./utils/wxApi"
import config from "./config"
import utils from "./utils/util"
import request from "./utils/request"

export default {
    data: {
        loginStorageKey: `baojiClubJavaToken_${config.env}`,
        storeStorageKey: `storeJsData_${config.env}`,
        currentUserAgentInfo: {},
        customSize: {},
        loginTempData: {},
        loginInfo: "",
        needLogin: false,
        reTryLoginTimes: 0,
        enterMiniParams: {},
        customSafeDistanceSize: 10,
        loginWxCodeNum: "", // 是否重新登录过
        // 业务逻辑开始
        myClubDeatil: {}, // 我的俱乐部详情,需要缓存
        index: index.data,
        userMsg: userMsg.data,
        clubData: club.data,
        EnumsListData: {},
        defaultUserImg: "https://g.baojiesports.com/bps/e6209f0062b0424cb620606b2af80cce-160-160.png",
        mineInfo: {}
    },
    globalData: ["loginInfo", "currentUserAgentInfo", "needLogin", "myClubDeatil", "EnumsListData"],
    // 跳转到其他小程序的
    getMiniProgram(type = "index", queryData = {}) {
        const baojiAppId = "wx67ed7f6a3fadef81"
        // B小程序的path
        const ALL_PATH = {
            index: "/pages/tabBar/index/index",
            exclusiveOrder: "/pages/my/pages/exclusiveOrder/exclusiveOrder",
            chat: "/pages/chat/chat",
            my: "/pages/tabBar/my/index",
            single: "/pages/tabBar/singleChat/singleChat"
        }
        let currentPath = ""
        if (type && ALL_PATH.hasOwnProperty(type)) {
            currentPath = ALL_PATH[type]
        } else {
            currentPath = ALL_PATH["index"]
        }
        const query = utils.objToParams(queryData)
        return {
            appId: baojiAppId,
            path: `${currentPath}${query ? `?${query}` : ""}`,
            envVersion: config.miniEnvVersion
        }
    },
    getRightButtonPostion() {
        if (wx.getMenuButtonBoundingClientRect) {
            let size = wx.getMenuButtonBoundingClientRect()
            // 个别手机的异常情况
            size.width = size.width > 200 ? 87 : size.width || 200
            size.height = size.height > 40 ? 32 : size.height || 40
            size.top = size.top === 0 ? 26 : size.top || 26

            this.data.customSize = size
        }
    },
    autoSaveToStorage() {
        return wxApi("setStorage", {key: this.data.storeStorageKey, data: this.data})
    },
    initStorageData() {
        try {
            const value = wx.getStorageSync(this.data.storeStorageKey)
            console.log("value", value)
            if (value && utils.isObj(value)) {
                this.data = utils.deepObjectMerge(this.data, value)
            }
        } catch (e) {
            console.log("初始化缓存数据出错", e)
        }
    },
    getAgentInfo(newGet = false) {
        let startTime = +new Date()
        return new Promise((resolve, reject) => {
            // 获取 设备信息 网络情况 电池信息
            if (!newGet && Object.keys(this.data.currentUserAgentInfo).length) {
                console.log("getAgentInfo返回缓存值")
                resolve({success: true, data: this.data.currentUserAgentInfo})
            }
            Promise.all([wxApi("getSystemInfo"), wxApi("getNetworkType"), wxApi("getBatteryInfo")]).then(res => {
                let tempData = {}
                res.forEach(res => {
                    res.errMsg && delete res.errMsg
                    tempData = Object.assign(tempData, res)
                })
                this.data.currentUserAgentInfo = tempData
                console.log("getAgentInfo:", +new Date() - startTime + "ms")
                resolve({success: true, data: tempData})
            }).catch(error => {
                resolve({success: false, data: error})
            })
        })
    },
    setJavaToken(data) {
        this.data.loginInfo = data
        return new Promise((resolve, reject) => {
            wxApi("setStorage", {key: this.data.loginStorageKey, data: data}).then(() => {
                resolve(data)
            }).catch(error => {
                console.log("存储失败")
                reject(error)
            })
        })
    },
    removeJavaToken() {
        return new Promise((resolve, reject) => {
            this.data.loginInfo = ""
            wxApi("removeStorage", {key: this.data.loginStorageKey}).then(() => {
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    getStorageJavaToken() {
        let ret = ""
        try {
            var value = wx.getStorageSync(this.data.loginStorageKey)
            if (value) {
                console.log("value", value)
                ret = value
            }
        } catch (e) {
            console.log("缓存获取失败", e)
        }
        this.data.loginInfo = ret
        request.setToken(this.data.loginInfo)
        return ret
    },
    loadFontFamily() {
        Promise.all([wxApi("loadFontFace", {
            family: "BebasNeueBold",
            source: "url('https://g.baojiesports.com/bps/997d4f8a/bebasneuebold.ttf')"
        }),
            wxApi("loadFontFace", {
                family: "bebasneueregular",
                source: "url('https://g.baojiesports.com/bps/33d7d767/bebasneueregular.ttf')"
            })
        ])
    },
    // 获取枚举值得
    getEnumsList() {
        return new Promise((resolve, reject) => {
            const storeData = this.data.EnumsListData
            if (Object.keys(storeData).length) {
                resolve(storeData)
            }
            request.get("GET_ENUMS_LIST").then(res => {
                this.data.EnumsListData = res.data
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取个人信息的接口
    getMyUserInfo() {
        return new Promise((resolve, reject) => {
            request.get("MY_USER_INFO").then(res => {
                this.data.mineInfo = res.data
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取我得俱乐部
    getClubData(status = false) {
        return new Promise((resolve, reject) => {
            const data = this.data.myClubDeatil
            if (!status && data && Object.keys(data).length) {
                resolve(data)
            } else {
                request.get("MY_CLUB_DETAILT").then(res => {
                    this.data.myClubDeatil = res.data
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            }

        })
    },
    // 微信登录的逻辑
    //默认 false，为 true 会无脑更新所有实例
    //updateAll: true
}
