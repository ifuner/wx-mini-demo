import store from "./store"
import loginFunc from "./components/Login/loginFunc"
// 获取缓存中得token
store.getStorageJavaToken()
// 获取设备信息
store.getAgentInfo()
App({
    onLaunch: function (data) {
        store.data.enterMiniParams = data || {}
        console.log("store.data.enterMiniParams", store.data.enterMiniParams);
        loginFunc()
    },
    globalData: {
        userInfo: null,
        cancleRequest: false
    }
})


