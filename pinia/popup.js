import { LOGIN_TIPS_POPUP, PRIVACY_AUTH_POPUP } from "@/components/popup/popupKeyMap"
import { defineStore } from "pinia"

export const PopupStatus = defineStore("PopupStatus", {
  // 也可以这样定义
  state: () => ({
    [LOGIN_TIPS_POPUP]: null, // ref
    [PRIVACY_AUTH_POPUP]: null // ref
  }),
  actions: {
    async setPopupRef(key, ref) {
      this[key] = ref
    }
  }
})
