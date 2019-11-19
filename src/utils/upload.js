/**
 * ifuner 制作 757148586@qq.com
 */


"use strict"

import request from "./request"

const qiniuUploader = require("./qiniuUploader")
const getToken = () => new Promise((resolve, reject) => {
    let ret = {success: false}
    request.post("GET_QINIU_TOKEN").then(res => {
        ret.success = true
        ret.data = res.data
        console.log("GET_QINIU_TOKEN", ret)
        resolve(ret)
    }).catch(error => {
        ret.msg = error
        reject(ret)
    })
})

const uploadFile = (options, tempFilePath, uploadingCallback) => {
    let ret = {success: false, msg: ""}
    console.log("options", options)
    console.log("tempFilePath", tempFilePath)
    return new Promise((resolve, reject) => {
        qiniuUploader.upload(tempFilePath, (res) => {
            ret.data = res
            ret.success = true
            console.log("上传成功", res)
            resolve(res)
        }, (error) => {
            ret.msg = error
            reject(ret)
        }, options, (progress) => {
            console.log("上传进度", progress.progress)
            console.log("已经上传的数据长度", progress.totalBytesSent)
            console.log("预期需要上传的数据总长度", progress.totalBytesExpectedToSend)
            uploadingCallback && uploadingCallback(progress)
        })
    })
}
const getOptions = (res) => {
    let {qiniuToken, domain, fileName} = res
    let data = {
        domain,
        key: fileName,
        region: "SCN",
        uptoken: qiniuToken
    }
    console.log("data", data)
    return data
}

module.exports = function (tempFilePath) {
    let ret = {success: false, msg: ""}
    return new Promise((resolve, reject) => {
        getToken().then(res => {
            let options = getOptions(res.data)
            console.log("options", options)
            uploadFile(options, tempFilePath).then(resImg => {
                ret.data = resImg.imageURL
                ret.success = true
                console.log("options", options)

                console.log("上传成功", ret)
                resolve(ret)
            }).catch(error => {
                console.log("上传error", error)
                resolve(error)
            })
        }).catch(err => {
            reject(err)
        })
    })
}
