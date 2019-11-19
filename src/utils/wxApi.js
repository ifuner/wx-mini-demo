/**
 * ifuner 制作 757148586@qq.com
 */

"use strict"
const wxApi = function (keyName = "", obj = {}) {
    return new Promise((resolve, reject) => {
        // 去除方法里面的空格服
        if (keyName && typeof keyName === "string") {
            keyName = keyName.replace(/\s/g, "")
        } else {
            console.error("keyName值不能为空哦且必须是string类型")
            return false
        }
        // 判断方法名 是否再wx 对象中
        const wxHasOwnProperty = wx.hasOwnProperty(keyName)
        if (!wxHasOwnProperty) {
            console.error(`你输入的方法[${keyName}]在wx中找不到，请检查是否输入正确`)
            return false
        }
        if (keyName && wx[keyName] && wxHasOwnProperty) {
            wx[keyName]({
                ...obj,
                success(data) {
                    resolve(data)
                },
                fail(data) {
                    reject(data)
                }
            })
        }
    })
}
export default wxApi
