<script setup>
import { userInfo } from "@/pinia/user"
import { PRIVACY_URL, USER_AGREEMENT_URL, USER_TOKEN_DATA } from "@/utils/consts"
import { getSystemInfoPromise, openURL } from "@/utils/func"
import { onLoad } from "@dcloudio/uni-app"
import { ref } from "vue"
import { NoticeStatus } from "@/pinia/notice"

const appVersion = ref("")
const isLogin = ref(!!uni.getStorageSync(USER_TOKEN_DATA)?.token)
const storeUserInfo = userInfo()
const storeNotice = NoticeStatus()

onLoad(async () => {
  isLogin.value = !!(await storeUserInfo.getUserInfo())
  const system = await getSystemInfoPromise()
  appVersion.value = system.appVersion
})

function loginOut() {
  userInfo().loginOutClean()
  uni.reLaunch({ url: "/pages/login/index" })
}
</script>

<template>
  <view class="mt16"></view>
  <navigator hover-class="none" url="/pages/setting/feedback">
    <view class="list-item line-bottom">
      <text class="name">意见反馈</text>
      <image class="arrows" src="/static/user/arrows@2x.png"></image>
    </view>
  </navigator>

  <view class="list-item" @click="openURL(storeNotice.miniApp.find((i) => i.id === 8))">
    <text class="name">给我们点个赞</text>
    <image class="arrows" src="/static/user/arrows@2x.png"></image>
  </view>

  <view class="mt16"></view>
  <navigator v-if="isLogin" hover-class="none" url="/pages/setting/cancelAccount">
    <view class="list-item line-bottom">
      <text class="name">注销账户</text>
      <image class="arrows" src="/static/user/arrows@2x.png"></image>
    </view>
  </navigator>
  <view class="list-item">
    <text class="name">版本号</text>
    <text class="sub-name">v{{ appVersion }}</text>
  </view>

  <view class="login-out">
    <view class="privacy">
      <text class="highlight" @click="openURL({ value: USER_AGREEMENT_URL })">
        《高顿用户协议》
      </text>
      与
      <text class="highlight" @click="openURL({ value: PRIVACY_URL })">《隐私政策》</text>
    </view>
    <button v-if="isLogin" @click="loginOut">退出登录</button>
  </view>
</template>

<style lang="scss" scoped>
page {
  background-color: #f9f9f9;
}

.mt16 {
  height: 16rpx;
}

.line-bottom {
  &:after {
    position: absolute;
    right: 32rpx;
    bottom: 0;
    left: 32rpx;
    height: 2rpx;
    content: "";
    background-color: rgba(241, 241, 241, 1);
  }
}

.list-item {
  position: relative;
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  height: 112rpx;
  padding: 0 32rpx;
  background: #ffffff;

  .name {
    font-size: 28rpx;
    font-weight: 400;
    line-height: 32rpx;
    flex: 1 1 auto;
    color: rgba(51, 51, 51, 1);
  }

  .sub-name {
    font-size: 24rpx;
    font-weight: 400;
    flex: 0 0 auto;
    color: rgba(153, 153, 153, 1);
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

.login-out {
  position: fixed;
  right: 0;
  bottom: 78rpx;
  left: 0;
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  justify-content: center;

  .privacy {
    font-size: 24rpx;
    font-weight: 400;
    line-height: 33.6rpx;
    margin-bottom: 32rpx;
    white-space: nowrap;
    color: #333333;
  }

  .highlight {
    color: rgba(48, 93, 218, 1);
  }

  button {
    font-size: 28rpx;
    font-weight: 400;
    line-height: 88rpx;
    width: 520rpx;
    height: 88rpx;
    color: rgba(102, 102, 102, 1);
    border: 1rpx solid #cccccc;
    border-radius: 50rpx;
    background: #ffffff;
  }
}
</style>
