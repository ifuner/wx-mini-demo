import store from "../../store"
import create from "../../utils/create"
const {$Message, $Toast} = require("../../dist/base/index")
const app = getApp()
create(store, {
    data: {
        indexDemo: "hahah",
        hello: null,
        index: {},
        privateNum: 0
    },

    onShow() {
        console.log("index.onShow");
    },

    onLogin(data) {
        this.update()
        console.warn("onLogin 初始化检查登录逻辑", data);
    },
    message() {
        $Message({
            content: "这是一条成功提醒",
            type: "success"
        })
    },
    toast() {
        $Toast({
            content: "成功的提示",
            type: "success"
        })
    },
    testWeStoreNum() {
        let {num} = this.store.data.index
        this.update({
            [`index.num`]: ++num
        })
    },
    privateNum() {
        let {privateNum} = this.data
        this.setData({
            privateNum: ++privateNum
        })
    },
    nativeToast() {
        this.wxApi("showToast", {title: "hello"})
    },
    wxTest401Api() {
        this.$http.get({
            key: "GET_TEST2_HELLO",
            p1: "hello",
            p2: "world"
        }).then(res => {
            console.log("res", res)
        }).catch(error => {
            $Toast({
                content: JSON.stringify(error),
                type: "error"
            })
        })
    },
    wxTestApi() {
        this.$http.get("GET_TEST_HELLO", {header: {auth2: "hello"}}).then(res => {
            console.log("res", res)
            $Toast({
                content: JSON.stringify(res.data),
                type: "success"
            })
        }).catch(error => {
            $Toast({
                content: JSON.stringify(error),
                type: "error"
            })
        })
    },
    wxTenApi() {
        for (let i = 0; i < 20; i++) {
            this.$http.get("GET_TEST_HELLO").then(res => {
                console.log("res", res)
            }).catch(error => {
                console.log("error", error)
            })
        }
    },
    wxTenApiCopy() {
        const allRequest = []
        for (let i = 0; i < 20; i++) {
            allRequest.push(this.$http.get("GET_TEST_HELLO"))
        }
        Promise.all(allRequest).then(res => {
            console.log("res", res)
            $Toast({
                content: "20条数据请求完毕",
                type: "success"
            })
        }).catch(error => {
            console.log("error", error)
            $Toast({
                content: error,
                type: "error"
            })
        })
    }
})
