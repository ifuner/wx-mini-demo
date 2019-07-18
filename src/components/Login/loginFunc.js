/**
 * ifuner 制作 @18658226071@163.com
 *  0 登录成功 1 正在登录 2 登录失败
 */

"use strict";
import Http from "../../utils/request"
import wxApi from "../../utils/wxApi"
import store from "../../store"

let mpLoginPromise = null;

function handlerLoginFail(resolve, msg) {
    store.data.mpLoginStatus = 2;
    resolve({_result: 1, _desc: msg, mpLoginStatus: 2});
}

function handlerLoginSuccess(resolve, res) {
    if (!res.code) {
        handlerLoginFail(resolve, res.errMsg || 'res.code is empty');
        return;
    }

    //与业务服务器换取token并且保存下来,需要自行修改
    if (res.code) {
        Http.setToken(res.code);
        store.data.mpLoginStatus = 0;
        store.loginAccountByUniond(res.code)
        resolve({_result: 0, _desc: 'success', data: res.code, mpLoginStatus: 0});
    } else {
        handlerLoginFail(resolve, "错误了");
    }
    // Http.get({url: '/api/user/mpLogin', data: {code: res.code}}).then((resp) => {
    //     if (resp._result === 0) {
    //         Http.setToken(resp.token);
    //         mpLoginStatus = 0;
    //         resolve({_result: 0, _desc: 'success', mpLoginStatus: 0});
    //     } else {
    //         handlerLoginFail(resolve, resp.msg);
    //     }
    // }).catch(error=>{
    //     handlerLoginFail(resolve, resp._desc);
    // })

}

export default function () {
    let mpLoginStatus = store.data.mpLoginStatus
    console.log("mpLoginStatus", mpLoginStatus);
    const storageToken = store.getStorageJavaToken()
    if (storageToken) {
        return {mpLoginStatus: 0};
    }
    switch (mpLoginStatus) {
        case 0:
            return {mpLoginStatus};
        case 1:
            return {mpLoginStatus, mpLoginPromise};
        default:
            store.data.mpLoginStatus = 1;
            console.log("wx.login 重新被调用");
            mpLoginPromise = new Promise((resolve) => {
                wxApi("login").then(res => {
                    handlerLoginSuccess(resolve, res)
                }).catch(error => {
                    handlerLoginFail(resolve, error.errMsg)
                })
            });
            return {mpLoginStatus, mpLoginPromise};
    }
}
