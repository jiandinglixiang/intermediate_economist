<script setup>
import { POST_LIVE_DETATILS, POST_LIVE_SUBSCRIBE } from "@/api"
import PopupIndex from "@/components/popup/PopupIndex.vue"
import { LOGIN_TIPS_POPUP } from "@/components/popup/popupKeyMap"
import { pushBehavior } from "@/utils/behavior"
import { NoticeStatus } from "@/pinia/notice"
import { PopupStatus } from "@/pinia/popup"
import { USER_TOKEN_DATA } from "@/utils/consts"
import { LIVE_STATUS_UPDATE } from "@/utils/event"
import { openURL } from "@/utils/func"
import { httpRequest } from "@/utils/http"
import { onLoad } from "@dcloudio/uni-app"
import dayjs from "dayjs"
import { computed, ref } from "vue"

const noLogin = !uni.getStorageSync(USER_TOKEN_DATA)?.token

const storeNotice = NoticeStatus()
const storePopup = PopupStatus()

const detail = ref({
  id: -1,
  title: "",
  teachername: "",
  teacher_pic: "",
  teacher_introduction: "",
  pic: "",
  starttime: -1,
  endtime: -1,
  playback_url: "",
  classurl: "",
  reservation: -1,
  enable: -1,
  subscribe: -1,
  watch: -1
})

onLoad(async (options) => {
  const res = await httpRequest(POST_LIVE_DETATILS, "POST", { id: options.id })
  detail.value = res.data
  // detail.value.enable = 1
  pushBehavior({
    action: "直播列表 点击 直播名称\t710\t用户查看 {直播名称}\n",
    onceDay: false,
    replaceValue: detail.value.title,
    isCallback: false
  })
})

const date = computed(() => {
  const { starttime, endtime } = detail.value
  return `${dayjs(starttime).format("M月D日 HH:mm")}-${dayjs(endtime).format("HH:mm")}`
})
const content = computed(() => detail.value.classurl)

function transformDate(diff) {
  diff = dayjs(diff).diff(Date.now())
  console.log(diff)
  if (diff > 0) {
    // 计算剩余的天数、小时、分钟、秒数
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    return [days, hours, minutes, seconds]
  }
  return []
}

const buryThePoint2 = () => {
  pushBehavior({
    action: "直播列表/详情页 领取直播讲义\t710\t用户领取 {直播名称} 相关资料\n",
    onceDay: true,
    replaceValue: detail.value.title,
    isCallback: false
  })
}

const status = computed(() => {
  const { enable, starttime } = detail.value

  switch (enable) {
    case 4:
      return {
        topText: "直播已结束！",
        countdown: [],
        btnText: "领取回放资料",
        btnStyle: "btn-done",
        btnClick() {
          openURL(storeNotice.miniApp.find((i) => i.id === 7))
          pushBehavior({
            action:
              "直播列表/详情页 回放资料/进入直播/预约直播按钮\t710\t用户查看 {直播名称} 后 领取回放资料",
            onceDay: true,
            replaceValue: detail.value.title,
            isCallback: false
          })
        }
      }
    case 3:
      return {
        topText: "正在直播中",
        countdown: [],
        btnText: "看直播",
        btnStyle: "btn-done",
        btnClick() {
          openURL(storeNotice.miniApp.find((i) => i.id === 7))
          pushBehavior({
            action:
              "直播列表/详情页 回放资料/进入直播/预约直播按钮\t710\t用户查看 {直播名称} 后 进入直播间观看",
            onceDay: true,
            replaceValue: detail.value.title,
            isCallback: false
          })
        }
      }
    case 2:
      return {
        topText: "距直播开始还有",
        countdown: transformDate(starttime * 1000),
        btnText: "已预约 领取直播讲义",
        btnStyle: "btn-done",
        btnClick() {
          openURL(storeNotice.miniApp.find((i) => i.id === 7))
          buryThePoint2()
        }
      }
    default:
      // 1
      return {
        topText: "距直播开始还有",
        countdown: transformDate(starttime * 1000),
        btnText: "立即预约",
        async btnClick() {
          if (noLogin) {
            gotoLogin()
            return
          }
          await httpRequest(POST_LIVE_SUBSCRIBE, "POST", { liveid: detail.value.id, type: 1 })
          openLivePopup()
          detail.value.enable = 2
          uni.$emit(LIVE_STATUS_UPDATE, { id: detail.value.id })
          pushBehavior({
            action:
              "直播列表/详情页 回放资料/进入直播/预约直播按钮\t710\t用户查看 {直播名称} 后 预约直播观看",
            onceDay: true,
            replaceValue: detail.value.title,
            isCallback: false
          })
        }
      }
  }
})

function openLivePopup() {
  storePopup[LOGIN_TIPS_POPUP]?.open({
    title: "预约成功",
    tips: `已预约 <text style="color:#305DDA">${detail.value.title}</text> 直播，将于<text style="color:#305DDA">${date.value}</text>开始直播，请记得打开App观看，并添加老师领取讲义哦～`,
    buttonText: "领取直播讲义",
    handleClick(action) {
      if (action === "btn") {
        openURL(storeNotice.miniApp.find((i) => i.id === 7))
        buryThePoint2()
      }
    }
  })
}

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
</script>

<template>
  <view>
    <popup-index
      :ref="(r) => PopupStatus().setPopupRef(LOGIN_TIPS_POPUP, r)"
      :popup-key="LOGIN_TIPS_POPUP"
    />
    <view class="live-top">
      <image :src="detail.pic" class="ad-img" />
      <view class="content">
        <text class="distance">{{ status.topText }}</text>
        <uni-countdown
          v-if="status.countdown.length"
          :day="status.countdown[0]"
          :hour="status.countdown[1]"
          :minute="status.countdown[2]"
          :second="status.countdown[3]"
          :show-colon="false"
          background-color="#ffffff"
          class="countdown-time"
          color="#305DDA"
          splitor-color="#ffffff"
        />
        <view
          v-else-if="status.btnText === '领取回放资料'"
          class="receive-btn"
          @click="openURL(storeNotice.miniApp.find((i) => i.id === 7))"
        >
          领取回放资料
        </view>
      </view>
    </view>
    <view class="person-info">
      <text class="live-name">{{ detail.title }}</text>
      <image :src="detail.teacher_pic" class="avatar"></image>
      <view class="box-info">
        <text class="name">{{ detail.teachername }}</text>
        <view class="line-box">
          <text class="date">{{ date }}</text>
          <text class="booking">{{ detail.reservation }}人已预约</text>
        </view>
      </view>
    </view>
    <view class="line-title">老师简介</view>
    <view class="teacher-profile">
      {{ detail.teacher_introduction }}
    </view>
    <view class="line-title">课程详情</view>
    <view class="rich-text-box">
      <uv-parse :content="content"></uv-parse>
    </view>
    <view class="fixed-bottom">
      <view class="fixed-bottom-content">
        <view class="teacher" @click="openURL(storeNotice.miniApp.find((i) => i.id === 8))">
          <image src="/static/course/icon_banjiqun@2x.png"></image>
          <text>学管老师</text>
        </view>
        <view :class="status.btnStyle" class="btn" @click="status.btnClick">
          <!--立即预约-->
          {{ status.btnText }}
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.fixed-bottom {
  height: 98rpx;
}

.rich-text-box {
  display: flex;
  width: 686rpx;
  margin: 0 32rpx 48rpx;

  * {
    max-width: 100%;
    max-height: 100%;
  }
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

.line-title {
  font-size: 28rpx;
  font-weight: 700;
  line-height: 28rpx;
  margin-bottom: 16rpx;
  margin-left: 32rpx;
  color: rgba(51, 51, 51, 1);
}

.teacher-profile {
  font-size: 28rpx;
  font-weight: 400;
  line-height: 39.2rpx;
  margin: 0 32rpx 48rpx;
  color: rgba(102, 102, 102, 1);
}

.person-info {
  display: flex;
  flex-flow: row wrap;
  margin-bottom: 48rpx;
  padding: 32rpx;
  box-shadow: 0rpx 4rpx 32rpx 0rpx rgba(0, 0, 0, 0.06);

  .live-name {
    font-size: 32rpx;
    font-weight: 500;
    line-height: 48rpx;
    flex: 1 1 auto;
    width: 100%;
    margin-bottom: 32rpx;
    color: rgba(51, 51, 51, 1);
  }

  .avatar {
    overflow: hidden;
    flex: 0 0 auto;
    width: 64rpx;
    height: 64rpx;
    margin-right: 6rpx;
    border-radius: 50%;
  }

  .box-info {
    display: flex;
    flex: 1 1 auto;
    flex-flow: column nowrap;
    width: calc(100% - 70rpx);
  }

  .name {
    font-size: 28rpx;
    font-weight: 400;
    line-height: 28rpx;
    width: 100%;
    word-break: break-all;
    color: rgba(51, 51, 51, 1);
  }

  .line-box {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    flex-flow: row nowrap;
    justify-content: space-between;
    width: 100%;
  }

  .date {
    font-size: 24rpx;
    font-weight: 400;
    line-height: 24rpx;
    color: rgba(48, 93, 218, 1);
  }

  .booking {
    font-size: 28rpx;
    font-weight: 400;
    line-height: 28rpx;
    color: rgba(48, 93, 218, 1);
  }
}

.live-top {
  position: relative;
  width: 750rpx;
  height: 422rpx;

  .ad-img {
    width: 750rpx;
    height: 422rpx;
  }

  .content {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    flex-flow: column nowrap;
    justify-content: center;
    width: 750rpx;
    height: 422rpx;
    background: rgba(0, 0, 0, 0.6);

    .distance {
      font-size: 32rpx;
      font-weight: 700;
      line-height: 44.8rpx;
      margin-bottom: 14rpx;
      color: rgba(255, 255, 255, 1);
    }

    .receive-btn {
      font-size: 28rpx;
      font-weight: 700;
      line-height: 64rpx;
      width: 232rpx;
      height: 64rpx;
      margin-top: 18rpx;
      text-align: center;
      color: rgba(48, 93, 218, 1);
      border-radius: 200rpx;
      background: rgba(255, 255, 255, 1);
    }
  }
}

.countdown-time {
  :deep(.uni-countdown__number) {
    font-size: 28rpx !important;
    font-weight: 700;
    line-height: 56rpx !important;
    height: 56rpx;
  }

  :deep(.uni-countdown__splitor) {
    font-size: 28rpx !important;
    font-weight: 700;
  }
}

.card {
  line-height: 56rpx;
  width: 44rpx;
  text-align: center;
  color: rgba(48, 93, 218, 1);
  border-radius: 8rpx;
  background: rgba(255, 255, 255, 1);
}
</style>
