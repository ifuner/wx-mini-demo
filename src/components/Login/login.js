import create from "../../utils/create"
import LoginFunc from "./loginFunc"

create({
    /**
     * 组件的属性列表
     */
    properties: {},
    data: {
        feedBackStatus: false,
        mpLoginStatus: -1,
        mpLoginFailMsg: ""
    },
    ready: function () {
        this.update()
        this.login()
        this.setData({
            feedBackStatus: wx.canIUse("button.open-type.feedback")
        })
    },
    methods: {
        login: function () {
            /**
             * 1. 判断token 是否存在
             * 存在即返回，不存在就走流程
             * 0 登录成功 1 正在登录 2 登录失败
             * */
            const hasToken = !!this.store.data.loginInfo
            console.log("hasToken", hasToken)
            if (hasToken) {
                this.setData({mpLoginStatus: 0})
                this.emitLogin()
                return false
            }
            console.log("重走登录流程")
            const {mpLoginStatus, mpLoginPromise} = LoginFunc()
            this.setData({mpLoginStatus})
            if (mpLoginStatus === 0) {
                this.emitLogin()
            } else if (mpLoginStatus === 1) {
                mpLoginPromise.then((resp) => {
                    if (resp._result === 0) {
                        console.log("resp", resp)
                        this.wxApi("getUserInfo", {withCredentials: "true"}).then(res => {
                            this.postApi(resp.data)
                        }).catch(error => {
                            console.log("自动获取用户信息不被允许,请尝试引导用户点击按钮注册", error)
                            this.setData({mpLoginStatus: 2, mpLoginFailMsg: resp._desc})
                        })
                    } else {
                        this.setData({mpLoginStatus: 2, mpLoginFailMsg: resp._desc})
                    }
                })
            }
        },
        emitLogin(data = {}) {
            this.triggerEvent("login", data)
        },
        getUserInfo(e) {
            if (e.detail.errMsg.indexOf("ok") > 0) {
                console.log("e", e)
                this.postApi(e.detail.signature)
            } else {
                console.log("用户拒绝授权")
            }
        },
        postApi(data) {
            return new Promise((resolve, reject) => {
                this.store.loginAccountByUniond(data).then(res => {
                    console.log("loginAccountByUniond", res)
                    if (res.success) {
                        this.store.data.loginInfo = res
                        this.update()
                        this.login()
                        resolve(res)
                    } else {
                        reject(res)
                        console.log("登录失败，login.js")
                    }
                })
            })
        },
        gift() {
            console.log("点击10下开启调试")
        }
    }
})
