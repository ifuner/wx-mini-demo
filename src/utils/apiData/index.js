/**
 * ifuner 制作 757148586@qq.com
 */

"use strict"
export default {
    "GET_TEST_HELLO": "/api/baseInfo", // 假接口
    "MY_CLUB_DETAILT": "/club/myClub", // 查看我的俱乐部详情
    "EDIT_CLUB_MSG": "/club/update", // 修改俱乐部信息
    "FIRST_CREATE_CLUB": "/club/save", // 修改俱乐部信息
    "DELETE_CLUBUSER": "/club/deleteBaoJi", //删除俱乐部暴鸡成员(目前不支持批量删除)
    "ADD_BAOJI_CLUB": "/club/addBaoJi", //添加暴鸡成员
    "OTHER_CLUB_DETAILS": "/club/othersClub", //查看他人俱乐部详情
    "BOSS_USE": "/user/userInfo", // 老板主页
    "BOAJI_CLUB": "/user/baoJiInfo", // 暴鸡主页
    "GET_QINIU_TOKEN": "/club/upload", // 获取七牛得token
    "GET_ENUMS_LIST": "/club/enums/get", // 获取平台所有的枚举
    "GET_CLUB_MEMBER": "/user/clubMember", // 俱乐部详情页俱乐部暴鸡成员分页列表
    "POST_USER_FOCUS": "/user/focus", // 关注 或者取消关注
    "SEARCH_BAOJI": "/club/baoji/search", // 搜索暴鸡
    "BOAJI_SORT": "/club/baoji/sort", // 暴鸡向上向下排序
    "SEND_CODE": "/user/genVerificationCode", // 登录时发送短信验证码
    "PHONE_AND_CODE_LOGIN": "/user/phoneLoginByCode", // 手机号码+验证码登录
    "GET_BAOJI_PAGES": "/club/baoji/pageBaoji", //分页获取俱乐部暴鸡成员,或者获取其他人俱乐部得暴鸡成员
    "WALLET_LIST_DATA": "/distribution/distributionSpec",
    "MY_USER_INFO": "/user/myInfo",
    "WX_CODE_LOGIN": "/user/wxLoginByCode", //老用户微信登录(openid登录)
    "WX_LOGIN_BY_WXAPI": "/user/wxLogin", //新老用户登录注册(getUserInfo用户授权)
    "WX_LOGIN_BY_WXPHONEAPI": "/user/phoneLoginByAuth", //新老用户登录注册(getUserInfo用户授权)
    "CREATE_ORDER": "/distribution/order", //订单生成
    "UPLOAD_QINIU_IMG": "/user/img/header/upload", // 七牛头像上传
    "CREATE_USER_POSTER": "/user/img/draw"
}
