<script setup>
import { POST_ARTICLE_COLLECT_LIST, POST_ARTICLE_TYPE, POST_VIDEO_COLLECT_LIST } from "@/api"
import CourseLineCardItem from "@/components/course/CourseLineCardItem.vue"
import InformationItem from "@/components/information/InformationItem.vue"
import SegmentedControl from "@/components/segmented-control/SegmentedControl.vue"
import LoadTips from "@/components/tips/load-tips.vue"
import { usePageList } from "@/hooks/usePageList"
import { NoticeStatus } from "@/pinia/notice"
import { PAGES_VIDEO_DETAIL } from "@/utils/consts"
import { findFormEnd } from "@/utils/func"
import { httpRequest } from "@/utils/http"
import { onHide, onLoad, onPullDownRefresh, onReachBottom, onShow } from "@dcloudio/uni-app"
import { computed, markRaw, ref } from "vue"

const storeNotice = NoticeStatus()
const controlList = ["精选课程", "资讯"]
const currentTab = ref(0)
const listData = ref([])
let targetType

const currentPageData = computed(() =>
  findFormEnd(listData.value, (i) => i.key === currentTab.value)
)
onLoad(() => {
  tabChange(0)
})
let leave
onShow(() => {
  if (leave) {
    currentPageData.value?.refresh()
    leave = false
  }
})

onHide(() => {
  leave = true
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

async function handleClick(tab, item) {
  if (tab) {
    uni.navigateTo({
      url: `/pages/information/detail?id=${item.id}&domain=${decodeURIComponent(
        targetType?.domain
      )}`
    })
    return
  }

  uni.setStorageSync(PAGES_VIDEO_DETAIL, item)
  uni.navigateTo({ url: "/pages/video/detail" })
}

async function requestFunc(tab, { page, rows }) {
  if (tab) {
    const res = await httpRequest(POST_ARTICLE_COLLECT_LIST, "POST", { page, rows })
    res.data.result = res.data.result.map((item) => {
      return {
        ...item,
        id: item.aid,
        litpic: item.pic
      }
    })
    return res
  }
  const res2 = await httpRequest(POST_VIDEO_COLLECT_LIST, "POST", { page, rows })
  res2.data.result = res2.data.result.map((item) => {
    return {
      ...item,
      src: item.file,
      title: item.title,
      number: item.star
    }
  })
  return res2
}

async function tabChange(tab) {
  if (tab && !targetType) {
    // 获取资讯类型
    const res = await httpRequest(POST_ARTICLE_TYPE, "POST")
    targetType = res.data.find((item) => item.id === 12)
  }
  let currentData = findFormEnd(listData.value, (i) => i.key === tab)
  if (!currentData) {
    currentData = usePageList({
      requestFunc: requestFunc.bind(this, tab)
    })
    currentData.component = markRaw(tab ? InformationItem : CourseLineCardItem)
    currentData.key = tab
    currentData.handleClick = handleClick.bind(this, tab)
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
  <segmented-control :list="controlList" fixed @change="tabChange" />
  <view v-for="page in listData" v-show="currentTab === page.key" :key="page.key">
    <component
      :is="page.component"
      v-for="(item, index) in page.list"
      :key="item.id"
      :item-data="item"
      :under-line="page.list.length - 1 !== index"
      display-mode="favorites"
      @click="page.handleClick(item)"
    ></component>
    <load-tips :loading="page.loading" />
  </view>
</template>

<style lang="scss" scoped></style>
