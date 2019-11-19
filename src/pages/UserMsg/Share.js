/**
 * ifuner 制作 757148586@qq.com
 */

"use strict";
const baseConfig = {
    width: 600,
    height: 1067,
    debug: false,
    pixelRatio: 1,
}
const utils = require("../../utils/util")
const getBaoji = {
    getTag: function (role, level) {
        var tempData = ""
        switch (role) {
            case 1:
                tempData = "普通用户"
                break;
            case 2:
                switch (level) {
                    case 1:
                        tempData = "冻结暴鸡"
                        break;
                    case 2:
                        tempData = "普通暴鸡"
                        break;
                    case 3:
                        tempData = "优选暴鸡"
                        break;
                    case 4:
                        tempData = "超级暴鸡"
                        break;
                }
                break;
            case 3:
                tempData = "暴娘"
                break;
                tempData = "老板"
                break;
        }
        return tempData;
    },
    getClass: function (role) {
        var tempData = ""
        switch (role) {
            case 1:
                tempData = "#4888E5"
                break;
            case 2:
                tempData = "#FD216F"
                break;
            case 3:
                tempData = "#FF4EC3"
                break;
            case 3:
                tempData = "#4888E5"
                break;
            default:
                tempData = "#4888E5"
                break;
        }
        return tempData;
    }
}
module.exports = function (data = {}, qrCode = "https://g.baojiesports.com/bps/095ea2c950154b34a83a5f938d01fdc1-430-430.jpg") {
    let {
        goodAtGameList,
        chickenId = "",
        level,
        role,
        username,
        thumbnail = "https://g.baojiesports.com/bps/e6209f0062b0424cb620606b2af80cce-160-160.png",
        order = "0",
        winningPercentage = "0",
        evaluationScore = "-"
    } = data
    utils.isNumber(order) ? order = order.toString() : order
    utils.isNumber(winningPercentage) ? winningPercentage = winningPercentage.toString() : winningPercentage
    evaluationScore = evaluationScore ? evaluationScore.toString() : "-"
    // goodAtGameList = [
    //     "https://g.baojiesports.com/bps/86047ae6bc924b85a322c13514e66699-53-52.png",
    //     "https://g.baojiesports.com/bps/fff4456ecfd34a09abaf0a142af0a3bc-52-53.png",
    //     "https://g.baojiesports.com/bps/1d1137c4a4d24c41a3f64fd9a7133701-52-52.png",
    //     "https://g.baojiesports.com/bps/4bc77ab7c4ea44888c79456217cb7ff2-53-53.png",
    //     "https://g.baojiesports.com/bps/4288cc14c42343a98205aad6afe14890-53-53.png",
    //     "https://g.baojiesports.com/bps/32256c5112ee4469a853bb8194beaaa9-52-53.png",
    //     "https://g.baojiesports.com/bps/8ab401ac24294223905e5b5433c5df3c-52-52.png",
    //     "https://g.baojiesports.com/bps/e1656e4eab424012a5cc1c4fbeb042ac-53-52.png",
    //     "https://g.baojiesports.com/bps/086549884d02438c8a1674d92b27cd83-53-52.png",
    // ]
    const newGameImg = goodAtGameList.map((item, index) => {
        let xPlace = 0
        switch (goodAtGameList.length) {
            case 1:
                xPlace = baseConfig.width / 2 - (48 / 2)
                break;
            case 2:
                xPlace = 232 + (index * (48 * 2))
                break;
            case 3:
                xPlace = (232 - 48) + (index * (48 * 2))
                break;
            case 4:
                xPlace = (232 - (48 * 2)) + (index * (48 * 2))
                break;
            default:
                xPlace = (baseConfig.width / (goodAtGameList.length + 1)) + (index * (48 * 1.2))
        }
        return {
            width: 48,
            height: 48,
            x: xPlace,
            y: 535,
            url: item,
        }
    })

    const posterConfig = {
        jdConfig: {
            ...baseConfig,
            blocks: [
                {
                    width: 196,
                    height: 196,
                    x: baseConfig.width / 2 - (196 / 2),
                    y: 71,
                    zIndex: 200,
                    borderColor: "#53EDFF",
                    borderWidth: 4
                },
                {
                    width: baseConfig.width,
                    height: 611,
                    x: 0,
                    y: 456,
                    zIndex: 0,
                    backgroundColor: "#ffffff",
                    // borderRadius: 8,
                },
                {
                    width: 108,
                    height: 30,
                    x: baseConfig.width / 2 - (108 / 2),
                    y: 292,
                    backgroundColor: getBaoji.getClass(role),
                    borderRadius: (108 / 2) / 2,
                    text: {
                        width: 80,
                        text: getBaoji.getTag(role, level),
                        textAlign: "center",
                        fontSize: 20,
                        color: "#fff",
                        opacity: 1,
                        baseLine: 'middle',
                    }
                },
                {
                    width: baseConfig.width,
                    height: 50,
                    x: 0,
                    y: 335,
                    zIndex: 10,
                    text: {
                        width: baseConfig.width - 200,
                        text: username,
                        baseLine: "middle",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 36,
                        opacity: 1,
                        lineNum: 1,
                        color: "#F9F9F9",
                    }
                },
                {
                    width: 200,
                    height: 30,
                    x: baseConfig.width / 2 - (200 / 2),
                    y: 394,
                    zIndex: 10,
                    text: {
                        height: 33,
                        fontWeight: "noraml",
                        textAlign: "center",
                        text: `ID：${chickenId}`,
                        baseLine: 'middle',
                        fontSize: 24,
                        opacity: 1,
                        lineNum: 1,
                        color: "#F9F9F9",
                    }
                },
                {
                    width: 200,
                    height: 33,
                    x: 0,
                    y: 640,
                    zIndex: 10,
                    text: {
                        fontWeight: "noraml",
                        height: 33,
                        lineHeight: 33,
                        text: "累计接单",
                        baseLine: "middle",
                        textAlign: "center",
                        fontSize: 24,
                        opacity: 1,
                        lineNum: 1,
                        color: "#828282",
                    }
                },
                {
                    width: 200,
                    height: 33,
                    x: 200,
                    y: 640,
                    zIndex: 10,
                    text: {
                        fontWeight: "noraml",
                        height: 33,
                        lineHeight: 33,
                        text: "胜率(%)",
                        baseLine: "middle",
                        textAlign: "center",
                        fontSize: 24,
                        opacity: 1,
                        lineNum: 1,
                        color: "#828282",
                    }
                },
                {
                    width: 200,
                    height: 33,
                    x: 200 + 200,
                    y: 640,
                    zIndex: 10,
                    text: {
                        fontWeight: "noraml",
                        height: 33,
                        lineHeight: 33,
                        text: "评分",
                        baseLine: "middle",
                        textAlign: "center",
                        fontSize: 24,
                        opacity: 1,
                        lineNum: 1,
                        color: "#828282",
                    }
                },
                {
                    width: 200,
                    height: 59,
                    x: 0,
                    y: 640 + 38,
                    zIndex: 10,
                    text: {
                        height: 59,
                        lineHeight: 59,
                        fontWeight: "noraml",
                        text: order.toString(),
                        baseLine: "middle",
                        textAlign: "center",
                        fontSize: 42,
                        opacity: 1,
                        color: "#181818",
                    }
                },
                {
                    width: 200,
                    height: 59,
                    x: 200,
                    y: 640 + 38,
                    zIndex: 10,
                    text: {
                        height: 59,
                        lineHeight: 59,
                        fontWeight: "noraml",
                        text: winningPercentage,
                        baseLine: "middle",
                        textAlign: "center",
                        fontSize: 42,
                        opacity: 1,
                        color: "#181818",
                    }
                },
                {
                    width: 200,
                    height: 59,
                    x: 200 + 200,
                    y: 640 + 38,
                    zIndex: 10,
                    text: {
                        height: 59,
                        lineHeight: 59,
                        fontWeight: "noraml",
                        text: evaluationScore,
                        baseLine: "middle",
                        textAlign: "center",
                        fontSize: 42,
                        opacity: 1,
                        color: "#181818",
                    }
                },
            ],
            texts: [
                {
                    x: baseConfig.width / 2 - (80 / 2),
                    y: 497,
                    width: 80,
                    height: 28,
                    fontWeight: "noraml",
                    text: "擅长游戏",
                    baseLine: 'middle',
                    zIndex: 10,
                    fontSize: 20,
                    opacity: 1,
                    lineNum: 1,
                    color: "#FF4E87",
                },
                {
                    x: baseConfig.width / 2 - (192 / 2),
                    y: 983,
                    height: 59,
                    width: 192,
                    fontWeight: "noraml",
                    zIndex: 10,
                    text: "微信扫一扫有惊喜",
                    baseLine: 'middle',
                    fontSize: 24,
                    opacity: 1,
                    lineNum: 1,
                    color: "#A5A5A5",
                },
            ],
            images: [
                {
                    width: baseConfig.width,
                    height: 456,
                    x: 0,
                    y: 0,
                    url: "https://g.baojiesports.com/bps/efcadd820d7c480f90549cd9d6ebe9ef-600-456.png",
                },
                {
                    width: 192,
                    height: 192,
                    x: baseConfig.width / 2 - (192 / 2),
                    y: 73,
                    url: thumbnail,
                },
                ...newGameImg,
                {
                    width: 120,
                    height: 120,
                    x: baseConfig.width / 2 - (120 / 2),
                    y: 824,
                    borderRadius: 8,
                    url: qrCode,
                },
                {
                    width: 40,
                    height: 40,
                    x: baseConfig.width / 2 - (40 / 2),
                    y: 824 + (((120 + 40) / 2) / 2),
                    borderRadius: 0,
                    url: "https://g.baojiesports.com/bps/6a9984e7a455450289ab28a53f7c22c4-80-80.png",
                },
            ],
            // x: baseConfig.width / 2 - (80 / 2),
            // y: 497,
            lines: [
                {
                    startY: 497,
                    startX: 189,
                    endX: 189 + 40,
                    zIndex: 10,
                    endY: 497,
                    width: 1,
                    color: "#FF4E87",
                },
                {
                    startY: 497,
                    startX: 369,
                    endX: 369 + 40,
                    zIndex: 10,
                    endY: 497,
                    width: 1,
                    color: "#FF4E87",
                },
                {
                    startY: 638,
                    startX: 203,
                    endX: 203,
                    endY: 638 + 90,
                    zIndex: 10,
                    width: 2,
                    color: "#EBEBEB",
                },
                {
                    startY: 638,
                    startX: 393,
                    endX: 393,
                    endY: 638 + 90,
                    zIndex: 10,
                    width: 2,
                    color: "#EBEBEB",
                },
            ]
        }
    }
    console.log("posterConfig", posterConfig);
    return posterConfig
}
