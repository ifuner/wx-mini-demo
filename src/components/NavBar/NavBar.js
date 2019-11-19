/**
 * @项目：NavBar
 * @创建人：ifuner
 * @创建人邮箱：zhoupengfei@kaiheikeji.com
 * @创建时间：2019-07-17 14:41:05
 * */

import create from "../../utils/create"
// const app = getApp()
const DEFAULT_CONFIG = {
    bgColor: "#fff",
    showCapsule: true,
    disTitle: false
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
        capsuleType: {
            type: String,
            value: "white",
        },
        capsuleColor: {
            type: String,
            value: "white",
        },
        bgColor: {
            type: String,
            value: "",
            observer: function (newVal, oldVal) {
                this.setValue({bgColor: newVal})
            }
        },
        textColor: {
            type: String,
            value: "#fff",
        },
        disTitle: {
            type: [Boolean, String],
            value: true,
            observer: function (newVal, oldVal) {

                if (typeof newVal === "string") {
                    newVal = newVal !== "false"
                }
                this.setValue({disTitle: newVal})
            }
        },
        showCapsule: {
            type: [Boolean, String],
            value: true,
            observer: function (newVal, oldVal) {
                if (typeof newVal === "string") {
                    newVal = newVal !== "false"
                }
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
        },
        bgType: {
            type: String,
            value: "bg-1"
        }
    },
    data: {
        height: 0,
        customSafeDistanceSize: 0,
        customSize: {},
        customNavConfig: DEFAULT_CONFIG,
        currentUserAgentInfo: {},
        supportShowBar: true,
        mtDoorStatus: false,
        //默认值  默认显示左上角
        showNavBar: wx.canIUse("button.open-type.feedback")
    },
    ready: function () {
        this.update()
        this.bindClickTimes = 0
        // 低版本不支持自定义tabBar的情况
        const canUse = this.utils.compareVersion("6.6.0", this.store.data.currentUserAgentInfo.version || "7.0.0")
        !canUse && this.setData({
            supportShowBar: canUse
        })
        console.log("NavBar.this.store.data", this.store.data)
    },
    moved() {
        this.initClickNum()
    },
    detached() {
        this.initClickNum()
    },
    methods: {
        // 返回上一页面
        _navback() {
            this.bindClickTimes = 0
            const current = getCurrentPages().length === 1
            if (current) {
                this._backhome()
                return false
            }
            this.wxApi("navigateBack").then(() => {
                this.needLoginStatus()
            }).catch(() => {
                console.log("_navback.fail")
                this._backhome()
            })
        },
        needLoginStatus() {
            if (this.store.data.needLogin) {
                this.update({
                    needLogin: false
                })
            }
        },
        //返回到首页
        _backhome() {
            this.bindClickTimes = 0
            this.needLoginStatus()
            this.wxApi("switchTab", {url: "/pages/index/index"})
        },
        initClickNum() {
            this.bindClickTimes = 0
            this.setData({
                mtDoorStatus: false
            })
        },
        setValue(newVal) {
            this.setData({
                customNavConfig: Object.assign({}, this.data.customNavConfig, newVal)
            })
        },
        scrollTop() {
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 300
            })
        },
        openDebug() {
            console.log("this.disDebug", this.data.disDebug)
            // 禁止再打开调试
            if (!this.data.disDebug) {
                this.bindClickTimes ? this.bindClickTimes += 1 : this.bindClickTimes = 1
                console.log("this.bindClickTimes", this.bindClickTimes)
                if (this.bindClickTimes >= 15) {
                    this.bindClickTimes = 0
                    this.selectComponent("#mtDoor").showModal()
                }

                this.bindClickTimes > 6 && this.setData({
                    mtDoorStatus: true
                })

            } else {
                console.warn("页面禁止了打开调试~")
            }
        }
    }
})
