<script setup>
import { formatNumber } from "@/utils/func"

const props = defineProps({
  displayMode: {
    type: String,
    default: "home" // video / course
  },
  itemData: {
    type: Object,
    default() {
      return {
        src: "",
        title: "",
        number: ""
      }
    }
  }
})

function navigateTo() {
  uni.navigateTo({ url: "/pages/course/courseList" })
}
</script>

<template>
  <view class="course-line-card-item">
    <image :src="itemData.src" class="course-img" />
    <view class="right-content">
      <text class="name">
        {{ itemData.title }}
      </text>
      <view class="bottom-box">
        <text v-if="displayMode !== 'home'" class="people">
          {{ formatNumber(itemData.number) }}已学习
        </text>
        <view v-else class="learn-now">立即学习</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.course-line-card-item {
  display: flex;
  flex-flow: row nowrap;
  margin: 0 32rpx 32rpx;

  .course-img {
    flex: 0 0 auto;
    width: 276rpx;
    height: 156rpx;
    margin-right: 16rpx;
    border-radius: 8rpx;
  }

  .right-content {
    display: flex;
    align-items: flex-end;
    flex: 1 1 auto;
    flex-flow: column nowrap;
    justify-content: space-between;
    min-height: 156rpx;
  }

  .name {
    font-size: 28rpx;
    font-weight: 400;
    line-height: 39.2rpx;
    display: -webkit-box;
    overflow: hidden;
    width: 100%;
    max-height: 80rpx;
    text-align: left;
    text-overflow: ellipsis;
    word-break: break-all;
    color: rgba(51, 51, 51, 1);
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .bottom-box {
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
  }

  .people {
    font-size: 24rpx;
    font-weight: 400;
    line-height: 24rpx;
    overflow: hidden;
    flex: 0 0 auto;
    height: 24rpx;
    margin-left: 16rpx;
    padding-left: 28rpx;
    color: rgba(153, 153, 153, 1);
    background: url("/static/home/numberOfPeople@2x.png") no-repeat left center;
    background-size: 20rpx 24rpx;
  }

  .learn-now {
    font-size: 24rpx;
    font-weight: 700;
    line-height: 56rpx;
    align-self: flex-end;
    flex: 0 0 auto;
    width: 136rpx;
    height: 56rpx;
    text-align: center;
    color: rgba(255, 255, 255, 1);
    border-radius: 446rpx 430rpx 446rpx 430rpx;
    background: linear-gradient(135deg, rgba(97, 139, 255, 1) 0%, rgba(48, 93, 217, 1) 100%);
  }
}
</style>
