<script setup>
import dayjs from "dayjs"
import { computed } from "vue"

const props = defineProps({
  underLine: {
    type: Boolean,
    default: true
  },
  itemData: {
    type: Object,
    default() {
      return {}
    }
  }
})
const pubdate = computed(() => dayjs(props.itemData.pubdate).format("M月DD日"))
</script>

<template>
  <view :class="[underLine && 'under-line']" class="information-item">
    <view class="left-content">
      <text class="title">{{ itemData.title }}</text>
      <text class="time">{{ pubdate }}</text>
      <!--<text class="read">阅读7.5万</text>-->
    </view>
    <image v-if="itemData.litpic" :src="itemData.litpic" class="right-img" />
  </view>
</template>

<style lang="scss" scoped>
.information-item {
  display: flex;
  flex-flow: row nowrap;
  margin: 0 32rpx 32rpx;
}

.under-line {
  border-bottom: 2rpx solid rgba(238, 238, 238, 1);
}

.left-content {
  display: flex;
  align-items: flex-start;
  flex: 1 1 auto;
  flex-flow: row wrap;
  justify-content: flex-start;

  .title {
    font-size: 32rpx;
    font-weight: 500;
    line-height: 44rpx;
    display: -webkit-box;
    overflow: hidden;
    flex: 1 1 auto;
    width: 100%;
    max-height: 96rpx;
    margin-bottom: 28rpx;
    text-overflow: ellipsis;
    word-break: break-all;
    color: rgba(51, 51, 51, 1);
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .time,
  .read {
    font-size: 24rpx;
    font-weight: 400;
    line-height: 32rpx;
    flex: 0 0 auto;
    margin-right: 18rpx;
    margin-bottom: 32rpx;
    color: rgba(153, 153, 153, 1);
  }
}

.right-img {
  flex: 0 0 auto;
  width: 218rpx;
  height: 156rpx;
  margin-left: 16rpx;
  border-radius: 4rpx;
}
</style>
