<script setup>
import { GET_LIVE_LIST } from "@/api"
import LiveLineCardItem from "@/components/live/LiveLineCardItem.vue"
import PopupIndex from "@/components/popup/PopupIndex.vue"
import { LOGIN_TIPS_POPUP } from "@/components/popup/popupKeyMap"
import SegmentedControl from "@/components/segmented-control/SegmentedControl.vue"
import LoadTips from "@/components/tips/load-tips.vue"
import { usePageList } from "@/hooks/usePageList"
import { PopupStatus } from "@/pinia/popup"
import { USER_TOKEN_DATA } from "@/utils/consts"
import { useSubscribeLiveStatusUpdate } from "@/utils/event"
import { findFormEnd } from "@/utils/func"
import { httpRequest } from "@/utils/http"
import { onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
import { computed, ref } from "vue"

const noLogin = !uni.getStorageSync(USER_TOKEN_DATA)?.token

const controlList = ["全部", "近期直播", "直播回放"]
const currentTab = ref(0)
const listData = ref([])

const currentPageData = computed(() =>
  findFormEnd(listData.value, (i) => i.key === currentTab.value)
)
onLoad(() => {
  tabChange(0)
})

useSubscribeLiveStatusUpdate((args) => {
  currentPageData.value?.refresh()
})

onPullDownRefresh(() => {
  currentPageData.value?.refresh().finally(() => {
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 500)
  })
})

onReachBottom(() => {
  currentPageData.value?.loadMore()
})

function tabChange(tab) {
  let currentData = findFormEnd(listData.value, (i) => i.key === tab)
  if (!currentData) {
    currentData = usePageList({
      requestFunc({ page, rows }) {
        return httpRequest(GET_LIVE_LIST, "POST", {
          page,
          rows,
          enable: tab
        })
      }
    })
    currentData.key = tab
    listData.value.push(currentData)
    currentData.getList()
  } else {
    !currentData.list.length && currentData.refresh()
  }

  if (currentTab.value === tab) {
    console.log("相同selectIndex")
    return
  }
  currentTab.value = tab
  setTimeout(() => {
    uni.pageScrollTo({ scrollTop: 1, duration: 0 })
  }, 100)
}
</script>

<template>
  <popup-index
    v-if="noLogin"
    :ref="(r) => PopupStatus().setPopupRef(LOGIN_TIPS_POPUP, r)"
    :popup-key="LOGIN_TIPS_POPUP"
  />
  <segmented-control :list="controlList" fixed @change="tabChange" />
  <view v-for="page in listData" v-show="currentTab === page.key" :key="page.key">
    <live-line-card-item v-for="item in page.list" :key="item.id" :item-data="item" is-line-card />
    <load-tips :loading="page.loading" />
  </view>
</template>

<style lang="scss" scoped></style>
