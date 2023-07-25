<template>
  <view class="container">
    <view class="guide-page">
      <image class="guide-image" src="/static/logo.png"></image>
      <!--      <text class="guide-text">中级经济师考点速记</text>-->
    </view>
    <popup-index
      v-if="!ConfirmAuthorization"
      ref="privacyPopup"
      :popup-key="PRIVACY_AUTH_POPUP"
      @action="handleAction"
    />
  </view>
</template>

<script setup>
import PopupIndex from "@/components/popup/PopupIndex.vue"
import { PRIVACY_AUTH_POPUP } from "@/components/popup/popupKeyMap"
import { AppAuditStatus } from "@/pinia/audit"
import { userInfo } from "@/pinia/user"
import { CONFIRM_AUTHORIZATION } from "@/utils/consts"
import { onLoad } from "@dcloudio/uni-app"
import { nextTick, ref } from "vue"

// 是否授权
const ConfirmAuthorization = uni.getStorageSync(CONFIRM_AUTHORIZATION)
const privacyPopup = ref()
const auditStatus = AppAuditStatus().getAppAuditStatus()

onLoad(async () => {
  //#ifdef APP-PLUS
  // plus.navigator.setFullscreen(true)
  plus.navigator.closeSplashscreen() // 关闭启动页
  //#endif
  if (ConfirmAuthorization) {
    goNext()
  } else {
    await nextTick()
    privacyPopup.value.open()
  }
})

async function goNext() {
  try {
    uni.showLoading()
    if (await auditStatus) {
      // 审核状态
      uni.reLaunch({ url: "/pages/home/index" })
    } else if (await userInfo().getUserInfo()) {
      // 非审核,登录状态
      uni.reLaunch({ url: `/pages/user/index` })
    } else {
      uni.reLaunch({ url: `/pages/login/index` })
    }
  } catch (err) {
    console.log(err)
    uni.reLaunch({ url: `/pages/login/index` })
  } finally {
    uni.hideLoading()
  }
}

async function handleAction(action) {
  if (action === "agree") {
    uni.setStorageSync(CONFIRM_AUTHORIZATION, true)
    privacyPopup.value.close()
    await new Promise((resolve) => setTimeout(resolve, 200))
    goNext()
  } else {
    // #ifdef APP-PLUS
    if (plus.os.name.toLowerCase() === "android") {
      plus.runtime.quit()
    } else {
      const threadClass = plus.ios.importClass("NSThread")
      const mainThread = plus.ios.invoke(threadClass, "mainThread")
      plus.ios.invoke(mainThread, "exit")
      plus.ios?.import?.("UIApplication")?.sharedApplication?.()?.performSelector?.("exit")
    }
    // #endif
    // #ifdef H5
    window.location.href = "/"
    // #endif
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #fff;
}

.guide-page {
  position: absolute;
  bottom: trpx(88);
  left: 50%;
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  justify-content: center;
  transform: translateX(-50%);
}

.guide-text {
  font-size: trpx(32);
  line-height: trpx(32);
  color: #333333;
}

.guide-image {
  width: trpx(108);
  height: trpx(108);
  margin-bottom: trpx(24);
}
</style>
