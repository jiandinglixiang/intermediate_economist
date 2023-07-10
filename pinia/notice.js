import { defineStore } from "pinia"
import { httpRequest } from "@/utils/http"
import {
  GET_USER_CLIENT_VERSION,
  GET_USER_INFO,
  POST_COMMON_DATA,
  POST_UPDATE_LOGIN_USER_INFO
} from "@/api"
import { getSystemInfoPromise } from "@/utils/func"
import { userInfo } from "@/pinia/user"

export const NoticeStatus = defineStore("NoticeStatus", {
  // 也可以这样定义
  state: () => ({
    // 0 全部 1 考试时间 2 微信小程序配置 3 在线咨询
    loading: false,
    countDown: [], // 倒计时
    miniAppOrigin: [], // 小程序
    onlineConsultation: [] // 在线咨询
  }),
  getters: {
    miniApp() {
      const originphone = userInfo().originphone
      if (originphone) {
        return this.miniAppOrigin.map((item) => {
          return {
            ...item,
            value: item.value + (originphone || "")
          }
        })
      }
      return this.miniAppOrigin
    }
  },
  actions: {
    async getCommonData() {
      if (this.loading) {
        return
      }
      this.loading = true
      const res = await httpRequest(POST_COMMON_DATA, "POST", { position: 0 })
      const state = {
        countDown: [], // 倒计时
        miniAppOrigin: [], // 小程序
        onlineConsultation: [] // 在线咨询
      }
      res.data.forEach((item) => {
        if (item.position === 2) {
          state.miniAppOrigin.push(item)
        } else if (item.position === 1) {
          state.countDown.push(item)
        } else if (item.position === 3) {
          state.onlineConsultation.push(item)
        }
      })
      // console.log(state)
      this.$patch(state)
    }
  }
})
