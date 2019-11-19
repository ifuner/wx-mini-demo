## xxx 小程序项目

> 开发时集成eslint，框架使用原生 + westore + iview weapp 部分ui样式组件,代码去除了真实的请求地址，部分配置和页面。方便大家学习交流

### 自己修改appid 并关闭安全域名校验 运行一下就知道喽~

### 库插件

#### 1. wxApi 

```javascript
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
// 仅支持wx 的异步方法 
wxApi("fnName",params).then(res=>{}).catch(error=>{})
```

#### 2. request

```javascript
    /**
    *  1. 接口文件单独维护
    *  2. 设置token
    *  3. 中断请求
    *  4. 401 重试示范
    * */
    
    import http from "xxx/xxx/request.js"
    // 普通的请求
    http.get("YOUR_API")
    // resful 拼接的情况 ，目前只支持三个自定义参数，多的自己再修改代码，或者去怼后端吧
    http.get({
        key:"YOUR_API",
        p1:"hello",
        p2:"world",
    })
    
    // 所有的请求都被拦截包装过的，可根据自己的业务进行包装
    
```

### 彩蛋

> 点击topbar 15下可弹出暗门操作，方面调试定位

### 功能点

#### 1 快速新建组件/pages模板 命令：cnpm/npm run page 并且可以顺便给你app.json 中添加了这个路由

#### 2 eslint/prettier 集成 cnpm run lint/fix

#### 3 小程序全局状态库westore 和 登录解决方案

![小程序登录流程图](https://g.baojiesports.com/bps/b81e8750e4244cdcaa247f12a3f017fa-933-1184.png)

#### 4 自定义顶部tabBar

<img src="https://g.baojiesports.com/bps/b6f2c5f6fe6444a88bcc1b153449ab2f-1125-2436.png" width="200">
<img src="https://g.baojiesports.com/bps/18e744605e084d7bbe1c221c6bf95412-1125-2436.png" width="200">

#### 5 海报图分享
<img src="https://g.baojiesports.com/bps/0923bf9e79904cc6955daf92638b996e-1125-2436.png" width="200">

#### 5.全局按需登录的组件
<img src="https://g.baojiesports.com/bps/9b049f1809784862ace5b58e538cd232-1125-2436.png" width="200">
<img src="https://g.baojiesports.com/bps/f2a15e77df9a40b8b7b4a0a6f741ad89-1125-2436.png" width="200">

