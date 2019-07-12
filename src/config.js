/**
 * ifuner 制作 @18658226071@163.com
 * 用来配置当前的接口请求的地址
 */
"use strict"
const currentEnv = "local"
module.exports = {
    env: currentEnv,
    version: "1.1.0",
    // apiHost: {
    //     local: "https://dev.pickpick.fun",
    //     dev: "https://dev.pickpick.fun",
    //     test: "https://test.pickpick.fun",
    //     prod: "https://prod.pickpick.fun"
    // }[currentEnv],
    // java 相关APi
    apiHost: {
        local: "https://dev-g.pickpick.fun",
        dev: "https://dev-g.pickpick.fun",
        test: "https://test-g.pickpick.fun",
        prod: "https://g.pickpick.fun"
    }[currentEnv],
    // python 相关APi
    apiPythonHost: {
        local: "https://dev-g.pickpick.fun",
        dev: "https://dev-g.pickpick.fun",
        test: "https://test-g.pickpick.fun",
        prod: "https://g.pickpick.fun"
    }[currentEnv]
}
