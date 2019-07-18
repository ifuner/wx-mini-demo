/**
 * @项目：NavBar
 * @创建人：ifuner
 * @创建人邮箱：zhoupengfei@kaiheikeji.com
 * @创建时间：2019-07-17 14:41:05
 * */

import create from "../../utils/create"
// const app = getApp()
const DEFAULT_CONFIG = {
    title: "暴鸡电竞俱乐部",
    bgColor: "#fff",
    showCapsule: true,
    disTitle: false,
}

create({
    /**
     * 组件的属性列表
     */
    options: {
        multipleSlots: true
    },
    properties: {
        navTitle: {
            type: String,
            observer: function (newVal, oldVal) {
                this.setValue({title: newVal})
            }
        },
        bgColor: {
            type: String,
            value: "",
            observer: function (newVal, oldVal) {
                this.setValue({bgColor: newVal})
            }
        },
        disTitle: {
            type: [Boolean, String],
            value: true,
            observer: function (newVal, oldVal) {

                if (typeof newVal === "string") {
                    newVal = newVal === "false" ? false : true
                }
                console.log("showCapsule", newVal, oldVal);
                this.setValue({disTitle: newVal})
            }
        },
        showCapsule: {
            type: [Boolean, String],
            value: true,
            observer: function (newVal, oldVal) {
                if (typeof newVal === "string") {
                    newVal = newVal === "false" ? false : true
                }
                console.log("showCapsule", newVal, oldVal);
                this.setValue({showCapsule: newVal})
            }
        },
        // 页面禁止点击empty区域跳转调试
        disDebug: {
            type: Boolean,
            value: false
        },
        disBackImg: {
            type: Boolean,
            value: true
        }
    },
    data: {
        height: 0,
        customSafeDistanceSize: 0,
        customSize: {},
        customNavConfig: DEFAULT_CONFIG,
        //默认值  默认显示左上角
        showNavBar: wx.canIUse("button.open-type.feedback")
    },
    ready: function () {
        this.update()
        this.bindClickTimes = 0
        console.log("NavBar.this.store.data", this.store.data);
    },
    methods: {
        // 返回上一页面
        _navback() {
            this.bindClickTimes = 0
            wx.navigateBack()
        },
        //返回到首页
        _backhome() {
            this.bindClickTimes = 0
            wx.redirectTo({
                url: '/pages/index/index',
            })
        },
        initClickNum() {
            this.bindClickTimes = 0
        },
        setValue(newVal) {
            this.setData({
                customNavConfig: Object.assign({}, this.data.customNavConfig, newVal)
            })
        },
        openDebug() {
            console.log("this.disDebug", this.data.disDebug);
            // 禁止再打开调试
            if (!this.data.disDebug) {
                this.bindClickTimes ? this.bindClickTimes += 1 : this.bindClickTimes = 1
                console.log("this.bindClickTimes", this.bindClickTimes);
                if (this.bindClickTimes >= 15) {
                    wx.navigateTo({
                        url: '/pages/debug/debug'
                    })
                }
            } else {
                console.warn("页面禁止了打开调试~")
            }
        }
    }
})
