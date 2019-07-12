import create from "../../utils/create"

create({
    /**
     * 组件的属性列表
     */
    properties: {},
    data: {
        index: {}
    },
    ready: function () {
        // console.log("this.store",this.store)

    },
    methods: {
        weStoreTestNum() {
            let {num} = this.store.data.index
            this.update({
                [`index.num`]: ++num
            })
        }
    }
})
