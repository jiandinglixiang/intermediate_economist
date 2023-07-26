import { defineStore } from "pinia"
import { httpRequest } from "@/utils/http"
import { GET_USER_CLIENT_VERSION } from "@/api"
import { getSystemInfoPromise } from "@/utils/func"

export const AppAuditStatus = defineStore("AppAuditStatus", {
  // 也可以这样定义
  state: () => ({
    auditStatusBoolean: !import.meta.env.DEV
  }),
  actions: {
    async getAppAuditStatus() {
      const system = await getSystemInfoPromise()
      const res = await httpRequest(GET_USER_CLIENT_VERSION, "POST", {
        type: system.osName === "ios" ? 1 : 2
      })
      if (res?.data?.status) {
        // 状态(1审核2发布)
        this.auditStatusBoolean = res.data.status === 1
      }
      console.log(this.auditStatusBoolean, system)
      return this.auditStatusBoolean
    }
  },
  unistorage: true // 数据持久化
})
