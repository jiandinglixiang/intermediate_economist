<script setup>
import { GET_ARTICLE_LIST, POST_ARTICLE_TYPE } from "@/api"
import InformationItem from "@/components/information/InformationItem.vue"
import LoadTips from "@/components/tips/load-tips.vue"
import { usePageList } from "@/hooks/usePageList"
import { NoticeStatus } from "@/pinia/notice"
import { openURL } from "@/utils/func"
import { httpRequest } from "@/utils/http"
import { onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"

const storeNotice = NoticeStatus()

let targetType
const { list, getList, loading, loadMore, refresh } = usePageList({ requestFunc })

onLoad(async () => {
  const res = await httpRequest(POST_ARTICLE_TYPE, "POST")
  targetType = res.data.find((item) => item.id === 12)
  targetType && getList()
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

function requestFunc({ page, rows: pageSize }) {
  return httpRequest(
    GET_ARTICLE_LIST,
    "GET",
    {
      page,
      pageSize,
      typeid: targetType.typeid
    },
    {
      baseUrl: "https://apigateway.pxo.cn",
      header: {
        g: targetType.domain
      }
    }
  ).then((res) => {
    return { ...res, data: { result: res.data } }
  })
}

function navigateBack() {
  uni.navigateBack()
}

function gotoDetail(item) {
  uni.navigateTo({
    url: `/pages/information/detail?id=${item.id}&domain=${decodeURIComponent(targetType.domain)}`
  })
}
</script>

<template>
  <uni-nav-bar
    :border="false"
    class="nav-bar"
    fixed
    left-icon="back"
    right-width="164rpx"
    statusBar
    title="考试资讯"
    @clickLeft="navigateBack"
    @clickRight="openURL(storeNotice.onlineConsultation[0])"
  >
    <template v-slot:right>
      <view class="right-btn">在线考友</view>
    </template>
  </uni-nav-bar>
  <view style="height: 16rpx" />
  <information-item
    v-for="(item, index) in list"
    :key="item.id"
    :item-data="item"
    :under-line="list.length - 1 !== index"
    @click="gotoDetail(item)"
  />
  <load-tips :loading="loading" />
</template>

<style lang="scss" scoped>
.nav-bar {
  :deep(.uni-nav-bar-text) {
    font-size: 36rpx;
    font-weight: 500;
  }
}

.right-btn {
  font-size: 24rpx;
  font-weight: 500;
  line-height: 56rpx;
  box-sizing: border-box;
  width: 164rpx;
  height: 56rpx;
  padding-left: 52rpx;
  color: rgba(48, 93, 218, 1);
  border: 1rpx solid rgba(48, 93, 218, 1);
  border-radius: 200rpx;
  background: url("/static/information/test-friend@2x.png") rgba(48, 93, 218, 0.08) no-repeat 16rpx
    center;
  background-size: 32rpx 32rpx;
}
</style>
