/**
 * @项目：PhoneLogin
 * @创建人：ifuner
 * @创建人邮箱：zhoupengfei@kaiheikeji.com
 * @创建时间：2019-07-29 16:17:30
 * */

import store from "../../store"
import create from "../../utils/create"
import loginFn from "../../components/Login/loginNewFunc"
// const app = getApp()
const initCode = {
    status: false,
    num: 60,
    text: "获取验证码"
}

create(store, {
    data: {
        bgColor: "transparent",
        phoneNum: "",
        codeNum: "",
        code: initCode,
        navTitle: "手机号登录",
        tempBackUrl: "",
        showCapsule: true,
        button: {
            text: "登录"
        }
    },
    onLoad: function (target) {
        this.getCode()
        console.log("target", target)
        this.setData({
            tempBackUrl: target.backUrl && decodeURIComponent(decodeURIComponent(target.backUrl))
        })
        console.log("this.data.tempBackUrl", this.data.tempBackUrl)
        this.getUserInfo()
        // this.setData({
        //     showCapsule: false
        // })
        this.initData(target)
    },
    onShow() {

    },
    onUnload() {
        this.clearTimerOut()
    },
    getCode() {
        // 能拿到就一起传给后台
        loginFn.getWxCode().then(res => {
            console.log("getWxCode", res)
            this.tempCode = res
        })
    },
    getUserInfo() {
        loginFn.wxGetUserInfoApi().then(res => {
            if (res.errMsg.indexOf("ok") > 0) {
                const {encryptedData, iv, rawData, signature} = res
                this.tempData = {
                    encryptedData, iv, rawData, signature
                }
            }
        })
    },
    initData(target) {
        const {type} = target
        if (type !== "first") {
            this.setData({
                navTitle: "用户绑定",
                ["button.text"]: "绑定"
            })
        }
    },
    sendMsgCode() {
        return new Promise((resolve, reject) => {
            this.$http.get("SEND_CODE", {data: {phone: this.data.phoneNum}}).then(() => {
                this.$Message({
                    content: "发送成功",
                    type: "success"
                })
                resolve()
            }).catch(err => {
                this.$Message({
                    content: err.msg || "短信发送失败",
                    type: "error"
                })
                reject()
            })
        })
    },
    clearTimerOut() {
        this.msgCodetimmer && clearInterval(this.msgCodetimmer)
    },
    getCodeApi() {
        //     请求接口 倒计时 验证码
        // const phoneNum = this.data.phoneNum
        if (this.data.code.status) {
            this.$Message({
                content: "短信倒计时结束后才能再次获取",
                type: "none"
            })
            return false
        }
        if (this.lintPhoneNum()) {
            this.setData({
                ["code.status"]: true
            })
            this.sendMsgCode().then(() => {
                this.clearTimerOut()
                let num = this.data.code.num
                this.msgCodetimmer = setInterval(() => {
                    if (num === 0) {
                        this.clearTimerOut()
                        this.setData({
                            code: {
                                status: false,
                                num: 60,
                                text: "重新获取"
                            }
                        })
                    } else {
                        num--
                        console.log("倒计时", num)
                        this.setData({
                            ["code.text"]: `${num}s`
                        })
                    }
                }, 1000)
            }).catch(err => {
                this.setData({
                    ["code.status"]: true
                })
            })
        } else {
            this.$Message({
                content: "手机号不正确，请检查后重试",
                type: "none"
            })
        }
    },
    lintPhoneNum() {
        return /^[1]\d{10}$/.test(this.data.phoneNum)
    },
    lintCodeNum() {
        return /^\d{6}$/.test(this.data.codeNum)
    },
    clearbtn() {
        this.setData({
            code: {
                status: false,
                num: 60,
                text: "获取验证码"
            }
        })
        this.msgCodetimmer && clearInterval(this.msgCodetimmer)
        this.inputSetData("codeNum", "")
        this.inputSetData("phoneNum", "")
    },
    // 绑定获取到得微信信息
    bindWxUserPhone(target) {
        if (target.detail.errMsg.indexOf("ok") !== -1) {
            console.log("target", target.detail)
            this.bindUserPhoneApiLogin(target.detail)
        } else {
            this.$Message({
                content: "授权失败",
                type: "error"
            })
        }
    },
    bindUserPhoneApiLogin(phoneData) {
        const {encryptedData, iv} = phoneData
        const tempData = this.getExtraData()
        console.log("tempData", tempData)
        this.$http.post("WX_LOGIN_BY_WXPHONEAPI", {
            data: Object.assign(
                {},
                tempData,
                encryptedData && {userPhoneEncrypteData: encryptedData},
                iv && {iv2: iv}
            )
        }).then(res => {
            this.loginSuccess(res.data)
        }).catch(error => {
            this.getCode()
            console.log("error", error)
        })
    },
    loginSuccess(token) {
        loginFn.loginSuccess(token)
        if (token && this.utils.isString(token)) {
            const tempUrl = this.data.tempBackUrl
            this.clearTimerOut()
            tempUrl && (tempUrl.indexOf("PhoneLogin") !== -1) ? this.$router.reLaunch("INDEX_PAGES") :
                this.wxApi("reLaunch", {url: tempUrl})

        } else {
            this.$Message({
                content: "token 不合法",
                type: "error"
            })
        }
    },
    getExtraData() {
        const tempData = this.tempData
        const code = this.tempCode
        let userAndCodeData = {}
        if (tempData && Object.keys(tempData).length) {
            const {rawData, signature} = tempData
            userAndCodeData = {
                rawData,
                signature,
                userInfoEncrypteData: tempData.encryptedData,
                iv1: tempData.iv
            }
        }
        userAndCodeData.code = code
        console.log("userAndCodeData", userAndCodeData)
        return userAndCodeData
    },
    // 绑定手机号
    bindUserPhone() {
        console.log("绑定手机号")
        const {phoneNum, codeNum} = this.data
        if (this.lintPhoneNum()) {
            if (this.lintCodeNum()) {
                //     登录接口
                const {code, iv1, userInfoEncrypteData, signature, rawData} = this.getExtraData()
                this.$http.post("PHONE_AND_CODE_LOGIN",
                    {
                        data: Object.assign({},
                            {phone: phoneNum, verificationCode: codeNum},
                            {code},
                            iv1 && {iv: iv1},
                            userInfoEncrypteData && {encrypteData: userInfoEncrypteData},
                            signature && {signature},
                            rawData && {rawData}
                        )
                    }
                )
                    .then(res => {
                        this.loginSuccess(res.data)
                    }).catch(err => {
                    this.getCode()
                    this.$Message({
                        content: err.msg || "登录失败，请重试",
                        type: "error"
                    })
                })
            } else {
                this.$Message({
                    content: "验证码长度不正确，请重新输入",
                    type: "error"
                })
            }
        } else {
            this.$Message({
                content: "手机号长度不正确，请检查后重试",
                type: "error"
            })
        }
    },
    phoneSubmit(target) {
        const value = target.detail.value
        this.inputSetData("phoneNum", value)
    },
    codeSubmit(target) {
        const value = target.detail.value
        this.inputSetData("codeNum", value)
    },
    inputSetData(key, data = {}) {
        this.setData({
            [key]: data
        })
    },
})
