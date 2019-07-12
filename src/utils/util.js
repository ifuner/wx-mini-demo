const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join("/") + " " + [hour, minute, second].map(formatNumber).join(":")
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : "0" + n
}

const jsType = {
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
    }
}
const canIUse = function (v1, v2) {
    v1 = v1.split('.');
    v2 = v2.split('.');
    var len = Math.max(v1.length, v2.length);
    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }
    for (var i = 0; i < len; i++) {
        var num1 = parseInt(v1[i]);
        var num2 = parseInt(v2[i]);
        if (num1 > num2) {
            return false
        } else if (num1 < num2) {
            return true
        }
    }

    return true
}
module.exports = {
    formatTime,
    ...jsType,
    canIUse
}
