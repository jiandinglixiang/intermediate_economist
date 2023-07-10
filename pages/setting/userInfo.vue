<script setup>
import { GET_USER_INFO } from "@/api"
import { userInfo } from "@/pinia/user"
import { httpRequest } from "@/utils/http"
import { ref } from "vue"

const refPopup = ref()
const storeUserInfo = userInfo()
const userName = ref("")

async function submit() {
  if (!userName.value) {
    uni.showToast({ title: "请输入昵称", icon: "none" })
    return
  }
  if (!/^[A-Za-z0-9\u4e00-\u9fa5]{1,20}$/.test(userName.value)) {
    uni.showToast({ title: "昵称由不超过20个字符的数字、字母、文字组成", icon: "none" })
    return
  }
  await httpRequest(GET_USER_INFO, "POST", {})
  await storeUserInfo.getUserInfo()
  refPopup.value.close()
  uni.showToast({ title: "修改成功", icon: "none" })
}
</script>

<template>
  <view class="user-avatar">
    <image :src="storeUserInfo.avatar"></image>
  </view>
  <view class="list-item line-bottom">
    <!--    <view class="list-item line-bottom" @click="refPopup.open()">-->
    <text class="name">昵称</text>
    <text class="sub-name">{{ storeUserInfo.phone }}</text>
    <image class="arrows" src="/static/user/arrows@2x.png"></image>
  </view>
  <view class="list-item">
    <text class="name">手机号</text>
    <text class="sub-name">{{ storeUserInfo.originphone }}</text>
    <image class="arrows" src="/static/user/arrows@2x.png"></image>
  </view>
  <uni-popup ref="refPopup" :is-mask-click="false">
    <view class="change-popup">
      <text class="change-popup-title">修改昵称</text>
      <uni-easyinput
        v-model="userName"
        :inputBorder="false"
        :styles="{ backgroundColor: 'rgba(247, 247, 247, 1)' }"
        class="name-input"
        placeholder="请输入昵称"
        trim
      ></uni-easyinput>
      <view class="warn">
        <image src="/static/setting/Icon_my_remind@2x.png"></image>
        <text>昵称由不超过20个字符的数字、字母、文字组成</text>
      </view>
      <view class="btn-group">
        <button class="cancel" hover-class="none" @click="refPopup.close()">取消</button>
        <button class="confirm" @click="submit">确认修改</button>
      </view>
    </view>
  </uni-popup>
</template>

<style lang="scss" scoped>
page {
  background: rgba(249, 249, 249, 1);
}

.user-avatar {
  display: flex;
  align-items: center;
  align-self: center;
  flex-flow: row nowrap;
  justify-content: center;
  height: 236rpx;
  border: 4rpx solid rgba(255, 255, 255, 1);

  image {
    overflow: hidden;
    width: 156rpx;
    height: 156rpx;
    border-radius: 50%;
  }
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

.change-popup {
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  box-sizing: border-box;
  width: 648rpx;
  padding: 48rpx 32rpx 32rpx 32rpx;
  border-radius: 32rpx;
  background: rgba(255, 255, 255, 1);

  .change-popup-title {
    font-size: 36rpx;
    font-weight: 500;
    line-height: 50.4rpx;
    margin-bottom: 32rpx;
    color: rgba(51, 51, 51, 1);
  }

  .name-input {
    overflow: hidden;
    height: 88rpx;
    border-radius: 8rpx;

    :deep(.uni-easyinput__content-input) {
      height: 88rpx;
    }
  }

  .warn {
    font-size: 24rpx;
    font-weight: 400;
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
    margin-top: 28rpx;
    margin-bottom: 48rpx;
    color: rgba(153, 153, 153, 1);

    image {
      width: 28rpx;
      height: 28rpx;
      margin-right: 16rpx;
    }
  }

  .btn-group {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    flex-flow: row nowrap;
    justify-content: space-around;
    width: 100%;

    button {
      font-size: 32rpx;
      line-height: 88rpx;
      width: 252rpx;
      height: 88rpx;
      border-radius: 200rpx;
    }
  }

  .cancel {
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    border: 1rpx solid rgba(151, 151, 151, 1);
    background-color: #ffffff;
  }

  .confirm {
    font-weight: 700;
    color: rgba(255, 255, 255, 1);
    background: linear-gradient(135deg, rgba(97, 139, 255, 1) 0%, rgba(48, 93, 217, 1) 100%);
  }
}
</style>
