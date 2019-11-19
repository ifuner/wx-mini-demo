/**
 * @项目：FirstClub
 * @创建人：ifuner
 * @创建人邮箱：zhoupengfei@kaiheikeji.com
 * @创建时间：2019-07-25 14:58:44
 * */

import create from "../../utils/create"
// const app = getApp()
const defaultImg = "https://g.baojiesports.com/bps/91277a64c6194b0e84ed43207fcb0837-750-993.png"
create({
    /**
     * 组件的属性列表
     */
    properties: {
        imgUrl: {
            type: String,
            value: defaultImg
        },
        html: {
            type: String,
            value: ""
        }
    },
    data: {
        defaultImg,
        loginInfo: "",
    },
    ready: function () {
        this.update()
        // console.log("this.store",this.store)

    },
    methods: {
        toWebview() {
            this.data.html && this.$router.navigateTo("WEBVIEW_PAGES", {url: this.data.html})
        },
        toCreateClub() {
            if (this.store.data.loginInfo) {
                this.$router.navigateTo("CREATE_CLUB_PAGES", {type: "next"})
            } else {
                this.triggerEvent("Login", true)
            }
        }
    }
})
