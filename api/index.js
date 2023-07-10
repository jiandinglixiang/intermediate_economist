export const GET_USER_INFO = "/client/user/details"

// 更新信息
export const POST_UPDATE_LOGIN_USER_INFO = "/user/rest/v1/updateLoginUserInfo"

// 获取OSS上传参数
export const GET_OSS_POST_PARAMS = "/oss/rest/v1/getPostPolicy"

// 分页查询 - 当前登录用户流水
export const GET_USER_ACCOUNT_GOLD_LOG = "/accountGoldLog/rest/v1/pageForLoginUserReal"

// 获取版本(可不需token)
export const GET_USER_CLIENT_VERSION = "/client/version"

export const POST_PHONE_SMS = `/client/smssend`

export const POST_PHONE_AND_SMS_LOGIN = `/client/smslogin`

export const POST_CLIENT_USER_LOGOUT = `/client/user/logout`

export const POST_CLIENT_USER_FEEDBACK = `/client/user/feedback`


export const GET_AD_CLIENT_BANNER = "/client/banner"

export const GET_LIVE_LIST = "/client/live/list"


export const POST_LIVE_SUBSCRIBE = "/client/live/subscribe"

// 获取通用数据(可不需token)
export const POST_COMMON_DATA = "/client/configfields"

export const POST_VIDEO_LIST = "/client/video/list" // 课程

export const GET_VCOURSE_LIST = "/client/vcourse/list" // 系统课


export const POST_LIST_OF_MATERIALS = "/client/material/original/list"

export const POST_LIST_NOTICE = "/client/material/original/listDraw"


export const  POST_VCOURSE_DETATILS = "/client/vcourse/detatils"

export const  POST_LIVE_DETATILS = "/client/live/detatils"


export const POST_VIDEO_LIST_CLASSHOUR = "/client/video/listClasshour"


export const POST_ARTICLE_TYPE = "/client/article/type"
export const GET_ARTICLE_LIST = "/dedeCmsApp/index/v1/getarclist"
export const GET_ARTICLE_DETAIL = '/dedeCmsApp/index/v1/getarclist/{id}'

export const POST_VIDEO_COLLECT = "/client/video/collect"
export const POST_ARTICLE_COLLECT = "/client/article/collect"

export const POST_ARTICLE_COLLECT_STATUS  = "/client/article/collect/status"


export const POST_VIDEO_COLLECT_LIST = "/client/video/collect/list"

export const POST_ARTICLE_COLLECT_LIST = "/client/article/collect/list"

export const POST_VIDEO_PLAY_LOG = "/client/video/playLog"

export const ONE_KEY_LOGIN_UNI_APP = "/client/onekeyloginuniapp"

export const  POST_BEHAVIOR="/client/behavior/push"
