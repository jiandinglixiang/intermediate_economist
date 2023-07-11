<script setup>
const emits = defineEmits(["action"])
</script>
<template>
  <view class="home-ad-popup">
    <text class="title">解锁学习资源礼包</text>
    <view class="tips">
      <text>真题模拟系统</text>
      <image class="yes-icon" src="/static/home/yes.png"></image>
    </view>
    <view class="tips">
      <text>通关资料</text>
      <image class="yes-icon" src="/static/home/yes.png"></image>
    </view>
    <view class="tips">
      <text>教辅教材图书</text>
      <image class="yes-icon" src="/static/home/yes.png"></image>
    </view>
    <view class="tips">
      <text>考试报名</text>
      <image class="yes-icon" src="/static/home/yes.png"></image>
    </view>
    <button class="agree" @click="emits('action', 'btn')">立即查看</button>
    <image class="close" src="/static/close@2x.png" @click="emits('action', 'close')"></image>
    <image class="head-bg" src="/static/home/popup-head.png"></image>
  </view>
</template>

<style lang="scss" scoped>
.home-ad-popup {
  position: relative;
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  width: 536rpx;
  padding: 134rpx 56rpx 48rpx;
  border-radius: 32rpx;
  background: #ffffff;
}

.title {
  font-size: 36rpx;
  font-weight: 500;
  line-height: 50.4rpx;
  margin-bottom: 32rpx;
  color: rgba(51, 51, 51, 1);
}

.tips {
  font-size: 32rpx;
  font-weight: 400;
  line-height: 44.8rpx;
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  width: 50%;
  margin-bottom: 24rpx;
  letter-spacing: 0rpx;
  color: rgba(51, 51, 51, 1);
  .yes-icon {
    width: 48rpx;
    height: 36rpx;
    margin-left: 8rpx;
  }
}

.agree {
  font-size: 32rpx;
  font-weight: 700;
  line-height: 88rpx;
  width: 536rpx;
  height: 88rpx;
  margin-top: 64rpx;
  color: #ffffff;
  border: none;
  border-radius: 200rpx;
  background: linear-gradient(135deg, #945eff 0%, #5200f5 100%);
}

.close {
  position: absolute;
  bottom: -128rpx;
  width: 64rpx;
  height: 64rpx;
}

.head-bg {
  position: absolute;
  top: -106rpx;
  width: 285rpx;
  height: 210rpx;
}
</style>
