<script setup>
import PopupIndex from "@/components/popup/PopupIndex.vue"
import { HOME_AD_POPUP, LOGIN_TIPS_POPUP } from "@/components/popup/popupKeyMap"
import CountdownBar from "@/pages/home/components/CountdownBar.vue"
import CourseGroup from "@/pages/home/components/CourseGroup.vue"
import CourseGroupLine from "@/pages/home/components/CourseGroupLine.vue"
import ImageCarousel from "@/pages/home/components/ImageCarousel.vue"
import KongoDistrict from "@/pages/home/components/KongoDistrict.vue"
import LiveScrollX from "@/pages/home/components/LiveScrollX.vue"
import NavBar from "@/pages/home/components/NavBar.vue"
import SectionBar from "@/pages/home/components/SectionBar.vue"
import { AppAuditStatus } from "@/pinia/audit"
import { NoticeStatus } from "@/pinia/notice"
import { PopupStatus } from "@/pinia/popup"
import { AD_POP_UP_IMPRESSION_HISTORY, USER_TOKEN_DATA } from "@/utils/consts"
import { openURL } from "@/utils/func"
import { onLoad } from "@dcloudio/uni-app"
import dayjs from "dayjs"
import { nextTick, ref } from "vue"

const noLogin = !uni.getStorageSync(USER_TOKEN_DATA)?.token

const storeNotice = NoticeStatus()
const storeAppAuditStatus = AppAuditStatus()
const showAdPopup = ref(false)
const refAdPopup = ref()

onLoad(() => {
  const AdPopUpHistory = uni.getStorageSync(AD_POP_UP_IMPRESSION_HISTORY)
  if (!AdPopUpHistory || !dayjs().isSame(AdPopUpHistory, "day")) {
    showAdPopup.value = true
    nextTick(() => {
      refAdPopup.value.open()
    })
  }
})

function handleClick(action) {
  uni.setStorageSync(AD_POP_UP_IMPRESSION_HISTORY, Date.now())
  if (action === "btn") {
    refAdPopup.value.close()
    setTimeout(() => {
      openURL(storeNotice.miniApp.find((i) => i.id === 4))
    }, 500)
  }
}
</script>

<template>
  <nav-bar />
  <image-carousel />
  <kongo-district />
  <countdown-bar />
  <template v-if="!storeAppAuditStatus.auditStatusBoolean">
    <section-bar left-text="最近直播" nav-url="/pages/live/liveList" />
    <live-scroll-x />
    <popup-index
      v-if="noLogin"
      :ref="(r) => PopupStatus().setPopupRef(LOGIN_TIPS_POPUP, r)"
      :popup-key="LOGIN_TIPS_POPUP"
    />
  </template>
  <section-bar left-text="精选课程" nav-url="/pages/video/videoList" />
  <course-group-line />
  <template v-if="!storeAppAuditStatus.auditStatusBoolean">
    <section-bar left-text="系统课" nav-url="/pages/course/courseList" />
    <course-group />
  </template>
  <popup-index
    v-if="showAdPopup"
    ref="refAdPopup"
    :popup-key="HOME_AD_POPUP"
    @action="handleClick"
  />
</template>

<style></style>
