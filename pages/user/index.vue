<script setup>
import { pushBehavior } from "@/utils/behavior"
import { NoticeStatus } from "@/pinia/notice"
import { userInfo } from "@/pinia/user"
import { USER_TOKEN_DATA } from "@/utils/consts"
import { openURL } from "@/utils/func"
import { onLoad } from "@dcloudio/uni-app"
import { ref } from "vue"

const popup = ref()
const noLogin = ref(!uni.getStorageSync(USER_TOKEN_DATA)?.token)

const storeUserInfo = userInfo()
const storeNotice = NoticeStatus()

onLoad(async () => {
  noLogin.value = !(await storeUserInfo.getUserInfo())
})

function handleSign() {
  !noLogin.value && storeUserInfo.$patch({ signin: true })
}

function navigateTo(url, pass) {
  if (!noLogin.value || pass) {
    uni.navigateTo({ url })
  } else {
    uni.reLaunch({ url: "/pages/login/index" })
  }
}

function buryThePoint(des) {
  pushBehavior({
    action: `点击我的内按钮\t710\t${des}`,
    onceDay: true,
    replaceValue: "",
    isCallback: false
  })
}
</script>
<template>
  <view class="top-container">
    <view :class="storeUserInfo.signin && 'signined'" class="signin" @click="handleSign">
      <image src="/static/user/signin1.png"></image>
      <text>{{ storeUserInfo.signin ? "已签到" : "签到" }}</text>
    </view>
    <view class="setting-btn" @click="navigateTo('/pages/setting/index', true)" />

    <view class="user-card">
      <image
        :src="storeUserInfo.avatar || '/static/user/no-login@2x.png'"
        class="head-portrait"
      ></image>
      <view v-if="!noLogin" class="user-info">
        <view class="name" @click="navigateTo('/pages/setting/userInfo')">
          <text>{{ storeUserInfo.phone }}</text>
          <!--<view class="leve">Lv7</view>-->
        </view>
        <text class="user-work-title">中级经济师备考</text>
      </view>
      <view v-else class="login-text" @click="navigateTo('/pages/login/index', true)">
        登录/注册
      </view>
      <view
        class="user-teacher"
        @click="
          openURL(storeNotice.miniApp.find((i) => i.id === 8)), buryThePoint('用户添加CPA助教老师')
        "
      >
        <image class="teacher-bg" src="/static/user/user-teacher.png"></image>
        <text>专属助教</text>
      </view>
    </view>

    <view class="diamond-region">
      <view class="top-box" @click="navigateTo('/pages/setting/userInfo')">
        <text>偷偷告诉你，完善资料后，方便与老师沟通哦~</text>
        <image src="/static/user/arrows@2x.png"></image>
      </view>
      <view class="bottom-box">
        <!--        <view class="region-item" @click="navigateTo('/pages/setting/favorites')">-->
        <!--          <image src="/static/user/collection-item@2x.png"></image>-->
        <!--          <text>收藏夹</text>-->
        <!--        </view>-->
        <!--        <view class="region-item disable">-->
        <!--          <image src="/static/user/error-question@2x.png"></image>-->
        <!--          <text>错题集</text>-->
        <!--        </view>-->
        <!--        <view class="region-item disable">-->
        <!--          <image src="/static/user/question-history@2x.png.png"></image>-->
        <!--          <text>做题历史</text>-->
        <!--        </view>-->
        <!--        <view class="region-item disable">-->
        <!--          <image src="/static/user/my-course@2x.png"></image>-->
        <!--          <text>我的课程</text>-->
        <!--        </view>-->
        <view class="region-item" @click="openURL(storeNotice.onlineConsultation[0])">
          <image src="/static/user/help-center@2x.png"></image>
          <text>帮助中心</text>
        </view>
        <view
          class="region-item"
          @click="navigateTo('/pages/pdf/pdfList', true), buryThePoint('用户领取CPA考试资料')"
        >
          <image src="/static/user/data-get@2x.png"></image>
          <text>资料领取</text>
        </view>
        <view
          class="region-item"
          @click="
            openURL(storeNotice.miniApp.find((i) => i.id === 8)), buryThePoint('用户添加CPA备考群')
          "
        >
          <image src="/static/user/exam-preparation-group@2x.png"></image>
          <text>备考群</text>
        </view>
        <!--        <view class="region-item">-->
        <!--          <image src="/static/user/recommend-to-friends@2x.png"></image>-->
        <!--          <text>推荐给好友</text>-->
        <!--        </view>-->
      </view>
    </view>

    <view
      class="list-item"
      @click="
        openURL(storeNotice.miniApp.find((i) => i.id === 8)), buryThePoint('用户领取CPA备考规划')
      "
    >
      <image class="left-icon" src="/static/user/goal-planning@2x.png"></image>
      <text class="name">备考规划</text>
      <image class="arrows" src="/static/user/arrows@2x.png"></image>
    </view>
    <view
      class="list-item"
      @click="openURL(storeNotice.onlineConsultation[0]), buryThePoint('用户咨询CPA考试信息')"
    >
      <image class="left-icon" src="/static/user/consultation-line@2x.png"></image>
      <text class="name">在线咨询</text>
      <text class="sub-name">24小时在线</text>
      <image class="arrows" src="/static/user/arrows@2x.png"></image>
    </view>
    <view class="list-item" @click="openURL(storeNotice.miniApp.find((i) => i.id === 8))">
      <image class="left-icon" src="/static/user/give-us-a-good-review@2x.png"></image>
      <text class="name">给我们好评</text>
      <image class="arrows" src="/static/user/arrows@2x.png"></image>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.disable {
  filter: grayscale(100%);
}

.top-container {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  padding-top: calc(120rpx + var(--status-bar-height));
  background: url("/static/user/bg@2x.png") no-repeat left top;
  background-size: 100% auto;
}

.signin {
  position: absolute;
  top: calc(16rpx + var(--status-bar-height));
  left: 32rpx;
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  justify-content: center;
  width: 152rpx;
  height: 56rpx;
  border-radius: 34rpx;
  background: linear-gradient(130.38deg, #ffc75c 0%, #ff962f 100%);

  text {
    font-size: 24rpx;
    font-weight: 500;
    line-height: 24rpx;
    color: #ffffff;
  }

  image {
    width: 36rpx;
    height: 38rpx;
    margin-right: 8rpx;
  }

  &.signined {
    background: rgba(207, 207, 207, 1);
  }
}

.setting-btn {
  position: absolute;
  top: calc(16rpx + var(--status-bar-height));
  right: 32rpx;
  width: 56rpx;
  height: 56rpx;
  background: url("/static/user/setting-btn.png") no-repeat center center;
  background-size: 44rpx auto;
}

.user-card {
  display: flex;
  align-items: center;
  flex: 1;
  flex-flow: row nowrap;
  height: 252rpx;
  margin-bottom: 48rpx;
  padding-left: 32rpx;

  .head-portrait {
    overflow: hidden;
    flex: 0 0 auto;
    width: 156rpx;
    height: 156rpx;
    margin-right: 16rpx;
    border-radius: 50%;
    //background: url("/static/user/no-login@2x.png") no-repeat center center;
    //background-size: 156rpx 156rpx;
  }

  .login-text {
    font-size: 36rpx;
    font-weight: 500;
    line-height: 36rpx;
    flex: 1 1 auto;
    color: rgba(51, 51, 51, 1);
  }

  .user-info {
    flex: 1 1 auto;

    .name {
      font-size: 36rpx;
      font-weight: 500;
      line-height: 36rpx;
      display: flex;
      flex-flow: row nowrap;
      width: 100%;
      margin-bottom: 16rpx;
      color: rgba(51, 51, 51, 1);
    }

    .leve {
      font-size: 22rpx;
      font-weight: 500;
      line-height: 24rpx;
      width: 64rpx;
      height: 28rpx;
      margin-left: 8rpx;
      text-align: center;
      color: rgba(255, 255, 255, 1);
      background: url("/static/user/level-bg.png") no-repeat left top;
      background-size: 100%;
    }

    .user-work-title {
      font-size: 24rpx;
      font-weight: 400;
      line-height: 24rpx;
      padding: 12rpx 16rpx;
      color: rgba(102, 102, 102, 1);
      background: rgba(255, 255, 255, 1);
    }
  }

  .user-teacher {
    font-size: 24rpx;
    font-weight: 500;
    line-height: 24rpx;
    display: flex;
    overflow: hidden;
    align-items: center;
    flex: 0 0 auto;
    flex-flow: row nowrap;
    justify-content: flex-end;
    width: 156rpx;
    height: 64rpx;
    padding-right: 16rpx;
    color: rgba(247, 228, 194, 1);
    border-radius: 32rpx 0rpx 0rpx 32rpx;
    background: linear-gradient(180deg, rgba(98, 98, 98, 1) 0%, rgba(28, 28, 28, 1) 100%);

    .teacher-bg {
      width: 32rpx;
      height: 38rpx;
      margin-right: 8rpx;
    }
  }
}

.diamond-region {
  margin: 0 32rpx 32rpx;

  .top-box {
    font-size: 24rpx;
    font-weight: 400;
    line-height: 24rpx;
    display: flex;
    overflow: hidden;
    align-items: center;
    flex: 1 1 100%;
    flex-flow: row nowrap;
    justify-content: space-between;
    height: 72rpx;
    padding: 0 20rpx;
    border-radius: 16rpx 16rpx 0rpx 0rpx;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0rpx 4rpx 32rpx 0rpx rgba(0, 0, 0, 0.06);

    image {
      width: 14rpx;
      height: 20rpx;
    }
  }

  .bottom-box {
    display: flex;
    flex-flow: row wrap;
    padding-bottom: 32rpx;
    border-radius: 0rpx 0rpx 16rpx 16rpx;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0rpx 4rpx 32rpx 0rpx rgba(0, 0, 0, 0.06);
  }

  .region-item {
    font-size: 24rpx;
    font-weight: 400;
    line-height: 24rpx;
    display: flex;
    align-items: center;
    flex: 1 1 25%;
    flex-flow: column nowrap;
    justify-content: flex-end;
    height: 128rpx;
    color: rgba(102, 102, 102, 1);

    image {
      width: 64rpx;
      height: 64rpx;
      margin-bottom: 24rpx;
    }
  }
}

.list-item {
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  height: 112rpx;
  margin: 0 32rpx;
  background: #ffffff;
  box-shadow: inset 0rpx -2rpx 0rpx 0rpx rgba(241, 241, 241, 1);

  .name {
    font-size: 28rpx;
    font-weight: 400;
    line-height: 32rpx;
    flex: 1 1 auto;
    color: rgba(51, 51, 51, 1);
  }

  .sub-name {
    font-size: 28rpx;
    font-weight: 400;
    line-height: 32rpx;
    flex: 0 0 auto;
    color: rgba(48, 93, 218, 1);
  }

  .left-icon {
    flex: 0 0 auto;
    width: 36rpx;
    height: 36rpx;
    margin: 0 18rpx;
  }

  .arrows {
    flex: 0 0 auto;
    width: 14rpx;
    height: 20rpx;
    margin-left: 16rpx;
  }

  image {
    width: 32rpx;
    height: 32rpx;
  }
}
</style>
