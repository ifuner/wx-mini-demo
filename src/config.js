/**
 * ifuner 制作 757148586@qq.com
 * 用来配置当前的接口请求的地址
 */
"use strict"
import utils from "./utils/util"

let currentEnv = "local"
let localUrl = "http://192.168.2.9:9005"
try {
    const value = wx.getStorageSync("envSettings")
    if (value && utils.isObj(value)) {
        console.log("使用的环境变量", value.currentEnv)
        currentEnv = value.currentEnv
        value.ipAddress && (localUrl = value.ipAddress)
    }
} catch (e) {
    console.log(e)
}

module.exports = {
    env: currentEnv,
    version: "1.0.0",
    allEnv: ["local", "dev", "test", "prod"],
    // java 相关API
    mock: true, // 是否开启mock 针对全局并且只有local 有效
    dingding: false, // 尽量只在本地开发开启
    // 登录白名单页面
    LOGIN_WHITE_LIST:[
        "pages/index/index",
        "pages/UserMsg/UserMsg",
        "pages/my/my",
        "pages/Webview/Webview",
        "pages/OtherClub/OtherClub"
    ],
    miniEnvVersion: {
        "local": "develop",
        "dev": "trial",
        "test": "trial",
        // "prod": "release", // 正式版
        "prod": "trial", // 临时体验版
    }[currentEnv],
    apiHost: {
        local: localUrl,
        dev: "https://dev.xxx.com",
        test: "https://test.xxx.com",
        prod: "https://prod.xxx.com"
    }[currentEnv],
    // python 相关APi
    apiPythonHost: {
        local: "https://dev-g.xxx.com",
        dev: "https://dev-g.xxx.com",
        test: "https://test-g.xxx.com",
        prod: "https://g.xxx.com"
    }[currentEnv]
}
