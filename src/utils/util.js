import wxApi from "./wxApi"

const utils = {
    formatNumber(n) {
        n = n.toString()
        return n[1] ? n : "0" + n
    },
    formatTime(date = new Date()) {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()

        return [year, month, day].map(this.formatNumber).join("-") + " " + [hour, minute, second].map(this.formatNumber).join(":")
    },
    objTostring(o) {
        return Object.prototype.toString.call(o).slice(8, -1)
    },
    isString(o) { //是否字符串
        return this.objTostring(o) === "String"
    },
    isNumber(o) { //是否数字
        return this.objTostring(o) === "Number"
    },
    isObj(o) { //是否对象
        return this.objTostring(o) === "Object"
    },
    isArray(o) { //是否数组
        return this.objTostring(o) === "Array"
    },
    isDate(o) { //是否时间
        return this.objTostring(o) === "Date"
    },
    isBoolean(o) { //是否boolean
        return this.objTostring(o) === "Boolean"
    },
    isFunction(o) { //是否函数
        return this.objTostring(o) === "Function"
    },
    isNull(o) { //是否为null
        return this.objTostring(o) === "Null"
    },
    isUndefined(o) { //是否undefined
        return this.objTostring(o) === "Undefined"
    },
    isFalse(o) {
        if (o == "" || o == undefined || o == null || o == "null" || o == "undefined" || o == 0 || o == false || o == NaN) return true
        return false
    },
    isTrue(o) {
        return !this.isFalse(o)
    },
    urlToObj(url, key) {
        url = url && decodeURIComponent(url).split("?")[1] || ""
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)")
        var result = url.match(reg)
        // 匹配目标参数
        return result && result[2] && decodeURIComponent(result[2])
    },
    objToParams(param) {
        if (param && this.isObj(param) && Object.keys(param).length) {
            return Object.keys(param).map(key => {
                return `${key}=${encodeURIComponent(param[key])}`
            }).join("&")
        } else {
            return ""
        }
    },
    deepObjectMerge(firstObj, secondObj) {
        for (var key in secondObj) {
            firstObj[key] = firstObj[key] && this.isObj(firstObj[key]) ?
                this.deepObjectMerge(firstObj[key], secondObj[key]) : firstObj[key] = secondObj[key]
        }
        return firstObj
    },
    compareVersion(v1, v2) {
        v1 = v1.split(".")
        v2 = v2.split(".")
        var len = Math.max(v1.length, v2.length)
        while (v1.length < len) {
            v1.push("0")
        }
        while (v2.length < len) {
            v2.push("0")
        }
        for (var i = 0; i < len; i++) {
            var num1 = parseInt(v1[i])
            var num2 = parseInt(v2[i])
            if (num1 > num2) {
                return false
            } else if (num1 < num2) {
                return true
            }
        }
        return true
    },
    getCurrentPage() {
        const page = getCurrentPages()
        const current = page [page.length - 1]
        let params = "/" + current.route
        let options = current.options
        if (Object.keys(options).length > 0) {
            for (let i in options) {
                params += `${params.indexOf("?") > 0 ? "&" : "?"}${i}=${options[i]}`
            }
        }
        console.log("params", params)
        return params
    },
    message(obj = {}) {
        const image = obj.type === "success" ? "/imgs/smile.png" : obj.type === "error" ? "/imgs/fail.png" : "/imgs/smile.png"
        let notShowImgage = obj.type === "loading" || obj.type === "none"
        const duration = obj.duration || 1200
        if (obj.content.length > 7) {
            notShowImgage = true
            obj.type = "none"
        }
        const newObj = Object.assign({},
            {title: obj.content || ""},
            {duration},
            notShowImgage && {icon: obj.type || "none"},
            !notShowImgage && {image}
        )
        return new Promise((resolve) => {
            wxApi("showToast", newObj).then(res => {
                this.timmer && clearTimeout(this.timmer)
                this.timmer = setTimeout(() => {
                    this.timmer && clearTimeout(this.timmer)
                    resolve(res)
                }, duration)
            })
        })
    }
}

module.exports = utils
