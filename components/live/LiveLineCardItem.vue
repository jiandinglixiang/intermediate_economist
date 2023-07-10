<script setup>
import { POST_LIVE_SUBSCRIBE } from "@/api"
import { LOGIN_TIPS_POPUP } from "@/components/popup/popupKeyMap"
import { pushBehavior } from "@/utils/behavior"
import { NoticeStatus } from "@/pinia/notice"
import { PopupStatus } from "@/pinia/popup"
import { USER_TOKEN_DATA } from "@/utils/consts"
import { LIVE_STATUS_UPDATE } from "@/utils/event"
import { openURL } from "@/utils/func"
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
        style2: "",
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
        style: "watching-live",
        style2: "living",
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
        btn: "领取讲义",
        style: "reserved",
        style2: "",
        handleClick() {
          openURL(storeNotice.miniApp.find((i) => i.id === 7))
          pushBehavior({
            action: "直播列表/详情页 领取直播讲义\t710\t用户领取 {直播名称} 相关资料\n",
            onceDay: true,
            replaceValue: props.itemData.title,
            isCallback: false
          })
        }
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
  <view class="live-line-card-item" @click="navigateTo">
    <image :src="itemData.pic" class="live-img" />
    <view class="right-content">
      <text class="name">
        {{ itemData.title }}
      </text>
      <view class="bottom-time">{{ date }}</view>
    </view>
    <view :class="status.style" class="live-status">
      <!--已预约-->
    </view>
    <view :class="status.style2" class="receive-handouts" @click.stop="status.handleClick">
      {{ status.btn }}
    </view>
  </view>
</template>

<style lang="scss" scoped>
.live-line-card-item {
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  margin: 0 32rpx 32rpx;
  padding: 16rpx 0 16rpx 16rpx;
  border-radius: 8rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.06);

  .live-img {
    flex: 0 0 auto;
    width: 254rpx;
    height: 140rpx;
    margin-right: 20rpx;
    border-radius: 4rpx;
  }

  .right-content {
    display: flex;
    align-items: flex-end;
    flex: 1 1 auto;
    flex-flow: column nowrap;
    justify-content: space-between;
    min-height: 140rpx;
    margin-right: 20rpx;
  }

  .name {
    font-size: 28rpx;
    font-weight: 400;
    line-height: 36rpx;
    display: -webkit-box;
    overflow: hidden;
    width: 100%;
    max-height: 72rpx;
    text-align: left;
    text-overflow: ellipsis;
    word-break: break-all;
    color: rgba(51, 51, 51, 1);
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .bottom-time {
    font-size: 24rpx;
    font-weight: 400;
    line-height: 32rpx;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    padding-right: 128rpx;
    color: rgba(48, 93, 218, 1);
  }
}

.receive-handouts {
  font-size: 24rpx;
  font-weight: 700;
  line-height: 60rpx;
  position: absolute;
  right: 0;
  bottom: 0;
  width: 128rpx;
  height: 60rpx;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  border-radius: 8rpx 0rpx 8rpx 0rpx;
  background: linear-gradient(135deg, rgba(97, 139, 255, 1) 0%, rgba(48, 93, 217, 1) 100%);

  &.living:before {
    display: inline-block;
    width: 20rpx;
    height: 20rpx;
    margin-right: 4rpx;
    content: "";
    background: url("/static/live/btniconliving.png") no-repeat left center;
    background-size: 100% auto;
  }
}

.live-status {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  justify-content: center;
  padding: 4rpx;
  border-radius: 8rpx 0rpx 8rpx 0rpx;
  background: rgba(255, 243, 230, 1);

  &:after {
    font-size: 24rpx;
    font-weight: 700;
    content: "待开始";
    vertical-align: top;
    color: rgba(255, 142, 13, 1);
    scale: 0.75;
  }

  &.watching-live {
    background: rgba(231, 241, 255, 1);

    &:after {
      content: "直播中";
      color: rgba(15, 115, 255, 1);
    }
  }

  &.reserved {
    background: rgba(237, 237, 237, 1);

    &:after {
      content: "已预约";
      color: rgba(138, 138, 138, 1);
    }
  }

  &.watch-replay {
    background: rgba(230, 247, 237, 1);

    &:after {
      content: "回放中";
      color: rgba(9, 179, 77, 1);
    }
  }
}
</style>
