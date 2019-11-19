/**
 * ifuner 制作 757148586@qq.com
 */

"use strict"
module.exports = {
    "GET_TEST_HELLO": {
        "msg": "操作成功",
        "success": true,
        "code": 200,
        "data": null
    },
    "WX_LOGIN_BY_WXAPI": {
        "msg": "操作成功",
        "code": 200,
        "data": "your login token"
    },
    "MY_CLUB_DETAILT": {
        "msg": "操作成功",
        "success": true,
        "code": 200,
        "data": {
            "name": "王者俱乐部",
            "signature": "测试俱乐部",
            "logoUrl": "https://static.pickpick.fun/pickAdmin/w640-h640-t1563768286570.jpg",
            "supportGame": null,
            "totalAmount": 10000,
            "outAmount": 300,
            "examineAmount": 100,
            "introduce": "https://g.baojiesports.com/bps/91277a64c6194b0e84ed43207fcb0837-750-993.png",
            "isCreate": true
        }
    },
    "DELETE_CLUBUSER": {
        "msg": "操作成功",
        "code": 200
    },
    "MY_USER_INFO": {
        "code": 200,
        "msg": "",
        "data": {
            "thumbnail": "https://g.baojiesports.com/bps/00c90580dc0b4246bc16aeb339fd1df9-720-720.jpg",
            "username": "Hello World",
            "chickenId": "1231231",
            "sex": 1,
            "role": 1,
            "level": 100
        }
    },
    "GET_BAOJI_PAGES": {
        "msg": "操作成功",
        "code": 200,
        "data": {
            "records": [
                {
                    "isExist": false,
                    "baoJiUid": "818b941a",
                    "name": "楼上",
                    "tagValue": 1,
                    "tagDescribe": "暴娘",
                    "grade": 2.5,
                    "logoUrl": "https://g.baojiesports.com/bps/f6f5797445da465da5342be9f4b0bd7e-3024-3024.jpg",
                    "totalOrder": 100,
                    playerType: 0
                },
                {
                    "isExist": false,
                    "baoJiUid": "818bw941a",
                    "name": "楼中楼",
                    "tagValue": 1,
                    "tagDescribe": "普通鸡",
                    "grade": 4.5,
                    "logoUrl": "https://g.baojiesports.com/bps/f6f5797445da465da5342be9f4b0bd7e-3024-3024.jpg",
                    "totalOrder": 1006,
                    playerType: 0
                },
                {
                    "isExist": false,
                    "baoJiUid": "818b941a",
                    "name": "楼下",
                    "tagValue": 1,
                    "tagDescribe": "普通暴鸡",
                    "grade": 4.5,
                    "logoUrl": "https://g.baojiesports.com/bps/f6f5797445da465da5342be9f4b0bd7e-3024-3024.jpg",
                    "totalOrder": 10000,
                    playerType: 1
                }
            ],
            "total": 18,
            "size": 2,
            "current": 1,
            "orders": [],
            "searchCount": true,
            "pages": 9
        }
    },
    "SEARCH_BAOJI": {
        "msg": "操作成功",
        "code": 200,
        "data": {
            "records": [
                {
                    "uid": "cbd833e2",
                    "name": "暴鸡粑粑",
                    "logoUrl": "https://static.pickpick.fun/pickAdmin/w114-h114-t1564378519420.png",
                    "tagValue": 1,
                    "tagDescribe": "超级暴鸡",
                    "grade": "4.5",
                    "totalOrder": "10000",
                    "victoryChance": "99",
                    "exist": false,
                    playerType: 0
                },
                {
                    "uid": "cbd433e2",
                    "name": "暴鸡粑粑",
                    "logoUrl": "https://static.pickpick.fun/pickAdmin/w114-h114-t1564378519420.png",
                    "tagValue": 1,
                    "tagDescribe": "超级暴鸡",
                    "grade": "4.5",
                    "totalOrder": "10000",
                    "victoryChance": "99",
                    "exist": false,
                    playerType: 1
                },
                {
                    "uid": "cbd133e2",
                    "name": "暴鸡粑粑",
                    "logoUrl": "https://static.pickpick.fun/pickAdmin/w114-h114-t1564378519420.png",
                    "tagValue": 1,
                    "tagDescribe": "超级暴鸡",
                    "grade": "4.5",
                    "totalOrder": "10000",
                    "victoryChance": "99",
                    "exist": false,
                    playerType: 1
                },
                {
                    "uid": "cbd333e2",
                    "name": "暴鸡粑粑",
                    "logoUrl": "https://static.pickpick.fun/pickAdmin/w114-h114-t1564378519420.png",
                    "tagValue": 1,
                    "tagDescribe": "超级暴鸡",
                    "grade": "4.5",
                    "totalOrder": "10000",
                    "victoryChance": "99",
                    "exist": false,
                    playerType: 1
                }
            ],
            "total": 1,
            "size": 20,
            "current": 1,
            "orders": [],
            "searchCount": true,
            "pages": 1
        }
    },
    "EDIT_CLUB_MSG": {
        "msg": "操作成功",
        "code": 200,
        "data": null
    },
    // "SEND_CODE": {
    //     "code": 200,
    //     "msg": "发送成功",
    //     "data": ""
    // },
    "BOAJI_SORT": {
        "msg": "排序成功",
        "code": 200,
        "data": null
    },
    // "PHONE_AND_CODE_LOGIN": {
    //     "code": 200,
    //     "msg": "发送成功",
    //     "data": `this is a mock token ${+new Date()}`
    // },
    "POST_USER_FOCUS": {
        "code": 200,
        "msg": "操作成功~"
    },
    "OTHER_CLUB_DETAILS": {
        "msg": "操作成功",
        "code": 200,
        "data": {
            "name": "王者俱乐部",
            "ownnerId": 1,
            "signature": "aaa",
            "logoUrl": "https://static.pickpick.fun/pickAdmin/w640-h640-t1563768286570.jpg",
            "ownnerName": "啊啊"
        }
    },
    "GET_ENUMS_LIST": {
        "msg": "操作成功",
        "code": 200,
        "data": {
            "baojiType": [
                {
                    "type": 0,
                    "name": "暴娘"
                },
                {
                    "type": 1,
                    "name": "暴鸡"
                }
            ],
            "games": [
                {
                    "id": 1,
                    "name": "王者荣耀",
                    "code": 1
                },
                {
                    "id": 2,
                    "name": "英雄联盟",
                    "code": 2
                },
                {
                    "id": 3,
                    "name": "绝地求生",
                    "code": 3
                },
                {
                    "id": 5,
                    "name": "QQ飞车",
                    "code": 5
                },
                {
                    "id": 11,
                    "name": "荒野行动",
                    "code": 4
                },
                {
                    "id": 13,
                    "name": "全军出击",
                    "code": 7
                },
                {
                    "id": 14,
                    "name": "决战!平安京",
                    "code": 8
                },
                {
                    "id": 15,
                    "name": "测试",
                    "code": 11
                },
                {
                    "id": 16,
                    "name": "刺激战场",
                    "code": 6
                },
                {
                    "id": 18,
                    "name": "堡垒之夜",
                    "code": 98
                }
            ]
        }
    },
    "WALLET_LIST_DATA": {
        "code": 200,
        "msg": "",
        myAmount: 10000,
        amountList: [
            {
                "amountInfo": "佣金芬达",
                "createTime": "7月9日 10:49",
                "amount": "+5.00"
            },
            {
                "amountInfo": "提现交易",
                "createTime": "7月9日 10:49",
                "amount": "-100.00"
            }
        ]
    },
    "BOAJI_CLUB": {
        "code": 200,
        "msg": "",
        "data": {
            "id": "123123123",
            "username": "思虹小姐姐",
            "sex": 2,
            "role": 1,
            "desc": "这个是描述",
            "attention": 1000,
            "fans": 100,
            "order": 10000,
            "winningPercentage": 59.2,
            "evaluationScore": 4.5,
            "thumbnail": "https://g.baojiesports.com/bps/f6f5797445da465da5342be9f4b0bd7e-3024-3024.jpg",
            "clubId": "clubId",
            "clubName": "俱乐部名称",
            "goodAtGameList": [
                "https://g.baojiesports.com/bps/eedee6eb22f0419fae43c1bbcf31679d-128-128.png",
                "https://g.baojiesports.com/bps/eedee6eb22f0419fae43c1bbcf31679d-128-128.png",
                "https://g.baojiesports.com/bps/eedee6eb22f0419fae43c1bbcf31679d-128-128.png",
            ],
            "receiveOrderStatus": true,
            "attentionStatus": true,
            "exclusiveEscortDto": {
                "sign": "come on baby",
                "oldPrice": "40",
                "preferentialPrice": "30.00",
                "transactionOrder": 100
            },
            "motorcadeFlyDto": {
                "title": "来鸭，快活呀",
                "transactionOrder": 1000,
                "discount": "7"
            },
        }
    }
}
