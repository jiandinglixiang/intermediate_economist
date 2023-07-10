import { spliceOnceDayCache } from "@/utils/behavior"
import { USER_TOKEN_DATA } from "@/utils/consts"
import { defineStore } from "pinia"
import { config, httpRequest } from "@/utils/http"
import { GET_USER_INFO, POST_CLIENT_USER_LOGOUT } from "@/api"
import { APP_ID } from "@/config"

export const userInfo = defineStore("userInfo", {
  // 也可以这样定义
  state: () => ({
    allotName: "",
    allotStatus: -1,
    allotUserid: "",
    appid: APP_ID,
    avatar: "",
    balance: -1,
    id: -1,
    integral: -1,
    originphone: "",
    phone: "",
    secretphone: "",
    signin: false
  }),
  actions: {
    async getUserInfo() {
      const res = await httpRequest(GET_USER_INFO, "POST")
      this.$patch(res.data)
      return res?.data
    },
    loginOutClean() {
      this.$reset()
      httpRequest(POST_CLIENT_USER_LOGOUT, "POST")
      config.header.token = ""
      uni.removeStorageSync(USER_TOKEN_DATA)
      spliceOnceDayCache(0) // 清理上报缓存
    }
  },
  unistorage: true // 数据持久化
})
