<script setup>
import { POST_CLIENT_USER_FEEDBACK } from "@/api"
import { httpRequest } from "@/utils/http"
import { ref } from "vue"

const checkData = [
  `功能异常:功能故障或者不可用`,
  `产品建议:功能用得不爽想提建议`,
  `安全问题:密码、数据、隐私等`,
  `其他问题`
]
const selected = ref(-1)
const content = ref("")
const loading = ref(false)

function handleSelected(index) {
  selected.value = index
}

async function handleSubmit() {
  if (selected.value === -1) {
    uni.showToast({ title: "请选择反馈点", icon: "none" })
    return
  }
  if (content.value.length < 15) {
    uni.showToast({ title: "问题描述低于15个字", icon: "none" })
    return
  }
  loading.value = true
  await httpRequest(POST_CLIENT_USER_FEEDBACK, "POST", {
    content: content.value,
    title: checkData[selected.value]
  }).catch((err) => {
    if (err.noNetwork) {
      uni.showToast({ title: "网络开小差了～", icon: "none" })
    } else {
      uni.showToast({ title: "提交失败", icon: "none" })
    }
  })
  loading.value = false
  uni.showToast({ title: "提交成功", icon: "none" })
  content.value = ""
  selected.value = -1
}
</script>

<template>
  <view class="feedback-container">
    <view class="title">(必选)请选择您想反馈的问题点</view>
    <view v-for="(text, index) in checkData" class="checkbox-custom" @click="handleSelected(index)">
      <view :class="selected === index ? 'selected' : 'unselected'" />
      <text class="name">{{ text }}</text>
    </view>
    <uni-easyinput v-model="content" placeholder="请输入15字以上描述" type="textarea" />
    <!--    <view class="file-picker">
      <uni-file-picker limit="3" title="请提供问题相关截图或照片" />
    </view>-->
    <button :loading="loading" class="btn-submit" @click="handleSubmit">提交</button>
  </view>
</template>

<style lang="scss" scoped>
.feedback-container {
  padding: 50rpx 32rpx 0;

  .title {
    font-size: 32rpx;
    font-weight: 500;
    line-height: 56rpx;
    color: rgba(51, 51, 51, 1);
  }

  .file-picker {
    height: 120rpx;
  }

  .checkbox-custom {
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
    height: 80rpx;

    .name {
      font-size: 28rpx;
      font-weight: 400;
      line-height: 50rpx;
      flex: 1 1 auto;
      margin-left: 16rpx;
      color: rgba(51, 51, 51, 1);
    }

    .unselected {
      width: 48rpx;
      height: 48rpx;
      background: url("/static/setting/unselected.png") no-repeat left top;
      background-size: 100% auto;
    }

    .selected {
      width: 48rpx;
      height: 48rpx;
      background: url("/static/setting/selected.png") no-repeat left top;
      background-size: 100% auto;
    }
  }

  .btn-submit {
    font-size: 32rpx;
    font-weight: 500;
    line-height: 88rpx;
    position: fixed;
    bottom: 78rpx;
    left: 50%;
    width: 520rpx;
    height: 88rpx;
    transform: translateX(-50%);
    color: rgba(255, 255, 255, 1);
    border: none;
    border-radius: 44rpx;
    background: linear-gradient(135deg, #618bff 0%, #305dd9 100%);
  }
}
</style>
