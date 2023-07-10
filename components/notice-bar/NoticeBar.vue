<script setup>
const props = defineProps({
  fixed: Boolean,
  top: Number,
  list: Array,
  showDetail: Boolean,
  vertical: Boolean
})
const emits = defineEmits(["noticeClick"])
</script>

<template>
  <view :class="props.fixed && 'notice-fixed'">
    <view class="notice">
      <image class="trumpet" src="/static/home/notice@2x.png"></image>
      <view class="right-box">
        <view
          :class="['list', vertical && 'vertical']"
          :style="
            list.length > 1 && [
              `animation-duration: ${list.length * 2 * 3}s`,
              `animation-play-state: running`
            ]
          "
        >
          <view v-for="item in [...list, ...list]" class="item" @click="emits('noticeClick', item)">
            {{ item.title }}
            <text v-if="showDetail" class="highlight">了解详情</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.notice-fixed {
  position: fixed;
  z-index: 2;
  top: 0;
  right: 0;
  left: 0;
  height: 72rpx;
  padding-top: calc(var(--status-bar-height) + 44px + 12rpx);
  background: rgba(255, 255, 255, 1);
}

.notice {
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  height: 72rpx;
  margin: 0 32rpx;
  padding: 0 20rpx;
  border-radius: 36rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.08);

  .highlight {
    color: rgba(48, 93, 218, 1);
  }
}

.trumpet {
  flex: 0 0 auto;
  width: 32rpx;
  height: 32rpx;
  margin-right: 20rpx;
}

.right-box {
  font-size: 24rpx;
  font-weight: 400;
  position: relative;
  overflow: hidden;
  flex: 1 1 auto;
  height: 72rpx;
  color: rgba(51, 51, 51, 1);
}

.list {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  height: 72rpx;
  animation-name: rolling;
  animation-duration: 100s;
  animation-play-state: paused;
  animation-timing-function: linear;
  animation-iteration-count: infinite;

  .item {
    flex: 0 0 auto;
    min-width: 594rpx;
    padding-right: 20rpx;
    white-space: nowrap;
  }
}

.vertical {
  align-items: flex-start;
  flex-flow: column nowrap;
  height: auto;
  animation-name: rollingVertical;

  .item {
    line-height: 72rpx;
    flex: 0 0 auto;
    height: 72rpx;
    padding-right: 20rpx;
    white-space: nowrap;
  }
}

@keyframes rolling {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@keyframes rollingVertical {
  from {
    transform: translateY(0);
  }
  //45%{
  //  transform: translateY(-25%);
  //}
  //55%{
  //  transform: translateY(-25%);
  //}
  //90%{
  //  transform: translateY(-50%);
  //}
  to {
    transform: translateY(-50%);
  }
}
</style>
