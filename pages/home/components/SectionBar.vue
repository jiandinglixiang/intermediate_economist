<script setup>
const props = defineProps({
  leftText: String,
  navUrl: String
})

function navigateTo() {
  uni.navigateTo({ url: props.navUrl })
}
</script>

<template>
  <view class="section-bar">
    <text class="title">{{ props.leftText }}</text>
    <text class="more" @click="navigateTo">更多</text>
  </view>
</template>

<style lang="scss" scoped>
.section-bar {
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  margin: 0 32rpx 32rpx;

  .title {
    font-size: 36rpx;
    font-weight: 500;
    line-height: 36rpx;
    flex: 1 1 auto;
    color: rgba(51, 51, 51, 1);
  }

  .more {
    font-size: 28rpx;
    font-weight: 400;
    line-height: 28rpx;
    flex: 0 0 auto;
    padding-right: 22rpx;
    color: rgba(153, 153, 153, 1);
    background: url("/static/home/arrow@2x.png") no-repeat right center;
    background-size: 14rpx 20rpx;
  }
}
</style>
