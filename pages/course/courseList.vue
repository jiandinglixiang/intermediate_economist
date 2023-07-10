<script setup>
import { GET_VCOURSE_LIST } from "@/api"
import CourseLineCardItem from "@/components/course/CourseLineCardItem.vue"
import LoadTips from "@/components/tips/load-tips.vue"
import { usePageList } from "@/hooks/usePageList"
import { NoticeStatus } from "@/pinia/notice"
import { openURL } from "@/utils/func"
import { httpRequest } from "@/utils/http"
import { onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"

const storeNotice = NoticeStatus()
const { list, getList, loading, loadMore, refresh } = usePageList({ requestFunc })

onLoad((options) => {
  getList()
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

function requestFunc(params) {
  return httpRequest(GET_VCOURSE_LIST, "POST", { ...params, type: 0 }).then((res) => {
    res.data.result = res.data.result?.map((item) => {
      return {
        ...item,
        src: item.thumb,
        title: item.name,
        number: item.price
      }
    })
    return res
  })
}

function handleClick(item) {
  uni.navigateTo({
    url: "./detail?id=" + item.id
  })
}

function navigateBack() {
  uni.navigateBack()
}
</script>

<template>
  <uni-nav-bar
    :border="false"
    class="nav-bar"
    fixed
    left-icon="back"
    statusBar
    title="系统课"
    @clickLeft="navigateBack"
    @clickRight="openURL(storeNotice.onlineConsultation[0])"
  >
    <template v-slot:right>
      <image class="right-btn" src="/static/pdf/customer-service@2x.png" />
    </template>
  </uni-nav-bar>
  <view style="height: 16rpx"></view>
  <course-line-card-item
    v-for="item in list"
    :key="item.id"
    :item-data="item"
    displayMode="course"
    @click="handleClick(item)"
  />
  <load-tips :loading="loading" />
</template>

<style lang="scss" scoped>
.list-loading {
  font-size: 24rpx;
  font-weight: 500;
  line-height: 33.6rpx;
  text-align: center;
  color: rgba(153, 153, 153, 1);
}

.nav-bar {
  :deep(.uni-nav-bar-text) {
    font-size: 36rpx;
    font-weight: 500;
  }
}

.right-btn {
  width: 48rpx;
  height: 48rpx;
}
</style>
