<script setup>
const props = defineProps({
  txtList: {
    type: Object,
    default() {
      return []
    }
  }
})
</script>

<template>
  <view class="carousel">
    <view
      class="item"
      v-for="(delay, index) in [-1, 0, 1, 2, -2]"
      :style="`animation-delay:${3 * delay}s;`"
    >
      用户***下载了{{ txtList[index]?.name }}
    </view>
  </view>
</template>

<style scoped lang="scss">
.carousel {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  justify-content: flex-start;
  .item {
    position: absolute;
    bottom: calc(var(--window-bottom) + 100rpx);
    left: 0;
    box-sizing: border-box;
    font-size: 20rpx;
    font-weight: 400;
    line-height: 52rpx;
    color: rgba(255, 255, 255, 1);
    text-align: left;
    width: 350rpx;
    padding: 0 16rpx;
    height: 52rpx;
    border-radius: 0 32rpx 32rpx 0;
    background: rgba(0, 0, 0, 0.8);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    animation: animate 15s linear infinite;
    opacity: 0;
  }
}

@keyframes animate {
  0% {
    opacity: 0;
    width: 300rpx;
    transform: translateY(120%);
    content: "123";
    display: block;
  }

  5%,
  20% {
    width: 300rpx;
    opacity: 1;
    background: rgba(0, 0, 0, 0.3);
    transform: translateY(120%);
  }

  25%,
  40% {
    width: 350rpx;
    opacity: 1;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  45%,
  60% {
    width: 300rpx;
    opacity: 1;
    background: rgba(0, 0, 0, 0.3);
    transform: translateY(-120%);
  }

  65%,
  100% {
    width: 300rpx;
    opacity: 0;
    transform: translateY(-120%);
  }
}
</style>
