<template>
  <view class="container">
    <view class="tips">
      <text>
        我已阅读并同意
        <text @click="openURL({ value: USER_AGREEMENT_URL })" style="color: #5200F5">
          《用户服务协议》
        </text>
        与
        <text @click="openURL({ value: PRIVACY_URL })" style="color: #5200F5">
          《隐私保护政策》
        </text>
      </text>
    </view>
    <view class="btn-group">
      <button class="quit" @click="emits('action', 'close')">退出</button>
      <button class="agree" @click="emits('action', 'agree')">同意</button>
    </view>
  </view>
</template>
<script setup>
import { openURL } from "@/utils/func"
import { PRIVACY_URL, USER_AGREEMENT_URL } from "@/utils/consts"

const emits = defineEmits(["action"])
</script>

<style lang="scss" scoped>
.container {
  overflow: hidden;
  width: 648rpx;
  border-radius: 32rpx;
  background: #ffffff;
}

.tips {
  font-size: 32rpx;
  font-weight: 500;
  line-height: 44.8rpx;
  padding: 76rpx 70rpx 0;
  text-align: center;
}

.btn-group {
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  justify-content: space-between;
  height: 152rpx;

  button {
    font-size: 32rpx;
    line-height: 88rpx;
    width: 252rpx;
    height: 88rpx;
    border-radius: 200rpx;
  }

  .quit {
    color: #999999;
    border: 1rpx solid #979797;
    background-color: #ffffff;
  }

  .agree {
    font-weight: 700;
    color: #ffffff;
    border: none;
    background: #5200F5;
  }
}
</style>
