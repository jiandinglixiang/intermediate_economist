<script setup>
import PopupIndex from "@/components/popup/PopupIndex.vue"
import { HOME_AD_POPUP, LOGIN_TIPS_POPUP } from "@/components/popup/popupKeyMap"
import CountdownBar from "@/pages/home/components/CountdownBar.vue"
import NavBar from "@/pages/home/components/NavBar.vue"
import { NoticeStatus } from "@/pinia/notice"
import { AD_POP_UP_IMPRESSION_HISTORY, HOME_LIST_USE_MARKS, USER_TOKEN_DATA } from "@/utils/consts"
import { openURL } from "@/utils/func"
import { onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
import dayjs from "dayjs"
import { computed, nextTick, ref } from "vue"
import CarouselTxt from "@/pages/home/components/CarouselTxt.vue"
import { usePageList } from "@/hooks/usePageList"
import { httpRequest } from "@/utils/http"
import {
  POST_LIST_NOTICE,
  POST_MATERIAL_LIST,
  POST_MATERIAL_LIST_CHANGE,
  POST_MATERIAL_LIST_DETAILS
} from "@/api"
import LoadTips from "@/components/tips/load-tips.vue"
import { pushBehavior } from "@/utils/behavior"
import { PopupStatus } from "@/pinia/popup"

const noLogin = !uni.getStorageSync(USER_TOKEN_DATA)?.token
const useMarkList = ref(uni.getStorageSync(HOME_LIST_USE_MARKS) || [])

const storePopup = PopupStatus()
const storeNotice = NoticeStatus()
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

const { list, getList, loading, loadMore, refresh } = usePageList({ requestFunc })
const noticeData = ref([])
const noticeList = computed(() => {
  const pdf = list.value
  return noticeData.value.map(({ nickname }, index) => {
    return `用户 ${nickname} 下载了 ${pdf[index]?.name || ""}`
  })
})

onLoad(() => {
  getList()
  httpRequest(POST_LIST_NOTICE, "POST").then((res) => {
    noticeData.value = res.data
  })
})
onPullDownRefresh(async () => {
  await refresh()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 500)
})
onReachBottom(() => {
  loadMore()
})

function requestFunc({ page, rows }) {
  return httpRequest(POST_MATERIAL_LIST, "POST", { page, rows, typeid: 1, status: 0 })
}
async function handleStudy(item) {
  if (noLogin) {
    gotoLogin()
    return
  }
  try {
    await uni.showLoading({ title: "" })
    await httpRequest(POST_MATERIAL_LIST_CHANGE, "POST", { id: item.id })
    // 先兑换
    const res = await httpRequest(POST_MATERIAL_LIST_DETAILS, "POST", { id: item.id })
    // 获取详情
    const link = `https://stark.pxo.cn/pdfjs-3.0.279-dist/web/viewer.html?file=${encodeURI(
      res.data.list[0].url
    )}`
    uni.navigateTo({
      url: `/pages/webview/index?noDecodeLinkQuery=1&title=${encodeURIComponent(
        item.name
      )}&link=${encodeURIComponent(link)}`,
      success() {
        pushBehavior({
          action: "资料列表 点击 资料&下载&打开\t311\t用户查看领取 {资料名称}\n",
          onceDay: true,
          replaceValue: item.name,
          isCallback: false
        })
      }
    })
    if (!useMarkList.value.includes(item.id)) {
      useMarkList.value.push(item.id)
      uni.setStorageSync(HOME_LIST_USE_MARKS, useMarkList.value)
    }
  } catch (e) {
    console.log(e)
  } finally {
    uni.hideLoading()
  }
}

function gotoLogin() {
  storePopup[LOGIN_TIPS_POPUP]?.open({
    title: "提示",
    tips: "直播预约功能需要您登录后，我们才可通知您开课信息",
    buttonText: "去登录",
    handleClick(action) {
      if (action === "btn") {
        uni.navigateTo({ url: "/pages/login/index" })
      }
    }
  })
}
</script>

<template>
  <nav-bar />
  <countdown-bar />
  <view class="list">
    <view class="item" v-for="item in list" :key="item.id">
      <view class="left">
        <text class="title">{{ item.name }}</text>
        <!--        <text class="sub-text1">共计88条</text>-->
        <!--        <text class="sub-text2">278位同学在学</text>-->
      </view>
      <view class="right">
        <view v-if="useMarkList.includes(item.id)" class="btn-continue" @click="handleStudy(item)">
          继续学习
        </view>
        <view v-else class="btn-start" @click="handleStudy(item)">开始学习</view>
      </view>
    </view>
  </view>
  <load-tips :loading="loading" />
  <carousel-txt :txt-list="noticeList" />
  <popup-index
    v-if="showAdPopup"
    ref="refAdPopup"
    :popup-key="HOME_AD_POPUP"
    @action="handleClick"
  />
  <popup-index
    v-if="noLogin"
    :ref="(r) => PopupStatus().setPopupRef(LOGIN_TIPS_POPUP, r)"
    :popup-key="LOGIN_TIPS_POPUP"
  />
</template>

<style scoped lang="scss">
.list {
  padding: 32rpx;
  .item {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    margin-bottom: 16rpx;
    border-radius: 8rpx;
    background: #ffffff;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
    padding: 16rpx 0 0 48rpx;
    background: url("/static/home/fire_icon.png") no-repeat 16rpx 20rpx;
    background-size: 22rpx 28rpx;
  }
  .left {
    flex: 1 1 auto;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-start;
    .title {
      flex: 1 1 100%;
      font-size: 28rpx;
      font-weight: 500;
      line-height: 36rpx;
      color: rgba(51, 51, 51, 1);
      margin-bottom: 16rpx;
      min-height: 72rpx;
    }
    .sub-text1,
    .sub-text2 {
      font-size: 24rpx;
      font-weight: 400;
      line-height: 24rpx;
      color: rgba(102, 102, 102, 1);
      margin-bottom: 16rpx;
    }
    .sub-text1 {
      margin-right: 32rpx;
    }
  }
  .right {
    flex: 0 0 200rpx;
    height: 128rpx;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    .btn-continue,
    .btn-start {
      width: 140rpx;
      height: 60rpx;
      border-radius: 200rpx;
      font-size: 24rpx;
      font-weight: 700;
      line-height: 60rpx;
      text-align: center;
    }
    .btn-continue {
      background: rgba(82, 0, 245, 0.08);
      color: rgba(82, 0, 245, 1);
    }
    .btn-start {
      color: rgba(255, 255, 255, 1);
      background: linear-gradient(135deg, rgba(148, 94, 255, 1) 0%, rgba(82, 0, 245, 1) 100%);
    }
  }
}
</style>
