<script setup>
import { POST_PHONE_AND_SMS_LOGIN, POST_PHONE_SMS } from "@/api"
import PopupIndex from "@/components/popup/PopupIndex.vue"
import { AGREE_AUTH_POPUP } from "@/components/popup/popupKeyMap"
import { useTimeCount } from "@/hooks/usePageList"
import { AppAuditStatus } from "@/pinia/audit"
import { pushBehavior } from "@/utils/behavior"
import { userInfo } from "@/pinia/user"
import { PRIVACY_URL, USER_AGREEMENT_URL, USER_TOKEN_DATA } from "@/utils/consts"
import { config, httpRequest } from "@/utils/http"
import { onLoad } from "@dcloudio/uni-app"
import { ref } from "vue"
import univerify from "./univerify.js"
import { openURL } from "@/utils/func"

const storeUserInfo = userInfo()
const audit = AppAuditStatus()
const showPage = ref(!audit.auditStatusBoolean)
const agreePopup = ref() // 隐私弹窗
const agreeCheck = ref(false)
const formData = ref({
  loading: false,
  phone: "",
  code: "",
  tk: ""
})
//#ifndef APP-PLUS
showPage.value = true
//#endif
onLoad(async () => {
  storeUserInfo.loginOutClean()
  //#ifdef APP-PLUS
  if (audit.auditStatusBoolean) {
    showPage.value = true
  } else {
    // 非审核状态 打开一键登录
    await univerify(
      (data) => {
        loginSave(data)
        console.log(data)
      },
      (e) => {
        showPage.value = true
        console.log(e)
      }
    )
  }
  //#endif
})

const { time, start } = useTimeCount(60)

async function countdownStart() {
  if (time.value !== 60) {
    return
  }
  if (!validate(true)) {
    return
  }
  if (!agreeCheck.value) {
    agreePopup.value.open()
    return
  }
  start()
  const res = await httpRequest(POST_PHONE_SMS, "POST", {
    phoneSecret: formData.value.phone,
    areacode: 86
  })
  console.log(res)
  formData.value.tk = res.data.tk
}

async function submitForm() {
  try {
    if (!validate()) {
      return
    }
    if (!agreeCheck.value) {
      agreePopup.value.open()
      return
    }
    formData.value.loading = true
    const res = await httpRequest(POST_PHONE_AND_SMS_LOGIN, "POST", {
      areacode: 86,
      phoneSecret: formData.value.phone,
      pcode: formData.value.code,
      tk: formData.value.tk
    })
    if (!res.data) {
      throw res
    }
    loginSave(res.data)
    console.log(res, "res")
  } catch (err) {
    console.log(err)
    let title = err?.info ?? "登录错误"
    if (err?.code === "300004") {
      title = "验证码错误 请重新输入"
    } else if (err?.code === "300000") {
      title = "请重新获取验证码"
    }
    uni.showToast({ title, icon: "none" })
  } finally {
    formData.value.loading = false
  }
}

function loginSave(data) {
  config.header.token = data.token
  uni.setStorageSync(USER_TOKEN_DATA, data)
  storeUserInfo.getUserInfo()
  pushBehavior({
    action: "登录\t710\t用户登录 {AP名称} APP\n",
    replaceValue: uni.getSystemInfoSync().appName,
    onceDay: true,
    isCallback: false
  })
  uni.reLaunch({ url: "/pages/home/index" })
}

function handleAction(action) {
  console.log(action)
  if (action === "agree") {
    agreeCheck.value = true
    agreePopup.value.close()
  }
}

function clearPhone() {
  formData.value.phone = ""
}

async function navigateBack() {
  const pages = getCurrentPages()
  if (pages.length === 1) {
    // #ifdef APP-PLUS
    if (audit.auditStatusBoolean) {
      uni.reLaunch({ url: "/pages/home/index" })
    } else {
      // 非审核状态 打开一键登录
      await univerify((data) => {
        loginSave(data)
        console.log(data)
      })
    }
    // #endif
    // #ifndef APP-PLUS
    uni.reLaunch({ url: "/" })
    // #endif
  } else {
    uni.navigateBack()
  }
}

function validate(phone) {
  const okPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(
    formData.value.phone
  )
  if (!okPhone) {
    uni.showToast({ title: "手机号格式不正确", icon: "none" })
    return false
  }
  if (phone) {
    return okPhone
  }
  if (/^\d{6}$/.test(formData.value.code)) {
    return true
  }
  uni.showToast({ title: "验证码格式不正确", icon: "none" })

  return false
}
</script>
<template>
  <view v-if="showPage" class="container">
    <view class="navbar-content_view" @click="navigateBack">
      <uni-icons size="20" type="back" />
    </view>
    <view class="input-item">
      <image src="/static/login/Icon_phone@2x.png"></image>
      <input
        v-model="formData.phone"
        class="uni-input"
        maxlength="11"
        placeholder="请输入手机号"
        type="number"
      />
      <uni-icons
        v-show="formData.phone"
        class="icon"
        color="#D8D8D8"
        size="28"
        type="clear"
        @click="clearPhone"
      ></uni-icons>
    </view>
    <view class="input-item">
      <image src="/static/login/Icon_verification@2x.png"></image>
      <input
        v-model="formData.code"
        class="uni-input"
        maxlength="6"
        placeholder="请输入验证码"
        type="number"
      />
      <text class="code-sms" @click="countdownStart">{{ time === 60 ? "获取验证码" : time }}</text>
    </view>

    <button :disabled="formData.loading" class="submit-btn" hover-class="none" @click="submitForm">
      快速登录
    </button>
    <view class="auth-text">
      <uni-icons
        :color="agreeCheck ? '#36C26E' : '#999'"
        class="check-icon"
        size="28"
        type="checkbox-filled"
        @click="agreeCheck = !agreeCheck"
      ></uni-icons>
      <text>
        我已阅读并同意
        <text class="highlight" @click="openURL({ value: USER_AGREEMENT_URL })">
          《用户服务协议》
        </text>
        与
        <text class="highlight" @click="openURL({ value: PRIVACY_URL })">《隐私政策》</text>
      </text>
    </view>
    <navigator
      v-if="audit.auditStatusBoolean"
      hover-class="none"
      open-type="reLaunch"
      url="/pages/home/index"
    >
      <button class="btn-tourist" hover-class="none" plain>游客模式</button>
    </navigator>
  </view>
  <popup-index ref="agreePopup" :popup-key="AGREE_AUTH_POPUP" @action="handleAction"></popup-index>
</template>

<style lang="scss" scoped>
.navbar-content_view {
  line-height: 44px;
  position: fixed;
  z-index: 2;
  top: var(--status-bar-height);
  left: 0;
  width: 34px;
  height: 44px;
  padding-left: 10px;
}

.container {
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  min-height: calc(100vh - 600rpx);
  padding-top: 600rpx;
  background-image: url("/static/login/background_text@2x.png"),
    url("/static/login/material@2x.png"), url("/static/login/background@2x.png");
  background-repeat: no-repeat;
  background-position: 60rpx 364rpx, 404rpx 320rpx, left top;
  background-size: 352rpx 120rpx, 297rpx 210rpx, 100% auto;
}

.auth-text {
  font-size: 24rpx;
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  margin-top: 36rpx;
  color: #999999;

  .check-icon {
    padding: 0 20rpx;
  }

  .highlight {
    color: #305dda;
  }
}

.input-item {
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  width: 570rpx;
  height: 100rpx;
  margin-bottom: 16rpx;
  padding: 0 30rpx;
  border: 1rpx solid #cccccc;
  border-radius: 200rpx;

  image {
    flex: 0 0 40rpx;
    width: 40rpx;
    height: 48rpx;
  }

  .uni-input {
    font-size: 28rpx;
    font-weight: 500;
    line-height: 80rpx;
    flex: 1 1 auto;
    height: 80rpx;
    margin: 0 24rpx;
    color: #333333;
  }

  .uni-input::placeholder {
    color: #999999;
  }

  .icon {
    flex: 0 0 auto;
  }

  .code-sms {
    font-size: 28rpx;
    font-weight: 500;
    flex: 0 0 auto;
    color: #305dda;
  }
}

.submit-btn {
  font-size: 32rpx;
  font-weight: 700;
  line-height: 88rpx;
  width: 520rpx;
  height: 88rpx;
  margin-top: 40rpx;
  text-align: center;
  color: #ffffff;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #618bff 0%, #305dd9 100%);
}

.btn-tourist {
  font-size: 28rpx;
  line-height: 36rpx;
  position: fixed;
  bottom: 40rpx;
  left: 50%;
  transform: translateX(-50%);
  color: #333333;
  border: none;
}
</style>
