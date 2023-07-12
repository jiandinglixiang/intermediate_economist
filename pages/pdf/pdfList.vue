<script setup>
import { POST_LIST_NOTICE, POST_LIST_OF_MATERIALS } from "@/api"
import FixedFab from "@/components/fab/FixedFab.vue"
import NoticeBar from "@/components/notice-bar/NoticeBar.vue"
import LoadTips from "@/components/tips/load-tips.vue"
import { usePageList } from "@/hooks/usePageList"
import { pushBehavior } from "@/utils/behavior"
import { NoticeStatus } from "@/pinia/notice"
import { formatNumber, openURL } from "@/utils/func"
import { httpRequest } from "@/utils/http"
import { onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
import { computed, ref } from "vue"

const storeNotice = NoticeStatus()
const { list, getList, loading, loadMore, refresh } = usePageList({ requestFunc })
const noticeData = ref([])
const noticeList = computed(() => {
  const pdf = list.value
  return noticeData.value.map(({ nickname }, index) => {
    return {
      title: `用户 ${nickname} 下载了 ${pdf[index]?.name || "《考试必背概念》"}`
    }
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
  return httpRequest(POST_LIST_OF_MATERIALS, "POST", { page, rows })
}

function star(star, num) {
  star = +star
  return star >= num ? "star-filled" : star === num - 0.5 ? "starhalf" : "star"
}

function iconUrl(url) {
  return `/static/pdf/${url.toUpperCase().slice(-3)}@2x.png`
}

function tagList(tag) {
  return tag?.split?.(",") ?? []
}

function navigateBack() {
  uni.navigateBack()
}

const buryThePoint = pushBehavior({
  action: "资料大礼包&一键领取\t311\t用户索取复习相应资料\n",
  onceDay: true,
  replaceValue: "",
  isCallback: true
})

function handleDownload(item) {
  const link = `https://stark.pxo.cn/pdfjs-3.0.279-dist/web/viewer.html?file=${encodeURI(
    item.uploadResource
  )}`
  uni.navigateTo({
    url: `/pages/webview/index?noDecodeLinkQuery=1&title=${encodeURIComponent(
      item.name
    )}&link=${encodeURIComponent(link)}`,
    success(){
      pushBehavior({
        action: "资料列表 点击 资料&下载&打开\t311\t用户查看领取 {资料名称}\n",
        onceDay: true,
        replaceValue: item.name,
        isCallback: false
      })
    }
  })
}
</script>

<template>
  <uni-nav-bar
    :border="false"
    class="nav-bar"
    fixed
    left-icon="back"
    statusBar
    title="资料列表"
    @clickLeft="navigateBack"
    @clickRight="openURL(storeNotice.onlineConsultation[0])"
  >
    <template v-slot:right>
      <image class="right-btn" src="/static/pdf/customer-service@2x.png" />
    </template>
  </uni-nav-bar>
  <view class="fixed-box">
    <notice-bar :list="noticeList" fixed />
  </view>
  <view v-for="item in list" :key="item.id" class="pdf-list-item" @click="handleDownload(item)">
    <view class="box-top">
      <image :src="iconUrl(item.uploadResource)" class="file-icon" />
      <view class="middle-box">
        <text class="file-name">{{ item.name }}</text>
        <text v-for="item2 in tagList(item.tag)" class="keyword">{{ item2 }}</text>
      </view>
      <view class="download">下载</view>
    </view>
    <view class="box-below">
      <view class="star">
        <uni-icons
          v-for="num in 5"
          :type="star(item.star, num)"
          class="staff"
          color="#FFC800"
          size="12"
        ></uni-icons>
        <!--        <uni-icons class="staff" color="#FFC800" type="star-filled" size="12"></uni-icons>-->
        <!--        <uni-icons class="staff" color="#FFC800" type="starhalf" size="12"></uni-icons>-->
        <!--        <uni-icons class="staff" color="#FFC800" type="star" size="12"></uni-icons>-->
        <!--        <uni-icons class="staff" color="#FFC800" type="star" size="12"></uni-icons>-->
        <text class="staff">{{ item.star }}</text>
      </view>
      <text class="info">点击量:{{ formatNumber(item.receiveNum) }}</text>
      <text class="info">下载量:{{ formatNumber(item.viewsNum) }}</text>
      <text class="info">{{ item.updateDate }}</text>
    </view>
  </view>
  <load-tips :loading="loading" />
  <fixed-fab
    type="information"
    @handleClick="openURL(storeNotice.miniApp.find((i) => i.id === 4)), buryThePoint()"
  />
</template>

<style lang="scss" scoped>
.fixed-box {
  height: 116rpx;
}

.pdf-list-item {
  margin: 0 32rpx 16rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.08);

  .box-top {
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
    margin: 0 16rpx;
    padding: 16rpx 0;
    border-bottom: 2rpx solid rgba(238, 238, 238, 1);
  }

  .file-icon {
    flex: 0 0 auto;
    width: 84rpx;
    height: 84rpx;
    margin-right: 16rpx;
  }

  .middle-box {
    display: flex;
    flex: 1 1 auto;
    flex-flow: row wrap;
    margin-right: 16rpx;
  }

  .file-name {
    font-size: 28rpx;
    font-weight: 400;
    line-height: 28rpx;
    flex: 1 1 auto;
    width: 100%;
    margin-bottom: 12rpx;
    color: rgba(51, 51, 51, 1);
  }

  .keyword {
    font-size: 24rpx;
    font-weight: 400;
    line-height: 24rpx;
    flex: 0 0 auto;
    margin: 0 8rpx 8rpx 0;
    padding: 6rpx 12rpx 6rpx 12rpx;
    color: rgba(48, 93, 218, 1);
    border-radius: 8rpx;
    background: rgba(48, 93, 218, 0.1);
  }

  .download {
    font-size: 24rpx;
    font-weight: 700;
    line-height: 56rpx;
    flex: 0 0 auto;
    width: 100rpx;
    height: 56rpx;
    margin: 0;
    text-align: center;
    color: rgba(255, 255, 255, 1);
    border-radius: 446rpx 430rpx 446rpx 430rpx;
    background: linear-gradient(135deg, rgba(97, 139, 255, 1) 0%, rgba(48, 93, 217, 1) 100%);
  }

  .box-below {
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
    justify-content: flex-end;
    padding: 16rpx;
  }

  .star {
    font-size: 20rpx;
    font-weight: 400;
    line-height: 24rpx;
    display: flex;
    align-items: center;
    align-self: flex-start;
    flex: 1 1 auto;
    flex-flow: row nowrap;
    color: rgba(227, 178, 0, 1);

    .staff {
      margin-right: 4rpx;
    }
  }

  .info {
    font-size: 20rpx;
    font-weight: 400;
    line-height: 24rpx;
    flex: 0 0 auto;
    margin-left: 16rpx;
    color: rgba(153, 153, 153, 1);
  }
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
