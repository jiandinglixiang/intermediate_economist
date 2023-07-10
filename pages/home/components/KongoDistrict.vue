<script setup>
import { AppAuditStatus } from "@/pinia/audit"
import { pushBehavior } from "@/utils/behavior"

const storeAppAuditStatus = AppAuditStatus()

function navigateTo(url, title) {
  uni.navigateTo({ url })
  pushBehavior({
    action: "用户点击 icon\t318\t用户查看 {icon名称}\n",
    onceDay: true,
    replaceValue: title,
    isCallback: false
  })
}
</script>

<template>
  <view class="kongo-district">
    <view class="list-item" @click="navigateTo('/pages/video/videoList', '视频课')">
      <image src="/static/home/video-lesson@2x.png"></image>
      <text>视频课</text>
    </view>
    <view
      v-if="!storeAppAuditStatus.auditStatusBoolean"
      class="list-item"
      @click="navigateTo('/pages/live/liveList', '直播课')"
    >
      <image src="/static/home/live-lesson@2x.png"></image>
      <text>直播课</text>
    </view>
    <view class="list-item" @click="navigateTo('/pages/pdf/pdfList', '资料中心')">
      <image src="/static/home/informationCenter@2x.png"></image>
      <text>资料中心</text>
    </view>
    <!-- <view  v-if="!storeAppAuditStatus.auditStatusBoolean" class="list-item disable">
      <image src="/static/home/onlineMockTest@2x.png"></image>
      <text>模考大赛</text>
    </view> -->
    <view class="list-item" @click="navigateTo('/pages/information/informationList', '考试资讯')">
      <image src="/static/home/examConsultation@2x.png"></image>
      <text>考试资讯</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.kongo-district {
  display: flex;
  align-items: center;
  flex-flow: row wrap;
  justify-content: flex-start;
  height: 212rpx;
  margin: 0 32rpx;

  .list-item {
    display: flex;
    align-items: center;
    flex: 0 0 25%;
    flex-flow: column nowrap;
  }

  image {
    width: 80rpx;
    height: 80rpx;
    margin-bottom: 12rpx;
  }

  text {
    font-size: 24rpx;
    font-weight: 500;
    line-height: 24rpx;
    color: rgba(51, 51, 51, 1);
  }
}

.disable {
  filter: grayscale(100%);
}
</style>
