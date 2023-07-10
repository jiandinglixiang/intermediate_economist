<script setup>
import { POST_LIVE_SUBSCRIBE } from "@/api"
import { LOGIN_TIPS_POPUP } from "@/components/popup/popupKeyMap"
import { pushBehavior } from "@/utils/behavior"
import { NoticeStatus } from "@/pinia/notice"
import { PopupStatus } from "@/pinia/popup"
import { USER_TOKEN_DATA } from "@/utils/consts"
import { LIVE_STATUS_UPDATE } from "@/utils/event"
import { formatNumber, openURL } from "@/utils/func"
import { httpRequest } from "@/utils/http"
import dayjs from "dayjs"
import { computed, ref } from "vue"

const noLogin = !uni.getStorageSync(USER_TOKEN_DATA)?.token
const storeNotice = NoticeStatus()
const storePopup = PopupStatus()

const props = defineProps({
  itemData: {
    type: Object,
    default() {
      return {
        enable: 1,
        endtime: 0,
        id: 1,
        pic: "",
        playback_url: "",
        reservation: 0,
        starttime: 0,
        subscribe: 0,
        teacher_introduction: "",
        teacher_pic: "",
        teachername: "",
        title: "",
        watch: 0
      }
    }
  }
})
const enable = ref(props.itemData.enable)
const people = computed(() => formatNumber(props.itemData.reservation))

const date = computed(() => {
  const { starttime, endtime } = props.itemData
  return `${dayjs(starttime).format("M月D日 HH:mm")}-${dayjs(endtime).format("HH:mm")}`
})

const status = computed(() => {
  switch (enable.value) {
    case 4:
      return {
        btn: "回放资料",
        style: "watch-replay",
        style2: "watch-replay",
        handleClick() {
          openURL(storeNotice.miniApp.find((i) => i.id === 7))
          pushBehavior({
            action:
              "直播列表/详情页 回放资料/进入直播/预约直播按钮\t710\t用户查看 {直播名称} 后 领取回放资料",
            onceDay: true,
            replaceValue: props.itemData.title,
            isCallback: false
          })
        }
      }
    case 3:
      return {
        btn: "看直播",
        style2: "watching-live",
        style: "watching-live",
        handleClick() {
          openURL(storeNotice.miniApp.find((i) => i.id === 7))
          pushBehavior({
            action:
              "直播列表/详情页 回放资料/进入直播/预约直播按钮\t710\t用户查看 {直播名称} 后 进入直播间观看",
            onceDay: true,
            replaceValue: props.itemData.title,
            isCallback: false
          })
        }
      }
    case 2:
      return {
        btn: "已预约",
        style: "",
        style2: "reserved",
        handleClick: navigateTo
      }
    default:
      // 1
      return {
        btn: "预约",
        style: "",
        style2: "",
        async handleClick() {
          if (noLogin) {
            gotoLogin()
            return
          }
          await httpRequest(POST_LIVE_SUBSCRIBE, "POST", { liveid: props.itemData.id, type: 1 })
          uni.showToast({ title: "预约成功", icon: "none" })
          enable.value = 2
          uni.$emit(LIVE_STATUS_UPDATE, { id: props.itemData.id })
          pushBehavior({
            action:
              "直播列表/详情页 回放资料/进入直播/预约直播按钮\t710\t用户查看 {直播名称} 后 预约直播观看",
            onceDay: true,
            replaceValue: props.itemData.title,
            isCallback: false
          })
        }
      }
  }
})

function gotoLogin() {
  storePopup[LOGIN_TIPS_POPUP]?.open({
    title: "提示",
    tips: "直播预约功能需要您登录后，我们才可通知您开课信息",
    buttonText: "去登录",
    handleClick(action) {
      if (action === "btn") {
        uni.navigateTo({ url: "/pages/login/index" })
      }
    }
  })
}

function navigateTo() {
  uni.navigateTo({ url: "/pages/live/detail?id=" + props.itemData.id })
}
</script>

<template>
  <view class="live-card-item">
    <image :src="itemData.pic" class="live-img" @click="navigateTo" />
    <text class="name">{{ itemData.title }}</text>
    <text class="time">{{ date }}</text>
    <view :class="status.style" class="live-status">
      <!--直播中-->
    </view>
    <view class="bottom-box">
      <text class="people">{{ people }}</text>
      <view :class="status.style2" class="btn" @click="status.handleClick">
        <!--预约-->
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.live-card-item {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  height: 380rpx;
  margin-left: 32rpx;
  border-radius: 0rpx 0rpx 8rpx 8rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0rpx 4rpx 32rpx 0rpx rgba(0, 0, 0, 0.06);

  .live-img {
    flex: 0 0 auto;
    width: 312rpx;
    height: 176rpx;
    margin-bottom: 16rpx;
    border-radius: 8rpx 8rpx 0rpx 0rpx;
  }

  .name {
    font-size: 28rpx;
    font-weight: 500;
    line-height: 36rpx;
    display: -webkit-box;
    overflow: hidden;
    flex: 0 0 auto;
    max-height: 72rpx;
    margin: 0 16rpx 16rpx;
    text-align: justify;
    text-overflow: ellipsis;
    word-break: break-all;
    color: rgba(51, 51, 51, 1);
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .time {
    font-size: 24rpx;
    font-weight: 400;
    line-height: 24rpx;
    flex: 1 0 auto;
    margin: 0 16rpx 16rpx;
    color: rgba(153, 153, 153, 1);
  }

  .live-status {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    display: flex;
    overflow: hidden;
    align-items: center;
    flex-flow: column nowrap;
    justify-content: center;
    padding: 8rpx;
    border-radius: 8rpx 0rpx 16rpx 0rpx;
    background: linear-gradient(130.38deg, rgba(255, 186, 59, 1) 0%, rgba(255, 139, 23, 1) 100%);

    &:after {
      font-size: 20rpx;
      font-weight: 500;
      content: "未开始";
      color: rgba(255, 255, 255, 1);
      scale: 0.8;
    }

    &.watching-live {
      background: linear-gradient(139.19deg, rgba(49, 227, 179, 1) 0%, rgba(22, 195, 124, 1) 100%);

      &:after {
        content: "直播中";
      }
    }

    &.watch-replay {
      background: linear-gradient(135deg, rgba(202, 148, 255, 1) 0%, rgba(154, 91, 255, 1) 100%);

      &:after {
        content: "看回放";
      }
    }
  }

  .bottom-box {
    display: flex;
    align-items: center;
    align-self: flex-end;
    flex: 0 0 auto;
    flex-flow: row nowrap;
    justify-content: space-between;
    width: 100%;
  }

  .people {
    font-size: 24rpx;
    font-weight: 400;
    line-height: 24rpx;
    overflow: hidden;
    flex: 1 1 auto;
    height: 24rpx;
    margin-left: 16rpx;
    padding-left: 28rpx;
    color: rgba(153, 153, 153, 1);
    background: url("/static/home/numberOfPeople@2x.png") no-repeat left center;
    background-size: 20rpx 24rpx;
  }

  .btn {
    flex: 0 0 auto;
    width: 148rpx;
    height: 56rpx;
    text-align: center;
    border-radius: 16rpx 0rpx 8rpx 0rpx;
    background: linear-gradient(130.38deg, rgba(255, 186, 59, 1) 0%, rgba(255, 139, 23, 1) 100%);

    &:after {
      font-size: 24rpx;
      font-weight: 500;
      line-height: 56rpx;
      content: "立即预约";
      color: rgba(255, 255, 255, 1);
    }

    &.watching-live {
      background: linear-gradient(135deg, rgba(97, 139, 255, 1) 0%, rgba(48, 93, 217, 1) 100%);

      &:after {
        content: "去上课";
      }
    }

    &.reserved {
      opacity: 0.4;
      background: linear-gradient(130.38deg, rgba(255, 186, 59, 1) 0%, rgba(255, 139, 23, 1) 40%);

      &:after {
        content: "已预约";
      }
    }

    &.watch-replay {
      background: linear-gradient(135deg, rgba(97, 139, 255, 1) 0%, rgba(48, 93, 217, 1) 100%);

      &:after {
        content: "回放资料";
      }
    }
  }
}
</style>
