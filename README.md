## xxx 小程序项目

> 开发时集成eslint，框架使用原生 + westore + iview weapp 部分ui样式组件

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

### 功能点

#### 1 快速新建组件/pages模板 命令：cnpm/npm run page 并且可以顺便给你app.json 中添加了这个路由

#### 2 eslint/prettier 集成 cnpm run lint/fix

#### 3 小程序全局状态库westore 和 登录解决方案

![小程序登录流程图](https://g.baojiesports.com/bps/b81e8750e4244cdcaa247f12a3f017fa-933-1184.png)

#### 4 自定义顶部tabBar

<img src="https://g.baojiesports.com/bps/ecde0cdefca546aa8969d62c3bd425b8-1125-2436.png" width="200">
<img src="https://g.baojiesports.com/bps/c333dc4aebba4dd3a508fb10f8ed3eaa-1125-2436.png" width="200">



