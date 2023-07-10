<script setup>
import { POST_VCOURSE_DETATILS } from "@/api"
import FixedFab from "@/components/fab/FixedFab.vue"
import { pushBehavior } from "@/utils/behavior"
import { NoticeStatus } from "@/pinia/notice"
import { openURL } from "@/utils/func"
import { httpRequest } from "@/utils/http"
import { onLoad } from "@dcloudio/uni-app"
import { computed, nextTick, ref } from "vue"

const storeNotice = NoticeStatus()
const detail = ref({
  id: -1,
  name: "",
  thumb: "",
  price: "",
  vcourseId: "",
  crowd: "",
  desc: "",
  specialService: "",
  cycle: "0",
  content: "",
  isorder: 0
})

onLoad(async (options) => {
  const res = await httpRequest(POST_VCOURSE_DETATILS, "POST", { id: options.id })
  detail.value = res.data
  nextTick(() => {
    uni.setNavigationBarTitle({ title: detail.value.name })
  })
  pushBehavior({
    action: "点击封面图\t310\t用户查看课程 {课程名称}\n",
    onceDay: true,
    replaceValue: detail.value.name,
    isCallback: false
  })
})
const buryThePoint1 = pushBehavior({
  action: "详情页 领取资料\t311\t用户领取 {课程名称} 相应资料\n",
  onceDay: true,
  isCallback: true
})
const buryThePoint2 = pushBehavior({
  action: "详情页 点击  添加学管 按钮\t710\t用户添加 {课程名称} 学管老师\n",
  onceDay: true,
  isCallback: true
})
const buryThePoint3 = pushBehavior({
  action: "详情页 点击立即报名\t710\t用户下单了解  {课程名称}\n",
  onceDay: true,
  isCallback: true
})
const content = computed(() => detail.value.content)
</script>

<template>
  <view>
    <fixed-fab @handleClick="openURL(storeNotice.miniApp.find((i) => i.id === 4))" />
    <image :src="detail.thumb" class="course-img" />
    <view class="course-price">
      <text class="price">
        <text class="rmb">¥</text>
        <text>{{ detail.price }}</text>
      </text>
      <text class="date-text">有效期：</text>
      <text class="date">购课之日起</text>
    </view>
    <view
      class="receive-information-card"
      @click="openURL(storeNotice.miniApp.find((i) => i.id === 7)), buryThePoint1(detail.name)"
    >
      <text class="name">{{ detail.name }}</text>
      <view class="box-below">
        <text class="highlight">领取资料</text>
        <text>点击添加学管领取课程资料</text>
      </view>
    </view>
    <view class="detailed-catalog">
      <text class="highlight">课程详情</text>
    </view>
    <view class="rich-text-box">
      <uv-parse :content="content"></uv-parse>
    </view>
    <view class="fixed-bottom">
      <view class="fixed-bottom-content">
        <view
          class="teacher"
          @click="openURL(storeNotice.miniApp.find((i) => i.id === 8)), buryThePoint2(detail.name)"
        >
          <image src="/static/course/icon_banjiqun@2x.png"></image>
          <text>学管老师</text>
        </view>
        <view
          class="btn btn-done"
          @click="openURL(storeNotice.miniApp.find((i) => i.id === 7)), buryThePoint3(detail.name)"
        >
          立即报名
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.fixed-bottom {
  height: 98rpx;
}

.fixed-bottom-content {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  justify-content: space-between;
  height: 98rpx;
  padding: 0 24rpx;
  background: #ffffff;

  .teacher {
    font-size: 28rpx;
    font-weight: 500;
    line-height: 44rpx;
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    flex-flow: row nowrap;
    justify-content: center;
    width: 326rpx;
    color: rgba(51, 51, 51, 1);

    image {
      width: 44rpx;
      height: 44rpx;
      margin-right: 10rpx;
    }
  }

  .btn {
    font-size: 28rpx;
    font-weight: 700;
    line-height: 76rpx;
    flex: 0 0 auto;
    width: 368rpx;
    height: 76rpx;
    text-align: center;
    color: rgba(255, 255, 255, 1);
    border-radius: 200rpx;
    background: linear-gradient(135deg, rgba(97, 139, 255, 1) 0%, rgba(48, 93, 217, 1) 100%);
  }

  .btn-done {
    color: rgba(48, 93, 218, 1);
    border: 2rpx solid rgba(48, 93, 218, 1);
    background: #ffffff;
  }
}

.rich-text-box {
  display: flex;
  width: 686rpx;
  margin: 0 32rpx 32rpx;

  * {
    max-width: 686rpx;
  }
}

.course-img {
  width: 750rpx;
  height: 412rpx;
}

.sub-name {
  font-size: 24rpx;
  font-weight: 400;
  line-height: 24rpx;
  margin-bottom: 20rpx;
  text-align: center;
  color: rgba(153, 153, 153, 1);
}

.course-price {
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  height: 104rpx;
  padding: 0 32rpx;
  border-radius: 0rpx 0rpx 16rpx 16rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.08);

  .rmb {
    font-size: 32rpx;
  }

  .price {
    font-size: 48rpx;
    font-weight: 700;
    line-height: 48rpx;
    flex: 1 1 auto;
    color: rgba(235, 61, 61, 1);
  }

  .date-text {
    font-size: 24rpx;
    font-weight: 400;
    line-height: 24rpx;
    flex: 0 0 auto;
    margin-right: 8rpx;
    color: rgba(153, 153, 153, 1);
  }

  .date {
    font-size: 24rpx;
    font-weight: 400;
    line-height: 24rpx;
    flex: 0 0 auto;
    color: rgba(235, 61, 61, 1);
  }
}

.receive-information-card {
  display: flex;
  flex-flow: column nowrap;
  margin: 32rpx;
  padding: 32rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.08);

  .box-below {
    font-size: 24rpx;
    font-weight: 400;
    line-height: 24rpx;
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
    color: rgba(51, 51, 51, 1);
    background: url("/static/home/arrow@2x.png") no-repeat right center;
    background-size: 14rpx 20rpx;
  }

  .name {
    font-size: 32rpx;
    font-weight: 700;
    line-height: 32rpx;
    margin-bottom: 32rpx;
    color: rgba(51, 51, 51, 1);
  }

  .highlight {
    margin-right: 12rpx;
    padding: 6rpx 8rpx;
    color: rgba(48, 93, 218, 1);
    border-radius: 4rpx;
    background: rgba(48, 93, 218, 0.1);
  }
}

.detailed-catalog {
  font-size: 28rpx;
  font-weight: 700;
  line-height: 28rpx;
  display: flex;
  align-items: flex-start;
  flex-flow: row nowrap;
  margin: 0 32rpx 32rpx;
  color: rgba(153, 153, 153, 1);

  text {
    position: relative;
    height: 42rpx;
    margin-right: 32rpx;
  }

  .highlight {
    color: rgba(51, 51, 51, 1);

    &:after {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 32rpx;
      height: 6rpx;
      content: "";
      transform: translateX(-50%);
      border-radius: 4rpx;
      background: rgba(48, 93, 218, 1);
    }
  }
}

.collapse-item {
  overflow: hidden;
  margin: 0 32rpx 16rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.07);

  :deep(.uni-collapse-item__wrap-content) {
    padding-bottom: 24rpx;
  }

  :deep(.uni-collapse-item__title-text) {
    font-size: 32rpx;
    font-weight: 700;
    color: rgba(51, 51, 51, 1);
  }

  :deep(.uni-collapse-item__title-arrow) {
    background: url("/static/home/arrow@2x.png") no-repeat center center;

    background-size: 14rpx 20rpx;

    uni-text {
      display: none;
    }

    &.uni-collapse-item__title-arrow-active {
      transform: rotate(90deg);
    }
  }
}

.collapse-content-item {
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  box-sizing: border-box;
  height: 120rpx;
  margin: 0 32rpx;
  padding: 24rpx 0;

  &.bottom-border {
    border-bottom: 4rpx solid rgba(238, 238, 238, 1);
  }

  .box-left {
    display: flex;
    flex: 1 1 auto;
    flex-flow: row wrap;
  }

  .playing {
    display: inline-block;
    width: 20rpx;
    height: 24rpx;
    margin-right: 8rpx;
  }

  .name {
    font-size: 28rpx;
    font-weight: 400;
    line-height: 28rpx;
    flex: 1 1 auto;
    margin-bottom: 16rpx;
    color: rgba(51, 51, 51, 1);
  }

  .highlight {
    color: rgba(48, 93, 218, 1);
  }

  .time-people {
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
  }

  .time {
    flex: 0 0 auto;
    width: 28rpx;
    height: 28rpx;
    margin-right: 8rpx;
  }

  .time-text,
  people-text {
    flex: 0 0 auto;
    margin-right: 18rpx;
    vertical-align: bottom;
  }

  .people {
    flex: 0 0 auto;
    width: 20rpx;
    height: 24rpx;
    margin-right: 8rpx;
  }

  .box-right {
    font-size: 24rpx;
    font-weight: 400;
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    flex-flow: row nowrap;
    height: 40rpx;
    padding-left: 48rpx;
    color: rgba(255, 139, 23, 1);
    background: url("/static/course/play-with-learning@2x.png") no-repeat left center;
    background-size: 40rpx 40rpx;

    &:after {
      content: "待学习";
    }

    &.status-end {
      color: rgba(204, 204, 204, 1);
      background-image: url("/static/course/video-play3.png");

      &:after {
        content: "已学完";
      }
    }

    &.status-ing {
      color: rgba(48, 93, 218, 1);
      background-image: url("/static/course/video-play@2x.png");

      &:after {
        content: "学习中";
      }
    }
  }
}
</style>
