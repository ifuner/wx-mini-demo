/**
 * @项目：Door
 * @创建人：ifuner
 * @创建人邮箱：zhoupengfei@kaiheikeji.com
 * @创建时间：2019-07-31 16:47:42
 * */

import create from "../../utils/create"
// const app = getApp()
create({
    /**
     * 组件的属性列表
     */
    properties: {},
    data: {
        showModal: false,
        password: ""
    },
    ready: function () {
        // console.log("this.store",this.store)

    },
    methods: {
        closeDebug() {
            this.setData({
                password: "",
                showModal: false
            })
        },
        showModal() {
            this.setData({
                showModal: true
            })
        },
        passWordSubmit(target) {
            this.setData({
                password: target.detail.value
            })
        },
        toDebugPages() {
            if (this.data.password === "006007") {
                this.closeDebug()
                this.$router.navigateTo("DEBUG_PAGES")
            } else {
                this.$Message({
                    content: "密码错误",
                    type: "fail"
                })
            }
        }
    }
})
