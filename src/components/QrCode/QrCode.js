const QRCode = require('../../utils/qrCode/weapp-qrcode.js')
import rpx2px from '../../utils/qrCode/rpx2px.js'
import store from "../../store"

module.exports = (that, url = "https://h5.kaiheikeji.com/wx/userMsg.html?params=6aaf0fba|baoji|1") => {
    return new Promise((resolve, reject) => {
        let qrcodeWidth = rpx2px(1200)
        let qrcode = new QRCode("qrcode", {
            usingIn: that,
            // text: "https://github.com/tomfriwel/weapp-qrcode",
            // image: "/imgs/img_share_head_bg.png",
            width: qrcodeWidth,
            height: qrcodeWidth,
            // width: 150,
            // height: 150,
            colorDark: "#000",
            colorLight: "white",
            correctLevel: QRCode.CorrectLevel.H,
        });

        qrcode.makeCode(url, (res) => {
            if (res.errMsg.indexOf("ok") !== -1) {
                const {system = "Android"} = store.data.currentUserAgentInfo
                const isAndroid = /Android/g.test(system)
                setTimeout(() => {
                    qrcode.exportImage((tempPath) => {
                        resolve(tempPath)
                    })
                }, isAndroid ? 300 : 0)
            } else {
                reject(null)
            }
        })
    })
}
