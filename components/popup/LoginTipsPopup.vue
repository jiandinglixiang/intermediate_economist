<script setup>
const emits = defineEmits(["action"])
const props = defineProps({
  popupData: {
    type: Object,
    default() {
      return { title: "提示", tips: "", buttonText: "去登录" }
    }
  }
})
</script>
<template>
  <view class="LoginTips-container">
    <text class="title">{{ popupData.title }}</text>
    <view v-if="!popupData.tips.includes('</text>')" class="tips">
      <text>{{ popupData.tips }}</text>
    </view>
    <uv-parse v-else :content="popupData.tips" class="tips tips2"></uv-parse>
    <button class="agree" @click="emits('action', 'btn')">
      {{ popupData.buttonText }}
    </button>
    <image class="close" src="/static/close@2x.png" @click="emits('action', 'close')"></image>
  </view>
</template>

<style lang="scss" scoped>
.LoginTips-container {
  position: relative;
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  width: 536rpx;
  padding: 48rpx 56rpx;
  border-radius: 32rpx;
  background: #ffffff;
}

.title {
  font-size: 36rpx;
  font-weight: 500;
  line-height: 50.4rpx;
  margin-bottom: 32rpx;
  color: rgba(51, 51, 51, 1);
}

.tips {
  font-size: 32rpx;
  font-weight: 400;
  line-height: 44.8rpx;
  margin-bottom: 48rpx;
  text-align: center;
  color: rgba(51, 51, 51, 1);
}

.tips2 {
  text-align: left;
}

.agree {
  font-size: 32rpx;
  font-weight: 700;
  line-height: 88rpx;
  width: 536rpx;
  height: 88rpx;
  color: #ffffff;
  border: none;
  border-radius: 200rpx;
  background: #5200f5;
}

.close {
  position: absolute;
  bottom: -128rpx;
  width: 64rpx;
  height: 64rpx;
}
</style>
