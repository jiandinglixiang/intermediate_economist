<script setup>
import { pushBehavior } from "@/utils/behavior"
import { NoticeStatus } from "@/pinia/notice"
import { openURL } from "@/utils/func"
import dayjs from "dayjs"
import { onUnmounted, ref, watch } from "vue"

const storeNotice = NoticeStatus()
const current = ref({
  index: 0,
  name: "考试",
  value: "0"
})
let list = []
let time = 0
const stopWatch = watch(
  () => storeNotice.countDown,
  (countDown) => {
    list = countDown.map((item, index) => {
      return {
        ...item,
        index,
        value: dayjs(item.value * 1000)
          .diff(Date.now(), "day")
          .toString()
      }
    })
    if (!list.length) {
      return
    }
    interval()
    if (list.length === 1) {
      return
    }
    clearInterval(time)
    time = setInterval(interval, 2000)
  },
  {
    immediate: true
  }
)

function interval() {
  let index = current.value.index + 1
  if (index >= list.length) {
    index = 0
  }
  current.value = list[index]
}

const buryThePoint = pushBehavior({
  action: "首页-报考查询按钮&直播列表页-报考规划\t710\t用户查看CPA报考规划\n",
  onceDay: false,
  replaceValue: "",
  isCallback: true
})

onUnmounted(() => {
  clearInterval(time)
  stopWatch()
})
</script>

<template>
  <view class="countdown-bar">
    <view class="left-g">
      <text>距离下次</text>
      <text class="highlight">{{ current.name }}</text>
    </view>
    <view v-for="i in current.value" class="number">{{ i }}</view>
    <text class="days">DAYS</text>
    <button class="btn" @click="openURL(storeNotice.onlineConsultation[0]), buryThePoint()">
      报考规划
    </button>
  </view>
</template>

<style lang="scss" scoped>
.countdown-bar {
  display: flex;
  align-items: flex-end;
  flex-flow: row nowrap;
  justify-content: flex-start;
  box-sizing: border-box;
  height: 112rpx;
  margin: 0 32rpx 42rpx;
  padding: 24rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.06);

  .highlight {
    color: rgba(48, 93, 218, 1);
  }

  .left-g {
    font-size: 24rpx;
    font-weight: 700;
    line-height: 24rpx;
    display: flex;
    flex: 0 0 auto;
    flex-flow: column nowrap;
    justify-content: space-between;
    height: 100%;
    margin-right: 12rpx;
    color: rgba(51, 51, 51, 1);
  }

  .number {
    font-size: 36rpx;
    font-weight: 700;
    line-height: 44rpx;
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    flex-flow: row nowrap;
    justify-content: center;
    width: 40rpx;
    height: 64rpx;
    margin-right: 8rpx;
    color: rgba(255, 255, 255, 1);
    border-radius: 12rpx;
    background: url("/static/home/timeBg@2x.png") no-repeat left top;
    background-size: 100%;
  }

  .days {
    font-size: 24rpx;
    font-weight: 700;
    line-height: 24rpx;
    flex: 1 1 auto;
    padding-left: 4rpx;
    color: rgba(51, 51, 51, 1);
  }

  .btn {
    font-size: 24rpx;
    font-weight: 700;
    line-height: 64rpx;
    width: 160rpx;
    height: 64rpx;
    color: rgba(48, 93, 218, 1);
    border: 1rpx solid rgba(48, 93, 218, 1);
    border-radius: 200rpx;
    background: rgba(48, 93, 218, 0.08);
  }
}
</style>
