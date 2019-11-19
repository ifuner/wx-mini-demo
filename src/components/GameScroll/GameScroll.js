/**
 * @项目：GameScroll
 * @创建人：ifuner
 * @创建人邮箱：zhoupengfei@kaiheikeji.com
 * @创建时间：2019-07-27 10:45:41
 * */

import create from "../../utils/create"
// const app = getApp()
create({
    /**
     * 组件的属性列表
     */
    properties: {
        showRoleTab: {
            type: Boolean,
            value: true
        },
        showAllValue: {
            type: Boolean,
            value: false
        }
    },
    data: {
        gameActive: "",
        gameInto: "",
        roleActive: "",
        EnumsListData: {},
    },
    ready: function () {
        this.update()
        this.getEnumsList()
    },
    methods: {
        getEnumsList() {
            this.store.getEnumsList().then(res => {
                // if (this.data.showAllValue) {
                //     res.baojiType.unshift({
                //         type: -1,
                //         name: "全部身份"
                //     })
                //
                //     res.games.unshift({
                //         code: -1,
                //         name: "全部游戏"
                //     })
                //     this.store.data.EnumsListData = res
                // } else {
                //     console.log("getEnumsList", res);
                //     this.store.data.EnumsListData = res
                // }
                this.update()
                this.setActive(res)
            }).catch((error) => {
                const data = this.data.EnumsListData
                if (Object.keys(data).length) {
                    this.setActive(data)
                } else {
                    console.log("getEnumsList", error)
                }
            })
        },
        setActive(res) {
            let [role] = res.baojiType
            let [game] = res.games
            this.setData({
                gameActive: game.code,
                roleActive: role.type,
            })
            this.tabChange()
        },
        getActive() {
            const {gameActive, roleActive, showRoleTab} = this.data
            return Object.assign({}, {gameActive}, showRoleTab && {roleActive})
        },
        tabChange() {
            this.triggerEvent("change", this.getActive())
        },
        handelClickGame(target) {
            this.setValue("gameActive", target, (value) => {
                console.log("value", value)
                this.setData({
                    gameInto: `gameId-${value}`
                })
            })
        },
        handelClickRole(target) {
            this.setValue("roleActive", target)
        },
        setValue(key, target, cb) {
            const value = target.currentTarget.dataset.value
            if (this.data[key] !== value) {
                this.setData({
                    [key]: value
                }, () => {
                    cb && cb(value)
                })
                this.tabChange()
            }
        }
    }
})
