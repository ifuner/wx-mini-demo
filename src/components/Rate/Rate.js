/**
 * @项目：Rate
 * @创建人：ifuner
 * @创建人邮箱：zhoupengfei@kaiheikeji.com
 * @创建时间：2019-07-23 17:50:14
 * */

import create from "../../utils/create"
// const app = getApp()
create({
    /**
     * 组件的属性列表
     */
    properties: {
        value: {
            type: [String, Number],
            value: "",
            observer: function (newVal) {
                if (!newVal) {
                    return false
                }
                let [firstNum, lastNum = 0] = newVal.split(".")
                firstNum = +firstNum
                lastNum = +lastNum
                let arr = []
                for (let i = 1; i <= 5; ++i) {
                    if (i === (firstNum + 1) && lastNum !== 0) {
                        arr.push(lastNum > 4 ? "half" : "no-active")
                    } else if (i < (firstNum + 1)) {
                        arr.push("active")
                    } else {
                        arr.push("no-active")
                    }
                }
                this.setData({
                    rateArr: arr
                })
            }
        }
    },
    data: {
        rateArr: Array.apply(null, Array(5)).map(() => "no-active")
    },
    ready: function () {
        // console.log("this.store",this.store)

    },
    methods: {}
})
