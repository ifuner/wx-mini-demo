/**
 * @项目：my
 * @创建人：ifuner
 * @创建人邮箱：zhoupengfei@kaiheikeji.com
 * @创建时间：2019-07-30 13:59:50
 * */

import store from "../../store"
import create from "../../utils/create"

const config = require("../../config")
console.log("config", config)
// const app = getApp()
create(store, {
    data: {
        bgColor: "transparent",
        tagetMiniProgram: {},
        version: "",
        mineInfo: {},
        loginInfo:"",
        defaultUserImg: "",
        feedBackStatus: wx.canIUse("button.open-type.feedback")
    },

    onLoad: function (target) {
        this.update()
        this.initVersion()
        this.getBaojiConfig()
    },
    onShow() {
        this.onLogin()
    },
    onLogin(target) {
        /*
        * 1. 在这个事件里面调用初始化业务
        * 2. 登录了就调接口 没登录就清楚之前的信息
        * */
        this.store.data.loginInfo ? this.getData():this.update({
            "mineInfo":{}
        })
    },
    handleLogin() {
        // this.store.data.needLogin = true
        this.selectComponent("#login").showLoginNow()
    },
    initVersion() {
        console.log("config", config)
        if (config.env === "prod") {
            this.setData({
                version: config.version
            })
        } else {
            this.setData({
                version: `${config.env} - ${config.version}`
            })
        }
    },
    copyId() {
        const uid = this.data.mineInfo.chickenId
        uid && this.wxApi("setClipboardData", {
            data: uid,
        }).then(() => {
            this.$Message({
                content: "复制成功",
                type: "success"
            })
        })
    },
    previewImage() {
        const imgUrl = this.data.mineInfo && this.data.mineInfo.thumbnail
        imgUrl && this.wxApi("previewImage", {urls: [imgUrl]})
    },
    getData() {
        this.store.getMyUserInfo().then(res => {
            this.update()
        }).catch(err => {
            console.log("err", err)
        })
    },
    getBaojiConfig() {
        this.setData({
            tagetMiniProgram: Object.assign({}, this.store.getMiniProgram("my"))
        })
    },
})
