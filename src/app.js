import store from "./store"

const loginFn = require("./components/Login/loginNewFunc")

App({
    onLaunch: function (data) {
        store.data.enterMiniParams = data || {}
        // 获取缓存中得token
        store.initStorageData()
        // 获取设备信息
        store.getAgentInfo()
        // 获取缓存token
        store.getStorageJavaToken()
        // 外部传的token进来，可以免登录
        this.setLoginToken(data)
        // 获取胶囊的位置信息
        store.getRightButtonPostion()

        store.onChange = function () {
            store.autoSaveToStorage()
        }
        this.onMemoryWarning()
        this.updateApp()
    },
    setLoginToken(data) {
        const {loginToken = ""} = (data.referrerInfo && data.referrerInfo.extraData) || {}
        loginToken && loginFn.loginSuccess(loginToken)
    },
    // 全局错误捕捉
    onError(target) {
        console.log("onError", target)
    },
    // 页面找不到捕捉
    onPageNotFound(target) {
        console.log("onPageNotFound", target)
    },
    onMemoryWarning() {
        console.log("内存监听")
        wx.onMemoryWarning((res) => {
            console.error("内存告警", res)
        })
    },
    // 更新App
    updateApp() {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log("updateManager.onCheckForUpdate", res.hasUpdate)
        })
        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: "更新提示",
                content: "新版本已经准备好，是否重启应用？",
                success(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })
        updateManager.onUpdateFailed(function (res) {
            // 新版本下载失败
            console.log("updateManager.onUpdateFailed", res)
        })
    },
    globalData: {
        userInfo: null,
        cancleRequest: false,
        userMsgPoster: {},
        shareImg:{},
    }
})


