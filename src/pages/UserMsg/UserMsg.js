/**
 * @项目：UserMsg
 * @创建人：ifuner
 * @创建人邮箱：zhoupengfei@kaiheikeji.com
 * @创建时间：2019-07-22 18:17:57
 * */

import store from "../../store"
import create from "../../utils/create"
import Poster from "../../components/Poster/poster/poster"

const app = getApp()
const shareData = require("./Share")
const createQrcode = require("../../components/QrCode/QrCode")

const config = require("../../config")
create(store, {
    data: {
        posterConfig: {},
        tempCanvasImg: "",
        bgColor: "transparent",
        count: 0, // 设置 计数器 初始为0
        countTimer: null, // 设置 定时器 初始为null
        tagetMiniProgram: {},
        shareImg: "",
        queryData: {},
        userData: {},
        extraData: {},
        loginInfo: "",
        defaultUserImg: "",
        needLogin: "",
        imId: "",
        isNavOverStatus: false
    },

    onLoad: function (target) {
        this.update()
        this.store.loadFontFamily()
        wx.hideShareMenu()

        // 扫码进入的情况
        if (target.q) {
            const [userId, role, game] = this.utils.urlToObj(decodeURIComponent(target.q), "params").split("|")
            target = {
                userId, role, game
            }
            console.log("target.q", target);
        }

        this.setData({
            queryData: target
        })
        console.log("queryData", target);

        const beforeData = this.store.data.userMsg.userData
        const userKey = `u_${target.userId}`

        beforeData.hasOwnProperty(userKey) && this.setData({
            userData: beforeData[userKey]
        }, () => {
            // this.initCanvas(this.data.userData)
            if (Object.keys(beforeData).length > 100) {
                this.update({
                    ["userMsg.userData"]: {}
                })
            }
            console.log("userData,使用的缓存数据")
        })
    },
    onShow() {
        this.data.isNavOverStatus && this.createOrder()
    },
    onReady() {

    },
    onLogin(target) {
        // 在这个事件里面调用初始化业务
        this.initGetData()
    },
    getShareTitle(username) {
        username.length > 8 && (username = username.substring(0, 8) + "...")
        const baojiTitle = [
            `这是我俱乐部的「${username}」实力超强，打不过的局你就找他！`,
            `大神暴鸡，盘盘碾压，「${username}」邀您体验游戏乐趣`,
            `硬核暴鸡「${username}」邀请你一起搞事！甭管什么游戏，盘他！`,
        ][parseInt(Math.random() * 3)]
        const baoniangTitle = [
            `嘿！好久不见，今日上线了没？「${username}」想你啦`,
            `萌蠢职业小跟班，「${username}」邀您一起玩游戏啦。`,
            `「${username}」邀请你一起甜蜜双排！可盐可甜，可萌可御～`,
            `「${username}」人美声甜，想和你一起开黑！`
        ][parseInt(Math.random() * 4)]
        const {role} = this.data.queryData
        const title = role === "baoji" ? baojiTitle : baoniangTitle
        return title
    },
    onShareAppMessage() {
        const {userData, queryData, shareImg} = this.data
        let {username, thumbnail} = userData
        return {
            imageUrl: shareImg || thumbnail,
            title: this.getShareTitle(username),
            path: this.$router.getPageString("USER_MSG_PAGES", queryData)
        }
    },
    initGetData() {
        this.getBaojiData()
        this.getBaojiConfig()
    },
    getBaojiConfig() {
        this.setData({
            tagetMiniProgram: Object.assign({}, this.store.getMiniProgram())
        })
    },
    initCanvas(userData) {
        const {userId, role} = this.data.queryData || {}
        const isBoss = role === "boss"
        const {winningPercentage, evaluationScore, order} = userData
        this.initPie(1, order ? 100 : 0)
        if (!isBoss) {
            this.initPie(2, winningPercentage)
            if (evaluationScore) {
                this.initPie(3, (((evaluationScore * 1000) * 2) / 100).toFixed(2))
            } else {
                this.initPie(3, 0)
            }
        }
        this.store.data.userMsg.userData[`u_${userId}`] = userData
        this.setData({
            isNavOverStatus: false,
            userData: userData
        })

        this.getShareCardImg().then(() => {
            this.onShareAppMessage()
            isBoss ? wx.hideShareMenu() : wx.showShareMenu()
        })

        !isBoss && this.createOrder()
        this.update()
        this.getBaojiConfig()
    },
    getBaojiData() {
        const {userId, game = "", role} = this.data.queryData || {}
        const isBoss = role === "boss"
        this.$http.post(!isBoss ? "BOAJI_CLUB" : "BOSS_USE", {data: Object.assign({uid: userId}, game && {game: +game})}).then(res => {
            this.initCanvas(res.data)
            console.log("res", res)
        }).catch(error => {
            console.error(error)
            this.$Message({
                content: error.msg || "接口出问题了",
                type: "error"
            }).then(() => this.wxApi("navigateBack"))
        })
    },
    copyId() {
        const uid = this.data.userData.chickenId
        uid && this.wxApi("setClipboardData", {
            data: uid,
        }).then(() => {
            this.$Message({
                content: "复制成功",
                type: "success"
            })
        })
    },
    showLoginLayer() {
        if (!this.store.data.loginInfo) {
            this.selectComponent("#login").showLoginNow()
            return false
        } else {
            return true
        }
    },
    coverViewClick() {
        this.showLoginLayer()
    },
    // 关注与取消关注得接口
    focusUser(target) {
        const status = target.currentTarget.dataset.status
        const {id} = this.data.userData || {}
        const showLoginLayer = this.showLoginLayer()
        if (!showLoginLayer) {
            return false
        }
        wx.vibrateShort()
        id ? this.$http.post("POST_USER_FOCUS", {data: {userId: id, focusStatus: status ? 0 : 1}}).then(res => {
            // this.$Message({
            //     content: res.msg || "操作成功",
            //     type: "success"
            // })
            this.getBaojiData()
        }).catch(err => {
            this.$Message({
                content: err.msg || "操作失败,待会再试试吧~",
                type: "error"
            })
        }) : this.$Message({
            content: "userId为空",
            type: "error"
        })
    },
    // 去到他人得俱乐部
    toOtherClub() {
        const {clubId} = this.data.userData
        const {type} = this.data.queryData
        this.$router[type === "redirectTo" ? "redirectTo" : "navigateTo"]("OTHER_CLUB_PAGES", {
            clubId,
            type: "redirectTo"
        })
    },
    initPie(id = 1, step) {
        this.drawProgressbg(`canvasbg_${id}`)
        const {role = "baoji"} = this.data.queryData
        const color = role === "baoji" ? "#283AD2" :
            role === "baoniang" ? "#FF4E87" :
                role === "boss" ? "#4888E5" : "#4888E5"

        this.drawCircle(`canvasProgress_${id}`, step, color)
    },
    drawCircle: function (id = "", step, color = "") {
        let context = wx.createCanvasContext(id, this)
        context.setLineWidth(2)
        let num = 0
        this[id] && clearInterval(this[id])
        this[id] = setInterval(() => {
            if (num >= step) {
                clearInterval(this[id])
                this[id] = null
            } else {
                num += (step / 100)
                context.setStrokeStyle(color)
                context.setLineCap("round")
                context.beginPath()
                context.arc(89 / 2, 89 / 2, 80 / 2, -Math.PI / 2, (num / 50) * Math.PI - Math.PI / 2, false)
                context.stroke()
                context.draw()
            }
        }, 15)

    },
    drawProgressbg(id = "") {
        // 使用 wx.createContext 获取绘图上下文 context
        var ctx = wx.createCanvasContext(id, this)
        ctx.setLineWidth(2)// 设置圆环的宽度
        ctx.setStrokeStyle("#2e2e2e") // 设置圆环的颜色
        ctx.setLineCap("round") // 设置圆环端点的形状
        ctx.beginPath()//开始一个新的路径
        ctx.arc(89 / 2, 89 / 2, 80 / 2, 0, 2 * Math.PI, false)
        //设置一个原点(110,110)，半径为100的圆的路径到当前路径
        ctx.stroke()//对当前路径进行描边
        ctx.draw()
    },
    disMove() {
        return false
    },
    handelShowShare() {
        this.shareLayerStatus(true)
    },
    handelCloseShare() {
        this.shareLayerStatus(false)
    },
    shareLayerStatus(status = false) {
        this.setData({
            shareLayer: status
        })
        status && this.onCreatePoster()
    },
    onPosterSuccess(e) {
        const {detail} = e;
        const {userId} = this.data.queryData
        app.globalData.userMsgPoster[userId] = detail
        wx.hideLoading()
        this.setData({
            tempCanvasImg: detail
        })

        console.warn("onPosterSuccess", detail);
    },
    onPosterFail() {
        this.$Message({
            content: "生成失败，请稍后重试",
            type: "error"
        })
        this.handelCloseShare()
    },
    onCreatePoster() {
        const {role, userId, game} = this.data.queryData
        const tempData = app.globalData.userMsgPoster[userId]
        if (tempData) {
            this.setData({
                tempCanvasImg: tempData
            })
            return false
        }

        wx.showLoading({title: "正在生成..."})
        const qrCodeTextUrl = `https://h5.kaiheikeji.com/wx/userMsg.html?params=${userId}|${role}|${game}`
        Promise.all([
            createQrcode(this, qrCodeTextUrl),
            this.userImgToMyQiniu(this.data.userData.thumbnail)
        ]).then(resData => {
            const [qrCode, thumbnail] = resData
            console.log("resData", resData);
            this.setData({posterConfig: shareData(Object.assign({}, this.data.userData, {thumbnail}), qrCode).jdConfig}, () => {
                Poster.create(true);
            })
        }).catch((error) => {
            console.log("error", error);
            this.onPosterFail()
        })
    },
    getShareCardImg() {
        const {userId} = this.data.queryData
        const tempShareImg = app.globalData.shareImg[userId]
        const {username, order, winningPercentage, evaluationScore, chickenId, role, thumbnail, sex, level} = this.data.userData
        return new Promise((resolve, reject) => {
            if (tempShareImg) {
                this.setData({
                    shareImg: tempShareImg
                })
                resolve(tempShareImg)
                return false
            }
            this.$http.get("CREATE_USER_POSTER", {
                data: {
                    username,
                    order: order.toString(),
                    winningPercentage: winningPercentage,
                    evaluationScore: evaluationScore,
                    chickenId,
                    role,
                    thumbnail,
                    sex: sex,
                    levelStatus: level
                }
            }).then(res => {
                this.setData({
                    shareImg: res.data
                })
                app.globalData.shareImg[userId] = res.data
                resolve(res.data)
            }).catch(() => {
                reject(null)
            })
        })
    },
    // 第三方的头像转存到自己的七牛桶镜像中
    userImgToMyQiniu(imgUrl) {
        return new Promise((resolve) => {
            const WHITE_URL_LIST = ["baojiclub.kaiheikeji.com", "g.baojiesports.com", "qn-bn-pub.kaiheikeji.com", "qn.kaiheikeji.com"]
            const defaultImgUrl = "https://g.baojiesports.com/bps/e6209f0062b0424cb620606b2af80cce-160-160.png"
            const {chickenId} = this.data.userData
            // console.log("WHITE_URL_LIST.some(item => imgUrl.indexOf(item) === -1)", WHITE_URL_LIST.every(item => imgUrl.indexOf(item) === -1));
            if (WHITE_URL_LIST.every(item => imgUrl.indexOf(item) === -1)) {
                this.$http.get("UPLOAD_QINIU_IMG", {data: {chickenId}}).then(res => {
                    resolve(res.data)
                }).catch(() => {
                    resolve(defaultImgUrl)
                })
            } else {
                resolve(imgUrl)
            }
        })
    },
    saveToLocla() {
        const tempCanvasImg = this.data.tempCanvasImg
        tempCanvasImg ? this.wxApi("saveImageToPhotosAlbum", {filePath: tempCanvasImg}).then(res => {
                this.$Message({
                    content: "保存成功",
                    type: "success"
                })
            }).catch(error => {
                this.wxApi("getSetting").then(auth => {
                    console.log("auth", auth);
                    if (auth.errMsg.indexOf("ok") !== -1) {
                        if (auth.authSetting && !auth.authSetting["scope.writePhotosAlbum"]) {
                            this.wxApi("showModal", {
                                title: "温馨提示",
                                content: "请点击图片预览保存",
                                showCancel: false,
                                confirmText: "知道了"
                            })
                        }
                    }
                })
            })
            : this.$Message({
                content: "请先生成图片",
                type: "error"
            })
    },
    previewImage() {
        const tempCanvasImg = this.data.tempCanvasImg
        tempCanvasImg && this.wxApi("previewImage", {urls: [tempCanvasImg]})
    },
    handelNavOver() {
        this.setData({
            isNavOverStatus: true
        })
    },
    // 跳转之前生成订单
    createOrder() {
        const clubId = this.data.queryData.clubId
        // const showLoginLayer = this.showLoginLayer()
        if (!this.store.data.loginInfo) {
            return false
        }
        // if (!showLoginLayer) {
        //     return false
        // }
        clubId && this.data.userData.id ? this.$http.post("CREATE_ORDER", {
            data: {
                receiverId: this.data.userData.id,
                clubId
            }
        }).then(res => {
            console.log("订单生成成功", res)
            // 组装对象
            this.setData({
                extraData: {
                    loginToken: this.store.data.loginInfo,
                    apiHost: config.apiHost,
                    clubOrderId: (res && res.data) || ""
                }
            })
        }).catch(err => {
            console.warn("订单生成失败", err)
        }) : console.warn("createOrder.clubId或者receiverId为空了")
    }
})
