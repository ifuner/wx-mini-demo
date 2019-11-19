import create from "../../utils/create"
import LoginFunc from "./loginFunc"
import store from "../../store"
import util from "../../utils/util"

const config = require("../../config")
const loginFn = require("./loginNewFunc")
create({
    /**
     * 组件的属性列表
     */
    properties: {},
    data: {
        feedBackStatus: false,
        mpLoginStatus: -1,
        needLogin: "",
        mpLoginFailMsg: "",
        loginInfo: "",
        loginHover: "",
        loginTextHover: "",
        customSafeDistanceSize: store.data.customSafeDistanceSize||{},
        customSize: wx.getMenuButtonBoundingClientRect && wx.getMenuButtonBoundingClientRect() || {},
    },
    ready: function () {
        this.update()
        this.login()
    },
    methods: {
        login: function () {
            /**
             * 1. 判断token 是否存在
             * 存在即返回，不存在就走流程
             * 0 登录成功 1 正在登录 2 登录失败
             * */
            LoginFunc().then(res => {
                this.setData({mpLoginStatus: 0})
                this.emitLogin()
                console.log("登录成功", res)
            }).catch(err => {
                console.log("this.isWhitePage()", err)
                if (this.isWhitePage()) {
                    console.log("白名单页面，权限按需弹出")
                    this.update({
                        needLogin: false
                    })
                    this.setData({mpLoginStatus: 2})
                    this.emitLogin()
                } else {
                    this.setData({mpLoginStatus: 2})
                    this.showAnimate()
                }
                // console.log("显示登录界面", err)
                // this.setData({mpLoginStatus: 2})
            })
        },
        isWhitePage() {
            const current = this.getCurrentPage()
            return config.LOGIN_WHITE_LIST.some(item => item === current)
        },
        getCurrentPage() {
            const current = this.utils.getCurrentPage()
            let temp
            temp = current.indexOf("?") !== -1 ? current.split("?")[0] : current
            temp = temp.substring(1)
            return temp
        },
        emitLogin(data = {}) {
            this.triggerEvent("login", data)
        },
        notLoginNow() {
            this.update({
                needLogin: false
            })
        },
        showLoginNow() {
            this.update({
                needLogin: true
            })
           this.showAnimate()
        },
        showAnimate(){
            this.gift()
            this.textHover()
        },
        getUserInfo(e) {
            if (e.detail.errMsg.indexOf("ok") > 0) {
                loginFn.getWxCode().then(code => {
                    loginFn.wxLoginByWxUserInfo({code, ...e.detail}).then(dataRes => {
                        loginFn.loginSuccess(dataRes.data)
                        this.update()
                        this.login()
                    }).catch(error => {
                        if (error.code === 202) {
                            loginFn.toPhonePage({
                                type: "bind",
                                wxAuth: 1,
                                backUrl: encodeURIComponent(util.getCurrentPage())
                            })
                        } else {
                            this.$Message({
                                content: "授权出错",
                                type: "error"
                            })
                        }
                    })
                }).catch(error => {
                    console.log("getWxCode.error", error)
                })
            } else {
                console.log("用户拒绝授权")
            }
        },
        // 去手机号登录页面
        toLoginByPhone(e) {
            if (e.detail.errMsg.indexOf("ok") > 0) {
                loginFn.toPhonePage({
                    type: "first",
                    wxAuth: 0,
                    backUrl: encodeURIComponent(util.getCurrentPage())
                })
            }
        },
        disMove() {
            return false
        },
        gift() {
            !this.data.loginHover && this.setData({
                loginHover: "login-logo-hover"
            }, () => {
                this.timmer1 && clearTimeout(this.timmer1)
                this.timmer1 = setTimeout(() => {
                    clearTimeout(this.timmer1)
                    this.setData({
                        loginHover: ""
                    })
                }, 1300)
            })
        },
        textHover() {
            !this.data.loginTextHover && this.setData({
                loginTextHover: "login-text-hover"
            }, () => {
                this.timmer2 && clearTimeout(this.timmer2)
                this.timmer2 = setTimeout(() => {
                    clearTimeout(this.timmer2)
                    this.setData({
                        loginTextHover: ""
                    })
                }, 1300)
            })
        }
    }
})
