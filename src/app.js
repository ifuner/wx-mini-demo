import store from "./store"
import loginFunc from "./components/Login/loginFunc"
// 获取缓存中得token
store.getStorageJavaToken()
// 获取设备信息
store.getAgentInfo()
loginFunc()
App({
    onLaunch: function (data) {
        store.data.enterMiniParams = data || {}
        console.log("store.data.enterMiniParams", store.data.enterMiniParams)
        // 获取胶囊的位置信息
        store.getRightButtonPostion()
        this.updateApp()
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
        cancleRequest: false
    }
})


