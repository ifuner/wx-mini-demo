/**
 * @项目：index
 * @创建人：ifuner
 * @创建人邮箱：zhoupengfei@kaiheikeji.com
 * @创建时间：2019-07-22 14:25:13
 * */

import store from "../../store"
import create from "../../utils/create"
// const app = getApp()
create(store, {
    data: {
        bgColor: "transparent",
        clubIsFirstStatus: true,
        index: {},
        myClubDeatil: {}
    },
    onLoad: function (target) {
        console.log("onload")
        this.isloaded = true
        this.update()
    },
    onShow() {
        if (!this.isloaded) {
            this.getClubData()
        }
    },
    onHide() {
        this.isloaded = false
        console.log("onHide", this.isloaded)
    },
    onLogin(target = {}, reloadData) {
        // 在这个事件里面调用初始化业务
        this.getClubData()
        const myClubData = this.store.data.clubData.myClub
        if ((this.store.data.loginInfo && reloadData) || !(myClubData && myClubData.baojiData && myClubData.baojiData.length)) {
            this.selectComponent("#myClub") && this.selectComponent("#myClub").onReload()
        }
    },
    clearTimerOut() {
        this.timmer && clearTimeout(this.timmer)
        wx.stopPullDownRefresh()
    },
    onUnload() {
        this.clearTimerOut()
    },
    onPullDownRefresh() {
        this.wxApi("vibrateShort")
        this.$Message({
            content: "正在重新拉取数据...",
            duration: 1500,
            type: "none"
        }).then(() => {
            this.clearTimerOut()
        })
        this.onLogin({}, true)
    },
    onShareAppMessage(data) {
        console.log("data", data)
        console.log(this.$router.getPageString("OTHER_CLUB_PAGES"))
        const {name, logoUrl, clubId = ""} = this.data.myClubDeatil
        console.log("clubId", clubId)
        console.log("logoUrl", logoUrl)
        console.log("name", name)
        const title = [
            `我的「${name}」电竞俱乐部成立了，想找大神的都进来吧！`,
            `来我的「${name}」俱乐部，找个大神带你，报我名字有折扣。`,
            `上分吗？来我的「${name}」俱乐部，和大神一起开黑啦。`
        ][parseInt(Math.random() * 3)]
        return {
            // imageUrl: logoUrl,
            imageUrl: "https://g.baojiesports.com/bps/c8287d2578e84bb792dafa847f5210b7-1000-800.png",
            title: title,
            path: this.$router.getPageString("OTHER_CLUB_PAGES", {clubId})
        }
    },
    onReachBottom() {
        this.store.data.loginInfo && this.selectComponent("#myClub") && this.selectComponent("#myClub").onReachBottom()
    },
    getClubData() {
        wx.hideShareMenu()
        this.store.getClubData(true).then(res => {
            this.update()
            this.isCreateClubStatus(res.isCreate)
            console.log("getClubData", res)
        }).catch(error => {
            console.log("error", error)
        })
    },
    handleLogin() {
        // this.store.data.needLogin = true
        this.selectComponent("#login").showLoginNow()
    },
    isCreateClubStatus(status = false) {
        status && wx.showShareMenu()
        this.update({
            ["index.bgType"]: status ? "bg-1" : "bg-2"
        })
    }
})
