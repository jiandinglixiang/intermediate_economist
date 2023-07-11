<template>
  <view class="container">
    <scroll-view class="scroll-Y" scroll-y>
      <uni-section padding="16px" title="感谢您使用我们的APP！">
        <text selectable>
          感谢您使用我们的APP!!
          我们非常重视您的个人信息和隐私保护。为了更好地保护您的个人权益，在您使用我们的产品前，请务必审慎阅读
          <text @click="openURL({ value: USER_AGREEMENT_URL })" style="color: #5200F5">
            《用户服务协议》
          </text>、<text @click="openURL({ value: PRIVACY_URL })" style="color: #5200F5">
            《隐私保护政策》
          </text>
          的所有条款。您点击“同意”的行为即表示您已经阅读完毕并同意以上协议及隐私政策的全部内容。如您同意以上协议及隐私保护政策的内容，请点击“同意”开始我们的产品服务。
          1.我们会遵循隐私政策收集、使用信息，但不会仅因同意本隐私政策而采用强制捆绑的方式收集信息。
          2.在金浏览是，为保障服务防止崩溃所必需，我们会收集设备信息和日志信息用于APP优化。
          3.向您获取一些您的个人敏感信息。再向我们提供任何属于敏感信息的个人信息前，请您考虑该提供是恰当的并且同意您的个人敏感信息可按照本指引所述的目的和方式进行处理。我们会在得到您的同意后收集使用您的个人信息以实现与业务相关的功能，并允许您对这些个人信息的收集和使用作出不同意的选择，拒绝提供这些信息仅会影响您使用相关功能，不会影响使用本应用。
          如您对本协议政策有任何意见或建议，可通过fawu@gaodun.com方式联系我们
        </text>
      </uni-section>
    </scroll-view>
    <view class="btn-group">
      <button class="quit" @click="emits('action', 'close')">退出App</button>
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

.scroll-Y {
  height: 45vh;
  max-height: 50vh;
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
