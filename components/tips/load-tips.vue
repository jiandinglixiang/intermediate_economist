<script setup>
import { LOADING_TEXT } from "@/utils/consts"

const props = defineProps({
  loading: String
})
const hasImage = ["nodata", "loaderror", "networkerror"]
</script>

<template>
  <view :class="!hasImage.includes(loading) && 'list-loading'" class="tip-container">
    <image v-if="loading === 'nodata'" class="tip-img" src="/static/no-data.png"></image>
    <image v-else-if="loading === 'loaderror'" class="tip-img" src="/static/load-error.png"></image>
    <image
      v-else-if="loading === 'networkerror'"
      class="tip-img"
      src="/static/network-error.png"
    ></image>
    <text class="tip-text">{{ LOADING_TEXT[loading] }}</text>
  </view>
</template>

<style lang="scss" scoped>
.tip-container {
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  padding: 80rpx 0;
}

.tip-img {
  width: 400rpx;
  height: 300rpx;
  margin-bottom: 32rpx;
}

.tip-text {
  font-size: 28rpx;
  font-weight: 500;
  line-height: 28rpx;
  text-align: center;
  color: rgba(0, 0, 0, 1);
}

.list-loading {
  padding: 0;

  .tip-text {
    font-size: 24rpx;
    color: rgba(153, 153, 153, 1);
  }
}
</style>
