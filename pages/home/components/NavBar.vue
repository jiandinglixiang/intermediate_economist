<script setup>
import { pushBehavior } from "@/utils/behavior"
import { NoticeStatus } from "@/pinia/notice"
import { openURL } from "@/utils/func"

const storeNotice = NoticeStatus()
const buryThePoint = pushBehavior({
  action: "点击 小程序加好友 按钮\t710\t用户添加助教\n",
  replaceValue: "",
  onceDay: true,
  isCallback: true
})
const buryThePoint2 = pushBehavior({
  action: "点击  在线咨询 按钮\t710\t用户在线咨询经济师考试信息\n",
  replaceValue: "",
  onceDay: false,
  isCallback: true
})
</script>

<template>
  <view class="nav-bar nav-bar-fixed">
    <!--    <image class="handoff" src="/static/home/handoff@2x.png"></image>-->
    <text>中级经济师</text>
    <image
      class="weixin"
      src="/static/home/weixin@2x.png"
      @click="openURL(storeNotice.miniApp.find((i) => i.id === 4)), buryThePoint()"
    ></image>
    <image
      class="weixin"
      src="/static/home/customer@2x.png"
      @click="openURL(storeNotice.onlineConsultation[0]), buryThePoint2()"
    ></image>
  </view>
  <view class="nav-bar" />
</template>

<style lang="scss" scoped>
.nav-bar {
  z-index: 100;
  height: 88rpx;
  margin-bottom: 12rpx;
  padding-top: var(--status-bar-height);
  background: #ffffff;
}

.nav-bar-fixed {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  padding-right: 32rpx;
  padding-left: 32rpx;
  background: rgba(255, 255, 255, 1);

  .handoff {
    flex: 0 0 auto;

    width: 56rpx;
    height: 56rpx;
    margin-right: 8rpx;
  }

  .weixin {
    flex: 0 0 auto;
    width: 48rpx;
    height: 48rpx;
    margin-left: 24rpx;
  }

  text {
    font-size: 36rpx;
    font-weight: 700;
    flex: 1 1 auto;
    color: rgba(51, 51, 51, 1);
  }
}
</style>
