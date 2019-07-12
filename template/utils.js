/**
 * ifuner 制作 @18658226071@163.com
 */

"use strict";
const utils = {
    formatTime(timeStamp = Date.now(), formatStr = "yyyy-MM-dd hh:mm:ss") {
        let dateTime = new Date(parseInt(timeStamp, 10))
        let o = {
            "M+": dateTime.getMonth() + 1,
            "d+": dateTime.getDate(),
            "h+": dateTime.getHours(),
            "m+": dateTime.getMinutes(),
            "s+": dateTime.getSeconds()
        }

        if (/(y+)/.test(formatStr)) {
            formatStr = formatStr.replace(RegExp.$1, (dateTime.getFullYear() + "").substr(4 - RegExp.$1.length))
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(formatStr)) {
                formatStr = formatStr.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
                )
            }
        }
        return formatStr
    }
}
module.exports = utils
