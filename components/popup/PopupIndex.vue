<template>
  <!--#ifdef H5-->
  <uni-popup ref="popup" :is-mask-click="false" class="max-index" type="center">
    <privacy-auth-popup
      v-if="popupKey === PRIVACY_AUTH_POPUP"
      :popup-data="params"
      @action="handleAction"
    />
    <agree-auth-popup
      v-else-if="popupKey === AGREE_AUTH_POPUP"
      :popup-data="params"
      @action="handleAction"
    />
    <login-tips-popup
      v-else-if="popupKey === LOGIN_TIPS_POPUP"
      :popup-data="params"
      @action="handleAction"
    />
    <home-ad-popup
      v-else-if="popupKey === HOME_AD_POPUP"
      :popup-data="params"
      @action="handleAction"
    />
  </uni-popup>
  <!--#endif-->
</template>
<script setup>
import AgreeAuthPopup from "@/components/popup/AgreeAuthPopup.vue"
import HomeAdPopup from "@/components/popup/HomeAdPopup.vue"
import LoginTipsPopup from "@/components/popup/LoginTipsPopup.vue"
import { PAGES_POPUP_INDEX } from "@/utils/consts"
import { deepMergeObjects } from "@/utils/func"
// 根据环境接收 并emits出事件
// 接收popupKey
import { onUnmounted, ref } from "vue"
import {
  AGREE_AUTH_POPUP,
  HOME_AD_POPUP,
  LOGIN_TIPS_POPUP,
  PRIVACY_AUTH_POPUP
} from "./popupKeyMap"
import PrivacyAuthPopup from "./PrivacyAuthPopup.vue"

const {
  params: propsParams,
  popupKey,
  autoClose
} = defineProps({
  propsParams: Object,
  popupKey: String,
  autoClose: {
    type: Boolean,
    default: true
  }
})
const emits = defineEmits(["action"])
const popup = ref()
const params = ref({ ...propsParams })

onUnmounted(() => {
  uni.$off(popupKey, handleAction)
})

function handleAction(...actionParams) {
  if (autoClose && actionParams[0] === "close") {
    close()
  }
  params.value?.handleClick?.(...actionParams) || emits("action", ...actionParams)
}

function open(arg = {}) {
  arg = deepMergeObjects(arg, params.value)
  // 合并
  const { handleClick, ...args } = arg
  // 剔除
  params.value = { ...args, handleClick }

  // #ifndef H5
  uni.$on(popupKey, handleAction) // 事件订阅
  uni.setStorageSync(PAGES_POPUP_INDEX, Object.keys(args).length ? args : undefined) // 参数传递
  uni.navigateTo({
    url: "/pages/popup/index?popupKey=" + popupKey
  })
  // #endif
  // #ifdef H5
  popup.value.open()
  // #endif
}

function close() {
  // #ifndef H5
  uni.navigateBack()
  // #endif
  // #ifdef H5
  popup.value.close()
  // #endif
}

defineExpose({
  open,
  close
})
</script>
<style lang="scss" scoped>
.max-index {
  z-index: 10000000;
}
</style>
