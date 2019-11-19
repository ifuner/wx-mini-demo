/**
 * @项目：MyClub
 * @创建人：ifuner
 * @创建人邮箱：zhoupengfei@kaiheikeji.com
 * @创建时间：2019-07-22 14:41:21
 * */

import create from "../../utils/create"

create({
    /**
     * 组件的属性列表
     */
    properties: {
        isMine: {
            type: Boolean,
            value: true
        },
        apiType: {
            type: Number,
            value: ""
        },
        data: {
            type: Object,
            value: {}
        },
        redirectTo: {
            type: String,
            value: ""
        },
        clubId: {
            type: String,
            value: ""
        },
        myClubId: {
            type: String,
            value: ""
        }
    },
    data: {
        myClubDeatil: {},
        page: 1,
        size: 6,
        total: 0,
        tabFilter: {
            gameActive: 1,
            roleActive: 1
        },
        hasData: false,
        isBaoji: true,
        defaultUserImg: "",
        isRequestApi: false,
        defaultClubImg: "https://g.baojiesports.com/bps/0f4a62f3efed42cea0a18b25316b9a89-450-450.png",
        baojiData: []
    },
    ready: function () {
        // console.log("this.store",this.store)
        this.update()
        this.store.loadFontFamily()
        console.log("这里初始化了")
    },
    methods: {
        initData() {
            const {clubId} = this.data
            const clubKey = `c_${clubId}`
            const clubData = this.store.data.clubData
            let tempData = {}
            if (clubId) {
                tempData = (clubData.otherClub.hasOwnProperty(clubKey) && clubData.otherClub[clubKey]) || {}
            } else {
                Object.keys(clubData.myClub).length && (tempData = clubData.myClub)
            }

            Object.keys(tempData).length && this.setData(tempData, () => {
                // 数据超出 时删除
                if (Object.keys(clubData.otherClub).length > 30) {
                    this.store.data.clubData = {}
                    this.update()
                }
            })
            console.log("tempData", tempData)
            this.getBaojiPagesData(true)
        },
        ToClub() {
            let role = this.data.data.type
            console.log("role", role)
            let userId = this.data.data.ownnerUid || ""
            role = role == 0 ? "baoniang" :
                role == 1 ? "baoji" :
                    role == 2 ? "boss" : "baoji"
            const {gameActive} = this.data.tabFilter
            userId ? this.$router.navigateTo("USER_MSG_PAGES", {
                userId,
                type: this.data.redirectTo,
                role: role,
                game: gameActive
            }) : this.$Message({
                content: "参数缺失",
                type: "error"
            })
        },
        previewImage() {
            const imgUrl = this.data.data.logoUrl
            imgUrl && this.wxApi("previewImage", {urls: [imgUrl]})
        },
        toMyClub(target) {
            const {status} = target.currentTarget.dataset
            if (this.store.data.loginInfo) {
                !status ? this.$router.switchTab("INDEX_PAGES") :
                    this.$router.navigateTo("CREATE_CLUB_PAGES", {type: "next"})
            } else {
                this.triggerEvent("Login", true)
            }
        },
        toEditClubMsg() {
            this.$router.navigateTo("CREATE_CLUB_PAGES", {type: "save"})
        },
        toEditBaoji() {
            this.$router.navigateTo("EDIT_BAOJI_PAGES")
        },
        toUserMsgPages(target) {
            const {value = "", role} = target.currentTarget.dataset
            const {gameActive} = this.data.tabFilter
            if (!value) {
                this.$Message({
                    content: "uid 不能为空",
                    type: "error"
                })
                return false
            }

            this.$router[this.data.redirectTo === "redirectTo" ? "redirectTo" : "navigateTo"]("USER_MSG_PAGES", {
                userId: value,
                type: this.data.redirectTo,
                role: role == 1 ? "baoji" : role == 0 ? "baoniang" : "baoji",
                game: gameActive,
                clubId: this.data.clubId || this.data.myClubId || ""
            })
        },
        tabScrollChange() {
            this.setData({
                page: 1,
                isRequestApi: false,
                baojiData: [],
            })
            this.getActive()
            this.store.data.clubData.myClub = []

            this.getBaojiPagesData()
        },
        getActive() {
            const data = this.selectComponent("#gameScroll").getActive()
            this.setData({
                tabFilter: data,
                isBaoji: data.roleActive === 1
            })

            return data
        },
        toWalletPages() {
            this.$router.navigateTo("WALLET_PAGES")
        },
        getBaojiPagesData(reload = false) {
            if (reload) {
                this.setData({
                    page: 1
                })
            }
            const {clubId, page, size, apiType} = this.data

            const {gameActive, roleActive} = this.data.tabFilter
            const clubKey = `c_${clubId}`
            console.log("clubId", clubId)

            this.$http.post("GET_BAOJI_PAGES", {
                data: Object.assign({},
                    {type: apiType},
                    (apiType === 2 && clubId) && {clubId},
                    {current: page}, {size},
                    gameActive !== -1 && {gameId: gameActive},
                    roleActive !== -1 && {playerType: roleActive}
                )
            }).then(res => {

                this.setData({
                    hasData: !!(res.data.records && res.data.records.length),
                    isRequestApi: true,
                })

                let resData = {
                    total: res.data.total,
                    baojiData: reload ? res.data.records : [...this.data.baojiData, ...res.data.records]
                }

                this.setData(resData)
                if (clubId) {
                    this.store.data.clubData.otherClub[clubKey] = resData
                } else {
                    this.store.data.clubData.myClub = resData
                }

                this.update()
            }).catch(error => {
                console.error("getBaojiPagesData", error)
            })
        },
        onReachBottom() {
            let page = this.data.page
            if (this.data.hasData) {
                page++
                this.setData({
                    page
                }, () => {
                    this.getBaojiPagesData()
                })
            } else {
                this.$Message({
                    content: "没有更多数据啦~",
                    type: "none"
                })
            }
            console.log("myclub 触底了")
        },
        onReload() {
            console.log("重新刷接口，onReload")
            this.initData()
        }
    }
})
