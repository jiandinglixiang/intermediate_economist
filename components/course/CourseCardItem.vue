<script setup>
const props = defineProps({
  itemData: {
    type: Object,
    default() {
      return {}
    }
  }
})
</script>

<template>
  <view class="course-card-item">
    <image :src="itemData.thumb" class="course-img" />
    <text class="name">
      {{ itemData.name }}
    </text>
    <view class="person-title">
      <text>名师直播</text>
      <text>极速答疑</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.course-card-item {
  flex: 0 0 auto;
  width: 330rpx;
  margin-bottom: 32rpx;

  .name {
    font-size: 24rpx;
    font-weight: 400;
    line-height: 33.6rpx;
    display: -webkit-box;
    overflow: hidden;
    height: 68rpx;
    margin-bottom: 12rpx;
    letter-spacing: 0rpx;
    text-overflow: ellipsis;
    word-break: break-all;
    color: rgba(51, 51, 51, 1);
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .person-title {
    display: flex;
    flex-flow: row wrap;

    text {
      font-size: 20rpx;
      font-weight: 400;
      line-height: 20rpx;
      flex: 0 0 auto;
      margin-right: 8rpx;
      padding: 8rpx 8rpx 8rpx 8rpx;
      color: rgba(48, 93, 218, 1);
      border-radius: 4rpx;
      background: rgba(48, 93, 218, 0.1);
    }
  }
}

.course-img {
  width: 330rpx;
  height: 188rpx;
  margin-bottom: 16rpx;
  border-radius: 8rpx;
}
</style>
